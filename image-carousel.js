class ImageCarousel {
  constructor(selector) {
    this.container = document.querySelector(selector);
    if (!this.container) return;

    this.delay = 3000;
    this.timer = null;
    this.currentSlide = 0;

    this.init();
  }

  init() {
    this.slidesContainer = this.container.querySelector('[data-carousel-slides]');
    this.pointersContainer = this.container.querySelector('[data-carousel-pointers]');

    if (!this.slidesContainer || !this.pointersContainer) return;

    this.slides = this.slidesContainer.children;
    this.pointers = this.pointersContainer.children;
    this.totalSlides = this.slides.length;

    if (this.totalSlides === 0) return;

    this.setupCarousel();
    this.startAutoPlay();
  }

  setupCarousel() {
    for (let i = 0; i < this.slides.length; i++) {
      const slide = this.slides[i];
      slide.style.position = 'absolute';
      slide.style.transition = 'all 0.8s ease';
      slide.style.opacity = '0';
    }

    for (let i = 0; i < this.pointers.length; i++) {
      this.pointers[i].onclick = () => this.goToslide(i);
      this.pointers[i].style.cursor = 'pointer';
    }

    this.showSlides();
  }

  showSlides() {
    const isMobile = window.innerWidth <= 768;
    const visibleSlides = isMobile ? 1 : 3;

    for (let i = 0; i < this.slides.length; i++) {
      const slide = this.slides[i];
      let position = -1;

      for (let pos = 0; pos < visibleSlides; pos++) {
        const slideIndex = (this.currentSlide + pos) % this.totalSlides;
        if (i === slideIndex) {
          position = pos;
          break;
        }
      }

      if (position >= 0) {
        slide.style.transform = `translateX(${position * 377}px)`;
        slide.style.opacity = '1';
      } else {
        slide.style.transform = 'translateX(-400px)';
        slide.style.opacity = '0';
      }
    }

    this.pointersContainer.querySelector('.active')?.classList.remove('active');
    this.pointers[this.currentSlide].classList.add('active');
  }

  goToslide(index) {
    this.currentSlide = index;
    if (this.currentSlide >= this.totalSlides) this.currentSlide = 0;
    if (this.currentSlide < 0) this.currentSlide = this.totalSlides - 1;
    this.showSlides();
    this.restartAutoplay();
  }

  startAutoPlay() {
    if (this.timer) return;
    this.timer = setInterval(() => this.nextSlide(), this.delay);
  }

  stopAutoPlay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  restartAutoplay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  nextSlide() {
    this.goToslide(this.currentSlide + 1);
  }

  prevSlide() {
    this.goToslide(this.currentSlide - 1);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('[data-carousel]')) {
    new ImageCarousel('[data-carousel]');
  }
});
