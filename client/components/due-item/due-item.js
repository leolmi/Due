/** Created by Valentina on 12/01/2015. */
'use strict';

angular.module('dueAppApp')
  .filter('oldThings', function() {
    return function (things) {
      var result = [];
      var today = (new Date()).getTime();
      for (var i = 0, max=things.length; i <max ; i++) {
        if ((new Date(things[i].due_date)).getTime() <= today) {
          result.push(things[i]);
        }
      }
      return result;
    }
  })
  .filter('futureThings', function() {
    return function (things) {
      var result = [];
      var today = (new Date()).getTime();
      for (var i = 0, max=things.length; i <max ; i++) {
        if ((new Date(things[i].due_date)).getTime() > today) {
          result.push(things[i]);
        }
      }
      return result;
    }
  })
  .directive('dueItem', ['Utilities', function (Utilities) {
      return {
          restrict: 'E',
          templateUrl: 'components/due-item/due-item.html',
          scope: {thing: '=ngModel', active:'='},
          link: function (scope) {
            var now = (new Date()).getTime();
            var dt = new Date(scope.thing.due_date);
            var d = dt.getTime();

            scope.deleteThing = function() {
              if (!confirm('Eliminare l\'elemento: '+scope.thing.name+'?')) return;
              scope.$parent.deleteThing(scope.thing);
            };

            scope.isOverPaid = function() {
              return (d<now && !scope.isPaid());
            };

            scope.getDateStr = function () {
              return Utilities.getDateStr(dt);
            };

            scope.isPaid = function() {
              if (!scope.thing.state || !scope.thing.state.length) return false;
              var paid_val = scope.getPaidValue();
              return paid_val>=scope.thing.value;
            };

            scope.getToPaidValue = function() {
              var paid_val = scope.getPaidValue();
              return (paid_val<scope.thing.value) ? scope.thing.value-paid_val : 0;
            };

            scope.getPaidValue = function() {
              var paid_val = 0;
              if (scope.thing && scope.thing.state && scope.thing.state.length) {
                scope.thing.state.forEach(function (s) {
                  paid_val += s.value;
                });
              }
              return paid_val;
            };

            scope.getDaysToDue = function() {
              var _MS_PER_DAY = 1000 * 60 * 60 * 24;
              var timeDiff = d - now;
              return Math.floor(timeDiff / _MS_PER_DAY)+1;
            };


            //var paid = (scope.thing.state && scope.thing.state.length);
            var paid = scope.isPaid();
            var s = '';
            // pagato in anticipo o adesso
            if (d>=now && paid) s='\'thing-light-success\':true';
            // pagato
            else if (d<now) s= paid ? '\'thing-success\':true' : '\'thing-danger\':true';

            //if (scope.active) s = Utilities.strAppend(style, '\'thing-active\':true');
            scope.thing_style = '{'+s+'}';

            scope.getStyle = function() {
              return (scope.active && scope.$parent.editor_opened) ? { 'background-color' : 'cadetblue' } : undefined;
            };

          }
      }
  }]);
