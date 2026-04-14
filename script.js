// ===== AXION MOVE — SCRIPT FINAL =====

document.addEventListener('DOMContentLoaded', function () {

    // ===== 1. LOADING SCREEN =====
    const loadingScreen = document.getElementById('loadingScreen');
    const START = Date.now();
    function hideLoader() {
        const delay = Math.max(0, 1600 - (Date.now() - START));
        setTimeout(() => loadingScreen?.classList.add('hidden'), delay);
    }
    document.readyState === 'complete' ? hideLoader() : window.addEventListener('load', hideLoader);

    // ===== 2. CUSTOM CURSOR =====
    const cursor = document.getElementById('customCursor');
    const trail = document.getElementById('cursorTrail');
    if (cursor && trail && window.innerWidth > 768) {
        let mx = 0, my = 0, tx = 0, ty = 0;
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cursor.style.left = mx + 'px';
            cursor.style.top = my + 'px';
        });
        function animTrail() {
            tx += (mx - tx) * 0.12;
            ty += (my - ty) * 0.12;
            trail.style.left = tx + 'px';
            trail.style.top = ty + 'px';
            requestAnimationFrame(animTrail);
        }
        animTrail();
        document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; trail.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; trail.style.opacity = '1'; });
    }

    // ===== 3. SCROLL PROGRESS BAR =====
    const progressBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        if (!progressBar) return;
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (scrolled / total * 100) + '%';
    }, { passive: true });

    // ===== 4. DARK MODE =====
    const html = document.documentElement;
    const darkToggle = document.getElementById('darkToggle');
    const darkToggleMobile = document.getElementById('darkToggleMobile');
    const darkIcon = document.getElementById('darkIcon');

    function setTheme(dark) {
        html.setAttribute('data-theme', dark ? 'dark' : 'light');
        localStorage.setItem('axion-theme', dark ? 'dark' : 'light');
        if (darkIcon) darkIcon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
        document.querySelectorAll('.dark-toggle i').forEach(i => {
            i.className = dark ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    const savedTheme = localStorage.getItem('axion-theme');
    if (savedTheme === 'dark') setTheme(true);

    function toggleTheme() { setTheme(html.getAttribute('data-theme') !== 'dark'); }
    darkToggle?.addEventListener('click', toggleTheme);
    darkToggleMobile?.addEventListener('click', toggleTheme);

    // ===== 5. ANNOUNCEMENT BAR =====
    document.getElementById('closeAnnouncement')?.addEventListener('click', () => {
        document.getElementById('announcementBar')?.classList.add('hidden');
    });

    // ===== 6. PARTICLES =====
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const colors = ['#0052cc', '#00d4ff', '#4d7fff', '#60a5fa'];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = document.body.scrollHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });

        function createParticles() {
            const count = Math.floor((window.innerWidth * window.innerHeight) / 18000);
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 3 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: Math.random() * 0.15 + 0.05,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
            }));
        }
        createParticles();

        function animParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            });
            ctx.globalAlpha = 1;
            requestAnimationFrame(animParticles);
        }
        animParticles();
    }

    // ===== 7. HAMBURGER =====
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu?.classList.toggle('open');
    });
    mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        mobileMenu.classList.remove('open');
    }));

    // ===== 8. SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });

    // ===== 9. HEADER ON SCROLL =====
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (!header) return;
        if (window.scrollY > 100) { header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; }
        else { header.style.boxShadow = 'none'; }
    }, { passive: true });

    // ===== 10. PARALLAX HERO IMAGE =====
    const heroImage = document.getElementById('heroImg');
    if (heroImage && window.innerWidth > 768) {
        document.addEventListener('mousemove', e => {
            const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx * 12;
            const dy = (e.clientY - cy) / cy * 8;
            heroImage.style.transform = `translate(${dx}px, ${dy}px)`;
        });
    }

    // ===== 11. COUNTDOWN =====
    const targetDate = new Date('2026-12-31T00:00:00').getTime();
    function updateCountdown() {
        const diff = targetDate - Date.now();
        if (diff <= 0) return;
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        const el = (id, val, pad) => { const e = document.getElementById(id); if (e) e.textContent = String(val).padStart(pad, '0'); };
        el('cd-days', days, 3);
        el('cd-hours', hours, 2);
        el('cd-mins', mins, 2);
        el('cd-secs', secs, 2);
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ===== 12. STAT COUNTERS =====
    const statNums = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            const duration = 1800;
            const step = Math.ceil(target / (duration / 16));
            let current = 0;
            const timer = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = current;
                if (current >= target) clearInterval(timer);
            }, 16);
            statsObserver.unobserve(el);
        });
    }, { threshold: 0.5 });
    statNums.forEach(el => statsObserver.observe(el));

    // ===== 13. GALLERY + LIGHTBOX =====
    const galleryData = [
        { src: 'Ap- Subindo a escada.png', label: 'Subindo Escadas' },
        { src: 'AP- Rodas.png',            label: 'Tecnologia das Rodas' },
        { src: 'AP- Parada.png',           label: 'Com Objetos' },
        { src: 'Ap- Ambinete Office.png',  label: 'Ambiente Office' },
    ];
    const lightbox = document.getElementById('lightbox');
    const lbContent = document.getElementById('lightboxContent');
    const lbCounter = document.getElementById('lightboxCounter');
    let lbIndex = 0;

    function renderLB() {
        const d = galleryData[lbIndex];
        if (!lbContent || !d) return;
        lbContent.style.background = '#000';
        lbContent.innerHTML = `
            <div style="width:100%;height:100%;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                <img src="${d.src}" alt="${d.label}" style="max-width:100%;max-height:calc(100% - 50px);object-fit:contain;border-radius:1rem;display:block;">
                <p style="position:absolute;bottom:0.8rem;left:0;right:0;text-align:center;color:rgba(255,255,255,.8);font-family:'Poppins',sans-serif;font-weight:600;font-size:.95rem;">${d.label}</p>
            </div>`;
        if (lbCounter) lbCounter.textContent = `${lbIndex + 1} / ${galleryData.length}`;
    }

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => { lbIndex = parseInt(item.dataset.index); renderLB(); lightbox?.classList.add('open'); document.body.style.overflow = 'hidden'; });
    });

    function closeLB() {
        lightbox?.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.getElementById('lightboxClose')?.addEventListener('click', closeLB);
    document.querySelector('.lightbox-backdrop')?.addEventListener('click', closeLB);
    document.getElementById('lightboxPrev')?.addEventListener('click', () => {
        lbIndex = (lbIndex - 1 + galleryData.length) % galleryData.length;
        renderLB();
    });
    document.getElementById('lightboxNext')?.addEventListener('click', () => {
        lbIndex = (lbIndex + 1) % galleryData.length;
        renderLB();
    });

    // ===== 14. VIDEO MODAL =====
    const videoModal = document.getElementById('videoModal');
    document.getElementById('openVideoBtn')?.addEventListener('click', () => { videoModal?.classList.add('open'); document.body.style.overflow = 'hidden'; });
    function closeVideo() { videoModal?.classList.remove('open'); document.body.style.overflow = ''; }
    document.getElementById('videoClose')?.addEventListener('click', closeVideo);
    document.getElementById('videoBackdrop')?.addEventListener('click', closeVideo);

    // ===== 15. FAQ =====
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const open = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!open) item.classList.add('active');
        });
    });

    // ===== 16. SUCCESS MODAL =====
    const successModal = document.getElementById('successModal');
    function openSuccess(title, msg) {
        const t = document.getElementById('successTitle');
        const m = document.getElementById('successMessage');
        if (t) t.textContent = title;
        if (m) m.textContent = msg;
        successModal?.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeSuccess() { successModal?.classList.remove('open'); document.body.style.overflow = ''; }
    document.getElementById('successClose')?.addEventListener('click', closeSuccess);
    document.querySelector('.success-modal-backdrop')?.addEventListener('click', closeSuccess);

    // ===== 17. CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    contactForm?.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const message = document.getElementById('message')?.value.trim();
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!name || !email || !message) {
            contactForm.querySelectorAll('input,textarea').forEach(f => { if (!f.value.trim()) { f.style.borderColor = '#ef4444'; f.style.boxShadow = '0 0 0 3px rgba(239,68,68,.1)'; } });
            return;
        }
        if (!emailRe.test(email)) {
            const ef = document.getElementById('email');
            if (ef) { ef.style.borderColor = '#ef4444'; ef.style.boxShadow = '0 0 0 3px rgba(239,68,68,.1)'; }
            return;
        }
        openSuccess('Mensagem Enviada!', `Obrigado pelo contacto, ${name}! Vamos responder em breve.`);
        contactForm.reset();
        contactForm.querySelectorAll('input,textarea').forEach(f => { f.style.borderColor = ''; f.style.boxShadow = ''; });
    });
    contactForm?.querySelectorAll('input,textarea').forEach(f => f.addEventListener('input', () => { f.style.borderColor = ''; f.style.boxShadow = ''; }));

    // ===== 18. PRE-REGISTER FORM =====
    document.getElementById('preregisterForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('prereg-name')?.value.trim();
        const email = document.getElementById('prereg-email')?.value.trim();
        if (!name || !email) return;
        openSuccess('Lugar Garantido! 🎉', `Obrigado, ${name}! Vais ser um dos primeiros a receber a Axion Pro com desconto exclusivo.`);
        this.reset();
    });

    // ===== 19. SCROLL ANIMATIONS =====
    const scrollObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('animate'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.feature-card, .step-card, .spec-item, .contact-card, .testimonial-card, .gallery-item, .faq-item, .pricing-card, .trust-badge, .stat-item, .perk').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(22px)';
        el.style.transition = `opacity 0.55s ease ${(i % 5) * 0.08}s, transform 0.55s ease ${(i % 5) * 0.08}s`;
        scrollObserver.observe(el);
    });

    // ===== 20. HERO BUTTONS =====
    document.querySelector('.btn-primary')?.addEventListener('click', () => {
        document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
    });
    document.querySelector('.btn-nav')?.addEventListener('click', () => {
        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    });

    // ===== 21. BACK TO TOP =====
    const btt = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        btt?.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ===== 22. KEYBOARD EVENTS =====
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeLB(); closeVideo(); closeSuccess(); document.body.style.overflow = ''; }
        if (lightbox?.classList.contains('open')) {
            if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + galleryData.length) % galleryData.length; renderLB(); }
            if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % galleryData.length; renderLB(); }
        }
    });

    // ===== 23. HERO IMAGE FALLBACK =====
    document.querySelector('.hero-image img')?.addEventListener('error', function () {
        this.style.display = 'none';
        const fb = document.createElement('div');
        fb.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;';
        fb.innerHTML = `<svg viewBox="0 0 300 300" width="260" height="260" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#0052cc"/><stop offset="100%" style="stop-color:#00d4ff"/></linearGradient></defs><rect x="60" y="80" width="180" height="100" rx="12" fill="url(#g1)" opacity=".9"/><circle cx="100" cy="210" r="25" fill="url(#g1)"/><circle cx="200" cy="210" r="25" fill="url(#g1)"/><rect x="130" y="170" width="40" height="50" rx="6" fill="rgba(255,255,255,.2)"/><text x="150" y="138" text-anchor="middle" fill="white" font-family="Poppins,sans-serif" font-weight="700" font-size="13">AXION PRO</text></svg>`;
        this.parentNode.appendChild(fb);
    });

    // ===== VIDEO PLAYER — ESPECIFICAÇÕES =====
    const video       = document.getElementById('specsVideo');
    const overlay     = document.getElementById('specsVideoOverlay');
    const playBtn     = document.getElementById('specsPlayBtn');
    const controls    = document.getElementById('specsVideoControls');
    const svcPlayPause = document.getElementById('svcPlayPause');
    const svcPlayIcon  = document.getElementById('svcPlayIcon');
    const svcProgress  = document.getElementById('svcProgressBar');
    const svcWrap      = document.getElementById('svcProgressWrap');
    const svcTime      = document.getElementById('svcTime');
    const svcMute      = document.getElementById('svcMute');
    const svcMuteIcon  = document.getElementById('svcMuteIcon');
    const svcFullscreen = document.getElementById('svcFullscreen');

    if (video) {
        // Formata tempo mm:ss
        function fmtTime(s) {
            const m = Math.floor(s / 60);
            return m + ':' + String(Math.floor(s % 60)).padStart(2, '0');
        }

        // Botão grande de play no overlay
        playBtn?.addEventListener('click', () => {
            video.play();
            overlay?.classList.add('hidden');
            controls?.classList.add('visible');
        });

        // Clique no próprio vídeo: toggle play/pause
        video.addEventListener('click', () => {
            if (video.paused) { video.play(); }
            else { video.pause(); }
        });

        // Play/Pause botão nos controlos
        svcPlayPause?.addEventListener('click', () => {
            if (video.paused) { video.play(); }
            else { video.pause(); }
        });

        video.addEventListener('play', () => {
            if (svcPlayIcon) svcPlayIcon.className = 'fas fa-pause';
        });
        video.addEventListener('pause', () => {
            if (svcPlayIcon) svcPlayIcon.className = 'fas fa-play';
        });

        // Quando o vídeo acaba — volta ao overlay
        video.addEventListener('ended', () => {
            overlay?.classList.remove('hidden');
            controls?.classList.remove('visible');
            if (svcPlayIcon) svcPlayIcon.className = 'fas fa-play';
            video.currentTime = 0;
        });

        // Barra de progresso
        video.addEventListener('timeupdate', () => {
            if (!video.duration) return;
            const pct = (video.currentTime / video.duration) * 100;
            if (svcProgress) svcProgress.style.width = pct + '%';
            if (svcTime) svcTime.textContent = fmtTime(video.currentTime) + ' / ' + fmtTime(video.duration);
        });

        // Clique na barra de progresso para saltar
        svcWrap?.addEventListener('click', e => {
            const rect = svcWrap.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            video.currentTime = ratio * video.duration;
        });

        // Mudo
        svcMute?.addEventListener('click', () => {
            video.muted = !video.muted;
            if (svcMuteIcon) svcMuteIcon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        });

        // Ecrã inteiro
        svcFullscreen?.addEventListener('click', () => {
            const container = video.closest('.specs-video');
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                container?.requestFullscreen?.();
            }
        });
    }

    console.log('✅ Axion Move — tudo carregado!');
});
