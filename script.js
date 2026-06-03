gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ─── Lenis Smooth Scroll ───
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// Global
const projectCards = gsap.utils.toArray('.project-card');
const projectCursor = document.querySelector('.project-cursor');
let activeIndex = 0;

// ─── 1. Subtle Sparkle Trail ───
const cursorDot = document.querySelector('.cursor-dot');
const canvas = document.getElementById('cursor-sparkles');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas); resizeCanvas();
class Particle {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        this.alpha = 1;
    }
    update() { this.x += this.speedX; this.y += this.speedY; this.alpha -= 0.01; }
    draw() {
        ctx.save(); ctx.globalAlpha = this.alpha; ctx.fillStyle = 'rgba(215, 141, 148, 0.5)';
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
    }
}
function animateSparkles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update(); particles[i].draw();
        if (particles[i].alpha <= 0) { particles.splice(i, 1); i--; }
    }
    requestAnimationFrame(animateSparkles);
}
animateSparkles();
window.addEventListener('mousemove', (e) => {
    gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1 });
    if (Math.random() > 0.5) particles.push(new Particle(e.clientX, e.clientY));
    gsap.to(projectCursor, { x: e.clientX, y: e.clientY, duration: 0.2 });
});

// ─── 2. Text Animations on Scroll ───
const exploreTexts = gsap.utils.toArray('.dive-in-text-container span, .projects-heading-container p');
exploreTexts.forEach((text) => {
    gsap.from(text, {
        scrollTrigger: {
            trigger: text,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 1.5,
        ease: 'power4.out'
    });
});

// ─── 3. Magnetic & Tilt Interactions ───
const magneticElements = document.querySelectorAll('.magnetic, .magnetic-landing');
magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = el.classList.contains('magnetic-landing') ? 0.6 : 0.4;

        gsap.to(el, {
            x: x * strength,
            y: y * strength,
            duration: 0.4,
            ease: 'power2.out'
        });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
    });

    // Smooth Scroll to Section
    if (el.tagName === 'A' && el.getAttribute('href') && el.getAttribute('href').startsWith('#')) {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const target = el.getAttribute('href');
            if (target === '#') {
                lenis.scrollTo(0);
            } else {
                lenis.scrollTo(target, { offset: 0, duration: 1.5 });
            }
        });
    }
});

// Specific 3D Tilt for Story Cards
const storyCards = document.querySelectorAll('.story-text-box');
storyCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation based on distance from center
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.5,
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});

// ─── 4. Parallax Scrolling Effects ───
// Hero Parallax
gsap.to('.huge-text-wrapper', {
    scrollTrigger: {
        trigger: '.pre-landing',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    y: 200,
    opacity: 0.2,
    ease: 'none'
});

// About Scenes Parallax
const scenes = gsap.utils.toArray('.story-scene');
scenes.forEach((scene) => {
    const textBox = scene.querySelector('.story-text-box');
    gsap.to(textBox, {
        scrollTrigger: {
            trigger: scene,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        y: -100,
        ease: 'none'
    });
});

// Project Section Parallax
gsap.to('.projects-heading-container', {
    scrollTrigger: {
        trigger: '.projects-elegant-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5
    },
    y: -150,
    ease: 'none'
});

gsap.to('.three-d-stack', {
    scrollTrigger: {
        trigger: '.projects-elegant-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
    },
    y: -50,
    ease: 'none'
});

// Dive-in Text Parallax
gsap.to('.dive-in-text-container', {
    scrollTrigger: {
        trigger: '.dive-in-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    },
    y: -100,
    ease: 'none'
});

// ─── 5. Projects — 3D Stack Carousel ───
function updateStack() {
    const w = window.innerWidth;
    const offset = w < 800 ? w * 0.4 : 320;
    projectCards.forEach((card, index) => {
        let diff = index - activeIndex;
        if (diff > projectCards.length / 2) diff -= projectCards.length;
        if (diff < -projectCards.length / 2) diff += projectCards.length;
        const zIndex = 100 - Math.abs(diff) * 10;
        const isVisible = Math.abs(diff) <= 1;
        const xPos = isVisible ? diff * offset : 0;
        const zPos = index === activeIndex ? 0 : (isVisible ? -350 : -1000);
        gsap.to(card, {
            x: xPos, xPercent: -50, yPercent: -50, z: zPos,
            rotateY: diff * -30, scale: index === activeIndex ? 1 : 0.75,
            opacity: isVisible ? 1 : 0, zIndex: zIndex,
            duration: 1.2, ease: 'power3.out', overwrite: true
        });
        card.style.filter = index === activeIndex ? 'none' : 'blur(4px) brightness(0.92)';
    });
}
projectCards.forEach((card, index) => {
    // 1. Dynamic Text Coloring based on data-color
    const brandColor = card.getAttribute('data-color');
    const category = card.querySelector('.elegant-category');
    const link = card.querySelector('.elegant-link');
    if (category) category.style.color = brandColor;
    if (link) link.style.color = brandColor;

    // 2. Light Magnetic Interaction Effect on boundaries
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Very subtle movement (magnetic effect)
        gsap.to(card, {
            x: (index === activeIndex ? 0 : (index - activeIndex) * 320) + x * 0.1, // Offset + small magnetic pull
            y: -50 * (activeIndex === index ? 1 : 0.5) + y * 0.1, // Base Y + magnetic pull
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    });

    card.addEventListener('mouseleave', () => {
        updateStack(); // Reset to stable stack position
    });

    card.addEventListener('click', (e) => {
        // If clicking the link specifically, open modal immediately
        if (e.target.classList.contains('elegant-link')) {
            openProjectModal(card.getAttribute('data-project'));
            return;
        }

        if (index !== activeIndex) {
            activeIndex = index;
            updateStack();
        } else {
            openProjectModal(card.getAttribute('data-project'));
        }
    });
    card.addEventListener('mouseenter', () => {
        gsap.to(projectCursor, { scale: 1, opacity: 1, backgroundColor: card.getAttribute('data-color'), color: '#fff' });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(projectCursor, { scale: 0, opacity: 0 });
    });
});
updateStack();
window.addEventListener('resize', updateStack);

// ─── 3. Beyond Design — Horizontal Scroll Setup ───
const scrollContainer = document.querySelector('.scroll-container');
const sections = gsap.utils.toArray('.section');

const scrollTween = gsap.to(scrollContainer, {
    x: () => -(scrollContainer.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
        trigger: '.scroller-wrapper',
        pin: true,
        scrub: 0.5,
        start: 'top top',
        end: () => '+=' + (scrollContainer.scrollWidth - window.innerWidth),
        invalidateOnRefresh: true,
        onUpdate: (self) => updateNav(self.progress),
        onEnter: () => document.querySelector('.bottom-nav').classList.add('visible'),
        onLeaveBack: () => document.querySelector('.bottom-nav').classList.remove('visible'),
    }
});

// Intro Text Reveal
gsap.from('#camera-intro h1, .intro-subtext', {
    scrollTrigger: {
        trigger: '.scroller-wrapper',
        start: 'top 40%',
        toggleActions: 'play none none reverse'
    },
    y: 50,
    stagger: 0.2,
    opacity: 0,
    duration: 1.5,
    ease: 'power4.out'
});

function updateNav(progress) {
    const totalHobbySections = sections.length; // 5 hobby sections
    // Intro section takes the first portion of the progress (approx 1/6th)
    // We want to map progress 0-1 to active states for the 5 nav items
    const idx = Math.floor(progress * (totalHobbySections + 1)) - 1;
    document.querySelectorAll('.nav-item').forEach((item, i) => {
        if (i === idx) item.classList.add('active'); else item.classList.remove('active');
    });
}

// Polaroid Scroll Interaction - Sequential Stacking (Automated)
sections.forEach((section) => {
    const cards = section.querySelectorAll('.card');

    // Create a timeline for this section's cards that plays automatically on enter
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            containerAnimation: scrollTween,
            start: 'left 60%', // Trigger earlier for an "immediate" feel
            toggleActions: 'play none none reverse',
        }
    });

    const clusterPositions = [
        { r: -5, x: -15, y: -10 },
        { r: 3, x: 10, y: -5 },
        { r: -2, x: -8, y: 12 },
        { r: 6, x: 5, y: 5 }
    ];

    cards.forEach((card, i) => {
        tl.fromTo(card,
            {
                opacity: 0,
                scale: 0.5,
                xPercent: -50,
                yPercent: 150,
                rotation: i % 2 === 0 ? -20 : 20
            },
            {
                opacity: 1,
                scale: 1,
                xPercent: -50,
                yPercent: -50,
                x: clusterPositions[i % 4].x * 5,
                y: clusterPositions[i % 4].y * 5,
                rotation: clusterPositions[i % 4].r,
                ease: 'back.out(1.4)', // Add a bit of "snap" for interactivity
                duration: 0.8
            },
            i * 0.2 // Quicker succession for an "immediate" stacking feel
        );
    });
});

// ─── 4. Let's Connect — Ink Fluid & Reveals ───
const inkCanvas = document.getElementById('ink-canvas');
const inkCtx = inkCanvas.getContext('2d');
let inkParticles = [];
const inkColors = ['#d78d94', '#457b9d', '#f4a261'];

function resizeInk() {
    inkCanvas.width = window.innerWidth;
    inkCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeInk);
resizeInk();

class InkParticle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * inkCanvas.width;
        this.y = Math.random() * inkCanvas.height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 80 + 40;
        this.color = inkColors[Math.floor(Math.random() * inkColors.length)];
        this.alpha = 0;
        this.maxAlpha = Math.random() * 0.15 + 0.05;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.alpha < this.maxAlpha) this.alpha += 0.002;

        if (this.x < -this.radius) this.x = inkCanvas.width + this.radius;
        if (this.x > inkCanvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = inkCanvas.height + this.radius;
        if (this.y > inkCanvas.height + this.radius) this.y = -this.radius;
    }
    draw() {
        inkCtx.beginPath();
        const gradient = inkCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.color + Math.floor(this.alpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, 'transparent');
        inkCtx.fillStyle = gradient;
        inkCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        inkCtx.fill();
    }
}

for (let i = 0; i < 20; i++) inkParticles.push(new InkParticle());

function animateInk() {
    inkCtx.clearRect(0, 0, inkCanvas.width, inkCanvas.height);
    inkCtx.filter = 'blur(40px)';
    inkParticles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateInk);
}
animateInk();

// Connect Section Reveals
// ─── Wave Animation (Rising Tide) ───
gsap.to('.connect-wave-wrapper', {
    scrollTrigger: {
        trigger: '.connect-section',
        start: 'top bottom',
        end: 'top top',
        scrub: 1.2,
    },
    y: '0%',
    ease: 'none'
});

// ─── Individual Color Transitions for Links ───
// Using persistent ScrollTriggers to keep text white at the very bottom
const colorShiftSelectors = ['.title-solid', '.title-outline', '.connect-footer-text', '.floating-pill', '.floating-pill span'];

colorShiftSelectors.forEach(selector => {
    ScrollTrigger.create({
        trigger: '.connect-section',
        start: 'top 85%',
        end: 'max', // Stay active until the very end of the page
        onToggle: self => {
            const targets = document.querySelectorAll(selector);
            targets.forEach(el => {
                if (self.isActive) {
                    el.classList.add('force-white');
                } else {
                    el.classList.remove('force-white');
                }
            });
        }
    });
});

// Border shift for items
ScrollTrigger.create({
    trigger: '.connect-section',
    start: 'top 85%',
    end: 'max',
    onToggle: self => {
        const items = document.querySelectorAll('.connect-link-pill');
        items.forEach(item => {
            if (self.isActive) {
                item.classList.add('force-white-border');
            } else {
                item.classList.remove('force-white-border');
            }
        });
    }
});

gsap.from('.connect-card', {
    scrollTrigger: {
        trigger: '.connect-section',
        start: 'top 90%',
    },
    y: 80, opacity: 0.2, duration: 1.5, ease: 'power3.out'
});

gsap.from('.connect-list-item', {
    scrollTrigger: {
        trigger: '.connect-section',
        start: 'top 80%',
    },
    y: 30, stagger: 0.1, duration: 1, ease: 'power2.out'
});

// Parallax for hobby section titles
sections.forEach((section) => {
    const title = section.querySelector('.text-container');
    if (title) {
        gsap.to(title, {
            x: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                containerAnimation: scrollTween,
                start: 'left right',
                end: 'right left',
                scrub: true
            }
        });
    }
});

// ─── 4. Project Modal Data & Logic ───
const projectData = {
    feedo: {
        title: "Feedo",
        description: "A smart pet-care system combining a mobile app with an automated food dispenser.",
        problem: "Pet owners often struggle to feed and stay connected with their pets while away from home.",
        solution: "Designed an IoT-based feeding experience with remote feeding, live camera access, and voice interaction.",
        outcome: "Made pet care more convenient, interactive, and emotionally connected.",
        tools: "Figma, Adobe Illustrator",
        team: "6 Designers",
        type: "IoT / Pet Care & Mobile App",
        color: "#e2b13c", // Mustard
        logo: "images/feedo/feedo_logo.png",
        banner: "images/feedo/feedo_banner.png",
        sketches: "images/feedo/prototype.png",
        ui: "images/feedo/feedo_screens.png",
        behance: "https://www.behance.net/gallery/242782705/Feedo-Automatic-Pet-Feed-App-(Group-Project)"
    },
    momsie: {
        title: "Momsie",
        description: "A pregnancy awareness platform focused on maternal health, nutrition, and emotional support.",
        problem: "Many expecting mothers struggle to find simple and trustworthy pregnancy guidance in one place.",
        solution: "Designed a comforting and easy-to-use experience with stage-based guidance and nutritional support.",
        outcome: "Created a more supportive and easy-to-navigate experience for expecting mothers.",
        tools: "Figma, Adobe Illustrator",
        team: "Solo Project",
        type: "Mobile App / Health Tech",
        color: "#d78d94", // Pink
        logo: "images/momsie/momsie_logo.png",
        banner: "images/momsie/momsie_banner.png",
        sketches: "images/momsie/momsie_comp.png",
        ui: "images/momsie/momsie_screens.png",
        behance: "https://www.behance.net/gallery/227897361/Momsie-Pregnancy-Nutrition-Awareness-App"
    },
    skinsense: {
        title: "SkinSense",
        description: "AI-powered skincare analysis for personalized product transparency.",
        problem: "Choosing skincare is a guessing game due to complex chemical ingredients and marketing jargon.",
        solution: "A scan-and-decode system that uses AI to explain ingredient benefits and risks for your skin type.",
        outcome: "Created a more personalized and awareness-driven skincare experience.",
        tools: "Figma, Photoshop, Adobe Illustrator",
        team: "Solo Project",
        type: "IoT / Skincare Product",
        color: "#9b59b6", // Purple theme
        logo: "images/skinsense/skinsense_logo.png",
        banner: "images/skinsense/skin_banner.png",
        sketches: "images/skinsense/skin_color.png",
        ui: "images/skinsense/skinsense_screens.png",
        behance: "https://www.behance.net/gallery/222965149/SkinSense-AI-powered-personalized-skincare-app"
    },
    archline: {
        title: "Arch & Line",
        description: "A branding project for a startup architecture and interior design studio.",
        problem: "As a new startup Arch & Line lacked a professional and recognizable brand identity.",
        solution: "Created a minimalist, geometry-driven branding system that echoes structural blueprints.",
        outcome: "Established a clean and cohesive brand presence across digital and print media.",
        tools: "Illustrator, Photoshop",
        team: "Solo Project",
        type: "Branding / Visual Identity",
        color: "#264653",
        logo: "images/archline/arch_logo.png",
        banner: "images/archline/arch_banner.png",
        processHeading: "Visiting Card",
        uiHeading: "Mockup",
        sketches: "images/archline/arch_visit.png",
        ui: "images/archline/logo_mockup.png",
        behance: "https://www.behance.net/gallery/215080749/Arch-Line-Logo-Design"
    }
};

function openProjectModal(id) {
    const data = projectData[id];
    if (!data) return;

    // Core Info
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-description').innerText = data.description;
    document.getElementById('modal-problem').innerText = data.problem;
    document.getElementById('modal-solution').innerText = data.solution;
    document.getElementById('modal-outcome').innerText = data.outcome;

    // Metadata
    document.getElementById('modal-tools').innerText = data.tools;
    document.getElementById('modal-team').innerText = data.team;
    document.getElementById('modal-type').innerText = data.type;

    // Visuals
    document.getElementById('modal-logo').src = data.logo;
    document.getElementById('modal-banner').src = data.banner;
    document.getElementById('modal-behance').href = data.behance;
    document.getElementById('modal-behance-header').href = data.behance;
    document.getElementById('modal-sketches').src = data.sketches;
    document.getElementById('modal-ui').src = data.ui;

    // Headings
    document.getElementById('modal-process-heading').innerText = data.processHeading || "Process & Sketches";
    document.getElementById('modal-ui-heading').innerText = data.uiHeading || "UI Design";

    const modal = document.getElementById('project-case-study');

    // Set Theme Color
    document.documentElement.style.setProperty('--modal-accent', data.color || '#d78d94');

    modal.style.display = 'block'; // Use block for overflow-y auto to work properly
    lenis.stop();
    gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.5 });

    // Reset scroll position of the modal overlay
    modal.scrollTop = 0;
}

document.querySelector('.modal-close').addEventListener('click', closeProjectModal);

// Close on click outside
document.getElementById('project-case-study').addEventListener('click', (e) => {
    if (e.target.id === 'project-case-study') {
        closeProjectModal();
    }
});

function closeProjectModal() {
    const modal = document.getElementById('project-case-study');
    gsap.to(modal, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
            modal.style.display = 'none';
            lenis.start();
        }
    });
}

window.addEventListener('load', () => { ScrollTrigger.refresh(); });

// ─── Beyond Design Image Preview (Lightbox) ───
const previewModal = document.getElementById('image-preview-modal');
const previewImg = document.getElementById('preview-img');
const closePreview = document.querySelector('.close-preview');
const hobbyImages = document.querySelectorAll('.card .photo-box img');

hobbyImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
        const src = e.target.src;
        previewImg.src = src;
        previewModal.style.display = 'flex';

        gsap.to(previewModal, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
            onStart: () => {
                previewModal.classList.add('active');
            }
        });

        // Dynamic Spring Pop for Polaroid
        gsap.fromTo('.polaroid-frame',
            { scale: 0.5, y: 150, rotation: -15, opacity: 0 },
            {
                scale: 1,
                y: 0,
                rotation: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'back.out(1.7)', // The "spring" effect
                delay: 0.1
            }
        );
    });
});

function closeThePreview() {
    gsap.to(previewModal, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
            previewModal.style.display = 'none';
            previewModal.classList.remove('active');
        }
    });

    gsap.to('.polaroid-frame', {
        scale: 0.7,
        y: 100,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
    });
}

if (closePreview) closePreview.addEventListener('click', closeThePreview);
if (previewModal) {
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) closeThePreview();
    });
}

// Escape key to close
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewModal && previewModal.classList.contains('active')) {
        closeThePreview();
    }
});

// Connect Section: Persistent Links Reveal
document.addEventListener('DOMContentLoaded', () => {
    const connectContainer = document.querySelector('.connect-hero'); // Using a broader container
    const connectBox = document.querySelector('.connect-photo-anchor');

    if (connectContainer && connectBox) {
        // Toggle links visibility when entering the hero area
        const showLinks = () => {
            if (!connectBox.classList.contains('links-revealed')) {
                connectBox.classList.add('links-revealed');
            }
        };

        connectContainer.addEventListener('mouseenter', showLinks);
        connectContainer.addEventListener('mousemove', showLinks); // Fallback for cases where mouse is already inside

        // Hide links when scrolling out of view
        ScrollTrigger.create({
            trigger: '.connect-section',
            start: 'top bottom',
            end: 'bottom top',
            onToggle: self => {
                if (!self.isActive) {
                    connectBox.classList.remove('links-revealed');
                }
            },
            onLeave: () => connectBox.classList.remove('links-revealed'),
            onLeaveBack: () => connectBox.classList.remove('links-revealed')
        });
    }
});