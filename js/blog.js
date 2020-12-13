'use strict';

let jsonContent;

function getDateString(date, locale) {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const [year, month, day] = date.split('-');
    return new Date(year, month-1, day).toLocaleDateString(locale, dateOptions);
}

function buildBlogFromJson(json) {

    function getArticle(element, id) {
        return `<div class="post">
            <h4 class="title">
                <span id="post-${id}-title">${element.locales['pt-BR'].title}</span> - ${element.source}
            </h4>
            <h4 class="date" id="post-${id}-date">
                ${getDateString(element.date, 'pt-BR')}
            </h4>
            <h5 class="description" id="post-${id}-description">
                ${element.locales['pt-BR'].description.replaceAll('\n', '<br>')}
            </h5>
            <div class="read-more">
                <a href="${element.url}" target="_blank"><i class="fa fa-external-link"></i>&nbsp;Leia mais</a>
            </div>
        </div>`;
    }

    function getVideo(element, id) {
        let videoIframe;
        if (element.source == 'YouTube') {
            videoIframe = `<iframe src="https://www.youtube-nocookie.com/embed/${element.urlCode}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else {
            throw Error('Unsupported video source');
        }
        return `
            <div class="post">
                <h4 class="title">
                    <span id="post-${id}-title">${element.locales['pt-BR'].title}</span> - ${element.source}
                </h4>
                <h4 class="date" id="post-${id}-date">
                    ${getDateString(element.date, 'pt-BR')}
                </h4>
                <h5 class="description" id="post-${id}-description">
                    ${element.locales['pt-BR'].description.replaceAll('\n', '<br>')}
                </h5>
                <div class="video-container">
                    ${videoIframe}
                </div>
            </div>`;
    }
    
    let i = 0;
    for (const element of json.blogPosts) {
        let content;
        if (element.type == 'article') {
            content = getArticle(element, i);
        } else if (element.type == 'video') {
            content = getVideo(element, i);
        } else {
            throw Error('Unsupported blog type');
        }
        $("#blog-content").append(content);
        i++;
    }
}

function changeLanguage() {
    function updatePost(element, id, lng) {
        const localeContent = element.locales[lng];
        const title = localeContent.title;
        const description = localeContent.description.replaceAll('\n', '<br>');
        const date = getDateString(element.date, lng);

        $(`#post-${id}-title`).html(title);
        $(`#post-${id}-date`).html(date);
        $(`#post-${id}-description`).html(description);
    }

    i18next.on('languageChanged', function(lng) {
        let i = 0;
        for (const element of jsonContent.blogPosts) {
            updatePost(element, i, lng);
            i++;
        }
    });
}

function setupBlogSlider() {
    $('#blog-content').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        dots: true
    });
}

function buildBlogSection() {
    fetch("assets/blog.json")
        .then(response => response.json())
        .then(json => {
            jsonContent = json;
            buildBlogFromJson(json);
            setupBlogSlider();
            changeLanguage();
        });
}

export { buildBlogSection };