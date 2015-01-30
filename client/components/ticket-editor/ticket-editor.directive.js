/**
 * Created by Leo on 29/01/2015.
 */
'use strict';

angular.module('dueAppApp')
  .directive('ticketEditor', function($timeout, $http) {
    return {
      restrict: 'E',
      templateUrl: 'components/ticket-editor/ticket-editor.html',
      scope: {ticket: '=ngModel', eopened:'='},
      link: function (scope) {
        var selectFirstControl = function() {
          $timeout(function() {
            $("#first-control").focus();
          });
        };

        scope.toggle = function() {
          scope.eopened = !scope.eopened;
          if (scope.eopened) {
            scope.$parent.createNewThing(true);
            selectFirstControl();
          }
        };

        scope.addThing = function() {
          if(!scope.ticket) return;
          if (scope.ticket._id) {
            $http.put('/api/things/'+scope.ticket._id, scope.ticket);
          }
          else {
            $http.post('/api/things', scope.ticket);
          }
          scope.$parent.createNewThing(true);
          selectFirstControl();
        };
      }
    }
  });
