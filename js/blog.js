function buildBlogFromJson(json) {

    function getDateString(date) {
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const [year, month, day] = date.split('-');
        return new Date(year, month-1, day).toLocaleDateString('pt-BR', dateOptions);
    }

    function getArticle(element) {
        return `<div class="post">
            <h4 class="title">
                ${element.title} - ${element.source}
            </h4>
            <h4 class="date">
                ${getDateString(element.date)}
            </h4>
            <h5 class="description">
                ${element.description.replaceAll('\n', '<br>')}
            </h5>
            <div class="read-more">
                <a href="${element.url}" target="_blank"><i class="fa fa-external-link"></i>&nbsp;Leia mais</a>
            </div>
        </div>`;
    }

    function getVideo(element) {
        let videoIframe;
        if (element.source == 'YouTube') {
            videoIframe = `<iframe src="https://www.youtube-nocookie.com/embed/${element.urlCode}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else {
            throw Error('Unsupported video source');
        }
        return `
            <div class="post">
                <h4 class="title">
                    ${element.title} - ${element.source}
                </h4>
                <h4 class="date">
                    ${getDateString(element.date)}
                </h4>
                <h5 class="description">
                    ${element.description.replaceAll('\n', '<br>')}
                </h5>
                <div class="video-container">
                    ${videoIframe}
                </div>
            </div>`;
    }

    for (const element of json.blogPosts) {
        let content;
        if (element.type == 'article') {
            content = getArticle(element);
        } else if (element.type == 'video') {
            content = getVideo(element);
        } else {
            throw Error('Unsupported blog type');
        }
        $("#blog-content").append(content);
    }
}

function buildBlogSection() {
    fetch("../assets/blog.json")
        .then(response => response.json())
        .then(json => {
            buildBlogFromJson(json);
            setupBlogSlider();
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

export { buildBlogSection };