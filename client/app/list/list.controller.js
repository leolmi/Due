/**
 * Created by olmi on 19/01/2015.
 */
'use strict';

angular.module('dueAppApp')
  .controller('ListCtrl', ['$scope','$http','$timeout','$log','Actions','Modal','Utilities', function ($scope, $http, $timeout, $log, Actions, Modal, Utilities) {
    var _loading = false;
    $scope.status = { isopen: false };
    $scope.lists = [];

    Actions.register('Seleziona Tutti','/list','navbar','select-all');
    Actions.register('Imposta come Default','/list','navbar','set-default');
    Actions.register('Elimina Lista','/list','navbar','delete');

    var initNewItem = function() {
      $scope.new_item = {desc: '', selected:true };
    };
    var loadLists = function() {
      $log.log('Richiede le liste (loading='+(_loading?'vero':'falso')+')');
      if (_loading) return;
      _loading = true;
      $http.get('/api/things', { params: { 'type':'list'} } )
        .success(function (lists){
          $scope.lists = lists;
          Utilities.sync($scope.lists);
          _loading = false;
          $log.log('Finita la richiesta, trovate '+$scope.lists.length+' liste');
          $scope.currentList = getDefaultList();
        })
        .error(function(err){
          _loading = false;
          alert('Errori: '+err);
        });
    };

    var getDefaultList = function() {
      var result = $.grep($scope.lists, function(l) { return l.active; });
      if (result && result.length)
        return result[0];
      if ($scope.lists.length)
        return $scope.lists[0];
      return undefined;
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

    $scope.selectAll = function() {
      if (!$scope.currentList) return;
      $scope.currentList.state.forEach(function(s) {
          s.selected = true;
        });
      $scope.updateList();
    };

    $scope.$on('/list:select-all', function () {
      $scope.selectAll();
    });

    $scope.$on('/list:set-default', function () {
      $scope.lists.forEach(function (l) {
        if (l.active && l._id != $scope.currentList._id) {
          l.active = false;
          Utilities.refreshThing(l);
        }
      });
      if ($scope.currentList && !$scope.currentList.active) {
        $scope.currentList.active = true;
        $scope.updateList();
      }
    });

    $scope.$on('/list:delete', function () {
      if (!$scope.currentList) return;
      modalRemove($scope.currentList.name, $scope.currentList);
    });

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.$on('$destroy', function () {
      Utilities.unsync();
    });

    $scope.setList = function(list) {
      $scope.currentList = list;
    };

    $scope.newList = function() {
      modalCreate({ name: '', type: 'list', state:[] });
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
