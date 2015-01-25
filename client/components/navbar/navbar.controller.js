'use strict';

angular.module('dueAppApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, Auth, Actions) {
    // Inserisc tutti i comandi registrati dai controller
    $scope.menu = Actions.get(function(a) { return a.target=='navbar';});

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.toggleEditor = $scope.$parent.toggleEditor;

    $scope.onPath = function(path) {
      return ($location.path() === path);
    };

    $scope.isVisible = function(item) {
      if ((typeof item.visible)=='function') {
        return item.visible();
      }
      return true;
    };

    $scope.toggle = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    $scope.execAction = function(item) {
      $scope.toggle();
      Actions.send(item);
    };

    $scope.search = function(text) {
        $rootScope.searchtext = text;
    };

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
