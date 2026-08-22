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

  // ---- Product card carousel (auto-cycling best images) ----
  function carouselHTML(best, name) {
    var imgs = best.map(function (p) {
      return '<img src="' + esc(p) + '" alt="' + name + '">';
    }).join('');
    return '<div class="pc-carousel">' + imgs + (best.length > 1 ? '<div class="pc-dots"></div>' : '') + '</div>';
  }

  // ---- Render product cards into #product-grid ----
  var grid = document.getElementById('product-grid');
  if (grid && PRODUCTS.length) {
    grid.innerHTML = PRODUCTS.map(function (p) {
      return '<button class="product-card" data-product="' + p.id + '" aria-label="View ' + p.name + '">'
        + '<div class="thumb">' + carouselHTML(p.best, p.name) + '</div>'
        + '<div class="body">'
        + '<div class="cat">' + p.cat + '</div>'
        + '<h3>' + p.name + '</h3>'
        + '<p>' + p.desc + '</p>'
        + '<div class="foot"><span class="models">' + (p.count + p.factory.length ? (p.count + ' models') : '') + '</span><span class="arrow">View ›</span></div>'
        + '</div></button>';
    }).join('');

    // Start carousels
    Array.prototype.forEach.call(grid.querySelectorAll('.product-card'), function (card) {
      var data = PRODUCTS.find(function (x) { return x.id === card.getAttribute('data-product'); });
      if (!data) return;
      var car = card.querySelector('.pc-carousel');
      var imgs = car ? car.querySelectorAll('img') : [];
      var dots = car ? car.querySelector('.pc-dots') : null;
      if (!imgs.length) return;
      var i = 0, timer;
      function show(n) {
        i = n % imgs.length;
        Array.prototype.forEach.call(imgs, function (im, k) { im.classList.toggle('active', k === i); });
        if (dots) Array.prototype.forEach.call(dots.children, function (d, k) { d.classList.toggle('active', k === i); });
      }
      if (dots) dots.innerHTML = imgs.length ? Array.prototype.map.call(imgs, function (_, k) { return '<span' + (k === 0 ? ' class="active"' : '') + '></span>'; }).join('') : '';
      show(0);
      if (imgs.length > 1) timer = setInterval(function () { show(i + 1); }, 2600);
      card.addEventListener('focus', function () { clearInterval(timer); }, { once: true });
    });

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

  // ---- Production section: group by product, photos or video ----
  var prodList = document.getElementById('production-list');
  if (prodList && PRODUCTS.length) {
    // Only show products that have production photos OR videos
    var prods = PRODUCTS.filter(function (p) { return p.factory.length || p.videos.length; });
    prodList.innerHTML = prods.map(function (p) {
      var gridHtml = '';
      if (p.factory.length) {
        gridHtml = imgGrid(p.factory.slice(0, 12), p.name);
      } else if (p.videos.length) {
        gridHtml = p.videos.slice(0, (p.videos.length > 5 ? 5 : p.videos.length)).map(function (v) {
          return '<div class="pm-video"><video controls preload="metadata" src="' + esc(v) + '"></video></div>';
        }).join('');
        gridHtml = '<div class="pg-grid">' + gridHtml + '</div>';
      }
      return '<div class="production-block"><h3>' + p.name + '</h3>'
        + (p.factory.length ? '<div class="pg-grid">' + gridHtml + '</div>' : gridHtml)
        + '</div>';
    }).join('');
    // click to lightbox photo
    prodList.querySelectorAll('.pg-item').forEach(function (it) {
      it.addEventListener('click', function () { openLightbox(it.getAttribute('data-full'), it.querySelector('figcaption').textContent); });
    });
  }

  // ---- About carousel (factory photos) ----
  var aboutImg = document.getElementById('about-carousel-img');
  if (aboutImg && PRODUCTS.length) {
    var faces = PRODUCTS.filter(function (p) { return p.factory.length; });
    var pool = [];
    faces.forEach(function (p) { p.factory.slice(0, 3).forEach(function (f) { pool.push(f); }); });
    if (pool.length) {
      var ai = 0, capEl = document.getElementById('about-carousel-cap');
      function aboutShow() {
        aboutImg.src = pool[ai];
        if (capEl) capEl.textContent = 'Production of ' + fa(pool[ai]);
        ai = (ai + 1) % pool.length;
      }
      setInterval(aboutShow, 3000);
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
