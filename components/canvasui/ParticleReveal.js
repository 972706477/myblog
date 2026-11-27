"use strict";
"use client";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParticleReveal = ParticleReveal;
exports.createParticleReveal = createParticleReveal;
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
  radius: 500,
  softness: 0.75,
  size: 1,
  scatter: 25,
  drift: 1,
  aberration: 40,
  bend: 50,
  fade: 0.85,
  threshold: 0.1,
  background: "#000000",
  smoothing: 0.25
};
var VERT = "#version 300 es\nprecision highp float;\nlayout(location = 0) in vec2 aPos;\nout vec2 vUv;\nvoid main () {\n  vUv = aPos * 0.5 + 0.5;\n  gl_Position = vec4(aPos, 0.0, 1.0);\n}";
var FRAG = "#version 300 es\nprecision highp float;\nin vec2 vUv;\nout vec4 outColor;\nuniform sampler2D uContent;\nuniform vec2 uRes;\nuniform float uDpr;\nuniform vec2 uPointer;\nuniform float uActive;\nuniform float uRadius;\nuniform float uSoftness;\nuniform float uSize;\nuniform float uScatter;\nuniform float uDrift;\nuniform float uAberration;\nuniform float uBend;\nuniform float uFade;\nuniform float uThreshold;\nuniform vec3 uBg;\nuniform float uTime;\nuniform float uMaxX;\nuniform float uCrisp;\n\nfloat hash (vec2 p) {\n  vec3 p3 = fract(vec3(p.xyx) * 0.1031);\n  p3 += dot(p3, p3.yzx + 33.33);\n  return fract((p3.x + p3.y) * p3.z);\n}\n\nvec4 samp (vec2 p) {\n  vec2 uv = p / uRes;\n  uv = clamp(uv, vec2(0.001), vec2(uMaxX - 0.001, 0.999));\n  return texture(uContent, uv);\n}\n\nvoid main () {\n  vec2 pc = vec2(vUv.x, 1.0 - vUv.y) * uRes;\n  if (pc.x > uMaxX * uRes.x) {\n    outColor = vec4(0.0);\n    return;\n  }\n  if (uCrisp > 0.5) {\n    outColor = samp(pc);\n    return;\n  }\n\n  float dist = length(pc - uPointer);\n  float radius = max(uRadius, 1.0);\n  float inner = radius * (1.0 - clamp(uSoftness, 0.02, 1.0));\n  float e = (1.0 - smoothstep(inner, radius, dist)) * uActive;\n\n  float band = radius * 0.9;\n  float ring = smoothstep(inner, radius, dist)\n    * (1.0 - smoothstep(radius, radius + band, dist))\n    * uActive;\n\n  vec2 dir = (pc - uPointer) / max(dist, 1e-3);\n  vec2 tang = vec2(-dir.y, dir.x);\n  vec2 warp = (dir * -1.0 + tang * 0.6) * uBend * ring;\n  float ca = uAberration * ring;\n\n  float cellPx = max(uSize, 0.5) * uDpr;\n  vec2 cell = floor(gl_FragCoord.xy / cellPx);\n  float n1 = hash(cell);\n  float n2 = hash(cell + vec2(3.1, 7.7));\n  float n3 = hash(cell + vec2(9.3, 1.3));\n  float ft = floor(uTime * (2.0 + uDrift * 6.0));\n  float n4 = hash(cell + vec2(ft * 0.613, ft * 0.831));\n\n  float g0 = uThreshold * 0.6;\n  float g1 = uThreshold * 1.6 + 0.01;\n  vec3 lw = vec3(0.299, 0.587, 0.114);\n\n  vec2 bp = pc + warp;\n  vec4 bR = samp(bp + dir * ca);\n  vec4 bC = samp(bp);\n  vec4 bB = samp(bp - dir * ca);\n  vec3 baseRgb = vec3(bR.r, bC.g, bB.b);\n  float uiHome = smoothstep(g0, g1, dot(abs(baseRgb - uBg), lw));\n\n  float rad = uScatter * pow(n1, 2.5) * (1.0 - e);\n  float ang = n2 * 6.2832 + uTime * uDrift * (0.5 + n3 * 1.5);\n  vec2 dustP = bp + vec2(cos(ang), sin(ang)) * rad;\n\n  vec4 dR = samp(dustP + dir * ca);\n  vec4 dC = samp(dustP);\n  vec4 dB = samp(dustP - dir * ca);\n  vec3 dustRgb = vec3(dR.r, dC.g, dB.b);\n  float lumD = dot(dustRgb, lw);\n  float dDust = dot(abs(dustRgb - uBg), lw);\n\n  float gate = smoothstep(g0, g1, dDust);\n  float falloff = 1.0 - 0.7 * rad / max(uScatter, 1.0);\n  float prob = clamp(gate * (0.15 + 1.2 * sqrt(dDust)) * falloff, 0.0, 1.0) * uiHome;\n  float speck = step(n4 * 0.999, prob);\n\n  float shade = pow(lumD, 0.4) * (0.8 + 0.4 * n3);\n  vec3 dustCol = mix(uBg, vec3(shade), clamp(uFade, 0.0, 1.0));\n\n  vec3 unrevealed = mix(mix(baseRgb, uBg, uiHome), dustCol, speck);\n  vec3 col = mix(unrevealed, baseRgb, e);\n  float alpha = mix(bC.a, dC.a, speck * (1.0 - e));\n  outColor = vec4(col, alpha);\n}";
var colorProbe = null;
function parseColor(input) {
  if (typeof document === "undefined") return [0, 0, 0];
  if (!colorProbe) {
    var probe = document.createElement("canvas");
    probe.width = 1;
    probe.height = 1;
    colorProbe = probe.getContext("2d", {
      willReadFrequently: true
    });
  }
  if (!colorProbe) return [0, 0, 0];
  colorProbe.fillStyle = "#000000";
  colorProbe.fillStyle = input;
  colorProbe.clearRect(0, 0, 1, 1);
  colorProbe.fillRect(0, 0, 1, 1);
  var data = colorProbe.getImageData(0, 0, 1, 1).data;
  return [data[0] / 255, data[1] / 255, data[2] / 255];
}
function supportsHtmlInCanvas() {
  if (typeof document === "undefined" || isHtmlInCanvasBlocked()) return false;
  var probe = document.createElement("canvas");
  var ctx = probe.getContext("2d");
  return Boolean(ctx && typeof ctx.drawElementImage === "function" && typeof probe.requestPaint === "function");
}
function createParticleReveal(elements) {
  var _output$parentElement;
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
    premultipliedAlpha: false
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
        drawHtmlInCanvas(source, sourceCtx, content);
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
      console.error("ParticleReveal shader error:", gl.getShaderInfoLog(shader));
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
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
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
  var pointer = {
    x: -1e5,
    y: -1e5,
    tx: -1e5,
    ty: -1e5,
    active: 0,
    target: 0
  };
  var time = 0;
  var bgKey = "";
  var bg = [0, 0, 0];
  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reducedMotion = motionQuery.matches;
  syncCanvasSize();
  function uploadContent() {
    if (!htmlInCanvas || !contentDirty) return;
    contentDirty = false;
    gl.bindTexture(gl.TEXTURE_2D, contentTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  }
  function render() {
    uploadContent();
    var w = Math.max(output.clientWidth, 1);
    var h = Math.max(output.clientHeight, 1);
    var dpr = output.width / w;
    gl.useProgram(program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, contentTexture);
    gl.uniform1i(uniforms.uContent, 0);
    gl.uniform2f(uniforms.uRes, w, h);
    gl.uniform1f(uniforms.uDpr, dpr);
    gl.uniform2f(uniforms.uPointer, pointer.x, pointer.y);
    gl.uniform1f(uniforms.uActive, pointer.active);
    gl.uniform1f(uniforms.uRadius, Math.max(config.radius, 1));
    gl.uniform1f(uniforms.uSoftness, config.softness);
    gl.uniform1f(uniforms.uSize, Math.max(config.size, 0.5));
    gl.uniform1f(uniforms.uScatter, Math.max(config.scatter, 0));
    gl.uniform1f(uniforms.uDrift, Math.max(config.drift, 0));
    gl.uniform1f(uniforms.uAberration, Math.max(config.aberration, 0));
    gl.uniform1f(uniforms.uBend, Math.max(config.bend, 0));
    gl.uniform1f(uniforms.uFade, config.fade);
    gl.uniform1f(uniforms.uThreshold, Math.max(config.threshold, 0));
    if (config.background !== bgKey) {
      bgKey = config.background;
      bg = parseColor(config.background);
    }
    gl.uniform3f(uniforms.uBg, bg[0], bg[1], bg[2]);
    gl.uniform1f(uniforms.uTime, time);
    gl.uniform1f(uniforms.uMaxX, contentMaxX);
    gl.uniform1f(uniforms.uCrisp, reducedMotion || !htmlInCanvas ? 1 : 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, output.width, output.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  var raf = 0;
  var lastTime = performance.now();
  var destroyed = false;
  var running = false;
  var visible = true;
  function frame(now) {
    if (destroyed) return;
    if (!visible) {
      running = false;
      return;
    }
    var delta = Math.min((now - lastTime) / 1000, 1 / 30);
    lastTime = now;
    time += delta;
    var tau = Math.max(config.smoothing, 1e-4);
    var k = reducedMotion ? 1 : 1 - Math.exp(-delta / tau);
    pointer.x += (pointer.tx - pointer.x) * k;
    pointer.y += (pointer.ty - pointer.y) * k;
    pointer.active += (pointer.target - pointer.active) * k;
    render();
    var settled = Math.abs(pointer.tx - pointer.x) < 0.1 && Math.abs(pointer.ty - pointer.y) < 0.1 && Math.abs(pointer.target - pointer.active) < 1e-3;
    if (settled && !contentDirty && (reducedMotion || !htmlInCanvas || config.drift <= 0)) {
      pointer.x = pointer.tx;
      pointer.y = pointer.ty;
      pointer.active = pointer.target;
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
  var listenTarget = (_output$parentElement = output.parentElement) !== null && _output$parentElement !== void 0 ? _output$parentElement : output;
  var rectCache = createRectCache(output);
  function onPointerMove(event) {
    var rect = rectCache.current;
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    if (pointer.target === 0 && pointer.active < 1e-3) {
      pointer.x = x;
      pointer.y = y;
    }
    pointer.tx = x;
    pointer.ty = y;
    pointer.target = 1;
    start();
  }
  function onPointerLeave() {
    pointer.target = 0;
    start();
  }
  listenTarget.addEventListener("pointermove", onPointerMove, {
    passive: true
  });
  listenTarget.addEventListener("pointerleave", onPointerLeave, {
    passive: true
  });
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
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
      listenTarget.removeEventListener("pointermove", onPointerMove);
      listenTarget.removeEventListener("pointerleave", onPointerLeave);
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
function ParticleReveal(_ref3) {
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
    instanceRef.current = createParticleReveal({
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
var _default = exports["default"] = ParticleReveal;