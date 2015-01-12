/** Created by Valentina on 12/01/2015. */
'use strict';

angular.module('dueAppApp')
    .directive('dueItem', [function () {
        return {
            restrict: 'E',
            templateUrl: 'components/due-item/due-item.html', //url del template html
            scope: {thing: '=ngModel', active:'='},
            link: function (scope, element, attrs) {
              scope.deleteThing = function() {
                alert('da fare!');
              };
            }
        }
    }]);
