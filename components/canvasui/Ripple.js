"use strict";
"use client";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ripple = Ripple;
exports.createRipple = createRipple;
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
  amplitude: 0.5,
  speed: 0.65,
  wavelength: 80,
  rings: 2,
  decay: 1,
  refraction: 100,
  dispersion: 0.5,
  shine: 0.5,
  trigger: "click",
  interval: 0
};
var MAX_RIPPLES = 12;
var BASE_SPEED = 340;
var VERT = "#version 300 es\nprecision highp float;\nlayout(location = 0) in vec2 aPos;\nout vec2 vUv;\nvoid main () {\n  vUv = aPos * 0.5 + 0.5;\n  gl_Position = vec4(aPos, 0.0, 1.0);\n}";
var FRAG = "#version 300 es\nprecision highp float;\nin vec2 vUv;\nout vec4 outColor;\nuniform sampler2D uContent;\nuniform vec2 uResolution;\nuniform vec4 uRipples[12];\nuniform int uCount;\nuniform float uSpeed;\nuniform float uWavelength;\nuniform float uWidth;\nuniform float uDecay;\nuniform float uRefraction;\nuniform float uDispersion;\nuniform float uShine;\nuniform float uHasContent;\nuniform float uMaxX;\n\nvec4 page (vec2 p) {\n  p.x = clamp(p.x, 0.0005, uMaxX - 0.0005);\n  p.y = clamp(p.y, 0.0005, 0.9995);\n  return texture(uContent, p);\n}\n\nvoid main () {\n  vec2 pUv = vec2(vUv.x, 1.0 - vUv.y);\n  vec2 frag = pUv * uResolution;\n\n  vec2 grad = vec2(0.0);\n  float k = 6.28318530718 / uWavelength;\n  float w2 = uWidth * uWidth;\n\n  for (int i = 0; i < 12; i++) {\n    if (i >= uCount) break;\n    vec4 rp = uRipples[i];\n    vec2 dv = frag - rp.xy;\n    float r = length(dv);\n    float front = uSpeed * rp.z;\n    float s = r - front;\n    float env = exp(-s * s / w2) * exp(-uDecay * rp.z) * rp.w;\n    env *= smoothstep(0.0, 0.08, rp.z);\n    env *= inversesqrt(1.0 + front / max(uWavelength, 1.0) * 0.2);\n    if (env < 0.0015) continue;\n    float dh = (k * cos(s * k) - 2.0 * s / w2 * sin(s * k)) * env;\n    grad += dv / max(r, 1.0) * dh * uWavelength * 0.16;\n  }\n\n  float g = dot(grad, vec2(-0.55, -0.8));\n  float glint = pow(clamp(g * 2.2, 0.0, 1.0), 2.0) * uShine;\n  float shade = pow(clamp(-g * 1.6, 0.0, 1.0), 2.0) * uShine * 0.3;\n\n  if (uHasContent < 0.5) {\n    float a = clamp(glint * 0.9 + shade * 0.5, 0.0, 0.85);\n    outColor = vec4(vec3(glint * 0.9), a);\n    return;\n  }\n\n  vec2 offs = grad * uRefraction / uResolution;\n  vec3 col;\n  if (uDispersion > 0.001) {\n    float d = uDispersion * 0.35;\n    col = vec3(\n      page(pUv + offs * (1.0 + d)).r,\n      page(pUv + offs).g,\n      page(pUv + offs * (1.0 - d)).b\n    );\n  } else {\n    col = page(pUv + offs).rgb;\n  }\n  col += glint;\n  col *= 1.0 - shade;\n  outColor = vec4(col, 1.0);\n}";
function supportsHtmlInCanvas() {
  if (typeof document === "undefined" || isHtmlInCanvasBlocked()) return false;
  var probe = document.createElement("canvas");
  var ctx = probe.getContext("2d");
  return Boolean(ctx && typeof ctx.drawElementImage === "function" && typeof probe.requestPaint === "function");
}
function createRipple(elements) {
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
      console.error("Ripple shader error:", gl.getShaderInfoLog(shader));
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
    uniforms[info.name.replace("[0]", "")] = gl.getUniformLocation(program, info.name);
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
  syncCanvasSize();
  function uploadContent() {
    if (!htmlInCanvas || !contentDirty) return;
    contentDirty = false;
    gl.bindTexture(gl.TEXTURE_2D, contentTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  }
  var ripples = [];
  var rippleData = new Float32Array(MAX_RIPPLES * 4);
  function splash(x, y) {
    var strength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    if (reducedMotion) return;
    if (ripples.length >= MAX_RIPPLES) ripples.shift();
    ripples.push({
      x: x,
      y: y,
      age: 0,
      amp: strength
    });
    start();
  }
  function pruneRipples(delta) {
    var diag = Math.hypot(output.clientWidth, output.clientHeight);
    var speedPx = BASE_SPEED * Math.max(config.speed, 0.05);
    var width = config.wavelength * Math.max(config.rings, 1) * 0.5;
    for (var _i2 = ripples.length - 1; _i2 >= 0; _i2--) {
      var rp = ripples[_i2];
      rp.age += delta;
      var gone = rp.age * speedPx > diag + width * 3 || Math.exp(-Math.max(config.decay, 0.05) * rp.age) * rp.amp < 0.012;
      if (gone) ripples.splice(_i2, 1);
    }
  }
  function render() {
    uploadContent();
    var dpr = output.width / Math.max(output.clientWidth, 1);
    gl.useProgram(program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, contentTexture);
    gl.uniform1i(uniforms.uContent, 0);
    gl.uniform2f(uniforms.uResolution, output.width, output.height);
    for (var _i3 = 0; _i3 < MAX_RIPPLES; _i3++) {
      var rp = ripples[_i3];
      rippleData[_i3 * 4] = rp ? rp.x * dpr : 0;
      rippleData[_i3 * 4 + 1] = rp ? rp.y * dpr : 0;
      rippleData[_i3 * 4 + 2] = rp ? rp.age : 0;
      rippleData[_i3 * 4 + 3] = rp ? rp.amp * Math.max(config.amplitude, 0) : 0;
    }
    gl.uniform4fv(uniforms.uRipples, rippleData);
    gl.uniform1i(uniforms.uCount, ripples.length);
    gl.uniform1f(uniforms.uSpeed, BASE_SPEED * Math.max(config.speed, 0.05) * dpr);
    gl.uniform1f(uniforms.uWavelength, Math.max(config.wavelength, 4) * dpr);
    gl.uniform1f(uniforms.uWidth, Math.max(config.wavelength, 4) * Math.max(config.rings, 1) * 0.5 * dpr);
    gl.uniform1f(uniforms.uDecay, Math.max(config.decay, 0.05));
    gl.uniform1f(uniforms.uRefraction, Math.max(config.refraction, 0) * dpr);
    gl.uniform1f(uniforms.uDispersion, Math.max(config.dispersion, 0));
    gl.uniform1f(uniforms.uShine, Math.max(config.shine, 0));
    gl.uniform1f(uniforms.uHasContent, htmlInCanvas ? 1 : 0);
    gl.uniform1f(uniforms.uMaxX, contentMaxX);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, output.width, output.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  function renderIdle() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, output.width, output.height);
    if (htmlInCanvas) {
      render();
    } else {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  }
  var raf = 0;
  var lastTime = performance.now();
  var destroyed = false;
  var running = false;
  var visible = true;
  var ambientTimer = 0;
  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reducedMotion = motionQuery.matches;
  function spawnAmbient() {
    var w = output.clientWidth;
    var h = output.clientHeight;
    if (w < 10 || h < 10) return;
    splash(w * (0.15 + Math.random() * 0.7), h * (0.15 + Math.random() * 0.7), 0.6 + Math.random() * 0.5);
  }
  function frame(now) {
    if (destroyed) return;
    if (!visible) {
      running = false;
      return;
    }
    var delta = Math.min(Math.max((now - lastTime) / 1000, 0), 1 / 30);
    lastTime = now;
    if (!reducedMotion) {
      pruneRipples(delta);
      if (config.interval > 0) {
        ambientTimer += delta;
        if (ambientTimer >= config.interval) {
          ambientTimer = 0;
          spawnAmbient();
        }
      }
    }
    if (ripples.length > 0) {
      render();
    } else {
      renderIdle();
      if (!contentDirty && (config.interval <= 0 || reducedMotion)) {
        running = false;
        return;
      }
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
  function localPoint(event) {
    var rect = output.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }
  var hoverX = -1e5;
  var hoverY = -1e5;
  function onPointerDown(event) {
    if (config.trigger === "none") return;
    var _localPoint = localPoint(event),
      _localPoint2 = (0, _slicedToArray2["default"])(_localPoint, 2),
      x = _localPoint2[0],
      y = _localPoint2[1];
    splash(x, y, 1);
  }
  function onPointerMove(event) {
    if (config.trigger !== "hover") return;
    var _localPoint3 = localPoint(event),
      _localPoint4 = (0, _slicedToArray2["default"])(_localPoint3, 2),
      x = _localPoint4[0],
      y = _localPoint4[1];
    if (Math.hypot(x - hoverX, y - hoverY) < 56) return;
    hoverX = x;
    hoverY = y;
    splash(x, y, 0.3);
  }
  content.addEventListener("pointerdown", onPointerDown, {
    passive: true
  });
  content.addEventListener("pointermove", onPointerMove, {
    passive: true
  });
  function onMotionChange() {
    reducedMotion = motionQuery.matches;
    if (reducedMotion) ripples.length = 0;
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
    splash: splash,
    resize: function resize() {
      syncCanvasSize();
      start();
    },
    destroy: function destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      content.removeEventListener("pointerdown", onPointerDown);
      content.removeEventListener("pointermove", onPointerMove);
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
function Ripple(_ref3) {
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
    instanceRef.current = createRipple({
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
var _default = exports["default"] = Ripple;