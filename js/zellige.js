/* Azulejos de zellige que aparecen bajo el ratón, detrás de la celosía del fondo.
   Solo con ratón y sin «Alto contraste». El cuadrado se mueve con transform y su fondo se
   desplaza en sentido contrario para que los azulejos coincidan siempre con la celosía, que está
   fija y centrada en la pantalla (css/fondo.css). */
(function () {
  var raiz = document.documentElement;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var capa = document.createElement('div');
  capa.className = 'zellige-luz';
  capa.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(capa, document.body.firstChild);

  var movil = window.matchMedia('(max-width: 38rem)');
  var MEDIO = 230; // mitad del cuadrado (460 px)
  var x = 0, y = 0, pendiente = false;

  function pintar() {
    pendiente = false;
    var tam = movil.matches ? 104 : 132;
    // la celosía se repite centrada en horizontal y desde arriba
    var origenX = (document.documentElement.clientWidth / 2 - tam / 2) % tam;
    var izq = x - MEDIO, arr = y - MEDIO;
    capa.style.transform = 'translate3d(' + izq + 'px,' + arr + 'px,0)';
    capa.style.backgroundPosition = (origenX - izq) + 'px ' + (-arr) + 'px';
  }

  document.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse' || raiz.classList.contains('acc-contraste')) return;
    x = e.clientX; y = e.clientY;
    capa.classList.add('visible');
    if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); }
  }, { passive: true });
  document.addEventListener('pointerleave', function () { capa.classList.remove('visible'); });
  document.documentElement.addEventListener('mouseleave', function () { capa.classList.remove('visible'); });
  window.addEventListener('blur', function () { capa.classList.remove('visible'); });
})();
