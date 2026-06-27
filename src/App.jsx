import { useEffect, useMemo } from "react";
import { SpeakerHigh, SpeakerSlash, Target, Waveform } from "@phosphor-icons/react";
import { HolographicMapScene } from "./components/HolographicMapScene.jsx";
import { travelCountries, travelLocations } from "./data/travelData.js";
import { useWorkspaceStore } from "./store/workspaceStore.js";

export function App() {
  const viewState = useWorkspaceStore((state) => state.viewState);
  const selectedCountryId = useWorkspaceStore((state) => state.selectedCountryId);
  const selectedCityId = useWorkspaceStore((state) => state.selectedCityId);
  const hudPhotoArmed = useWorkspaceStore((state) => state.hudPhotoArmed);
  const booting = useWorkspaceStore((state) => state.booting);
  const soundOn = useWorkspaceStore((state) => state.soundOn);
  const startBoot = useWorkspaceStore((state) => state.startBoot);
  const finishBoot = useWorkspaceStore((state) => state.finishBoot);
  const resetToWorld = useWorkspaceStore((state) => state.resetToWorld);
  const selectCity = useWorkspaceStore((state) => state.selectCity);
  const toggleHudPhoto = useWorkspaceStore((state) => state.toggleHudPhoto);
  const toggleSound = useWorkspaceStore((state) => state.toggleSound);

  useEffect(() => {
    const seenBoot = sessionStorage.getItem("holo-travel-booted");
    if (seenBoot) return undefined;
    sessionStorage.setItem("holo-travel-booted", "1");
    startBoot();
    const timer = window.setTimeout(finishBoot, 2900);
    return () => window.clearTimeout(timer);
  }, [finishBoot, startBoot]);

  const selectedCountry =
    travelCountries.find((country) => country.id === selectedCountryId) ?? travelCountries[0];
  const activeLocation =
    travelLocations.find((location) => location.id === selectedCityId) ?? travelLocations[0];

  const groupedGuide = useMemo(() => {
    return activeLocation.guideItems.reduce((groups, item) => {
      if (!groups[item.tag]) groups[item.tag] = [];
      groups[item.tag].push(item);
      return groups;
    }, {});
  }, [activeLocation]);

  return (
    <main className={`holo-shell ${viewState === "COUNTRY" ? "is-country-mode" : ""}`}>
      {booting && (
        <div className="boot-sequence" aria-hidden="true">
          <div className="earth-dive" />
          <p>BOOT / personal-footprint-system / map lock acquired</p>
        </div>
      )}

      <header className="system-header">
        <button className="system-brand" onClick={resetToWorld}>
          <Waveform size={18} weight="duotone" />
          <span>FOOTPRINT ARCHIVE</span>
        </button>

        {viewState === "COUNTRY" && (
          <button className="world-return" onClick={resetToWorld}>
            ← 世界
          </button>
        )}

        <button
          className={soundOn ? "sound-toggle is-on" : "sound-toggle"}
          aria-label={soundOn ? "关闭声音" : "开启声音"}
          onClick={toggleSound}
        >
          {soundOn ? <SpeakerHigh size={18} weight="duotone" /> : <SpeakerSlash size={18} weight="duotone" />}
        </button>
      </header>

      <section className="holo-stage" aria-label="个人足迹全息地图">
        <HolographicMapScene />

        {viewState === "WORLD" && (
          <div className="world-hint">
            <span>LOW ANGLE WORLD DECK</span>
            <strong>点击城市节点进入国家屏幕</strong>
          </div>
        )}

        {viewState === "COUNTRY" && (
          <CountryDossier
            country={selectedCountry}
            location={activeLocation}
            groupedGuide={groupedGuide}
            hudPhotoArmed={hudPhotoArmed}
            onToggleHud={toggleHudPhoto}
            onSelectCity={selectCity}
          />
        )}
      </section>
    </main>
  );
}

function CountryDossier({ country, location, groupedGuide, hudPhotoArmed, onToggleHud, onSelectCity }) {
  return (
    <aside className="location-dossier">
      <div className="dossier-heading">
        <span>
          {country.code} / {location.date} / {location.days}
        </span>
        <h1>{location.cn}</h1>
        <p>{location.note}</p>
      </div>

      <div className="city-switcher" aria-label={`${country.cn}城市节点`}>
        {country.locations.map((item) => (
          <button
            key={item.id}
            className={item.id === location.id ? "is-active" : ""}
            onClick={() => onSelectCity(item.id)}
          >
            <span>{item.name}</span>
            <strong>{item.cn}</strong>
          </button>
        ))}
      </div>

      <div
        className={hudPhotoArmed ? "hud-photo is-armed" : "hud-photo"}
        onClick={onToggleHud}
        role="button"
        tabIndex="0"
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") onToggleHud();
        }}
        aria-label="查看照片 HUD 标注"
      >
        <img src={location.image} alt={location.name} />
        <svg className="hud-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {location.annotations.map((annotation, index) => (
            <g key={annotation.label} style={{ transitionDelay: `${index * 90}ms` }}>
              <circle cx={annotation.x} cy={annotation.y} r="1.4" />
              <polyline points={`${annotation.x},${annotation.y} ${Math.min(annotation.x + 14, 92)},${Math.max(annotation.y - 12, 8)} ${Math.min(annotation.x + 30, 96)},${Math.max(annotation.y - 12, 8)}`} />
            </g>
          ))}
        </svg>
        <div className="photo-scan-line" />
        {location.annotations.map((annotation, index) => (
          <div
            key={annotation.label}
            className="hud-annotation"
            style={{
              left: `${Math.min(annotation.x + 31, 72)}%`,
              top: `${Math.max(annotation.y - 15, 8)}%`,
              transitionDelay: `${index * 90 + 120}ms`,
            }}
          >
            {annotation.label}
          </div>
        ))}
      </div>

      <div className="guide-matrix">
        {Object.entries(groupedGuide).map(([tag, items]) => (
          <section key={tag} className="guide-group">
            <span>{tag}</span>
            {items.map((item) => (
              <article key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </article>
            ))}
          </section>
        ))}
      </div>

      <div className="private-note">
        <Target size={16} weight="duotone" />
        <span>私人笔记</span>
        <p>视觉理性，文字保持第一人称；公开分享时也能读懂，但这里仍然是自己的档案。</p>
      </div>
    </aside>
  );
}
