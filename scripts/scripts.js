$('.carousel-control-next').on('click', function () {
  // $('#tilesCarousel').on('slid.bs.carousel', function(){
  var $tileDate = $('.col-md-3:first-child');
  var $tileFlowerPot = $('.col-md-3:nth-of-type(1)');
  var $tileJoined = $('.col-md-3:first-child');
  // var element = document.querySelector('.active:nth-of-type(1)');
  if ($('.active').is(':visible')) {
    // $tiles.find('.bla').addClass('animate__backInUp');
    $tileDate.find('.closing-date').addClass('animate__zoomIn');
    $tileFlowerPot.find('.leaves').addClass('animate__fadeInUp');
    $tileFlowerPot.find('.flower').addClass('animate__fadeIn');
    $tileFlowerPot.find('.flower-text').addClass('animate__fadeIn');
    $tileJoined.find('.joined').addClass('animate__animated');
    // element.classList.add('animate__animated', 'animate__backInUp');
  }
});

// Show/Hide carousel arrows if on last/first slide
$('#tilesCarousel').on('slid.bs.carousel', checkitem);

function checkitem() {
  var $this = $('#tilesCarousel');
  if ($('.carousel-inner .carousel-item:first').hasClass('active')) {
    $this.children('.carousel-control-prev').hide();
  } else if ($('.carousel-inner .carousel-item:last').hasClass('active')) {
    $this.children('.carousel-control-next').hide();
  } else {
    $this.children('.carousel-control').show().css('display', 'flex');
  }
}

// Custom bootstrap carousel to show 4 tiles per slide
let items = document.querySelectorAll('.carousel .carousel-item');

items.forEach((el) => {
  const minPerSlide = 4;
  let next = el.nextElementSibling;
  for (var i = 1; i < minPerSlide; i++) {
    if (!next) {
      // wrap carousel by using first child
      next = items[0];
    }
    let cloneChild = next.cloneNode(true);
    el.appendChild(cloneChild.children[0]);
    next = next.nextElementSibling;
  }
});

// Form Alert Message

// let formName = document.getElementById('userName');
function alerter() {
  let formName = document.getElementById('userName').value;
  console.log('Name ' + formName);
  if (formName != '') {
    let formAlert = document.getElementById('FormAlert');
    formAlert.classList.remove('hide');
  }
}
