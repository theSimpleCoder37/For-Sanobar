document.addEventListener('DOMContentLoaded', () => {

    // 0. Password Logic
    const passwordOverlay = document.getElementById('password-overlay');
    const passwordInput = document.getElementById('password-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const passwordError = document.getElementById('password-error');
    const mainContent = document.getElementById('main-content');
    
    // Auto-initialize if the lock screen is turned off
    if (passwordOverlay && passwordOverlay.style.display === 'none') {
        initMainApp();
        const firstSection = document.getElementById('s1-opening');
        if (firstSection) firstSection.classList.add('fade-in-visible');
    }

    const checkPassword = () => {
        if (passwordInput.value === '1102') {
            passwordOverlay.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Trigger professional intro transition
            requestAnimationFrame(() => {
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'scale(1)';
            });
            
            // Re-trigger global initialization
            initMainApp();
            
            const firstSection = document.getElementById('s1-opening');
            if (firstSection) firstSection.classList.add('fade-in-visible');
        } else {
            passwordError.style.display = 'block';
            passwordInput.value = '';
            setTimeout(() => { passwordError.style.display = 'none'; }, 3000);
        }
    };

    unlockBtn.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPassword();
    });

    function initMainApp() {
        // 1. Core Systems (Optimized Restore: Very low count for perfect performance)
        createParticles();

        // 2. Start Button Navigation
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                const target = document.getElementById('s2-chart');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        }

        // 3. Floating Hearts (Bonus interaction)
        document.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'TEXTAREA') {
                createHeart(e.pageX, e.pageY);
            }
        });

        // 4. Intersection Observer for Fade-in & Staggered effects
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -20px 0px',
            threshold: 0 // Trigger as soon as 1 pixel is visible
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                    
                    const children = entry.target.querySelectorAll('.photo-card, .music-card, .shayari-card, .personality-list li');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                            child.style.opacity = "1";
                            child.style.transform = "translate3d(0,0,0)";
                        }, 100 * index);
                    });

                    if (entry.target.id === 's2-chart') {
                        const chart = entry.target.querySelector('.pie-chart');
                        if (chart) setTimeout(() => chart.classList.add('start-chart-anim'), 300);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const sections = document.querySelectorAll('.fade-in-hidden');
        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // 5. Robust Audio Controller
        setupAudio();

        // 6. Cursor Glow Trailer (Desktop Only)
        if (window.innerWidth > 1024) {
            const glow = document.createElement('div');
            glow.className = 'cursor-glow';
            document.body.appendChild(glow);
            window.addEventListener('mousemove', (e) => {
                glow.style.transform = `translate3d(${e.clientX - 150}px, ${e.clientY - 150}px, 0)`;
            });
        }
    }

    function setupAudio() {
        let currentAudio = null;
        let currentCard = null;

        const musicCards = document.querySelectorAll('.music-card');
        
        musicCards.forEach(card => {
            const btn = card.querySelector('.play-btn');
            if(!btn) return;
            
            const audioSrc = card.getAttribute('data-audio');
            
            btn.addEventListener('click', () => {
                if (currentAudio && currentCard === card) {
                    if (!currentAudio.paused) {
                        currentAudio.pause();
                        btn.textContent = '▶ Play';
                        card.classList.remove('playing');
                    } else {
                        currentAudio.play().catch(e => console.log("Audio play blocked."));
                        btn.textContent = '⏸ Pause';
                        card.classList.add('playing');
                    }
                    return;
                }

                if (currentAudio) {
                    currentAudio.pause();
                    const prevBtn = currentCard.querySelector('.play-btn');
                    if(prevBtn) prevBtn.textContent = '▶ Play';
                    currentCard.classList.remove('playing');
                }

                btn.textContent = '⏳ Loading...';
                btn.disabled = true;

                currentAudio = new Audio(audioSrc);
                currentCard = card;
                
                currentAudio.addEventListener('canplaythrough', () => {
                    if (currentCard === card) {
                        const playPromise = currentAudio.play();
                        if (playPromise !== undefined) {
                            playPromise.then(_ => {
                                btn.textContent = '⏸ Pause';
                                btn.disabled = false;
                                card.classList.add('playing');
                            }).catch(error => {
                                btn.textContent = '▶ Play';
                                btn.disabled = false;
                                console.log("Playback failed:", error);
                            });
                        }
                    }
                }, { once: true });

                currentAudio.addEventListener('ended', () => {
                    btn.textContent = '▶ Play';
                    card.classList.remove('playing');
                    currentAudio = null;
                    currentCard = null;
                });

                currentAudio.addEventListener('error', () => {
                    btn.textContent = '❌ Error Loading';
                    btn.disabled = false;
                    console.log("Audio load error.");
                });
            });
        });
    }

    function createHeart(x, y) {
        const heart = document.createElement('div');
        heart.innerHTML = '💜';
        heart.style.position = 'absolute';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = '20px';
        heart.style.pointerEvents = 'none';
        heart.style.animation = 'floatUp 1.5s ease-out forwards';
        heart.style.zIndex = '1000';
        heart.style.willChange = 'transform, opacity';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1500);
    }
});

// Optimized Particle System for Mobile
function createParticles() {
    const container = document.getElementById('particles-container');
    if(!container) return;

    const isMobile = window.innerWidth <= 768;
    const numParticles = isMobile ? 6 : 15; 

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        const size = 2; // Fixed small size for fastest rendering
        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = '#c77dff';
        particle.style.borderRadius = '50%';
        particle.style.left = `${Math.random() * 90}vw`; // Stay within screen
        particle.style.top = `${Math.random() * 90}vh`; // Stay within screen
        
        particle.style.willChange = 'transform';
        const duration = Math.random() * 10 + 20; // Even slower for elegance
        const delay = Math.random() * -20; 
        // Safer path: 0 to 10% movement only to stay within screen
        particle.style.animation = `flowSafe ${duration}s linear ${delay}s infinite alternate`;
        container.appendChild(particle);
    }

    if(!document.getElementById('particle-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'particle-styles';
        styleSheet.innerText = `
            @keyframes flowSafe {
                0% { transform: translate3d(0, 0, 0); opacity: 0; }
                50% { opacity: 0.4; }
                100% { transform: translate3d(20px, 40px, 0); opacity: 0; }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}
