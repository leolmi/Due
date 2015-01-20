'use strict';

angular.module('dueAppApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, Auth, Modal) {

    $scope.openModal = function() {
      var e ={ name:'Gigio' };
      $scope.delete('Gigio', e);
    };

    $scope.delete = Modal.confirm.delete(function(obj) {
      alert('Elimina l\'oggetto: '+JSON.stringify(obj));
    });

    $scope.onPath = function(path) {
      return ($location.path() === path);
    };


    //$scope.menu = [{
    //  'glyphicon': 'glyphicon-tasks',
    //  'link': '/due',
    //  'visible': $scope.onPath('/due')
    //},{
    //  'glyphicon': 'glyphicon-shopping-cart',
    //  'link': '/list',
    //  'visible': $scope.onPath('/list')
    //},{
    //  'title': 'Utenti',
    //  'link': '/admin',
    //  'visible': Auth.isAdmin
    //}];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.isVisible = function(item) {
      if ((typeof item.visible)=='function') {
        return item.visible();
      }
      return true;
    };

    //$scope.clickOnItem = function(item){
    //  if ((typeof item.action)=='function') {
    //    item.action();
    //  }
    //};

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

    $scope.toggleEditor = $scope.$parent.toggleEditor;
  });
