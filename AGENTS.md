# Prototype Instructions

Run the local server yourself and open the preview in the in-app browser. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Prototype Direction

- Build target: personal travel website as a Jarvis-like holographic footprint archive.
- Core engine: React + React Three Fiber + Drei for the WebGL world deck, GSAP for camera dive/tilt animation, Zustand for view and selection state, Tailwind CSS plus custom CSS for HUD panels, and local JSON/JS data for now.
- Map direction: do not use images as the map. Render the world map in WebGL from real vector country outlines, not dot-matrix points. Keep the map language high-tech and holographic: dark ocean, cyan outlines, subtle low-saturation terrain layers, and independent glowing visited-city nodes.
- Country-screen direction: the raised purple screen is only the spatial container for the selected country map. The selected country's map should keep the same holographic style as the world map rather than becoming a conventional bright geographic map.
- Navigation direction: default is WORLD, a low-angle ground-map view. Selecting a visited city/country changes to COUNTRY by animating the PerspectiveCamera with GSAP; the world deck remains present as the visual floor reference.
- UI direction: keep text and guides as readable HTML/HUD panels. Use Drei `Html` only for spatial labels that need to follow 3D coordinates.
- HUD photo direction: key photos use an SVG overlay for annotation dots and draw-on leader lines; mobile uses click/tap instead of hover.
- Homepage constraints: no hover previews, no filters, no permanent stats strip. Keep the title quiet and the return action as an explicit "← 世界" control.
