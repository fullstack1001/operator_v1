angular.module('app.services', ['ngSanitize', 'ngAnimate'])
.service('addAlert', function() {
    return function(scope, msg) {
      var messageQueue = scope.base_msg_data || [];
      var msgIndex = messageQueue.indexOf(msg);
      if(msgIndex == -1){
        messageQueue.push(msg);
      }
      scope.notice_count = messageQueue.length;
      if(messageQueue.length > 0){
        scope.show_notice_count = true;
      }else{
        scope.show_notice_count = false;
      }
      //console.warn('addAlert: ',messageQueue);
      return messageQueue;
    };
})
.service('removeAlert', function() {
  return function(scope, msg) {
    var messageQueue = scope.base_msg_data || [];
    var msgIndex = messageQueue.indexOf(msg);
    if(msgIndex > -1 ){
      messageQueue.splice(msgIndex, 1);
    }
    scope.notice_count = messageQueue.length;
    //console.warn('removeAlert: ',messageQueue);
    return messageQueue;
  };
})
// **************  Return Connected Targets  **************
.service('getTargets', function() {
  return function(scope) {
 
    var sortedTargets = [];
    // target object contains all targets in database and says whether each is online or not
    for (var key in scope.activity.target) {
      if (scope.activity.target.hasOwnProperty(key)) {
        var obj = scope.activity.target[key];
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop))
            if (prop == 'id' && scope.activity.target[key]["online"])
            { 
              sortedTargets.push(scope.activity.target[key]['id']);

            }  

        }
      }
    }
    sortedTargets.sort(function (a, b) {
      return a - b;
    });
    return sortedTargets;
  }
})
.service('openSocketService', [function($scope, addAlert, openSocketService, $stateParams, $http, $timeout, $location, $state, $sce) {
  return {
    openSocket: function() {
      var manager = io.Manager('http://' + ip + ':' + port + '/', { /* options */ });
      manager.socket('/namespace')
      .on('connect', function(){
        console.log("Connected!");
        $scope.$apply(function() {
          $scope.connected = true;
        });
      });

      var socket = io.connect('http://' + ip + ':' + port + '/');
      /*socket.on('jsonrows', function(data) {
        $scope.activity = angular.fromJson(data);
        $scope.$apply(function() {
          if ($scope.lowbattery) {
            $scope.base_msg_data = addAlert($scope, "Low battery");
          }
          if ($scope.target_online_count == 0){
            $scope.base_msg_data = addAlert($scope, "No targets found");
          }
          if ($scope.activity.repeaters == 0) {
            $scope.base_msg_data = addAlert($scope, "No repeaters found");
          }
          if ($scope.activity.terms_conditions == "false") {
            $scope.base_msg_data = addAlert($scope, "Accept the terms & conditions to begin");
            $scope.show_start = false;
          }
        });
      });*/
      console.log("services.js: socket opened");
      return socket;
    }
  }
}]);