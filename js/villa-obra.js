/* Proyectos · la villa del vídeo: un visor con cada parte de la casa en «Diseño 3D» y «En obra».
   Los botones de arriba cambian de fase, las miniaturas de abajo cambian de parte. En el móvil
   también se cambia de fase deslizando la foto con el dedo. */
(function () {
  var visor = document.querySelector('.vo-visor');
  if (!visor) return;
  var fases = [].slice.call(visor.querySelectorAll('.vo-fase'));
  var temas = [].slice.call(visor.querySelectorAll('.vo-tema'));
  var escenas = [].slice.call(visor.querySelectorAll('.vo-escena'));

  function ponerFase(fase) {
    visor.setAttribute('data-fase', fase);
    fases.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-fase') === fase)); });
  }

  function ponerTema(par) {
    escenas.forEach(function (e) { e.hidden = e.getAttribute('data-par') !== par; });
    temas.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-par') === par)); });
  }

  fases.forEach(function (b) {
    b.addEventListener('click', function () { ponerFase(b.getAttribute('data-fase')); });
  });
  temas.forEach(function (b) {
    b.addEventListener('click', function () { ponerTema(b.getAttribute('data-par')); });
  });

  // Deslizar la foto: hacia un lado muestra la obra, hacia el otro el 3D
  var escenario = visor.querySelector('.vo-escenas');
  var x0 = null, y0 = null;
  escenario.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { x0 = null; return; }
    x0 = e.touches[0].clientX;
    y0 = e.touches[0].clientY;
  }, { passive: true });
  escenario.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    var dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy)) return;
    var haciaObra = document.documentElement.dir === 'rtl' ? dx > 0 : dx < 0;
    ponerFase(haciaObra ? 'obra' : '3d');
  }, { passive: true });
})();
