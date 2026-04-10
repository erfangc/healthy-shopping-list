import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENRICHED_FILE = path.resolve(__dirname, "../src/data/grocery-items.json");

// Data found by the background agent - real Weee product URLs, images, and Chinese names
const SYNTHETIC_DATA: Record<string, { image_url: string; name_zh: string; product_url: string }> = {
  chobani1: {
    image_url: "https://img06.weeecdn.com/product/image/725/881/66D59D6A07935335.png",
    name_zh: "Chobani 0脂肪希腊酸奶 32 盎司",
    product_url: "https://www.sayweee.com/zh/product/Chobani-Greek-Yogurt-Non-Fat-Plain/100783",
  },
  stonyfield1: {
    image_url: "https://img06.weeecdn.com/product/image/526/166/6BDF394B98F4D876.png",
    name_zh: "斯多尼菲尔德 有机益生菌全脂原味酸奶 32 盎司",
    product_url: "https://www.sayweee.com/zh/product/Stonyfield-0--Fat-Plain-Yogurt/100784",
  },
  greekgods1: {
    image_url: "https://img06.weeecdn.com/product/image/286/331/627C4B7F7239395D.png",
    name_zh: "Greek Gods 传统希腊酸奶 原味 24 盎司",
    product_url: "https://www.sayweee.com/zh/product/GREEK-GODS-Plain-Traditional-Greek-Yogurt/90902",
  },
  yakult1: {
    image_url: "https://img06.weeecdn.com/product/image/704/636/49599F378BE0B635.png",
    name_zh: "养乐多 低糖活性乳酸菌饮品 2.7液盎司x5",
    product_url: "https://www.sayweee.com/zh/product/Yakult-Light-Nonfat-Probiotic-Drink/21833",
  },
  beijing_lowfat: {
    image_url: "https://img06.weeecdn.com/product/image/558/853/344285ADC3D0D11D.png",
    name_zh: "北京酸奶 低脂酸奶 6盎司x6",
    product_url: "https://www.sayweee.com/zh/product/Beijing-Yogurt--Plain-Low-Fat-24ct/93558",
  },
  vitalfarms1: {
    image_url: "https://img06.weeecdn.com/product/image/506/619/98766CFFEC713E9.png",
    name_zh: "Vital Farms 有机散养鸡蛋 大号 18颗",
    product_url: "https://www.sayweee.com/zh/product/Vital-Farms-Organic-Pasture-Raised-Large-Grade-A-Eggs-18-ct/103744",
  },
  quaileggs1: {
    image_url: "https://img06.weeecdn.com/item/image/823/241/4EB874CAF8E857CA.jpg",
    name_zh: "鹌鹑蛋 15颗",
    product_url: "https://www.sayweee.com/zh/product/Quail-Eggs-15ct/33405",
  },
  lactaid1: {
    image_url: "https://img06.weeecdn.com/product/image/366/332/EB9715A0750C8A2.png",
    name_zh: "Lactaid 无乳糖 2%低脂牛奶 63.9液盎司",
    product_url: "https://www.sayweee.com/zh/product/Lactaid-Lactose-Free-2--Reduced-Fat-Milk/95353",
  },
  leekumkee_reduced: {
    image_url: "https://img06.weeecdn.com/product/image/117/833/2EBBFE382C4A6578.png",
    name_zh: "李锦记 薄盐味极鲜 16.9 盎司",
    product_url: "https://www.sayweee.com/zh/product/Lee-Kum-Kee-Sodium-Reduced-Seasoning-Soy-Sauce/71478",
  },
  hengshun1: {
    image_url: "https://img06.weeecdn.com/product/image/630/056/52A405917BB9F377.png",
    name_zh: "恒顺 金山 镇江香醋 18.6 液盎司",
    product_url: "https://www.sayweee.com/zh/product/Hengshun-Zhenjiang-Vinegar/99090",
  },
  kongyen1: {
    image_url: "https://img06.weeecdn.com/product/image/351/148/1C23B5D038B184B6.png",
    name_zh: "工研 白米醋 20.2 液盎司",
    product_url: "https://www.sayweee.com/zh/product/Kong-Yen-Rice-Vinegar/8420",
  },
  whitepep1: {
    image_url: "https://img06.weeecdn.com/product/image/715/726/3DFD11942D9C71AA.png",
    name_zh: "小磨坊 白胡椒粉 32 克",
    product_url: "https://www.sayweee.com/zh/product/White-Pepper-Powder/53078",
  },
  fivespice1: {
    image_url: "https://img06.weeecdn.com/product/image/141/296/690A3FCB2EDE830E.png",
    name_zh: "小磨坊 五香粉 20 克",
    product_url: "https://www.sayweee.com/zh/product/Tomax-Five-Spice-Powder/13937",
  },
  kadoya1: {
    image_url: "https://img06.weeecdn.com/product/image/402/874/41FE27A4A34CC5B9.png",
    name_zh: "角屋 纯正麻油 163 毫升",
    product_url: "https://www.sayweee.com/zh/product/Kadoya-Roasted-Sesame-Oil/96942",
  },
  arowana1: {
    image_url: "https://img06.weeecdn.com/product/image/037/461/3163DE7B4133EE15.jpeg",
    name_zh: "金龙鱼 黄金比例食用调和油 900 毫升",
    product_url: "https://www.sayweee.com/zh/product/Arowana-Brand-Golden-Ratio-Vegetable-Cooking-Oil/30503",
  },
  haidilao_mushroom: {
    image_url: "https://img06.weeecdn.com/product/image/666/870/56E2C0CB03CE7D84.png",
    name_zh: "海底捞 菌汤火锅底料 150 克",
    product_url: "https://www.sayweee.com/zh/product/Haidilao-Hot-Pot-Mushroom-Soup-Base/1763",
  },
  haidilao_tomato: {
    image_url: "https://img06.weeecdn.com/product/image/090/749/325786031AEB116.png",
    name_zh: "海底捞 番茄火锅底料 200 克",
    product_url: "https://www.sayweee.com/zh/product/Haidilao-Hot-Pot-Tomato-Soup-Base/3569",
  },
  goldplum1: {
    image_url: "https://img06.weeecdn.com/product/image/723/161/28AB838A93F1F8BF.jpeg",
    name_zh: "金梅 镇江香醋 550 毫升",
    product_url: "https://www.sayweee.com/zh/product/Gold-Plum-Chinkiang-Vinegar-regular-package-and-with-foam-box-package-randomly-shipping-/70806",
  },
  "5549b": {
    image_url: "https://img06.weeecdn.com/item/image/066/048/5596AE17D314E0BD.jpg",
    name_zh: "随园 有机栽种绿豆 16 盎司",
    product_url: "https://www.sayweee.com/zh/product/Chimes-Garden-Organic-Mung-Beans/60668",
  },
  nongfu1: {
    image_url: "https://img06.weeecdn.com/product/image/958/498/5CA4A2A916334A0F.png",
    name_zh: "农夫山泉 东方树叶 茉莉花茶 无糖 500 毫升",
    product_url: "https://www.sayweee.com/zh/product/Nongfu-Spring-Eastern-Leaves-Jasmine-Tea/4881",
  },
};

function main() {
  const data = JSON.parse(fs.readFileSync(ENRICHED_FILE, "utf-8"));
  let updated = 0;

  for (const [_catKey, category] of Object.entries(data.categories)) {
    const cat = category as { items: Array<Record<string, unknown>> };
    for (const item of cat.items) {
      const id = item.product_id as string;
      const synth = SYNTHETIC_DATA[id];
      if (synth) {
        item.image_url = synth.image_url;
        item.name_zh = synth.name_zh;
        item.product_url = synth.product_url;
        updated++;
        console.log(`  Updated ${id}: image + name_zh + product_url`);
      }
    }
  }

  fs.writeFileSync(ENRICHED_FILE, JSON.stringify(data, null, 2), "utf-8");
  console.log(`\nUpdated ${updated} synthetic items with real images and URLs`);
}

main();
