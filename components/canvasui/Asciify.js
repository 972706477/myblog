"use strict";
"use client";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Asciify = Asciify;
exports.buildAsciifyAtlas = buildAsciifyAtlas;
exports.buildAsciifyRamp = buildAsciifyRamp;
exports.createAsciify = createAsciify;
exports["default"] = void 0;
exports.supportsHtmlInCanvas = supportsHtmlInCanvas;
var _react = _interopRequireWildcard(require("react"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _excluded = ["children", "fixed", "className", "style"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var __jsx = _react["default"].createElement;
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var canvasDimensionLimits = new WeakMap();
function getCanvasPixelRatio(element, context) {
  var _window$visualViewpor;
  var scale = ((_window$visualViewpor = window.visualViewport) === null || _window$visualViewpor === void 0 ? void 0 : _window$visualViewpor.scale) || 1;
  var requested = Math.min(window.devicePixelRatio || 1, 2) * scale;
  var width = Math.max(element.clientWidth, 1);
  var height = Math.max(element.clientHeight, 1);
  var maxDimension = 8192;
  if (context) {
    var limit = canvasDimensionLimits.get(context);
    if (limit === undefined) {
      limit = Math.min(maxDimension, context.getParameter(context.MAX_TEXTURE_SIZE), context.getParameter(context.MAX_RENDERBUFFER_SIZE));
      canvasDimensionLimits.set(context, limit);
    }
    maxDimension = limit;
  }
  return Math.min(requested, maxDimension / Math.max(width, height), Math.sqrt(16777216 / (width * height)));
}
function createCanvasResizeObserver(onResize) {
  var viewport = window.visualViewport;
  var frame = 0;
  var disconnected = false;
  var schedule = function schedule() {
    if (frame || disconnected) return;
    frame = requestAnimationFrame(function () {
      frame = 0;
      onResize();
    });
  };
  var observer = new ResizeObserver(schedule);
  window.addEventListener("resize", schedule, {
    passive: true
  });
  viewport === null || viewport === void 0 || viewport.addEventListener("resize", schedule, {
    passive: true
  });
  return {
    observe: function observe(element, options) {
      observer.observe(element, options);
    },
    unobserve: function unobserve(element) {
      observer.unobserve(element);
    },
    disconnect: function disconnect() {
      disconnected = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      viewport === null || viewport === void 0 || viewport.removeEventListener("resize", schedule);
    }
  };
}
function isHtmlInCanvasBlocked() {
  var _userAgentData;
  if (typeof navigator === "undefined") return false;
  var platform = (_userAgentData = navigator.userAgentData) === null || _userAgentData === void 0 ? void 0 : _userAgentData.platform;
  return platform === "Android" || /Android/i.test(navigator.userAgent);
}
function prepareHtmlInCanvas(source, content) {
  if ("content" in source) {
    source.setAttribute("content", "drawable");
    content.setAttribute("drawable", "");
  } else {
    source.setAttribute("layoutsubtree", "");
  }
}
var captureBackdrops = new WeakMap();
function captureBackdrop(source) {
  var now = performance.now();
  var cached = captureBackdrops.get(source);
  if (cached && now - cached.at < 500) return cached.layers;
  var layers = [];
  for (var node = source; node; node = node.parentElement) {
    var color = getComputedStyle(node).backgroundColor;
    var alpha = 1;
    if (!color || color === "transparent") {
      alpha = 0;
    } else {
      var _rgba$1$split$;
      var slash = /\/\s*([\d.]+)(%?)\s*\)$/.exec(color);
      var rgba = /^rgba\(([^)]+)\)$/.exec(color);
      if (slash) alpha = Number(slash[1]) / (slash[2] ? 100 : 1);else if (rgba) alpha = Number((_rgba$1$split$ = rgba[1].split(",")[3]) !== null && _rgba$1$split$ !== void 0 ? _rgba$1$split$ : 1);
    }
    if (!(alpha > 0)) continue;
    layers.unshift(color);
    if (alpha >= 1) break;
  }
  captureBackdrops.set(source, {
    at: now,
    layers: layers
  });
  return layers;
}
function drawHtmlInCanvas(source, context, content) {
  var fillBackdrop = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (fillBackdrop) {
    var _iterator = _createForOfIteratorHelper(captureBackdrop(source)),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var color = _step.value;
        context.fillStyle = color;
        context.fillRect(0, 0, source.width, source.height);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  var transform = context.drawElementImage(content, 0, 0);
  var canvas = source;
  if (transform && typeof canvas.updateElementGeometry === "function") {
    canvas.updateElementGeometry(content, {
      canvasTransform: transform
    });
  }
}
function resolveOptions(defaults, options) {
  var resolved = {};
  for (var _i = 0, _arr = Object.keys(options); _i < _arr.length; _i++) {
    var key = _arr[_i];
    var value = options[key];
    resolved[key] = value === undefined ? defaults[key] : value;
  }
  return resolved;
}
var DEFAULTS = {
  source: "gradient",
  colors: [],
  characters: " .-=+xX0S8#@",
  fontFamily: '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  cellSize: 12,
  radius: 140,
  trail: 0.9,
  flow: 0.5,
  density: 0.75,
  opacity: 1,
  contrast: 1,
  glow: 0.6,
  depth: 0.3,
  flicker: 0.5,
  grain: 0.15,
  veil: 0.35,
  background: "auto",
  click: "wave",
  ambient: 0,
  keepText: true
};
var DARK_RAMP = ["#1e3fd8", "#38bdf8", "#a5d8ff", "#f6f8ff"];
var LIGHT_RAMP = ["#a5d8ff", "#38bdf8", "#1e3fd8", "#0b1d6e"];
var MAX_TRAIL = 48;
var MAX_CLICKS = 4;
var HALO_SCALE = 4;
var WAVE_LIFE = 1.6;
var BURST_LIFE = 1.1;
var VERT = "#version 300 es\nlayout(location = 0) in vec2 aPos;\nvoid main () {\n  gl_Position = vec4(aPos, 0.0, 1.0);\n}";
var COMMON = "\nfloat hash12 (vec2 p) {\n  vec3 q = fract(vec3(p.xyx) * 0.1031);\n  q += dot(q, q.yzx + 33.33);\n  return fract((q.x + q.y) * q.z);\n}\n\nfloat luma (vec3 c) {\n  return dot(c, vec3(0.2126, 0.7152, 0.0722));\n}\n";
var FIELD = "#version 300 es\nprecision highp float;\nout vec4 outColor;\nuniform vec2 uGrid;\nuniform vec2 uCell;\nuniform vec4 uTrail[".concat(MAX_TRAIL, "];\nuniform int uTrailCount;\nuniform vec4 uClicks[").concat(MAX_CLICKS, "];\nuniform int uClickMode;\nuniform float uRadius;\nuniform float uAmbient;\nuniform float uFlow;\nuniform float uTime;\nuniform float uSeed;\n").concat(COMMON, "\nfloat noise (vec2 p) {\n  vec2 i = floor(p);\n  vec2 f = fract(p);\n  vec2 u = f * f * (3.0 - 2.0 * f);\n  float a = hash12(i);\n  float b = hash12(i + vec2(1.0, 0.0));\n  float c = hash12(i + vec2(0.0, 1.0));\n  float d = hash12(i + vec2(1.0, 1.0));\n  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);\n}\n\nfloat segment (vec2 p, vec2 a, vec2 b, out float h) {\n  vec2 pa = p - a;\n  vec2 ba = b - a;\n  h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);\n  return length(pa - ba * h);\n}\n\nvoid main () {\n  vec2 cell = vec2(floor(gl_FragCoord.x), uGrid.y - 1.0 - floor(gl_FragCoord.y));\n  vec2 p = (cell + 0.5) * uCell;\n  vec2 q = p / uRadius;\n  vec2 warp = vec2(\n    noise(q * 1.3 + vec2(uTime * 0.4, 0.0) + uSeed * 5.0),\n    noise(q * 1.3 + vec2(7.1, -uTime * 0.35) + uSeed * 9.0)\n  ) - 0.5;\n  warp += (vec2(\n    noise(q * 3.1 - vec2(0.0, uTime * 0.7) + 3.7),\n    noise(q * 3.1 + vec2(uTime * 0.6, 11.3))\n  ) - 0.5) * 0.45;\n  vec2 pw = p + warp * uRadius * 0.9 * uFlow;\n  float t = 0.0;\n  for (int i = 0; i < ").concat(MAX_TRAIL, "; i++) {\n    if (i >= uTrailCount) break;\n    vec4 a = uTrail[i];\n    vec4 b = i + 1 < uTrailCount ? uTrail[i + 1] : a;\n    if (b.w < 0.0) b = a;\n    float h;\n    float d = segment(pw, a.xy, b.xy, h);\n    float r = max(mix(abs(a.w), abs(b.w), h), 1.0);\n    float k = d / r;\n    t = max(t, mix(a.z, b.z, h) * exp(-k * k * 2.2));\n  }\n  float scramble = t * (1.0 - t) * 2.4;\n  for (int i = 0; i < ").concat(MAX_CLICKS, "; i++) {\n    vec4 c = uClicks[i];\n    if (c.w <= 0.0) continue;\n    float d = length(p - c.xy);\n    float grow = 1.0 - exp(-c.z * 2.2);\n    float wobble = 0.7 + 0.3 * noise((p - c.xy) / uRadius * 1.6 + c.z * 0.8 + uSeed * 7.0);\n    float v = 0.0;\n    if (uClickMode == 1) {\n      float ring = uRadius * (0.15 + 3.4 * grow);\n      float width = uRadius * (0.4 + 0.5 * grow);\n      float x = (d - ring) / width;\n      float profile = x > 0.0 ? exp(-x * x * 1.8) : exp(-x * x * 0.8);\n      v = profile * wobble * 0.6 * c.w * smoothstep(0.0, 0.12, c.z);\n    } else if (uClickMode == 2) {\n      float size = uRadius * (0.4 + 1.0 * (1.0 - exp(-c.z * 5.0)));\n      float x = d / size;\n      v = exp(-x * x * 2.2) * wobble * 0.75 * c.w * smoothstep(0.0, 0.08, c.z);\n    }\n    t = max(t, v);\n    scramble = max(scramble, v * 0.5);\n  }\n  if (uAmbient > 0.0) {\n    vec2 q = cell * 0.06 + uSeed * 13.0;\n    float n = noise(q + vec2(uTime * 0.05, -uTime * 0.03));\n    n = 0.65 * n + 0.35 * noise(q * 2.1 - vec2(uTime * 0.04, uTime * 0.06));\n    t = max(t, smoothstep(0.42, 0.85, n) * uAmbient * 0.75);\n  }\n  outColor = vec4(clamp(t, 0.0, 1.0), clamp(scramble, 0.0, 1.0), 0.0, 1.0);\n}");
var CELLS = "#version 300 es\nprecision highp float;\nout vec4 outColor;\nuniform sampler2D uContent;\nuniform vec2 uGrid;\nuniform vec2 uCell;\nuniform vec2 uResolution;\nuniform vec3 uBg;\n".concat(COMMON, "\nvoid main () {\n  vec2 cell = vec2(floor(gl_FragCoord.x), uGrid.y - 1.0 - floor(gl_FragCoord.y));\n  vec2 origin = cell * uCell;\n  vec3 sum = vec3(0.0);\n  for (int y = 0; y < 4; y++) {\n    for (int x = 0; x < 4; x++) {\n      vec2 p = origin + (vec2(float(x), float(y)) + 0.5) * 0.25 * uCell;\n      vec4 c = texture(uContent, min(p, uResolution - 0.5) / uResolution);\n      sum += mix(uBg, c.rgb, c.a);\n    }\n  }\n  vec3 average = sum / 16.0;\n  float contrast = abs(luma(average) - luma(uBg)) * 1.6;\n  float chroma = length(average - uBg) * 0.7;\n  outColor = vec4(average, clamp(max(contrast, chroma), 0.0, 1.0));\n}");
var GLYPHS = "\nuniform sampler2D uField;\nuniform sampler2D uCells;\nuniform sampler2D uAtlas;\nuniform sampler2D uRamp;\nuniform sampler2D uTextMask;\nuniform vec2 uGrid;\nuniform vec2 uCell;\nuniform vec2 uResolution;\nuniform float uCount;\nuniform float uDensity;\nuniform float uOpacity;\nuniform float uContrast;\nuniform float uFlicker;\nuniform float uDepth;\nuniform float uTime;\nuniform float uSeed;\nuniform float uPage;\nuniform float uLight;\nuniform float uKeepText;\nuniform vec3 uBg;\n".concat(COMMON, "\nvec4 fieldAt (vec2 cell) {\n  return texelFetch(uField, ivec2(int(cell.x), int(uGrid.y - 1.0 - cell.y)), 0);\n}\n\nvec4 cellsAt (vec2 cell) {\n  return texelFetch(uCells, ivec2(int(cell.x), int(uGrid.y - 1.0 - cell.y)), 0);\n}\n\nvec2 fieldUv (vec2 px) {\n  return vec2(px.x / (uGrid.x * uCell.x), 1.0 - px.y / (uGrid.y * uCell.y));\n}\n\nfloat textAt (vec2 px) {\n  if (uPage < 0.5 || uKeepText < 0.5) return 0.0;\n  return smoothstep(0.25, 0.75, texture(uTextMask, px / uResolution).r);\n}\n\nfloat atlasAt (float index, vec2 local, float soft) {\n  vec2 inset = clamp(local, vec2(0.02), vec2(0.98));\n  vec2 uv = vec2((index + inset.x) / uCount, (soft + inset.y) * 0.5);\n  return textureLod(uAtlas, uv, 0.0).a;\n}\n\nvec4 glyphAt (vec2 px, bool halo) {\n  vec2 coord = px / uCell;\n  vec2 cell = floor(coord);\n  if (cell.x < 0.0 || cell.y < 0.0 || cell.x >= uGrid.x || cell.y >= uGrid.y) return vec4(0.0);\n  vec4 field = fieldAt(cell);\n  float t = field.r;\n  if (t < 0.003) return vec4(0.0);\n  vec2 local = coord - cell;\n  float pick = hash12(cell + uSeed * 7.31);\n  float level = hash12(cell * 1.73 + 4.1 + uSeed);\n  vec4 page = uPage > 0.5 ? cellsAt(cell) : vec4(0.0);\n  float tone = uPage > 0.5 ? page.a : t;\n  tone = clamp((tone - 0.5) * uContrast + 0.5, 0.0, 1.0);\n  float tick = floor(uTime * 9.0 + level * 9.0);\n  float wobble = (hash12(cell * 2.31 + tick * 17.7) - 0.5) * uFlicker * 0.4 + (level - 0.5) * 0.12;\n  float shade = clamp(pow(tone, 0.8) + wobble, 0.0, 1.0);\n  float index = floor(shade * (uCount - 1.0) + 0.5);\n  float scramble = field.g * max(uFlicker, 0.35);\n  if (scramble > 0.02) {\n    float frame = floor(uTime * 20.0);\n    if (hash12(cell * 3.7 + frame * 5.3) < scramble) {\n      index = 1.0 + floor(hash12(cell + frame * 1.37) * (uCount - 1.0));\n    }\n  }\n  float present = step(pick, uDensity * mix(1.0, 0.3 + t * 1.1, 0.55));\n  if (uPage > 0.5) present *= smoothstep(0.02, 0.08, page.a);\n  float focus = step(hash12(cell * 0.71 + 9.2 + uSeed), uDepth);\n  float coverage = halo ? 0.35 * step(0.5, index) : atlasAt(index, local, focus);\n  float alpha = uOpacity * present * coverage * smoothstep(0.0, 0.55, t)\n    * mix(1.0, 0.35 + 0.65 * level, 0.55) * (1.0 - focus * 0.45);\n  vec3 color;\n  if (uPage > 0.5) {\n    color = clamp(uBg + (page.rgb - uBg) / max(abs(luma(page.rgb) - luma(uBg)), 0.2), 0.0, 1.0);\n  } else {\n    color = texture(uRamp, vec2(clamp(t * 0.85 + level * 0.15, 0.0, 1.0), 0.5)).rgb;\n  }\n  return uLight > 0.5 ? vec4(color * alpha, alpha) : vec4(color * alpha, alpha * 0.75);\n}\n");
var HALO = "#version 300 es\nprecision highp float;\nout vec4 outColor;\nuniform vec2 uHaloResolution;\nuniform float uDownscale;\n".concat(GLYPHS, "\nvoid main () {\n  vec2 px = vec2(gl_FragCoord.x, uHaloResolution.y - gl_FragCoord.y) * uDownscale;\n  outColor = glyphAt(px, true) * (1.0 - textAt(px));\n}");
var BLUR = "#version 300 es\nprecision highp float;\nout vec4 outColor;\nuniform sampler2D uSource;\nuniform vec2 uStep;\nuniform vec2 uSize;\nvoid main () {\n  vec2 uv = gl_FragCoord.xy / uSize;\n  vec4 sum = texture(uSource, uv) * 0.2270270270;\n  sum += texture(uSource, uv + uStep * 1.3846153846) * 0.3162162162;\n  sum += texture(uSource, uv - uStep * 1.3846153846) * 0.3162162162;\n  sum += texture(uSource, uv + uStep * 3.2307692308) * 0.0702702703;\n  sum += texture(uSource, uv - uStep * 3.2307692308) * 0.0702702703;\n  outColor = sum;\n}";
var COMPOSITE = "#version 300 es\nprecision highp float;\nout vec4 outColor;\nuniform sampler2D uHalo;\nuniform vec2 uHaloResolution;\nuniform float uGlow;\nuniform float uGrain;\nuniform float uVeil;\nuniform float uFrame;\n".concat(GLYPHS, "\nvoid main () {\n  vec2 px = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);\n  vec2 fuv = fieldUv(px);\n  float mask = smoothstep(0.0, 0.5, texture(uField, fuv).r);\n  float text = textAt(px);\n  vec4 back;\n  if (uPage > 0.5) {\n    vec3 soft = texture(uCells, fuv).rgb;\n    back = vec4(mix(soft, uBg, uVeil), 1.0) * mask * (1.0 - text);\n  } else {\n    back = vec4(uBg, 1.0) * mask * uVeil;\n  }\n  vec4 glyph = glyphAt(px, false) * (1.0 - text);\n  vec2 huv = px / (uHaloResolution * ").concat(HALO_SCALE.toFixed(1), ");\n  vec4 halo = texture(uHalo, vec2(huv.x, 1.0 - huv.y)) * uGlow;\n  vec4 color = back * (1.0 - glyph.a) + glyph;\n  if (uLight > 0.5) {\n    color += halo * 0.6 * (1.0 - color.a);\n  } else {\n    color += halo;\n  }\n  float body = clamp(color.a, 0.0, 1.0);\n  float grain = (hash12(gl_FragCoord.xy + uFrame * vec2(17.0, 59.0))\n    + hash12(gl_FragCoord.xy * 1.31 + uFrame * 7.0) - 1.0) * uGrain;\n  vec3 rgb = clamp(color.rgb + grain * body * 0.5, 0.0, 1.0);\n  outColor = vec4(rgb, max(body, max(rgb.r, max(rgb.g, rgb.b))));\n}");
function supportsHtmlInCanvas() {
  if (typeof document === "undefined" || isHtmlInCanvasBlocked()) return false;
  var probe = document.createElement("canvas");
  var ctx = probe.getContext("2d");
  return Boolean(ctx && typeof ctx.drawElementImage === "function" && typeof probe.requestPaint === "function");
}
var colorProbe = {
  ctx: null
};
function readColor(value) {
  if (typeof document === "undefined") return null;
  if (!colorProbe.ctx) {
    var canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    colorProbe.ctx = canvas.getContext("2d", {
      willReadFrequently: true
    });
  }
  var ctx = colorProbe.ctx;
  if (!ctx) return null;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "#000";
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  var _ctx$getImageData$dat = (0, _slicedToArray2["default"])(ctx.getImageData(0, 0, 1, 1).data, 4),
    r = _ctx$getImageData$dat[0],
    g = _ctx$getImageData$dat[1],
    b = _ctx$getImageData$dat[2],
    a = _ctx$getImageData$dat[3];
  return [r / 255, g / 255, b / 255, a / 255];
}
function parseColor(value, fallback) {
  var color = readColor(value);
  if (!color || color[3] === 0) return fallback;
  return [color[0], color[1], color[2]];
}
function toLinear(value) {
  return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}
function toSrgb(value) {
  var v = Math.min(Math.max(value, 0), 1);
  return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}
function toOklab(_ref) {
  var _ref2 = (0, _slicedToArray2["default"])(_ref, 3),
    r = _ref2[0],
    g = _ref2[1],
    b = _ref2[2];
  var lr = toLinear(r);
  var lg = toLinear(g);
  var lb = toLinear(b);
  var l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  var m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  var s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function fromOklab(_ref3) {
  var _ref4 = (0, _slicedToArray2["default"])(_ref3, 3),
    L = _ref4[0],
    A = _ref4[1],
    B = _ref4[2];
  var l = Math.pow(L + 0.3963377774 * A + 0.2158037573 * B, 3);
  var m = Math.pow(L - 0.1055613458 * A - 0.0638541728 * B, 3);
  var s = Math.pow(L - 0.0894841775 * A - 1.291485548 * B, 3);
  return [toSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s), toSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s), toSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)];
}
function buildAsciifyRamp(colors) {
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 256;
  var stops = (colors.length ? colors : DARK_RAMP).map(function (color) {
    return toOklab(parseColor(color, [1, 1, 1]));
  });
  if (stops.length === 1) stops.push(stops[0]);
  var data = new Uint8Array(size * 4);
  for (var i = 0; i < size; i++) {
    var x = i / (size - 1) * (stops.length - 1);
    var index = Math.min(Math.floor(x), stops.length - 2);
    var f = x - index;
    var a = stops[index];
    var b = stops[index + 1];
    var rgb = fromOklab([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]);
    data[i * 4] = Math.round(rgb[0] * 255);
    data[i * 4 + 1] = Math.round(rgb[1] * 255);
    data[i * 4 + 2] = Math.round(rgb[2] * 255);
    data[i * 4 + 3] = 255;
  }
  return data;
}
function buildAsciifyAtlas(characters, fontFamily, cellHeight) {
  var glyphs = Array.from(characters.length ? characters : DEFAULTS.characters);
  var height = Math.max(4, Math.round(cellHeight));
  var width = Math.max(3, Math.round(height * 0.62));
  var canvas = document.createElement("canvas");
  canvas.width = width * glyphs.length;
  canvas.height = height * 2;
  var ctx = canvas.getContext("2d");
  if (!ctx) return {
    canvas: canvas,
    count: glyphs.length,
    cellWidth: width,
    cellHeight: height
  };
  var fontSize = height * 0.8;
  ctx.font = "500 ".concat(fontSize, "px ").concat(fontFamily);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  var blur = Math.max(1, height * 0.14);
  var shift = canvas.width + height * 4;
  glyphs.forEach(function (glyph, index) {
    var x = index * width + width / 2;
    var y = height / 2 + height * 0.04;
    ctx.save();
    ctx.beginPath();
    ctx.rect(index * width, 0, width, height);
    ctx.clip();
    ctx.fillText(glyph, x, y);
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.rect(index * width, height, width, height);
    ctx.clip();
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = shift;
    ctx.fillText(glyph, x - shift, y + height);
    ctx.restore();
  });
  return {
    canvas: canvas,
    count: glyphs.length,
    cellWidth: width,
    cellHeight: height
  };
}
function createAsciify(elements) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  try {
    return initializeAsciify(elements, options);
  } catch (error) {
    console.error("Asciify initialization failed:", error);
    return null;
  }
}
function initializeAsciify(elements, options) {
  var _elements$source, _elements$content, _document$fonts;
  var config = _objectSpread(_objectSpread({}, DEFAULTS), resolveOptions(DEFAULTS, options));
  var output = elements.output;
  var source = (_elements$source = elements.source) !== null && _elements$source !== void 0 ? _elements$source : null;
  var content = (_elements$content = elements.content) !== null && _elements$content !== void 0 ? _elements$content : null;
  var gl = output.getContext("webgl2", {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    premultipliedAlpha: true
  });
  if (!gl || gl.isContextLost()) return null;
  var sourceCtx = source ? source.getContext("2d") : null;
  var paintable = source;
  var htmlInCanvas = Boolean(!isHtmlInCanvasBlocked() && source && content && source.contains(content) && sourceCtx && typeof sourceCtx.drawElementImage === "function" && typeof (paintable === null || paintable === void 0 ? void 0 : paintable.requestPaint) === "function");
  if (htmlInCanvas) prepareHtmlInCanvas(source, content);
  var pageMode = function pageMode() {
    return htmlInCanvas && config.source === "page";
  };
  var destroyed = false;
  var contentDirty = false;
  var textureUploadErrorLogged = false;
  var wake = function wake() {};
  if (htmlInCanvas) {
    paintable.onpaint = function () {
      try {
        sourceCtx.reset();
        drawHtmlInCanvas(source, sourceCtx, content, true);
        contentDirty = true;
        scheduleTextMask();
        wake();
      } catch (_unused) {}
    };
  }
  function compile(type, text) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, text);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var message = gl.getShaderInfoLog(shader) || "Unknown shader error";
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }
  var vertexShader = compile(gl.VERTEX_SHADER, VERT);
  var programs = [];
  function link(fragment) {
    var fragmentShader = compile(gl.FRAGMENT_SHADER, fragment);
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var message = gl.getProgramInfoLog(program) || "Unknown program link error";
      gl.deleteProgram(program);
      throw new Error(message);
    }
    var uniforms = {};
    var count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < count; i++) {
      var info = gl.getActiveUniform(program, i);
      uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }
    var entry = {
      program: program,
      uniforms: uniforms
    };
    programs.push(entry);
    return entry;
  }
  var fieldProgram = link(FIELD);
  var cellsProgram = link(CELLS);
  var haloProgram = link(HALO);
  var blurProgram = link(BLUR);
  var compositeProgram = link(COMPOSITE);
  var quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  function createTexture(filter) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    return texture;
  }
  function createTarget() {
    var texture = createTexture(gl.LINEAR);
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return {
      texture: texture,
      framebuffer: framebuffer,
      width: 1,
      height: 1
    };
  }
  function sizeTarget(target, width, height) {
    if (target.width === width && target.height === height) return;
    target.width = width;
    target.height = height;
    gl.bindTexture(gl.TEXTURE_2D, target.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  }
  var field = createTarget();
  var cells = createTarget();
  var haloA = createTarget();
  var haloB = createTarget();
  var contentTexture = createTexture(gl.LINEAR);
  var atlasTexture = createTexture(gl.LINEAR);
  var rampTexture = createTexture(gl.LINEAR);
  var maskTexture = createTexture(gl.LINEAR);
  var dpr = 1;
  var cellWidth = 7;
  var cellHeight = 12;
  var glyphCount = 1;
  var gridWidth = 1;
  var gridHeight = 1;
  var atlasKey = "";
  var rampKey = "";
  var seed = Math.random();
  function syncAtlas() {
    var height = Math.max(4, Math.round(Math.max(config.cellSize, 4) * dpr));
    var key = "".concat(config.characters, "|").concat(config.fontFamily, "|").concat(height);
    if (key === atlasKey) return;
    atlasKey = key;
    var atlas = buildAsciifyAtlas(config.characters, config.fontFamily, height);
    cellWidth = atlas.cellWidth;
    cellHeight = atlas.cellHeight;
    glyphCount = atlas.count;
    gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas.canvas);
  }
  var backingRgb = [1, 1, 1];
  var light = true;
  function syncBacking() {
    var _ref5;
    var detected = [1, 1, 1];
    var el = (_ref5 = content !== null && content !== void 0 ? content : output.parentElement) !== null && _ref5 !== void 0 ? _ref5 : output;
    while (el) {
      var color = readColor(getComputedStyle(el).backgroundColor);
      if (color && color[3] > 0.5) {
        detected = [color[0], color[1], color[2]];
        break;
      }
      el = el.parentElement;
    }
    backingRgb = config.background === "auto" ? detected : parseColor(config.background, detected);
    light = 0.2126 * backingRgb[0] + 0.7152 * backingRgb[1] + 0.0722 * backingRgb[2] > 0.5;
  }
  function syncRamp() {
    var colors = config.colors.length ? config.colors : light ? LIGHT_RAMP : DARK_RAMP;
    var key = colors.join(",");
    if (key === rampKey) return;
    rampKey = key;
    gl.bindTexture(gl.TEXTURE_2D, rampTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, buildAsciifyRamp(colors));
  }
  var MASK_SCALE = 0.25;
  var maskCanvas = document.createElement("canvas");
  var maskCtx = maskCanvas.getContext("2d");
  var maskDirty = false;
  var maskTimer = 0;
  var maskStamp = 0;
  function buildTextMask() {
    if (!maskCtx || !content) return;
    var bounds = output.getBoundingClientRect();
    var reach = 400;
    var width = Math.max(1, Math.round(bounds.width * MASK_SCALE));
    var height = Math.max(1, Math.round(bounds.height * MASK_SCALE));
    if (maskCanvas.width !== width || maskCanvas.height !== height) {
      maskCanvas.width = width;
      maskCanvas.height = height;
    }
    maskCtx.clearRect(0, 0, width, height);
    maskCtx.fillStyle = "#fff";
    var walker = document.createTreeWalker(content, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function acceptNode(node) {
        if (node.nodeType === Node.TEXT_NODE) return NodeFilter.FILTER_ACCEPT;
        if (node === output || node === source) return NodeFilter.FILTER_REJECT;
        var r = node.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return NodeFilter.FILTER_SKIP;
        var outside = r.bottom < bounds.top - reach || r.top > bounds.bottom + reach || r.right < bounds.left - reach || r.left > bounds.right + reach;
        return outside ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
      }
    });
    var range = document.createRange();
    var node;
    while (node = walker.nextNode()) {
      var _node$textContent;
      if (!((_node$textContent = node.textContent) !== null && _node$textContent !== void 0 && _node$textContent.trim())) continue;
      var parent = node.parentElement;
      if (!parent || parent.checkVisibility && !parent.checkVisibility()) {
        continue;
      }
      range.selectNodeContents(node);
      var rects = range.getClientRects();
      for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        if (r.width < 1 || r.height < 1) continue;
        if (r.bottom < bounds.top || r.top > bounds.bottom) continue;
        if (r.right < bounds.left || r.left > bounds.right) continue;
        maskCtx.fillRect((r.left - bounds.left - 2) * MASK_SCALE, (r.top - bounds.top - 2) * MASK_SCALE, (r.width + 4) * MASK_SCALE, (r.height + 4) * MASK_SCALE);
      }
    }
    var fields = content.querySelectorAll("input, textarea, select");
    for (var _i2 = 0; _i2 < fields.length; _i2++) {
      var _r = fields[_i2].getBoundingClientRect();
      if (_r.width < 1 || _r.height < 1) continue;
      if (_r.bottom < bounds.top || _r.top > bounds.bottom) continue;
      maskCtx.fillRect((_r.left - bounds.left) * MASK_SCALE, (_r.top - bounds.top) * MASK_SCALE, _r.width * MASK_SCALE, _r.height * MASK_SCALE);
    }
    maskDirty = true;
  }
  function scheduleTextMask() {
    if (!pageMode() || !config.keepText || maskTimer || destroyed) return;
    var wait = Math.max(0, 120 - (performance.now() - maskStamp));
    maskTimer = window.setTimeout(function () {
      maskTimer = 0;
      maskStamp = performance.now();
      buildTextMask();
      start();
    }, wait);
  }
  function syncCanvasSize() {
    var changed = false;
    dpr = getCanvasPixelRatio(output, gl);
    var width = Math.max(1, Math.round(output.clientWidth * dpr));
    var height = Math.max(1, Math.round(output.clientHeight * dpr));
    if (output.width !== width || output.height !== height) {
      output.width = width;
      output.height = height;
      changed = true;
    }
    if (htmlInCanvas) {
      var sourceWidth = Math.max(1, Math.round(source.clientWidth * dpr));
      var sourceHeight = Math.max(1, Math.round(source.clientHeight * dpr));
      if (source.width !== sourceWidth || source.height !== sourceHeight) {
        source.width = sourceWidth;
        source.height = sourceHeight;
        changed = true;
      }
      paintable.requestPaint();
    }
    syncAtlas();
    gridWidth = Math.max(1, Math.ceil(output.width / cellWidth));
    gridHeight = Math.max(1, Math.ceil(output.height / cellHeight));
    sizeTarget(field, gridWidth, gridHeight);
    sizeTarget(cells, gridWidth, gridHeight);
    var haloWidth = Math.max(1, Math.ceil(output.width / HALO_SCALE));
    var haloHeight = Math.max(1, Math.ceil(output.height / HALO_SCALE));
    sizeTarget(haloA, haloWidth, haloHeight);
    sizeTarget(haloB, haloWidth, haloHeight);
    return changed;
  }
  syncBacking();
  syncRamp();
  syncCanvasSize();
  var trail = [];
  var clicks = [];
  var trailData = new Float32Array(MAX_TRAIL * 4);
  var clickData = new Float32Array(MAX_CLICKS * 4);
  var pointer = {
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    sx: 0,
    sy: 0,
    has: false,
    fresh: true
  };
  function uploadContent() {
    if (!htmlInCanvas || !contentDirty) return;
    contentDirty = false;
    try {
      gl.bindTexture(gl.TEXTURE_2D, contentTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      textureUploadErrorLogged = false;
    } catch (error) {
      if (!textureUploadErrorLogged) {
        textureUploadErrorLogged = true;
        console.warn("Asciify could not upload its content texture:", error);
      }
    }
  }
  function uploadMask() {
    if (!maskDirty) return;
    maskDirty = false;
    gl.bindTexture(gl.TEXTURE_2D, maskTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, maskCanvas);
  }
  var elapsed = 0;
  var frameIndex = 0;
  function bindTexture(unit, texture, location) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if (location) gl.uniform1i(location, unit);
  }
  function drawTo(target) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.framebuffer : null);
    gl.viewport(0, 0, target ? target.width : output.width, target ? target.height : output.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  function setGlyphUniforms(u) {
    bindTexture(0, field.texture, u.uField);
    bindTexture(1, cells.texture, u.uCells);
    bindTexture(2, atlasTexture, u.uAtlas);
    bindTexture(3, rampTexture, u.uRamp);
    bindTexture(4, maskTexture, u.uTextMask);
    gl.uniform2f(u.uGrid, gridWidth, gridHeight);
    gl.uniform2f(u.uCell, cellWidth, cellHeight);
    gl.uniform2f(u.uResolution, output.width, output.height);
    gl.uniform1f(u.uCount, glyphCount);
    gl.uniform1f(u.uDensity, clamp01(config.density));
    gl.uniform1f(u.uOpacity, clamp01(config.opacity));
    gl.uniform1f(u.uContrast, Math.max(config.contrast, 0));
    gl.uniform1f(u.uFlicker, reducedMotion ? 0 : clamp01(config.flicker));
    gl.uniform1f(u.uDepth, clamp01(config.depth));
    gl.uniform1f(u.uTime, elapsed);
    gl.uniform1f(u.uSeed, seed);
    gl.uniform1f(u.uPage, pageMode() ? 1 : 0);
    gl.uniform1f(u.uLight, light ? 1 : 0);
    gl.uniform1f(u.uKeepText, config.keepText ? 1 : 0);
    gl.uniform3f(u.uBg, backingRgb[0], backingRgb[1], backingRgb[2]);
  }
  function render() {
    uploadContent();
    uploadMask();
    gl.disable(gl.BLEND);
    var radius = Math.max(config.radius, 4) * dpr;
    var life = Math.max(config.trail, 0.05);
    var now = performance.now() / 1000;
    trailData.fill(0);
    for (var i = 0; i < trail.length; i++) {
      var point = trail[i];
      var age = Math.min((now - point.born) / life, 1);
      var fade = 1 - age;
      var spread = 0.7 + 0.75 * age * clamp01(config.flow) + 0.3 * age;
      trailData[i * 4] = point.x * dpr;
      trailData[i * 4 + 1] = point.y * dpr;
      trailData[i * 4 + 2] = fade * fade;
      trailData[i * 4 + 3] = radius * point.scale * spread * (point.linked ? 1 : -1);
    }
    clickData.fill(0);
    var clickLife = config.click === "burst" ? BURST_LIFE : WAVE_LIFE;
    for (var _i3 = 0; _i3 < clicks.length; _i3++) {
      var click = clicks[_i3];
      var _age = now - click.born;
      var _fade = Math.max(0, 1 - _age / clickLife);
      clickData[_i3 * 4] = click.x * dpr;
      clickData[_i3 * 4 + 1] = click.y * dpr;
      clickData[_i3 * 4 + 2] = _age;
      clickData[_i3 * 4 + 3] = _fade * _fade * (3 - 2 * _fade);
    }
    var u = fieldProgram.uniforms;
    gl.useProgram(fieldProgram.program);
    gl.uniform2f(u.uGrid, gridWidth, gridHeight);
    gl.uniform2f(u.uCell, cellWidth, cellHeight);
    gl.uniform4fv(u["uTrail[0]"], trailData);
    gl.uniform1i(u.uTrailCount, trail.length);
    gl.uniform4fv(u["uClicks[0]"], clickData);
    gl.uniform1i(u.uClickMode, config.click === "wave" ? 1 : config.click === "burst" ? 2 : 0);
    gl.uniform1f(u.uRadius, radius);
    gl.uniform1f(u.uAmbient, clamp01(config.ambient));
    gl.uniform1f(u.uFlow, clamp01(config.flow));
    gl.uniform1f(u.uTime, elapsed);
    gl.uniform1f(u.uSeed, seed);
    drawTo(field);
    if (pageMode()) {
      u = cellsProgram.uniforms;
      gl.useProgram(cellsProgram.program);
      bindTexture(0, contentTexture, u.uContent);
      gl.uniform2f(u.uGrid, gridWidth, gridHeight);
      gl.uniform2f(u.uCell, cellWidth, cellHeight);
      gl.uniform2f(u.uResolution, source.width, source.height);
      gl.uniform3f(u.uBg, backingRgb[0], backingRgb[1], backingRgb[2]);
      drawTo(cells);
    }
    var glow = clamp01(config.glow);
    if (glow > 0) {
      u = haloProgram.uniforms;
      gl.useProgram(haloProgram.program);
      setGlyphUniforms(u);
      gl.uniform2f(u.uHaloResolution, haloA.width, haloA.height);
      gl.uniform1f(u.uDownscale, HALO_SCALE);
      drawTo(haloA);
      u = blurProgram.uniforms;
      gl.useProgram(blurProgram.program);
      gl.uniform2f(u.uSize, haloA.width, haloA.height);
      for (var _i4 = 0, _arr2 = [1.25, 2.75]; _i4 < _arr2.length; _i4++) {
        var _spread = _arr2[_i4];
        bindTexture(0, haloA.texture, u.uSource);
        gl.uniform2f(u.uStep, _spread / haloA.width, 0);
        drawTo(haloB);
        bindTexture(0, haloB.texture, u.uSource);
        gl.uniform2f(u.uStep, 0, _spread / haloA.height);
        drawTo(haloA);
      }
    }
    u = compositeProgram.uniforms;
    gl.useProgram(compositeProgram.program);
    setGlyphUniforms(u);
    bindTexture(5, haloA.texture, u.uHalo);
    gl.uniform2f(u.uHaloResolution, haloA.width, haloA.height);
    gl.uniform1f(u.uGlow, glow);
    gl.uniform1f(u.uGrain, clamp01(config.grain) * 0.35);
    gl.uniform1f(u.uVeil, clamp01(config.veil));
    gl.uniform1f(u.uFrame, reducedMotion ? 0 : frameIndex % 1024);
    drawTo(null);
  }
  var raf = 0;
  var lastTime = performance.now();
  var running = false;
  var visible = true;
  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reducedMotion = motionQuery.matches;
  function prune(now) {
    var life = Math.max(config.trail, 0.05);
    while (trail.length && now - trail[0].born > life) trail.shift();
    var clickLife = config.click === "burst" ? BURST_LIFE : WAVE_LIFE;
    while (clicks.length && now - clicks[0].born > clickLife) clicks.shift();
  }
  function frame(now) {
    if (destroyed) return;
    if (!visible) {
      running = false;
      return;
    }
    var delta = Math.min((now - lastTime) / 1000, 1 / 20);
    lastTime = now;
    if (!reducedMotion) {
      elapsed += delta;
      frameIndex += 1;
    }
    prune(now / 1000);
    var following = advanceTrail(delta, now / 1000);
    var ambient = clamp01(config.ambient) > 0 && !reducedMotion;
    var busy = trail.length > 0 || clicks.length > 0 || ambient || following;
    render();
    if (!busy && !contentDirty && !maskDirty) {
      running = false;
      return;
    }
    raf = requestAnimationFrame(frame);
  }
  function advanceTrail(delta, now) {
    var flow = reducedMotion ? 0 : clamp01(config.flow);
    var damping = Math.exp(-delta * 2.6);
    var _iterator2 = _createForOfIteratorHelper(trail),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var point = _step2.value;
        point.x += point.vx * delta;
        point.y += point.vy * delta;
        point.vx *= damping;
        point.vy *= damping;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    if (!pointer.has) return false;
    var follow = reducedMotion ? 1 : 1 - Math.exp(-delta * 16);
    var fromX = pointer.x;
    var fromY = pointer.y;
    pointer.x += (pointer.tx - pointer.x) * follow;
    pointer.y += (pointer.ty - pointer.y) * follow;
    var spacing = Math.max(config.cellSize * 0.6, 4);
    var moved = Math.hypot(pointer.x - pointer.sx, pointer.y - pointer.sy);
    var following = Math.hypot(pointer.tx - pointer.x, pointer.ty - pointer.y) > 0.5;
    if (!pointer.fresh && moved < spacing) return following;
    var step = Math.max(delta, 1 / 240);
    var vx = (pointer.x - fromX) / step;
    var vy = (pointer.y - fromY) / step;
    var speed = Math.hypot(vx, vy);
    var angle = Math.random() * Math.PI * 2;
    var jitter = 45 * flow;
    trail.push({
      x: pointer.x,
      y: pointer.y,
      vx: vx * 0.12 * flow + Math.cos(angle) * jitter,
      vy: vy * 0.12 * flow + Math.sin(angle) * jitter,
      born: now,
      scale: 0.75 + 0.45 * Math.min(speed / 2000, 1),
      linked: !pointer.fresh && trail.length > 0
    });
    if (trail.length > MAX_TRAIL) trail.shift();
    pointer.sx = pointer.x;
    pointer.sy = pointer.y;
    pointer.fresh = false;
    return following;
  }
  function start() {
    if (destroyed || running || !visible) return;
    running = true;
    lastTime = performance.now();
    raf = requestAnimationFrame(frame);
  }
  wake = start;
  start();
  function onMotionChange() {
    reducedMotion = motionQuery.matches;
    start();
  }
  motionQuery.addEventListener("change", onMotionChange);
  var themeTimer = 0;
  function onThemeShift() {
    syncBacking();
    syncRamp();
    start();
    window.clearTimeout(themeTimer);
    themeTimer = window.setTimeout(function () {
      syncBacking();
      syncRamp();
      start();
    }, 300);
  }
  var themeObserver = new MutationObserver(onThemeShift);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "style", "data-theme"]
  });
  var schemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  schemeQuery.addEventListener("change", onThemeShift);
  function onFontsLoaded() {
    atlasKey = "";
    syncCanvasSize();
    scheduleTextMask();
    start();
  }
  (_document$fonts = document.fonts) === null || _document$fonts === void 0 || _document$fonts.addEventListener("loadingdone", onFontsLoaded);
  var outputRect = output.getBoundingClientRect();
  var refreshOutputRect = function refreshOutputRect() {
    outputRect = output.getBoundingClientRect();
  };
  var observer = createCanvasResizeObserver(function () {
    refreshOutputRect();
    syncCanvasSize();
    scheduleTextMask();
    start();
  });
  observer.observe(output);
  if (content) observer.observe(content);
  window.addEventListener("resize", refreshOutputRect, {
    passive: true
  });
  window.addEventListener("scroll", refreshOutputRect, {
    capture: true,
    passive: true
  });
  var intersecting = true;
  function syncVisibility() {
    visible = intersecting && document.visibilityState !== "hidden";
    if (visible) {
      start();
    } else if (running) {
      cancelAnimationFrame(raf);
      running = false;
    }
  }
  var intersection = new IntersectionObserver(function (entries) {
    var _entries$isIntersecti, _entries;
    intersecting = (_entries$isIntersecti = (_entries = entries[entries.length - 1]) === null || _entries === void 0 ? void 0 : _entries.isIntersecting) !== null && _entries$isIntersecti !== void 0 ? _entries$isIntersecti : true;
    syncVisibility();
  });
  document.addEventListener("visibilitychange", syncVisibility);
  intersection.observe(output);
  function localPoint(event) {
    var x = event.clientX - outputRect.left;
    var y = event.clientY - outputRect.top;
    var margin = Math.max(config.radius, 4);
    var inside = x > -margin && y > -margin && x < outputRect.width + margin && y < outputRect.height + margin;
    return {
      x: x,
      y: y,
      inside: inside
    };
  }
  function onPointerMove(event) {
    var _localPoint = localPoint(event),
      x = _localPoint.x,
      y = _localPoint.y,
      inside = _localPoint.inside;
    if (!inside) {
      pointer.has = false;
      return;
    }
    if (!pointer.has) {
      pointer.x = pointer.sx = x;
      pointer.y = pointer.sy = y;
      pointer.fresh = true;
    }
    pointer.tx = x;
    pointer.ty = y;
    pointer.has = true;
    start();
  }
  function onPointerDown(event) {
    if (config.click === "none" || reducedMotion) return;
    var _localPoint2 = localPoint(event),
      x = _localPoint2.x,
      y = _localPoint2.y,
      inside = _localPoint2.inside;
    if (!inside) return;
    clicks.push({
      x: x,
      y: y,
      born: performance.now() / 1000
    });
    if (clicks.length > MAX_CLICKS) clicks.shift();
    start();
  }
  function onPointerLeave() {
    pointer.has = false;
  }
  window.addEventListener("pointermove", onPointerMove, {
    passive: true
  });
  window.addEventListener("pointerdown", onPointerDown, {
    passive: true
  });
  document.documentElement.addEventListener("pointerleave", onPointerLeave, {
    passive: true
  });
  window.addEventListener("scroll", scheduleTextMask, {
    capture: true,
    passive: true
  });
  var maskObserver = new MutationObserver(scheduleTextMask);
  if (content) {
    maskObserver.observe(content, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }
  scheduleTextMask();
  return {
    setOptions: function setOptions(next) {
      next = resolveOptions(DEFAULTS, next);
      var changed = false;
      var _loop = function _loop() {
          var _Object$entries$_i = (0, _slicedToArray2["default"])(_Object$entries[_i5], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];
          var prev = config[key];
          if (Array.isArray(value) && Array.isArray(prev)) {
            if (value.length !== prev.length || value.some(function (item, i) {
              return item !== prev[i];
            })) {
              changed = true;
              return 0; // break
            }
          } else if (prev !== value) {
            changed = true;
            return 0; // break
          }
        },
        _ret;
      for (var _i5 = 0, _Object$entries = Object.entries(next); _i5 < _Object$entries.length; _i5++) {
        _ret = _loop();
        if (_ret === 0) break;
      }
      Object.assign(config, next);
      if (!changed) return;
      syncBacking();
      syncRamp();
      syncCanvasSize();
      scheduleTextMask();
      start();
    },
    resize: function resize() {
      refreshOutputRect();
      syncCanvasSize();
      syncBacking();
      syncRamp();
      scheduleTextMask();
      start();
    },
    destroy: function destroy() {
      var _document$fonts2;
      destroyed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(themeTimer);
      window.clearTimeout(maskTimer);
      observer.disconnect();
      window.removeEventListener("resize", refreshOutputRect);
      window.removeEventListener("scroll", refreshOutputRect, true);
      intersection.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
      themeObserver.disconnect();
      schemeQuery.removeEventListener("change", onThemeShift);
      motionQuery.removeEventListener("change", onMotionChange);
      (_document$fonts2 = document.fonts) === null || _document$fonts2 === void 0 || _document$fonts2.removeEventListener("loadingdone", onFontsLoaded);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", scheduleTextMask, {
        capture: true
      });
      maskObserver.disconnect();
      for (var _i6 = 0, _arr3 = [field, cells, haloA, haloB]; _i6 < _arr3.length; _i6++) {
        var target = _arr3[_i6];
        gl.deleteTexture(target.texture);
        gl.deleteFramebuffer(target.framebuffer);
      }
      gl.deleteTexture(contentTexture);
      gl.deleteTexture(atlasTexture);
      gl.deleteTexture(rampTexture);
      gl.deleteTexture(maskTexture);
      for (var _i7 = 0, _programs = programs; _i7 < _programs.length; _i7++) {
        var entry = _programs[_i7];
        gl.deleteProgram(entry.program);
      }
      gl.deleteShader(vertexShader);
      gl.deleteBuffer(quad);
      if (htmlInCanvas) paintable.onpaint = null;
    }
  };
}
function clamp01(value) {
  return Math.min(Math.max(value, 0), 1);
}
var emptySubscribe = function emptySubscribe() {
  return function () {};
};
var fill = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%"
};
function Asciify(_ref6) {
  var children = _ref6.children,
    _ref6$fixed = _ref6.fixed,
    fixed = _ref6$fixed === void 0 ? false : _ref6$fixed,
    className = _ref6.className,
    style = _ref6.style,
    options = (0, _objectWithoutProperties2["default"])(_ref6, _excluded);
  var sourceRef = (0, _react.useRef)(null);
  var contentRef = (0, _react.useRef)(null);
  var outputRef = (0, _react.useRef)(null);
  var instanceRef = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)(options),
    initialOptions = _useState[0];
  var _useState2 = (0, _react.useState)(false),
    failed = _useState2[0],
    setFailed = _useState2[1];
  var supported = (0, _react.useSyncExternalStore)(emptySubscribe, supportsHtmlInCanvas, function () {
    return false;
  });
  var hasContent = children !== undefined && children !== null;
  var _native = supported && !failed && hasContent && options.source === "page";
  (0, _react.useEffect)(function () {
    var output = outputRef.current;
    if (!output) return;
    instanceRef.current = createAsciify({
      source: sourceRef.current,
      content: contentRef.current,
      output: output
    }, initialOptions);
    if (_native && !instanceRef.current) setFailed(true);
    return function () {
      var _instanceRef$current;
      (_instanceRef$current = instanceRef.current) === null || _instanceRef$current === void 0 || _instanceRef$current.destroy();
      instanceRef.current = null;
    };
  }, [initialOptions, _native]);
  (0, _react.useEffect)(function () {
    var _instanceRef$current2;
    (_instanceRef$current2 = instanceRef.current) === null || _instanceRef$current2 === void 0 || _instanceRef$current2.setOptions(options);
  });
  var content = hasContent ? __jsx("div", {
    ref: contentRef,
    style: {
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "auto"
    }
  }, children) : null;
  return __jsx("div", {
    className: className,
    style: fixed ? _objectSpread({
      position: "fixed",
      inset: 0,
      zIndex: 50,
      pointerEvents: hasContent ? undefined : "none"
    }, style) : _objectSpread({
      position: "relative"
    }, style)
  }, _native ? __jsx("canvas", {
    ref: sourceRef
    // @ts-expect-error experimental html-in-canvas attribute
    ,
    layoutsubtree: "true",
    suppressHydrationWarning: true,
    style: fill
  }, content) : content, __jsx("canvas", {
    ref: outputRef,
    "aria-hidden": true,
    style: _objectSpread(_objectSpread({}, fill), {}, {
      pointerEvents: "none"
    })
  }));
}
var _default = exports["default"] = Asciify;