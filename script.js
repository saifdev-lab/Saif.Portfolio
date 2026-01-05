document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SHARED STATE MANAGER (NAVIGASI) ---
    const highlight = document.getElementById('nav-highlight');
    const links = document.querySelectorAll('.nav-transition-link');
    const cursor = document.getElementById('custom-cursor');
    const cursorText = document.getElementById('cursor-text'); 

    function initNavigation() {
        if (!highlight) return;

        // Reset text styles
        links.forEach(l => {
            l.classList.remove('font-extrabold', 'text-gray-900');
            l.classList.add('font-normal', 'text-gray-500');
        });

        // Deteksi halaman aktif
        const activeLink = document.querySelector('.active-link') || links[0];
        
        if (activeLink) {
            activeLink.classList.remove('font-normal', 'text-gray-500');
            activeLink.classList.add('font-extrabold', 'text-gray-900');

            const w = activeLink.offsetWidth;
            const l = activeLink.offsetLeft;

            highlight.style.width = `${w}px`;
            highlight.style.left = `${l}px`;
            highlight.style.opacity = '1';
            
            void highlight.offsetWidth; 

            setTimeout(() => {
                highlight.classList.add('enable-transition');
            }, 100);
        }
    }
    initNavigation();

    // Event Listener Navigasi
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
            
            setTimeout(() => {
                window.location.href = href;
            }, 300); 
        });
    });


    // --- 2. LOGIKA PERGERAKAN KURSOR ---
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    const savedCursor = sessionStorage.getItem('cursorPos');
    if (savedCursor) {
        try {
            const pos = JSON.parse(savedCursor);
            mouseX = pos.x;
            mouseY = pos.y;
        } catch(e) {}
        sessionStorage.removeItem('cursorPos');
    }

    let cursorX = mouseX;
    let cursorY = mouseY;

    if(cursor) {
        cursor.style.transition = 'none'; 
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        cursor.style.opacity = '1'; 
        if(cursorText) cursorText.textContent = ""; 

        setTimeout(() => {
            cursor.style.transition = '';
        }, 100);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        if(!cursor) return;
        const speed = 0.25;
        
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();


    // --- 3. LOGIKA HOVER TEXT (UPDATED) ---
    
    // A. KARTU PROJECT -> Cek apakah VIEW PROJECT atau COMING SOON
    const projectCards = document.querySelectorAll('main .grid .group');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if(cursor && cursorText) {
                // Cek atribut data-status dari HTML
                const isLocked = card.getAttribute('data-status') === 'locked';

                if (isLocked) {
                    // Logika untuk Coming Soon (Hitam/Abu)
                    cursor.classList.add('hover-locked'); 
                    cursorText.textContent = "COMING SOON";
                } else {
                    // Logika untuk View Project (Biru)
                    cursor.classList.add('hover-project'); 
                    cursorText.textContent = "VIEW PROJECT"; 
                }

                cursorText.style.opacity = '1';
                cursorText.style.display = 'block';
            }
        });

        card.addEventListener('mouseleave', () => {
            if(cursor && cursorText) {
                // Hapus kedua class agar bersih saat keluar
                cursor.classList.remove('hover-project');
                cursor.classList.remove('hover-locked');
                
                cursorText.textContent = "";
                cursorText.style.opacity = '0';
            }
        });
    });

    // B. LINK BIASA -> Reset ke Normal
    const interactiveElements = document.querySelectorAll('a, button, .nav-item');
    
    interactiveElements.forEach(el => {
        if(el.closest('.group')) return; // Jangan override logic kartu di atas

        el.addEventListener('mouseenter', () => {
            if(cursor) {
                cursor.classList.remove('hover-project');
                cursor.classList.remove('hover-locked');
                if(cursorText) {
                    cursorText.textContent = "";
                    cursorText.style.opacity = '0';
                }
            }
        });
    });

    // --- 4. MOBILE MENU ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    if (hamburgerBtn && mobileMenu) {
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
});