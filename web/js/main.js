window.onload  = function () {
    AppJS.ready();
};

var AppJS = {

    ready: function () {
        AppJS.handlers();
    },

    handlers: function () {
        $('body').on('click', function()  { AppJS.test( $(this) ); });
    },

    test: function (body) {
        console.log(body);
    }

 
};


