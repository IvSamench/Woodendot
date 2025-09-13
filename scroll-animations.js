class ScrollAnimations {
  constructor() {
    this.observedElements = new Set();
    this.init();
  }

  init() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    this.setupAnimations();
  }

  setupAnimations() {
    const rightImages = [
      '.product-block__img',
      '.product-block-5__img'
    ];

    const leftImages = [
      '.product-block-2__img',
      '.product-block-6__img'
    ];

    const specialImages = [
      '.product-block-3__img'
    ];

    const galleryImages = '.gallery__img';

    rightImages.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => this.setupImageAnimation(el, 'right'));
    });

    leftImages.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => this.setupImageAnimation(el, 'left'));
    });

    specialImages.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => this.setupImageAnimation(el, 'right'));
    });

    const galleryElements = document.querySelectorAll(galleryImages);
    galleryElements.forEach((el, index) => {
      const direction = index % 2 === 0 ? 'left' : 'right';
      this.setupImageAnimation(el, direction);
    });
  }

  setupImageAnimation(element, direction) {
    if (this.observedElements.has(element)) return;
    
    element.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.8s ease, opacity 0.8s ease';
    element.style.opacity = '0';
    element.style.filter = 'brightness(3) blur(2px)';
    
    const translateX = direction === 'right' ? '100px' : '-100px';
    element.style.transform = `translateX(${translateX}) scale(0.95)`;
    
    element.dataset.animationDirection = direction;
    element.dataset.animationState = 'pending';
    
    this.observer.observe(element);
    this.observedElements.add(element);
  }

  animateElement(element) {
    if (element.dataset.animationState === 'completed') return;
    
    element.dataset.animationState = 'completed';
    
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateX(0) scale(1)';
      element.style.filter = 'brightness(1) blur(0)';
    }, 100);
    
    this.observer.unobserve(element);
  }

  triggerAnimation(selector) {
    const element = document.querySelector(selector);
    if (element) {
      this.animateElement(element);
    }
  }

  resetAnimations() {
    this.observedElements.forEach(element => {
      element.style.opacity = '0';
      element.style.filter = 'brightness(3) blur(2px)';
      const direction = element.dataset.animationDirection;
      const translateX = direction === 'right' ? '100px' : '-100px';
      element.style.transform = `translateX(${translateX}) scale(0.95)`;
      element.dataset.animationState = 'pending';
      this.observer.observe(element);
    });
  }

  destroy() {
    this.observer.disconnect();
    this.observedElements.clear();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ScrollAnimations();
});
