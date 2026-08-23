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
  // ---- Lightbox that supports an image set with prev/next ----
  var _lbIdx = 0, _lbSet = [];
  function openLightbox(src, caption) {
    // Determine the image set + index. If src has neighbours in a known gallery,
    // build around it, else treat as single image.
    var hasSet = _lbSet.indexOf(src) !== -1;
    _lbIdx = hasSet ? _lbSet.indexOf(src) : 0;
    if (!hasSet) _lbSet = [src];
    renderLb(caption);
  }
  function renderLb(caption) {
    if (!lb) return;
    var src = _lbSet[_lbIdx];
    var nav = (_lbSet.length > 1)
      ? '<button class="lightbox-nav prev" data-nav="-1" aria-label="Previous">‹</button>'
        + '<button class="lightbox-nav next" data-nav="1" aria-label="Next">›</button>'
      : '';
    lb.innerHTML = '<div class="lightbox-overlay"></div><div class="lightbox-body">'
      + '<img src="' + esc(src) + '" alt="">'
      + (caption || _lbIdx >= 0 ? '<p>' + (_lbIdx+1) + ' / ' + _lbSet.length + '</p>' : '<p></p>')
      + nav
      + '<button class="lightbox-close" aria-label="Close">×</button></div>';
    document.body.style.overflow = 'hidden';
    lb.style.display = 'flex';
    lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
    lb.querySelectorAll('.lightbox-nav').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        _lbIdx = (_lbIdx + parseInt(b.getAttribute('data-nav'), 10) + _lbSet.length) % _lbSet.length;
        renderLb(caption);
      });
    });
    // keyboard arrows
    var key = function (e) {
      if (e.key === 'ArrowRight') { _lbIdx = (_lbIdx + 1) % _lbSet.length; renderLb(caption); }
      else if (e.key === 'ArrowLeft') { _lbIdx = (_lbIdx - 1 + _lbSet.length) % _lbSet.length; renderLb(caption); }
      else if (e.key === 'Escape') { closeLightbox(); document.removeEventListener('keydown', key); }
    };
    document.removeEventListener('keydown', key);
    document.addEventListener('keydown', key);
  }
  function closeLightbox() { if (lb) { lb.style.display = 'none'; document.body.style.overflow = ''; } }

  // ---- Production mini-gallery modal (all photos of one product) ----
  function openProductGallery(name, images) {
    if (!images || !images.length) return;
    var lb2 = document.getElementById('lightbox');
    if (!lb2) return;
    var grid = images.map(function (p) {
      return '<figure class="pm-item" data-full="' + esc(p) + '"><img loading="lazy" src="' + esc(p) + '" alt="' + name + '"></figure>';
    }).join('');
    lb2.innerHTML = '<div class="lightbox-overlay"></div><div class="pm-window pg-window">'
      + '<button class="pm-close" aria-label="Close">×</button>'
      + '<div class="pm-head"><h3>' + name + '</h3><span>' + images.length + ' photos</span></div>'
      + '<div class="pm-body"><div class="pm-grid">' + grid + '</div></div></div>';
    document.body.style.overflow = 'hidden';
    lb2.style.display = 'flex';
    lb2.querySelector('.pm-close').addEventListener('click', closeLightbox);
    lb2.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
    lb2.querySelectorAll('.pm-item').forEach(function (it) {
      it.addEventListener('click', function () { _lbSet = images; openLightbox(it.getAttribute('data-full'), ''); });
    });
  }

  // ---- Product card: single preview image (one per category) ----
  var grid = document.getElementById('product-grid');
  if (grid && PRODUCTS.length) {
    grid.innerHTML = PRODUCTS.map(function (p) {
      var img = p.best[0] || (p.catalog[0] || '');
      return '<button class="product-card" id="product-' + p.id + '" data-product="' + p.id + '" aria-label="View ' + p.name + '">'
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

  // ---- Production section: small tile entry per product → expand to more ----
  var prodList = document.getElementById('production-list');
  if (prodList && PRODUCTS.length) {
    var prods = PRODUCTS.filter(function (p) { return p.factory.length || p.videos.length; });
    prodList.innerHTML = prods.map(function (p) {
      if (p.factory.length) {
        // PHOTO product: 3 preview tiles + View all → gallery modal with nav
        var preview = p.factory.slice(0, 3).map(function (f) {
          return '<figure class="prod-item" data-full="' + esc(f) + '"><img loading="lazy" src="' + esc(f) + '" alt="' + p.name + '"></figure>';
        }).join('');
        var more = (p.factory.length > 3)
          ? '<button class="prod-more" data-photos="' + encodeURIComponent(JSON.stringify(p.factory)) + '">View all ' + p.factory.length + ' ›</button>'
          : '';
        return '<div class="production-block"><h3>' + p.name + '</h3><div class="prod-shelf">' + preview + '</div>' + more + '</div>';
      } else {
        // VIDEO product: up to 3 preview videos + expand to show all
        var vids = p.videos;
        var preview = vids.slice(0, 3).map(function (v) {
          return '<div class="prod-video"><video controls preload="metadata" src="' + esc(v) + '"></video></div>';
        }).join('');
        var more = (vids.length > 3)
          ? '<button class="prod-more" data-videos="' + encodeURIComponent(JSON.stringify(vids)) + '">View all ' + vids.length + ' videos ›</button>'
          : '';
        return '<div class="production-block"><h3>' + p.name + '</h3>'
          + '<div class="prod-shelf">' + preview + (more ? '<div style="grid-column:1/-1">' + more + '</div>' : '') + '</div>'
          + '</div>';
      }
    }).join('');

    // photo click → lightbox browsing the whole factory set (prev/next)
    prodList.querySelectorAll('.prod-item').forEach(function (it) {
      var block = it.closest('.production-block');
      var set = block ? PRODUCTS.find(function (x) { return x.name === (block.querySelector('h3') ? block.querySelector('h3').textContent : ''); }) : null;
      var setArr = (set && set.factory) ? set.factory : [it.getAttribute('data-full')];
      it.addEventListener('click', function () { _lbSet = setArr; _lbIdx = setArr.indexOf(it.getAttribute('data-full')); openLightbox(it.getAttribute('data-full'), ''); });
    });

    // photo "View all" → gallery modal (images)
    prodList.querySelectorAll('[data-photos]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var imgs = JSON.parse(decodeURIComponent(btn.getAttribute('data-photos')));
        var name = btn.closest('.production-block').querySelector('h3').textContent;
        _lbSet = imgs;
        openProductGallery(name, imgs);
      });
    });

    // video "View all" → expand all videos inline
    prodList.querySelectorAll('[data-videos]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var vids = JSON.parse(decodeURIComponent(btn.getAttribute('data-videos')));
        var block = btn.closest('.production-block');
        var shelf = block.querySelector('.prod-shelf');
        var base = vids.slice(0, 3); // already shown
        var extra = vids.slice(3).map(function (v) {
          return '<div class="prod-video"><video controls preload="metadata" src="' + esc(v) + '"></video></div>';
        }).join('');
        // add extra videos into the same shelf via a wrapper
        var wrap = document.createElement('div');
        wrap.className = 'prod-shelf prod-more-shelf';
        wrap.innerHTML = extra;
        shelf.appendChild(wrap);
        // remove the button (and any wrapping col div)
        var holder = btn.closest('[data-box]') || btn;
        if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
      });
    });
  }

  // ---- Hero background carousel (prev/next + auto) ----
  var heroSection = document.getElementById('top');
  var heroImages = (window.HERO_IMAGES && window.HERO_IMAGES.length) ? window.HERO_IMAGES
    : ['assets/images/hero/hero-main.jpg'];
  if (heroSection && heroImages.length) {
    var hi = 0;
    var heroTimer;
    function heroSet(n) {
      hi = (n + heroImages.length) % heroImages.length;
      heroSection.style.backgroundImage = 'linear-gradient(rgba(20,24,28,0.55),rgba(20,24,28,0.45)), url("' + esc(heroImages[hi]) + '")';
    }
    function heroRestart() { if (heroTimer) clearInterval(heroTimer); if (heroImages.length > 1) heroTimer = setInterval(function () { heroSet(hi + 1); }, 4500); }
    heroSet(0); heroRestart();
    var hp = document.getElementById('hero-prev'), hn = document.getElementById('hero-next');
    if (hp) hp.addEventListener('click', function (e) { e.preventDefault(); heroSet(hi - 1); heroRestart(); });
    if (hn) hn.addEventListener('click', function (e) { e.preventDefault(); heroSet(hi + 1); heroRestart(); });
  }

  // ---- About carousel (prev/next + auto) ----
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
      var ai = 0, aboutTimer;
      function aboutSet(n) {
        ai = (n + pool.length) % pool.length;
        aboutImg.src = pool[ai];
        if (capEl) capEl.textContent = '';
      }
      function aboutRestart() { if (aboutTimer) clearInterval(aboutTimer); if (pool.length > 1) aboutTimer = setInterval(function () { aboutSet(ai + 1); }, 3500); }
      aboutSet(0); aboutRestart();
      var ap = document.getElementById('about-prev'), an = document.getElementById('about-next');
      if (ap) ap.addEventListener('click', function () { aboutSet(ai - 1); aboutRestart(); });
      if (an) an.addEventListener('click', function () { aboutSet(ai + 1); aboutRestart(); });
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
