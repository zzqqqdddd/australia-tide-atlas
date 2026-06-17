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
  route: assetUrl("route-atlas-labeled.jpg"),
  routeBase: assetUrl("route-atlas.jpg"),
  sydney: assetUrl("sydney-opera.jpg"),
  coast: assetUrl("gold-coast.jpg"),
  reef: assetUrl("great-barrier-reef.jpg"),
  seafood: assetUrl("seafood.jpg"),
  coffee: assetUrl("coffee.jpg"),
};

const navItems = [
  { id: "home", label: "首页" },
  { id: "route", label: "路线图" },
  { id: "dates", label: "日期" },
  { id: "cities", label: "城市" },
  { id: "saved", label: "收藏" },
];

const filters = ["全部", "景点", "餐厅", "咖啡", "体验"];

const dayPlan = [
  {
    day: "Day 1 - 3",
    city: "Sydney",
    title: "悉尼海港与城市咖啡",
    date: "10月上旬",
    pace: "轻松抵达",
    summary: "歌剧院、海港大桥、Surry Hills 咖啡和傍晚海风。",
    stops: ["Sydney Opera House", "The Rocks", "Single O Surry Hills"],
  },
  {
    day: "Day 4 - 6",
    city: "Gold Coast",
    title: "海岸日落与冲浪长线",
    date: "10月中旬",
    pace: "海边慢行",
    summary: "Bondi 式的海浪情绪延伸到黄金海岸，留给日落和海鲜。",
    stops: ["Burleigh Heads", "Surfers Paradise", "海滨晚餐"],
  },
  {
    day: "Day 7 - 8",
    city: "Brisbane",
    title: "河岸城市与轻松过渡",
    date: "10月中旬",
    pace: "城市补给",
    summary: "把节奏放慢，补给、咖啡、河岸散步，为北上大堡礁留体力。",
    stops: ["South Bank", "Fortitude Valley", "城市咖啡"],
  },
  {
    day: "Day 9 - 12",
    city: "Great Barrier Reef",
    title: "大堡礁蓝色召唤",
    date: "10月下旬",
    pace: "重点体验",
    summary: "浮潜、珊瑚、海龟与玻璃船，用一整天留给海。",
    stops: ["Reef Cruise", "Green Island", "海上日落"],
  },
];

const cards = [
  {
    id: "opera",
    type: "景点",
    city: "Sydney",
    title: "Sydney Opera House",
    place: "悉尼",
    image: assets.sydney,
    note: "傍晚抵达最稳，白色帆顶会被落日照出很柔的边。",
    tags: ["地标", "建筑", "海港"],
    status: "必去",
    saved: true,
  },
  {
    id: "bondi",
    type: "景点",
    city: "Gold Coast",
    title: "Burleigh Heads",
    place: "黄金海岸",
    image: assets.coast,
    note: "适合把节奏放慢，沿海岸线走一段，再等一场橙色日落。",
    tags: ["海岸", "日落", "散步"],
    status: "备选",
    saved: false,
  },
  {
    id: "icebergs",
    type: "餐厅",
    city: "Sydney",
    title: "海边生蚝晚餐",
    place: "悉尼",
    image: assets.seafood,
    note: "把海鲜安排在第一段城市行程里，既有仪式感也不赶。",
    tags: ["海鲜", "晚餐", "预约"],
    status: "已预订",
    saved: true,
  },
  {
    id: "coffee",
    type: "咖啡",
    city: "Sydney",
    title: "Single O Surry Hills",
    place: "悉尼",
    image: assets.coffee,
    note: "适合作为城市漫游的起点，先喝一杯再去海港。",
    tags: ["咖啡", "早餐", "本地人爱去"],
    status: "必去",
    saved: false,
  },
  {
    id: "reef",
    type: "体验",
    city: "Great Barrier Reef",
    title: "Great Barrier Reef Cruise",
    place: "大堡礁",
    image: assets.reef,
    note: "十月海况通常舒服，把这天留得完整一点，别排太满。",
    tags: ["浮潜", "海龟", "一日游"],
    status: "必去",
    saved: true,
  },
];

const cityChapters = [
  {
    city: "Sydney",
    cn: "悉尼",
    tone: "海港、咖啡、第一阵暖风",
    days: "Day 1 - 3",
    image: assets.sydney,
    picks: ["Sydney Opera House", "Surry Hills", "The Rocks"],
  },
  {
    city: "Gold Coast",
    cn: "黄金海岸",
    tone: "长海岸线、日落与慢速下午",
    days: "Day 4 - 6",
    image: assets.coast,
    picks: ["Burleigh Heads", "Surfers Paradise", "海边晚餐"],
  },
  {
    city: "Brisbane",
    cn: "布里斯班",
    tone: "河岸城市、补给、轻松中转",
    days: "Day 7 - 8",
    image: assets.coffee,
    picks: ["South Bank", "Fortitude Valley", "城市咖啡"],
  },
  {
    city: "Great Barrier Reef",
    cn: "大堡礁",
    tone: "珊瑚、海龟、蓝色透明的一天",
    days: "Day 9 - 12",
    image: assets.reef,
    picks: ["Reef Cruise", "Green Island", "浮潜体验"],
  },
];

function getTypeIcon(type) {
  if (type === "餐厅") return <ForkKnife size={16} weight="duotone" />;
  if (type === "咖啡") return <Coffee size={16} weight="duotone" />;
  if (type === "体验") return <Waves size={16} weight="duotone" />;
  return <Camera size={16} weight="duotone" />;
}

export function App() {
  const [activeView, setActiveView] = useState("home");
  const [activeDay, setActiveDay] = useState(dayPlan[0].day);
  const [activeCity, setActiveCity] = useState("Sydney");
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
          <h1>向海而行<br />追逐暖风</h1>
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
          <figure className="stamp-photo">
            <img src={assets.reef} alt="大堡礁海龟与珊瑚" />
            <figcaption>10 OCT / QUEENSLAND</figcaption>
          </figure>
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
            <CityDetail chapter={selectedCity} />
          ) : (
            <HomeOverview
              activeView={activeView}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              visibleCards={visibleCards}
              expandedCard={expandedCard}
              setExpandedCard={setExpandedCard}
              savedIds={savedIds}
              toggleSaved={toggleSaved}
            />
          )}
        </div>
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
  visibleCards,
  expandedCard,
  setExpandedCard,
  savedIds,
  toggleSaved,
}) {
  return (
    <>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">
            {activeView === "saved" ? "我的收藏" : "精选停靠点"}
          </p>
          <h2>
            {activeView === "saved"
              ? "先把心动的地方收进同一页"
              : "从悉尼到礁湖，挑出每天最值得停下来的地方"}
          </h2>
        </div>
        <div className="panel-actions">
          <button>
            <Heart size={18} weight="duotone" />
            我的收藏
          </button>
          <button>
            <Funnel size={18} weight="duotone" />
            筛选
          </button>
          <button>
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
            onExpand={() => setExpandedCard(expandedCard === card.id ? "" : card.id)}
            onSave={() => toggleSaved(card.id)}
          />
        ))}
      </div>
    </>
  );
}

function PlaceCard({ card, isExpanded, isSaved, onExpand, onSave }) {
  return (
    <article className="place-card">
      <div className="card-media">
        <img src={card.image} alt={card.title} />
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
        <h3>{card.title}</h3>
        <p className="location">
          <MapPin size={15} weight="duotone" />
          {card.place}
        </p>
        <p>{card.note}</p>
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
            <span>建议提前确认营业时间和预约状态，现场以当日安排为准。</span>
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
          <strong>{day.date} · {day.pace}</strong>
          <span>这一页之后可以接真实航班、酒店、票务和地址。</span>
        </div>
      </div>
    </section>
  );
}

function CityDetail({ chapter }) {
  return (
    <section className="city-view">
      <img src={chapter.image} alt={`${chapter.cn}章节照片`} />
      <div>
        <p className="eyebrow">{chapter.days}</p>
        <h2>{chapter.cn} / {chapter.city}</h2>
        <p>{chapter.tone}</p>
        <div className="city-picks">
          {chapter.picks.map((pick) => (
            <span key={pick}>
              <Star size={15} weight="duotone" />
              {pick}
            </span>
          ))}
        </div>
        <button className="chapter-button">
          <BookmarkSimple size={18} weight="duotone" />
          保存这个城市章节
        </button>
      </div>
    </section>
  );
}
