/**
 * Created by olmi on 15/01/2015.
 */
'use strict';

angular.module('dueAppApp')
  .directive('dueEditor', function($timeout, $http) {
    return {
      restrict: 'E',
      templateUrl: 'components/due-editor/due-editor.html',
      scope: {thing: '=ngModel', eopened:'='},
      link: function (scope, elm, attr) {
        scope.toggle = function() {
          scope.eopened = !scope.eopened;
          if (scope.eopened) {
            scope.$parent.createNewThing(true);
          }
        };

        scope.openDate = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          scope.opened = true;
        };

        scope.addThing = function() {
          if(!scope.thing) return;
          if (scope.thing._id) {
            $http.put('/api/things/'+scope.thing._id, scope.thing);
          }
          else {
            $http.post('/api/things', scope.thing);
          }
          scope.$parent.createNewThing(true);
        };
      }
    }
  });
