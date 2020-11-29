'use strict';

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

function shuffleArray(originalArray) {
    let array = Array.from(originalArray);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const icons = ['amusement-park-1.svg',
    'amusement-park-2.svg',
    'amusement-park-3.svg',
    'amusement-park-4.svg',
    'amusement-park-5.svg',
    'amusement-park-6.svg',
    'amusement-park-7.svg',
    'amusement-park-8.svg',
    'amusement-park.svg',
    'childhood-1.svg',
    'childhood-10.svg',
    'childhood-11.svg',
    'childhood-12.svg',
    'childhood-13.svg',
    'childhood-14.svg',
    'childhood-15.svg',
    'childhood-16.svg',
    'childhood-17.svg',
    'childhood-18.svg',
    'childhood-19.svg',
    'childhood-2.svg',
    'childhood-20.svg',
    'childhood-21.svg',
    'childhood-22.svg',
    'childhood-23.svg',
    'childhood-24.svg',
    'childhood-25.svg',
    'childhood-26.svg',
    'childhood-27.svg',
    'childhood-3.svg',
    'childhood-4.svg',
    'childhood-5.svg',
    'childhood-6.svg',
    'childhood-7.svg',
    'childhood-8.svg',
    'childhood-9.svg',
    'childhood.svg',
    'climb.svg',
    'fun.svg',
    'goalkeeper.svg',
    'playground-1.svg',
    'playground-2.svg',
    'playground-3.svg',
    'playground-4.svg',
    'playground-5.svg',
    'playground.svg',
    'sailing-boat.svg',
    'skater.svg',
    'soccer-field.svg',
    'sports-ball.svg'];

function getIconPath(icon) {
    return '../assets/projects/playground/' + icon;
}

function getProjectIconPath(icon) {
    return '../assets/projects/icons/' + icon;
}

const positioning = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

function getRandomPositioning() {
    return positioning.random();
}

function getItemStyle(topIndex, leftIndex, elementsPerLine, blockHeight) {

    // if < 50, left %, else right %
    const horizontalPercentage = leftIndex/elementsPerLine * 100;
    const width = 1/elementsPerLine * 100;
    const itemTop = topIndex * blockHeight;

    let itemStyle = `height: ${blockHeight*0.95}px; width: ${width*0.95}%; top: ${itemTop}px;`;

    itemStyle += `left: ${horizontalPercentage}%;`;

    return itemStyle;
}

function getProjectPlaygroundElementCode(project, shuffledIcons, topIndex, leftIndex, elementsPerLine, blockHeight) {
    const randomIconPath = getIconPath(shuffledIcons.pop());
    const projectIconPath = getProjectIconPath(project.icon);
    const iconPosition = getRandomPositioning();
    const itemStyle = getItemStyle(topIndex, leftIndex, elementsPerLine, blockHeight);

    return `
        <div class='playground-item playground-${iconPosition}' style="${itemStyle}" data-project="${project.user}-${project.repo}">
            <img class='playground-icon' src='${randomIconPath}'></img>
            <img class='project-icon' src='${projectIconPath}'></img>
        </div>`;
}

function getRandomPlaygroundIconStyle() {

    const horizontalPercentage = Math.random() * 100;
    const verticalPercentage = Math.random() * 100;

    let itemStyle;

    if (horizontalPercentage < 50) {
        itemStyle = `left: ${horizontalPercentage}%;`;
    }
    else {
        itemStyle = `right: ${100-horizontalPercentage}%;`;
    }

    if (verticalPercentage < 50) {
        itemStyle += `top: ${verticalPercentage}%;`;
    }
    else {
        itemStyle += `bottom: ${100-verticalPercentage}%;`;
    }

    return itemStyle;
}

function getRandomPlaygroundElementCode(shuffledIcons, topIndex, leftIndex, elementsPerLine, blockHeight) {
    const randomIconPath = getIconPath(shuffledIcons.pop());
    const itemStyle = getItemStyle(topIndex, leftIndex, elementsPerLine, blockHeight);
    const iconStyle = getRandomPlaygroundIconStyle();

    return `
        <div class='playground-random-item' style="${itemStyle}">
            <img style="${iconStyle}" class='playground-icon' src='${randomIconPath}'></img>
        </div>`;
}

function buildPlayground(projects) {
    const playgroundHeight = Number($("#playground").css('height').split('px')[0]);
    const elementsPerLine = projects.length;
    const blockHeight = playgroundHeight / elementsPerLine;

    let shuffledIcons = shuffleArray(icons);
    while (shuffledIcons.length < elementsPerLine**2) {
        const moreShuffledIcons = shuffleArray(icons);
        shuffledIcons.push(...moreShuffledIcons);
    }
    const leftIndexes = shuffleArray([...Array(elementsPerLine).keys()]); // generates an array from 0 to length - 1

    let topIndex = 0;
    let playgroundContent = '';
    for (const project of projects) {
        const projectLeftIndex = leftIndexes.pop();

        for (let i = 0; i < elementsPerLine; i++) {
            if (i == projectLeftIndex) {
                playgroundContent += getProjectPlaygroundElementCode(project, shuffledIcons, topIndex, i, elementsPerLine, blockHeight);
            }
            else {
                const chanceToDraw = Math.random() > 0;
                if (chanceToDraw) {
                    playgroundContent += getRandomPlaygroundElementCode(shuffledIcons, topIndex, i, elementsPerLine, blockHeight);
                }
            }
        }

        topIndex++;
    }

    $("#playground").append(playgroundContent);
}

function getInformationCode(project) {
    const projectIconPath = getProjectIconPath(project.icon);
    return `
        <div class='project-information-content' id="${project.user}-${project.repo}">
            <h2 class='title'>
                ${project.title}
            </h2>
            <div class='project-information-img'>
                <a href="https://github.com/${project.user}/${project.repo}"><img src='${projectIconPath}'></img></a>
            </div>
            <p>
                ${project.description}
            </p>
            <div class='project-information-gh-buttons'>
                <iframe src="https://ghbtns.com/github-btn.html?user=${project.user}&repo=${project.repo}&type=star&count=true&size=large" frameborder="0" scrolling="0" width="150" height="30" title="GitHub"></iframe>
                <iframe src="https://ghbtns.com/github-btn.html?user=${project.user}&repo=${project.repo}&type=fork&count=true&size=large" frameborder="0" scrolling="0" width="150" height="30" title="GitHub"></iframe>
            </div>
        </div>`;
}

function buildInformation(projects) {
    for (const project of projects) {
        $("#information").append(getInformationCode(project));
    }
}

function buildProjectsFromJson(json) {
    buildPlayground(json.projects);
    buildInformation(json.projects);

    $('.project-information-content').hide();
    $('.project-information-content:first-of-type').show();

    let readyToChange = true;
    $('.playground-item').on('mouseover', function () {
        if (readyToChange) {
            readyToChange = false;
            const hoveredProject = $(this).attr('data-project');
            const isShown = $(`#${hoveredProject}`).is(":visible");
            if (!isShown) {
                $('.project-information-content:visible').fadeOut(300, () => {
                    $(`#${hoveredProject}`).fadeIn(300);
                    readyToChange = true;
                });
            }
            else {
                readyToChange = true;
            }
        }
    });
}

function buildProjectsSection() {
    fetch("../assets/projects/projects.json")
        .then(response => response.json())
        .then(json => {
            buildProjectsFromJson(json);
        });
}

export { buildProjectsSection };