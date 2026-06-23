(function () {
  'use strict';

  const root = document.documentElement;
  const stored = localStorage.getItem('jdp-theme');

  function applyTheme(mode) {
    if (mode === 'light' || mode === 'dark') {
      root.setAttribute('data-theme', mode);
    } else {
      root.removeAttribute('data-theme');
    }
  }

  if (stored !== 'dark') localStorage.removeItem('jdp-theme');
  applyTheme(stored === 'dark' ? 'dark' : null);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      localStorage.setItem('jdp-theme', next);
      applyTheme(next);
    });
  }

  const menuBtn = document.getElementById('nav-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  window.JDP = window.JDP || {};

  window.JDP.getData = async function getData(key) {
    const embedded = {
      systemMap: window.__JDP_SYSTEM_MAP__,
      work: window.__JDP_WORK__
    };
    if (embedded[key]) return embedded[key];
    const paths = {
      systemMap: 'data/system-map.json',
      work: 'data/work.json'
    };
    try {
      const r = await fetch(paths[key]);
      if (r.ok) return await r.json();
    } catch (_) {}
    return null;
  };

  window.JDP.badge = function badge(status) {
    if (!status) return '';
    const map = {
      LIVE: 'badge--live',
      BUILDING: 'badge--building',
      PLANNED: 'badge--planned',
      CONCEPT: 'badge--concept',
      DELIVERED: 'badge--delivered'
    };
    const cls = map[status] || 'badge--planned';
    return `<span class="badge ${cls}">${status.replace('_', ' ')}</span>`;
  };

  window.JDP.renderOrchestration = function renderOrchestration(orch) {
    const copyEl = document.getElementById('orch-copy');
    if (copyEl && orch.copy) copyEl.textContent = orch.copy;

    const diagram = document.getElementById('orch-diagram');
    if (!diagram) return;

    const pipelineHtml = (orch.pipeline || []).map((node, i, arr) => {
      const arrow = i < arr.length - 1
        ? '<span class="orch-arrow" aria-hidden="true"><svg viewBox="0 0 24 12" width="24" height="12"><path d="M0 6h20M16 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></span>'
        : '';
      const badge = node.status ? JDP.badge(node.status) : '';
      return `
        <div class="orch-node orch-node--pipeline">
          <span class="orch-node-label">${node.label}</span>
          ${badge}
        </div>${arrow}`;
    }).join('');

    const aiHtml = (orch.ai_systems || []).map(n => `
      <div class="orch-node orch-node--leaf">
        <span class="orch-node-label">${n.label}</span>
        ${JDP.badge(n.status)}
        ${n.note ? `<span class="orch-node-note">${n.note}</span>` : ''}
      </div>
    `).join('');

    const execHtml = (orch.execution_surfaces || []).map(n => `
      <div class="orch-node orch-node--leaf">
        <span class="orch-node-label">${n.label}</span>
        ${JDP.badge(n.status)}
      </div>
    `).join('');

    const trustHtml = (orch.trust_cards || []).map(c => `
      <article class="trust-card reveal">
        <h3>${c.title}</h3>
        <p>${c.body}</p>
      </article>
    `).join('');

    diagram.innerHTML = `
      <div class="orch-panel">
        <p class="orch-panel-label">Coordination pipeline</p>
        <div class="orch-pipeline">${pipelineHtml}</div>
        <div class="orch-fork" aria-hidden="true">
          <svg class="orch-fork-svg" viewBox="0 0 800 80" preserveAspectRatio="none">
            <path d="M400 0 L400 24 L120 24 L120 80 M400 24 L680 24 L680 80" fill="none" stroke="currentColor" stroke-width="1"/>
          </svg>
        </div>
        <div class="orch-branches">
          <div class="orch-branch">
            <p class="orch-branch-label">AI Systems</p>
            <div class="orch-leaf-grid">${aiHtml}</div>
          </div>
          <div class="orch-branch">
            <p class="orch-branch-label">Execution Surfaces</p>
            <div class="orch-leaf-grid">${execHtml}</div>
          </div>
        </div>
        ${orch.caption ? `<p class="orch-caption">${orch.caption}</p>` : ''}
      </div>
    `;

    const trustGrid = document.getElementById('trust-cards');
    if (trustGrid) trustGrid.innerHTML = trustHtml;

    JDP.observeReveals();
  };

  window.JDP.observeReveals = function observeReveals() {
    const els = document.querySelectorAll('.reveal:not(.visible)');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
  };

  window.JDP.initHorizonGrid = function initHorizonGrid(canvasId, opts = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const density = opts.density || 1;

    function resize() {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    let rafId = null;

    function draw() {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      if (cw < 1 || ch < 1 || document.hidden) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, cw, ch);

      const style = getComputedStyle(document.documentElement);
      const lineColor = style.getPropertyValue('--grid-line').trim() || 'rgba(0,128,198,0.06)';
      const horizonY = ch * (opts.horizon || 0.72);
      const vanishX = cw * 0.5;
      const rows = Math.floor(14 * density);
      const cols = Math.floor(22 * density);

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;

      for (let i = 0; i <= rows; i++) {
        const p = i / rows;
        const y = horizonY + (ch - horizonY) * p * p;
        const spread = 0.15 + p * 0.85;
        ctx.beginPath();
        ctx.moveTo(vanishX - cw * spread, y);
        ctx.lineTo(vanishX + cw * spread, y);
        ctx.stroke();
      }

      for (let j = -cols; j <= cols; j++) {
        const xBase = vanishX + j * (cw / cols) * 0.4;
        ctx.beginPath();
        ctx.moveTo(vanishX, horizonY - 8);
        ctx.lineTo(xBase, ch);
        ctx.stroke();
      }

      rafId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !rafId) draw();
    });
  };

  document.querySelectorAll('.hero .reveal, .page-hero .reveal').forEach(el => {
    el.classList.add('visible');
  });

  window.JDP.observeReveals();
})();
