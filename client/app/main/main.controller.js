'use strict';

angular.module('dueAppApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if(!$scope.newThing) return;

      $http.post('/api/things', $scope.newThing);
      initNewThing();
    };

    var initNewThing = function() {
      $scope.newThing = {
        name: '',
        info: '',
        due_date: new Date(),
        value: 0
      };
    };

    initNewThing();

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.toggle = function() {
      //TODO: toggle editor
    };
  });
