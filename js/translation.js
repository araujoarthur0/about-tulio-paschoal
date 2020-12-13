'use strict';

function setupLanguages() {
    i18next.use(i18nextHttpBackend).init({
        lng: 'pt-BR',
        backend: {
            loadPath: 'locales/{{lng}}.json'
        }
    }, function (err, t) {
        jqueryI18next.init(i18next, $);

        $('html').localize();
    });

    $('.i18n-item').on('click', function() {
        const locale = $(this).attr('data-locale');
        i18next.changeLanguage(locale, function () {
            $('html').localize();
        });
    });
}

export { setupLanguages };