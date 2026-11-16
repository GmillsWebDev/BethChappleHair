/* Gallery lightbox: click a thumbnail to view it full size.
 * Keyboard: Enter opens, Left/Right move between images, Esc closes. */
(function () {
  'use strict';

  var links = Array.prototype.slice.call(
    document.querySelectorAll('#image-gallery .img-wrapper a')
  );
  if (!links.length) return;

  var overlay = document.createElement('div');
  overlay.id = 'overlay';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image viewer');
  overlay.innerHTML =
    '<button type="button" id="prevButton" aria-label="Previous image"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>' +
    '<img alt="" />' +
    '<button type="button" id="nextButton" aria-label="Next image"><i class="fa fa-chevron-right" aria-hidden="true"></i></button>' +
    '<button type="button" id="exitButton" aria-label="Close image viewer"><i class="fa fa-times" aria-hidden="true"></i></button>';
  document.body.appendChild(overlay);

  var image = overlay.querySelector('img');
  var prevButton = overlay.querySelector('#prevButton');
  var nextButton = overlay.querySelector('#nextButton');
  var exitButton = overlay.querySelector('#exitButton');
  var buttons = [prevButton, nextButton, exitButton];
  var current = 0;
  var lastFocus = null;
  var hideTimer = null;

  function show(index) {
    current = (index + links.length) % links.length;
    var thumb = links[current].querySelector('img');
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
      var i = buttons.indexOf(document.activeElement);
      var next = event.shiftKey ? i - 1 : i + 1;
      buttons[(next + buttons.length) % buttons.length].focus();
      event.preventDefault();
    }
  });
})();
