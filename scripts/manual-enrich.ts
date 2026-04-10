import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENRICHED_FILE = path.resolve(__dirname, "../src/data/enriched-groceries.json");

// Manual enrichment data for the 20 synthetic-ID items
const MANUAL_DATA: Record<string, { name_zh: string; image_url?: string }> = {
  // Dry goods
  "5549b": { name_zh: "随园 有机绿豆 16 盎司" },

  // Beverages
  nongfu1: { name_zh: "农夫山泉 东方树叶 茉莉花茶 500 毫升" },

  // Dairy & Eggs
  chobani1: { name_zh: "Chobani 希腊酸奶 无脂原味 32 盎司" },
  stonyfield1: { name_zh: "Stonyfield 有机益生菌全脂纯酸奶 32 盎司" },
  greekgods1: { name_zh: "Greek Gods 传统希腊酸奶 原味 24 盎司" },
  yakult1: { name_zh: "养乐多 轻盈版 无脂益生菌饮料 2.7液盎司x5" },
  beijing_lowfat: { name_zh: "北京酸奶 低脂酸奶 6盎司x6" },
  vitalfarms1: { name_zh: "Vital Farms 有机散养鸡蛋 18颗" },
  quaileggs1: { name_zh: "鹌鹑蛋 15颗" },
  lactaid1: { name_zh: "Lactaid 无乳糖 2%低脂牛奶 63.9液盎司" },

  // Seasonings
  leekumkee_reduced: { name_zh: "李锦记 减盐酱油 16.9 盎司" },
  hengshun1: { name_zh: "恒顺 镇江香醋 18.6 液盎司" },
  kongyen1: { name_zh: "工研 米醋 20.2 液盎司" },
  whitepep1: { name_zh: "白胡椒粉 32 克" },
  fivespice1: { name_zh: "味全 五香粉 20 克" },
  kadoya1: { name_zh: "角屋 纯正麻油 163 毫升" },
  arowana1: { name_zh: "金龙鱼 黄金比例食用调和油 900 毫升" },
  haidilao_mushroom: { name_zh: "海底捞 菌汤火锅底料 150 克" },
  haidilao_tomato: { name_zh: "海底捞 番茄火锅底料 200 克" },
  goldplum1: { name_zh: "金梅 镇江香醋 550 毫升" },
};

function main() {
  const data = JSON.parse(fs.readFileSync(ENRICHED_FILE, "utf-8"));
  let updated = 0;

  for (const [_catKey, category] of Object.entries(data.categories)) {
    const cat = category as { items: Array<Record<string, unknown>> };
    for (const item of cat.items) {
      const id = item.product_id as string;
      const manual = MANUAL_DATA[id];
      if (manual) {
        if (!item.name_zh || item.name_zh === null) {
          item.name_zh = manual.name_zh;
          updated++;
          console.log(`  Updated name_zh for ${id}: ${manual.name_zh}`);
        }
        if (manual.image_url && (!item.image_url || item.image_url === null)) {
          item.image_url = manual.image_url;
          console.log(`  Updated image_url for ${id}`);
        }
      }
    }
  }

  fs.writeFileSync(ENRICHED_FILE, JSON.stringify(data, null, 2), "utf-8");
  console.log(`\nUpdated ${updated} items with Chinese names`);
}

main();
