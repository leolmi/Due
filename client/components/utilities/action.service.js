/**
 * Created by leo on 23/01/2015.
 */
'use strict';

angular.module('dueAppApp')
  .factory('Actions', ['$rootScope', function($rootScope) {
    var _actions = [];

    /**
     * Notifica l'azione allo scope principale
     * @param action
     */
    var send = function(action) {
      if (action.route)
        $rootScope.$broadcast(action.route+':'+action.action);
      else if (action)
        $rootScope.$broadcast(action);
    };

    /**
     * Registra una nuova azione
     * @param {String} title
     * @param {String} [target]
     * @param {String} [route]
     * @param {String} [action]
     */
    var register = function(title, route, target, action) {
      var ex = _.find(_actions, {route: route, action: action});
      if (ex) return;
      _actions.push({
        title: title,
        route: route,
        target: target,
        action: action
      });
    };

    /**
     * Restituisce le azioni registrate
     * @param {Function} [filter]
     */
    var getActions = function(filter) {
      if (filter)
        return $.grep(_actions, function(a) { return filter(a); });
      else return _actions;
    };

    return {
      send: send,
      register: register,
      get: getActions
    }
  }]);
