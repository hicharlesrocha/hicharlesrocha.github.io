/* ============================================================
   hicharles.com.br — comportamento da página
   Carregado no fim do <body>: o DOM já existe quando roda.
   ============================================================ */

(function () {
    'use strict';

    var root = document.getElementById('root');
    if (!root) return;

    /* ---------- ano do rodapé ---------- */

    var yearEl = root.querySelector('[data-year]');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- alternância pt/en ----------
       Cada elemento traduzível carrega o texto em inglês no atributo
       data-en; o português original é guardado em data-pt na primeira
       troca, para poder voltar. */

    var lang = 'pt';
    var btn = root.querySelector('[data-langbtn]');

    function setLang(next) {
        lang = next;
        root.querySelectorAll('[data-en]').forEach(function (el) {
            if (el.dataset.pt === undefined) el.dataset.pt = el.textContent;
            el.textContent = next === 'en' ? el.dataset.en : el.dataset.pt;
        });
        document.documentElement.lang = next === 'en' ? 'en' : 'pt-BR';
        if (btn) {
            btn.textContent = next === 'en' ? 'PT' : 'EN';
            btn.setAttribute('aria-label', next === 'en' ? 'Mudar para português' : 'Switch to English');
        }
    }

    if (btn) {
        btn.addEventListener('click', function () {
            setLang(lang === 'en' ? 'pt' : 'en');
        });
    }

    /* ---------- reveal ao rolar ----------
       O estado inicial (invisível) é aplicado por JS de propósito: sem
       JS, nada é escondido e o conteúdo aparece normalmente. */

    var els = Array.prototype.slice.call(root.querySelectorAll('[data-reveal]'));
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduced && 'IntersectionObserver' in window) {
        els.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(18px)';
            el.style.transition = 'opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1)';
        });

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                var i = els.indexOf(e.target);
                e.target.style.transitionDelay = (Math.min(i % 6, 5) * 65) + 'ms';
                e.target.style.opacity = '1';
                e.target.style.transform = 'none';
                io.unobserve(e.target);
            });
        }, {threshold: 0.12, rootMargin: '0px 0px -6% 0px'});

        els.forEach(function (el) {
            io.observe(el);
        });
    }
})();
