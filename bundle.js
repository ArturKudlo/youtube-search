/* eslint-disable no-tabs */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
(function (modules) {
  const installedModules = {};

  // eslint-disable-next-line linebreak-style
  // eslint-disable-next-line no-underscore-dangle
  function __webpack_require__(moduleId) {

    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }

    const module = installedModules[moduleId] = {
 			i: moduleId,
      l: false,
      exports: {},
    };

    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    module.l = true;

    return module.exports;
  }

  __webpack_require__.m = modules;

  __webpack_require__.c = installedModules;

 	__webpack_require__.i = function (value) { return value; };

  __webpack_require__.d = function (exports, name, getter) {
 		if (!__webpack_require__.o(exports, name)) {
 			Object.defineProperty(exports, name, {
   configurable: false,
 				enumerable: true,
   get: getter,
 			});
 }
 	};

  __webpack_require__.n = function (module) {
    // eslint-disable-next-line no-underscore-dangle
    const getter = module && module.__esModule ?
			function getDefault() { return module.default; } :
 			function getModuleExports() { return module; };
 		// eslint-disable-next-line no-mixed-spaces-and-tabs
 		__webpack_require__.d(getter, 'a', getter);
    return getter;
  };


 	__webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  __webpack_require__.p = '';
  return __webpack_require__(__webpack_require__.s = 2);
}

 ([

 (function (module, exports, __webpack_require__) {

   Object.defineProperty(exports, '__esModule', {
     value: true,
   });
   const header = document.createElement('header');
   document.body.append(header);

   const inputSearch = document.createElement('input');
   inputSearch.placeholder = 'enter something...';
   inputSearch.type = 'search';
   header.append(inputSearch);

   const wrapper = document.createElement('section');
   wrapper.id = 'wrapper';
   document.body.append(wrapper);

   wrapper.addEventListener('mousedown', (e) => {
     e.preventDefault();
   }, false);

   exports.inputSearch = inputSearch;
   exports.wrapper = wrapper;

 }),

(function (module, exports, __webpack_require__) {




  Object.defineProperty(exports, '__esModule', {
    value: true,
  });
  let widthBlockDefault = 0;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    exports.widthBlockDefault = widthBlockDefault = 800;
  } else exports.widthBlockDefault = widthBlockDefault = 400;
  const temp = {};
  exports.temp = temp;
  exports.widthBlockDefault = widthBlockDefault;

}),

 (function (module, exports, __webpack_require__) {




   const _variables = __webpack_require__(1);

   const _createDom = __webpack_require__(0);

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

   const footer = document.createElement('footer');
   document.body.append(footer);

   _createDom.inputSearch.addEventListener('keypress', (e) => {
     if (e.keyCode === 13) {
       query = e.target.value;
       // eslint-disable-next-line no-use-before-define
       createVideoList();
     }
   }, false);

   const marginSectionFunc = function marginSectionFunc() {
     return parseInt((_createDom.wrapper.clientWidth - videosOnPage * _variables.widthBlockDefault) / 2 / videosOnPage, 10);
   };

   const changeWidth = function changeWidth() {
     const firstVideo = (currentPage - 1) * videosOnPage + 1;
     videosOnPage = columnNumber();
     const currentPageNumber = parseInt((firstVideo - 1) / videosOnPage + 1, 10);
     marginSection = marginSectionFunc();
     setMarginForSection();
     widthSection = _variables.widthBlockDefault + 2 * marginSection;
     if (videos.length === 0) {
       numberAllPages = 0;
     } else {
       numberAllPages = parseInt((videos.length - 1) / videosOnPage + 1, 10);
     }
     addDownload = (videosOnPage - videosNumber % videosOnPage) % videosOnPage;
     videosNumber += addDownload;
     if (numberAllPages !== 0) {
       updatePaging(numberAllPages);
     }
     setTooltip(currentPageNumber);
   };

   const pagination = function pagination() {
     _variables.temp.linkTooltip = document.createElement('a');
     _variables.temp.linkTooltip.addEventListener('mousedown', mousedownPage);
     _variables.temp.linkTooltip.addEventListener('click', clickPage);
     _variables.temp.linkTooltip.id = numberAllPages + 1;
     footer.append(_variables.temp.linkTooltip);
     setTimeout(changeWidth, 800);
   };

   const createScriptQuery = function createScriptQuery(src, number, nextPage) {
     const script = document.createElement('script');
     const maxResults = `&maxResults=${15}`;
     if (!nextPage) {
       // eslint-disable-next-line no-param-reassign
       nextPage = '';
     } else {
       // eslint-disable-next-line no-param-reassign
       nextPage = `&pageToken=${nextPage}`;
     }
     script.src = `https://www.googleapis.com/youtube/v3/search?callback=callbackJsonp&part=snippet&type=video&key=AIzaSyB7SGCLcruOGtri-GJS-kTJFcFj6xtCMwc&q=${src}${maxResults}${nextPage}`;
     document.head.append(script);
   };

   var createVideoList = function createVideoList() {
     _createDom.wrapper.innerHTML = '';
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

   const recieveResponse = function recieveResponse(data) {
     const videoList = [];
     const items = data.items;
     items.forEach((item) => {
       const date = new Date(Date.parse(item.snippet.publishedAt));
       videoList.push({
         title: item.snippet.title,
         id: item.id.videoId,
         link: `http://www.youtube.com/watch?v=${item.id.videoId}`,
         thumbnail: item.snippet.thumbnails.high.url,
         description: item.snippet.description,
         author: item.snippet.channelTitle,
         publishDate: `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`,
       });
     });
     nextPage = data.nextPageToken;
     return videoList;
   };

   window.callbackJsonp = function callbackJsonp(rest) {
     _variables.temp.result = recieveResponse(rest);
     _variables.temp.result.forEach((item) => {
       // eslint-disable-next-line no-use-before-define
       newScriptForEachVideo(item.id);
       videos.push(item);
     });
   };

   window.statJsonp = function (rest) {
     _variables.temp.flag = true;
     _variables.temp.result.forEach((item) => {
       if (item.id === rest.items[0].id) item.viewCount = rest.items[0].statistics.viewCount;
       if (!item.viewCount) _variables.temp.flag = false;
     });
     // eslint-disable-next-line no-use-before-define
     if (_variables.temp.flag) renderVideos(_variables.temp.result);
   };

   var newScriptForEachVideo = function newScriptForEachVideo(id) {
     const script = document.createElement('script');
     script.src = `https://www.googleapis.com/youtube/v3/videos?callback=statJsonp&part=statistics&key=AIzaSyB7SGCLcruOGtri-GJS-kTJFcFj6xtCMwc&q&id=${id}`;
     document.head.append(script);
   };

   var setMarginForSection = function setMarginForSection() {
     document.querySelectorAll('#wrapper section').forEach((item) => {
       item.style.margin = `20px ${marginSection}px`;
     });
   };

   const translatex = function translatex(tooltip) {
     const width = widthSection * videosOnPage * (1 - tooltip);
     document.querySelectorAll('#wrapper section').forEach((item) => {
       item.style.transform = `translatex(${width}px)`;
     });
     currentPage = tooltip;
   };

   var renderVideos = function renderVideos(items) {
     items.forEach((item) => {
       const section = document.createElement('section');
       const divImg = document.createElement('div');
       const img = document.createElement('img');
       img.src = item.thumbnail;
       divImg.append(img);
       const a = document.createElement('a');
       a.innerHTML = `<h1>${item.title}</h1>`;
       a.href = item.link;
       divImg.append(a);
       section.append(divImg);
       const description = document.createElement('p');
       description.innerHTML = `<p>Description:</p>${item.description}`;
       section.append(description);

       const addInfo = document.createElement('div');
       addInfo.classList.add('add-info');
       addInfo.innerHTML = `<span> Author: ${item.author}</span><span> Date: ${item.publishDate}</span><span> Views: ${item.viewCount}</span>`;
       section.append(addInfo);
       _createDom.wrapper.append(section);
     });
     setMarginForSection();
     if (numberAllPages * videosOnPage < videos.length) {
       numberAllPages++;
       pagination();
       translatex(numberAllPages);
     } else translatex(currentPage);
   };

   var mousedownPage = function mousedownPage(e) {
     e.target.innerHTML = `<div class="tooltip">${e.target.id}</div>`;
   };

   var clickPage = function clickPage(e) {
     e.target.innerHTML = '';
     setTooltip(e.target.id);
   };

   var setTooltip = function setTooltip(tooltip) {
     if (tooltip == numberAllPages + 1) {
       createScriptQuery(query, videosOnPage, nextPage);
       videosNumber += videosOnPage;
     } else translatex(tooltip);
     document.querySelectorAll('footer > a').forEach((item) => {
       item.id == tooltip ? item.classList.add('current-page') : item.classList.remove('current-page');
     });
   };

   const checkMouseInSection = function checkMouseInSection(path) {
     let flag = false;
     path.forEach((item) => {
       if (item == _createDom.wrapper) {
         flag = true;
       }
     });
     return flag;
   };

   const setDragPointX = function setDragPointX(e) {
     if (checkMouseInSection(e.path)) {
       drag = true;
       currentDragPontX = e.x;
     }
   };

   const mouseMove = function mouseMove(e) {
     if (drag) {
       dragable(e.x - currentDragPontX);
     }
   };

   var dragable = function dragable(x) {
     const width = widthSection * videosOnPage * (1 - currentPage);
     document.querySelectorAll('#wrapper section').forEach((item) => {
       item.style.transform = `translatex(${width + x}px)`;
     });
   };

   const mouseEndsetTooltip = function mouseEndsetTooltip(e) {
     if (drag) {
       if (e.x - currentDragPontX >= 150 && currentPage != 1) {
         setTooltip(currentPage - 1);
       } else if (e.x - currentDragPontX <= -150) {
      // eslint-disable-next-line radix
         setTooltip(parseInt(currentPage + 1), 10);
       } else {
        // eslint-disable-next-line indent
        setTooltip(currentPage);
       }
       dragable(0);
     }
     drag = false;
   };

   const touchStart = function touchStart(e) {
     if (checkMouseInSection(e.path)) {
       drag = true;
       currentDragPontX = e.touches[0].clientX;
     }
   };

   const touchMove = function touchMove(e) {
     if (drag) {
       dragable(e.touches[0].clientX - currentDragPontX);
     }
   };

   const touchEnd = function touchEnd(e) {
     if (drag) {
       if (e.changedTouches[0].clientX - currentDragPontX >= 150 && currentPage != 1) {
         setTooltip(currentPage - 1);
       } else if (e.changedTouches[0].clientX - currentDragPontX <= -150) {
         setTooltip(parseInt(currentPage + 1), 10);
       } else setTooltip(currentPage);
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

   var columnNumber = function columnNumber() {
     return parseInt(_createDom.wrapper.clientWidth / (_variables.widthBlockDefault + 40), 10);
   };

   var updatePaging = function updatePaging(number) {
     footer.innerHTML = '';
     for (let i = 1; i <= number + 1; i++) {
       _variables.temp.linkTooltip = document.createElement('a');
       _variables.temp.linkTooltip.addEventListener('mousedown', mousedownPage);
       _variables.temp.linkTooltip.addEventListener('click', clickPage);
       _variables.temp.linkTooltip.id = i;
       footer.append(_variables.temp.linkTooltip);
     }
   };

   window.addEventListener('resize', changeWidth);

 }),
 ]));
