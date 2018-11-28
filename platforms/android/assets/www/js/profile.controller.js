angular.module('app.profileController', [])
.controller('profileController', ['$scope', 'getTargets', 'addAlert', 'openSocketService', '$stateParams', '$rootScope', '$location', '$state', '$http', '$timeout', '$window',
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, getTargets, addAlert, openSocketService, $stateParams, $rootScope, $location, $state, $http, $timeout, $window) {
    // *********** Open socket ***********
   /* var manager = io.Manager('http://' + ip + ':' + port + '/', { /!* options *!/ });
    manager.socket('/namespace');
    manager.on('connect_error', function() {
      console.warn("Connection error!");
      $scope.$apply(function() {
        $scope.base_msg_data = addAlert($scope, "No basestation found - use AA WiFi");
      });
    });*/
    // setup sockets
      $scope.doRefresh = function () {
 
        $window.location.reload(); 
      };

    //var socket = io.connect('http://' + ip + ':' + port + '/');
    //var socket = io.connect('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});
    $scope.$on('$destroy', function(event) {
      socket.removeAllListeners();
    });
    $scope.activity = '';
    socket.once('jsonrows', function(data) {
      $scope.activity = angular.fromJson(data);

      
      if ($scope.activity.account_type == "commercial")
        $scope.commercialDisplay = true;

      $scope.$apply(function() {
        $scope.target_online_count = getTargets($scope);
        $scope.player_names = $scope.activity.players;

        // display battery warnings
        for (var key in $scope.activity.target) {
          var adc = $scope.activity.target[key].volt;
          if (adc > 1500)
            adc = 1;
          if (adc < 100) {
            $scope.lowbattery = true;
            continue;
          }
        }

        if ($scope.target_online_count == 0){
          $scope.base_msg_data = addAlert($scope, "No targets found");
        }
        if ($scope.lowbattery) {
          $scope.base_msg_data = addAlert($scope, "Low battery");
        }
        if ($scope.activity.repeaters == 0) {
          $scope.base_msg_data = addAlert($scope, "No repeaters found");
        }
        if ($scope.activity.terms_conditions == "false") {
          $scope.base_msg_data = addAlert($scope, "Accept the terms & conditions to begin");
          $scope.show_start = false;
        }
    });
  });



    var vm = this;
    vm.addUser = addUser;
    vm.viewUsers = viewUsers;
    vm.viewUsers();
    $scope.msg = "Manage users";

    function addUser() {
      console.log("adding: " + $scope.username);
      if ($scope.username !== undefined)
      {
        $http({
          method: 'GET',
          url: 'http://' + ip + ':' + port + '/?page=adduser&name=' + $scope.username + '&callback=JSON_CALLBACK&'
        }).
        success(function(data, status) {
          console.log($scope.username + " added");
          $scope.msg_due = data;
          vm.viewUsers();
        }).
        error(function(data, status) {
          console.log("Add user request failed");
          $scope.base_msg_data = addAlert($scope, "Base station didn't receive: Game stopped by host!");
        });
      }
      else
      {
        console.log("Username must be present");
        $scope.msg_due = "Username must be present";
      }
    }

    $scope.enablePlayer = function(player) {
      console.log("player name: " + player.player_name);
      console.log("player id: " + player.player_id);
      console.log("player active: " + player.active);

      $http({
        method: 'GET',
        url: "http://" + ip + ":" + port + "/?page=player_active&id=" + player.player_id + "&active=" + player.active + "&json_callback=JSON_CALLBACK"
      }).
      success(function(data, status) {
        console.log("success");
        console.log(data);
      }).
      error(function(data, status) {
        console.log("View user request failed");
        $scope.base_msg_data = addAlert($scope, "Base station didn't receive: Game stopped by host!");
      });
    };

    function viewUsers() {
      $http({
        method: 'GET',
        url: "http://" + ip + ":" + port + "/?page=player_list_due&json_callback=JSON_CALLBACK"
      }).
      success(function(data, status) {

        $scope.player_list_arr = angular.fromJson(data);

        for (var key in $scope.player_list_arr) {

          //console.log($scope.player_list_arr[key]);
          if ($scope.player_list_arr[key].active == 1) {
            $scope.player_list_arr[key].active = true;
          } else {
            $scope.player_list_arr[key].active = false;
          }
        }
        $scope.players = $scope.player_list_arr;

      }).
      error(function(data, status) {
        console.log("View user request failed");
        $scope.base_msg_data = addAlert($scope, "Base station didn't receive: Game stopped by host!");
      });
    }


    $scope.getUserName = function(username) {
      $scope.username = username;
    }





    vm.addEvent = addEvent;
    vm.viewEvents = viewEvents;
    vm.viewEvents();

    $scope.msg = "Manage Events";

    function addEvent() {
      console.log("adding: " + $scope.event);
      if ($scope.event !== undefined)
      {
        $http({
          method: 'GET',
          url: 'http://' + ip + ':' + port + '/?page=addevent&name=' + $scope.event + '&callback=JSON_CALLBACK&'
        }).
        success(function(data, status) {
          console.log($scope.event + " added");
          $scope.msg_due = data;
          vm.viewEvents();
           $window.location.reload(); 
        }).
        error(function(data, status) {
          console.log("Add event request failed");
          $scope.base_msg_data = addAlert($scope, "Base station didn't receive!");
        });
      }
      else
      {
        console.log("Event name must be present");
        $scope.msg_due = "Event name must be present";
      }
    }

    $scope.enableEvent = function(event) {
      console.log("event name: " + event.name);
      console.log("event id: " + event.id);
      console.log("event default: " + event.default);

      $http({
        method: 'GET',
        url: "http://" + ip + ":" + port + "/?page=active_events&id=" + event.id + "&default=" + event.default + "&json_callback=JSON_CALLBACK"
      }).
      success(function(data, status) {
        console.log("success");
        console.log(data);
      }).
      error(function(data, status) {
        console.log("View event request failed");
        $scope.base_msg_data = addAlert($scope, "Base station didn't receive!");
      });
    };

    function viewEvents() {
      socket.on('jsonrows', function(data) {

          $scope.events = $scope.activity.events ;

          for (var key in $scope.events) {

              if ($scope.events[key].default == 1) {
                $scope.events[key].default = true;
              } else {
                $scope.events[key].default = false;
              }    
            
          }
      });
    }
     


    $scope.getEventName = function(event) {
      $scope.event = event;
    }

    /*
     vm.auth = auth;
     $scope.sqllitedata = "hello";
     firstname = "Mark";
     lastname = "Campbell";
     $scope.insert = function(firstname, lastname) {
     var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
     $cordovaSQLite.execute(db, query, [firstname, lastname]).then(function(res) {
     console.log("INSERT ID -> " + res.insertId);
     $scope.sqllitedata = "inserted";
     }, function (err) {
     console.error(err);
     $scope.sqllitedata = err;
     });
     }
     */

    $scope.select = function(lastname) {
      var query = "SELECT firstname, lastname FROM people WHERE lastname = ?";
      $cordovaSQLite.execute(db, query, [lastname]).then(function(res) {
        if (res.rows.length > 0) {
          console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
          $scope.sqllitedata = "selected";
        } else {
          console.log("No results found");
          $scope.sqllitedata = err;
        }
      }, function(err) {
        console.error(err);
        $scope.sqllitedata = err;
      });
    }
    /*
     if (!angular.isUndefined(auth.profile) && auth.profile !== null )
     {
     $scope.profile_name = auth.profile.name;
     profile_auth0_name = auth.profile.name;
     $scope.pic = auth.profile.picture;
     }
     else
     $scope.profile_name = "Guest";
     */

    vm.login = login;
    vm.logout = logout;


    function login() {
      $state.go("login");
    }

    function logout() {
      /*
       auth.signout();
       store.remove('profile');
       store.remove('token');
       store.remove('accessToken');
       store.remove('refreshToken');
       */
      //$state.go('home.home2');
      $scope.profile_name = "Guest";
      $state.go($state.current, {}, {
        reload: true
      });
    }
  }
]);
