# Add Recipe from meishichina.com

Add a classic Chinese dish from meishichina.com to `src/data/classic-dishes.json` with grocery matching.

**Input:** $ARGUMENTS

The input can be:
- A recipe URL: `https://home.meishichina.com/recipe-XXXXXX.html`
- A topic URL: `https://www.meishichina.com/mofang/{slug}/`
- A dish name in Chinese: e.g. `红烧牛肉`
- A topic slug: e.g. `hongshaoniurou`

## Step 0: Verify Firecrawl

Run `firecrawl --status` to confirm authentication. If it fails, tell the user:
> Firecrawl is not authenticated. Please run `! firecrawl login` to authenticate.

Then stop.

## Step 1: Resolve the Recipe URL

Depending on the input type:

**If a recipe URL** (`recipe-XXXXXX.html`): use it directly. Skip to Step 2.

**If a topic URL** (`/mofang/{slug}/`): scrape the topic page, extract the FIRST recipe link, and use that. Save to `.firecrawl/topic-{slug}.md`.

**If a dish name or slug**: construct the topic URL as `https://www.meishichina.com/mofang/{slug}/` and scrape it. If you received a Chinese name, convert to pinyin slug (e.g. `红烧牛肉` -> `hongshaoniurou`). Save to `.firecrawl/topic-{slug}.md`.

To scrape a page:
```bash
firecrawl scrape "URL" -o .firecrawl/FILENAME.md
```

### Parsing topic pages

The topic page has:
- A description paragraph after the `# [DishName]` heading
- Recipe links in format: `recipe-XXXXXX.html` — use the FIRST one listed

Extract: the dish description and the first recipe URL.

## Step 2: Scrape the Recipe Page

```bash
firecrawl scrape "https://home.meishichina.com/recipe-XXXXXX.html" -o .firecrawl/recipe-{slug}.md
```

### Parsing recipe pages

The scraped markdown has this structure:

```
### 食材明细

主料

- [**ingredient_name**](link)amount
- [**ingredient_name**](link)amount

辅料

- [**ingredient_name**](link)amount

调料

- [**ingredient_name**](link)amount

- [flavor](link)口味
- [method](link)工艺
- [time](link)耗时
- [difficulty](link)难度

### DISH_NAME的做法步骤
```

Extract from between `食材明细` and `做法步骤`:
- **主料** (main ingredients): each line is `[**name**](link)amount`
- **辅料** (auxiliary ingredients): same format
- **调料** (seasonings): same format
- **Metadata**: flavor (口味), cooking method (工艺), time (耗时), difficulty (难度)

The ingredient name is inside `[**...**]` and the amount follows after the closing `)`.

Also extract the dish title from the `# [Title]` heading near the top.

The recipe category comes from the breadcrumb path, e.g.:
`主食` / `热菜` / `凉菜` / `汤羹` / `小吃`

## Step 3: Build the Dish JSON Object

Construct the dish object matching the existing schema in `src/data/classic-dishes.json`:

```json
{
  "id": "{slug}",
  "name_zh": "Chinese name",
  "name_en": "English name",
  "description_zh": "Description from topic page",
  "recipe_url": "https://home.meishichina.com/recipe-XXXXXX.html",
  "topic_url": "https://www.meishichina.com/mofang/{slug}/",
  "category": "热菜",
  "flavor": "咸鲜",
  "cooking_method": "炒",
  "time_required": "廿分钟",
  "difficulty": "普通",
  "ingredients": {
    "main": [
      {
        "name_zh": "...",
        "name_en": "...",
        "amount": "...",
        "grocery_match": { "product_id": "...", "name": "...", "category": "..." }
      }
    ],
    "auxiliary": [ ... ],
    "seasonings": [ ... ]
  }
}
```

### Translate ingredient names

Every ingredient needs both `name_zh` and `name_en`. Translate accurately:
- Use standard culinary English (e.g. 五花肉 = "pork belly", 生抽 = "light soy sauce")
- For Chinese-specific items, use the most common English name with Chinese in parentheses if needed

### Translate the dish name

Provide a natural English name (`name_en`). Follow the style of existing entries — descriptive but concise.

## Step 4: Match Ingredients to Grocery Items

For each ingredient, try to match it to a grocery item from `src/data/grocery-items.json`.

### Grocery Matching Reference

Use exact `name_zh` substring matching. Here is the definitive mapping table:

**Proteins:**
| Ingredient (name_zh contains) | Product ID | Grocery Item |
|-------------------------------|------------|-------------|
| 里脊 (but NOT 五花肉) | `105407` | Pork Tenderloin |
| 精肉, 瘦肉 (lean pork) | `105407` | Pork Tenderloin |
| 猪肉 (generic pork) | `105407` | Pork Tenderloin |
| 鸡腿, 鸡胸 | `37447` | Chicken Thighs |
| 鸡 (whole chicken) | `460` | Stewing Hen |
| 黑鱼 | `51248` | Snakehead Fish Slices |
| 虾, 基围虾 | `15684` | Argentine Red Shrimp |

**Tofu:**
| Ingredient | Product ID | Grocery Item |
|------------|------------|-------------|
| 嫩豆腐, 豆腐 (soft/silken) | `9819` | Silken Tofu |
| 千张, 腐竹, 豆腐皮 | `49005` | Dried Tofu Sheets |

**Vegetables:**
| Ingredient | Product ID | Grocery Item |
|------------|------------|-------------|
| 胡萝卜 | `88064` | Baby French Carrot |
| 金针菇 | `38441` | Enoki Mushrooms |
| 木耳, 黑木耳 | `97092` | Black Wood Ear Mushroom |
| 豆芽, 黄豆芽 | `97338` | Soy Bean Sprouts |
| 包菜, 卷心菜, 甘蓝 | `62662` | Green Cabbage |
| 莴笋 | `95272` | A Choy Sum |
| 油菜, 青菜 (bok choy) | `94800` | Shanghai Bok Choy |
| 豆角, 四季豆, 豇豆, 扁豆 | `97012` | Flat Beans (Frozen) |
| 冬笋, 笋 | `25438` | Winter Bamboo Shoots |
| 芹菜 | `52157` | Chinese Celery |
| 菠菜 | `68297` | Taiwan Spinach |
| 白菜 (napa) | `12397` | Baby Napa Cabbage |
| 花菜, 菜花 (cauliflower) | `48517` | Chinese Cauliflower |

**Aromatics:**
| Ingredient | Product ID | Grocery Item |
|------------|------------|-------------|
| 姜, 生姜, 姜片, 姜丝, 姜末 | `94449` | Organic Fresh Ginger |

**Eggs & Grains:**
| Ingredient | Product ID | Grocery Item |
|------------|------------|-------------|
| 鸡蛋, 蛋清, 鸡蛋清 | `vitalfarms1` | Organic Eggs |
| 大米, 米饭, 隔夜米饭 | `87333` | Calrose Rice |
| 花生 (any form) | `65145` | Dried Skin Peanuts |

**Seasonings:**
| Ingredient | Product ID | Grocery Item |
|------------|------------|-------------|
| 生抽, 酱油 (light/general soy) | `leekumkee_reduced` | Reduced Sodium Soy Sauce |
| 醋, 陈醋 (dark vinegar) | `hengshun1` | Zhenjiang Vinegar |
| 香醋 (Chinkiang vinegar) | `goldplum1` | Chinkiang Vinegar |
| 白醋 (white/rice vinegar) | `kongyen1` | Rice Vinegar |
| 白胡椒粉, 胡椒粉 | `whitepep1` | White Pepper Powder |
| 香油, 芝麻油 | `kadoya1` | Sesame Oil |
| 油, 食用油, 花生油, 菜籽油, 玉米油, 山茶油 | `arowana1` | Vegetable Cooking Oil |
| 火锅底料 | `haidilao_mushroom` | Hotpot Mushroom Soup Base |

### For matched ingredients

Add `grocery_match` with the grocery item details:
```json
"grocery_match": {
  "product_id": "94449",
  "name": "Organic Fresh Ginger 8 oz",
  "category": "vegetables"
}
```

Look up the full product name and category from `src/data/grocery-items.json`.

### For unmatched ingredients

Set `grocery_match` to `null` and add `missing_importance`:

```json
"grocery_match": null,
"missing_importance": "high"
```

**Importance guidelines:**

**HIGH** — Cannot cook many dishes without this; critical gap in grocery list:
- Green onion (葱/大葱/小葱/香葱/葱花/葱末/葱段 and all forms)
- Garlic (蒜/大蒜/蒜头/蒜末/蒜瓣 and all forms)
- Cooking wine (料酒/花雕酒/黄酒)
- Dark soy sauce (老抽)
- Oyster sauce (蚝油)
- Doubanjiang (豆瓣酱/郫县豆瓣酱)
- Sichuan peppercorn (花椒) and dried chili (干辣椒/干红辣椒)
- Pork belly (五花肉), ribs (排骨)
- Tomato (番茄/西红柿), potato (土豆)
- Whole fish or specific fish varieties (鲫鱼, 草鱼, etc.)
- Any MAIN protein or vegetable that defines the dish

**MED** — Important for specific dishes; some substitutes exist:
- Bell peppers (青椒/红椒/彩椒), cucumber (黄瓜), eggplant (茄子)
- Shiitake mushroom (香菇/干花菇)
- Specific chilis (小米椒), garlic sprouts (蒜苗)
- Century egg (皮蛋), water chestnut (荸荠)
- Ketchup (番茄酱), chili oil (红油), peppercorn oil (花椒油)
- Steamed pork rice flour (蒸肉米粉)
- Duck (鸭), ground beef (牛肉末), chicken wings (鸡翅)
- Beer (啤酒)

**LOW** — Pantry staples most kitchens already have:
- Salt (盐), sugar (糖/白糖/白砂糖/冰糖)
- MSG/bouillon (味精/鸡精)
- Starch (淀粉/玉米淀粉/生粉/水淀粉)
- Water (清水/水/冰水)
- Sesame seeds (白芝麻/熟芝麻)
- Star anise (八角), cinnamon (桂皮), bay leaf (香叶)
- Fermented black beans (豆豉), fermented tofu (腐乳)
- Stock/broth (高汤)
- Cola (百事可乐), baijiu (白酒)

## Step 5: Update classic-dishes.json

1. Read `src/data/classic-dishes.json`
2. Check that the dish `id` doesn't already exist (if it does, ask before overwriting)
3. Append the new dish to the `dishes` array
4. Update `metadata.total_dishes` count
5. Write the file back with 2-space indentation

## Step 6: Report

Print a summary:
- Dish name (ZH / EN)
- Number of ingredients: X main, X auxiliary, X seasonings
- Grocery matches: X matched, X unmatched
- Unmatched HIGH items (if any) — these are the ones the user should consider adding to their grocery list
- Confirm the dish was added to classic-dishes.json

## Important Notes

- Always save scraped files to `.firecrawl/` directory (already in .gitignore)
- Do NOT skip any ingredient sections. If a recipe has no 辅料 or no 调料, omit that key.
- If the topic page was not scraped (direct recipe URL), set `description_zh` from the recipe page's quoted description block (the `> "..."` section) or leave as a brief summary.
- The `topic_url` may not exist if the user provided a direct recipe URL. Set it to `null` in that case.
