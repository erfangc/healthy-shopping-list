# Add Grocery Item from sayweee.com

Add a product from sayweee.com to `src/data/grocery-items.json` with health evaluation.

**Input:** $ARGUMENTS

The input can be:
- A product URL: `https://www.sayweee.com/zh/products/{slug}/{product_id}` or `https://www.sayweee.com/zh/product/{slug}/{product_id}` (both work)
- A product URL with `/en/` language prefix works too

## Context: Why This Skill Exists

This project maintains a curated grocery list from sayweee.com filtered by health criteria for someone managing **borderline high LDL cholesterol, hypertension, and fatty liver**. Every item needs a `health_note` evaluating it against: low LDL impact, low glycemic index, low sodium, low saturated fat. This skill automates the scrape-evaluate-insert workflow so items are consistently formatted and health-vetted.

## Step 0: Verify Firecrawl

Run `firecrawl --status` to confirm authentication. If it fails, tell the user:
> Firecrawl is not authenticated. Please run `! firecrawl login` to authenticate.

Then stop.

## Step 1: Parse the URL

Extract from the input URL:
- **slug**: the hyphenated product name (e.g., `A-Choy-Sum`)
- **product_id**: the numeric ID at the end (e.g., `95272`)
- **language**: `zh` or `en` from the path (default `zh`)

The URL path pattern is: `/{lang}/product(s)?/{slug}/{product_id}`

Note: sayweee.com uses both `/product/` and `/products/` in URLs — they resolve to the same page. For scraping, use whichever the user provided.

## Step 2: Scrape the Product Page

```bash
firecrawl scrape "{input_url}" --only-main-content --wait-for 3000 -o .firecrawl/sayweee-{slug}.md
```

### Parsing the scraped page

The scraped markdown from a sayweee.com product page has this structure:

```
# {Chinese product name with weight}

{Short Chinese description}

${sale_price}

${original_price}     ← may not exist if not on sale

{X}% off              ← may not exist

${unit_price}/磅 (or /盎司, /oz, etc.)

加入购物车

...

## 相关产品
```

Extract from the content BEFORE `## 相关产品`:
- **name_zh**: the `# heading` text (e.g., `莴笋 2.3-2.6 磅`)
- **description_zh**: the line immediately after the heading
- **price**: the first dollar amount (current/sale price)
- **unit_price**: the price with a unit denominator like `$1.62/磅` — convert to English format `$1.62/lb`
- **image_url**: the first product image URL (look for `img06.weeecdn.com/item/image/` or `img06.weeecdn.com/product/image/` URLs). Use the clean URL without the `!c...` suffix (strip everything from `!` onward)

### Unit conversion for display

Normalize units to English for the `unit_price` field:
- `磅` → `lb`
- `盎司` → `oz`
- `液盎司` → `fl.oz`
- `克` → `g`
- If already in English units, keep as-is

## Step 3: Determine the Category

The item must be placed into one of the 12 existing categories in `grocery-items.json`:

| Category Key | Description |
|---|---|
| `vegetables` | Fresh vegetables, leafy greens, mushrooms, root vegetables |
| `fruits` | Fresh fruits — prefer low GI (berries, citrus) |
| `tofu_and_vegan` | Tofu, soy products, konjac, plant-based proteins |
| `seafood` | Fish, shellfish, seaweed (fresh/frozen) |
| `meat_lean_options` | ONLY lean cuts — tenderloin, skinless poultry |
| `frozen_healthy_picks` | Frozen vegetables, simple frozen preparations |
| `dry_goods` | Grains, beans, legumes, dried mushrooms, noodles |
| `instant_and_prepackaged` | Instant items with acceptable sodium/nutrition |
| `beverages` | Unsweetened teas, plant milks, healthy drinks |
| `snacks` | Seaweed, konjac, nuts/seeds, dried fruits |
| `dairy_and_eggs` | Low-fat dairy, eggs, plant-based milks |
| `seasoning_healthy_picks` | Soy sauce, vinegar, spices, oils, low-sodium options |

Use your judgment based on the product name, description, and type. If uncertain, ask the user.

## Step 4: Health Evaluation

Write a concise `health_note` (1-2 sentences) evaluating the item against the project's health criteria:
- **Low LDL cholesterol impact** — saturated fat, cholesterol, soluble fiber
- **Low glycemic index** — sugar content, fiber, starch type
- **Low sodium** — naturally low or reduced sodium
- **Low saturated fat** — total fat profile
- **Fatty liver friendliness** — anti-inflammatory, liver-supportive nutrients

Follow the tone of existing health notes — specific, actionable, highlighting the most relevant health benefit. Examples:
- `"Leafy green rich in calcium, vitamin K, and antioxidants. Very low calorie."`
- `"Exceptional for heart health. Anthocyanins lower LDL and blood pressure. Low GI."`
- `"Leanest cut of pork - comparable to chicken breast in fat content. Excellent protein."`

**IMPORTANT health gate:** If the product is unhealthy for the target conditions (high sodium processed food, high saturated fat, sugary drinks, etc.), WARN the user and ask for confirmation before adding. This list is curated — not everything on sayweee.com belongs here.

## Step 5: Build the Item JSON Object

Construct the item object matching the existing schema:

```json
{
  "product_id": "{product_id}",
  "slug": "{slug}",
  "name": "{English name with weight/size}",
  "price": "${price}",
  "unit_price": "${unit_price}/{unit}" or null,
  "health_note": "{health evaluation from Step 4}",
  "name_zh": "{Chinese name from page}",
  "image_url": "{clean image URL}",
  "product_url": "https://www.sayweee.com/zh/product/{slug}/{product_id}"
}
```

### English name

Translate `name_zh` to a natural English product name. Follow existing conventions:
- Include the weight/size (convert 磅→lb, 盎司→oz, 克→g, etc.)
- Use standard grocery English (e.g., 莴笋 = "A Choy Sum", 蓝莓 = "Blueberry")
- Check existing items for naming patterns — prefer consistency

### Product URL

Always store the canonical URL format: `https://www.sayweee.com/zh/product/{slug}/{product_id}`

(Use `/product/` singular, `/zh/` language, regardless of what the user pasted.)

## Step 6: Update grocery-items.json

1. Read `src/data/grocery-items.json`
2. Check that the `product_id` doesn't already exist in ANY category (search the whole file). If it does, tell the user and ask before overwriting.
3. Append the new item to the end of the `items` array in the chosen category
4. Write the file back with 2-space indentation

## Step 7: Report

Print a summary:
- Product: {name_zh} / {English name}
- Category: {category}
- Price: {price} ({unit_price})
- Health note: {health_note}
- Confirm the item was added to grocery-items.json

## Important Notes

- Always save scraped files to `.firecrawl/` directory (already in .gitignore)
- Prices on sayweee.com change frequently — the scraped price is a snapshot
- If the scrape fails or returns insufficient data, tell the user and suggest they check if the product URL is valid
- The `product_id` must be a string in the JSON (even though it looks numeric)
- Do NOT add items that clearly violate the health criteria without explicit user approval
