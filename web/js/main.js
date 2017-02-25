window.onload  = function () {
    AppJS.ready();
};

var AppJS = {

    ready: function () {
        AppJS.handlers();
    },

    handlers: function () {
        $('.choiceMethod li').on('click', function()  { AppJS.callMethod($(this)); });
        $('.showCallBack').on('click', function()  { AppJS.switchCallBack(); });
        $('.callBackForm button').on('click', function(e)  { AppJS.ajaxSubmit(e, $(this)); });
        $('.gibBtn, .up').on('click', function()  { AppJS.rotateSite(); });
        $('.changeControl').on('click', function()  { AppJS.changeControl($(this)); });
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

    changeControl: function (control) {
        var allControl = $('.changeControl');
        if (control.is('.designType')) {
            $('.designType').removeClass('checked');
            control.addClass('checked');
        }
        allControl.removeClass('active');
        control.addClass('active');
    },

    switchCallBack: function () {
        $('.callBack').toggleClass('show');
    },

    rotateSite: function () {
        $('body').toggleClass('rotate');
    }

 
};


