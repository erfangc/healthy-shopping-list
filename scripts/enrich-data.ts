import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_FILE = path.resolve(__dirname, "../weee-healthy-groceries.json");
const OUTPUT_FILE = path.resolve(__dirname, "../src/data/enriched-groceries.json");
const DELAY_MS = 300;
const BASE_URL = "https://www.sayweee.com/zh/product";

interface RawItem {
  product_id: string;
  slug: string;
  name: string;
  price: string;
  unit_price: string | null;
  health_note: string;
}

interface EnrichedItem extends RawItem {
  name_zh: string | null;
  image_url: string | null;
  product_url: string;
}

interface RawCategory {
  health_rationale: string;
  items: RawItem[];
}

interface RawData {
  metadata: Record<string, string>;
  categories: Record<string, RawCategory>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractFromPage(
  html: string,
  slug: string,
  productId: string
): { imageUrl: string | null; nameZh: string | null } {
  const $ = cheerio.load(html);
  let imageUrl: string | null = null;
  let nameZh: string | null = null;

  // Try JSON-LD first
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const jsonText = $(el).text();
      const data = JSON.parse(jsonText);

      // Handle both single object and array of objects
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item["@type"] === "Product" || item["@type"] === "IndividualProduct") {
          if (!imageUrl && item.image) {
            const img = Array.isArray(item.image) ? item.image[0] : item.image;
            if (typeof img === "string") {
              imageUrl = img;
            } else if (img?.url) {
              imageUrl = img.url;
            }
          }
          if (!nameZh && item.name) {
            nameZh = item.name;
          }
        }
      }
    } catch {
      // JSON parse failed, skip
    }
  });

  // Fallback: og:image meta tag
  if (!imageUrl) {
    const ogImage = $('meta[property="og:image"]').attr("content");
    if (ogImage) imageUrl = ogImage;
  }

  // Fallback: first product image in common selectors
  if (!imageUrl) {
    const firstImg = $("img[src*='weeecdn']").first().attr("src");
    if (firstImg) imageUrl = firstImg;
  }

  // Fallback for Chinese name: og:title or <title>
  if (!nameZh) {
    const ogTitle = $('meta[property="og:title"]').attr("content");
    if (ogTitle) {
      // Often format: "Chinese Name - English Name | Weee!"
      const parts = ogTitle.split(/\s*[-|]\s*/);
      nameZh = parts[0].trim() || null;
    }
  }
  if (!nameZh) {
    const title = $("title").text();
    if (title) {
      const parts = title.split(/\s*[-|]\s*/);
      nameZh = parts[0].trim() || null;
    }
  }

  return { imageUrl, nameZh };
}

async function fetchProduct(
  slug: string,
  productId: string
): Promise<{ imageUrl: string | null; nameZh: string | null }> {
  const url = `${BASE_URL}/${slug}/${productId}`;
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      },
    });
    if (!response.ok) {
      console.error(`  HTTP ${response.status} for ${url}`);
      return { imageUrl: null, nameZh: null };
    }
    const html = await response.text();
    return extractFromPage(html, slug, productId);
  } catch (err) {
    console.error(`  Fetch error for ${url}:`, (err as Error).message);
    return { imageUrl: null, nameZh: null };
  }
}

async function main() {
  const force = process.argv.includes("--force");
  const rawData: RawData = JSON.parse(fs.readFileSync(SOURCE_FILE, "utf-8"));

  // Load existing enriched data if it exists (for incremental updates)
  let existingItems: Map<string, EnrichedItem> = new Map();
  if (!force && fs.existsSync(OUTPUT_FILE)) {
    try {
      const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"));
      for (const cat of Object.values(existing.categories)) {
        for (const item of (cat as any).items) {
          existingItems.set(item.product_id, item);
        }
      }
      console.log(`Loaded ${existingItems.size} existing enriched items`);
    } catch {
      console.log("Could not load existing enriched data, starting fresh");
    }
  }

  const enrichedCategories: Record<string, { health_rationale: string; items: EnrichedItem[] }> = {};
  let scraped = 0;
  let skipped = 0;
  let failed = 0;
  let synthetic = 0;

  for (const [catKey, category] of Object.entries(rawData.categories)) {
    const enrichedItems: EnrichedItem[] = [];

    for (const item of category.items) {
      const isNumeric = /^\d+$/.test(item.product_id);
      const productUrl = isNumeric
        ? `${BASE_URL}/${item.slug}/${item.product_id}`
        : `https://www.sayweee.com/zh/search?w=${encodeURIComponent(item.name)}`;

      // Check if already enriched
      const existing = existingItems.get(item.product_id);
      if (existing && existing.image_url && existing.name_zh) {
        enrichedItems.push({
          ...item,
          name_zh: existing.name_zh,
          image_url: existing.image_url,
          product_url: existing.product_url || productUrl,
        });
        skipped++;
        continue;
      }

      if (!isNumeric) {
        // Synthetic ID - can't scrape directly
        console.log(`  [SYNTHETIC] ${item.product_id}: ${item.name} - needs manual lookup`);
        enrichedItems.push({
          ...item,
          name_zh: existing?.name_zh || null,
          image_url: existing?.image_url || null,
          product_url: productUrl,
        });
        synthetic++;
        continue;
      }

      // Scrape the product page
      console.log(`  Scraping ${item.name} (${item.product_id})...`);
      const { imageUrl, nameZh } = await fetchProduct(item.slug, item.product_id);

      if (!imageUrl && !nameZh) {
        failed++;
        console.log(`    FAILED - no data extracted`);
      } else {
        scraped++;
        console.log(`    OK - image: ${imageUrl ? "yes" : "no"}, name_zh: ${nameZh || "no"}`);
      }

      enrichedItems.push({
        ...item,
        name_zh: nameZh,
        image_url: imageUrl,
        product_url: `${BASE_URL}/${item.slug}/${item.product_id}`,
      });

      await sleep(DELAY_MS);
    }

    enrichedCategories[catKey] = {
      health_rationale: category.health_rationale,
      items: enrichedItems,
    };
  }

  const output = {
    metadata: rawData.metadata,
    categories: enrichedCategories,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf-8");

  console.log("\n--- Summary ---");
  console.log(`Scraped: ${scraped}`);
  console.log(`Skipped (already enriched): ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Synthetic (need manual): ${synthetic}`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch(console.error);
