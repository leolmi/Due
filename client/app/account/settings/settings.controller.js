'use strict';

angular.module('dueAppApp')
  .controller('SettingsCtrl', function ($scope, $http, User, Auth, Logger) {
    $scope.errors = {};

    $scope.user = Auth.getCurrentUser();

    $scope.updateUser = function() {
      $http.put('/api/users', $scope.user)
        .success(function() {
          Logger.toastOk("Utente aggiornato correttamente.");
        })
        .error(function(err) {
          Logger.toastError("Impossibile aggiornare l'utente!", JSON.stringify(err));
        });
    }

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
  });
