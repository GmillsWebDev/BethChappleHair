/* Gallery lightbox: click a thumbnail to view it full size.
 * Keyboard: Enter opens, Left/Right move between images, Esc closes. */
(function () {
  'use strict';

  // Viewer state
  let current = 0;
  let lastFocus = null;
  let hideTimer = null;

  const links = Array.prototype.slice.call(
    document.querySelectorAll('#image-gallery .img-wrapper a')
  );
  if (!links.length) return;

  const overlay = document.createElement('div');
  overlay.id = 'overlay';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image viewer');
  overlay.innerHTML =
    '<button type="button" id="prevButton" aria-label="Previous image"><svg class="icon" aria-hidden="true" focusable="false"><use href="img/icons/sprite.svg?v=1#i-prev"></use></svg></button>' +
    '<img alt="" />' +
    '<button type="button" id="nextButton" aria-label="Next image"><svg class="icon" aria-hidden="true" focusable="false"><use href="img/icons/sprite.svg?v=1#i-next"></use></svg></button>' +
    '<button type="button" id="exitButton" aria-label="Close image viewer"><svg class="icon" aria-hidden="true" focusable="false"><use href="img/icons/sprite.svg?v=1#i-close"></use></svg></button>';
  document.body.appendChild(overlay);

  const image = overlay.querySelector('img');
  const prevButton = overlay.querySelector('#prevButton');
  const nextButton = overlay.querySelector('#nextButton');
  const exitButton = overlay.querySelector('#exitButton');
  const buttons = [prevButton, nextButton, exitButton];

  function show(index) {
    current = (index + links.length) % links.length;
    const thumb = links[current].querySelector('img');
    image.src = links[current].getAttribute('href');
    image.alt = thumb ? thumb.alt : '';
  }

  function open(index) {
    clearTimeout(hideTimer);
    lastFocus = document.activeElement;
    show(index);
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      overlay.classList.add('is-open');
    });
    exitButton.focus();
  }

  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    hideTimer = setTimeout(function () {
      overlay.hidden = true;
    }, 400);
    if (lastFocus) lastFocus.focus();
  }

  links.forEach(function (link, index) {
    link.closest('.img-wrapper').addEventListener('click', function (event) {
      event.preventDefault();
      open(index);
    });
  });

  prevButton.addEventListener('click', function (event) {
    event.stopPropagation();
    show(current - 1);
  });
  nextButton.addEventListener('click', function (event) {
    event.stopPropagation();
    show(current + 1);
  });
  exitButton.addEventListener('click', function (event) {
    event.stopPropagation();
    close();
  });
  overlay.addEventListener('click', close);

  document.addEventListener('keydown', function (event) {
    if (!overlay.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    else if (event.key === 'ArrowLeft') show(current - 1);
    else if (event.key === 'ArrowRight') show(current + 1);
    else if (event.key === 'Tab') {
      // keep focus inside the viewer
      const i = buttons.indexOf(document.activeElement);
      const next = event.shiftKey ? i - 1 : i + 1;
      buttons[(next + buttons.length) % buttons.length].focus();
      event.preventDefault();
    }
  });
})();
