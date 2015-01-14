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
  .controller('MainCtrl', function ($scope, $http, $timeout, $window, socket, Utilities) {
    var _loading = false;
    var _getup = false;
    var _items = { first:undefined, last:undefined };

    $scope.things = [];
    //$scope.things_config = {up:10, down:10};

    var loadThings = function() {
      if (_loading) return;
      _loading = true;
      var id = _getup ? _items.first : _items.last;
      var appendmode = $scope.things.length;
      var url = appendmode ? '/api/things/'+id+'/'+_getup : '/api/things';
      $http.get(url).success(function (things) {
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
          socket.syncUpdates('thing', $scope.things);
        }
        _loading = false;
      });
    };


    loadThings();

    $scope.addThing = function() {
      if(!$scope.newThing) return;
      resolveDate();
      if ($scope.addThing._id) {
        $http.put('/api/things', $scope.newThing);
      }
      else {
        $http.post('/api/things', $scope.newThing);
      }
      $scope.createNewThing(true);
    };
    var resolveDate = function() {
      $scope.newThing.due_date = new Date($scope.newThing.date_year+'-'+$scope.newThing.date_month+'-'+$scope.newThing.date_day);
    };
    var loadDate = function(t) {
      if (!t || !t.due_date) return;
      var d = new Date(t.due_date);
      t.date_year = d.getFullYear();
      t.date_month = d.getMonth()+1;
      t.date_day = d.getDate();
    };
    $scope.selectThing = function(thing) {
      if (!$scope.editor_opened) return;
      loadDate(thing);
      $scope.newThing = thing;
    };
    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
    $scope.createNewThing = function(focus) {
      var t = {
        name: '',
        info: '',
        due_date: new Date(),
        value: undefined
      };
      loadDate(t);
      $scope.newThing = t;
      if (focus) selectFirstControl();
    };
    $scope.createNewThing();

    $scope.editor_opened = false;

    $scope.toggle = function() {
      $scope.editor_opened = !$scope.editor_opened;
      if ($scope.editor_opened) $scope.createNewThing(true);
    };

    var selectFirstControl = function() {
      $timeout(function() {
        $("#first-control").focus();
      });
    };

    $scope.getVersion = function() {
      return Utilities.getVersion();
    };

    $scope.getContentStyle = function() {
      if (!$scope.editor_opened)
        return { 'padding-top' : '120px' };
      var h = $('.due-header').height()+$('.navbar').height()+10;
      return { 'padding-top' : h+'px' };
    };

    $scope.getToday = function() {
      return Utilities.getDateStr(new Date());
    };

    $scope.loadMore = function(up) {
      if (_loading) return;
      _getup = up;
      loadThings();
    };
  });
