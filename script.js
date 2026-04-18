document.addEventListener('DOMContentLoaded', () => {

    // 0. Password Logic
    const passwordOverlay = document.getElementById('password-overlay');
    const passwordInput = document.getElementById('password-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const passwordError = document.getElementById('password-error');
    const mainContent = document.getElementById('main-content');
    
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
        // 1. Core Systems
        createParticles();
        createOrbs();

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
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
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
            // Instant check for mobile: if section is already in view after unlocking
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                section.classList.add('fade-in-visible');
                // Trigger children
                const children = section.querySelectorAll('.photo-card, .music-card, .shayari-card, .personality-list li');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                        child.style.opacity = "1";
                        child.style.transform = "translate3d(0,0,0)";
                    }, 100 * index);
                });
                if (section.id === 's2-chart') {
                    const chart = section.querySelector('.pie-chart');
                    if (chart) setTimeout(() => chart.classList.add('start-chart-anim'), 300);
                }
            }
        });

        // 5. Robust Audio Controller
        setupAudio();

        // 6. Scroll Progress Bar (Restored)
        const progressBar = document.getElementById('progress-bar');
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            if (progressBar) progressBar.style.width = scrolled + "%";
        }, { passive: true });

        // 7. Cursor Glow Trailer (Desktop Only)
        if (window.innerWidth > 1024) {
            const glow = document.createElement('div');
            glow.className = 'cursor-glow';
            document.body.appendChild(glow);
            window.addEventListener('mousemove', (e) => {
                glow.style.transform = `translate3d(${e.clientX - 150}px, ${e.clientY - 150}px, 0)`;
            });
        }

        // 8. Professional 3D Card Tilt (Subtle & Smooth)
        const interactiveCards = document.querySelectorAll('.music-card, .shayari-card, .photo-card, .dua-card');
        
        const handleMove = (e, card) => {
            const rect = card.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const x = clientX - rect.left;
            const y = clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Subtle, professional values
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.01)`;
        };

        const handleReset = (card) => {
            card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
        };

        interactiveCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                card.style.transition = 'none'; // Instant response while moving
                handleMove(e, card);
            });
            card.addEventListener('mouseleave', () => handleReset(card));
            
            card.addEventListener('touchstart', () => {
                card.style.transition = 'none';
            }, { passive: true });
            
            card.addEventListener('touchmove', (e) => {
                handleMove(e, card);
            }, { passive: true });
            
            card.addEventListener('touchend', () => handleReset(card));
        });
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
    const numParticles = isMobile ? 15 : 25; 

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;
        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = '#c77dff';
        particle.style.borderRadius = '50%';
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        particle.style.willChange = 'transform';
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * -20; 
        particle.style.animation = `flowStream ${duration}s linear ${delay}s infinite`;
        container.appendChild(particle);
    }

    if(!document.getElementById('particle-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'particle-styles';
        styleSheet.innerText = `
            @keyframes flowStream {
                0% { transform: translate3d(-10vw, -10vh, 0); opacity: 0; }
                10% { opacity: 0.4; }
                90% { opacity: 0.4; }
                100% { transform: translate3d(110vw, 110vh, 0); opacity: 0; }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

// NEW: Flowing Orbs System (Pleasing & Creative)
function createOrbs() {
    const main = document.getElementById('main-content');
    if(!main) return;
    
    // Create 5 soft flowing orbs
    for (let i = 0; i < 5; i++) {
        const orb = document.createElement('div');
        orb.className = 'orb';
        const size = Math.random() * 200 + 150;
        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;
        orb.style.left = `${Math.random() * 80}vw`;
        orb.style.top = `${Math.random() * 80}vh`;
        orb.style.animationDuration = `${Math.random() * 15 + 15}s`;
        orb.style.animationDelay = `${Math.random() * 5}s`;
        main.appendChild(orb);
    }
}

// Optimized Scroll Progress (Throttled)
let lastScrollTime = 0;
window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime < 30) return; // ~30fps throttle
    lastScrollTime = now;

    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    }
}, { passive: true });
