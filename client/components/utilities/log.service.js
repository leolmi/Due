//'use strict';
//
angular.module('dueAppApp')
    .factory('Logger', function(toastr){
    var factory = {};

    factory.toastOk = function(content, header){
        toastr.success(header, content, getToastrSettings());
    }

    factory.toastError = function(content, header){
        toastr.error(header, content, getToastrSettings());
    }

    function getToastrSettings(){
        return {
            allowHtml: true,
            closeButton: false,
            closeHtml: '<button>&times;</button>',
            containerId: 'toast-container',
            extendedTimeOut: 1000,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            messageClass: 'toast-message',
            positionClass: 'toast-bottom-right',
            tapToDismiss: true,
            timeOut: 5000,
            titleClass: 'toast-title',
            toastClass: 'toast'
        }
    }


    return factory;
});
