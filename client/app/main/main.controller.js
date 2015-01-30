'use strict';

angular.module('dueAppApp')
  .controller('MainCtrl', function ($scope, $http, $timeout, $window, socket, Utilities) {
    $scope.menu = [{
      icon: 'glyphicon-tasks',
      link: '/due'
    },{
      icon: 'glyphicon-shopping-cart',
      link: '/list'
    },{
      icon: 'glyphicon-tags',
      link: '/tickets'
    }];
  });
