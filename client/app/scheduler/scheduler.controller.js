/* Created by Leo on 23/01/2015. */
'use strict';

angular.module('dueAppApp')
  .controller('SchedulerCtrl', ['$scope','$http','uilogger','Utilities', function ($scope,$http,uilogger,Utilities) {
    $scope.mail = {
      from: 'webapps.leo@gmail.com',
      to:'leo.olmi@gmail.com',
      subject:'Messaggio di test',
      text:'test di messaggio da app: due'
    };


    var loadReminds = function() {
      $rootScope.loading = true;
      $http.get('/api/things', { params: { 'type':'reminder'} } )
        .success(function (reminds){
          $scope.reminds = reminds;
          Utilities.sync($scope.reminds);
        })
        .error(function(err){
          uilogger.toastError("Errore nella richiesta delle scadenze", JSON.stringify(err));
        })
        .then(function() {
          $rootScope.loading = false;
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
          alert('Impossibile inviare il messaggio: '+JSON.stringify(err));
        });
    };

    loadReminds();
  }]);
