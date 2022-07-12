window["tmripple"] =
 (function(modules) { // webpackBootstrap
 	// The module cache
 	var installedModules = {};

 	// The require function
 	function __webpack_require__(moduleId) {

 		// Check if module is in cache
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		// Create a new module (and put it into the cache)
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};

 		// Execute the module function
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

 		// Flag the module as loaded
 		module.l = true;

 		// Return the exports of the module
 		return module.exports;
 	}


 	// expose the modules object (__webpack_modules__)
 	__webpack_require__.m = modules;

 	// expose the module cache
 	__webpack_require__.c = installedModules;

 	// define getter function for harmony exports
 	__webpack_require__.d = function(exports, name, getter) {
 		if(!__webpack_require__.o(exports, name)) {
 			Object.defineProperty(exports, name, {
 				configurable: false,
 				enumerable: true,
 				get: getter
 			});
 		}
 	};

 	// getDefaultExport function for compatibility with non-harmony modules
 	__webpack_require__.n = function(module) {
 		var getter = module && module.__esModule ?
 			function getDefault() { return module['default']; } :
 			function getModuleExports() { return module; };
 		__webpack_require__.d(getter, 'a', getter);
 		return getter;
 	};

 	// Object.prototype.hasOwnProperty.call
 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

 	// __webpack_public_path__
 	__webpack_require__.p = "";

 	// Load entry module and return exports
 	return __webpack_require__(__webpack_require__.s = 0);
 })

 ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Default Settings
var settings = {
    area: "",
    color: "rgba(255, 255, 255, 0.2)",
    offsetEl: null,
    eventListener: "click",
    mouseMove: false
};

/**
 * @description Where the magic happens
 * @param {object} e
 * @param {string} rippleColor
 * @param {string} eventListener
 */
function ripple(e, rippleColor, eventListener) {
    var clickedEl = e.currentTarget;
    var PageX = eventListener.match(/touch/) ? e.changedTouches[0].pageX : e.clientX;
    var PageY = eventListener.match(/touch/) ? e.changedTouches[0].pageY : e.clientY;
    var btnWidth = clickedEl.clientWidth;
    var el = clickedEl.getBoundingClientRect();
    var rippleOffset = settings.offsetEl ? settings.offsetEl.clientHeight : 0;
    var btnOffsetTop = el.top + rippleOffset;
    var btnOffsetLeft = el.left;
    var posMouseX = PageX;
    var posMouseY = PageY + rippleOffset;
    var rippleX = posMouseX - btnOffsetLeft;
    var rippleY = posMouseY - btnOffsetTop;

    var baseCSS = "\n          position: absolute;\n          width: " + btnWidth * 2 + "px;\n          height: " + btnWidth * 2 + "px;\n          border-radius: 50%;\n          transition: transform 700ms, opacity 700ms;\n          transition-timing-function: cubic-bezier(0.250, 0.460, 0.450, 0.940);\n          background: " + rippleColor + ";\n          background-position: center;\n          background-repeat: no-repeat;\n          background-size: 100%;\n          left: " + (rippleX - btnWidth) + "px;\n          top: " + (rippleY - btnWidth) + "px;\n          transform: scale(0);\n          pointer-events: none;\n      ";

    // Prepare the dom
    var rippleEffect = document.createElement("span");
    rippleEffect.style.cssText = baseCSS;

    // Add some css for prevent overflow errors
    clickedEl.style.overflow = "hidden";

    // Check if the element is not static because the ripple is in absolute
    if (window.getComputedStyle(clickedEl).position === "static") {
        clickedEl.style.position = "relative";
    }

    // Check for the mousemove event
    if (settings.mouseMove) {
        settings.mouseMove = false;
        return;
    }

    clickedEl.appendChild(rippleEffect);

    // start animation
    requestAnimationFrame(function () {
        rippleEffect.style.cssText = baseCSS + " transform: scale(1); opacity: 0;";
    });

    setTimeout(function () {
        rippleEffect.remove();
    }, 700);
}

/**
 * @description Prevent ripple when scrolling (Mobile Only)
 * @param {string} eventListener
 */
function onDrag(eventListener) {
    if (eventListener === "touchend") {
        document.getElementsByTagName("body")[0].addEventListener("touchmove", function () {
            settings.mouseMove = true;
        });
    }
}

function attachRipple(els, rippleColor, eventListener) {
    for (var i = 0; i < els.length; i += 1) {
        var currentBtn = els[i];
        currentBtn.addEventListener(eventListener, function (e) {
            return ripple(e, rippleColor, eventListener);
        });
    }
}

function attachRippleToAttribute(area, rippleColor, eventListener) {
    var attributeEl = document.querySelectorAll(area + " [data-animation='ripple']");

    if (attributeEl.length > 0) {
        attachRipple(attributeEl, rippleColor, eventListener);
    } else {
        throw new Error('not found any element with data-animation="ripple"');
    }
}

function attachRippleToSelectors(selectors, rippleColor, eventListener) {
    if (selectors) {
        var selectorsEl = document.querySelectorAll(selectors);
    } else {
        throw new Error("You have to enter at least 1 selector");
    }

    if (selectorsEl.length > 0) {
        attachRipple(selectorsEl, rippleColor, eventListener);
    } else {
        console.warn("No element found with this selector: ", selectors);
    }
}

module.exports = {
    init: function init() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        try {
            var area = settings.area,
                color = settings.color,
                offsetEl = settings.offsetEl,
                eventListener = settings.eventListener;


            area = data.area || area;
            color = data.color || color;
            offsetEl = data.offsetEl ? this.setOffsetEl(data.offsetEl) : offsetEl;
            eventListener = data.eventListener || eventListener;

            onDrag(eventListener);
            attachRippleToAttribute(area, color, eventListener);
        } catch (e) {
            console.warn(e.message);
        }
    },
    attachToSelectors: function attachToSelectors() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        try {
            var elSetting = {
                color: data.color || settings.color,
                eventListener: data.eventListener || settings.eventListener
            };
            var color = elSetting.color,
                eventListener = elSetting.eventListener;


            attachRippleToSelectors(data.selectors, color, eventListener);
        } catch (e) {
            console.warn(e.message);
        }
    },
    setOffsetEl: function setOffsetEl(el) {
        settings.offsetEl = document.querySelector(el);
    },

    ripple: ripple
};

/***/ })
 ]);

tmripple.init();

// PC 전체메뉴
$('.btn_allmenu a').on('click', function(e){
    e.preventDefault();
    $('.box_allmenu').animate({
        right: 0
    });
    $("body").css("overflow", "hidden");
});

// 전체메뉴 닫기
$('.box_allmenu_btn a').on('click', function(e){
    e.preventDefault();
    $('.box_allmenu').animate({
        right: -100 + '%'
    });
    $("body").css("overflow", "inherit");
});

// 전체메뉴 슬라이드
$('.box_allmenu nav > ul > li').on('click', function(){
    if($(this).hasClass('on')) {
        $(this).removeClass('on');
        $(this).find('ul').slideUp();
    } else {
        $(this).siblings().removeClass('on');
        $(this).siblings().find('ul').slideUp();
        $(this).addClass('on');
        $(this).find('ul').slideDown();
    }
});

// 더보기 버튼
$('.box_detail_content > .inner > .box_btn *').on('click', function(){
    $(this).parent().parent().find('.table_data.type_02').addClass('on');
    $(this).parent().parent().find('ul').addClass('on');
});
$('.box_btn.type_more *').on('click', function(){
    $(this).parent().siblings().addClass('on');
});

// 윈도우 팝업
function popup(width, height, url){
    var rtnVal;
    var nWidth = width;
    var nHeight = height;
    var curWidth = document.body.clientWidth;
    var curHeight = document.body.clientHeight;
    
    var nLeft = (document.body.clientWidth / 2) - (nWidth / 2);
    var nTop = (window.screen.height / 2) - (nHeight / 2);
    
    var strOption = '';
    strOption += 'left=' + nLeft + ',';
    strOption += 'top=' + nTop + ',';
    strOption += 'width=' + nWidth + ',';
    strOption += 'height=' + nHeight + ',';
    strOption += 'toolbar=no, status=no, menubar=no, resizable=yes, location=no scrollbars=yes';
    
    rtnVal = strOption;
    return window.open(url, "_blank", rtnVal);
}

// 로그인정보 변경
$('.change button').on('click', function(){
    $(this).parents('.table_info').addClass('on');
    $(this).parent().hide();
});
$('.box_change .box_btn .btn_white').on('click', function(){
    $('.table_info').removeClass('on');
    $('.change').show();
});

// window 스크롤 이벤트
$(window).scroll(function(){
    let winTop = $(window).scrollTop();
    if(winTop > 1000) {
        $('.table_responsive .table_notice').delay(1000).fadeOut();
    }
});

// 자주묻는질문
$('.box_question').on('click', function(e){
    e.preventDefault();
    $(this).parent().siblings().removeClass('on');
    $(this).parent().toggleClass('on');
});

// 파일선택
$('.box_file_input').on('change', function(){
    let files = $(this)[0].files;
            
    for(let i = 0; i < files.length; i++){
        $(this).siblings('.file_value').text(files[i].name);
    }
});

// 지도여닫기
$('.box_info_header').on('click', function(){
    $('.box_infomation').toggleClass('on');
});

// 핀 닫기
$('.box_map_group .close').on('click', function(e){
    e.preventDefault();
    $(this).parent().parent().hide();
});

// 체크박스 전체동의
$("#cbx_chkAll").click(function() {
    if($("#cbx_chkAll").is(":checked")) $("input[name=chk]").prop("checked", true);
    else $("input[name=chk]").prop("checked", false);
});

$("input[name=chk]").click(function() {
    const total = $("input[name=chk]").length;
    const checked = $("input[name=chk]:checked").length;

    if(total != checked) {
        $("#cbx_chkAll").prop("checked", false);
    } else {
        $("#cbx_chkAll").prop("checked", true); 
    }
});
  