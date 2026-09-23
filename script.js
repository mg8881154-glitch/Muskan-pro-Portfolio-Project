// ==========================================================================
// MUSKAN GUPTA — PORTFOLIO INTERACTIONS (LANDO NORRIS ENGINE)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const loader = document.getElementById('loader');
  const loadButton = document.getElementById('loadButton');
  const menuToggle = document.getElementById('menuToggle');
  const navDrawer = document.getElementById('navDrawer');
  const scrollIndicator = document.getElementById('scrollIndicator');
  const driveLock = document.getElementById('driveLock');
  const lockLabel = document.getElementById('lockLabel');
  const counters = document.querySelectorAll('[data-count]');
  const menuLinks = document.querySelectorAll('.nav-menu-link-w');
  const previewCards = document.querySelectorAll('.nav-menu-img-card');
  const calendarRows = document.querySelectorAll('.calendar-row');

  // --- 1. Intro Loading Screen ---
  function hideLoader() {
    if (loader) {
      loader.classList.add('is-hidden');
    }
  }

  if (loadButton) {
    loadButton.addEventListener('click', hideLoader);
  }

  // Auto-hide fallback after 2.5s if not clicked
  window.addEventListener('load', () => {
    window.setTimeout(() => {
      if (loader && !loader.classList.contains('is-hidden')) {
        // keep open until clicked or after 3.5s
        window.setTimeout(hideLoader, 3500);
      }
    }, 500);
  });

  // --- 2. Fullscreen Drawer Navigation ---
  function toggleMenu() {
    const isOpen = navDrawer.classList.contains('is-open');
    if (isOpen) {
      navDrawer.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
      navDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    } else {
      navDrawer.classList.add('is-open');
      menuToggle.classList.add('is-active');
      menuToggle.setAttribute('aria-expanded', 'true');
      navDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  if (menuToggle && navDrawer) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  // Drawer Link Hover Image Swapping
  menuLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      const targetKey = link.getAttribute('data-menu-item');
      previewCards.forEach((card) => {
        if (card.getAttribute('data-nav-preview') === targetKey) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    });

    // Close menu when link clicked
    link.addEventListener('click', () => {
      if (navDrawer.classList.contains('is-open')) {
        toggleMenu();
      }
    });
  });

  // --- 3. Scroll Progress Indicator ---
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0 && scrollIndicator) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollIndicator.style.height = `${scrollPercent}%`;
    }
  }, { passive: true });

  // --- 4. Interactive Drive Lock Toggle ---
  if (driveLock && lockLabel) {
    driveLock.addEventListener('click', () => {
      const isLocked = driveLock.getAttribute('aria-pressed') === 'true';
      driveLock.setAttribute('aria-pressed', String(!isLocked));
      document.body.classList.toggle('is-locked', !isLocked);
      lockLabel.textContent = isLocked ? 'TAP TO LOCK DRIVE' : 'BACK TO SCROLL';
    });
  }

  // --- 5a. Force Resume Download Button ---
  document.querySelectorAll('a[download]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      var link = document.createElement('a');
      link.href = 'resume.pdf';
      link.download = 'Muskan_Gupta_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      e.preventDefault();
    });
  });

  // --- 5. Interactive Calendar Rows ---
  calendarRows.forEach((row) => {
    row.addEventListener('click', () => {
      calendarRows.forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    });
  });

  // --- 6. Telemetry Animated Counters ---
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        const finalValue = Number(target.getAttribute('data-count'));
        const duration = 1400;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          target.textContent = Math.round(finalValue * eased).toLocaleString('en-IN');

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            target.textContent = finalValue.toLocaleString('en-IN');
          }
        }

        requestAnimationFrame(tick);
        observer.unobserve(target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
});

// ==========================================================================
// 3D LAB ENGINE — AI CORE / CYBER TERMINAL / QUANTUM SPHERE
// Three.js r128 — initialised after DOM ready, lazy-bootstrapped on viewport
// ==========================================================================
(function initLab3D() {
  if (typeof THREE === 'undefined') return;

  const canvasContainer = document.getElementById('lab3dCanvasContainer');
  const canvas = document.getElementById('threeCanvas');
  if (!canvasContainer || !canvas) return;

  // HUD elements
  const hudCoords    = document.getElementById('hudCoords');
  const hudCodeStream = document.getElementById('hudCodeStream');
  const dragHint     = document.getElementById('dragHint');
  const autoSpinBtn  = document.getElementById('autoSpinBtn');
  const autoSpinLbl  = document.getElementById('autoSpinLabel');
  const reset3dBtn   = document.getElementById('reset3dBtn');
  const modeBtns     = document.querySelectorAll('[data-3d-mode]');
  const colorBtns    = document.querySelectorAll('[data-core-color]');

  // ── Renderer ──────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // ── Camera ────────────────────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
  camera.position.set(0, 0, 5);

  // ── Scene State ───────────────────────────────────────────────────────────
  let currentMode  = 'neural';
  let glowColor    = new THREE.Color('#d2ff00');
  let autoSpin     = true;
  let rotX = 0, rotY = 0;          // current euler angles
  let targetRotX = 0, targetRotY = 0; // lerp targets
  let isDragging   = false;
  let prevX = 0, prevY = 0;

  // ── Scene ─────────────────────────────────────────────────────────────────
  let scene = new THREE.Scene();
  let sceneGroup = new THREE.Group();
  scene.add(sceneGroup);

  // Ambient + directional lights (reused)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  const dirLight     = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 5, 5);
  scene.add(ambientLight, dirLight);

  // ── Helper: dispose group children ────────────────────────────────────────
  function clearGroup(grp) {
    while (grp.children.length) {
      const child = grp.children[0];
      grp.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    }
  }

  // ── Code stream strings for HUD readout ───────────────────────────────────
  const codeLines = [
    'async execute() => { ... }',
    'await judge0.run(code)',
    'groq.chat({ model: "llama3" })',
    'db.collection.insertOne(doc)',
    'fetch("/api/solve", { method: "POST" })',
    'model.predict(features)',
    'router.get("/status", handler)',
    'npm run build && deploy()',
  ];
  let codeIdx = 0;
  setInterval(() => {
    if (hudCodeStream) {
      codeIdx = (codeIdx + 1) % codeLines.length;
      hudCodeStream.textContent = codeLines[codeIdx];
    }
  }, 2200);

  // ── MODE: Neural Core ─────────────────────────────────────────────────────
  function buildNeuralCore() {
    clearGroup(sceneGroup);

    const nodeCount = 60;
    const nodes     = [];
    const nodeGeo   = new THREE.SphereGeometry(0.055, 8, 8);

    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 0.9 + Math.random() * 1.1;
      const mat   = new THREE.MeshBasicMaterial({ color: glowColor, transparent: true, opacity: 0.85 });
      const mesh  = new THREE.Mesh(nodeGeo, mat);
      mesh.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      mesh.userData = { basePos: mesh.position.clone(), phase: Math.random() * Math.PI * 2 };
      sceneGroup.add(mesh);
      nodes.push(mesh);
    }

    // Edges between nearby nodes
    const edgeMat = new THREE.LineBasicMaterial({ color: glowColor, transparent: true, opacity: 0.18 });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < 0.85) {
          const pts = [nodes[i].position, nodes[j].position];
          const geo = new THREE.BufferGeometry().setFromPoints(pts);
          sceneGroup.add(new THREE.Line(geo, edgeMat));
        }
      }
    }

    // Central pulsing core sphere
    const coreMat = new THREE.MeshBasicMaterial({ color: glowColor, transparent: true, opacity: 0.55, wireframe: true });
    const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38, 2), coreMat);
    sceneGroup.add(coreMesh);

    // Orbital rings
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.TorusGeometry(0.55 + r * 0.45, 0.012, 8, 80);
      const ringMat = new THREE.MeshBasicMaterial({ color: glowColor, transparent: true, opacity: 0.5 - r * 0.12 });
      const ring    = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = (r * Math.PI) / 3.5;
      ring.rotation.y = (r * Math.PI) / 4;
      sceneGroup.add(ring);
    }

    // Return per-frame update
    return function updateNeural(t) {
      nodes.forEach((n, i) => {
        const phase = n.userData.phase;
        const pulse = 1 + 0.12 * Math.sin(t * 1.2 + phase);
        n.scale.setScalar(pulse);
        n.position.x = n.userData.basePos.x * pulse;
        n.position.y = n.userData.basePos.y * pulse;
        n.position.z = n.userData.basePos.z * pulse;
      });
      coreMesh.rotation.x += 0.004;
      coreMesh.rotation.y += 0.007;
      coreMesh.material.opacity = 0.35 + 0.2 * Math.sin(t * 1.5);
      sceneGroup.children.forEach((c, i) => {
        if (c.isLine) c.material.opacity = 0.12 + 0.1 * Math.abs(Math.sin(t * 0.5 + i * 0.3));
      });
    };
  }

  // ── MODE: Cyber Terminal (Lattice Cube) ───────────────────────────────────
  function buildCyberTerminal() {
    clearGroup(sceneGroup);

    // Wireframe box
    const boxGeo  = new THREE.BoxGeometry(2.2, 2.2, 2.2, 5, 5, 5);
    const boxMat  = new THREE.MeshBasicMaterial({ color: glowColor, wireframe: true, transparent: true, opacity: 0.35 });
    const box     = new THREE.Mesh(boxGeo, boxMat);
    sceneGroup.add(box);

    // Inner solid box
    const innerGeo = new THREE.BoxGeometry(1.1, 1.1, 1.1);
    const innerMat = new THREE.MeshBasicMaterial({ color: glowColor, transparent: true, opacity: 0.15, wireframe: false });
    const inner    = new THREE.Mesh(innerGeo, innerMat);
    sceneGroup.add(inner);

    // Floating particles
    const ptGeo  = new THREE.BufferGeometry();
    const ptCount = 200;
    const positions = new Float32Array(ptCount * 3);
    for (let i = 0; i < ptCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    ptGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const ptMat  = new THREE.PointsMaterial({ color: glowColor, size: 0.028, transparent: true, opacity: 0.55 });
    const pts    = new THREE.Points(ptGeo, ptMat);
    sceneGroup.add(pts);

    return function updateCyber(t) {
      box.rotation.x  += 0.004;
      box.rotation.y  += 0.006;
      inner.rotation.x -= 0.008;
      inner.rotation.z += 0.005;
      box.material.opacity = 0.25 + 0.12 * Math.sin(t * 2);
      pts.rotation.y      += 0.002;
    };
  }

  // ── MODE: Quantum Sphere ──────────────────────────────────────────────────
  function buildQuantumSphere() {
    clearGroup(sceneGroup);

    // Outer icosahedron wireframe
    const outerGeo = new THREE.IcosahedronGeometry(1.6, 3);
    const outerMat = new THREE.MeshBasicMaterial({ color: glowColor, wireframe: true, transparent: true, opacity: 0.28 });
    const outer    = new THREE.Mesh(outerGeo, outerMat);
    sceneGroup.add(outer);

    // Inner solid icosahedron
    const innerGeo = new THREE.IcosahedronGeometry(0.8, 2);
    const innerMat = new THREE.MeshBasicMaterial({ color: glowColor, transparent: true, opacity: 0.12 });
    const inner    = new THREE.Mesh(innerGeo, innerMat);
    sceneGroup.add(inner);

    // Rings
    for (let i = 0; i < 4; i++) {
      const rGeo  = new THREE.TorusGeometry(1.2 + i * 0.18, 0.008, 6, 100);
      const rMat  = new THREE.MeshBasicMaterial({ color: glowColor, transparent: true, opacity: 0.45 - i * 0.07 });
      const ring  = new THREE.Mesh(rGeo, rMat);
      ring.rotation.x = (i * Math.PI) / 4;
      ring.rotation.z = (i * Math.PI) / 6;
      sceneGroup.add(ring);
    }

    // Particle shell
    const shellGeo = new THREE.BufferGeometry();
    const shellPts = 500;
    const shellPos = new Float32Array(shellPts * 3);
    for (let i = 0; i < shellPts; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 1.65 + (Math.random() - 0.5) * 0.12;
      shellPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      shellPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      shellPos[i * 3 + 2] = r * Math.cos(phi);
    }
    shellGeo.setAttribute('position', new THREE.BufferAttribute(shellPos, 3));
    const shellMat = new THREE.PointsMaterial({ color: glowColor, size: 0.022, transparent: true, opacity: 0.7 });
    const shell    = new THREE.Points(shellGeo, shellMat);
    sceneGroup.add(shell);

    return function updateQuantum(t) {
      outer.rotation.y  += 0.003;
      outer.rotation.x  += 0.001;
      inner.rotation.y  -= 0.006;
      inner.rotation.z  += 0.004;
      inner.material.opacity = 0.08 + 0.08 * Math.sin(t * 1.8);
      outer.material.opacity = 0.2  + 0.1  * Math.sin(t * 1.2);
      shell.rotation.y += 0.0015;
    };
  }

  // ── Build initial scene ───────────────────────────────────────────────────
  let modeUpdateFn = buildNeuralCore();

  // ── Colour application ────────────────────────────────────────────────────
  function applyColor(hex) {
    glowColor = new THREE.Color(hex);
    sceneGroup.traverse((obj) => {
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => { if (m.color) m.color.set(glowColor); });
        else if (obj.material.color) obj.material.color.set(glowColor);
      }
    });
  }

  // ── Resize handling ───────────────────────────────────────────────────────
  function onResize() {
    const w = canvasContainer.clientWidth;
    const h = canvasContainer.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const ro = new ResizeObserver(onResize);
  ro.observe(canvasContainer);
  onResize();

  // ── Drag-to-rotate (mouse + touch) ────────────────────────────────────────
  function onPointerDown(e) {
    isDragging = true;
    prevX = e.clientX ?? e.touches[0].clientX;
    prevY = e.clientY ?? e.touches[0].clientY;
    if (dragHint) dragHint.classList.add('is-hidden');
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const cx = e.clientX ?? (e.touches && e.touches[0].clientX);
    const cy = e.clientY ?? (e.touches && e.touches[0].clientY);
    if (cx === undefined) return;
    const dx = cx - prevX;
    const dy = cy - prevY;
    targetRotY += dx * 0.006;
    targetRotX += dy * 0.006;
    prevX = cx;
    prevY = cy;
  }

  function onPointerUp() { isDragging = false; }

  canvasContainer.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);
  canvasContainer.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // ── Control Buttons ───────────────────────────────────────────────────────
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-3d-mode');
      if (mode === currentMode) return;
      currentMode = mode;
      modeBtns.forEach(b => b.classList.toggle('active', b === btn));
      if (mode === 'neural')    modeUpdateFn = buildNeuralCore();
      if (mode === 'terminal')  modeUpdateFn = buildCyberTerminal();
      if (mode === 'wireframe') modeUpdateFn = buildQuantumSphere();
      applyColor('#' + glowColor.getHexString());
    });
  });

  if (autoSpinBtn) {
    autoSpinBtn.addEventListener('click', () => {
      autoSpin = !autoSpin;
      autoSpinBtn.classList.toggle('active', autoSpin);
      if (autoSpinLbl) autoSpinLbl.textContent = autoSpin ? 'AUTO-SPIN: ON' : 'AUTO-SPIN: OFF';
    });
  }

  if (reset3dBtn) {
    reset3dBtn.addEventListener('click', () => {
      targetRotX = 0;
      targetRotY = 0;
    });
  }

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const hex = btn.getAttribute('data-core-color');
      colorBtns.forEach(b => b.classList.toggle('active', b === btn));
      applyColor(hex);
    });
  });

  // ── Animation Loop ────────────────────────────────────────────────────────
  let rafId = null;
  let isVisible = false;

  function animate(timestamp) {
    rafId = requestAnimationFrame(animate);
    const t = timestamp * 0.001; // seconds

    // Lerp rotation
    rotX += (targetRotX - rotX) * 0.08;
    rotY += (targetRotY - rotY) * 0.08;

    // Auto-spin
    if (autoSpin && !isDragging) {
      targetRotY += 0.004;
    }

    sceneGroup.rotation.x = rotX;
    sceneGroup.rotation.y = rotY;

    // Mode-specific per-frame logic
    if (modeUpdateFn) modeUpdateFn(t);

    // HUD updates
    if (hudCoords) {
      const xDeg = ((rotX * 180) / Math.PI).toFixed(1);
      const yDeg = ((rotY * 180) / Math.PI).toFixed(1);
      hudCoords.textContent = `ROT: X ${xDeg}° | Y ${yDeg}°`;
    }

    renderer.render(scene, camera);
  }

  // Lazy start — only render when section is visible (IntersectionObserver)
  const labObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        isVisible = true;
        rafId = requestAnimationFrame(animate);
      } else if (!entry.isIntersecting && isVisible) {
        isVisible = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      }
    },
    { threshold: 0.05 }
  );
  labObserver.observe(canvasContainer);
})();

// ==========================================================================
// COCKPIT MODE -- INTERACTIVE LIVE TERMINAL ENGINE
// ==========================================================================
(function initCockpitTerminal() {
  var termInput  = document.getElementById('termInput');
  var termOutput = document.getElementById('termOutput');
  var termRun    = document.getElementById('termRun');
  if (!termInput || !termOutput) return;

  var commands = {
    'help': function() { return [
      { text: '=====================================' },
      { text: 'MUSKAN PORTFOLIO TERMINAL v2.0.26', cls: 'info' },
      { text: '=====================================' },
      { text: '' },
      { text: 'AVAILABLE COMMANDS:', cls: 'success' },
      { text: '  muskan.getSkills()     - Full tech stack' },
      { text: '  muskan.getProjects()   - All projects' },
      { text: '  muskan.getSocials()    - Social links' },
      { text: '  run codehub            - Open CodeHub on GitHub' },
      { text: '  run agri               - Open AI Agri Chatbot repo' },
      { text: '  cat resume.pdf         - Resume details' },
      { text: '  download resume        - Open resume in new tab' },
      { text: '  contact --email        - Open email client' },
      { text: '  whoami                 - About Muskan' },
      { text: '  clear                  - Clear terminal' },
      { text: '  exit                   - Back to top' },
      { text: '' },
      { text: 'TIP: Press UP arrow to recall previous commands.', cls: 'info' },
    ]; },

    'whoami': function() { return [
      { text: '> Muskan Gupta', cls: 'success' },
      { text: '  Role     : Full Stack Developer & AI Builder' },
      { text: '  College  : Galgotias College of Engineering & Technology' },
      { text: '  Program  : B.Tech CS & Data Science | Batch 2024-28' },
      { text: '  Email    : mg8881154@gmail.com' },
      { text: '  Status   : Building things that matter  !' },
    ]; },

    'muskan.getSkills()': function() { return [
      { text: 'Fetching skill matrix...', cls: 'info' },
      { text: '' },
      { text: '[ LANGUAGES ]', cls: 'success' },
      { text: '  Python  |  JavaScript (ES6+)  |  C  |  C++' },
      { text: '' },
      { text: '[ FRONTEND ]', cls: 'success' },
      { text: '  React.js  |  HTML5  |  CSS3  |  Tailwind CSS' },
      { text: '' },
      { text: '[ BACKEND ]', cls: 'success' },
      { text: '  Node.js  |  Express.js  |  Django  |  REST APIs' },
      { text: '' },
      { text: '[ AI / ML ]', cls: 'success' },
      { text: '  Machine Learning  |  Groq LLaMA  |  Judge0 API' },
      { text: '' },
      { text: '[ DATABASES ]', cls: 'success' },
      { text: '  MongoDB  |  MySQL' },
      { text: '' },
      { text: '[ TOOLS ]', cls: 'success' },
      { text: '  Git  |  GitHub  |  Vercel  |  VS Code' },
      { text: '' },
      { text: 'OK: 14 core skills loaded.', cls: 'success' },
    ]; },

    'muskan.getProjects()': function() { return [
      { text: 'Scanning project repository...', cls: 'info' },
      { text: '' },
      { text: '[ 01 ] CodeHub -- AI DSA Platform', cls: 'success' },
      { text: '       Stack: React | Node | Judge0 | Groq AI | MongoDB' },
      { text: 'github.com/mg8881154-glitch/Code-hub', cls: 'link', link: 'https://github.com/mg8881154-glitch/Code-hub' },
      { text: '' },
      { text: '[ 02 ] AI Agri-Advisory Chatbot', cls: 'success' },
      { text: '       Stack: Python | Machine Learning | Django' },
      { text: '       Impact: Agricultural intelligence for rural India' },
      { text: '' },
      { text: 'OK: 2 projects found.', cls: 'success' },
    ]; },

    'muskan.getSocials()': function() { return [
      { text: 'Loading social endpoints...', cls: 'info' },
      { text: '' },
      { text: 'GitHub   -> github.com/mg8881154-glitch', cls: 'link', link: 'https://github.com/mg8881154-glitch' },
      { text: 'LinkedIn -> linkedin.com/in/muskan-gupta-616120365', cls: 'link', link: 'https://www.linkedin.com/in/muskan-gupta-616120365' },
      { text: 'LeetCode -> leetcode.com/u/DTHmIJBrp9/', cls: 'link', link: 'https://leetcode.com/u/DTHmIJBrp9/' },
      { text: 'Zetheta  -> Certificate #94597861', cls: 'link', link: 'https://www.zetheta.com/certificate/94597861/' },
      { text: '' },
      { text: 'OK: All channels online.', cls: 'success' },
    ]; },

    'run codehub': function() {
      setTimeout(function() { window.open('https://github.com/mg8881154-glitch/Code-hub', '_blank'); }, 500);
      return [
        { text: 'Launching CodeHub...', cls: 'info' },
        { text: 'Opening GitHub repository...', cls: 'success' },
        { text: 'OK: Opened in new tab.', cls: 'success' },
      ];
    },

    'run agri': function() {
      setTimeout(function() { window.open('https://github.com/mg8881154-glitch', '_blank'); }, 500);
      return [
        { text: 'Launching AI Agri Chatbot...', cls: 'info' },
        { text: 'Redirecting to GitHub...', cls: 'success' },
        { text: 'OK: Opened in new tab.', cls: 'success' },
      ];
    },

    'cat resume.pdf': function() {
      setTimeout(function() { window.open('resume.html', '_blank'); }, 600);
      return [
      { text: 'Reading resume.pdf...', cls: 'info' },
      { text: '' },
      { text: '  Name     : Muskan Gupta' },
      { text: '  Role     : Full Stack Developer & AI Builder' },
      { text: '  College  : GCET, Gr. Noida (2024-28)' },
      { text: '  Email    : mg8881154@gmail.com' },
      { text: '' },
      { text: '  EXPERIENCE:' },
      { text: '    - Zetheta Internship -- Certificate #94597861' },
      { text: '' },
      { text: '  PROJECTS:' },
      { text: '    - CodeHub AI DSA Platform' },
      { text: '    - AI Agri-Advisory Chatbot' },
      { text: '' },
      { text: 'OK: Opening full resume in new tab...', cls: 'success' },
    ]; },

    'download resume': function() {
      setTimeout(function() {
        var link = document.createElement('a');
        link.href = 'resume.pdf';
        link.download = 'Muskan_Gupta_Resume_2026.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 400);
      return [
        { text: 'Fetching resume...', cls: 'info' },
        { text: 'Downloading Muskan_Gupta_Resume_2026.pdf...', cls: 'success' },
      ];
    },

    'contact --email': function() {
      setTimeout(function() { window.location.href = 'mailto:mg8881154@gmail.com'; }, 500);
      return [
        { text: 'Initialising mail channel...', cls: 'info' },
        { text: 'Composing to: mg8881154@gmail.com', cls: 'success' },
        { text: 'OK: Opening your mail client.', cls: 'success' },
      ];
    },

    'exit': function() {
      setTimeout(function() { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 400);
      return [
        { text: 'Goodbye! Scrolling to top...', cls: 'info' },
        { text: 'Session terminated.', cls: 'error' },
      ];
    },
  };

  var cmdHistory = [];
  var historyIdx = -1;

  function appendLine(cfg) {
    var line = document.createElement('div');
    line.className = 'term-line output' + (cfg.cls ? ' ' + cfg.cls : '');
    if (cfg.cls === 'link' && cfg.link) {
      var a = document.createElement('a');
      a.href = cfg.link;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.textContent = cfg.text;
      line.appendChild(a);
    } else {
      line.textContent = cfg.text !== undefined ? cfg.text : '';
    }
    termOutput.appendChild(line);
  }

  function appendPromptLine(cmd) {
    var line = document.createElement('div');
    line.className = 'term-line prompt';
    line.textContent = 'muskan@portfolio:~$ ' + cmd;
    termOutput.appendChild(line);
  }

  function scrollBottom() {
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function execute(raw) {
    var cmd = raw.trim();
    if (!cmd) return;
    cmdHistory.unshift(cmd);
    historyIdx = -1;
    appendPromptLine(cmd);
    if (cmd === 'clear') {
      termOutput.innerHTML = '';
      scrollBottom();
      return;
    }
    var handler = commands[cmd];
    if (handler) {
      var lines = handler();
      if (lines) lines.forEach(function(l) { appendLine(l); });
    } else {
      appendLine({ text: "bash: '" + cmd + "': command not found. Type 'help' for commands.", cls: 'error' });
    }
    appendLine({ text: '' });
    scrollBottom();
  }

  termInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var val = termInput.value;
      termInput.value = '';
      execute(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx < cmdHistory.length - 1) {
        historyIdx++;
        termInput.value = cmdHistory[historyIdx] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        termInput.value = cmdHistory[historyIdx] || '';
      } else {
        historyIdx = -1;
        termInput.value = '';
      }
    }
  });

  if (termRun) {
    termRun.addEventListener('click', function() {
      var val = termInput.value;
      termInput.value = '';
      execute(val);
      termInput.focus();
    });
  }
})();

// ==========================================================================
// PIT RADIO MODAL -- INTERACTIVE CONTACT MODAL ENGINE
// ==========================================================================
(function initPitRadio() {
  var overlay      = document.getElementById('pitRadioOverlay');
  var backdrop     = document.getElementById('pitRadioBackdrop');
  var closeBtn     = document.getElementById('pitRadioClose');
  var hireMeBtn    = document.getElementById('hireMeBtn');
  var footerBtn    = document.getElementById('footerHireBtn');
  var form         = document.getElementById('pitRadioForm');
  var successState = document.getElementById('pitSuccess');
  var textarea     = document.getElementById('pitMessage');
  var charCount    = document.getElementById('pitCharCount');
  var submitLabel  = document.getElementById('pitSubmitLabel');
  var pitSubmit    = document.getElementById('pitSubmit');

  if (!overlay) return;

  // -- Open / Close helpers --------------------------------------------------
  function openModal() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Reset to form state
    if (form) form.style.display = 'flex';
    if (successState) {
      successState.classList.remove('is-visible');
      successState.setAttribute('aria-hidden', 'true');
    }
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // -- Triggers --------------------------------------------------------------
  if (hireMeBtn) hireMeBtn.addEventListener('click', openModal);
  if (footerBtn) footerBtn.addEventListener('click', openModal);
  if (closeBtn)  closeBtn.addEventListener('click', closeModal);
  if (backdrop)  backdrop.addEventListener('click', closeModal);

  // ESC key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeModal();
    }
  });

  // -- Character counter for textarea ----------------------------------------
  if (textarea && charCount) {
    textarea.addEventListener('input', function() {
      var len = textarea.value.length;
      charCount.textContent = len + ' / 500';
      if (len > 450) {
        charCount.style.color = '#ff6b6b';
      } else {
        charCount.style.color = '';
      }
      if (len > 500) textarea.value = textarea.value.substring(0, 500);
    });
  }

  // -- Form validation & submission ------------------------------------------
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var nameEl    = document.getElementById('pitName');
      var emailEl   = document.getElementById('pitEmail');
      var messageEl = document.getElementById('pitMessage');
      var valid = true;

      // Clear previous errors
      [nameEl, emailEl, messageEl].forEach(function(el) {
        if (el) el.classList.remove('is-error');
      });

      if (!nameEl || !nameEl.value.trim()) {
        if (nameEl) nameEl.classList.add('is-error');
        valid = false;
      }
      if (!emailEl || !emailEl.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
        if (emailEl) emailEl.classList.add('is-error');
        valid = false;
      }
      if (!messageEl || !messageEl.value.trim()) {
        if (messageEl) messageEl.classList.add('is-error');
        valid = false;
      }

      if (!valid) return;

      // Animate submit button
      if (submitLabel) submitLabel.textContent = 'TRANSMITTING...';
      if (pitSubmit) pitSubmit.disabled = true;

      // Build mailto fallback (fires email client so user can review before sending)
      var name    = nameEl ? nameEl.value.trim() : '';
      var email   = emailEl ? emailEl.value.trim() : '';
      var subject = document.getElementById('pitSubject') ? document.getElementById('pitSubject').value.trim() : '';
      var message = messageEl ? messageEl.value.trim() : '';

      var mailtoSubject = encodeURIComponent((subject || 'Portfolio Enquiry') + ' â€” from ' + name);
      var mailtoBody    = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        (subject ? 'Subject: ' + subject + '\n' : '') +
        '\n' + message
      );
      var mailtoHref = 'mailto:mg8881154@gmail.com?subject=' + mailtoSubject + '&body=' + mailtoBody;

      setTimeout(function() {
        // Show success
        if (form) form.style.display = 'none';
        if (successState) {
          successState.classList.add('is-visible');
          successState.setAttribute('aria-hidden', 'false');
        }
        // Open email client
        window.location.href = mailtoHref;
        // Reset button for next time
        if (submitLabel) submitLabel.textContent = 'TRANSMIT MESSAGE';
        if (pitSubmit) pitSubmit.disabled = false;
      }, 900);
    });
  }
})();
