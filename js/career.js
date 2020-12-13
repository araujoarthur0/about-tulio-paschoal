'use strict';

import { startTimeline } from './vertical-timeline.js';

let jsonContent;

function getPresentString(locale) {
    if (locale == 'pt-BR') {
        return 'Presente';
    } else {
        return 'Present';
    }
}

function getDateString(date, locale) {
    if (date.indexOf('-') === -1) {
        return date;
    }

    const dateOptions = { year: 'numeric', month: 'short'};
    const [year, month] = date.split('-');
    return new Date(year, month-1).toLocaleDateString(locale, dateOptions);
}

function buildCareerFromJson(json) {

    function validateType(type) {
        return ['work', 'education', 'voluntary'].indexOf(type) !== -1;
    }

    function getCode(element, id) {
        let iconWord;

        switch (element.type) {
            case 'work': iconWord = 'work'; break;
            case 'education': iconWord = 'school'; break;
            case 'voluntary': iconWord = 'group'; break;
        }

        const defaultLocale = 'pt-BR';

        const endString = 'end' in element ? getDateString(element.end) : getPresentString(defaultLocale); 
        const periodString = getDateString(defaultLocale, element.start) + ' - ' + endString;

        return `
            <div class="cd-timeline__block">
                <div class="cd-timeline__img cd-timeline__img--${element.type}">
                    <i class="material-icons">${iconWord}</i>
                </div>

                <div class="cd-timeline__content">
                    <h3 id="career-${id}-position">${element.locales[defaultLocale].position}</h3>
                    <div class="flex justify-between items-center">
                        <span class="cd-timeline__date" id="career-${id}-period">${periodString}</span>
                    </div>
                    <p class="color-contrast-medium" id="career-${id}-location">${element.locales[defaultLocale].location}</p>
                    <p class="color-contrast-medium long-description" id="career-${id}-long-description">
                        ${element.locales[defaultLocale].longDescription.replaceAll('\n', '<br>')}
                    </p>
                </div>
            </div>`;
    }

    let i = 0;
    for (const element of json.career) {
        if (!validateType(element.type)) {
            throw Error('Unsupported career type');
        }
        $("#timeline-container").append(getCode(element, i));
        i++;
    }
}

function changeLanguage() {
    function updateCareer(element, id, lng) {
        const localeContent = element.locales[lng];
        const position = localeContent.position;
        const location = localeContent.location;
        const longDescription = localeContent.longDescription.replaceAll('\n', '<br>');

        const endString = 'end' in element ? getDateString(element.end) : getPresentString(lng); 
        const periodString = getDateString(element.start, lng) + ' - ' + endString;

        $(`#career-${id}-position`).html(position);
        $(`#career-${id}-location`).html(location);
        $(`#career-${id}-period`).html(periodString);
        $(`#career-${id}-long-description`).html(longDescription);
    }

    i18next.on('languageChanged', function(lng) {
        let i = 0;
        for (const element of jsonContent.career) {
            updateCareer(element, i, lng);
            i++;
        }
    });
}

function buildCareerSection() {
    fetch("assets/career.json")
        .then(response => response.json())
        .then(json => {
            jsonContent = json;
            buildCareerFromJson(json);
            startTimeline();
            changeLanguage();
        });
}

export { buildCareerSection };