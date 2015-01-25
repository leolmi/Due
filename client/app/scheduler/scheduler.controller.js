/* Created by Leo on 23/01/2015. */
'use strict';

angular.module('dueAppApp')
  .controller('SchedulerCtrl', ['$scope','$log','$http','Utilities', function ($scope,$log,$http,Utilities) {
    var _loading = false;
    $scope.mail = {
      from: 'webapps.leo@gmail.com',
      to:'leo.olmi@gmail.com',
      subject:'Messaggio di test',
      text:'test di messaggio da app: due'
    };


    var loadReminds = function() {
      $log.log('Richiede i reminds (loading='+(_loading?'vero':'falso')+')');
      if (_loading) return;
      _loading = true;
      $http.get('/api/things', { params: { 'type':'reminder'} } )
        .success(function (reminds){
          $scope.reminds = reminds;
          Utilities.sync($scope.reminds);
          _loading = false;
          $log.log('Finita la richiesta, trovati '+$scope.reminds.length+' remind');
        })
        .error(function(err){
          _loading = false;
          alert('Errori: '+err);
        });
    };

    $scope.$on('$destroy', function () {
      Utilities.unsync();
    });

    $scope.sendMail = function() {
      $http.post('/api/mail', $scope.mail)
        .success(function(){
          alert('Messaggio inviato correttamente');
        })
        .error(function(err){
          alert('Impossibile inviare il messaggio: '+err);
        });
    };

    loadReminds();
  }]);
