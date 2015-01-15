'use strict';

angular.module('dueAppApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, Modal) {
    // Use the User $resource to fetch all users
    $scope.users = User.query();

    var modalDelete = Modal.confirm.delete(function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    });

    $scope.delete = function(user) {
      modalDelete(user.name, user);
    };

    $scope.isMe = function(user) {
       return (user._id==Auth.getCurrentUser()._id);
    };
  });
