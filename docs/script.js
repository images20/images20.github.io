
var activeSelectX, isOnMobile;
var S_EXTENDED = true;

var pageElements = [...document.querySelectorAll('page:not([class="auxPage"])')];
var pageAuxElements = [...document.querySelectorAll('page.auxPage')];
var scrollTooltips = document.getElementsByClassName('scrollTooltip');

var currentNormalPageIndex = 0, currentPage = pageElements[0];

var siteStructure = [
    {
        chTitle: "",
        pages: [
            ["Приветствие", 0]
        ]
    },
    {
        chTitle: "Основы",
        pages: [
            ["Пиксель", 1],
            ["Разрешение", 2],
            ["Цвета", 3],
            ["Виды графики", 4],
            ["Больше фракталов!", 100, S_EXTENDED],
            ["Сжатие", 5],
            ["Файлы. Форматы и расширения", 6],
        ]
    },
    {
        chTitle: "Форматы",
        pages: [
            ["BMP", 7],
            ["GIF", 8],
            ["TIFF", 9],
            ["PNG", 10],
            ["JPEG", 11],
            ["Как сжимает JPEG", 102],
            ["WebP", 12],
            ["HEIF", 13],
            ["AVIF", 14],
            ["RAW", 15],
        ]
    },
    {
        chTitle: "Сравнение и итоги",
        pages: [
            ["Сравнение", 16],
            ["Что делать дальше", 17],
            ["Инструкция по Squoosh", 101, S_EXTENDED],
        ]
    }
];


function goToPage(index) {
    for (let element of pageElements) {
        element.classList.add('page_displaynone');
    }
    for (let element of pageAuxElements) {
        element.classList.add('page_displaynone');
    }
    for (let videoElement of currentPage.getElementsByTagName('video')) {
        videoElement.oncansee = () => {}
    }
    for (let galleryElement of currentPage.getElementsByTagName('gallery')) {
        galleryElement.galleryInt.autoScrollInterval.pause();
    }
    if (index >= 100) {
        index -= 100;
        currentPage = pageAuxElements[index];
        document.body.classList.add('onAuxPage');
    }
    else {
        if (index === '+') index = currentNormalPageIndex+1;
        currentPage = pageElements[index];
        currentNormalPageIndex = index;
        document.body.classList.remove('onAuxPage');
        let progress = Math.round((index / (pageElements.length-1))*100) / 100;
        navbar_progress_text.innerText = progress * 100 + "% пройдено";
        navbar_progress_bar.value = progress;
    }
    currentPage.classList.remove('page_displaynone');
    for (let videoElement of currentPage.getElementsByTagName('video')) {
        videoElement.oncansee = () => videoElement.play();
        videoScrollAutoPlayPause(videoElement, window.innerHeight);
    }
    for (let galleryElement of currentPage.getElementsByTagName('gallery')) {
        galleryElement.galleryInt.autoScrollInterval.resume();
    }
}

function getParentPage(element) {
    var current = element;
    while (current.tagName != "PAGE" || current.tagName != "HTML") {
        current = current.parentElement;
    }
    return current;
}

window.onclick = (event) => {
	if (event.path.includes(navOpenButton)) document.body.classList.add('navbarVisible')
	else if (!event.path.includes(navbar) || event.path.includes(navbar_header_closeButton)) document.body.classList.remove('navbarVisible')
}

auxBackButton.onclick = () => {
    goToPage(currentNormalPageIndex);
}

[...document.getElementsByTagName('d')].forEach(element => {
    element.addEventListener('click', () => {
        element.classList.toggle('dExpl_opened');
        document.body.classList.remove('explNotUsed')
    })
});

[...document.getElementsByClassName('fullHeightBlockFlex')].forEach(element => {
    if (element.children[0].classList.contains('pageGFX')) element.classList.add('GFXfirst');
});


function IntervalX(callback, interval, startPaused) {
    var timerId;
    var state = 0; //  0 - idle, 1 - running, 2 - paused;
    this.pause = () => {
        if (state != 1) return;
        window.clearInterval(timerId);
        state = 2;
    };
    this.resume = () => {
        if (state != 2) return;
        timerId = window.setInterval(callback, interval);
        state = 1;
    };
    this.restart = () => {
        this.pause();
        this.resume();
    }
    timerId = window.setInterval(callback, interval);
    state = 1;
    if (startPaused) this.pause();
}


function createNavbarLinks() {
    let fragment = document.createDocumentFragment();
    for (let currentChapter of siteStructure) {
        let chapterElement = document.createElement('lChapter');
        chapterElement.innerText = currentChapter.chTitle;
        fragment.appendChild(chapterElement);
        for (let page of currentChapter.pages) {
            let tagName = "lPage";
            if (page[2] == S_EXTENDED) tagName = "lExtended";
            let pageElement = document.createElement(tagName);
            pageElement.innerText = page[0];
            pageElement.addEventListener('click', () => { goToPage(page[1]) });
            fragment.appendChild(pageElement);
        }
    }
    navbar_links.appendChild(fragment);
}
createNavbarLinks();

function isElementVisible(el, viewportHeight) {
    let rect = el.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > viewportHeight) return false
    else return true
}

let video1 = document.getElementById('video_1');

var allVideoElements = [...document.getElementsByTagName('video')];

pageElements[1].onscroll = () => {
    scrollTooltips[0].style.display = "none";
}

pageAuxElements[0].onscroll = () => {
    scrollTooltips[1].style.display = "none";
}

function videoScrollAutoPlayPause(element, viewportHeight) {
    if (isElementVisible(element, viewportHeight)) {
        if (element.paused && !element.alreadyPlayed) {
            element.play();
            element.alreadyPlayed = true;
        }
    }
    else {
        element.currentTime = 0;
        element.pause();
        element.alreadyPlayed = false;
    }
}

document.querySelector('#chapterTitle_PIXEL video').onended = () => { document.body.classList.remove('bodyState_introNotDone') };


titleScreen_startButton_container.onclick = () => {
    let scaleFactor;
    let rectInfo = titleScreen_startButton_pageTransitionRipple.getBoundingClientRect()
    if (window.innerHeight > window.innerWidth) {
        scaleFactor = (window.innerHeight + rectInfo.bottom * 2) * 1.5;
    }
    else {
        scaleFactor = (window.innerWidth + rectInfo.left * 2) * 1.5;
    }
    titleScreen_startButton_pageTransitionRipple.style.transform = `scale(${scaleFactor})`;
    document.body.classList.add('titlescreenRippleTransitionActive');
    setTimeout(() => {
        titleScreen_startButton_pageTransitionRipple.style.transform = '';
        document.body.classList.remove('titlescreenRippleTransitionActive');
    }, 3000);
    setTimeout(() => {
        goToPage(1);
    }, 2500);
    document.body.classList.remove('waitingForUserInteraction');

}


let interColors_isFullscreen = false;
let interColors_dataset = [
    [ 1,  '1 бит на пиксель',   '2 цвета (монохром)' ],
    [ 2,  '2 бита на пиксель',  '4 цвета' ],
    [ 3,  '3 бита на пиксель',  '8 цветов' ],
    [ 4,  '4 бита на пиксель',  '16 цветов' ],
    [ 5,  '5 бит на пиксель',   '32 цвета' ],
    [ 6,  '6 бит на пиксель',   '64 цвета' ],
    [ 7,  '7 бит на пиксель',   '128 цветов' ],
    [ 8,  '8 бит на пиксель',   '256 цветов' ],
    [ 16, '16 бит на пиксель',  '65,5 тыс цветов' ],
    [ 24, '24 бита на пиксель', '16,7 млн цветов' ],
]

interColors_input.oninput = interColors_update;
interColors_update(false);

function interColors_update(preserveCollapsedClass) {

    if (preserveCollapsedClass) interColors_outputContainer.classList.remove('collapsed');

    let currentValue = interColors_input.value;
    interColors_input.setAttribute('value', currentValue);

    interColors_valueBits.innerText   = interColors_dataset[currentValue][1];
    interColors_valueColors.innerText = interColors_dataset[currentValue][2];

    if (interColors_isFullscreen) {
        for (let child of interColors_fullscreenOutput1.children) {
            child.classList.add('opacityZero');
        }
        interColors_fullscreenOutput1.children[currentValue].classList.remove('opacityZero');
        for (let child of interColors_fullscreenOutput2.children) {
            child.classList.add('opacityZero');
        }
        interColors_fullscreenOutput2.children[currentValue].classList.remove('opacityZero');
        for (let child of interColors_fullscreenOutput3.children) {
            child.classList.add('opacityZero');
        }
        interColors_fullscreenOutput3.children[currentValue].classList.remove('opacityZero');
    }
    else {
        for (let child of interColors_output1.children) {
            child.classList.add('opacityZero');
        }
        interColors_output1.children[currentValue].classList.remove('opacityZero');
    
        for (let child of interColors_output2.children) {
            child.classList.add('opacityZero');
        }
        interColors_output2.children[currentValue].classList.remove('opacityZero');
    }
}

function interColors_swtichFullscreen() {
    if (interColors_isFullscreen) {
        document.body.classList.remove('interColors_fullscreen');
        interColors_switchFullscreenButton.innerText = "Посмотреть ближе";
        interColors_panelContainer.appendChild(interColors_panel);
    }
    else {
        document.body.classList.add('interColors_fullscreen');
        interColors_switchFullscreenButton.innerText = "Вернуться назад";
        interColors_fullscreen.appendChild(interColors_panel);
    }
    interColors_isFullscreen = !interColors_isFullscreen;
    interColors_update();
}

/*
    Интерактивный элемент 2: разрешение
*/

let interResolution_isFullscreen = false;
let interResolution_dataset = [
    [ 0,  '80×50' ],
    [ 1,  '160×100' ],
    [ 2,  '320×200' ],
    [ 3,  '480×300' ],
    [ 4,  '640×400' ],
    [ 5,  '800×500' ],
    [ 6,  '960×600' ],
    [ 7,  '1120×700' ],
    [ 8,  '1280×800' ]
];

interResolution_input.oninput = interResolution_update;
interResolution_update();

function interResolution_update() {
    let currentValue = interResolution_input.value;
    interResolution_input.setAttribute('value', currentValue);

    interResolution_value.innerText   = interResolution_dataset[currentValue][1];

    for (let child of interResolution_outputContainer.children) {
        child.classList.add('opacityZero');
    }
    interResolution_outputContainer.children[currentValue].classList.remove('opacityZero');
}

var interFileFormats_data = [
    [".jpg",  "Изображение в формате JPEG"],
    [".txt",  "Текстовый файл"],
    [".png",  "Изображение в формате PNG"],
    [".mp4",  "Видео"],
    [".docx", "Документ Word"],
    [".pdf",  "Документ PDF"],
    [".exe",  "Приложение (исполняемый файл)"],
    [".bmp",  "Изображение в формате BMP"],
    [".mp3",  "Аудио"],
    [".gif",  "Изображение в формате GIF"],
    [".mkv",  "Видео"]
];
var interFileFormats_indexes = {prev: interFileFormats_data.length - 1, current: 0, next: 1};

interFileFormats_listPrev.addEventListener('click', () => {
    interFileFormats_indexes.current = interFileFormats_indexes.prev;
    interFileFormats_createForCurrentIndex()});
interFileFormats_listNext.addEventListener('click', () => {
    interFileFormats_indexes.current = interFileFormats_indexes.next;
    interFileFormats_createForCurrentIndex()
});

function interFileFormats_createForCurrentIndex() {
    let index = interFileFormats_indexes.current;
    let iPrev = index - 1, iNext = index + 1;

    if (iPrev < 0) iPrev = interFileFormats_data.length - 1;
    if (iNext >= interFileFormats_data.length) iNext = 0;
    
    interFileFormats_indexes.prev = iPrev;
    interFileFormats_indexes.next = iNext;

    interFileFormats_listPrev.innerText = interFileFormats_data[iPrev][0];
    interFileFormats_listCurrent.innerText = interFileFormats_data[index][0];
    interFileFormats_listNext.innerText = interFileFormats_data[iNext][0];

    interFileFormats_image.style.backgroundImage = `url('assets/gfx_fileFormats/icon${interFileFormats_data[index][0]}.webp')`
    interFileFormats_description.innerText = interFileFormats_data[index][1];
}

interFileFormats_createForCurrentIndex();

document.createElementX = (tagName, innerHTML, classList, appendTo) => {
    let element = document.createElement(tagName);
    if (innerHTML) element.innerHTML = innerHTML;
    if (classList) element.classList = classList;
    if (appendTo)  appendTo.appendChild(element);
    return element;
}

class selectX {
    constructor(parentElement, description, dataset, onItemClick) {
        this.active = false;
        this.dataset = dataset;
        this.onItemClick = onItemClick;

        this.element_container = document.createElement('selectx');
        this.element_topContainer = document.createElement('selectxtop');
        this.element_description = document.createElement('selectxdesc');
        this.element_value = document.createElement('selectxvalue');
        this.element_list = document.createElement('selectxlist');

        this.element_topContainer.appendChild(this.element_description);
        this.element_topContainer.appendChild(this.element_value);
        this.element_container.appendChild(this.element_topContainer);
        this.element_container.appendChild(this.element_list);
        parentElement.appendChild(this.element_container);
        
        this.element_topContainer.addEventListener('click', () => this.setState());
        this.element_description.innerText = description;

        for (let i = 0; i < dataset.length; i++) {
            let currentElement = document.createElement('div');
            currentElement.listIndex = i;
            currentElement.innerText = dataset[i].text;
            currentElement.addEventListener('click', (event) => this.choose(event.target));
            this.element_list.appendChild(currentElement);
        }
        
        this.element_container.selectXInt = this;
    }
    choose = (clickedItem) => {
        if (typeof clickedItem == 'number') clickedItem = this.element_list.children[clickedItem];
        this.onItemClick(clickedItem.listIndex);
        [...this.element_list.children].forEach((element) => element.classList.remove('selected'));
        clickedItem.classList.add('selected');
        this.element_value.innerText = clickedItem.innerText;
        this.setState(false);
    }
    setState = (state) => {
        if (state == undefined) state = !this.active;
        if (state == true) {
            this.element_container.classList.add('activeSelectX');
            if (activeSelectX) activeSelectX.setState(false);
            this.active = true;
            activeSelectX = this;
        }
        else {
            this.element_container.classList.remove('activeSelectX');
            this.active = false;
            activeSelectX = null;
        }
    }
}

class comparisonSystem {
    constructor(targetElement, modifiersImages, modifiersFormats) {
        this.modifiersFormats = modifiersFormats;
        this.modifiersImages  = modifiersImages;

        this.element_main        = targetElement;
        this.element_main.classList.add('comparison-container');
    
        this.element_views       = document.createElementX('div', null, 'comparison-viewContainer', this.element_main);
        this.element_viewLeft    = document.createElementX('div', null, 'comparison-view comparison-viewLeft', this.element_views);
        this.element_viewDrag    = document.createElementX('div', null, 'comparison-viewDrag', this.element_views);
        this.element_viewRight   = document.createElementX('div', null, 'comparison-view comparison-viewRight', this.element_views);
    
        this.element_controls    = document.createElementX('div', null, 'comparison-controlContainer', this.element_main);
    
    
        this.element_viewLeft.style.backgroundSize = this.element_viewRight.style.backgroundSize = this.element_views.getBoundingClientRect().width + "px";
    
        this.element_viewDrag.onpointerdown = (event1) => {
            event1.preventDefault();
            let rectInfo = this.element_views.getBoundingClientRect();
            document.onpointermove = (event2) => {
                event2.preventDefault();
                if ((event2.clientX - rectInfo.left) < 0) {
                    this.element_viewLeft.style.width = "0%";
                }
                else if ((this.element_views.offsetWidth + rectInfo.left) < event2.clientX) {
                    this.element_viewLeft.style.width = "100%"
                }
                else {
                    this.element_viewLeft.style.width = Math.round( (event2.clientX - rectInfo.left) / rectInfo.width * 10000) / 100 + "%";
                }
            }
        }
        document.onpointerup = () => {
            document.onpointermove = null;
        }
    
        this.element_selectX_rightFormat = new selectX(this.element_controls, "Правый формат" , this.modifiersFormats, this.setRightFormat);
        this.element_selectX_imagePrefix = new selectX(this.element_controls, "Набор картинок", this.modifiersImages , this.setImagePrefix);
        this.element_selectX_leftFormat  = new selectX(this.element_controls, "Левый формат"  , this.modifiersFormats, this.setLeftFormat );

        this.currentIndex_left  = 0;
        this.currentIndex_image = 0;
        this.currentIndex_right = 0;

        this.element_selectX_leftFormat.choose(0);
        this.element_selectX_imagePrefix.choose(0);
        this.element_selectX_rightFormat.choose(1);

        this.element_viewLeft.style.width = "50%";
        this.element_main.comparisonSystemInt = this;
    }
    resizeImages = () => {
        let rectInfo = this.element_main.getBoundingClientRect();
        let bgSizeValue = rectInfo.width - 12;
        if (rectInfo.height - 222 >= rectInfo.width - 12) {
            this.element_main.classList.add('comparison_squareLocked');
            bgSizeValue = window.innerWidth - 12;
        }
        else {
            this.element_main.classList.remove('comparison_squareLocked');
        }
        this.element_viewLeft.style.backgroundSize = this.element_viewRight.style.backgroundSize = bgSizeValue + "px";
    }
    refreshView = (which) => {
        if (which == 'left') {
            this.element_viewLeft.style.backgroundImage = `url("assets/${this.modifiersImages[this.currentIndex_image].intValue}${this.modifiersFormats[this.currentIndex_left].intValue}")`;
        }
        else if (which == 'right') {
            this.element_viewRight.style.backgroundImage = `url("assets/${this.modifiersImages[this.currentIndex_image].intValue}${this.modifiersFormats[this.currentIndex_right].intValue}")`;
        }
    }
    setLeftFormat = (index) => {
        this.currentIndex_left = index;
        this.refreshView('left');
    };
    setImagePrefix = (index) => {
        this.currentIndex_image = index;
        this.refreshView('left');
        this.refreshView('right');
    };
    setRightFormat = (index) => {
        this.currentIndex_right = index;
        this.refreshView('right');
    };
}

var comparisonTest = new comparisonSystem(comparisonContainerTest, 
    [
        {text: "Фотография 1",   intValue: 'gfx_comparison/photo1/p1_'},
        {text: "Фотография 2",   intValue: 'gfx_comparison/photo2/p2_'},
        {text: "Графика 1",      intValue: 'gfx_comparison/graphics1/g1_'},
        {text: "Графика 2",      intValue: 'gfx_comparison/graphics2/g2_'},
        //{text: "Из Интернета 1", intValue: 'gfx_comparison/internet1/i1_'},
        //{text: "Графика 1",      intValue: 'gfx_comparison/internet2/i2_'},
    ], 
    [
        {text: "Оригинал (PNG)", intValue: 'orig.webp'},
        {text: "JPEG", intValue: 'jpeg.jpg' },
        {text: "WebP", intValue: 'webp.webp'},
        {text: "HEIF", intValue: 'heif.webp'},
        {text: "AVIF", intValue: 'avif.avif'},
    ]
);


function detectMobile() {
    if (window.innerHeight > window.innerWidth * 1.25) {
        document.documentElement.classList.add('isOnMobile');
        isOnMobile = true;
    }
    else {
        document.documentElement.classList.remove('isOnMobile');
        isOnMobile = false;
    }
}


class imageGallery {
    constructor(targetElement, dataset) {
        this.element_main = targetElement;
        this.dataset = dataset;
        this.currentIndex = -1;
        this.dotElements  = [];

        this.autoScrollInterval = new IntervalX(() => this.navigate('forward'), 10000, true);
    
        let mainFragment = document.createDocumentFragment();
    
        this.element_imageContainer      = document.createElementX('div', null, 'gallery_image', mainFragment);
        this.element_description         = document.createElementX('div', null, 'gallery_description', mainFragment);
        this.element_controlsContainer   = document.createElementX('div', null, 'gallery_controlsContainer', mainFragment);
        this.element_ctrl_buttonLeft     = document.createElementX('div', "<icon>navigate_before</icon>", 'gallery_button gallery_buttonLeft', this.element_controlsContainer);
        this.element_ctrl_dotsContainer  = document.createElementX('div', null, 'gallery_dotsConainer', this.element_controlsContainer);
        this.element_ctrl_buttonRight    = document.createElementX('div', "<icon>navigate_next</icon>", 'gallery_button gallery_buttonRight', this.element_controlsContainer);
    
        let dotsFragment = document.createDocumentFragment();
        for (let i = 0; i < this.dataset.length; i++) {
            let element = document.createElement('dot');
            this.dotElements.push(element);
            dotsFragment.appendChild(element);
        }
        this.element_ctrl_dotsContainer.appendChild(dotsFragment);
    
        this.element_ctrl_buttonLeft.addEventListener('click',  () => {
            this.navigate('back');
            this.autoScrollInterval.restart();
        });
        this.element_ctrl_buttonRight.addEventListener('click',  () => {
            this.navigate('forward');
            this.autoScrollInterval.restart();
        });

        this.navigate('forward');
        this.element_main.appendChild(mainFragment);
        this.element_main.galleryInt = this;
    }

    updateDot = () => {
        this.dotElements.forEach(element => element.classList.remove('active'));
        this.dotElements[this.currentIndex].classList.add('active')
    }

    navigate = (to) => {
        if (to == 'back') {
            this.currentIndex--;
            if (this.currentIndex < 0) this.currentIndex = this.dataset.length-1;
        }
        else if (to == 'forward') {
            this.currentIndex++;
            if (this.currentIndex == this.dataset.length) this.currentIndex = 0;
        }
        this.element_imageContainer.style.backgroundImage = `url('assets/${this.dataset[this.currentIndex][0]}')`;
        this.element_description.innerHTML = this.dataset[this.currentIndex][1];
        this.updateDot();
    }
}


function imglinkOpen(link) {
    imageCloseup.src = link;
    document.body.classList.add('imageCloseupActive');
}

imageCloseupShadow.onclick = () => {
    document.body.classList.remove('imageCloseupActive');
}

compressionTitleRect_red.onanimationstart = () => {
    let rectInfo;
    let updateInterval = setInterval(() => {
        rectInfo = compressionTitleRect_red.getBoundingClientRect().width;
        compressionTitle_size.innerText = Math.round(rectInfo / compressionTitleRect_grey.offsetWidth * 100) + "%";
    }, 25);
    setTimeout(() => {
        clearInterval(updateInterval);
    }, 4000)
};



/*///////////////////////////////////
    Галереи
///////////////////////////////////*/


var galleryInt_pixel =  new imageGallery(gallery_pixel, 
    [
        ["gfx_pixel/pixel2.webp", "Логические пиксели (на устройстве)"],
        ["gfx_pixel/pixel3.webp",  "Физические пиксели (на экране)"]
    ]
);

var galleryInt_raster =  new imageGallery(gallery_raster, 
    [
        ["gfx_types/raster/tree1.avif", "Так выглядит обычное изображение..."],
        ["gfx_types/raster/tree2.webp",  "...а так оно выглядит под увеличением."]
    ]
);

var galleryInt_pixelart =  new imageGallery(gallery_pixelart, 
    [
        ["gfx_types/pixelart/snowman.webp", "Анимация снеговика"],
        ["gfx_types/pixelart/mario.webp", "Изображение Марио из игры 1984 года"],
        ["gfx_types/pixelart/landscape.webp", "Пейзаж (автор: OkiOkipx)"],
        ["gfx_types/pixelart/star.webp", "<i>Звезда?</i>"],
    ]
);

var galleryInt_natureFractals =  new imageGallery(gallery_natureFractals, 
    [
        ["gfx_types/fractals/nature1.avif", "Капуста романеско"],
        ["gfx_types/fractals/nature2.avif", "Раковина наутилуса"],
        ["gfx_types/fractals/nature3.avif", "Молнии"],
        ["gfx_types/fractals/nature4.avif", "Снежинка"],
        ["gfx_types/fractals/nature5.avif", "Кристаллы"]
    ]
);

var galleryInt_vector =  new imageGallery(gallery_vector, 
    [
        ["gfx_types/fractals/nature1.avif", "Капуста романеско"],
        ["gfx_types/fractals/nature2.avif", "Раковина наутилуса"],
        ["gfx_types/fractals/nature3.avif", "Молнии"],
        ["gfx_types/fractals/nature4.avif", "Снежинка"],
        ["gfx_types/fractals/nature5.avif", "Кристаллы"]
    ]
);

var galleryInt_compression =  new imageGallery(gallery_compression, 
    [
        ["gfx_compression/a1.webp", "Фрагмент оригинальной несжатой фотографии"],
        ["gfx_compression/a2.webp", "Тот же фрагмент, но с применением сжатия с потерями"],
        ["gfx_compression/a3.webp", "И опять, но с более совершенным алгоритмом"]
    ]
);

var galleryInt_gif1 =  new imageGallery(gallery_gif1, 
    [
        ["gfx_formats/gif/a1.webp", "GIF-анимации"],
        ["gfx_formats/gif/a2.webp", "GIF-анимации"],
        ["gfx_formats/gif/a3.webp", "GIF-анимации"]
    ]
);

var galleryInt_gif2 =  new imageGallery(gallery_gif2, 
    [
        ["gfx_formats/gif/b1.webp", "Присмотритесь, и вы увидите последствия ограничения числа цветов"],
        ["gfx_formats/gif/b2.webp", "Типичная прозрачность GIF-картинок"],
    ]
);

var galleryInt_pngVsGif =  new imageGallery(gallery_pngVsGif, 
    [
        ["gfx_formats/png/vs_gif.webp", "GIF"],
        ["gfx_formats/png/vs_apng.png", "APNG"]
    ]
);

var galleryInt_raw = new imageGallery(gallery_raw, 
    [
        ["gfx_formats/raw/g1.webp", "Необработанные RAW изображения"],
        ["gfx_formats/raw/g2.webp", "Необработанные RAW изображения"],
        ["gfx_formats/raw/g3.webp", "Необработанные RAW изображения"],
    ]
);

var galleryInt_squooshInstall = new imageGallery(gallery_squooshInstall, 
    [
        ["gfx_squoosh/sq_install1.webp", "На компьютере"],
        ["gfx_squoosh/sq_install2.webp", "На Android"]
    ]
);

var galleryInt_squooshPixelization = new imageGallery(gallery_squooshPixelization, 
    [
        ["gfx_squoosh/sq_pixel1.webp", "Без пикселизации"],
        ["gfx_squoosh/sq_pixel2.webp", "С пикселизацией"]
    ]
);


function createGraph(targetElement, dataset) {
    let graphTable = document.createElement('table');
    let maxValue = dataset[0][1];
    dataset.forEach(entry => {
        let currentRow        = document.createElement('tr');
        let td_name           = document.createElement('td');
        let td_valueContainer = document.createElement('td');
        let td_valueBar       = document.createElement('graphbar');
        let percentage = Math.round(entry[1] / maxValue * 1000) / 10 + "%";
        td_valueBar.style.width = percentage;
        td_name.innerHTML = entry[0] + "<br>" + percentage;
        td_valueContainer.appendChild(td_valueBar);
        currentRow.appendChild(td_name);
        currentRow.appendChild(td_valueContainer);
        graphTable.appendChild(currentRow);
    });
    targetElement.appendChild(graphTable);
}

let comparisonLosslessGraph = createGraph(comparisonLosslessGraphContainer,
    [
        ["BMP" , 9607],
        ["PNG" , 3418],
        ["WebP", 2543],
        ["AVIF", 2383],
    ]
);

/////////////////////////////////////

document.addEventListener('DOMContentLoaded',  () => {
    comparisonTest.resizeImages();
    titleScreen_reelContainer.style.animation = "anim_titleScreen_reelScroll 60s 2s linear infinite";
    for (let page of pageElements) {
        page.scrollTo(0, 0);
    }
});

document.addEventListener('click', (event) => {
    if (activeSelectX && !event.path.includes(activeSelectX.element_list) && !event.path.includes(activeSelectX.element_topContainer)) {
            activeSelectX.setState(false);
    }
});

window.onresize = () => {
    detectMobile();
    comparisonTest.resizeImages();
};

/////////////////////////////////////

detectMobile();
goToPage(0);

/////////////////////////////////////
