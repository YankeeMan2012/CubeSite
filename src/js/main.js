$(document).ready( function () {
    AppJS.ready();
});

var AppJS = {

    ready: function () {
        AppJS.handlers();
        AppJS.sliderInit();
        AppJS.deviceDetect();
        AppJS.calculateSum();

        $('.customScroll').mCustomScrollbar({
            scrollInertia: 200,
            theme: 'dark',
            scrollbarPosition: 'outside'
        });

        var hash = location.hash;
        if (hash === '#callback') {
            AppJS.showModal($('.callBack'));
        } else if (hash === '#portfolio') {
            AppJS.showModal($('.portfolio'));
        } else if (hash === '#recall') {
            AppJS.showModal($('.recall').closest('.navigationWrap'));
        } else if (hash === '#about') {
            AppJS.showModal($('.about').closest('.navigationWrap'));
        }
    },

    handlers: function () {
        $('[data-required]').on(                    'focusout', function()  { ValidForm.checkRequiredVal(this); });
        $('[data-pattern]').on(                     'focusout', function()  { ValidForm.checkFieldToPattern(this); });
        $('.choiceMethod .methodItem').on(          'click',    function()  { AppJS.callMethod($(this)); });
        $('.callBackForm button').on(               'click',    function(e) { AppJS.ajaxSubmit(e, $(this)); });
        $('.gibBtn, .up').on(                       'click',    function()  { $('.wrapper').toggleClass('rotate'); $('body').toggleClass('bottomAnimate'); });
        $('.changeControl').on(                     'click',    function(e) { AppJS.changeControl(e, $(this)); });
        $('.status').on(                            'click',    function()  { AppJS.changeItem($(this)); AppJS.calculateSum(); });
        $('.changeItem button').on(                 'click',    function()  { AppJS.changeBtn($(this)); AppJS.calculateSum(); });
        $('.showCallBack').on(                      'click',    function()  { AppJS.showModal($('.callBack')); });
        $('.openPf').on(                            'click',    function()  { AppJS.showModal($('.portfolio')); });
        $('.openAbout').on(                         'click',    function()  { AppJS.showModal($('.about').closest('.navigationWrap')); });
        $('.openRecall').on(                        'click',    function()  { AppJS.showModal($('.recall').closest('.navigationWrap')); });
        $('.overlay, .closeModal, .pfClose').on(    'click',    function()  { AppJS.hideModal(); });
        $('.calculate, .pubInput, .logoField').on(  'keypress', function(e) { AppJS.onlyPattern(e, $(this)); });
        $('.calculate, .pubInput, .logoField').on(  'input',    function()  { AppJS.calculateSum(); });
        $('.duplicate').on(                         'input',    function()  { AppJS.duplicate($(this)); });
        $('.pubInput, .logoField').on(              'input',    function()  { AppJS.copyToDuplicate($(this)); });
        $('#select').on(                            'change',   function()  { AppJS.calculateSum(); });
        window.onresize =                                       function()  { AppJS.deviceDetect(); };
    },

    onlyPattern: function(e, el) {
        var val = el.val() + String.fromCharCode(e.charCode);
        var test = /^[0-9]*$/.test(val);
        if (!test || val.length > 5) {
            e.preventDefault();
        }
    },

    showModal: function (block) {
        $('.modalBox').addClass('above');
        block.addClass('showModal');
    },

    hideModal: function () {
        $('.modalBox').removeClass('above');
        $('.showModal').removeClass('showModal');
        location.hash = '';
    },

    ajaxSubmit: function (e, submit) {
        e.preventDefault();
        var isValid = ValidForm.validateField(submit.siblings('.submitField'));
        if (isValid) {
            var preLoader = $('.preLoader');
            preLoader.show();
            var forms = submit.closest('form').add('.calculatorForm');
            var data = forms.serializeArray();
            $.post('/mail.php', data, function () {
                AppJS.hideModal($('.callBack'));
                AppJS.showModal($('.thanks'));
                preLoader.hide();
            });
        }
    },

    sliderInit: function () {
        var initial = Math.round($('.pfSlide').length / 2) - 1;
        var pfSlider = new Swiper ('.pfSlider', {
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: -180,
            nextButton: '.swiper-next',
            prevButton: '.swiper-prev',
            initialSlide: initial,
            loop: true,
            breakpoints: {
                400: {
                    spaceBetween: -50
                },
                650: {
                    spaceBetween: -120
                },
            }
        });
        AppJS.sliderLevel();
        pfSlider.on('SlideChangeStart', function () {
            AppJS.sliderLevel();
        });

        new Swiper('.recall', {
            slidesPerView: 1,
            loop: true,
            speed: 1000,
            spaceBetween: 300,
            nextButton: '.nextSlide',
            prevButton: '.prevSlide',
            centeredSlides: true
        });

        new Swiper('.textSlider', {
            slidesPerView: 'auto',
            autoplay: 2000,
            loop: true,
            speed: 2000
        });

    },

    sliderLevel: function () {
        $('.pfSlide').removeClass('level3 level4 level5');
        var next2 = $('.swiper-slide-next').next();
        var prev2 = $('.swiper-slide-prev').prev();
        var next3 = next2.next();
        var prev3 = prev2.prev();
        var next4 = next3.next();
        var prev4 = prev3.prev();
        next2.add(prev2).addClass('level3');
        next3.add(prev3).addClass('level4');
        next4.add(prev4).addClass('level5');
    },

    changeBtn: function (btn) {
        var status = btn.closest('.changeItem').find('.status');
        var question = btn.closest('.question');
        var questionBox = status.closest('.questionBox');
        var isPay = question.hasClass('onlinePay');
        if (btn.hasClass('ok')) {
            if (isPay) question.removeClass('noPay').addClass('pay');
            btn.closest('.design').find('.active').removeClass('active');
        } else if (btn.hasClass('no') && isPay) {
            question.removeClass('pay').addClass('noPay');
        }
        questionBox.removeClass('showQuestion');
        setTimeout(function () {
            questionBox.addClass('showQuestion');
        }, 10);
    },

    callMethod: function (item) {
        var name = item.attr('data-target');
        var siblings = item.closest('.choiceMethod').find('.methodItem');
        var form = item.closest('.callBack').find('form');
        siblings.removeClass('active');
        item.addClass('active');
        form.attr('id', 'method' + (item.closest('.methodWrap').index() + 1));
        form.find('input').removeAttr('name').removeClass('submitField').val('');
        form.find('.' + name).attr('name', name).addClass('submitField');
        ValidForm.removeInvalid(form.find('.' + name));
    },

    changeControl: function (e, control) {
        if ($(e.target).closest('.question').length) return;
        $('.designType').removeClass('checked active');
        control.addClass('checked active');
        AppJS.calculateSum();
    },

    changeItem: function (status) {
        var changeItem = status.closest('.changeItem');
        changeItem.find('.onlinePay').removeClass('pay noPay');
        status.toggleClass('checked noChecked');
        if (changeItem.hasClass('questionBox')) {
            changeItem.toggleClass('showQuestion');
        }
    },

    copyToDuplicate: function (origin) {
        var val = origin.val();
        var realField = $('.' + origin.attr('data-duplicate'));
        realField.val(val);
    },

    duplicate: function (duplicate) {
        var val = duplicate.val();
        var realField = $('.' + duplicate.attr('data-real'));
        realField.val(val);
    },

    calculateSum: function () {
        var resPriceBlock = $('.price span');
        var resTimeBlock = $('.deadline span');
        var resPrice = 0;
        var resTime = 0;

        var adaptive = $('.adaptive');
        if (adaptive.hasClass('checked')) {
            var adaptiveKey = adaptive.attr('data-key');
            resTime += params[adaptiveKey].time;
            resPrice += params[adaptiveKey].price;
        }

        var engineVal = $('#select').val();
        resTime += params.engine[engineVal].time;
        resPrice += params.engine[engineVal].price;

        var calculateField = $('.calculate');
        calculateField.each(function () {
            var changeItem = $(this).closest('.changeItem');
            var status = changeItem.find('.status');
            var active = changeItem.find('.individual');
            if (status.hasClass('checked') || $(this).hasClass('pageNum') && active.hasClass('checked')) {
                var fieldKey = changeItem.attr('data-key');
                var val = +$(this).val();
                resTime += params[fieldKey].time * val;
                resPrice += params[fieldKey].price * val;
            }
        });

        var pubInput = $('.pubInput');
        var publicationBox = pubInput.closest('.publication');
        var publicKey = publicationBox.attr('data-key');
        var publicNum = publicationBox.find('.publicNum').val();
        var words = publicationBox.find('.words').val();
        if (publicationBox.find('.status').hasClass('checked')) {
            var val = +publicNum * (+words / 1000);
            resTime += params[publicKey].time * val;
            resPrice += params[publicKey].price * val;
        }

        var logoField = $('.logoField');
        var logotype = logoField.closest('.logotype');
        var logoKey = logotype.attr('data-key');
        var logoVal = +logotype.find('.devLogo').val();
        if (logotype.find('.status').hasClass('checked')) {
            resTime += params[logoKey].time * logoVal;
            resPrice += params[logoKey].price * logoVal;
        }

        var checked = $('.status.checked:not(.noCalculate)');
        checked.each(function () {
            var questionKey = $(this).attr('data-key');
            resTime += params[questionKey].time;
            resPrice += params[questionKey].price;
        });

        var onlinePay = $('.onlinePay.pay');
        if (onlinePay.length) {
            var payKey = onlinePay.attr('data-key');
            resTime += params[payKey].time;
            resPrice += params[payKey].price;
        }

        if (!isNaN(resPrice)) {
            $('.priceInput').val(Math.round(resPrice));
            resPriceBlock.text(Math.round(resPrice) + ' руб.');
        }
        if (!isNaN(resTime)) {
            $('.deadlineInput').val(Math.round(resTime));
            resTimeBlock.text(Math.round(resTime) + ' дней.');
        }
    },

    deviceDetect: function () {
        var user = detect.parse(navigator.userAgent);
        var deviceFamily = user.device.family;
        var osFamily = user.os.family;
        AppJS.isBadBrowser = (deviceFamily === 'iPhone' || deviceFamily === 'iPad' || osFamily === 'iOS');
        AppJS.appleStyle();
    },

    appleStyle: function () {
        var body = $('body');
        var cube = $('.cube, .side, .modalBox');
        if (AppJS.isBadBrowser) {
            var height = window.innerHeight;
            body.addClass('apple');
            cube.css({'height': height});
        } else {
            body.removeClass('apple');
            cube.css({'height': '100vh'});
        }
    }
};

var ValidForm = {
    patterns: {
        email: /^\w+([\.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/,
        skype: /^[a-zA-Z]{3,31}$/,
        whatsapp: /^\+?[\d]{1,3}(-|\s)?\(?[\d]{1,3}\)?(-|\s)?[\d](-|\s)?[\d](-|\s)?[\d](-|\s)?[\d](-|\s)?[\d](-|\s)?[\d](-|\s)?\d$/,
        mobile: /^\+?[\d]{1,3}(-|\s)?\(?[\d]{1,3}\)?(-|\s)?[\d](-|\s)?[\d](-|\s)?[\d](-|\s)?[\d](-|\s)?[\d](-|\s)?[\d](-|\s)?\d$/,
    },
    message: {
        emptyField: 'Поле не может быть пустым',
        email: 'Неверный формат Email',
        skype: 'Неверный формат Skype',
        whatsapp: 'Неверный формат WhatSapp',
        mobile: 'Неверный формат ntktajyf'
    },
    getError: function(str) { 
        return '<p class="error">'+str+'</p>'; 
    },
    checkRequiredVal: function(el) {
        var form = $(el).closest('.callBackForm');
        ValidForm.removeInvalid(el);
        if($(el).val().trim() === "") {
            var error = ValidForm.getError(ValidForm.message.emptyField);
            form.addClass('invalid').append(error);
        }
    },
    checkFieldToPattern: function(el) {
        var form = $(el).closest('.callBackForm');
        var pattern = $(el).attr('data-pattern');
        if( !$(el).val() ) return false;
        var val = $(el).val();
        if (!ValidForm.patterns[pattern].test(val)) {
            if(!form.hasClass('invalid')) {
                var error = ValidForm.getError(ValidForm.message[pattern]);
                form.addClass('invalid').append(error);
            }
        } else {
            ValidForm.removeInvalid(el);
        }
    },
    removeInvalid: function (elem) {
        $(elem).closest('.invalid').removeClass('invalid').find('p.error').remove();
    },
    validateField: function (field) {
        var isValid = true;
        ValidForm.removeInvalid(field);
        field.focusout();
        if (field.closest('.invalid').length) {
            isValid = false;
        }
        return isValid;
    }
};

