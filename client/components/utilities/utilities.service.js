/**
 * Created by olmi on 13/01/2015.
 */
'use strict';

angular.module('dueAppApp')
  .factory('Utilities', ['$http', function($http) {
    var getDateStr = function (d) {
      if (d instanceof Date)
        return strFill(d.getDate())+'/'+strFill(d.getMonth()+1)+'/'+d.getFullYear();
      var dt = new Date(d);
      return getDateStr(new Date(dt));
    };

    var strAppend = function(s, v, sep) {
      sep = sep ? sep : ',';
      if (s && s.length)
        s+=sep;
      return s+v;
    };

    var strFill = function(v, tmpl) {
      tmpl = (tmpl) ? tmpl : '00';
      v=''+v;
      if (!v) return tmpl;
      if (v.length>=tmpl.length) return v;
      return tmpl.slice(0, tmpl.length- v.length)+v;
    };

    var refreshThing = function(thing, next) {
      if (!thing || !thing._id) return;
      next = next | angular.noop;
      $http.put('/api/things/'+thing._id, thing)
        .success(function(){
          next();
        });
    };

    return {
      // Restituisce la data in formato stringa
      getDateStr: getDateStr,
      // aggiunge la stringa tenuto conto del separatore
      strAppend: strAppend,
      // Aggiorna la cosa
      refreshThing: refreshThing
    }
  }]);
