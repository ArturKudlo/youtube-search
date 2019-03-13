import { temp, widthBlockDefault } from './variables';
import { inputSearch, wrapper } from './createDom';

let videos = [];
let nextPage = '';
let query = '';
let marginSection = 20;
let widthSection = 1320;
let videosNumber;
let addDownload = 0;
let drag = false;
let currentDragPontX = 0;
let numberAllPages = 0;
let currentPage = 0;
let videosOnPage = 3;

let footer = document.createElement('footer');
document.body.append(footer);

inputSearch.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
        query = e.target.value;
        createVideoList();
    }
}, false);

let marginSectionFunc = () => {
    return parseInt(((wrapper.clientWidth - (videosOnPage * widthBlockDefault)) / 2 / videosOnPage), 10);
};

let changeWidth = () => {
    const firstVideo = ((currentPage - 1) * videosOnPage) + 1;
    videosOnPage = columnNumber();
    let currentPageNumber = parseInt((((firstVideo - 1) / videosOnPage) + 1), 10);
    marginSection = marginSectionFunc();
    setMarginForSection();
    widthSection = widthBlockDefault + (2 * marginSection);
    if (videos.length === 0) {
        numberAllPages = 0;
    } else {
        numberAllPages = parseInt((((videos.length - 1) / videosOnPage) + 1), 10);
    }
    addDownload = (videosOnPage - (videosNumber % videosOnPage)) % videosOnPage;
    videosNumber += addDownload;
    if (numberAllPages !== 0) {
        updatePaging(numberAllPages);
    }
    setTooltip(currentPageNumber);
};

let pagination = () => {
    temp.linkTooltip = document.createElement('a');
    temp.linkTooltip.addEventListener('mousedown', mousedownPage);
    temp.linkTooltip.addEventListener('click', clickPage);
    temp.linkTooltip.id = numberAllPages+1;
    footer.append(temp.linkTooltip);
    setTimeout(changeWidth, 800);
};

let createScriptQuery = (src, number, nextPage) => {
    let script = document.createElement('script');
    const maxResults = '&maxResults=' + 15;
    if (!nextPage) {
        nextPage = '';
    } else {
        nextPage = '&pageToken=' + nextPage;
    }
    script.src = 'https://www.googleapis.com/youtube/v3/search?callback=callbackJsonp&part=snippet&type=video&key=AIzaSyB7SGCLcruOGtri-GJS-kTJFcFj6xtCMwc&q=' + src + maxResults + nextPage;
    document.head.append(script);
};

let createVideoList = () => {
    wrapper.innerHTML = '';
    footer.innerHTML = '';
    currentPage = 0;
    numberAllPages = 5;
    videosNumber = 0;
    videos = [];
    pagination();
    changeWidth();
    createScriptQuery(query, videosOnPage);
    videosNumber += videosOnPage;
    document.querySelectorAll('footer a')[0].classList.add('current-page');
};

const recieveResponse = data => {
    let videoList = [];
    let items = data.items;
    items.forEach(item => {
        let date = new Date(Date.parse(item.snippet.publishedAt));
        videoList.push({
            title: item.snippet.title,
            id: item.id.videoId,
            link: 'http://www.youtube.com/watch?v=' + item.id.videoId,
            thumbnail: item.snippet.thumbnails.high.url,
            description: item.snippet.description,
            author: item.snippet.channelTitle,
            publishDate: (date.getMonth() + 1) + '.' + date.getDate() + '.' + date.getFullYear()
        });
    });
    nextPage = data.nextPageToken;
    return videoList;
};

window.callbackJsonp = function callbackJsonp(rest) {
    temp.result = recieveResponse(rest);
    temp.result.forEach(item => {
        newScriptForEachVideo(item.id);
        videos.push(item);
    });
};

window.statJsonp = function (rest) {
    temp.flag = true;
    temp.result.forEach(item => {
        if (item.id === rest.items[0].id) item.viewCount = rest.items[0].statistics.viewCount;
        if (!item.viewCount) temp.flag = false;
    });
    if (temp.flag) renderVideos(temp.result);
};

let newScriptForEachVideo = id => {
    let script = document.createElement('script');
    script.src = 'https://www.googleapis.com/youtube/v3/videos?callback=statJsonp&part=statistics&key=AIzaSyB7SGCLcruOGtri-GJS-kTJFcFj6xtCMwc&q&id='+ id;
    document.head.append(script);
}

let setMarginForSection = () => {
    document.querySelectorAll('#wrapper section').forEach(item => { item.style.margin = '20px ' + `${marginSection}px`; });
};

let translatex = tooltip => {
    const width = (widthSection * videosOnPage) * (1 - tooltip);
    document.querySelectorAll('#wrapper section').
    forEach(item => { 
        item.style.transform = `translatex(${width}px)`;
    });
    currentPage = tooltip;
};

let renderVideos = items => {
    items.forEach((item) => {
        const section = document.createElement('section');
        const divImg = document.createElement('div');
        const img = document.createElement('img');
        img.src = item.thumbnail;
        divImg.append(img);
        const a = document.createElement('a');
        a.innerHTML = '<h1>' + item.title + '</h1>';
        a.href = item.link;
        divImg.append(a);
        section.append(divImg);
        const description = document.createElement('p');
        description.innerHTML = '<p>Description:</p>' + item.description;
        section.append(description);

        let addInfo = document.createElement('div');
        addInfo.classList.add('add-info');
        addInfo.innerHTML = '<span> Author: '+item.author + '</span><span> Date: ' + item.publishDate + '</span><span> Views: ' + item.viewCount + '</span>';
        section.append(addInfo);
        wrapper.append(section);
    });
    setMarginForSection();
    if (numberAllPages * videosOnPage < videos.length) {
        numberAllPages++;
        pagination();
        translatex(numberAllPages);
    } else translatex(currentPage)
};

let mousedownPage = (e) => {
    e.target.innerHTML = '<div class="tooltip">' + e.target.id + '</div>';
};

let clickPage = (e) => {
    e.target.innerHTML = '';
    setTooltip(e.target.id);
};

let setTooltip = tooltip => {
    if (tooltip == numberAllPages+1) {
        createScriptQuery(query, videosOnPage, nextPage);
        videosNumber += videosOnPage;
    } else translatex(tooltip);
    document.querySelectorAll('footer > a').
    forEach(item => {
        item.id == tooltip ? item.classList.add('current-page') : item.classList.remove('current-page');
    });
};

let checkMouseInSection = path => {
    let flag = false;
    path.forEach(item => {
        if (item == wrapper) {
            flag = true;
        }
    });
    return flag;
};

const setDragPointX = (e) => {
    if (checkMouseInSection(e.path)) {
        drag = true;
        currentDragPontX = e.x;
    }
};

let mouseMove = (e) => {
    if (drag) {
        dragable(e.x - currentDragPontX);
    }
};

let dragable = x => {
    const width = (widthSection * videosOnPage) * (1 - currentPage);
    document.querySelectorAll('#wrapper section').
    forEach(item => {
        item.style.transform = `translatex(${width + x}px)`;
    });
};

let mouseEndsetTooltip = (e) => {
    if (drag) {
        if (e.x - currentDragPontX >= 150 && currentPage != 1) {
            setTooltip(currentPage - 1);
        } else if (e.x - currentDragPontX <= -150) {
            setTooltip(parseInt((currentPage) + 1), 10)
        } else {
            setTooltip(currentPage);
        }
        dragable(0);
    }
    drag = false;
};

let touchStart = (e) => {
    if (checkMouseInSection(e.path)) {
        drag = true;
        currentDragPontX = e.touches[0].clientX;
    }
};

let touchMove = (e) => {
    if (drag) { 
        dragable(e.touches[0].clientX - currentDragPontX);
    }
};

let touchEnd = (e) => {
    if (drag) {
        if (e.changedTouches[0].clientX - currentDragPontX >= 150 && currentPage != 1) {
            setTooltip(currentPage - 1);
        } else if (e.changedTouches[0].clientX - currentDragPontX <= -150) {
            setTooltip(parseInt((currentPage) + 1), 10);
        }
        else setTooltip(currentPage);
        dragable(0);
    }
    drag = false;
};

document.body.addEventListener('mousedown', setDragPointX);
document.body.addEventListener('mousemove', mouseMove);
document.body.addEventListener('mouseup', mouseEndsetTooltip);
document.body.addEventListener('touchstart', touchStart);
document.body.addEventListener('touchmove', touchMove);
document.body.addEventListener('touchend', touchEnd);

let columnNumber = () => {
    return parseInt((wrapper.clientWidth / (widthBlockDefault + 40)), 10);
};

let updatePaging = number => {
    footer.innerHTML = '';
    for (let i = 1; i <= number + 1; i++) {
        temp.linkTooltip = document.createElement('a');
        temp.linkTooltip.addEventListener('mousedown', mousedownPage);
        temp.linkTooltip.addEventListener('click', clickPage);
        temp.linkTooltip.id = i;
        footer.append(temp.linkTooltip);
    }
};

window.addEventListener('resize', changeWidth);
