/**
 * Created by olmi on 13/01/2015.
 */
'use strict';

angular.module('dueAppApp')
  .factory('Utilities', function() {
    var getDateStr = function (d) {
      return strFill(d.getDate())+'/'+strFill(d.getMonth()+1)+'/'+d.getFullYear();
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

    var getVersion = function() {
      return '1.0.3';
    };

    return {
      // Restituisce la data in formato stringa
      getDateStr: getDateStr,
      // aggiunge la stringa tenuto conto del separatore
      strAppend: strAppend,
      // Restituisce la versione
      getVersion: getVersion
    }
  });
