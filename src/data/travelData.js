const assetUrl = (fileName) => `${import.meta.env.BASE_URL}assets/${fileName}`;

export const travelLocations = [
  {
    id: "sydney",
    countryId: "australia",
    country: "Australia",
    name: "Sydney",
    cn: "悉尼",
    coords: [151.2093, -33.8688],
    date: "2026.10",
    days: "3 days",
    tags: ["咖啡", "海港", "城市漫游"],
    image: assetUrl("sydney-opera.jpg"),
    note: "第一站，海港很漂亮，但真正留下来的是清晨那杯咖啡。",
    annotations: [
      { x: 42, y: 34, label: "歌剧院帆顶，日落边缘最软" },
      { x: 67, y: 58, label: "Circular Quay，人很多但值得" },
      { x: 26, y: 70, label: "咖啡馆，贵但状态回来了" },
    ],
    guideItems: [
      { tag: "景点", title: "Sydney Opera House", body: "傍晚去，光线比中午友好太多。" },
      { tag: "咖啡", title: "Surry Hills", body: "吵到爆炸但咖啡真的好喝。" },
      { tag: "路线", title: "The Rocks -> Circular Quay", body: "第一天最顺，脚不会报废。" },
    ],
  },
  {
    id: "gold-coast",
    countryId: "australia",
    country: "Australia",
    name: "Gold Coast",
    cn: "黄金海岸",
    coords: [153.4009, -28.0167],
    date: "2026.10",
    days: "3 days",
    tags: ["海滩", "日落", "慢速"],
    image: assetUrl("gold-coast.jpg"),
    note: "这里适合把计划删掉一半，只留海风和晚饭。",
    annotations: [
      { x: 52, y: 42, label: "冲浪海岸线，下午风更舒服" },
      { x: 72, y: 66, label: "18:12 以后颜色开始变暖" },
    ],
    guideItems: [
      { tag: "体验", title: "Burleigh Heads", body: "不要赶，找个位置坐到天黑。" },
      { tag: "餐厅", title: "Seafood dinner", body: "海边吃饭比菜单本身更重要。" },
    ],
  },
  {
    id: "brisbane",
    countryId: "australia",
    country: "Australia",
    name: "Brisbane",
    cn: "布里斯班",
    coords: [153.026, -27.4705],
    date: "2026.10",
    days: "2 days",
    tags: ["补给", "河岸", "咖啡"],
    image: assetUrl("coffee.jpg"),
    note: "不是最戏剧化的一站，但很适合补电。",
    annotations: [
      { x: 35, y: 48, label: "早晨补咖啡，重新上线" },
      { x: 62, y: 55, label: "河岸散步，低强度恢复" },
    ],
    guideItems: [
      { tag: "咖啡", title: "Fortitude Valley", body: "选一家顺眼的就行，别把咖啡当任务。" },
      { tag: "散步", title: "South Bank", body: "傍晚舒服，适合做行程缓冲。" },
    ],
  },
  {
    id: "reef",
    countryId: "australia",
    country: "Australia",
    name: "Great Barrier Reef",
    cn: "大堡礁",
    coords: [146.5, -17.5],
    date: "2026.10",
    days: "4 days",
    tags: ["浮潜", "海面", "重点体验"],
    image: assetUrl("great-barrier-reef.jpg"),
    note: "这段不要塞太满，海面本身就是主菜。",
    annotations: [
      { x: 45, y: 44, label: "珊瑚区，第一眼会安静下来" },
      { x: 70, y: 38, label: "玻璃船路线，适合风大时备选" },
      { x: 58, y: 72, label: "防晒补涂点，不开玩笑" },
    ],
    guideItems: [
      { tag: "体验", title: "Reef Cruise", body: "留完整一天，不要当天再排城市任务。" },
      { tag: "准备", title: "Motion sickness kit", body: "海况好也带着，保险。" },
    ],
  },
];

export const travelCountries = [
  {
    id: "australia",
    name: "Australia",
    cn: "澳大利亚",
    code: "AU-026",
    accent: "#FFAB4D",
    secondary: "#B16CFF",
    coords: [134.5, -25.3],
    locations: travelLocations.filter((location) => location.countryId === "australia"),
  },
];
