window.onload  = function () {
    AppJS.ready();
};

var AppJS = {

    ready: function () {
        AppJS.handlers();
        AppJS.sliderInit();
        $('.customScroll').mCustomScrollbar({
            scrollInertia: 200,
            theme: 'dark',
            scrollbarPosition: 'outside'
        });
    },

    handlers: function () {
        $('.choiceMethod li').on(    'click',   function()  { AppJS.callMethod($(this)); });
        $('.showCallBack').on(       'click',   function()  { AppJS.switchCallBack(); });
        $('.callBackForm button').on('click',   function(e) { AppJS.ajaxSubmit(e, $(this)); });
        $('.gibBtn, .up').on(        'click',   function()  { AppJS.rotateSite(); });
        $('.changeControl').on(      'click',   function(e) { AppJS.changeControl(e, $(this)); });
        $('.status').on(             'click',   function()  { AppJS.changeItem($(this)); AppJS.calculateSum(); });
        $('.changeItem button').on(  'click',   function()  { AppJS.changeBtn($(this)); AppJS.calculateSum(); });
        $('.openPf').on(             'click',   function()  { AppJS.pfShow(); });
        $('.pfClose').on(            'click',   function()  { AppJS.pfHide(); });
        $('.calculate').on(          'keypress',function(e) { AppJS.onlyPattern(e, $(this)); });
        $('.calculate').on(          'input',   function()  { AppJS.calculateSum(); });
        $('#select').on(             'change',  function()  { AppJS.calculateSum(); });
    },

    onlyPattern: function(e, el) {
        var val = el.val() + String.fromCharCode(e.charCode);
        var test = /^[1-9]*$/.test(val);
        if (!test || val.length > 5) {
            e.preventDefault();
        }
    },

    ajaxSubmit: function (e, submit) {
        e.preventDefault();
        var data = submit.closest('form').serializeArray();
        var preloder = $('.preLoader');
        preloder.show();
        $.post('/mail.php', data, function () {
            AppJS.switchCallBack();
            preloder.hide();
        });
    },

    sliderInit: function () {
        var initial = Math.round($('.pfSlide').length / 2) - 1;
        var pfSlider = new Swiper ('.pfSlider', {
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: -180,
            nextButton: '.swiper-next',
            prevButton: '.swiper-prev',
            initialSlide: initial
        });
        AppJS.sliderLevel();
        pfSlider.on('SlideChangeStart', function () {
            AppJS.sliderLevel();
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
        var catalog = status.closest('.catalog');
        if (btn.hasClass('ok')) {
            btn.closest('.design').find('.active').removeClass('active');
            status.removeClass('noChecked').addClass('checked');
            catalog.removeClass('showQuestion');
            setTimeout(function () {
                catalog.addClass('showQuestion');
            }, 10);
        } else if (btn.hasClass('no')) {
            catalog.removeClass('showQuestion');
            status.removeClass('checked').addClass('noChecked');
        }
    },

    callMethod: function (li) {
        var name = li.attr('data-target');
        var siblings = li.siblings('li');
        var form = li.closest('.callBack').find('form');
        siblings.removeClass('active');
        li.addClass('active');
        form.attr('id', 'method' + (li.index() + 1));
        form.find('input').removeAttr('name').removeClass('submitField');
        form.find('.' + name).attr('name', name).addClass('submitField');
    },

    changeControl: function (e, control) {
        if ($(e.target).closest('.question').length) return;
        $('.designType').removeClass('checked active');
        control.addClass('checked active');
        AppJS.calculateSum();
    },

    changeItem: function (status) {
        var changeItem = status.closest('.changeItem');
        status.toggleClass('checked noChecked');
        if (changeItem.hasClass('catalog')) {
            changeItem.toggleClass('showQuestion');
        }
    },

    switchCallBack: function () {
        $('.callBack').toggleClass('show');
    },

    rotateSite: function () {
        $('.wrapper').toggleClass('rotate');
    },

    pfShow: function () {
        $('.portfolio').addClass('pfShow');
    },

    pfHide: function () {
        $('.portfolio').removeClass('pfShow');
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
                var fieldKey = $(this).attr('data-key');
                var val = +$(this).val();
                resTime += params[fieldKey].time * val;
                resPrice += params[fieldKey].price * val;
            }
        });

        var checked = $('.status.checked:not(.noCalculate)');
        checked.each(function () {
            var questionKey = $(this).attr('data-key');
            resTime += params[questionKey].time;
            resPrice += params[questionKey].price;
        });

        if (!isNaN(resPrice)) {
            resPriceBlock.text(Math.round(resPrice) + ' руб.');
        }
        if (!isNaN(resTime)) {
            resTimeBlock.text(Math.round(resTime) + ' дней.');
        }
    }
};


