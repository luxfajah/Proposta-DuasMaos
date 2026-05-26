/* ==========================================================================
   MOTOR LÓGICO (TYPESCRIPT) - WEBSITE REAL PROPOSTA DUAS MÃOS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Seletores Principais da DOM com Tipagem Robusta
    const container = document.getElementById('slider-container') as HTMLElement;
    const btnPrev = document.getElementById('nav-btn-prev') as HTMLButtonElement;
    const btnNext = document.getElementById('nav-btn-next') as HTMLButtonElement;

    const paginationList = document.getElementById('pagination-list') as HTMLElement;
    const slideCounter = document.getElementById('slide-counter') as HTMLElement;
    const appLoader = document.getElementById('app-loader') as HTMLElement;

    const totalSlides = 18;
    let currentSlideIndex = 1;

    // ==========================================================================
    // 1. INICIALIZAÇÃO DA PAGINAÇÃO E CONTROLES
    // ==========================================================================

    // Gerar os bullets dinamicamente para os 18 slides
    for (let i = 1; i <= totalSlides; i++) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.className = 'pagination-bullet';
        if (i === 1) button.classList.add('active');
        button.setAttribute('data-target', i.toString());
        button.setAttribute('aria-label', `Ir para slide ${i}`);
        
        button.addEventListener('click', () => {
            scrollToSlide(i);
        });

        li.appendChild(button);
        paginationList.appendChild(li);
    }

    const bullets = document.querySelectorAll('.pagination-bullet');

    // Função de rolagem suave até o slide alvo
    function scrollToSlide(index: number) {
        const targetSlide = document.getElementById(`slide-${index}`);
        if (targetSlide) {
            targetSlide.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    // Navegação manual por cliques nas setas
    btnNext.addEventListener('click', () => {
        if (currentSlideIndex < totalSlides) {
            scrollToSlide(currentSlideIndex + 1);
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentSlideIndex > 1) {
            scrollToSlide(currentSlideIndex - 1);
        }
    });

    // ==========================================================================
    // 2. INTERSECTION OBSERVER (GATILHO DE ANIMAÇÕES E ATUALIZAÇÕES VISUAIS)
    // ==========================================================================

    const observerOptions = {
        root: container,
        threshold: 0.45, // Ativa quando quase metade da tela é ocupada
        rootMargin: '0px'
    };

    const slideSections = document.querySelectorAll('.slide-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeSlide = entry.target as HTMLElement;
                const index = parseInt(activeSlide.getAttribute('data-index') || '1');
                
                // Remove a classe ativa de todos e adiciona no slide visível
                slideSections.forEach(s => s.classList.remove('active-slide', 'in-view'));
                activeSlide.classList.add('active-slide', 'in-view');

                updateUIState(index);
            }
        });
    }, observerOptions);

    slideSections.forEach(slide => observer.observe(slide));

    // Sincroniza bullets, contador, setas e background themes
    function updateUIState(index: number) {
        currentSlideIndex = index;

        // 1. Bullets da paginação
        bullets.forEach((bullet, idx) => {
            if (idx + 1 === index) {
                bullet.classList.add('active');
            } else {
                bullet.classList.remove('active');
            }
        });

        // 2. Contador numérico superior
        const formattedIndex = String(index).padStart(2, '0');
        const formattedTotal = String(totalSlides).padStart(2, '0');
        slideCounter.textContent = `${formattedIndex} / ${formattedTotal}`;

        // 3. Bloqueio de navegação no início/fim
        btnPrev.disabled = (index === 1);
        btnNext.disabled = (index === totalSlides);

        // 4. Mudança suave na cor do background do body (efeito mesh reativo)
        updateBodyTheme(index);
    }

    // Muda a classe do body de acordo com os clusters da proposta
    function updateBodyTheme(index: number) {
        document.body.className = ''; // Reseta classes

        if (index >= 1 && index <= 5) {
            document.body.classList.add('cluster-branding');
        } else if (index >= 6 && index <= 9) {
            document.body.classList.add('cluster-services');
        } else if (index >= 10 && index <= 15) {
            document.body.classList.add('cluster-portfolio');
        } else if (index >= 16 && index <= 18) {
            document.body.classList.add('cluster-closing');
        }
    }

    // ==========================================================================
    // 3. MOTOR DE ROLAGEM HORIZONTAL DO MOUSE
    // ==========================================================================

    if (container) {
        container.addEventListener('wheel', (e: WheelEvent) => {
            // Se o scroll horizontal for predominante (ex: trackpad), respeita nativamente
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                return;
            }

            e.preventDefault();
            
            // Traduz a rotação vertical do scroll do mouse para avanço horizontal
            container.scrollLeft += e.deltaY;
        }, { passive: false });


    }

    // ==========================================================================
    // 4. INTERATIVIDADE NAS MÍDIAS DO INSTAGRAM (SLIDE 5)
    // ==========================================================================

    const likeButtons = document.querySelectorAll('.insta-like-btn');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.currentTarget as HTMLButtonElement;
            const isLiked = button.getAttribute('data-liked') === 'true';
            const likeCountSpan = button.querySelector('.like-count') as HTMLElement;
            let currentLikes = parseInt(likeCountSpan.textContent || '0');

            if (isLiked) {
                button.setAttribute('data-liked', 'false');
                button.classList.remove('liked');
                likeCountSpan.textContent = (currentLikes - 1).toString();
            } else {
                button.setAttribute('data-liked', 'true');
                button.classList.add('liked');
                likeCountSpan.textContent = (currentLikes + 1).toString();
            }
        });
    });

    // ==========================================================================
    // 5. ACESSIBILIDADE E ATALHOS DE TECLADO
    // ==========================================================================

    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            if (currentSlideIndex < totalSlides) scrollToSlide(currentSlideIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentSlideIndex > 1) scrollToSlide(currentSlideIndex - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            scrollToSlide(1);
        } else if (e.key === 'End') {
            e.preventDefault();
            scrollToSlide(totalSlides);
        }
    });

    // ==========================================================================
    // 6. REMOÇÃO DO LOADER INICIAL
    // ==========================================================================

    // Esconde o loader quando todos os elementos principais forem renderizados
    setTimeout(() => {
        if (appLoader) {
            appLoader.classList.add('fade-out');
        }
    }, 1200);
});
