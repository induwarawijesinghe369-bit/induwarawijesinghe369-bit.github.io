/*
 * Reveal-on-scroll
 * Watches for elements with .reveal or .reveal-stagger and adds .visible
 * when they enter the viewport, triggering the CSS transitions.
 */

(function () {
    'use strict';

    // If the browser doesn't support IntersectionObserver, just show everything.
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
            el.classList.add('visible');
        });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Reveal once — no need to re-animate when scrolling back up.
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Trigger when ~15% of the element is visible
        threshold: 0.15,
        // Start animating slightly before it enters
        rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
        observer.observe(el);
    });
})();
