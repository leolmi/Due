/** Created by Leo on 12/01/2015. */
'use strict';

angular.module('dueAppApp')
  .directive('listItem', ['$http','Utilities','Modal', function ($http, Utilities, Modal) {
    return {
      restrict: 'E',
      templateUrl: 'components/list-item/list-item.html',
      scope: {item: '=ngModel', deletable: '=', index:'='},
      link: function (scope) {
        scope.deleteElement = function(item) {
          scope.$parent.deleteListItem(item);
        };

        scope.toggleState = function(){
          scope.item.selected = !scope.item.selected;
        };
      }
    }
  }]);
