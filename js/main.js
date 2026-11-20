(function () {
  var CORREO = 'kandisha.pro.art@gmail.com';
  var raiz = document.documentElement;

  /* ---------- Cabecera y menú móvil ---------- */
  var cabecera = document.getElementById('cabecera');
  var menuBoton = document.getElementById('menu-boton');
  var nav = document.getElementById('nav');
  var pantallaMovil = window.matchMedia('(max-width: 60rem)');

  function menu(abrir) {
    cabecera.classList.toggle('abierta', abrir);
    menuBoton.setAttribute('aria-expanded', String(abrir));
  }
  menuBoton.addEventListener('click', function () { menu(!cabecera.classList.contains('abierta')); });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) menu(false);
  });
  document.addEventListener('click', function (e) {
    if (!cabecera.contains(e.target)) menu(false);
  });
  document.addEventListener('focusin', function (e) {
    if (!cabecera.contains(e.target)) menu(false);
  });
  pantallaMovil.addEventListener('change', function () { menu(false); });
  window.addEventListener('pageshow', function () { menu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cabecera.classList.contains('abierta')) { menu(false); menuBoton.focus(); }
  });

  /* ---------- Idiomas ----------
     El español está escrito en el HTML; francés y árabe en js/textos-fr.js y js/textos-ar.js.
     El árabe cambia además la página a lectura de derecha a izquierda. */
  var nodos = [].slice.call(document.querySelectorAll('[data-i18n]'));
  var nodosAria = [].slice.call(document.querySelectorAll('[data-i18n-aria]'));
  var ES = {};
  nodos.forEach(function (n) { ES[n.getAttribute('data-i18n')] = n.textContent; });
  nodosAria.forEach(function (n) { ES[n.getAttribute('data-i18n-aria')] = n.getAttribute('aria-label'); });
  var DIC = { es: ES, fr: window.KANDISHA_FR || {}, ar: window.KANDISHA_AR || {} };

  var selector = document.getElementById('idioma');
  var metaDesc = document.querySelector('meta[name="description"]');
  var TITULO_ES = document.title, DESC_ES = metaDesc ? metaDesc.getAttribute('content') : '';
  var idioma = 'es';

  function texto(clave) { return DIC[idioma][clave] || ES[clave] || ''; }

  function ponerIdioma(cual, guardar) {
    idioma = DIC[cual] ? cual : 'es';
    nodos.forEach(function (n) { n.textContent = texto(n.getAttribute('data-i18n')); });
    nodosAria.forEach(function (n) { n.setAttribute('aria-label', texto(n.getAttribute('data-i18n-aria'))); });
    // Título de la pestaña y descripción en el idioma elegido
    var pagina = document.body.getAttribute('data-pagina');
    if (pagina) {
      document.title = DIC[idioma]['meta.t.' + pagina] || TITULO_ES;
      if (metaDesc) metaDesc.setAttribute('content', DIC[idioma]['meta.d.' + pagina] || DESC_ES);
    }
    raiz.lang = idioma;
    raiz.dir = idioma === 'ar' ? 'rtl' : 'ltr';
    selector.value = idioma;
    document.dispatchEvent(new CustomEvent('kandisha:idioma'));
    // Solo se recuerda cuando lo elige el visitante; el idioma automático se recalcula en cada visita
    if (guardar) { try { localStorage.setItem('kandisha-idioma', idioma); } catch (e) {} }
  }

  selector.addEventListener('change', function () { ponerIdioma(selector.value, true); });

  var guardado = null;
  try { guardado = localStorage.getItem('kandisha-idioma'); } catch (e) {}
  var inicial = guardado && DIC[guardado] ? guardado : idiomaSegunPais();
  if (inicial !== 'es') ponerIdioma(inicial, false);

  /* Idioma inicial según el país del visitante, deducido de la zona horaria de su dispositivo
     (no se envía nada a ningún servicio ni se usa la IP). Si el visitante elige otro idioma con
     el selector, esa elección manda en las visitas siguientes.
       · España y Ceuta/Melilla → español
       · Marruecos, Argelia y Túnez → francés, salvo que el navegador esté en árabe o en español
       · Países árabes de Oriente Medio y Egipto → árabe
       · Francia, Bélgica, Suiza, Canadá francófono, África francófona → francés
       · Resto del mundo → el idioma del navegador si es uno de los tres; si no, español */
  function idiomaSegunPais() {
    var nav = (navigator.language || '').slice(0, 2).toLowerCase();
    var zona = '';
    try { zona = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    var MAGREB = ['Africa/Casablanca', 'Africa/El_Aaiun', 'Africa/Algiers', 'Africa/Tunis'];
    var ESPANA = ['Europe/Madrid', 'Atlantic/Canary', 'Africa/Ceuta'];
    var ARABE = ['Africa/Cairo', 'Africa/Tripoli', 'Africa/Khartoum', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Qatar',
      'Asia/Kuwait', 'Asia/Bahrain', 'Asia/Muscat', 'Asia/Amman', 'Asia/Beirut', 'Asia/Damascus', 'Asia/Baghdad',
      'Asia/Aden', 'Asia/Gaza', 'Asia/Hebron', 'Africa/Nouakchott'];
    var FRANCES = ['Europe/Paris', 'Europe/Brussels', 'Europe/Luxembourg', 'Europe/Monaco', 'Europe/Zurich',
      'America/Montreal', 'America/Toronto', 'Africa/Dakar', 'Africa/Abidjan', 'Africa/Bamako', 'Africa/Niamey',
      'Africa/Ouagadougou', 'Africa/Douala', 'Africa/Libreville', 'Africa/Kinshasa', 'Africa/Brazzaville',
      'Indian/Reunion', 'America/Martinique', 'America/Guadeloupe'];
    if (ESPANA.indexOf(zona) >= 0) return 'es';
    if (MAGREB.indexOf(zona) >= 0) return nav === 'ar' || nav === 'es' ? nav : 'fr';
    if (ARABE.indexOf(zona) >= 0) return 'ar';
    if (FRANCES.indexOf(zona) >= 0) return 'fr';
    return DIC[nav] ? nav : 'es';
  }

  /* ---------- Filtro de proyectos ---------- */
  var filtros = [].slice.call(document.querySelectorAll('.filtro'));
  var obras = [].slice.call(document.querySelectorAll('.obras-muro .obra, .obras-pequenas .obra'));
  filtros.forEach(function (f) {
    f.addEventListener('click', function () {
      var tipo = f.getAttribute('data-filtro');
      filtros.forEach(function (o) { o.setAttribute('aria-pressed', String(o === f)); });
      obras.forEach(function (o) {
        o.hidden = tipo !== 'todo' && o.getAttribute('data-tipo') !== tipo;
      });
      var menores = document.querySelector('.obras-pequenas');
      var titulo = document.querySelector('.titulo-menor');
      if (menores && titulo) titulo.hidden = !menores.querySelector('.obra:not([hidden])');
      document.dispatchEvent(new CustomEvent('kandisha:filtro'));
    });
  });

  /* ---------- Visor de fotos a pantalla completa ---------- */
  var visor = document.getElementById('visor');
  if (visor && visor.showModal) {
    var vImg = document.createElement('img');
    document.getElementById('visor-foto').appendChild(vImg);
    var vTexto = document.getElementById('visor-texto');
    var vCuenta = document.getElementById('visor-cuenta');
    var lista = [], actual = 0, origen = null;

    function mostrar(i) {
      actual = (i + lista.length) % lista.length;
      var boton = lista[actual];
      var img = boton.querySelector('img');
      var titulo = boton.parentNode.querySelector('figcaption span');
      vImg.src = img.getAttribute('src');
      vImg.alt = titulo ? titulo.textContent : img.alt;
      vTexto.textContent = titulo ? titulo.textContent : '';
      vCuenta.textContent = (actual + 1) + ' / ' + lista.length;
    }

    function abrir(boton) {
      lista = [].slice.call(document.querySelectorAll('.obra:not([hidden]) .obra-abrir'));
      origen = boton;
      mostrar(lista.indexOf(boton));
      visor.showModal();
      raiz.classList.add('visor-abierto');
    }

    document.addEventListener('click', function (e) {
      var boton = e.target.closest && e.target.closest('.obra-abrir');
      if (boton) abrir(boton);
    });
    document.getElementById('visor-cerrar').addEventListener('click', function () { visor.close(); });
    document.getElementById('visor-ant').addEventListener('click', function () { mostrar(actual - 1); });
    document.getElementById('visor-sig').addEventListener('click', function () { mostrar(actual + 1); });
    visor.addEventListener('click', function (e) {
      if (e.target === visor || e.target.classList.contains('visor-foto')) visor.close();
    });
    visor.addEventListener('close', function () {
      raiz.classList.remove('visor-abierto');
      if (origen) origen.focus({ preventScroll: true });
    });
    visor.addEventListener('keydown', function (e) {
      var avance = raiz.dir === 'rtl' ? -1 : 1;
      if (e.key === 'ArrowRight') mostrar(actual + avance);
      if (e.key === 'ArrowLeft') mostrar(actual - avance);
    });

    // Deslizar con el dedo
    var x0 = null, y0 = null;
    var foto = document.getElementById('visor-foto');
    foto.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { x0 = null; return; }
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    }, { passive: true });
    foto.addEventListener('touchcancel', function () { x0 = null; }, { passive: true });
    foto.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy)) return;
      var avance = raiz.dir === 'rtl' ? -1 : 1;
      mostrar(actual + (dx < 0 ? avance : -avance));
    });
  }

  /* ---------- Formulario: prepara un correo en el programa del visitante ---------- */
  var form = document.getElementById('formulario');
  if (form) {
    var error = document.getElementById('form-error');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = form.nombre, mensaje = form.mensaje;
      var faltan = [nombre, mensaje].filter(function (c) { return !c.value.trim(); });
      [nombre, mensaje].forEach(function (c) {
        if (c.value.trim()) c.removeAttribute('aria-invalid');
        else c.setAttribute('aria-invalid', 'true');
      });
      error.hidden = faltan.length === 0;
      if (faltan.length) { faltan[0].focus(); return; }

      var marcado = form.querySelector('input[name="tipo"]:checked');
      var tipo = marcado ? marcado.parentNode.querySelector('[data-i18n]').textContent : '';
      var asunto = (DIC[idioma]['form.subject'] || 'Proyecto') + ': ' + tipo;
      var cuerpo = mensaje.value.trim() + '\n\n' + nombre.value.trim() +
        (form.telefono.value.trim() ? '\n' + form.telefono.value.trim() : '');
      window.location.href = 'mailto:' + CORREO +
        '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);
    });
  }
})();
