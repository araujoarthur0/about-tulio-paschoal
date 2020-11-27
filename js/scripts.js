'use sctrict';

import { buildBlogSection } from './blog.js';
import { buildCareerSection } from './career.js';

/**
 * Make Header anchor links scroll smoothly
 */
function activateSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

function setupContactButton() {
    $('#button-contact').on('click', () => {
        window.open(`mailto:araujoarthur0@hotmail.com?subject=${$('#contact-subject').val()}&body=${$('#contact-message').val()}`);
    });
}

$(() => {
    activateSmoothScroll();
    setupContactButton();
    buildBlogSection();
    buildCareerSection();
});