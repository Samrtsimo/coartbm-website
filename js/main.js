/* Coart Building Materials — main script */
(function () {
  // ---- Mobile menu toggle ----
  var toggle = document.querySelector('.menu-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  // ---- Product gallery (show ALL catalogue images per product) ----
  function escPath(p) { return encodeURI(p); }

  function lightbox(src, caption) {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.innerHTML = '<div class="lightbox-overlay"></div><div class="lightbox-body"><img src="' + escPath(src) + '" alt=""><p>' + (caption || '') + '</p><button class="lightbox-close" aria-label="Close">×</button></div>';
    document.body.style.overflow = 'hidden';
    lb.style.display = 'flex';
    lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
  }
  function closeLightbox() {
    var lb = document.getElementById('lightbox');
    if (lb) lb.style.display = 'none';
    document.body.style.overflow = '';
  }

  function buildGallery(product) {
    var wrap = document.createElement('div');
    wrap.className = 'product-gallery collapse';
    var figures = product.images.map(function (path) {
      var fa = path.split('/').pop().replace(/[_-]+/g, ' ').replace(/\.jpe?g$|\.png$/i, '');
      return '<figure class="pg-item" data-full="' + escPath(path) + '">'
        + '<img loading="lazy" src="' + escPath(path) + '" alt="' + product.name + '">'
        + '<figcaption>' + fa + '</figcaption>'
        + '</figure>';
    }).join('');
    wrap.innerHTML = '<div class="pg-grid">' + figures + '</div>';
    wrap.querySelectorAll('.pg-item').forEach(function (item) {
      item.addEventListener('click', function () {
        lightbox(item.getAttribute('data-full'), item.querySelector('figcaption').textContent);
      });
    });
    return wrap;
  }

  window.addEventListener('DOMContentLoaded', function () {
    if (!window.PRODUCTS) return;
    document.querySelectorAll('.product-card').forEach(function (card) {
      var id = (card.getAttribute('id') || '').replace('product-', '');
      var pd = window.PRODUCTS.find(function (x) { return x.id === id; });
      if (!pd) return;
      // Add "view all" toggle button
      var btn = document.createElement('button');
      btn.className = 'view-all-btn';
      btn.textContent = 'View all ' + pd.count + ' models ▾';
      card.querySelector('.body').appendChild(btn);
      // Append gallery container (rendered on first open for perf)
      var gal = buildGallery(pd);
      gal.style.display = 'none';
      card.querySelector('.body').appendChild(gal);

      var open = false;
      btn.addEventListener('click', function () {
        open = !open;
        gal.style.display = open ? 'block' : 'none';
        btn.textContent = open ? 'Hide models ▴' : ('View all ' + pd.count + ' models ▾');
      });
    });
  });

  // ---- Inquiry form (Web3Forms — free, no server needed) ----
  var ACCESS_KEY = '53c393a4-c7b9-4f3e-8d91-a87fc7799c11';
  var form = document.getElementById('inquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.btn-submit');
      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      var data = new FormData(form);
      data.append('access_key', ACCESS_KEY);
      data.append('subject', 'New inquiry from coartbm.com');
      data.append('from_name', 'COART Website');

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          var ok = document.getElementById('form-success');
          if (json.success && ok) {
            ok.classList.add('show');
            form.querySelectorAll('input, select, textarea').forEach(function (f) {
              f.value = '';
            });
            setTimeout(function () { ok.classList.remove('show'); }, 8000);
          } else {
            alert('Something went wrong. Please email us directly: davidchensimo@foxmail.com');
          }
        })
        .catch(function () {
          alert('Network error. Please email us directly: davidchensimo@foxmail.com');
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = original;
        });
    });
  }
})();
