/**
 * Created by olmi on 19/01/2015.
 */
'use strict';

angular.module('dueAppApp')
  .directive('infiniteScroll', function($window) {
    return {
      link: function (scope, elm, attr) {
        var $b = $("body");
        angular.element($window).on("scroll", function(event) {
          scope.$apply(updateScroll());
        });

        var updateScroll = function() {
          var t = $b.scrollTop();
          var OH = $b.height();
          if (t==0) scope.$apply(attr.infiniteScrollUp);
          else if (t+$window.innerHeight>=OH-20) scope.$apply(attr.infiniteScroll);
        };

        scope.$on("$destroy", function() {
          $(window).off("scroll");
        });
      }
    }
  })
  .controller('DueCtrl', function ($scope, $rootScope, $http, $log, $timeout, $window, Logger, Utilities) {
    var _getup = false;
    var _items = { first:undefined, last:undefined };

    $scope.editor_opened = false;
    $scope.things = [];

    var refreshInfos = function() {
      Utilities.useInfos(function(err, infos) {
        $rootScope.infos = infos;
      });
    };

    var loadThings = function() {
      $rootScope.loading = true;
      var id = _getup ? _items.first : _items.last;
      var appendmode = $scope.things.length;
      var url = appendmode ? '/api/things/'+id+'/'+_getup : '/api/things';
      $http.get(url)
        .success(function (things) {
          if (things && things.length) {
            things.sort(function(t1, t2){return (new Date(t1.due_date)).getTime()-(new Date(t2.due_date)).getTime()});
            if (appendmode){
              //alert('trovati in appendmode:'+things);
              if (_getup) _items.first = things[0]._id;
              else _items.last = things[things.length-1]._id;
              $scope.things.push.apply($scope.things, things);
            }
            else {
              //alert('trovati:'+things);
              _items.first = things[0]._id;
              _items.last = things[things.length-1]._id;
              $scope.things = things;
            }
            //alert('in soldoni il primo:'+JSON.stringify($scope.things[0]));
            Utilities.sync($scope.things);
          }
        })
        .error(function(err) {
          Logger.toastError(JSON.stringify(err),"Errore nella richiesta dei pagamenti");
        })
        .then(function() {
          $rootScope.loading = false;
          refreshInfos();
        });
    };

    var checkDueHeaderStyle = function() {
      $('.due-header').css('display','block');
    };

    var refreshContentStyle = function() {
      if ($scope.editor_opened)
        checkDueHeaderStyle();
      var h = $('.item-editor').outerHeight() + $('.navbar').outerHeight();
      if (h<71) h=51;
      $scope.content_style = {'padding-top': h + 'px'};
    };




    $scope.selectThing = function(thing) {
      if (!$scope.editor_opened) return;
      $scope.selectedThing = thing;
    };
    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id)
        .error(function(err){
          Logger.toastError(JSON.stringify(err),"Impossibile eliminare l'oggetto");
        });
    };

    $scope.$on('$destroy', function () {
      Utilities.unsync();
    });

    $scope.$watch('editor_opened', function(){
      $timeout(function() {
        refreshContentStyle();
      });
    });

    $scope.selectFirstControl = function() {
      $timeout(function() {
        $("#first-control").focus();
      });
    };

    $scope.createNewThing = function(focus) {
      $scope.selectedThing = {
        name: '',
        info: '',
        due_date: (new Date()).getTime(),
        value: undefined
      };
      if (focus) $scope.selectFirstControl();
    };

    $scope.toggleEditor = function() {
      $scope.editor_opened=!$scope.editor_opened;
      if ($scope.editor_opened)
        $scope.createNewThing(true);
    };

    $scope.getToday = function() {
      return Utilities.getDateStr(new Date());
    };

    $scope.loadMore = function(up) {
      if ($rootScope.loading) return;
      _getup = up;
      loadThings();
    };

    $scope.calcTotalToPay = function(things){
      return Utilities.calcTotalToPay(things);
    };
    $scope.$on('due-changed', function(event, args) {
      refreshInfos();
    });


    $scope.createNewThing();

    loadThings();

    refreshContentStyle();
  });
