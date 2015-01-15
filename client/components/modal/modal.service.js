'use strict';

angular.module('dueAppApp')
  .factory('Modal', function ($rootScope, $modal, $templateCache) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Conferma Eliminazione',
                html: '<p>Sicuro di voler eliminare <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Elimina',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Annulla',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        },

        /**
         * Aggiunge il pagamento
         * @param add
         */
        pay: function(info, add) {
          add = add || angular.noop;

          /**
           * Apre il form modale
           * @param thing
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
              payModal;


            payModal = openModal({
              modal: {
                dismissable: true,
                title: info.title,
                desc: info.desc,
                state: args[0],
                template: 'components/payment/payment.html',
                buttons: [{
                  classes: 'btn-success',
                  text: 'OK',
                  click: function(e) { payModal.close(e); }
                }, {
                  classes: 'btn-warning',
                  text: 'Annulla',
                  click: function(e) { payModal.dismiss(e); }
                }],
                openDate: function(event) {
                  event.preventDefault();
                  event.stopPropagation();
                  this.opened = true;
                }
              }
            }, 'modal-standard');

            payModal.result.then(function(event) {
              add.apply(event, args);
            });
          };
        }
      }
    };
  });
