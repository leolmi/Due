'use strict';

angular.module('dueAppApp')
  .controller('MainCtrl', function ($scope, $http, socket, Utilities) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if(!$scope.newThing) return;
      resolveDate();
      if ($scope.addThing._id) {
        $http.put('/api/things', $scope.newThing);
      }
      else {
        $http.post('/api/things', $scope.newThing);
      }
      $scope.createNewThing();
    };
    var resolveDate = function() {
      $scope.newThing.due_date = new Date($scope.newThing.date_year+'-'+$scope.newThing.date_month+'-'+$scope.newThing.date_day);
    };
    var loadDate = function(t) {
      if (!t || !t.due_date) return;
      var d = new Date(t.due_date);
      t.date_year = d.getFullYear();
      t.date_month = d.getMonth()+1;
      t.date_day = d.getDate();
    };
    $scope.selectThing = function(thing) {
      loadDate(thing);
      $scope.newThing = thing;
    };
    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
    $scope.createNewThing = function() {
      var t = {
        name: '',
        info: '',
        due_date: new Date(),
        value: 0
      };
      loadDate(t);
      $scope.newThing = t;
    };
    $scope.createNewThing();

    $scope.editor_opened = false;

    $scope.toggle = function() {
      $scope.editor_opened = !$scope.editor_opened;
    };

    $scope.getToday = function() {
      return Utilities.getDateStr(new Date());
    };
  });
