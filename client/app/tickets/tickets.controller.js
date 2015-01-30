/* Created by Leo on 29/01/2015. */
'use strict';

angular.module('dueAppApp')
  .controller('TicketsCtrl', function ($scope, $rootScope, $http, $timeout, Modal, Utilities, Logger) {
    $scope.editor_opened = false;
    $scope.tickets = [];

    var loadTickets = function() {
      if ($rootScope.loading) return;
      $rootScope.loading = true;
      $http.get('/api/things', { params: { 'type':'ticket'} } )
        .success(function (tickets){
          $scope.tickets = tickets;
          Utilities.sync($scope.tickets);
        })
        .error(function(err){
          Logger.toastError("Errore nella richiesta delle note",JSON.stringify(err));
        }).then(function() {
          $rootScope.loading = false;
        });
    };
    var modalDelete = Modal.confirm.delete(function(ticket) {
      $http.delete('/api/tickets/' + ticket._id)
        .success(function() {
          $scope.currentTicket = undefined;
        });
    });
    var checkEditorHeaderStyle = function() {
      $('.thing-editor-header').css('display','block');
    };

    var refreshContentStyle = function() {
      if ($scope.editor_opened)
        checkEditorHeaderStyle();
      var h = $('.item-editor').outerHeight() + $('.navbar').outerHeight() + 20;
      if (h<71) h=71;
      $scope.content_style = {'padding-top': h + 'px'};
    };


    $scope.$on('$destroy', function () {
      Utilities.unsync();
    });
    $scope.$watch('editor_opened', function(){
      $timeout(function() {
        refreshContentStyle();
      });
    });
    $scope.setTicket = function(ticket) {
      $scope.currentTicket = ticket;
    };
    $scope.deleteTicket = function() {
      modalDelete($scope.ticket.name, $scope.ticket);
    };
    $scope.createNewThing = function(focus) {
      $scope.currentTicket = {
        name: '',
        info: '',
        type: 'ticket'
      };
      if (focus) $scope.selectFirstControl();
    };
    $scope.selectFirstControl = function() {
      $timeout(function() {
        $("#first-control").focus();
      });
    };
    $scope.toggleEditor = function() {
      $scope.editor_opened=!$scope.editor_opened;
      if ($scope.editor_opened)
        $scope.createNewThing(true);
    };

    loadTickets();
    refreshContentStyle();
  });
