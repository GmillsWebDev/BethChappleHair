/* Gallery page: length filter + lightbox.
 * Filter: buttons with data-filter-length hide non-matching .masonry__item elements
 *   (matched against each item's data-length). gallery.html?length=short opens pre-filtered.
 *   Items also carry data-colour and data-texture for future filters.
 * Lightbox: click a photo to view it full size; it steps through the photos currently shown.
 *   Keyboard: Enter opens, Left/Right move between images, Esc closes. */
'use strict';

(() => {
  // Viewer state
  let shown = []; // links visible when the viewer was opened
  let current = 0;
  let lastFocus = null;
  let hideTimer = null;

  const items = Array.prototype.slice.call(document.querySelectorAll('#image-gallery .masonry__item'));
  if (!items.length) return;

  /* ---------- Filter ---------- */

  const filterBar = document.querySelector('.galleryFilters');
  const filterButtons = filterBar
    ? Array.prototype.slice.call(filterBar.querySelectorAll('[data-filter-length]'))
    : [];
  const count = document.querySelector('.galleryCount');
  const labels = { long: 'long', medium: 'medium-length', short: 'short', 'up-do': 'up-do' };

  function applyFilter(value) {
    let visible = 0;
    items.forEach((item) => {
      const match = value === 'all' || item.getAttribute('data-length') === value;
      item.hidden = !match;
      if (match) visible++;
    });
    filterButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-filter-length') === value));
    });
    if (count) {
      count.textContent =
        value === 'all'
          ? `Showing all ${items.length} photos`
          : `Showing ${visible} ${labels[value]} looks`;
    }
  }

  function setFilter(value) {
    applyFilter(value);
    const url = new URL(location.href);
    if (value === 'all') url.searchParams.delete('length');
    else url.searchParams.set('length', value);
    history.replaceState(null, '', url);
  }

  if (filterBar) {
    filterBar.hidden = false; // only shown when this script runs
    if (count) count.hidden = false;
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setFilter(button.getAttribute('data-filter-length'));
      });
    });
    const initial = new URL(location.href).searchParams.get('length');
    applyFilter(initial && Object.prototype.hasOwnProperty.call(labels, initial) ? initial : 'all');
  }

  /* ---------- Lightbox ---------- */

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

  function visibleLinks() {
    return items
      .filter((item) => {
        return !item.hidden;
      })
      .map((item) => {
        return item.querySelector('.galleryItem');
      });
  }

  function show(index) {
    current = (index + shown.length) % shown.length;
    const link = shown[current];
    const thumb = link.querySelector('img');
    image.src = link.getAttribute('href');
    image.alt = thumb ? thumb.alt : '';
  }

  function open(link) {
    clearTimeout(hideTimer);
    lastFocus = document.activeElement;
    shown = visibleLinks();
    show(shown.indexOf(link));
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
    });
    exitButton.focus();
  }

  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    hideTimer = setTimeout(() => {
      overlay.hidden = true;
    }, 400);
    if (lastFocus) lastFocus.focus();
  }

  items.forEach((item) => {
    const link = item.querySelector('.galleryItem');
    link.addEventListener('click', (event) => {
      event.preventDefault();
      open(link);
    });
  });

  prevButton.addEventListener('click', (event) => {
    event.stopPropagation();
    show(current - 1);
  });
  nextButton.addEventListener('click', (event) => {
    event.stopPropagation();
    show(current + 1);
  });
  exitButton.addEventListener('click', (event) => {
    event.stopPropagation();
    close();
  });
  overlay.addEventListener('click', close);

  document.addEventListener('keydown', (event) => {
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
