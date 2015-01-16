/** Created by Leo on 12/01/2015. */
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
  .directive('dueItem', ['$http','Utilities','Modal', function ($http, Utilities, Modal) {
      return {
          restrict: 'E',
          templateUrl: 'components/due-item/due-item.html',
          scope: {thing: '=ngModel', active:'='},
          link: function (scope) {
            var now = (new Date()).getTime();
            var dt = new Date(scope.thing.due_date);
            var d = dt.getTime();

            var refreshItemClass = function() {
              var paid = scope.isPaid();
              // pagato in anticipo o adesso
              if (d >= now && paid) scope.class = 'thing-light-success';
              // pagato
              else if (d < now) scope.class = paid ? 'thing-success' : 'thing-danger';
            };

            var getInfoForPay = function() {
              return {
                title: scope.thing.name,
                desc: scope.thing.info
              };
            };

            var modalPay = Modal.confirm.pay(getInfoForPay(), function(state) {
              scope.thing.state.push(state);
              refreshItemClass();
              $http.put('/api/things/'+scope.thing._id, scope.thing);
            });

            var modalDelete = Modal.confirm.delete(function(thing) {
              scope.$parent.deleteThing(thing);
            });


            scope.deleteThing = function() {
              modalDelete(scope.thing.name, scope.thing);
            };

            scope.isOverPaid = function() {
              return (d<now && !scope.isPaid());
            };

            scope.getDateStr = function (d) {
              if (!d) d=dt;
              return Utilities.getDateStr(d);
            };

            scope.getStateDateStr = function(state) {
              return Utilities.getDateStr(state.date);
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

            scope.getStyle = function() {
              return (scope.active && scope.$parent.editor_opened) ? { 'background-color' : 'cadetblue' } : undefined;
            };

            scope.pay = function() {
              var state = {type:'', desc:'', date:(new Date()).getTime(), value:scope.getToPaidValue()};
              modalPay(state);
            };

            scope.toggleThing = function() {
              scope.details = !scope.details;
            };

            scope.deleteState = function(state){
              _.remove(scope.thing.state, {_id: state._id});
              Utilities.refreshThing(scope.thing);
            };

            refreshItemClass();
          }
      }
  }]);
