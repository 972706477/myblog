Source: https://github.com/DavidHDev/canvas-ui
Additional official registries: https://canvasui.dev/r/glass-react.json and https://canvasui.dev/r/particle-reveal-react.json
The visible interactive panel now uses https://canvasui.dev/r/asciify-react.json with source="gradient". It draws independently of HTML-in-canvas, leaves all text and covers outside the effect, and includes pause and reduced-motion handling.
Glass and ParticleReveal are converted using the same Next.js Babel pipeline. QuietEffects limits them to mouse hover and respects reduced motion. Ripple is retained as source but no longer mounted on the featured project.
Registry: https://canvasui.dev/r/ripple-react.json
Official Ripple React source converted from TypeScript with Next.js Babel.
Reduced motion, unsupported-browser fallback and cleanup are provided by the upstream component.
