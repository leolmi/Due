/**
 * Created by olmi on 13/01/2015.
 */
'use strict';

angular.module('dueAppApp')
  .factory('Utilities', ['$http','$log','socket', function($http,$log,socket) {
    var syncUpdates = function(items) {
      unsyncUpdates();
      $log.log('Connette al socket');
      socket.syncUpdates('thing', items);
    };

    var unsyncUpdates = function() {
      $log.log('Sconnette dal socket');
      socket.unsyncUpdates('thing');
    };

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
      //alert('passa da qui!');
      //if (!thing || !thing._id) return;

      $http.put('/api/things/'+thing._id, thing)
        .success(function(){
          if (next) next();
        })
        .error(function(err){
          alert('Errore:'+JSON.stringify(err));
        });
    };

    var useInfos  = function(next) {
      $http.get('/api/infos')
        .success(function (infos) {
          infos.expired = [];
          $http.get('/api/things/expired')
            .success(function(things){
              infos.expired = things;
            })
            .then(function() {
              next(undefined, infos);
            });

        })
        .error(function() {
          next(err);
        });
    }
    /**
     * Restituisce l'entità della somma già corrisposta
     * @param thing
     * @returns {number}
     */
    var getPaidValue = function(thing) {
      var paid_val = 0;
      if (thing && thing.state && thing.state.length) {
        thing.state.forEach(function (s) {
          paid_val += s.value;
        });
      }
      return paid_val;
    };
    /**
     * Restituisce vero se è stata pagata una somma pari o superiore a quella richiesta
     * @param thing
     * @returns {boolean}
     */
    var isPaid = function(thing) {
      var paid_val = getPaidValue(thing);
      return paid_val>=thing.value;
    };
    /**
     * Restituisce l'entità della somma ancora da corrispondere
     * @returns {number}
     */
    var getToPayValue = function(thing) {
      var paid_val = getPaidValue(thing);
      return (paid_val<thing.value) ? thing.value-paid_val : 0;
    };
    /**
     * Calcola il totale rimasto da corrispondere
     * @param things
     * @returns {number}
     */
    var calcTotalToPay = function(things){
      var tot=0;
      if (things && things.length)
        things.forEach(function(t) {
          tot += getToPayValue(t);
        });
      return tot;
    };

    return {
      sync: syncUpdates,
      unsync: unsyncUpdates,
      // Restituisce la data in formato stringa
      getDateStr: getDateStr,
      // aggiunge la stringa tenuto conto del separatore
      strAppend: strAppend,
      // Aggiorna la cosa
      refreshThing: refreshThing,
      // Carica le informazioni
      useInfos: useInfos,
      // Restituisce l'entità della somma ancora da corrispondere
      getToPayValue:getToPayValue,
      // Restituisce vero se è stata pagata una somma pari o superiore a quella richiesta
      isPaid:isPaid,
      // Restituisce l'entità della somma già corrisposta
      getPaidValue:getPaidValue,
      // Calcola il totale rimasto da corrispondere
      calcTotalToPay:calcTotalToPay
    }
  }]);
