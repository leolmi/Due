/** Created by Valentina on 19/01/2015. */
'use strict';

angular.module('dueAppApp')
  .directive('appFooter', ['$rootScope','Auth', function ($rootScope, Auth) {
    return {
      restrict: 'E', // E-element, A-attribute, EA-element or attribute
      templateUrl: 'components/footer/footer.html', //url del template html
      link: function (scope, element, attrs) {
        //Aggiungere qui la logica di funzionamento
        scope.isLoggedIn = Auth.isLoggedIn;
        scope.isAdmin = Auth.isAdmin;
        scope.infos = $rootScope.infos;
        scope.getCurrentUser = Auth.getCurrentUser;
      }
    }
  }]);
