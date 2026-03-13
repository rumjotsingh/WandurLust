// Premium UI Enhancements - Apple/Airbnb/Instagram Style

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.enhanced-navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Scroll to top button
const createScrollTopButton = () => {
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// Initialize scroll to top button
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createScrollTopButton);
} else {
    createScrollTopButton();
}

// Favorite button functionality
document.addEventListener('click', (e) => {
    if (e.target.closest('.favorite-btn')) {
        const btn = e.target.closest('.favorite-btn');
        btn.classList.toggle('active');
        
        // Add haptic feedback animation
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 200);
    }
});

// Image lazy loading with fade-in effect
const observeImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
};

// Card hover effects
const enhanceCards = () => {
    const cards = document.querySelectorAll('.listing-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
};

// Mobile bottom navigation active state
const updateMobileNav = () => {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.mobile-nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (currentPath === href || currentPath.startsWith(href + '/')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
};

// Toast notification system
const showToast = (message, type = 'success') => {
    const container = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = 'premium-toast';
    
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    const color = type === 'success' ? '#10b981' : '#ef4444';
    
    toast.innerHTML = `
        <i class="fa-solid ${icon}" style="color: ${color}; font-size: 1.5rem;"></i>
        <span style="flex: 1;">${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; color: #717171;">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

const createToastContainer = () => {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
};

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#!') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Initialize enhancements
document.addEventListener('DOMContentLoaded', () => {
    observeImages();
    enhanceCards();
    updateMobileNav();
});

// Export for use in other scripts
window.WandurLust = {
    showToast,
    updateMobileNav
};
