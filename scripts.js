// Initialize AOS with optimized settings for mobile
AOS.init({
once: false,
mirror: true,
anchorPlacement: 'top-bottom',
// disable: 'phone', // Animations now enabled on phones
throttleDelay: 99 // Lower throttle delay for better performance
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Remove any existing close buttons that might have been dynamically added
    const existingCloseButtons = document.querySelectorAll('.dynamically-added-close');
    existingCloseButtons.forEach(button => button.remove());
    
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu-button');
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    const body = document.body;
    // Get the burger icon spans
    const burgerSpans = menuToggle ? menuToggle.querySelectorAll('span') : [];

    // Function to toggle menu
    function toggleMenu(open) {
        if (open) {
            mobileMenu.classList.add('active');
            body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            body.style.position = 'fixed'; // Fix the body position
            body.style.width = '100%'; // Ensure body width is 100%
            menuToggle.style.display = 'none'; // Hide the menu toggle when open
            
        } else {
            mobileMenu.classList.remove('active');
            body.style.overflow = ''; // Restore scrolling
            body.style.position = ''; // Restore position
            body.style.width = ''; // Restore width
            menuToggle.style.display = ''; // Show the menu toggle when closed
        }
    }

    // Handle menu toggle click
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMenu(true);
        });
    }

    // Handle close button click
    if (closeMenu && mobileMenu) {
        closeMenu.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMenu(false);
        });
    }

    // Close menu when clicking on links - with optimizations for mobile
    mobileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            // First close the menu
            toggleMenu(false);
            
            // Then scroll to the section after a small delay
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }, 100); // Reduced delay for better UX
            }
        });
    });

    // Optimize event listener for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Swipe to close menu
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        if (mobileMenu.classList.contains('active') && touchStartX < touchEndX && touchEndX - touchStartX > 50) {
            toggleMenu(false);
        }
    }, {passive: true});

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            e.target !== menuToggle &&
            !menuToggle.contains(e.target)) {
            toggleMenu(false);
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu(false);
        }
    });
    
    // Check for viewport changes
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    
    function handleScreenChange(e) {
        if (e.matches && mobileMenu.classList.contains('active')) {
            toggleMenu(false);
        }
    }
    
    mediaQuery.addEventListener('change', handleScreenChange);
});

// File download function
function downloadFile(fileUrl, fileName) {
// Create a loading indicator
const loadingToast = document.createElement('div');
loadingToast.textContent = 'Downloading...';
loadingToast.style.position = 'fixed';
loadingToast.style.bottom = '20px';
loadingToast.style.right = '20px';
loadingToast.style.backgroundColor = 'rgba(95, 43, 126, 0.9)';
loadingToast.style.color = 'white';
loadingToast.style.padding = '10px 20px';
loadingToast.style.borderRadius = '5px';
loadingToast.style.zIndex = '1000';
document.body.appendChild(loadingToast);

// Fetch the file
fetch(fileUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        document.body.removeChild(loadingToast);
        
        // Show success message
        const successToast = document.createElement('div');
        successToast.textContent = 'Download complete!';
        successToast.style.position = 'fixed';
        successToast.style.bottom = '20px';
        successToast.style.right = '20px';
        successToast.style.backgroundColor = 'rgba(16, 185, 129, 0.9)';
        successToast.style.color = 'white';
        successToast.style.padding = '10px 20px';
        successToast.style.borderRadius = '5px';
        successToast.style.zIndex = '1000';
        document.body.appendChild(successToast);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            document.body.removeChild(successToast);
        }, 3000);
    })
    .catch(error => {
        console.error('Error downloading file:', error);
        document.body.removeChild(loadingToast);
        
        // Show error message
        const errorToast = document.createElement('div');
        errorToast.textContent = 'Error downloading file. Please try again later.';
        errorToast.style.position = 'fixed';
        errorToast.style.bottom = '20px';
        errorToast.style.right = '20px';
        errorToast.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
        errorToast.style.color = 'white';
        errorToast.style.padding = '10px 20px';
        errorToast.style.borderRadius = '5px';
        errorToast.style.zIndex = '1000';
        document.body.appendChild(errorToast);
        
        // Remove error message after 3 seconds
        setTimeout(() => {
            document.body.removeChild(errorToast);
        }, 3000);
    });
}

// Initialize Particles.js for neural network effect
particlesJS("particles-js", {
"particles": {
    "number": {
        "value": 80,
        "density": {
            "enable": true,
            "value_area": 800
        }
    },
    "color": {
        "value": "#5f2b7e"
    },
    "shape": {
        "type": "circle",
        "stroke": {
            "width": 0,
            "color": "#000000"
        },
    },
    "opacity": {
        "value": 0.4,
        "random": false,
        "anim": {
            "enable": false
        }
    },
    "size": {
        "value": 3,
        "random": true,
        "anim": {
            "enable": false
        }
    },
    "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#8543af",
        "opacity": 0.3,
        "width": 1
    },
    "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
    }
},
"interactivity": {
    "detect_on": "canvas",
    "events": {
        "onhover": {
            "enable": true,
            "mode": "grab"
        },
        "onclick": {
            "enable": true,
            "mode": "push"
        },
        "resize": true
    },
    "modes": {
        "grab": {
            "distance": 140,
            "line_linked": {
                "opacity": 1
            }
        },
        "push": {
            "particles_nb": 4
        }
    }
},
"retina_detect": true
});

// JavaScript for smooth scrolling
// Modify the global smooth scrolling to avoid conflicts with mobile menu
document.querySelectorAll('a[href^="#"]:not(#mobile-menu a)').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});