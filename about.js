document.addEventListener('DOMContentLoaded', () => {
    
    const highlight = document.getElementById('nav-highlight');
    const links = document.querySelectorAll('.nav-transition-link');
    const cursor = document.getElementById('custom-cursor');
    const cursorText = document.getElementById('cursor-text'); 

    function initNavigation() {
        if (!highlight) return;
        const savedNav = sessionStorage.getItem('navState');
        const activeLink = document.querySelector('.active-link');

        links.forEach(l => {
            l.classList.remove('font-extrabold', 'text-gray-900');
            l.classList.add('font-normal', 'text-gray-500');
        });

        let target = activeLink;
        if (!target) {
            const path = window.location.pathname.split('/').pop() || 'about.html';
            links.forEach(link => {
                if (link.getAttribute('href') === path) target = link;
            });
        }
        
        if (target) {
            target.classList.remove('font-normal', 'text-gray-500');
            target.classList.add('font-extrabold', 'text-gray-900');
            const w = target.offsetWidth;
            const l = target.offsetLeft;
            highlight.style.width = `${w}px`;
            highlight.style.left = `${l}px`;
            highlight.style.opacity = '1';
            void highlight.offsetWidth; 
            setTimeout(() => { highlight.classList.add('enable-transition'); }, 100);
        }
    }
    initNavigation();

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if(!href) return;
            e.preventDefault();
            if (highlight) {
                highlight.classList.add('enable-transition'); 
                highlight.style.width = `${link.offsetWidth}px`;
                highlight.style.left = `${link.offsetLeft}px`;
            }
            links.forEach(l => {
                l.classList.remove('font-extrabold', 'text-gray-900');
                l.classList.add('font-normal', 'text-gray-500');
            });
            link.classList.remove('font-normal', 'text-gray-500');
            link.classList.add('font-extrabold', 'text-gray-900');
            sessionStorage.setItem('cursorPos', JSON.stringify({ x: mouseX, y: mouseY }));
            setTimeout(() => { window.location.href = href; }, 300); 
        });
    });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    const savedCursor = sessionStorage.getItem('cursorPos');
    if (savedCursor) {
        try { const pos = JSON.parse(savedCursor); mouseX = pos.x; mouseY = pos.y; } catch(e) {}
        sessionStorage.removeItem('cursorPos');
    }
    let cursorX = mouseX;
    let cursorY = mouseY;

    if(cursor) {
        cursor.style.transition = 'none'; 
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        cursor.style.opacity = '1'; 
        if(cursorText) cursorText.textContent = "";
        setTimeout(() => { cursor.style.transition = ''; }, 100);
    }
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

    function animateCursor() {
        if(!cursor) return;
        const speed = 0.25;
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // --- HOVER LOGIC (ABOUT) ---
    // A. Volunteer Cards -> "VIEW DETAIL"
    const volunteerCards = document.querySelectorAll('.grid .group');
    volunteerCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if(cursor && cursorText) {
                cursor.classList.add('hover-project');
                cursorText.textContent = "VIEW DETAIL"; 
                cursorText.style.opacity = '1';
                cursorText.style.display = 'block';
            }
        });
        card.addEventListener('mouseleave', () => {
            if(cursor && cursorText) {
                cursor.classList.remove('hover-project');
                cursorText.textContent = "";
                cursorText.style.opacity = '0';
            }
        });
    });

    // B. Link Biasa -> Reset Normal
    const interactiveElements = document.querySelectorAll('a, button, .nav-item');
    interactiveElements.forEach(el => {
        if(el.closest('.group')) return;
        el.addEventListener('mouseenter', () => {
            if(cursor) {
                cursor.classList.remove('hover-project');
                if(cursorText) { cursorText.textContent = ""; cursorText.style.opacity = '0'; }
            }
        });
    });

    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;
    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            hamburgerBtn.setAttribute('data-open', isMenuOpen);
            if(isMenuOpen) { mobileMenu.classList.remove('hidden-menu'); mobileMenu.classList.add('visible-menu'); } 
            else { mobileMenu.classList.remove('visible-menu'); mobileMenu.classList.add('hidden-menu'); }
        });
    }
    const mainContent = document.querySelector('main .animate-fade-in-up');
    if (mainContent) {
        mainContent.style.animation = 'none';
        mainContent.offsetHeight; 
        mainContent.style.animation = null; 
    }
});