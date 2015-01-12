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
      if ($scope.addThing._id) {
        $http.put('/api/things', $scope.newThing);
      }
      else {
        $http.post('/api/things', $scope.newThing);
      }
      $scope.createNewThing();
    };
    $scope.selectThing = function(thing) {
      $scope.newThing = thing;
    };
    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
    $scope.createNewThing = function() {
      $scope.newThing = {
        name: '',
        info: '',
        due_date: new Date(),
        value: 0
      };
    };
    $scope.createNewThing();
    $scope.toggle = function() {
      //TODO: toggle editor
    };
  });
