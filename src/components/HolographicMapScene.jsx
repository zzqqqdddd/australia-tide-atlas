import { Html } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { geoMercator } from "d3-geo";
import { gsap } from "gsap";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { australiaLandPolygons } from "../data/australiaMapData.js";
import { travelCountries, travelLocations } from "../data/travelData.js";
import { worldCountries } from "../data/worldMapData.js";
import { useWorkspaceStore } from "../store/workspaceStore.js";

const projection = geoMercator().scale(154).translate([500, 280]).rotate([-130, 0]).precision(0.1);
const worldScale = 0.115;

export const projectToWorld = (coords) => {
  const [x, y] = projection(coords);
  return new THREE.Vector3((x - 500) * worldScale, 0, (y - 280) * worldScale);
};

const countryBounds = {
  minLon: 112,
  maxLon: 156,
  minLat: -44.5,
  maxLat: -9.2,
  width: 460,
  height: 278,
};

const projectToCountrySvg = ([lon, lat]) => {
  const x = ((lon - countryBounds.minLon) / (countryBounds.maxLon - countryBounds.minLon)) * countryBounds.width;
  const y = ((countryBounds.maxLat - lat) / (countryBounds.maxLat - countryBounds.minLat)) * countryBounds.height;
  return [x, y];
};

const pathFromCoords = (points) =>
  points
    .map((point, index) => {
      const [x, y] = projectToCountrySvg(point);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ") + " Z";

const terrainPath = (points) =>
  points
    .map((point, index) => {
      const [x, y] = projectToCountrySvg(point);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ") + " Z";

const stateBoundaryLines = [
  [
    [129, -13],
    [129, -31.8],
  ],
  [
    [138, -17.5],
    [138, -26],
    [141, -26],
    [141, -38],
  ],
  [
    [141, -28.8],
    [153.2, -28.8],
  ],
  [
    [129, -31.8],
    [141, -31.8],
  ],
  [
    [138, -34],
    [141, -34],
    [145.4, -36.8],
  ],
];

const worldTerrainColor = (ring) => {
  const centroid = ring.reduce(
    (acc, point) => [acc[0] + point[0] / ring.length, acc[1] + point[1] / ring.length],
    [0, 0],
  );
  const [lon, lat] = centroid;
  const tropics = Math.abs(lat) < 23;
  const dryBelt = Math.abs(lat) >= 18 && Math.abs(lat) < 36;
  if (dryBelt && ((lon > -20 && lon < 55) || (lon > 112 && lon < 146) || (lon > -120 && lon < -95))) {
    return "#5b5135";
  }
  if (tropics) return "#1f5f55";
  if (Math.abs(lat) > 55) return "#435d69";
  return "#335f4f";
};

const drawProjectedRing = (context, ring, width, height) => {
  if (ring.length < 3) return;
  context.beginPath();
  ring.forEach((coords, index) => {
    const [x, y] = projection(coords);
    const px = (x / 1000) * width;
    const py = (y / 560) * height;
    if (index === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  });
  context.closePath();
};

const buildWorldTexture = () => {
  const width = 2048;
  const height = 1148;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  context.fillStyle = "#071425";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "rgba(46, 230, 255, 0.09)";
  context.lineWidth = 1;
  for (let x = 0; x <= width; x += 48) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let y = 0; y <= height; y += 48) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  worldCountries.forEach((country) => {
    country.rings.forEach((ring) => {
      if (ring.length < 4) return;
      drawProjectedRing(context, ring, width, height);
      context.fillStyle = worldTerrainColor(ring);
      context.globalAlpha = 0.74;
      context.fill();
      context.globalAlpha = 1;
      context.strokeStyle = "rgba(46, 230, 255, 0.58)";
      context.lineWidth = 1.3;
      context.stroke();
    });
  });

  const vignette = context.createRadialGradient(width * 0.5, height * 0.48, height * 0.2, width * 0.5, height * 0.5, height * 0.82);
  vignette.addColorStop(0, "rgba(46, 230, 255, 0.09)");
  vignette.addColorStop(0.72, "rgba(5, 8, 16, 0.08)");
  vignette.addColorStop(1, "rgba(5, 8, 16, 0.68)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
};

function WorldTextureMap() {
  const texture = useMemo(buildWorldTexture, []);
  const viewState = useWorkspaceStore((state) => state.viewState);
  const opacity = viewState === "COUNTRY" ? 0.36 : 0.74;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
      <planeGeometry args={[115, 64.4]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

function AustraliaMapSvg({ country, selectedCityId, onSelectCity }) {
  const landPaths = useMemo(() => australiaLandPolygons.map((polygon) => pathFromCoords(polygon.points)), []);
  const clipId = "australia-country-clip";

  return (
    <svg className="country-map-svg" viewBox={`0 0 ${countryBounds.width} ${countryBounds.height}`} role="img">
      <defs>
        <linearGradient id="countryOcean" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0B2B45" />
          <stop offset="55%" stopColor="#0A1F36" />
          <stop offset="100%" stopColor="#071425" />
        </linearGradient>
        <linearGradient id="countryLand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#275F55" />
          <stop offset="52%" stopColor="#5B5135" />
          <stop offset="100%" stopColor="#2D6A59" />
        </linearGradient>
        <pattern id="countryGrid" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M22 0H0V22" fill="none" stroke="rgba(46,230,255,0.16)" strokeWidth="0.6" />
        </pattern>
        <clipPath id={clipId}>
          {landPaths.map((path, index) => (
            <path key={`clip-${index}`} d={path} />
          ))}
        </clipPath>
      </defs>

      <rect width={countryBounds.width} height={countryBounds.height} fill="url(#countryOcean)" />
      <rect width={countryBounds.width} height={countryBounds.height} fill="url(#countryGrid)" />
      <g className="australia-land">
        {landPaths.map((path, index) => (
          <path key={`land-${index}`} d={path} />
        ))}
      </g>

      <g clipPath={`url(#${clipId})`} className="terrain-overlays">
        <path
          className="terrain-desert"
          d={terrainPath([
            [119, -18],
            [131, -14],
            [142, -19],
            [146, -27],
            [135, -34],
            [121, -33],
            [115, -27],
          ])}
        />
        <path
          className="terrain-green"
          d={terrainPath([
            [145, -11],
            [154, -23],
            [153, -36],
            [146, -39],
            [142, -34],
            [147, -27],
            [149, -19],
          ])}
        />
        <path
          className="terrain-green"
          d={terrainPath([
            [114, -33],
            [123, -36],
            [131, -35],
            [131, -32],
            [120, -30],
          ])}
        />
        <path
          className="terrain-relief"
          d={terrainPath([
            [146, -18],
            [151, -24],
            [149, -31],
            [145, -36],
            [142, -35],
            [145, -28],
            [143, -22],
          ])}
        />
      </g>

      <g className="state-lines">
        {stateBoundaryLines.map((line, index) => {
          const points = line
            .map((point) => {
              const [x, y] = projectToCountrySvg(point);
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(" ");
          return <polyline key={`state-${index}`} points={points} />;
        })}
      </g>

      <g className="sea-labels" aria-hidden="true">
        <text x="55" y="42">Timor Sea</text>
        <text x="366" y="74">Coral Sea</text>
        <text x="198" y="246">Great Australian Bight</text>
      </g>

      <g className="country-city-pins">
        {country.locations.map((location) => {
          const [x, y] = projectToCountrySvg(location.coords);
          const isActive = location.id === selectedCityId;
          const labelOnLeft = x > countryBounds.width - 78;
          return (
            <g key={location.id} className={isActive ? "is-active" : ""} onClick={() => onSelectCity(location.id)}>
              <circle className="pin-pulse" cx={x} cy={y} r="12" />
              <circle className="pin-core" cx={x} cy={y} r="4.8" />
              <text x={labelOnLeft ? x - 9 : x + 9} y={y + 4} textAnchor={labelOnLeft ? "end" : "start"}>
                {location.cn}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
function CameraRig() {
  const { camera } = useThree();
  const viewState = useWorkspaceStore((state) => state.viewState);
  const selectedCountryId = useWorkspaceStore((state) => state.selectedCountryId);
  const booting = useWorkspaceStore((state) => state.booting);
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    camera.position.set(0, 44, 42);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    if (!booting) return undefined;
    camera.position.set(0, 168, 24);
    currentTarget.current.set(0, 0, 0);
    const tween = gsap.to(camera.position, {
      x: 0,
      y: 44,
      z: 42,
      duration: 2.35,
      ease: "power4.inOut",
      onUpdate: () => camera.lookAt(currentTarget.current),
    });
    return () => tween.kill();
  }, [booting, camera]);

  useEffect(() => {
    if (booting) return undefined;
    const country = travelCountries.find((item) => item.id === selectedCountryId) ?? travelCountries[0];
    const focus = viewState === "COUNTRY" ? projectToWorld(country.coords) : new THREE.Vector3(0, 0, 0);
    const targetCamera =
      viewState === "COUNTRY"
        ? { x: focus.x - 2, y: 25, z: focus.z + 25 }
        : { x: 0, y: 44, z: 42 };
    const timeline = gsap.timeline({
      defaults: { duration: 1.25, ease: "power3.inOut" },
      onUpdate: () => camera.lookAt(currentTarget.current),
    });
    timeline.to(camera.position, targetCamera, 0);
    timeline.to(currentTarget.current, { x: focus.x, y: 0, z: focus.z }, 0);
    return () => timeline.kill();
  }, [booting, camera, selectedCountryId, viewState]);

  return null;
}

function RouteFlow() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uColorA: { value: new THREE.Color("#2EE6FF") },
          uColorB: { value: new THREE.Color("#FFAB4D") },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying vec2 vUv;
          void main() {
            float dash = smoothstep(0.55, 0.62, fract(vUv.x * 18.0 - uTime * 0.72));
            float core = smoothstep(0.5, 0.0, abs(vUv.y - 0.5));
            vec3 color = mix(uColorA, uColorB, vUv.x);
            gl_FragColor = vec4(color, dash * core * 0.86);
          }
        `,
      }),
    [],
  );
  const geometry = useMemo(() => {
    const points = travelLocations.map((location, index) => {
      const point = projectToWorld(location.coords);
      point.y = 0.18 + index * 0.02;
      return point;
    });
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 180, 0.045, 8, false);
  }, []);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
  });

  return <mesh geometry={geometry} material={material} />;
}

function CityNode({ location }) {
  const selectCity = useWorkspaceStore((state) => state.selectCity);
  const selectedCityId = useWorkspaceStore((state) => state.selectedCityId);
  const viewState = useWorkspaceStore((state) => state.viewState);
  const ringRef = useRef(null);
  const position = useMemo(() => projectToWorld(location.coords), [location.coords]);
  const isActive = selectedCityId === location.id;

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.4) * 0.22;
    ringRef.current.scale.setScalar(isActive ? pulse * 1.5 : pulse);
    ringRef.current.material.opacity = isActive ? 0.38 : 0.16;
  });

  return (
    <group position={[position.x, 0.35, position.z]}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.56, 48]} />
        <meshBasicMaterial color={isActive ? "#FFAB4D" : "#2EE6FF"} transparent opacity={0.2} />
      </mesh>
      <mesh onClick={() => selectCity(location.id)}>
        <sphereGeometry args={[0.32, 24, 16]} />
        <meshBasicMaterial color={isActive ? "#FFAB4D" : "#2EE6FF"} />
      </mesh>
      {(isActive || viewState === "COUNTRY") && (
        <Html transform position={[0.1, 0.92, 0]} distanceFactor={12} zIndexRange={[12, 0]}>
          <button className="node-html-label" onClick={() => selectCity(location.id)}>
            <span>{location.days}</span>
            <strong>{location.cn}</strong>
          </button>
        </Html>
      )}
    </group>
  );
}

function CountryMapScreen() {
  const viewState = useWorkspaceStore((state) => state.viewState);
  const selectedCountryId = useWorkspaceStore((state) => state.selectedCountryId);
  const selectedCityId = useWorkspaceStore((state) => state.selectedCityId);
  const selectCity = useWorkspaceStore((state) => state.selectCity);
  const country = travelCountries.find((item) => item.id === selectedCountryId) ?? travelCountries[0];
  const position = useMemo(() => projectToWorld(country.coords), [country.coords]);
  if (viewState !== "COUNTRY") return null;

  return (
    <Html transform position={[position.x - 6.4, 5.1, position.z - 3]} distanceFactor={14.2} zIndexRange={[10, 0]}>
      <div className="country-map-screen">
        <div className="country-screen-heading">
          <span>{country.code} / COUNTRY SCREEN</span>
          <strong>{country.cn}</strong>
          <small>先看国家地图，再进入城市档案</small>
        </div>
        <AustraliaMapSvg country={country} selectedCityId={selectedCityId} onSelectCity={selectCity} />
      </div>
    </Html>
  );
}

function GroundGrid() {
  return (
    <group>
      <gridHelper args={[92, 46, "#0D2C3B", "#071624"]} position={[0, -0.02, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[98, 56]} />
        <meshBasicMaterial color="#050810" transparent opacity={0.58} />
      </mesh>
    </group>
  );
}

function SceneContents() {
  return (
    <>
      <CameraRig />
      <color attach="background" args={["#050810"]} />
      <fog attach="fog" args={["#050810", 42, 112]} />
      <ambientLight intensity={0.85} />
      <pointLight color="#2EE6FF" intensity={1.8} position={[0, 20, 16]} />
      <GroundGrid />
      <WorldTextureMap />
      <RouteFlow />
      {travelLocations.map((location) => (
        <CityNode key={location.id} location={location} />
      ))}
      <CountryMapScreen />
    </>
  );
}

export function HolographicMapScene() {
  return (
    <Canvas
      className="holo-canvas"
      camera={{ fov: 42, near: 0.1, far: 260, position: [0, 44, 42] }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      <SceneContents />
    </Canvas>
  );
}
