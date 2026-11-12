/* ==========================================================
   Hero visual 3 — the journey on a dotted globe.
   Land is drawn as dots, the globe turns slowly, and lights
   travel along the arc from Gaza to Sydney.
   Plain canvas, no libraries. Needs globe-data.js.
   ========================================================== */
(() => {
  'use strict';

  const stage = document.getElementById('heroStack');
  const canvas = document.getElementById('globe');
  if (!stage || !canvas || !window.GAP_LAND) return;

  const ctx = canvas.getContext('2d');
  const labelFrom = document.getElementById('placeFrom');
  const labelTo = document.getElementById('placeTo');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const RAD = Math.PI / 180;

  const TEAL = [0, 194, 170];
  const ORANGE = [255, 143, 28];

  /* ---------- geometry ---------- */
  // x = east, y = north, z = toward the viewer (for longitude 0, latitude 0)
  const toVec = (lat, lon) => {
    const p = lat * RAD;
    const l = lon * RAD;
    return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
  };

  const GAZA = toVec(31.5, 34.47);
  const SYDNEY = toVec(-33.87, 151.21);

  // The view looks at South-East Asia, so both ends of the journey are in sight
  // and the raised arc bows across the Indian Ocean.
  const VIEW_LAT = 16 * RAD;
  const VIEW_LON = 99 * RAD;

  // decode the land dots: 4 base-64 characters each (latitude, longitude)
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const value = {};
  for (let i = 0; i < ALPHABET.length; i += 1) value[ALPHABET[i]] = i;

  const packed = window.GAP_LAND;
  const count = packed.length / 4;
  const land = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const o = i * 4;
    const lat = ((value[packed[o]] << 6) | value[packed[o + 1]]) / 20 - 90;
    const lon = ((value[packed[o + 2]] << 6) | value[packed[o + 3]]) / 10 - 180;
    const v = toVec(lat, lon);
    land[i * 3] = v[0];
    land[i * 3 + 1] = v[1];
    land[i * 3 + 2] = v[2];
  }

  // the arc: a great circle from Gaza to Sydney, lifted off the surface in the middle
  const ARC_STEPS = 110;
  const ARC_LIFT = 0.42;
  const arc = [];
  {
    const dot = GAZA[0] * SYDNEY[0] + GAZA[1] * SYDNEY[1] + GAZA[2] * SYDNEY[2];
    const omega = Math.acos(dot);
    const sinOmega = Math.sin(omega);
    for (let i = 0; i <= ARC_STEPS; i += 1) {
      const t = i / ARC_STEPS;
      const a = Math.sin((1 - t) * omega) / sinOmega;
      const b = Math.sin(t * omega) / sinOmega;
      const lift = 1 + ARC_LIFT * Math.sin(Math.PI * t);
      arc.push([
        (a * GAZA[0] + b * SYDNEY[0]) * lift,
        (a * GAZA[1] + b * SYDNEY[1]) * lift,
        (a * GAZA[2] + b * SYDNEY[2]) * lift
      ]);
    }
  }

  /* ---------- view ---------- */
  let width = 0;
  let height = 0;
  let dpr = 1;
  let cx = 0;
  let cy = 0;
  let radius = 0;

  // rotation terms, refreshed every frame
  let sinLon = 0;
  let cosLon = 1;
  let sinLat = 0;
  let cosLat = 1;

  // pointer pulls the globe a little
  let pullX = 0;
  let pullY = 0;
  let aimX = 0;
  let aimY = 0;

  const out = [0, 0, 0];
  function project(v) {
    const x1 = v[0] * cosLon - v[2] * sinLon;
    const z1 = v[0] * sinLon + v[2] * cosLon;
    out[0] = cx + x1 * radius;
    out[1] = cy - (v[1] * cosLat - z1 * sinLat) * radius;
    out[2] = v[1] * sinLat + z1 * cosLat;
    return out;
  }

  function resize() {
    const box = canvas.getBoundingClientRect();
    if (!box.width) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.round(box.width * dpr);
    height = Math.round(box.height * dpr);
    canvas.width = width;
    canvas.height = height;
    cx = width * 0.5;
    cy = height * 0.5;
    radius = Math.min(width, height) * 0.385;
  }

  const rgba = (c, a) => 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a.toFixed(3) + ')';
  const mix = (a, b, t) => [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t)
  ];

  /* ---------- drawing ---------- */
  function drawBody() {
    // halo
    const halo = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.32);
    halo.addColorStop(0, 'rgba(0,194,170,.38)');
    halo.addColorStop(1, 'rgba(0,194,170,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.32, 0, Math.PI * 2);
    ctx.fill();

    // the sphere itself, lit from the upper left
    const body = ctx.createRadialGradient(cx - radius * 0.38, cy - radius * 0.42, radius * 0.05, cx, cy, radius);
    body.addColorStop(0, 'rgba(0,128,113,.9)');
    body.addColorStop(0.55, 'rgba(0,62,55,.92)');
    body.addColorStop(1, 'rgba(3,22,20,.96)');
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 1.2 * dpr;
    ctx.strokeStyle = 'rgba(140,255,238,.4)';
    ctx.stroke();
  }

  function drawLand() {
    const size = Math.max(1.6, radius / 105);
    ctx.fillStyle = '#5FF0DC';
    for (let i = 0; i < land.length; i += 3) {
      const x1 = land[i] * cosLon - land[i + 2] * sinLon;
      const z1 = land[i] * sinLon + land[i + 2] * cosLon;
      const z = land[i + 1] * sinLat + z1 * cosLat;
      if (z <= 0.02) continue;
      const s = size * (0.55 + 0.75 * z);
      ctx.globalAlpha = 0.22 + 0.78 * z;
      ctx.fillRect(cx + x1 * radius - s / 2, cy - (land[i + 1] * cosLat - z1 * sinLat) * radius - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  }

  // screen position of every point on the arc; hidden ones are behind the globe
  const arcX = new Float32Array(ARC_STEPS + 1);
  const arcY = new Float32Array(ARC_STEPS + 1);
  const arcShown = new Uint8Array(ARC_STEPS + 1);

  function placeArc() {
    for (let i = 0; i <= ARC_STEPS; i += 1) {
      const p = project(arc[i]);
      arcX[i] = p[0];
      arcY[i] = p[1];
      const dx = (p[0] - cx) / radius;
      const dy = (p[1] - cy) / radius;
      arcShown[i] = p[2] > 0 || dx * dx + dy * dy > 1 ? 1 : 0;
    }
  }

  function drawArc(time) {
    // the whole route, faint and dotted
    ctx.lineCap = 'round';
    ctx.setLineDash([1.5 * dpr, 7 * dpr]);
    ctx.lineWidth = 2.4 * dpr;
    for (let i = 1; i <= ARC_STEPS; i += 1) {
      if (!arcShown[i] || !arcShown[i - 1]) continue;
      ctx.strokeStyle = rgba(mix(ORANGE, TEAL, i / ARC_STEPS), 0.85);
      ctx.beginPath();
      ctx.moveTo(arcX[i - 1], arcY[i - 1]);
      ctx.lineTo(arcX[i], arcY[i]);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // lights travelling along it
    const TAIL = 0.2;
    const lights = reduceMotion ? [0.55] : [(time * 0.22) % 1.3, (time * 0.22 + 0.65) % 1.3];
    ctx.shadowBlur = 16 * dpr;
    lights.forEach((head) => {
      const last = Math.min(ARC_STEPS, Math.floor(head * ARC_STEPS));
      const first = Math.max(1, Math.floor((head - TAIL) * ARC_STEPS));
      for (let i = first; i <= last; i += 1) {
        if (!arcShown[i] || !arcShown[i - 1]) continue;
        const along = (i / ARC_STEPS - (head - TAIL)) / TAIL;      // 0 at the tail, 1 at the head
        const colour = mix(ORANGE, TEAL, i / ARC_STEPS);
        ctx.shadowColor = rgba(colour, 0.9);
        ctx.strokeStyle = rgba(mix(colour, [255, 255, 255], along * 0.6), Math.max(0, along));
        ctx.lineWidth = (1.2 + 3.8 * along) * dpr;
        ctx.beginPath();
        ctx.moveTo(arcX[i - 1], arcY[i - 1]);
        ctx.lineTo(arcX[i], arcY[i]);
        ctx.stroke();
      }
      if (head <= 1 && arcShown[last]) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(arcX[last], arcY[last], 3.4 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.shadowBlur = 0;
  }

  function drawPlace(v, colour, time, label, dx, dy) {
    const p = project(v);
    const shown = p[2] > 0.03;
    if (label) {
      label.style.opacity = shown ? 1 : 0;
      label.style.transform = 'translate(' + (p[0] / dpr).toFixed(1) + 'px,' + (p[1] / dpr).toFixed(1) + 'px) translate(' + dx + ',' + dy + ')';
    }
    if (!shown) return;

    // ripples
    ctx.lineWidth = 1.6 * dpr;
    for (let k = 0; k < 2; k += 1) {
      const phase = reduceMotion ? 0.35 + k * 0.3 : (time * 0.45 + k * 0.5) % 1;
      ctx.strokeStyle = rgba(colour, (1 - phase) * 0.85);
      ctx.beginPath();
      ctx.arc(p[0], p[1], (5 + 26 * phase) * dpr, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.shadowBlur = 18 * dpr;
    ctx.shadowColor = rgba(colour, 1);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(p[0], p[1], 4.6 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = rgba(colour, 1);
    ctx.lineWidth = 2.2 * dpr;
    ctx.stroke();
  }

  function frame(ms) {
    const time = ms / 1000;
    pullX += (aimX - pullX) * 0.06;
    pullY += (aimY - pullY) * 0.06;

    const sway = reduceMotion ? 0 : 1;
    const lon = VIEW_LON + sway * 0.11 * Math.sin(time * 0.28) + pullX * 0.16;
    const lat = VIEW_LAT + sway * 0.05 * Math.sin(time * 0.19) + pullY * 0.1;
    sinLon = Math.sin(lon);
    cosLon = Math.cos(lon);
    sinLat = Math.sin(lat);
    cosLat = Math.cos(lat);

    ctx.clearRect(0, 0, width, height);
    drawBody();
    drawLand();
    placeArc();
    drawArc(time);
    drawPlace(GAZA, ORANGE, time, labelFrom, '-50%', '-185%');
    drawPlace(SYDNEY, TEAL, time + 0.25, labelTo, '-50%', '85%');
  }

  /* ---------- run only while the globe is on screen ---------- */
  let running = false;
  let onScreen = true;

  function loop(ms) {
    if (!running) return;
    frame(ms);
    requestAnimationFrame(loop);
  }

  function update() {
    const visible = canvas.offsetParent !== null && onScreen && !document.hidden;
    if (visible && !width) resize();
    if (reduceMotion) {
      if (visible && width) frame(0);
      return;
    }
    if (visible && !running) {
      running = true;
      requestAnimationFrame(loop);
    } else if (!visible) {
      running = false;
    }
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      onScreen = entries[0].isIntersecting;
      update();
    }, { threshold: 0.02 }).observe(stage);
  }

  document.addEventListener('visibilitychange', update);
  window.addEventListener('resize', () => {
    resize();
    update();
  }, { passive: true });

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    stage.addEventListener('pointermove', (event) => {
      const box = stage.getBoundingClientRect();
      aimX = -((event.clientX - box.left) / box.width - 0.5) * 2;
      aimY = ((event.clientY - box.top) / box.height - 0.5) * 2;
    });
    stage.addEventListener('pointerleave', () => {
      aimX = 0;
      aimY = 0;
    });
  }

  resize();
  update();
})();
