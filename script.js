document.addEventListener('DOMContentLoaded', () => {

    // 1. Particle System creation
    createParticles();

    // 2. Start Button Navigation
    const startBtn = document.getElementById('start-btn');
    if(startBtn) {
        startBtn.addEventListener('click', () => {
            const chartSection = document.getElementById('s2-chart');
            // Get precise position accounting for header if any exist later
            const yOffset = chartSection.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: yOffset, behavior: 'smooth' });
        });
    }

    // 3. Intersection Observer for Fade-in & Staggered effects
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                
                // Stagger ANY direct children with a delay
                const children = entry.target.querySelectorAll('.photo-card, .music-card, .shayari-card, .personality-list li');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                        // For cards that don't have 'visible' class in original CSS, we use opacity
                        child.style.opacity = "1";
                        child.style.transform = "translate3d(0,0,0)";
                    }, 100 * index);
                });

                if (entry.target.id === 's2-chart') {
                    const chart = entry.target.querySelector('.pie-chart');
                    if(chart) setTimeout(() => chart.classList.add('start-chart-anim'), 300);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.fade-in-hidden');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 4. Robust Audio Controller
    let currentAudio = null;
    let currentCard = null;

    const musicCards = document.querySelectorAll('.music-card');
    
    musicCards.forEach(card => {
        const btn = card.querySelector('.play-btn');
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

            // Optimization: Show loading state while buffering for the cloud
            btn.textContent = '⏳ Loading...';
            btn.disabled = true;

            currentAudio = new Audio(audioSrc);
            currentCard = card;
            
            // Wait for enough data to play smoothly
            currentAudio.addEventListener('canplaythrough', () => {
                if (currentCard === card) { // Ensure user hasn't switched songs while loading
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

});

// Optimized Particle System for Mobile
function createParticles() {
    const container = document.getElementById('particles-container');
    if(!container) return;

    // Further limit particles to ensure buttery 60fps on low-end mobile CPUs
    const isMobile = window.innerWidth <= 768;
    const numParticles = isMobile ? 15 : 25; 

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        
        // Randomizations
        const size = Math.random() * 3 + 1; // 1px to 4px
        const posX = Math.random() * 100; // 0 to 100vw
        const posY = Math.random() * 100; // 0 to 100vh
        const delay = Math.random() * 5;
        const duration = Math.random() * 8 + 12; // 12s to 20s
        const opacity = Math.random() * 0.4 + 0.1;

        // Styling
        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = '#c77dff';
        particle.style.borderRadius = '50%';
        particle.style.left = `${posX}vw`;
        particle.style.top = `${posY}vh`;
        particle.style.opacity = opacity;
        
        // Hardware accelerated performance keys
        particle.style.willChange = 'transform';
        
        // Use translate3d to offload calculation to GPU 
        // We use string interpolation here so the animation keyframe can just translate linearly
        particle.style.animation = `floatParticleGPU ${duration}s linear ${delay}s infinite alternate`;

        container.appendChild(particle);
    }

    // High performance keyframes injected once
    if(!document.getElementById('particle-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'particle-styles';
        styleSheet.type = 'text/css';
        styleSheet.innerText = `
            @keyframes floatParticleGPU {
                0% { transform: translate3d(0, 0, 0); }
                100% { transform: translate3d(${Math.random() > 0.5 ? '20px' : '-20px'}, -40px, 0); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

// 5. Scroll Progress Logic
window.addEventListener('scroll', () => {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    }
});
