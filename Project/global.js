// --- NAVIGATION LOGIC ---
const activeLink = document.querySelector('.active-link');
const highlight = document.getElementById('nav-highlight');
const transitionLinks = document.querySelectorAll('.nav-transition-link');

function initHighlight() {
    if (activeLink && highlight) {
        const width = activeLink.offsetWidth;
        const left = activeLink.offsetLeft;
        highlight.style.width = `${width}px`;
        highlight.style.left = `${left}px`;
        highlight.style.opacity = '1';
    }
}
window.addEventListener('load', initHighlight);
initHighlight(); 

transitionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('mailto') && !href.startsWith('http')) {
            e.preventDefault();
            const width = link.offsetWidth;
            const left = link.offsetLeft;
            if(highlight) {
                highlight.style.width = `${width}px`;
                highlight.style.left = `${left}px`;
            }
            transitionLinks.forEach(l => {
                l.classList.remove('font-extrabold', 'text-gray-900');
                l.classList.add('font-normal', 'text-gray-500');
            });
            link.classList.remove('font-normal', 'text-gray-500');
            link.classList.add('font-extrabold', 'text-gray-900');
            setTimeout(() => {
                const tempLink = document.createElement('a');
                tempLink.href = href;
                tempLink.click();
            }, 350); 
        }
    });
});

const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
let isMenuOpen = false;
if(hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        hamburgerBtn.setAttribute('data-open', isMenuOpen);
        if(isMenuOpen) { 
            mobileMenu.classList.remove('hidden-menu'); 
            mobileMenu.classList.add('visible-menu'); 
        } else { 
            mobileMenu.classList.remove('visible-menu'); 
            mobileMenu.classList.add('hidden-menu'); 
        }
    });
}

// --- CURSOR LOGIC (UPDATED) ---
const cursor = document.getElementById('custom-cursor');
const cursorText = document.getElementById('cursor-text'); 
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

// Set posisi awal di tengah agar tidak lompat dari pojok
if (cursor) {
    cursorX = window.innerWidth / 2;
    cursorY = window.innerHeight / 2;
    mouseX = cursorX;
    mouseY = cursorY;
}

document.addEventListener('mousemove', (e) => { 
    mouseX = e.clientX; 
    mouseY = e.clientY; 
});

function animateCursor() {
    // Speed rendah = efek lag/liquid
    const speed = 0.25;
    cursorX += (mouseX - cursorX) * speed; 
    cursorY += (mouseY - cursorY) * speed;
    
    // Gunakan translate3d untuk performa render
    if (cursor) cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
}

animateCursor();

// --- HOVER LOGIC: FINAL VIEW CHART (OPEN PROJECT) ---
const finalViewTrigger = document.querySelector('.final-view-trigger');

if (finalViewTrigger && cursor && cursorText) {
    finalViewTrigger.addEventListener('mouseenter', () => {
        cursor.classList.add('hover-open-project');
        cursorText.textContent = "OPEN PROJECT";
    });

    finalViewTrigger.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover-open-project');
        cursorText.textContent = "";
    });
}

// --- HOVER LOGIC: NEXT PROJECT (VIEW PROJECT) ---
const nextProjectTriggers = document.querySelectorAll('.next-project-trigger');

if (nextProjectTriggers.length > 0 && cursor && cursorText) {
    nextProjectTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', () => {
            cursor.classList.add('hover-next-project');
            cursorText.textContent = "VIEW PROJECT";
        });

        trigger.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover-next-project');
            cursorText.textContent = "";
        });
    });
}