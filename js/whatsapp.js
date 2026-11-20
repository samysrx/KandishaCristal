// Botón flotante de WhatsApp: abre el chat con el estudio y un primer mensaje ya escrito
// en el idioma en que se está viendo la web. El número está en el enlace de cada página.
(function () {
  var boton = document.querySelector('.whatsapp');
  if (!boton) return;
  var MENSAJES = {
    es: 'Hola, quisiera información sobre un proyecto.',
    fr: 'Bonjour, je souhaiterais des informations sur un projet.',
    ar: 'مرحبا، أود الحصول على معلومات حول مشروع.'
  };
  var base = boton.getAttribute('href').split('?')[0];
  function actualizar() {
    var idioma = document.documentElement.lang || 'es';
    boton.href = base + '?text=' + encodeURIComponent(MENSAJES[idioma] || MENSAJES.es);
  }
  actualizar();
  // Al cambiar de idioma se cambia también el mensaje
  new MutationObserver(actualizar).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
