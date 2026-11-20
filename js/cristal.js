/* Detalles de la versión de cristal: brillo que sigue al ratón sobre los paneles y
   selector de segmentos con una pastilla que se desliza en los filtros de proyectos. */
(function () {
  var raiz = document.documentElement;

  /* ---------- Brillo bajo el puntero ---------- */
  var raton = window.matchMedia('(hover: hover) and (pointer: fine)');
  var PANELES = '.formulario, .cookies, .acc-panel, .servicio-carta, .principios > div, .contacto-tarjetas > li, ' +
    '.pasos li, .cifras .datos > div, .destacado-texto, .servicio-bloque-texto, .cabecera, .boton-linea, .filtros, .pie, .perdido-panel';
  if (raton.matches && !raiz.classList.contains('acc-contraste')) {
    [].forEach.call(document.querySelectorAll(PANELES), function (el) {
      el.classList.add('con-brillo');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
        el.classList.add('brilla');
      });
      el.addEventListener('pointerleave', function () { el.classList.remove('brilla'); });
    });
  }

  /* ---------- Filtros como selector de segmentos ---------- */
  var grupo = document.querySelector('.filtros');
  if (grupo) {
    var pastilla = document.createElement('span');
    pastilla.className = 'filtros-pastilla';
    pastilla.setAttribute('aria-hidden', 'true');
    grupo.insertBefore(pastilla, grupo.firstChild);
    grupo.classList.add('segmentos');

    function colocar() {
      var activo = grupo.querySelector('.filtro[aria-pressed="true"]');
      if (!activo) return;
      pastilla.style.width = activo.offsetWidth + 'px';
      pastilla.style.transform = 'translateX(' + activo.offsetLeft + 'px)';
    }
    grupo.addEventListener('click', function (e) {
      var b = e.target.closest('.filtro');
      if (!b) return;
      requestAnimationFrame(colocar);
      b.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
    window.addEventListener('resize', colocar);
    document.addEventListener('kandisha:idioma', function () { requestAnimationFrame(colocar); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(colocar);
    colocar();
    requestAnimationFrame(function () { grupo.classList.add('lista'); });
  }

  /* ---------- Menú de idioma de cristal ----------
     El <select> sigue existiendo (main.js lo usa), pero oculto: el menú lo maneja. */
  var selector = document.getElementById('idioma');
  if (selector) {
    var IDIOMAS = [['es', 'Español', 'ES'], ['fr', 'Français', 'FR'], ['ar', 'العربية', 'عربي']];
    // Banderas dibujadas (Windows no muestra los emojis de banderas): España, Francia y, para el
    // árabe, Marruecos, el país del estudio
    var BANDERAS = {
      es: '<rect width="30" height="20" fill="#aa151b"/><rect y="5" width="30" height="10" fill="#f1bf00"/>',
      fr: '<rect width="10" height="20" fill="#002654"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ed2939"/>',
      ar: '<rect width="30" height="20" fill="#c1272d"/><path d="M15 4.4 18.29 14.53 9.67 8.27h10.66l-8.62 6.26z" fill="none" stroke="#006233" stroke-width="1.1" stroke-linejoin="round"/>'
    };
    function bandera(cual) {
      return '<svg class="bandera" viewBox="0 0 30 20" aria-hidden="true">' + BANDERAS[cual] + '</svg>';
    }
    var CHEVRON = '<svg class="idioma-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>';
    var CHECK = '<svg class="idioma-check" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
    var caja = document.createElement('div');
    caja.className = 'idioma-menu';
    caja.innerHTML =
      '<button type="button" class="idioma-boton" aria-haspopup="true" aria-expanded="false" aria-controls="idioma-lista" aria-label="' +
      selector.getAttribute('aria-label') + '"><span class="idioma-bandera"></span><span class="idioma-actual"></span>' + CHEVRON + '</button>' +
      '<ul class="idioma-lista" id="idioma-lista" role="menu" hidden>' +
      IDIOMAS.map(function (i) {
        return '<li role="none"><button type="button" role="menuitemradio" aria-checked="false" data-valor="' + i[0] +
          '" lang="' + i[0] + '">' + bandera(i[0]) + '<span class="idioma-nombre" dir="auto">' + i[1] + '</span>' + CHECK + '</button></li>';
      }).join('') + '</ul>';
    selector.parentNode.insertBefore(caja, selector.nextSibling);
    selector.classList.add('idioma-oculto');
    selector.tabIndex = -1;
    selector.setAttribute('aria-hidden', 'true');

    var boton = caja.querySelector('.idioma-boton');
    var lista = caja.querySelector('.idioma-lista');
    var opciones = [].slice.call(lista.querySelectorAll('[role="menuitemradio"]'));

    function marcar() {
      var v = selector.value;
      IDIOMAS.forEach(function (i) {
        if (i[0] !== v) return;
        caja.querySelector('.idioma-actual').textContent = i[2];
        caja.querySelector('.idioma-bandera').innerHTML = bandera(i[0]);
      });
      opciones.forEach(function (o) { o.setAttribute('aria-checked', String(o.getAttribute('data-valor') === v)); });
    }
    function abrir(foco) {
      lista.hidden = false;
      boton.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(function () { caja.classList.add('abierto'); });
      var actual = lista.querySelector('[aria-checked="true"]') || opciones[0];
      if (foco !== false) actual.focus();
    }
    function cerrar(devolver) {
      if (lista.hidden) return;
      caja.classList.remove('abierto');
      boton.setAttribute('aria-expanded', 'false');
      lista.hidden = true;
      if (devolver) boton.focus();
    }
    function elegir(o) {
      var v = o.getAttribute('data-valor');
      cerrar(true);
      if (v === selector.value) return;
      selector.value = v;
      selector.dispatchEvent(new Event('change'));
    }

    boton.addEventListener('click', function () { if (lista.hidden) abrir(); else cerrar(); });
    boton.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); abrir(); }
    });
    lista.addEventListener('click', function (e) {
      var o = e.target.closest('[role="menuitemradio"]');
      if (o) elegir(o);
    });
    lista.addEventListener('keydown', function (e) {
      var i = opciones.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); opciones[(i + 1) % opciones.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); opciones[(i - 1 + opciones.length) % opciones.length].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); opciones[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); opciones[opciones.length - 1].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); cerrar(true); }
      else if (e.key === 'Tab') { cerrar(false); }
    });
    document.addEventListener('pointerdown', function (e) { if (!caja.contains(e.target)) cerrar(false); });
    document.addEventListener('kandisha:idioma', marcar);
    marcar();
  }

  /* ---------- Fotos y vídeo más difíciles de guardar ----------
     Sin menú del clic derecho ni arrastre sobre fotos y vídeo (en el resto de la página el menú
     sigue normal). No impide una captura de pantalla: solo quita las formas fáciles de guardar. */
  var MEDIOS = 'img, video, picture, .portada-cine, .obra-abrir';
  document.addEventListener('contextmenu', function (e) {
    if (e.target.closest && e.target.closest(MEDIOS)) e.preventDefault();
  });
  document.addEventListener('dragstart', function (e) {
    if (e.target.closest && e.target.closest(MEDIOS)) e.preventDefault();
  });
  [].forEach.call(document.querySelectorAll('video'), function (v) {
    v.disablePictureInPicture = true;
    v.setAttribute('controlslist', 'nodownload noremoteplayback noplaybackrate');
  });
})();
