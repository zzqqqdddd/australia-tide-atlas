import { useMemo, useState } from "react";
import {
  BookmarkSimple,
  CalendarBlank,
  Camera,
  Car,
  CaretDown,
  CheckCircle,
  Coffee,
  Compass,
  ForkKnife,
  Funnel,
  Heart,
  MapPin,
  MapTrifold,
  NavigationArrow,
  Star,
  Sun,
  Ticket,
  Waves,
} from "@phosphor-icons/react";

const assetUrl = (fileName) => `${import.meta.env.BASE_URL}assets/${fileName}`;

const assets = {
  route: assetUrl("route-atlas-cropped-left.jpg"),
  routeBase: assetUrl("route-atlas.jpg"),
  sydney: assetUrl("sydney-opera.jpg"),
  coast: assetUrl("gold-coast.jpg"),
  reef: assetUrl("great-barrier-reef.jpg"),
  seafood: assetUrl("seafood.jpg"),
  coffee: assetUrl("coffee.jpg"),
  rocks: assetUrl("the-rocks.jpg"),
  botanic: assetUrl("royal-botanic-garden.jpg"),
  qvb: assetUrl("qvb.jpg"),
  barangaroo: assetUrl("barangaroo.jpg"),
  surry: assetUrl("surry-hills.jpg"),
  bondi: assetUrl("bondi-beach.jpg"),
  seafoodDinner: assetUrl("seafood-dinner.jpg"),
};

const navItems = [
  { id: "home", label: "首页" },
  { id: "route", label: "路线图" },
  { id: "dates", label: "日期" },
  { id: "cities", label: "城市" },
  { id: "saved", label: "收藏" },
];

const filters = ["全部", "景点", "餐厅", "咖啡", "商圈", "体验"];

const googleMapEmbedUrl = (query) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

const googleMapSearchUrl = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const sydneyMapPlaces = [
  {
    id: "opera",
    category: "海港地标",
    title: "Sydney Opera House",
    area: "Bennelong Point",
    query: "Sydney Opera House, Bennelong Point, Sydney NSW",
    note: "歌剧院、Circular Quay 和皇家植物园可以串成同一段步行。",
  },
  {
    id: "bridge",
    category: "海港地标",
    title: "Harbour Bridge",
    area: "The Rocks",
    query: "Sydney Harbour Bridge, Sydney NSW",
    note: "适合从 The Rocks 或 Circular Quay 一侧看桥和海港。",
  },
  {
    id: "rocks",
    category: "海港地标",
    title: "The Rocks / Circular Quay",
    area: "Old Town & Ferry Hub",
    query: "The Rocks Sydney NSW",
    note: "第一天最顺的落脚点，适合接码头、老街和晚餐。",
  },
  {
    id: "botanic",
    category: "海港地标",
    title: "Royal Botanic Garden",
    area: "Mrs Macquarie's Chair",
    query: "Mrs Macquarie's Chair, Sydney NSW",
    note: "经典海港视角，适合清晨或傍晚散步。",
  },
  {
    id: "darling",
    category: "海港夜景",
    title: "Darling Harbour",
    area: "Waterfront",
    query: "Darling Harbour Sydney NSW",
    note: "晚餐和夜景比较顺，适合和 Barangaroo 一起安排。",
  },
  {
    id: "barangaroo",
    category: "海港夜景",
    title: "Barangaroo",
    area: "West Harbour",
    query: "Barangaroo Sydney NSW",
    note: "海边餐厅、步道和夜景都集中，晚上更有氛围。",
  },
  {
    id: "qvb",
    category: "核心商圈",
    title: "QVB",
    area: "Town Hall",
    query: "Queen Victoria Building Sydney NSW",
    note: "建筑本身就值得看，适合接 Town Hall 和 Pitt Street。",
  },
  {
    id: "pitt",
    category: "核心商圈",
    title: "Pitt Street Mall",
    area: "Sydney CBD",
    query: "Pitt Street Mall Sydney NSW",
    note: "悉尼最核心的步行购物区，品牌和百货最集中。",
  },
  {
    id: "westfield",
    category: "核心商圈",
    title: "Westfield Sydney",
    area: "Sydney CBD",
    query: "Westfield Sydney, Pitt Street, Sydney NSW",
    note: "雨天、补买旅行用品或想集中逛商场时很方便。",
  },
  {
    id: "surry",
    category: "街区",
    title: "Surry Hills",
    area: "Coffee & Brunch",
    query: "Surry Hills Sydney NSW",
    note: "咖啡、brunch 和本地街区感，适合安排半天慢逛。",
  },
  {
    id: "bondi",
    category: "海边",
    title: "Bondi Beach",
    area: "Eastern Suburbs",
    query: "Bondi Beach NSW",
    note: "天气好时留半天，想走路可以接海岸步道的一段。",
  },
  {
    id: "airport",
    category: "交通",
    title: "Sydney Airport",
    area: "Mascot / Botany Bay",
    query: "Sydney Airport NSW",
    note: "抵达和离境锚点，后面可以接航班、酒店和交通时间。",
  },
];

const dayPlan = [
  {
    day: "Day 1 - 3",
    city: "Sydney",
    title: "悉尼海港与城市咖啡",
    date: "10月上旬",
    pace: "轻松抵达",
    summary:
      "第一段先把节奏放稳：歌剧院、海港大桥、The Rocks、Circular Quay 和 Surry Hills 咖啡，适合作为整趟旅行的开场。",
    stops: ["Sydney Opera House", "The Rocks / Circular Quay", "Surry Hills"],
  },
  {
    day: "Day 4 - 6",
    city: "Gold Coast",
    title: "海岸日落与冲浪长线",
    date: "10月中旬",
    pace: "海边慢行",
    summary:
      "从城市切换到海岸节奏，留出 Burleigh Heads、Surfers Paradise 和一顿不赶时间的海边晚餐。",
    stops: ["Burleigh Heads", "Surfers Paradise", "海滨晚餐"],
  },
  {
    day: "Day 7 - 8",
    city: "Brisbane",
    title: "河岸城市与轻松过渡",
    date: "10月中旬",
    pace: "城市补给",
    summary:
      "在布里斯班把节奏放慢，补给、咖啡、河岸散步，为北上大堡礁保留体力。",
    stops: ["South Bank", "Fortitude Valley", "城市咖啡"],
  },
  {
    day: "Day 9 - 12",
    city: "Great Barrier Reef",
    title: "大堡礁蓝色召唤",
    date: "10月下旬",
    pace: "重点体验",
    summary:
      "浮潜、珊瑚、海龟与玻璃船，把完整的一两天留给海面和岛屿，不把行程塞得太满。",
    stops: ["Reef Cruise", "Green Island", "海上日落"],
  },
];

const cards = [
  {
    id: "opera",
    mapPlaceId: "opera",
    type: "景点",
    city: "Sydney",
    title: "Sydney Opera House",
    place: "悉尼海港",
    image: assets.sydney,
    note:
      "建议傍晚抵达，歌剧院的帆顶会被落日照出柔和边缘，也方便接 Circular Quay 和 The Rocks。",
    tags: ["地标", "建筑", "海港"],
    status: "必去",
    saved: true,
    hours: "Tour 每日开放；Welcome Centre 通常 8:45 - 17:00",
    bookingLabel: "官方购票",
    bookingUrl: "https://www.sydneyoperahouse.com/tours/sydney-opera-house-tour",
  },
  {
    id: "rocks",
    mapPlaceId: "rocks",
    type: "景点",
    city: "Sydney",
    title: "The Rocks & Circular Quay",
    place: "悉尼老城区",
    image: assets.rocks,
    note:
      "适合安排在第一天下午或傍晚，老街、码头、海港视角集中，走起来不会太累。",
    tags: ["老街区", "码头", "步行"],
    status: "必去",
    saved: true,
    hours: "公共街区全天开放；店铺和市集以当日为准",
    bookingLabel: "官方指南",
    bookingUrl: "https://www.therocks.com/",
  },
  {
    id: "botanic",
    mapPlaceId: "botanic",
    type: "景点",
    city: "Sydney",
    title: "Royal Botanic Garden",
    place: "Mrs Macquarie's Chair",
    image: assets.botanic,
    note:
      "这里能同时看到歌剧院和海港大桥，适合清晨或黄昏散步，比单纯打卡更有呼吸感。",
    tags: ["花园", "海港视角", "散步"],
    status: "推荐",
    saved: false,
    hours: "每日 7:00 - 日落；10月通常到 19:30",
    bookingLabel: "开放时间",
    bookingUrl: "https://www.botanicgardens.org.au/royal-botanic-garden-sydney/plan-your-visit",
  },
  {
    id: "qvb",
    mapPlaceId: "qvb",
    type: "商圈",
    city: "Sydney",
    title: "QVB / Pitt Street Mall",
    place: "Sydney CBD",
    image: assets.qvb,
    note:
      "核心购物动线可以从 QVB 走到 Pitt Street Mall，再接 Westfield Sydney，适合雨天或城市补给。",
    tags: ["购物", "CBD", "雨天备选"],
    status: "核心",
    saved: false,
    hours: "通常一三五六 9:00 - 18:00，周四到 21:00，周日 11:00 - 17:00",
    bookingLabel: "营业时间",
    bookingUrl: "https://www.qvb.com.au/centre-info",
  },
  {
    id: "barangaroo",
    mapPlaceId: "barangaroo",
    type: "商圈",
    city: "Sydney",
    title: "Barangaroo & Darling Harbour",
    place: "西侧海港",
    image: assets.barangaroo,
    note:
      "白天适合海边散步，晚上适合吃饭和看夜景；这一区也可以作为住宿或晚餐候选。",
    tags: ["海滨", "餐厅", "夜景"],
    status: "推荐",
    saved: true,
    hours: "公共海滨全天开放；餐厅和活动以官网为准",
    bookingLabel: "官方指南",
    bookingUrl: "https://www.barangaroo.com/",
  },
  {
    id: "surry",
    mapPlaceId: "surry",
    type: "咖啡",
    city: "Sydney",
    title: "Surry Hills",
    place: "悉尼内城",
    image: assets.surry,
    note:
      "咖啡、brunch、小店和街区氛围都集中，适合作为城市漫游的起点，不必只围着海港转。",
    tags: ["咖啡", "brunch", "本地感"],
    status: "必去",
    saved: false,
    hours: "街区全天可逛；咖啡店多为早晨到下午",
    bookingLabel: "街区指南",
    bookingUrl: "https://www.sydney.com/destinations/sydney/inner-sydney/surry-hills",
  },
  {
    id: "bondi",
    mapPlaceId: "bondi",
    type: "景点",
    city: "Sydney",
    title: "Bondi Beach",
    place: "悉尼东部海岸",
    image: assets.bondi,
    note:
      "如果天气好，可以安排 Bondi to Coogee coastal walk 的一段；风大时就只做海滩和咖啡。",
    tags: ["海滩", "步道", "日落"],
    status: "天气好去",
    saved: false,
    hours: "公共海滩全天开放；救生服务和泳池以当天为准",
    bookingLabel: "官方指南",
    bookingUrl: "https://www.sydney.com/destinations/sydney/sydney-east/bondi",
  },
  {
    id: "icebergs",
    mapPlaceId: "bondi",
    type: "餐厅",
    city: "Sydney",
    title: "海边海鲜晚餐",
    place: "悉尼 / Bondi",
    image: assets.seafoodDinner,
    note:
      "海鲜可以放在悉尼段的最后一晚，既有仪式感，也方便把白天的海岸线安排串起来。",
    tags: ["海鲜", "晚餐", "预订"],
    status: "待确认",
    saved: true,
    hours: "建议晚餐时段提前预订；营业时间以餐厅官网为准",
    bookingLabel: "餐厅预订",
    bookingUrl: "https://idrb.com/",
  },
  {
    id: "reef",
    type: "体验",
    city: "Great Barrier Reef",
    title: "Great Barrier Reef Cruise",
    place: "大堡礁",
    image: assets.reef,
    note:
      "十月海况通常舒服，建议把这天留完整一点，别排太满，给浮潜和海上休息留空间。",
    tags: ["浮潜", "珊瑚", "一日游"],
    status: "必去",
    saved: true,
    hours: "一日游通常早晨出发，需按船公司班次确认",
    bookingLabel: "行程参考",
    bookingUrl: "https://www.queensland.com/us/en/places-to-see/experiences/great-barrier-reef",
  },
];

const cityChapters = [
  {
    city: "Sydney",
    cn: "悉尼",
    tone: "海港地标、核心商圈、咖啡街区和东部海岸，是这趟旅行最适合慢慢展开的第一站。",
    days: "Day 1 - 3",
    image: assets.sydney,
    picks: ["Sydney Opera House", "The Rocks", "Surry Hills", "Bondi Beach"],
    mapPlaces: sydneyMapPlaces,
    sections: [
      {
        title: "海港地标",
        items: [
          "Sydney Opera House：傍晚和夜景都值得留时间。",
          "Harbour Bridge：可选桥下散步、桥上攀登或从 The Rocks 取景。",
          "The Rocks / Circular Quay：第一天最顺的落脚点，餐厅、码头和老街都集中。",
          "Royal Botanic Garden：适合清晨散步，Mrs Macquarie's Chair 是经典海港视角。",
        ],
      },
      {
        title: "核心商圈",
        items: [
          "QVB：建筑本身很值得看，适合和 Town Hall 一起走。",
          "Pitt Street Mall：悉尼最核心的步行购物区。",
          "Westfield Sydney：品牌集中，适合补买旅行用品或雨天备选。",
          "The Galeries / Strand Arcade：更适合找小店、咖啡和室内逛街。",
        ],
      },
      {
        title: "街区与海边",
        items: [
          "Surry Hills：咖啡、brunch、买手店和本地街区感。",
          "Barangaroo / Darling Harbour：晚餐、夜景和海边散步更顺。",
          "Bondi Beach：天气好时安排半天，想走路可接 Bondi to Coogee 的一段。",
          "Manly Ferry：如果想多看海港，可以把渡轮当成轻松半日游。",
        ],
      },
    ],
  },
  {
    city: "Gold Coast",
    cn: "黄金海岸",
    tone: "长海岸线、日落与慢速下午。",
    days: "Day 4 - 6",
    image: assets.coast,
    picks: ["Burleigh Heads", "Surfers Paradise", "海边晚餐"],
  },
  {
    city: "Brisbane",
    cn: "布里斯班",
    tone: "河岸城市、补给、轻松中转。",
    days: "Day 7 - 8",
    image: assets.coffee,
    picks: ["South Bank", "Fortitude Valley", "城市咖啡"],
  },
  {
    city: "Great Barrier Reef",
    cn: "大堡礁",
    tone: "珊瑚、海龟、蓝色透明的一天。",
    days: "Day 9 - 12",
    image: assets.reef,
    picks: ["Reef Cruise", "Green Island", "浮潜体验"],
  },
];

function getTypeIcon(type) {
  if (type === "餐厅") return <ForkKnife size={16} weight="duotone" />;
  if (type === "咖啡") return <Coffee size={16} weight="duotone" />;
  if (type === "体验") return <Waves size={16} weight="duotone" />;
  if (type === "商圈") return <MapTrifold size={16} weight="duotone" />;
  return <Camera size={16} weight="duotone" />;
}

export function App() {
  const [activeView, setActiveView] = useState("home");
  const [activeDay, setActiveDay] = useState(dayPlan[0].day);
  const [activeCity, setActiveCity] = useState("Sydney");
  const [activeSydneyPlace, setActiveSydneyPlace] = useState("opera");
  const [activeFilter, setActiveFilter] = useState("全部");
  const [expandedCard, setExpandedCard] = useState("opera");
  const [savedIds, setSavedIds] = useState(() =>
    new Set(cards.filter((card) => card.saved).map((card) => card.id)),
  );

  const selectedDay = dayPlan.find((day) => day.day === activeDay) ?? dayPlan[0];
  const selectedCity =
    cityChapters.find((chapter) => chapter.city === activeCity) ?? cityChapters[0];

  const visibleCards = useMemo(() => {
    return cards.filter((card) => {
      if (activeView === "saved" && !savedIds.has(card.id)) return false;
      if (activeFilter !== "全部" && card.type !== activeFilter) return false;
      return true;
    });
  }, [activeFilter, activeView, savedIds]);

  const toggleSaved = (id) => {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main className="atlas-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setActiveView("home")}>
          <span className="brand-mark">
            <Waves size={28} weight="duotone" />
          </span>
          <span>
            <strong>TIDE ATLAS</strong>
            <small>AUSTRALIA</small>
          </span>
        </button>
        <nav className="nav-tabs" aria-label="主导航">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activeView === item.id ? "active" : ""}
              onClick={() => setActiveView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <section className="hero-grid" id="route">
        <div className="hero-copy">
          <p className="script">十月的澳洲</p>
          <h1>
            向海而行
            <br />
            追逐暖风
          </h1>
          <p className="subhead">一条路线，三座城市，大堡礁的蔚蓝召唤。</p>
          <div className="coordinate-note">
            <Compass size={18} weight="duotone" />
            <span>
              旅途坐标
              <strong>33.8688° S / 151.2093° E</strong>
            </span>
          </div>
        </div>

        <div className="route-stage" aria-label="澳洲东海岸路线图">
          <div className="route-map">
            <img src={assets.route} alt="澳洲东海岸抽象路线图" />
          </div>
        </div>
      </section>

      <section className="facts-strip" aria-label="旅行快速概览">
        <Fact icon={<CalendarBlank size={24} />} label="最佳季节" value="9月 - 11月" />
        <Fact icon={<Sun size={24} />} label="平均气温" value="18°C - 27°C" />
        <Fact icon={<Car size={24} />} label="推荐玩法" value="海岸线自驾 / 城市飞行" />
        <Fact icon={<Ticket size={24} />} label="建议天数" value="10 - 14天" />
      </section>

      <section className="photo-strip" aria-label="旅途照片">
        <img src={assets.sydney} alt="悉尼歌剧院夕阳" />
        <img src={assets.coast} alt="黄金海岸日落" />
        <img src={assets.reef} alt="大堡礁海底珊瑚" />
      </section>

      <section className="workspace">
        <div className="content-panel">
          <div className="panel-tabs">
            {cityChapters.map((chapter) => (
              <button
                key={chapter.city}
                className={activeCity === chapter.city ? "active" : ""}
                onClick={() => {
                  setActiveCity(chapter.city);
                  setActiveView("cities");
                }}
              >
                {chapter.city}
              </button>
            ))}
          </div>

          {activeView === "dates" ? (
            <DateDetail day={selectedDay} />
          ) : activeView === "cities" ? (
            <CityDetail
              chapter={selectedCity}
              activeSydneyPlace={activeSydneyPlace}
              setActiveSydneyPlace={setActiveSydneyPlace}
            />
          ) : (
            <HomeOverview
              activeView={activeView}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              setActiveCity={setActiveCity}
              setActiveView={setActiveView}
              setActiveSydneyPlace={setActiveSydneyPlace}
              visibleCards={visibleCards}
              expandedCard={expandedCard}
              setExpandedCard={setExpandedCard}
              savedIds={savedIds}
              toggleSaved={toggleSaved}
            />
          )}
        </div>

        <aside className="day-rail">
          <div className="section-kicker">
            <CalendarBlank size={22} weight="duotone" />
            <span>行程天数</span>
          </div>
          {dayPlan.map((day) => (
            <button
              key={day.day}
              className={activeDay === day.day ? "day-pill active" : "day-pill"}
              onClick={() => {
                setActiveDay(day.day);
                setActiveView("dates");
              }}
            >
              <strong>{day.day}</strong>
              <span>{day.city}</span>
            </button>
          ))}
          <div className="map-cta">
            <NavigationArrow size={22} weight="duotone" />
            <span>沿海岸向北，把节奏留给阳光和海风。</span>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Fact({ icon, label, value }) {
  return (
    <div className="fact">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function HomeOverview({
  activeView,
  activeFilter,
  setActiveFilter,
  setActiveCity,
  setActiveView,
  setActiveSydneyPlace,
  visibleCards,
  expandedCard,
  setExpandedCard,
  savedIds,
  toggleSaved,
}) {
  const openCardCity = (card) => {
    setActiveCity(card.city);
    if (card.city === "Sydney" && card.mapPlaceId) {
      setActiveSydneyPlace(card.mapPlaceId);
    }
    setActiveView("cities");
  };

  return (
    <>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{activeView === "saved" ? "我的收藏" : "精选停靠点"}</p>
          <h2>
            {activeView === "saved"
              ? "先把心动的地方收进同一页"
              : "从悉尼到礁湖，挑出每天最值得停下来的地方"}
          </h2>
        </div>
        <div className="panel-actions">
          <button onClick={() => setActiveView("saved")}>
            <Heart size={18} weight="duotone" />
            我的收藏
          </button>
          <button onClick={() => setActiveFilter("全部")}>
            <Funnel size={18} weight="duotone" />
            筛选
          </button>
          <button
            onClick={() => {
              setActiveCity("Sydney");
              setActiveView("cities");
            }}
          >
            <MapTrifold size={18} weight="duotone" />
            查看地图
          </button>
        </div>
      </div>

      <div className="filter-row" aria-label="内容筛选">
        {filters.map((filter) => (
          <button
            key={filter}
            className={activeFilter === filter ? "active" : ""}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {visibleCards.map((card) => (
          <PlaceCard
            key={card.id}
            card={card}
            isExpanded={expandedCard === card.id}
            isSaved={savedIds.has(card.id)}
            onOpen={() => openCardCity(card)}
            onExpand={() => setExpandedCard(expandedCard === card.id ? "" : card.id)}
            onSave={() => toggleSaved(card.id)}
          />
        ))}
      </div>
    </>
  );
}

function PlaceCard({ card, isExpanded, isSaved, onOpen, onExpand, onSave }) {
  return (
    <article className="place-card">
      <div className="card-media">
        <button className="card-image-link" onClick={onOpen} aria-label={`查看 ${card.title}`}>
          <img src={card.image} alt={card.title} />
        </button>
        <button className={isSaved ? "save saved" : "save"} onClick={onSave} aria-label="收藏">
          <Heart size={18} weight={isSaved ? "fill" : "regular"} />
          {isSaved ? "已收藏" : "收藏"}
        </button>
      </div>
      <div className="card-body">
        <div className="card-type">
          {getTypeIcon(card.type)}
          <span>{card.type}</span>
          <em>{card.status}</em>
        </div>
        <button className="card-title-link" onClick={onOpen}>
          <h3>{card.title}</h3>
        </button>
        <p className="location">
          <MapPin size={15} weight="duotone" />
          {card.place}
        </p>
        <p>{card.note}</p>
        <div className="visit-meta">
          <span>
            <CalendarBlank size={15} weight="duotone" />
            {card.hours}
          </span>
          <a href={card.bookingUrl} target="_blank" rel="noreferrer">
            <Ticket size={15} weight="duotone" />
            {card.bookingLabel}
          </a>
        </div>
        <div className="tag-row">
          {card.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <button className="expand" onClick={onExpand}>
          <span>{isExpanded ? "收起备注" : "展开详情"}</span>
          <CaretDown size={18} className={isExpanded ? "up" : ""} />
        </button>
        {isExpanded && (
          <div className="detail-note">
            <CheckCircle size={18} weight="duotone" />
            <span>建议提前确认营业时间、天气和预约状态，现场安排以当天情况为准。</span>
          </div>
        )}
      </div>
    </article>
  );
}

function DateDetail({ day }) {
  return (
    <section className="detail-view">
      <div className="detail-cover" style={{ "--detail-cover-image": `url(${assets.routeBase})` }}>
        <p className="eyebrow">{day.day}</p>
        <h2>{day.title}</h2>
        <p>{day.summary}</p>
      </div>
      <div className="timeline-list">
        {["上午", "下午", "晚上"].map((time, index) => (
          <div className="timeline-item" key={time}>
            <span>{time}</span>
            <div>
              <strong>{day.stops[index]}</strong>
              <p>
                {index === 0 && "先把最重要的地点排在前半天，保留拍照和路上缓冲。"}
                {index === 1 && "下午适合慢走和临时调整，不把路线压得太满。"}
                {index === 2 && "晚上留给餐厅、海风和回酒店前的轻松收尾。"}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="ticket-note">
        <Ticket size={28} weight="duotone" />
        <div>
          <strong>
            {day.date} · {day.pace}
          </strong>
          <span>这一页之后可以接真实航班、酒店、票务和地址。</span>
        </div>
      </div>
    </section>
  );
}

function CityDetail({ chapter, activeSydneyPlace, setActiveSydneyPlace }) {
  if (chapter.city === "Sydney") {
    return (
      <SydneyDetail
        chapter={chapter}
        activeSydneyPlace={activeSydneyPlace}
        setActiveSydneyPlace={setActiveSydneyPlace}
      />
    );
  }

  return (
    <section className="city-view">
      <img src={chapter.image} alt={`${chapter.cn}章节照片`} />
      <div>
        <p className="eyebrow">{chapter.days}</p>
        <h2>
          {chapter.cn} / {chapter.city}
        </h2>
        <p>{chapter.tone}</p>
        <CityPicks picks={chapter.picks} />
        <button className="chapter-button">
          <BookmarkSimple size={18} weight="duotone" />
          保存这个城市章节
        </button>
      </div>
    </section>
  );
}

function SydneyDetail({ chapter, activeSydneyPlace, setActiveSydneyPlace }) {
  const selectedPlaceId = activeSydneyPlace;
  const selectedPlace =
    chapter.mapPlaces.find((place) => place.id === selectedPlaceId) ?? chapter.mapPlaces[0];

  return (
    <section className="sydney-guide">
      <div className="sydney-hero">
        <img src={chapter.image} alt="悉尼海港与歌剧院" />
        <div>
          <p className="eyebrow">{chapter.days}</p>
          <h2>
            {chapter.cn} / {chapter.city}
          </h2>
          <p>{chapter.tone}</p>
          <CityPicks picks={chapter.picks} />
        </div>
      </div>

      <div className="sydney-map-workbench">
        <div className="map-place-panel">
          <p className="eyebrow">Google Map</p>
          <h3>悉尼地点地图</h3>
          <div className="map-place-list">
            {chapter.mapPlaces.map((place) => (
              <button
                key={place.id}
                className={selectedPlace.id === place.id ? "map-place active" : "map-place"}
                onClick={() => setActiveSydneyPlace(place.id)}
              >
                <span className="map-place-meta">{place.category}</span>
                <strong>{place.title}</strong>
                <small>{place.area}</small>
                <em>{place.note}</em>
              </button>
            ))}
          </div>
        </div>

        <div className="google-map-panel">
          <iframe
            key={selectedPlace.id}
            title={`${selectedPlace.title} Google Map`}
            src={googleMapEmbedUrl(selectedPlace.query)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="map-caption">
            <span>
              <MapPin size={16} weight="duotone" />
              {selectedPlace.title}
            </span>
            <a href={googleMapSearchUrl(selectedPlace.query)} target="_blank" rel="noreferrer">
              在 Google Maps 打开
            </a>
          </div>
        </div>
      </div>

      <div className="sydney-sections">
        {chapter.sections.map((section) => (
          <article className="sydney-section" key={section.title}>
            <h3>{section.title}</h3>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="sydney-routing">
        <div>
          <p className="eyebrow">建议动线</p>
          <h3>第一天海港，第二天商圈和街区，第三天留给海边</h3>
        </div>
        <p>
          这样安排的好处是不用每天横跨城市：海港景点集中在 Circular Quay 一带，CBD 商圈和
          Surry Hills 可以放在同一天，Bondi 或 Manly 则根据天气挑一个半日。
        </p>
      </div>
    </section>
  );
}

function CityPicks({ picks }) {
  return (
    <div className="city-picks">
      {picks.map((pick) => (
        <span key={pick}>
          <Star size={15} weight="duotone" />
          {pick}
        </span>
      ))}
    </div>
  );
}
