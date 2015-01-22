/**
 * Created by olmi on 19/01/2015.
 */
'use strict';

angular.module('dueAppApp')
  .controller('ListCtrl', ['$scope','$http','$timeout','socket','Modal','Utilities', function ($scope, $http, $timeout, socket, Modal, Utilities) {
    var _loading = false;
    $scope.status = { isopen: false };
    $scope.lists = [];

    var initNewItem = function() {
      $scope.new_item = {desc: '', selected:true };
    }

    var loadLists = function() {
      if (_loading) return;
      _loading = true;
      $http.get('/api/things', { params: { 'type':'list'} } )
        .success(function (lists){
          $scope.lists = lists;
          socket.syncUpdates('thing', $scope.lists);
          _loading = false;
        })
        .error(function(){
          _loading = false;
        });
    };

    var modalCreate = Modal.confirm.newList(function(newlist) {
      $http.post('/api/things', newlist)
        .success(function(list) {
          $scope.currentList = list;
        })
        .error(function(err) {
          alert('Errore: '+err);
        });
    });
    var modalRemove = Modal.confirm.delete(function(list) {
      $http.delete('/api/things/' + list._id)
        .success(function() {
          $scope.currentList = undefined;
        });
    });

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.setList = function(list) {
      $scope.currentList = list;
    };

    $scope.newList = function() {
      modalCreate({ name: '', type: 'list', state:[] });
    };

    $scope.removeList = function(){
      modalRemove($scope.currentList.name, $scope.currentList);
    };

    $scope.addListItem = function() {
      if (!$scope.new_item.desc || !$scope.currentList) return;
      $scope.currentList.state.push($scope.new_item);
      $scope.updateList(function() {
        initNewItem();
      });
    };
    $scope.insertItem = function(e){
      if (e.keyCode==13)
        $scope.addListItem();
    };

    $scope.toggleEditor = function() {
      $scope.editor_opened=!$scope.editor_opened;
      if ($scope.editor_opened)
        $timeout(function() {
          $("#list-editor-input").focus();
        });
    };

    $scope.deleteListItem = function(state) {
      _.remove($scope.currentList.state, {_id: state._id});
      $scope.updateList();
    };

    $scope.updateList = function(next) {
      Utilities.refreshThing($scope.currentList, next);
    };

    initNewItem();
    loadLists();
  }]);
