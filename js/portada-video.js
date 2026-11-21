/* Vídeos en bucle (portada de Inicio y Contacto): se reproducen sin sonido sobre la foto, que hace
   de póster. No se descargan si el visitante pide reducir el movimiento, ha detenido las animaciones
   desde el panel de accesibilidad o tiene activado el ahorro de datos. */
(function () {
  var videos = document.querySelectorAll('.portada-video');
  if (!videos.length) return;
  var raiz = document.documentElement;

  var ahorro = navigator.connection && navigator.connection.saveData;
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches || raiz.classList.contains('acc-quieto');
  if (ahorro || quieto) return;

  [].forEach.call(videos, function (video) {
    var boton = video.parentNode.querySelector('.portada-pausa');
    if (!boton) return;
    var pausadoAMano = false;
    video.src = video.getAttribute('data-src');
    video.addEventListener('playing', function () {
      video.classList.add('lista');
      boton.hidden = false;
    });

    function reproducir() {
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* el navegador puede bloquearlo: queda la foto */ });
    }

    boton.addEventListener('click', function () {
      pausadoAMano = !video.paused;
      if (pausadoAMano) video.pause(); else reproducir();
      boton.setAttribute('aria-pressed', String(pausadoAMano));
    });

    // Fuera de la pantalla se detiene para no gastar batería
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting && !pausadoAMano) reproducir();
          else if (!e.isIntersecting) video.pause();
        });
      }, { threshold: 0.1 }).observe(video);
    } else {
      reproducir();
    }
  });
})();
