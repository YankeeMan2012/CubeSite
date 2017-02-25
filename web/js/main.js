window.onload  = function () {
    AppJS.ready();
};

var AppJS = {

    ready: function () {
        AppJS.handlers();
    },

    handlers: function () {
        $('.choiceMethod li').on('click', function()  { AppJS.callMethod($(this)); });
        $('.gibBtn, .second').on('click', function()  { AppJS.rotateSite(); });
    },

    callMethod: function (li) {
        var siblings = li.siblings('li');
        var form = li.closest('.callBack').find('form');
        siblings.removeClass('active');
        li.addClass('active');
        form.attr('id', 'method' + (li.index() + 1));
    },

    rotateSite: function () {
        $('body').toggleClass('rotate');
    }

 
};


