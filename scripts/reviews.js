/* Reviews carousel (home page): previous/next buttons for the scroll-snap row.
 * The row scrolls by swipe/trackpad on its own; this only adds the arrow buttons
 * (tablet and up) and hides each one when there's nothing further in that direction.
 * No auto-rotation by design. */
(function () {
  'use strict';

  const track = document.getElementById('reviewsTrack');
  if (!track) return;
  const prev = document.querySelector('.carouselBtn--prev');
  const next = document.querySelector('.carouselBtn--next');
  if (!prev || !next) return;

  const wide = window.matchMedia('(min-width: 768px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function update() {
    const max = track.scrollWidth - track.clientWidth;
    const showButtons = wide.matches && max > 1;
    prev.hidden = !showButtons;
    next.hidden = !showButtons;
    // aria-disabled (not disabled) so a focused button keeps focus at the ends
    prev.setAttribute('aria-disabled', String(track.scrollLeft <= 1));
    next.setAttribute('aria-disabled', String(track.scrollLeft >= max - 1));
  }

  function move(direction) {
    const button = direction < 0 ? prev : next;
    if (button.getAttribute('aria-disabled') === 'true') return;
    // one "page": the visible width, so the next set of cards snaps into place
    track.scrollBy({
      left: direction * track.clientWidth,
      behavior: reduceMotion.matches ? 'auto' : 'smooth'
    });
  }

  prev.addEventListener('click', function () {
    move(-1);
  });
  next.addEventListener('click', function () {
    move(1);
  });

  let ticking = false;
  track.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      update();
      ticking = false;
    });
  });
  window.addEventListener('resize', update);
  update();
})();
