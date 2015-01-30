/**
 * Created by Leo on 29/01/2015.
 */
'use strict';

angular.module('dueAppApp')
  .directive('ticketItem', ['$rootScope','$http','Logger','Utilities','Modal', function ($rootScope, $http, Logger, Utilities, Modal) {
    return {
      restrict: 'E',
      templateUrl: 'components/ticket-item/ticket-item.html',
      scope: {ticket: '=ngModel', active:'='},
      link: function (scope) {
        var modalDelete = Modal.confirm.delete(function(ticket) {
          scope.$parent.deleteTicket(ticket);
        });

        scope.deleteTicket = function() {
          modalDelete(scope.ticket.name, scope.ticket);
        };

        scope.getStyle = function() {
          return (scope.active && scope.$parent.editor_opened) ? { 'background-color' : 'cadetblue' } : undefined;
        };
      }
    }
  }]);
