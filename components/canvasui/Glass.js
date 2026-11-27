"use strict";
"use client";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Glass = Glass;
exports.createGlass = createGlass;
exports["default"] = void 0;
exports.supportsHtmlInCanvas = supportsHtmlInCanvas;
var _react = _interopRequireWildcard(require("react"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _excluded = ["children", "className", "style"];
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
function createRectCache(element) {
  var current = element.getBoundingClientRect();
  var refresh = function refresh() {
    current = element.getBoundingClientRect();
  };
  var observer = new ResizeObserver(refresh);
  observer.observe(element);
  window.addEventListener("resize", refresh, {
    passive: true
  });
  window.addEventListener("scroll", refresh, {
    capture: true,
    passive: true
  });
  return {
    get current() {
      return current;
    },
    destroy: function destroy() {
      observer.disconnect();
      window.removeEventListener("resize", refresh);
      window.removeEventListener("scroll", refresh, true);
    }
  };
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
  shape: "circle",
  size: 120,
  aspect: 1.7,
  corner: 32,
  ior: 1.5,
  edge: 0.7,
  bevel: 4,
  depth: 250,
  aberration: 1,
  blur: 0,
  reflection: 1,
  shine: 0.01,
  zoom: 1.5,
  targets: "[data-glass-target]",
  follow: 0.2
};
var VERT = "#version 300 es\nprecision highp float;\nlayout(location = 0) in vec2 aPos;\nvoid main () {\n  gl_Position = vec4(aPos, 0.0, 1.0);\n}";
var FRAG = "#version 300 es\nprecision highp float;\nout vec4 outColor;\nuniform sampler2D uContent;\nuniform vec2 uResolution;\nuniform float uMaxX;\nuniform float uHasContent;\nuniform vec2 uCenter;\nuniform vec2 uHalf;\nuniform float uCorner;\nuniform float uEdge;\nuniform float uBevel;\nuniform float uIor;\nuniform float uDepth;\nuniform float uAberration;\nuniform float uBlur;\nuniform float uReflect;\nuniform float uShine;\nuniform float uZoom;\nuniform float uAlpha;\n\nconst float PI = 3.14159265358979;\nconst float AIR_IOR = 1.0003;\nconst vec3 INCIDENT = vec3(0.0, 0.0, 1.0);\n\nfloat pow2 (float x) { return x * x; }\nfloat pow5 (float x) { float x2 = x * x; return x2 * x2 * x; }\nfloat linearStep (float e0, float e1, float x) {\n  return clamp((x - e0) / (e1 - e0), 0.0, 1.0);\n}\n\nfloat sdf (vec2 p) {\n  vec2 q = abs(p) - (uHalf - vec2(uCorner));\n  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uCorner;\n}\n\nfloat ign (vec2 v) {\n  return fract(52.9829189 * fract(0.06711056 * v.x + 0.00583715 * v.y));\n}\n\nvec3 page (vec2 px, float lod) {\n  vec2 uv = px / uResolution;\n  uv.x = clamp(uv.x, 0.0005, uMaxX - 0.0005);\n  uv.y = clamp(uv.y, 0.0005, 0.9995);\n  return pow(textureLod(uContent, vec2(uv.x, 1.0 - uv.y), lod).rgb, vec3(2.2));\n}\n\nfloat iorForWavelength (float wavelength) {\n  float ab = uAberration * 0.1;\n  return mix(uIor + ab, uIor - ab,\n    1.0 - pow(1.0 - linearStep(450.0, 650.0, wavelength), 4.0));\n}\n\nvec3 pageAA (vec2 px, float minLod) {\n  float footprint = max(length(fwidth(px)), 1.0);\n  return page(px, max(minLod, log2(footprint)));\n}\n\nvec3 sampleRefraction (vec2 basePx, float rim, vec3 normal, float glassIor) {\n  vec3 rv = refract(INCIDENT, normal, AIR_IOR / glassIor);\n  rv /= abs(rv.z) / uDepth;\n\n  return pageAA(basePx + rv.xy, uBlur * (1.0 + rim));\n}\n\nfloat fresnelSchlick (float cosTheta, float f0) {\n  return f0 + (1.0 - f0) * pow5(1.0 - cosTheta);\n}\n\nfloat smithSchlickDenom (float cosTheta, float k) {\n  return cosTheta * (1.0 - k) + k;\n}\n\nfloat ggx (float roughness, float NDotL, float NDotV, float NDotH) {\n  if (NDotL <= 0.0) return 0.0;\n  float a2 = pow2(roughness);\n  float d = a2 / (PI * pow2(pow2(NDotH) * (a2 - 1.0) + 1.0));\n  float k = roughness * 0.5;\n  float v = 1.0 / (smithSchlickDenom(NDotL, k)\n    * smithSchlickDenom(clamp(NDotV, 0.0, 1.0), k));\n  return NDotL * d * v;\n}\n\nvoid main () {\n  vec2 fragPx = gl_FragCoord.xy;\n  vec2 p = fragPx - uCenter;\n  float sd = sdf(p);\n\n  float aa = 1.5;\n  float mask = 1.0 - smoothstep(-aa, 0.0, sd);\n  float alpha = mask * uAlpha\n    * (1.0 - step(uMaxX, fragPx.x / uResolution.x));\n\n  float minHalf = min(uHalf.x, uHalf.y);\n  float edgeW = max(minHalf * (1.0 - clamp(uEdge, 0.0, 0.98)), 1.0);\n  float rim = pow(linearStep(-edgeW, 0.0, sd), uBevel);\n\n  float scatter = min(uBlur, 1.0) * 0.02;\n  float randAngle = ign(fragPx) * PI * 2.0;\n  vec3 flatNormal = normalize(\n    vec3(sin(randAngle) * scatter, cos(randAngle) * scatter, -1.0));\n  float e = 1.0;\n  vec2 grad = vec2(\n    sdf(p + vec2(e, 0.0)) - sdf(p - vec2(e, 0.0)),\n    sdf(p + vec2(0.0, e)) - sdf(p - vec2(0.0, e)));\n  vec3 rimNormal = vec3(normalize(grad + vec2(1e-5)), 0.0);\n  vec3 normal = normalize(mix(flatNormal, rimNormal, rim));\n\n  if (uHasContent < 0.5) {\n    float ldot = dot(rimNormal.xy, normalize(vec2(-0.6, 0.8)));\n    float band = pow(rim, 1.8);\n    float arcs = pow(abs(ldot), 3.0) * (ldot > 0.0 ? 0.5 : 0.28);\n    float shine = band * (0.04 + arcs) * max(uShine, 0.5);\n    float a = alpha * clamp(0.06 + 0.12 * rim, 0.0, 1.0);\n    outColor = vec4(vec3(shine * 1.6) * alpha, a);\n    return;\n  }\n\n  vec2 basePx = uCenter + p / uZoom;\n\n  vec3 refracted;\n  if (uAberration > 0.001) {\n    refracted = sampleRefraction(basePx, rim, normal, iorForWavelength(611.4))\n      * vec3(1.0, 0.0, 0.0);\n    refracted += sampleRefraction(basePx, rim, normal, iorForWavelength(570.5))\n      * vec3(1.0, 1.0, 0.0);\n    refracted += sampleRefraction(basePx, rim, normal, iorForWavelength(549.1))\n      * vec3(0.0, 1.0, 0.0);\n    refracted += sampleRefraction(basePx, rim, normal, iorForWavelength(491.4))\n      * vec3(0.0, 1.0, 1.0);\n    refracted += sampleRefraction(basePx, rim, normal, iorForWavelength(464.2))\n      * vec3(0.0, 0.0, 1.0);\n    refracted += sampleRefraction(basePx, rim, normal, iorForWavelength(374.0))\n      * vec3(1.0, 0.0, 1.0);\n    refracted /= 3.0;\n  } else {\n    refracted = sampleRefraction(basePx, rim, normal, uIor);\n  }\n\n  vec3 glass = refracted;\n  if (uReflect > 0.001) {\n    const vec3 V = vec3(0.0, 0.0, -1.0);\n    float NDotV = clamp(dot(V, normal), 0.0, 1.0);\n    float f0 = pow2((uIor - AIR_IOR) / (uIor + AIR_IOR));\n    float fresnelV = fresnelSchlick(NDotV, f0) * uReflect;\n\n    vec3 reflectVector = reflect(INCIDENT, normal);\n    vec3 L = reflectVector;\n    vec3 H = normalize(L + V);\n    reflectVector /= abs(reflectVector.z) / uDepth;\n    vec3 reflected = page(basePx + reflectVector.xy, 2.5 + uBlur);\n    reflected *= ggx(0.5, dot(normal, L), NDotV, dot(normal, H));\n    glass = mix(refracted, reflected, clamp(fresnelV, 0.0, 1.0));\n  }\n\n  if (uShine > 0.001) {\n    float ldot = dot(rimNormal.xy, normalize(vec2(-0.6, 0.8)));\n    float band = pow(rim, 1.8);\n    float arcs = pow(abs(ldot), 3.0) * (ldot > 0.0 ? 0.5 : 0.28);\n    glass += band * (0.04 + arcs) * uShine;\n  }\n\n  outColor = vec4(pow(glass, vec3(1.0 / 2.2)) * alpha, alpha);\n}";
function supportsHtmlInCanvas() {
  if (typeof document === "undefined" || isHtmlInCanvasBlocked()) return false;
  var probe = document.createElement("canvas");
  var ctx = probe.getContext("2d");
  return Boolean(ctx && typeof ctx.drawElementImage === "function" && typeof probe.requestPaint === "function");
}
function createGlass(elements) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var config = _objectSpread(_objectSpread({}, DEFAULTS), resolveOptions(DEFAULTS, options));
  var source = elements.source,
    content = elements.content,
    output = elements.output;
  var gl = output.getContext("webgl2", {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    premultipliedAlpha: true
  });
  if (!gl || gl.isContextLost()) return null;
  var sourceCtx = source.getContext("2d");
  var paintable = source;
  var htmlInCanvas = Boolean(!isHtmlInCanvasBlocked() && source.contains(content) && sourceCtx && typeof sourceCtx.drawElementImage === "function" && typeof paintable.requestPaint === "function");
  if (htmlInCanvas) prepareHtmlInCanvas(source, content);
  var contentDirty = false;
  var wake = function wake() {};
  if (htmlInCanvas) {
    paintable.onpaint = function () {
      try {
        sourceCtx.reset();
        drawHtmlInCanvas(source, sourceCtx, content, true);
        contentDirty = true;
        wake();
      } catch (_unused) {}
    };
  }
  function compile(type, text) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, text);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Glass shader error:", gl.getShaderInfoLog(shader));
    }
    return shader;
  }
  var vertexShader = compile(gl.VERTEX_SHADER, VERT);
  var fragmentShader = compile(gl.FRAGMENT_SHADER, FRAG);
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var uniforms = {};
  var count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (var i = 0; i < count; i++) {
    var info = gl.getActiveUniform(program, i);
    uniforms[info.name] = gl.getUniformLocation(program, info.name);
  }
  var quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  var contentTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, contentTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
  gl.generateMipmap(gl.TEXTURE_2D);
  var contentMaxX = 1;
  function syncCanvasSize() {
    var dpr = getCanvasPixelRatio(output, gl);
    var width = Math.max(1, Math.round(output.clientWidth * dpr));
    var height = Math.max(1, Math.round(output.clientHeight * dpr));
    if (output.width !== width || output.height !== height) {
      output.width = width;
      output.height = height;
    }
    contentMaxX = Math.min(1, Math.max(0.05, content.clientWidth / Math.max(output.clientWidth, 1)));
    if (htmlInCanvas) {
      var sourceWidth = Math.max(1, Math.round(source.clientWidth * dpr));
      var sourceHeight = Math.max(1, Math.round(source.clientHeight * dpr));
      if (source.width !== sourceWidth || source.height !== sourceHeight) {
        source.width = sourceWidth;
        source.height = sourceHeight;
      }
      paintable.requestPaint();
    }
  }
  syncCanvasSize();
  function uploadContent() {
    if (!htmlInCanvas || !contentDirty) return;
    contentDirty = false;
    gl.bindTexture(gl.TEXTURE_2D, contentTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.generateMipmap(gl.TEXTURE_2D);
  }
  var posX = output.clientWidth / 2;
  var posY = output.clientHeight / 2;
  var presence = 0;
  var presenceTarget = 0;
  var targetX = posX;
  var targetY = posY;
  var zoom = 1;
  var zoomTarget = 1;
  var hasPointer = false;
  function halfExtents() {
    var size = Math.max(config.size, 8);
    if (config.shape === "rectangle") {
      return [size * Math.min(Math.max(config.aspect, 1), 4), size];
    }
    return [size, size];
  }
  function render() {
    uploadContent();
    var dpr = output.width / Math.max(output.clientWidth, 1);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, output.width, output.height);
    gl.disable(gl.SCISSOR_TEST);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (presence <= 0.004) return;
    var _halfExtents = halfExtents(),
      _halfExtents2 = (0, _slicedToArray2["default"])(_halfExtents, 2),
      baseHalfW = _halfExtents2[0],
      baseHalfH = _halfExtents2[1];
    var halfW = baseHalfW * presence;
    var halfH = baseHalfH * presence;
    var alpha = Math.min(presence * 5, 1);
    var cx = posX * dpr;
    var cy = output.height - posY * dpr;
    var margin = 4 * dpr;
    var sx = Math.max(0, Math.floor(cx - halfW * dpr - margin));
    var sy = Math.max(0, Math.floor(cy - halfH * dpr - margin));
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(sx, sy, Math.min(output.width - sx, Math.ceil(halfW * dpr * 2 + margin * 2)), Math.min(output.height - sy, Math.ceil(halfH * dpr * 2 + margin * 2)));
    gl.useProgram(program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, contentTexture);
    gl.uniform1i(uniforms.uContent, 0);
    gl.uniform2f(uniforms.uResolution, output.width, output.height);
    gl.uniform1f(uniforms.uMaxX, contentMaxX);
    gl.uniform1f(uniforms.uHasContent, htmlInCanvas ? 1 : 0);
    gl.uniform2f(uniforms.uCenter, cx, cy);
    gl.uniform2f(uniforms.uHalf, halfW * dpr, halfH * dpr);
    var corner = config.shape === "circle" ? Math.min(halfW, halfH) : Math.min(Math.max(config.corner, 0), Math.min(halfW, halfH));
    gl.uniform1f(uniforms.uCorner, corner * dpr);
    gl.uniform1f(uniforms.uEdge, Math.min(Math.max(config.edge, 0), 0.98));
    gl.uniform1f(uniforms.uBevel, Math.max(config.bevel, 0.5));
    gl.uniform1f(uniforms.uIor, Math.min(Math.max(config.ior, 1.01), 2.5));
    gl.uniform1f(uniforms.uDepth, Math.max(config.depth, 0) * dpr);
    gl.uniform1f(uniforms.uAberration, Math.max(config.aberration, 0));
    gl.uniform1f(uniforms.uBlur, Math.max(config.blur, 0));
    gl.uniform1f(uniforms.uReflect, Math.max(config.reflection, 0));
    gl.uniform1f(uniforms.uShine, Math.max(config.shine, 0));
    gl.uniform1f(uniforms.uZoom, Math.max(zoom, 1));
    gl.uniform1f(uniforms.uAlpha, alpha);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disable(gl.SCISSOR_TEST);
  }
  var raf = 0;
  var lastTime = performance.now();
  var destroyed = false;
  var running = false;
  var visible = true;
  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reducedMotion = motionQuery.matches;
  function frame(now) {
    if (destroyed) return;
    if (!visible) {
      running = false;
      return;
    }
    var delta = Math.min((now - lastTime) / 1000, 1 / 30);
    lastTime = now;
    var follow = Math.min(Math.max(config.follow, 0.02), 1);
    var kPos = reducedMotion || follow >= 1 ? 1 : 1 - Math.exp(-delta * (4 + follow * 26));
    var kZoom = reducedMotion ? 1 : 1 - Math.exp(-delta * 7);
    var kScale = reducedMotion ? 1 : 1 - Math.exp(-delta * 11);
    posX += (targetX - posX) * kPos;
    posY += (targetY - posY) * kPos;
    zoom += (zoomTarget - zoom) * kZoom;
    presence += (presenceTarget - presence) * kScale;
    render();
    var settled = Math.abs(targetX - posX) < 0.1 && Math.abs(targetY - posY) < 0.1 && Math.abs(zoomTarget - zoom) < 0.002 && Math.abs(presenceTarget - presence) < 0.002;
    if (settled && !contentDirty) {
      posX = targetX;
      posY = targetY;
      zoom = zoomTarget;
      presence = presenceTarget;
      running = false;
      return;
    }
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (destroyed || running || !visible) return;
    running = true;
    lastTime = performance.now();
    raf = requestAnimationFrame(frame);
  }
  wake = start;
  start();
  var rectCache = createRectCache(output);
  function onPointerMove(event) {
    var _target$closest;
    var rect = rectCache.current;
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
    if (!hasPointer) {
      posX = targetX;
      posY = targetY;
      hasPointer = true;
    }
    presenceTarget = 1;
    var target = event.target;
    zoomTarget = config.zoom > 1 && target !== null && target !== void 0 && (_target$closest = target.closest) !== null && _target$closest !== void 0 && _target$closest.call(target, config.targets) ? Math.min(Math.max(config.zoom, 1), 4) : 1;
    start();
  }
  function onPointerLeave() {
    presenceTarget = 0;
    zoomTarget = 1;
    hasPointer = false;
    start();
  }
  content.addEventListener("pointermove", onPointerMove, {
    passive: true
  });
  content.addEventListener("pointerleave", onPointerLeave, {
    passive: true
  });
  function onScroll() {
    start();
  }
  content.addEventListener("scroll", onScroll, {
    passive: true
  });
  function onMotionChange() {
    reducedMotion = motionQuery.matches;
    start();
  }
  motionQuery.addEventListener("change", onMotionChange);
  var observer = createCanvasResizeObserver(function () {
    syncCanvasSize();
    start();
  });
  observer.observe(output);
  observer.observe(content);
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
  return {
    setOptions: function setOptions(next) {
      next = resolveOptions(DEFAULTS, next);
      if (!Object.entries(next).some(function (_ref) {
        var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];
        return config[key] !== value;
      })) return;
      Object.assign(config, next);
      start();
    },
    resize: function resize() {
      syncCanvasSize();
      start();
    },
    destroy: function destroy() {
      destroyed = true;
      rectCache.destroy();
      cancelAnimationFrame(raf);
      content.removeEventListener("pointermove", onPointerMove);
      content.removeEventListener("pointerleave", onPointerLeave);
      content.removeEventListener("scroll", onScroll);
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
      gl.deleteTexture(contentTexture);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(quad);
      if (htmlInCanvas) paintable.onpaint = null;
    }
  };
}
var emptySubscribe = function emptySubscribe() {
  return function () {};
};
function Glass(_ref3) {
  var children = _ref3.children,
    className = _ref3.className,
    style = _ref3.style,
    options = (0, _objectWithoutProperties2["default"])(_ref3, _excluded);
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
  var _native = supported && !failed;
  (0, _react.useEffect)(function () {
    var source = sourceRef.current;
    var content = contentRef.current;
    var output = outputRef.current;
    if (!source || !content || !output) return;
    instanceRef.current = createGlass({
      source: source,
      content: content,
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
  return __jsx("div", {
    className: className,
    style: _objectSpread({
      position: "relative"
    }, style)
  }, __jsx("canvas", {
    ref: sourceRef
    // @ts-expect-error experimental html-in-canvas attribute
    ,
    layoutsubtree: "true",
    suppressHydrationWarning: true,
    style: _native ? {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%"
    } : {
      display: "none"
    }
  }, _native ? __jsx("div", {
    ref: contentRef,
    style: {
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "auto"
    }
  }, children) : null), !_native ? __jsx("div", {
    ref: contentRef,
    style: {
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "auto"
    }
  }, children) : null, __jsx("canvas", {
    ref: outputRef,
    "aria-hidden": true,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none"
    }
  }));
}
var _default = exports["default"] = Glass;