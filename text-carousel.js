
class TextCarousel {
  
  constructor(selector) {
    
    this.container = document.querySelector(selector);
    if (!this.container) return; 

    
    this.autoplayDelay = 5000; 
    this.currentSlide = 0;
    this.autoplayTimer = null; 

    
    this.init();
  }

 
  init() {
   
    this.slidesContainer = this.container.querySelector('[data-text-carousel-slides]');
   
    this.pointersContainer = this.container.querySelector('[data-text-carousel-pointers]');
    
    
    if (!this.slidesContainer || !this.pointersContainer) return;

    
    this.slides = this.slidesContainer.children;
    this.pointers = this.pointersContainer.children;
    this.totalSlides = this.slides.length;

   
    if (this.totalSlides === 0) return;

    this.setupCarousel();
    this.startAutoplay();
  }

  
  setupCarousel() {
   
    for (let i = 0; i < this.slides.length; i++) {
      const slide = this.slides[i];
      slide.style.position = 'absolute';
      slide.style.top = '0'; 
      slide.style.left = '0'; 
      slide.style.width = '100%'; 
      slide.style.transition = 'opacity 0.3s ease';
      slide.style.opacity = i === 0 ? '1' : '0';
    }

    
    for (let i = 0; i < this.pointers.length; i++) {
      
      this.pointers[i].onclick = () => this.goToSlide(i);
      this.pointers[i].style.cursor = 'pointer'; 
    }

   
    this.container.onmouseenter = () => this.stopAutoplay();
    this.container.onmouseleave = () => this.startAutoplay();

    
    this.updatePointers();
  }


  showSlides() {
   
    for (let i = 0; i < this.slides.length; i++) {
      this.slides[i].style.opacity = i === this.currentSlide ? '1' : '0';
      this.slides[i].classList.toggle('active', i === this.currentSlide);
    }

    this.updatePointers();
  }


  updatePointers() {
    for (let i = 0; i < this.pointers.length; i++) {
      this.pointers[i].classList.toggle('active', i === this.currentSlide);
    }
  }


  goToSlide(index) {
    this.currentSlide = index;
    if (this.currentSlide >= this.totalSlides) this.currentSlide = 0;
    if (this.currentSlide < 0) this.currentSlide = this.totalSlides - 1;
    
    this.showSlides(); 
    this.restartAutoplay(); 
  }

 
  nextSlide() {
    this.goToSlide(this.currentSlide + 1);
  }

  
  startAutoplay() {
    if (this.autoplayTimer) return; 
    this.autoplayTimer = setInterval(() => this.nextSlide(), this.autoplayDelay);
  }


  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer); 
      this.autoplayTimer = null;
    }
  }

 
  restartAutoplay() {
    this.stopAutoplay();
    this.startAutoplay(); 
  }
}


document.addEventListener('DOMContentLoaded', function() {
 
  if (document.querySelector('[data-text-carousel]')) {
    new TextCarousel('[data-text-carousel]');
  }
});
