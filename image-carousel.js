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

    this.slides = Array.from(this.slidesContainer.children);
    this.pointers = Array.from(this.pointersContainer.children);
    this.totalSlides = this.slides.length;

    if (this.totalSlides === 0) return;

    
    if (!this.slidesContainer.style.position) this.slidesContainer.style.position = 'relative';
    this.slidesContainer.style.overflow = 'hidden';

    this.setupCarousel();
    this.startAutoPlay();

    
    window.addEventListener('resize', () => this.showSlides());
    window.addEventListener('load', () => this.showSlides());
  }

  setupCarousel() {
    
    const transformTiming = 'transform 800ms cubic-bezier(.22,.8,.38,1)';
    const opacityTiming = 'opacity 450ms ease';

    for (let i = 0; i < this.slides.length; i++) {
      const slide = this.slides[i];
      slide.style.position = 'absolute';
      slide.style.left = '0';
      slide.style.top = '0';
      slide.style.transition = `${transformTiming}, ${opacityTiming}`;
      slide.style.opacity = '0';
      slide.style.willChange = 'transform, opacity';
      slide.style.backfaceVisibility = 'hidden';
      slide.style.zIndex = '1';
      
      slide.style.transform = 'translate3d(-1000px,0,0)';
    }

    for (let i = 0; i < this.pointers.length; i++) {
      this.pointers[i].onclick = () => this.goToslide(i);
      this.pointers[i].style.cursor = 'pointer';
    }

    this.showSlides();
  }

  showSlides() {
    if (!this.slides.length) return;

    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    const visibleSlides = isMobile ? 1 : (isTablet ? 2 : 3);

    
    const firstSlideRect = this.slides[0].getBoundingClientRect();
    const slideOffset = firstSlideRect.width || this.slides[0].offsetWidth || 300;

    const totalVisibleWidth = visibleSlides * slideOffset;
    const containerActualWidth = this.slidesContainer.getBoundingClientRect().width || this.slidesContainer.offsetWidth;
    const centerOffset = (containerActualWidth - totalVisibleWidth) / 2;

    
    const transforms = new Array(this.slides.length);

    for (let i = 0; i < this.slides.length; i++) {
      let position = -1;
      for (let pos = 0; pos < visibleSlides; pos++) {
        const slideIndex = (this.currentSlide + pos) % this.totalSlides;
        if (i === slideIndex) {
          position = pos;
          break;
        }
      }

      if (position >= 0) {
        const x = centerOffset + position * slideOffset;
        transforms[i] = { x, visible: true, z: 2 };
      } else {
        
        const x = centerOffset - slideOffset - 50;
        transforms[i] = { x, visible: false, z: 1 };
      }
    }

    
    requestAnimationFrame(() => {
      for (let i = 0; i < this.slides.length; i++) {
        const slide = this.slides[i];
        const t = transforms[i];
        slide.style.transform = `translate3d(${Math.round(t.x)}px, 0, 0)`;
        slide.style.opacity = t.visible ? '1' : '0';
        slide.style.zIndex = String(t.z);
        
        slide.style.pointerEvents = t.visible ? 'auto' : 'none';
      }

      
      this.pointersContainer.querySelector('.active')?.classList.remove('active');
      this.pointers[this.currentSlide]?.classList.add('active');
    });
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
