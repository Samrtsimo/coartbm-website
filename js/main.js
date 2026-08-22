/* Coart Building Materials — main script */
(function () {
  var esc = encodeURI;
  function fa(path) { return path.split('/').pop().replace(/[_-]+/g, ' ').replace(/\.jpe?g$|\.png$|\.mp4$/i, ''); }

  var PRODUCTS = window.PRODUCTS || [];

  // ---- Mobile menu toggle ----
  var toggle = document.querySelector('.menu-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () { links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { links.classList.remove('open'); }); });
  }

  // ---- Full-screen lightbox (single image) ----
  var lb = document.getElementById('lightbox');
  function openLightbox(src, caption) {
    if (!lb) return;
    lb.innerHTML = '<div class="lightbox-overlay"></div><div class="lightbox-body"><img src="' + esc(src) + '" alt=""><p>' + (caption || '') + '</p><button class="lightbox-close" aria-label="Close">×</button></div>';
    document.body.style.overflow = 'hidden';
    lb.style.display = 'flex';
    lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
  }
  function closeLightbox() { if (lb) { lb.style.display = 'none'; document.body.style.overflow = ''; } }

  // ---- Product card: single preview image (one per category) ----
  var grid = document.getElementById('product-grid');
  if (grid && PRODUCTS.length) {
    grid.innerHTML = PRODUCTS.map(function (p) {
      var img = p.best[0] || (p.catalog[0] || '');
      return '<button class="product-card" data-product="' + p.id + '" aria-label="View ' + p.name + '">'
        + '<div class="thumb"><img src="' + esc(img) + '" alt="' + p.name + '"></div>'
        + '<div class="body">'
        + '<div class="cat">' + p.cat + '</div>'
        + '<h3>' + p.name + '</h3>'
        + '<p>' + p.desc + '</p>'
        + '<div class="foot"><span class="models">' + (p.count + ' models') + '</span><span class="arrow">View ›</span></div>'
        + '</div></button>';
    }).join('');

    // Click card -> open product modal
    Array.prototype.forEach.call(grid.querySelectorAll('.product-card'), function (card) {
      card.addEventListener('click', function () {
        var data = PRODUCTS.find(function (x) { return x.id === card.getAttribute('data-product'); });
        if (data) openProductModal(data);
      });
    });
  }

  // ---- Product modal (full gallery + factory + video, maximizable) ----
  function imgGrid(paths, name) {
    if (!paths.length) return '';
    return '<div class="pm-grid">' + paths.map(function (p) {
      return '<figure class="pm-item" data-full="' + esc(p) + '"><img loading="lazy" src="' + esc(p) + '" alt="' + name + '"><figcaption>' + fa(p) + '</figcaption></figure>';
    }).join('') + '</div>';
  }
  function openProductModal(p) {
    var body = '<div class="pm-overlay"></div>'
      + '<div class="pm-window"><button class="pm-close" aria-label="Close">×</button>'
      + '<div class="pm-head"><h3>' + p.name + '</h3><span>' + p.count + ' models</span></div>'
      + '<div class="pm-body">';
    if (p.best.length) body += '<div class="pm-main"><img id="pm-main-img" src="' + esc(p.best[0]) + '" alt="' + p.name + '"></div>';
    body += '<div class="pm-tabs"><button class="active" data-tab="catalog">Products (' + p.count + ')</button>'
      + (p.factory.length ? '<button data-tab="factory">Production (' + p.factory.length + ')</button>' : '')
      + (p.videos.length ? '<button data-tab="video">Videos (' + p.videos.length + ')</button>' : '')
      + '</div>';
    body += '<div class="pm-panel" data-panel="catalog">' + imgGrid(p.catalog, p.name) + '</div>';
    if (p.factory.length) body += '<div class="pm-panel" data-panel="factory" style="display:none">' + imgGrid(p.factory, p.name) + '</div>';
    if (p.videos.length) {
      var vids = p.videos.map(function (v) {
        return '<div class="pm-video"><video controls preload="metadata" poster="" src="' + esc(v) + '"></video><p>' + fa(v) + '</p></div>';
      }).join('');
      body += '<div class="pm-panel" data-panel="video" style="display:none">' + vids + '</div>';
    }
    body += '</div></div>';

    var overlay = document.createElement('div');
    overlay.id = 'product-modal';
    overlay.className = 'product-modal';
    overlay.innerHTML = body;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    var m = overlay, mainImg = overlay.querySelector('#pm-main-img');
    overlay.querySelector('.pm-overlay').addEventListener('click', close);
    overlay.querySelector('.pm-close').addEventListener('click', close);
    function close() { if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay); document.body.style.overflow = ''; }
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    // Tab switching
    overlay.querySelectorAll('.pm-tabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        overlay.querySelectorAll('.pm-tabs button').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        overlay.querySelectorAll('.pm-panel').forEach(function (pn) { pn.style.display = 'none'; });
        overlay.querySelector('[data-panel="' + b.getAttribute('data-tab') + '"]').style.display = '';
        if (b.getAttribute('data-tab') === 'catalog') mainImg.style.display = '';
        else mainImg.style.display = 'none';
      });
    });

    // Click grid image -> maximize
    overlay.querySelectorAll('.pm-item').forEach(function (it) {
      it.addEventListener('click', function () {
        openLightbox(it.getAttribute('data-full'), it.querySelector('figcaption').textContent);
      });
    });

    // ESC to close
    var key = function (e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', key); } };
    document.addEventListener('keydown', key);
  }

  // ---- Production section: group by product, photos or video (horizontal rows) ----
  var prodList = document.getElementById('production-list');
  if (prodList && PRODUCTS.length) {
    var prods = PRODUCTS.filter(function (p) { return p.factory.length || p.videos.length; });
    prodList.innerHTML = prods.map(function (p) {
      var inner = '';
      if (p.factory.length) {
        inner = p.factory.slice(0, 12).map(function (f) {
          return '<figure class="prod-item" data-full="' + esc(f) + '"><img loading="lazy" src="' + esc(f) + '" alt="' + p.name + '"><figcaption>' + fa(f) + '</figcaption></figure>';
        }).join('');
        inner = '<div class="prod-shelf">' + inner + '</div>';
      } else if (p.videos.length) {
        inner = p.videos.slice(0, 6).map(function (v) {
          return '<div class="prod-video"><video controls preload="metadata" src="' + esc(v) + '"></video></div>';
        }).join('');
        inner = '<div class="prod-shelf">' + inner + '</div>';
      }
      return '<div class="production-block"><h3>' + p.name + '</h3>' + inner + '</div>';
    }).join('');
    prodList.querySelectorAll('.prod-item').forEach(function (it) {
      it.addEventListener('click', function () { openLightbox(it.getAttribute('data-full'), it.querySelector('figcaption').textContent); });
    });
  }

  // ---- Hero background carousel (prefer user-selected images) ----
  var heroSection = document.getElementById('top');
  var heroImages = (window.HERO_IMAGES && window.HERO_IMAGES.length) ? window.HERO_IMAGES
    : ['assets/images/hero/hero-main.jpg'];
  if (heroSection && heroImages.length > 1) {
    var hi = 0;
    function heroShow() {
      heroSection.style.backgroundImage = 'linear-gradient(rgba(20,24,28,0.55),rgba(20,24,28,0.45)), url("' + esc(heroImages[hi] ) + '")';
      hi = (hi + 1) % heroImages.length;
    }
    setInterval(heroShow, 3500);
  }

  // ---- About carousel (prefer user-selected About image; else factory photos) ----
  var aboutImg = document.getElementById('about-carousel-img');
  if (aboutImg) {
    var pool;
    if (window.ABOUT_IMAGES && window.ABOUT_IMAGES.length) {
      pool = window.ABOUT_IMAGES;
    } else {
      var faces = PRODUCTS.filter(function (p) { return p.factory.length; });
      pool = [];
      faces.forEach(function (p) { p.factory.slice(0, 3).forEach(function (f) { pool.push(f); }); });
    }
    if (pool.length) {
      var capEl = document.getElementById('about-carousel-cap');
      aboutImg.src = pool[0];
      if (capEl) capEl.textContent = 'Production of ' + fa(pool[0]);
      var ai = 1;
      function aboutShow() {
        aboutImg.src = pool[ai];
        if (capEl) capEl.textContent = 'Production of ' + fa(pool[ai]);
        ai = (ai + 1) % pool.length;
      }
      if (pool.length > 1) setInterval(aboutShow, 3000);
    }
  }

  // ---- Inquiry form (Web3Forms) ----
  var ACCESS_KEY = '53c393a4-c7b9-4f3e-8d91-a87fc7799c11';
  var form = document.getElementById('inquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.btn-submit'), original = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending…';
      var data = new FormData(form);
      data.append('access_key', ACCESS_KEY);
      data.append('subject', 'New inquiry from coartbm.com');
      data.append('from_name', 'COART Website');
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
        .then(function (r) { return r.json(); })
        .then(function (json) {
          var ok = document.getElementById('form-success');
          if (json.success && ok) {
            ok.classList.add('show');
            form.querySelectorAll('input, select, textarea').forEach(function (f) { f.value = ''; });
            setTimeout(function () { ok.classList.remove('show'); }, 8000);
          } else { alert('Something went wrong. Please email us directly: davidchensimo@foxmail.com'); }
        })
        .catch(function () { alert('Network error. Please email us directly: davidchensimo@foxmail.com'); })
        .finally(function () { btn.disabled = false; btn.textContent = original; });
    });
  }
})();
