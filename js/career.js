'use strict';

import { startTimeline } from './vertical-timeline.js';

function buildCareerFromJson(json) {

    function getDateString(date) {
        if (date.indexOf('-') === -1) {
            return date;
        }

        const dateOptions = { year: 'numeric', month: 'short'};
        const [year, month] = date.split('-');
        return new Date(year, month-1).toLocaleDateString('pt-BR', dateOptions);
    }

    function validateType(type) {
        return ['work', 'education', 'voluntary'].indexOf(type) !== -1;
    }

    function getCode(element) {
        let iconWord;

        switch (element.type) {
            case 'work': iconWord = 'work'; break;
            case 'education': iconWord = 'school'; break;
            case 'voluntary': iconWord = 'group'; break;
        }

        const periodString = getDateString(element.start) + ' - ' + getDateString(element.end);

        return `
            <div class="cd-timeline__block">
                <div class="cd-timeline__img cd-timeline__img--${element.type}">
                    <i class="material-icons">${iconWord}</i>
                </div>

                <div class="cd-timeline__content">
                    <h3>${element.position}</h3>
                    <div class="flex justify-between items-center">
                        <span class="cd-timeline__date">${periodString}</span>
                    </div>
                    <p class="color-contrast-medium">${element.location}</p>
                    <p class="color-contrast-medium long-description">${element.longDescription.replaceAll('\n', '<br>')}</p>
                </div>
            </div>`;
    }

    for (const element of json.career) {
        if (!validateType(element.type)) {
            throw Error('Unsupported career type');
        }
        $("#timeline-container").append(getCode(element));
    }
}

function buildCareerSection() {
    fetch("../assets/career.json")
        .then(response => response.json())
        .then(json => {
            buildCareerFromJson(json);
            startTimeline();
        });
}

export { buildCareerSection };