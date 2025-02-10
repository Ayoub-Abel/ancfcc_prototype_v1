

(function () {
  "use strict";

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('fa-bars');
    mobileNavToggleBtn.classList.toggle('fa-xmark');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {

      if (this.children[1].classList.contains('dropdown-active')) {
        this.children[1].classList.remove('dropdown-active');
        this.classList.remove('active');

      } else {
        document.querySelectorAll('.navmenu .dropdown').forEach(navmenu => {
          navmenu.children[1].classList.remove('dropdown-active');
          navmenu.classList.remove('active');
        })
        this.classList.toggle('active');
        this.children[1].classList.toggle('dropdown-active');
      }
    })
  })


  /**
   * 
   * quick services bloc hide
   * 
   * 
  **/
  document.querySelector('#quick-services').addEventListener('click', function (e) {
    this.style.display = "none";
  })

  document.querySelector('#quick-services-btn').addEventListener('click', function (e) {
    document.querySelector('#quick-services').style.display = "block";

  })



  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);



  if (document.querySelector('body').classList.contains('home-page')) {

    /**
 * Apply .scrolled class to the body as the page is scrolled down
 */
    function toggleScrolled() {
      const selectBody = document.querySelector('body');
      const selectHeader = document.querySelector('#header');
      if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
      window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');

    }

    document.addEventListener('scroll', toggleScrolled);
    window.addEventListener('load', toggleScrolled);

    const text = "Agence Nationale de la Conservation Foncière, du Cadastre et de la Cartographie";
    const words = text.split(" ");
    const typingElement = document.getElementById("ancfcc-typing");

    let wordIndex = 0;
    let letterIndex = 0;

    function typeNextLetter() {
      if (wordIndex < words.length) {
        if (letterIndex < words[wordIndex].length) {
          const letter = words[wordIndex][letterIndex];
          const span = document.createElement(letter === letter.toUpperCase() && letter.match(/[A-ZÀ-Ÿ]/) ? "b" : "span");
          span.textContent = letter;
          typingElement.appendChild(span);
          letterIndex++;
          setTimeout(typeNextLetter, 20); // Typing speed (20ms per letter)
        } else {
          typingElement.innerHTML += " "; // Add a space after each word
          wordIndex++;
          letterIndex = 0;
          setTimeout(typeNextLetter, 300); // Pause 300ms after each word
        }
      } else {
        setTimeout(() => {
          typingElement.style.borderRight = "none"; // Remove border after 1 second
        }, 1000);
      }
    }

    typeNextLetter();

    /**
     * Animation on scroll function and init
     */
    function aosInit() {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: false,
        mirror: true
      });
    }
    window.addEventListener('load', aosInit);


    /**
     * Init swiper sliders
     */

    const swiper = new Swiper('.events-carousel', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      autoplay: {
        delay: 3000, // Time in milliseconds between slides
        disableOnInteraction: false, // Keeps autoplay running after interaction
      },
      speed: 800, // Smooth transition speed
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      },
    });

    // Stop autoplay on hover
    const carouselElement = document.querySelector('.events-carousel');
    carouselElement.addEventListener('mouseenter', () => {
      swiper.autoplay.stop();
    });
    carouselElement.addEventListener('mouseleave', () => {
      swiper.autoplay.start();
    });

    /**
     * Frequently Asked Questions Toggle
     */
    document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
      faqItem.addEventListener('click', () => {
        faqItem.parentNode.classList.toggle('faq-active');
      });
    });

    /**
     * Correct scrolling position upon page load for URLs containing hash links.
     */
    window.addEventListener('load', function (e) {
      if (window.location.hash) {
        if (document.querySelector(window.location.hash)) {
          setTimeout(() => {
            let section = document.querySelector(window.location.hash);
            let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
            window.scrollTo({
              top: section.offsetTop - parseInt(scrollMarginTop),
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    });

    /**
     * Navmenu Scrollspy
     */
    let navmenulinks = document.querySelectorAll('.navmenu a');

    function navmenuScrollspy() {
      navmenulinks.forEach(navmenulink => {
        if (!navmenulink.hash) return;
        let section = document.querySelector(navmenulink.hash);
        if (!section) return;
        let position = window.scrollY + 200;
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
          navmenulink.classList.add('active');
        } else {
          navmenulink.classList.remove('active');
        }
      })
    }
    window.addEventListener('load', navmenuScrollspy);
    document.addEventListener('scroll', navmenuScrollspy);


    const isTouchDevice = () => {
      return (
        'ontouchstart' in window || // Check for touch events in the browser
        (window.DocumentTouch && document instanceof DocumentTouch) || // Check for DocumentTouch (older Safari)
        navigator.maxTouchPoints > 0 || // Check for maxTouchPoints (modern browsers)
        navigator.msMaxTouchPoints > 0 // Check for msMaxTouchPoints (IE/Edge)
      );
    };

    // Usage
    if (isTouchDevice()) {
      // Function to check and add/remove class to elements
      function checkElementsPosition() {
        const elements = document.querySelectorAll('.service-box'); // Select all elements (adjust selector)
        const screenHeight = window.innerHeight;

        elements.forEach(element => {
          const elementRect = element.getBoundingClientRect();

          // Check if the element is centered on the screen (within a threshold range)
          const isCentered = elementRect.top <= screenHeight / 2 && elementRect.bottom >= screenHeight / 2;

          if (isCentered) {
            // Add the 'service-handled' class if it's not already added
            if (!element.classList.contains('service-handled')) {
              element.classList.add('service-handled');
            }
          } else {
            // Remove the 'service-handled' class if the element has passed the center
            if (element.classList.contains('service-handled')) {
              element.classList.remove('service-handled');
            }
          }
        });
      }

      // Listen to scroll events
      window.addEventListener('scroll', checkElementsPosition);

      // Optionally, call the function on load to check the initial position if needed
      checkElementsPosition();

    }

  }

  window.addEventListener('load', function () {
    // Generate a random version code (e.g., a random string of numbers and letters)
    var randomVersion = Math.random().toString(36).substr(2, 9); // Generates a random alphanumeric string

    // Update the href of the CSS link with the random version query parameter
    var cssLink = document.getElementById('myCssLink');
    cssLink.href = cssLink.href + "?v=" + randomVersion;

    // Update the src of the JS script with the random version query parameter
    var jsScript = document.getElementById('myJsScript');
    jsScript.src = jsScript.src + "?v=" + randomVersion;
  });

})();