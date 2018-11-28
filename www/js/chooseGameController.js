angular.module('app.chooseGameController', [])
.controller('gamesDrills', ['$scope', 'getTargets', 'addAlert', '$stateParams', '$timeout', '$ionicPopup', '$http', '$location', '$state', '$ionicHistory', '$window',
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, getTargets, addAlert, $stateParams, $timeout, $ionicPopup, $http, $location, $state, $ionicHistory, $window) {

    $scope.activity;

    $scope.card_objective = "";
    $scope.choose_game = "Choose Game or Drill";
    $scope.game_name = "";
    $scope.image = "";
    $scope.matchtype = "Co-op";
    $scope.scorelimit = 15;
    $scope.showGameDescription = false;
    $scope.showcardspace = false;
    $scope.showSpeed = false;
    $scope.showplayers = false;
    $scope.player_names;
    $scope.showPaddleSequence = false;
    $scope.showTargetsPerStation = false;
    $scope.showMaxTimeLabel = false;
    $scope.showScoreLimitLabel = false;
    $scope.showDoubleTapOption = false;
    $scope.showShootNoShootOption = false;
    $scope.showEventsLabel = false;
    $scope.showTargetTimeoutOption = false;
    $scope.showCaptureHoldOption = false;
    $scope.showTimeBetweenWavesOption = false;
    $scope.showTargetTimeoutTimeOption = false;
    $scope.showTotalMissesAllowedOption = false;
    $scope.showMatchTypeLabel = true;
    $scope.showMaxHitsLabel = false; // turn off for PvP
    $scope.showTwoPlayerLabel = false;
    $scope.commercialDisplay = false;
    $scope.commercialDisplayTurnedOff = false;
    $scope.base_msg_data = $scope.base_msg_data ||[];
    $scope.selectedgamename = '';
    $scope.showGameList = true;
    $scope.double_tap = "false";

    $scope.maxtimes = [
                                {name: '10 sec', id: 10},
                                {name: '30 sec', id: 30},
                                {name: '1 min', id: 60},
                                {name: '2 min', id: 120},
                                {name: '3 min', id: 180},
                                {name: '4 min', id: 240},
                                {name: '5 min', id: 300},
                                {name: '6 min', id: 360},
                                {name: '7 min', id: 420},
                                {name: '8 min', id: 480},
                                {name: '9 min', id: 540},
                                {name: '10 min', id: 600},
                                {name: '1 hour', id: 3600},
                                {name: '2 hours', id: 7200}
    ];
    $scope.max_targets = [
                                {name: '2', id: 2},
                                {name: '3', id: 3},
                                {name: '4', id: 4},
                                {name: '5', id: 5},
                                {name: '6', id: 6},
                                {name: '7', id: 7},
                                {name: '8', id: 8},
                                {name: '9', id: 9},
                                {name: '10', id: 10},
                                {name: '11', id: 11},
                                {name: '12', id: 12},
                                {name: '14', id: 14},
                                {name: '15', id: 15},
                                {name: '16', id: 16},
                                {name: '18', id: 18},
                                {name: '20', id: 20},
                                {name: '21', id: 21},
                                {name: '22', id: 22},
                                {name: '24', id: 24},
                                {name: '25', id: 25},
                                {name: '26', id: 26},
                                {name: '28', id: 28},
                                {name: '30', id: 30},
                                {name: '32', id: 32},
                                {name: '33', id: 33},
                                {name: '34', id: 34},
                                {name: '35', id: 35},
                                {name: '36', id: 36},
                                {name: '38', id: 38},
                                {name: '40', id: 40},
                 
                                {name: '45', id: 45},
                                {name: '50', id: 50},
                                {name: '60', id: 60},
                                {name: '70', id: 70},
                                {name: '80', id: 80},
                                {name: '90', id: 90},
                                {name: '100', id: 100},
                                {name: '9999', id: 9999}

                            ];
    $scope.firsttoscores = [
                                {name: '1', id: 1},
                                {name: '2', id: 2},
                                {name: '3', id: 3},
                                {name: '4', id: 4},
                                {name: '5', id: 5},
                                {name: '6', id: 6},
                                {name: '7', id: 7},
                                {name: '8', id: 8},
                                {name: '9', id: 9},
                                {name: '10', id: 10},
                                {name: '15', id: 15},
                                {name: '20', id: 20},
                                {name: '25', id: 25},
                                {name: '30', id: 30},
                                {name: '35', id: 35},
                                {name: '40', id: 40},
                                {name: '45', id: 45},
                                {name: '50', id: 50},
                                {name: '60', id: 60},
                                {name: '70', id: 70},
                                {name: '80', id: 80},
                                {name: '100', id: 100},
                                {name: '1000', id: 1000}
                              ];

    if (window.localStorage.getItem("double_tap") !== null)
    { 

      if (window.localStorage.getItem("double_tap") == "true" ||  window.localStorage.getItem("double_tap") ==  true)
        $scope.double_tap = true ; 
      if (window.localStorage.getItem("double_tap") == "false" || window.localStorage.getItem("double_tap") == false)
        $scope.double_tap = false ; 
       
    }
    var game_types;
    var gameParameters = {};
    $scope.showRefreshButton = false;

    $scope.total_misses_list = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];


    /*
    $scope.doRefresh = function() {
      $state.go($state.current, {}, {
        reload: true
      })
      .finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
      $window.location.href = '/#/page1/gamesDrills';
 
      $window.location.reload(); 
 

    };
    */


    //var vm = this;
    //vm.addUser = addUser;
 
      $scope.doRefresh = function () {
     
        $window.location.reload(); 
      };
 
      //var manager = io.Manager('http://' + ip + ':' + port + '/', { timeout: 1000  });
      //var manager = io.Manager('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});
    
      manager
      .socket('/namespace')
      .on('disconnect', function(){
          console.warn("disconnected!!!!")
          $scope.msg = "Not connected to basestation!";
          $scope.background_color_changer = "bar bar-subheader bar-light msg_bar_red_bg";
      })
      .on('connect_error', function () {
          console.warn("Connection error!");
          $scope.$apply(function () {
            $scope.base_msg_data = addAlert($scope, "Not connected to basestation - use AA WiFi");
            $scope.msg = "Not connected to basestation!";
            //$scope.background_color_changer = "bar bar-subheader bar-light msg_bar_red_bg";
            });
          })
      .on('connection', function () {
          console.log("connecting...")
          $scope.$apply(function () {
            $scope.background_color_changer = "bar bar-subheader bar-light ";
            $scope.msg = " ";
          });
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
      });
  

 

    // setup sockets
    //var socket = io.connect('http://' + ip + ':' + port + '/');
    //var socket = io.connect('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});


    socket.on('jsonrows', function(data) {

      //console.log(data);
      //callback('error', 'message');
      //return ack(null, { response: 'msg-received' });
      /*
      socket.emit('ferret', 'tobi', function (data) {
        console.log(data); // data will be 'woot'
      });
      */



      $scope.activity = angular.fromJson(data);

      

      if ($scope.activity.account_type == "commercial")
        $scope.commercialDisplay = true;
   

      $scope.$apply(function() {

        $scope.background_color_changer = "bar bar-subheader bar-light ";
        $scope.msg = " ";
        $scope.player_names = $scope.activity.players;
        
        

          
         


      
        $scope.target_online_count = getTargets($scope) || 0;
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
        // check for Alerts
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

    $scope.$on('$destroy', function(event) {
      socket.removeAllListeners();
    });

    // if battery is low, let button click navigate
    $scope.base_msg_click = function() {
      if ($scope.lowbattery) {
        $state.go('home.diagnostics');
      }
    }

    
 

    $scope.showGameList = true;
    console.log("Requst game url: http://" + ip + ":" + port + "/?page=game_types&json_callback=JSON_CALLBACK");
      $http({
        method: 'GET',
        url: "http://" + ip + ":" + port + "/?page=game_types&json_callback=JSON_CALLBACK"
      }).
      success(function(data, status) {
      
        
        $scope.game_types = angular.fromJson(data);
        $scope.game_types = $scope.game_types;
        $scope.radio_list = '';
        for (var i = 0; i < $scope.game_types.length; i++) {
          //if ($scope.game_types[i]['game_name'] == "Swarm")
            //$scope.game_types[i]['game_name'] = "Swarm - Beta";
          $scope.radio_list += '<ion-radio  ng-model="data.gamename" ng-value="\'' + $scope.game_types[i]['game_name'] + '\'">' + $scope.game_types[i]['game_name'] + '</ion-radio>';
          

        }

      });
  
        
    // host fired off goToPage broadcast.
    // this is the echo back and redirects all devices to game screen
    //socket.on('goToPageBroadcast', function(data) {



      /*
      $scope.game_data = angular.fromJson(data);

      if ($scope.scorelimit > 0)
        $scope.scorelimit = $scope.scorelimit;
      else
        $scope.scorelimit = 15;

      $ionicHistory.clearCache().then(function() {
        $state.go('game', {
          gameid: $scope.game_data.gamename,
          maxtime: $scope.game_data.maxtime,
          firsttoscore: $scope.game_data.firsttoscore,
          max_targets: $scope.game_data.max_targets,
          time_between_waves: $scope.game_data.time_between_waves,
          target_timeout_times: $scope.game_data.target_timeout_times,
          total_misses_allowed: $scope.game_data.total_misses_allowed,
          paddle_sequence: $scope.game_data.paddle_sequence,
          targets_per_station: $scope.game_data.targets_per_station,
          speed: $scope.game_data.speed,
          double_tap: $scope.game_data.double_tap,
          capture_and_hold: $scope.game_data.capture_and_hold,
          target_timeout: $scope.game_data.target_timeout,
          matchtype: $scope.game_data.matchtype,
          scorelimit: $scope.game_data.scorelimit,
          player_list: $scope.game_data.player_list,
          shoot_no_shoot: $scope.game_data.shoot_no_shoot,
          event: $scope.game_data.event
        }, {
          reload: true
        });
      });
      */

    //});


    /*

    $scope.shoot_no_shoot = "false";
    $scope.showShootNoShoot = function(shoot_no_shoot) {
      console.log("shoot / no shoot: " + shoot_no_shoot);
      $scope.shoot_no_shoot = shoot_no_shoot;
    }

    $scope.target_timeout = "false";
    $scope.showTargetTimeout = function(target_timeout) {
      console.log("Target Timeout: " + target_timeout);
      $scope.target_timeout = target_timeout;
    }
    */


     $scope.addUser  = function(username) {
      console.log("adding: " + username);


             var size = 0, key;
          for (key in $scope.player_names) {
              if ($scope.player_names.hasOwnProperty(key)) size++;
          }

          console.log("size " + size);


      if (username !== undefined)
      {
        $http({
          method: 'GET',
          url: 'http://' + ip + ':' + port + '/?page=adduser&name=' + username + '&callback=JSON_CALLBACK&'
        }).
        success(function(data, status) {
          console.log(username + " added");
          $scope.msg_due = data;
            //   vm.viewUsers();
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



    // Select dropdown options on screen
    gameParameters['maxtime'] = 300; //default

 

     if ( window.localStorage.getItem("maxtime") !== null)
    {
      console.log("max time being retrived");

      console.log(window.localStorage.getItem("maxtime"));
      gameParameters['maxtime']  = $scope.maxtimes[window.localStorage.getItem("maxtime")].id
    }
    $scope.showMaxTime = function(maxtime) {
      $scope.maxtime = maxtime;
      gameParameters['maxtime'] = $scope.maxtime;

      // set local storage
      for (var i = 0; i < $scope.maxtimes.length; i++) {
        if (maxtime == $scope.maxtimes[i].id)
        {
          window.localStorage.setItem("maxtime", i);
        }
      }

    }
  
 
    gameParameters['firsttoscore'] = 10;
    console.log("getting from local storage");
    console.log(window.localStorage.getItem("firsttoscore"));
    if ( window.localStorage.getItem("firsttoscore") !== null)
    {
      gameParameters['firsttoscore']  = $scope.firsttoscores[window.localStorage.getItem("firsttoscore")].name
    }


    $scope.showFirstToScore = function(firsttoscore) {
      $scope.firsttoscore = firsttoscore;
      gameParameters['firsttoscore'] = $scope.firsttoscore;

      // set local storage
      for (var i = 0; i < $scope.firsttoscores.length; i++) {
        if (firsttoscore == $scope.firsttoscores[i].id)
        {
          window.localStorage.setItem("firsttoscore", i);
        }
      }
    }

    gameParameters['targets_per_station'] = 1; // default
    $scope.udpateTargetsPerStation = function(target_per_station) {
      $scope.target_per_station = target_per_station;
      gameParameters['targets_per_station'] = $scope.target_per_station;

      // set local storage
      for (var i = 0; i < $scope.targets_per_station.length; i++) {
        if (target_per_station == $scope.targets_per_station[i].id)
        {
          window.localStorage.setItem("target_per_station", i);
          console.log("asaved target per station: " + $scope.targets_per_station[i].id + " " + target_per_station );
        }
      }
    }

    $scope.showScoreLimit = function(scorelimit) {
      $scope.scorelimit = scorelimit;
      gameParameters['scorelimit'] = $scope.scorelimit;
    }

    //$scope.matchtype = "Co-op";
    $scope.showmatchtype = function(matchtype) {

      if (matchtype == "Single player") {
        $scope.showplayers = true;
        $scope.join_players = "Join a player to the game";
        $scope.radio_list_players = true;
        $scope.checkbox_list_players = false;
        $scope.matchtype = matchtype;
      } else if (matchtype == "1 vs 1") {
        $scope.showplayers = true;
        $scope.join_players = "Join players to the game";
        $scope.checkbox_list_players = true;
        $scope.radio_list_players = false;
        //$scope.showPlayerListPopup();
        $scope.matchtype = matchtype;
      } else {
        $scope.matchtype = "Co-op";
        $scope.showplayers = false;
      }

      for (var i = 0; i < $scope.matchtypes.length; i++) {
        if ($scope.matchtype == $scope.matchtypes[i].name)
        {
          window.localStorage.setItem("matchtype", i);
        }
      }
 
      checkMatchTypeInStorage();

      // reset for when user bounces back and forth with match types
      $scope.player_list = [1];


    }

   // gameParameters['events'] = "Oakdale GunClub"; //default
   // $scope.event = "Oakdale GunClub";

    $scope.showEvents = function(event) {
      //console.log("event name: " + event);
      $scope.event = event;
      gameParameters['event'] = $scope.event;

    }

    gameParameters['max_targets'] = 10; //default

    if ( window.localStorage.getItem("max_target") !== null)
    {
      gameParameters['max_target']  = $scope.max_targets[window.localStorage.getItem("max_target")].name
    }

    $scope.showMaxTargets = function(max_target) {
      $scope.max_target = max_target;
      gameParameters['max_targets'] = $scope.max_target;

      // set local storage
      for (var i = 0; i < $scope.max_targets.length; i++) {
        if (max_target == $scope.max_targets[i].id)
        {
          window.localStorage.setItem("max_target", i);
        }
      }
    }

    gameParameters['time_between_waves'] = 5;
    $scope.showTimeBetweenWaves = function(time_between_wave) {
      //console.log("time between waves: " + time_between_wave);
      $scope.time_between_wave = time_between_wave;
      gameParameters['time_between_waves'] = $scope.time_between_wave;
      // set local storage
      for (var i = 0; i < $scope.time_between_waves.length; i++) {
        if (time_between_wave == $scope.time_between_waves[i].id)
        {
          window.localStorage.setItem("time_between_wave", i);
        }
      }

    }

    gameParameters['total_misses_allowed'] = 10;
    $scope.showTotalMissesAllowed = function(total_misses_allowed) {
      $scope.total_misses_allowed = total_misses_allowed;
      gameParameters['total_misses_allowed'] = $scope.total_misses_allowed;

      for (var i = 0; i < $scope.total_misses_list.length; i++) {
        if (total_misses_allowed == $scope.total_misses_list[i])
        {
          window.localStorage.setItem("total_misses_allowed", i);
        }
      }


    }

    gameParameters['target_timeout_times'] = 3;

    $scope.showTargetTimeoutTime2 = function(target_timeout_time) {
      //console.log("target timeout time: " + target_timeout_time);
      $scope.target_timeout_time = target_timeout_time;
      gameParameters['target_timeout_times'] = $scope.target_timeout_time;
      // set local storage
      for (var i = 0; i < $scope.target_timeout_times.length; i++) {
        if (target_timeout_time == $scope.target_timeout_times[i].id)
        {
          window.localStorage.setItem("target_timeout_time", i);
        }
      }
    }
 
    // defaults
    gameParameters['speed'] = 100;
  
    $scope.updateSpeed = function(set_speed) {
      $scope.set_speed = set_speed;
      gameParameters['speed'] = $scope.set_speed;


      // set local storage
      for (var i = 0; i < $scope.speed.length; i++) {
        if (set_speed == $scope.speed[i].id)
        {
          window.localStorage.setItem("game_speed", i);
        }
      }
 

      
    }

function checkMatchTypeInStorage() {
  if ($scope.useMatchTypeStorage)
                    {
                       console.log("$scope.matchtypeNew.name");
                    console.log($scope.matchtypes[window.localStorage.getItem("matchtype")]);
                      if ( window.localStorage.getItem("matchtype") !== null)
                      {
                        $scope.matchtypeNew = $scope.matchtypes[window.localStorage.getItem("matchtype")] ;
                        //console.log("matchtype::::: " + $scope.matchtypeNew);
                        //console.log($scope.matchtype.name);

                        if ($scope.matchtypeNew.name == "Single player")
                        {
                          // used stored setting to override default settings.

                          $scope.matchtype = $scope.matchtypes[0];
                          gameParameters['matchtype'] = "Single player"; // default
                          $scope.showplayers = true;
                          $scope.join_players = "Join player to the game";
                          $scope.checkbox_list_players = false;
                          $scope.radio_list_players = true;
   
                        }
                        if ($scope.matchtypeNew.name == "Co-op")
                        {
                          // used stored setting to override default settings.
                          gameParameters['matchtype'] = "Co-op";
                          $scope.matchtype = $scope.matchtypes[1];
                          $scope.showplayers = false;
                          $scope.checkbox_list_players = false;
                          $scope.radio_list_players = false;
   
                        }
                        if ($scope.matchtypeNew.name == "1 vs 1")
                        {
                          // used stored setting to override default settings.
                          gameParameters['matchtype'] = "1 vs 1";
                          $scope.matchtype = $scope.matchtypes[1];
                          $scope.showplayers = false;
                          $scope.checkbox_list_players = true;
                          $scope.radio_list_players = false;
   
                        }
                      }
                      
                   }
}


    $scope.player_list = []; // array of players
    $scope.add_game_to_view = function(val) {
      //console.log("Game id : " + val);


            $scope.events = $scope.activity.events;

    

            // Set default event selection 
            if ($scope.events !== undefined)
            for (var i = 0; i < $scope.events.length; i++) {
              //console.log("$$$$" + $scope.events[i].default);
                if ($scope.events[i].default == "1")
                {
                  $scope.event = $scope.events[i];
                  gameParameters['event'] = $scope.events[i].name;
                }

            }
                  
 
      
            $scope.showGameListButton = false;
            $scope.showRefreshButton = true;
            $scope.showGameList = false;
            // display game type information once selected
            for (var j = 0; j < $scope.game_types.length; j++) {
              if ($scope.game_types[j]['game_type_id'] == val) {
                //console.log(val);console.log(val);console.log(val);
  
                // get game options from game_rules table
                $http({
                  method: 'GET',
                  url: "http://" + ip + ":" + port + "/?page=game_rules&game_type_id=" + $scope.game_types[j]['game_type_id'] + "&json_callback=JSON_CALLBACK"
                }).
                success(function(data, status) {

                  $scope.game_rules = angular.fromJson(data);
                  $scope.set_speed = 500;
                  $scope.speed = [
                                  {name: "100 ms", id: 100},
                                  {name: "200 ms", id: 200},
                                  {name: "300 ms", id: 300},
                                  {name: "400 ms", id: 400},
                                  {name: "500 ms", id: 500},
                                  {name: "600 ms", id: 600},
                                  {name: "700 ms", id: 700},
                                  {name: "800 ms", id: 800},
                                  {name: "900 ms", id: 900},
                                  {name: "1 sec", id: 1000},
                                  {name: "1.5 sec", id: 1500},
                                  {name: "2 sec", id: 2000},
                                  {name: "2.5 sec", id: 2500},
                                  {name: "3 sec", id: 3000},
                                  {name: "4 sec", id: 4000},
                                  {name: "5 sec", id: 5000},
                                  {name: "6 sec", id: 6000},
                                  {name: "7 sec", id: 7000},
                                  {name: "8 sec", id: 8000},
                                  {name: "9 sec", id: 9000},
                                  {name: "10 sec", id: 10000}
                                ];
                  $scope.matchtypes = [];
                  
 
    
 
                  $scope.target_timeout_times = [];
          
                  $scope.time_between_waves = [
                                                {name: '1 sec', id: 1},
                                                {name: '2 sec', id: 2},
                                                {name: '3 sec', id: 3},
                                                {name: '4 sec', id: 4},
                                                {name: '5 sec', id: 5},
                                                {name: '6 sec', id: 6},
                                                {name: '7 sec', id: 7},
                                                {name: '8 sec', id: 8},
                                                {name: '9 sec', id: 9},
                                                {name: '10 sec', id: 10},
                                                {name: '15 sec', id: 15},
                                                {name: '30 sec', id: 30},
                                                {name: '1 min', id: 60},
                                                {name: '1.5 min', id: 90},
                                                {name: '2 min', id: 120}
                                              ];
                  $scope.time_between_wave = $scope.time_between_waves[4]; // set a default selection
                  if (window.localStorage.getItem("time_between_wave") !== null){
                    $scope.time_between_wave = $scope.time_between_waves[window.localStorage.getItem("time_between_wave")] ;
                  }

 
                  $scope.scorelimits = [];
                  $scope.paddle_sequence = [];
                  $scope.targets_per_station = [
                                                  {"name": 1, "id": 1},
                                                  {"name": 2, "id": 2},
                                                  {"name": 3, "id": 3},
                                                  {"name": 4, "id": 4},
                                                ]
                  $scope.set_target_per_station = $scope.targets_per_station[0]; // set a default selection
                  if (window.localStorage.getItem("target_per_station") !== null){
                    $scope.set_target_per_station = $scope.targets_per_station[window.localStorage.getItem("target_per_station")] ;
                    gameParameters['targets_per_station'] = $scope.targets_per_station[window.localStorage.getItem("target_per_station")].id;
                  }
                  
                  for (var i = 0; i < $scope.game_rules.length; i++) {

                     /* the matchtype options
                     $scope.matchtypes = [
                     {name: 'Single player', id:1 },
                     {name: 'Co-op', id:2 },
                     {name: '1 vs 1', id:3 }
                     ];
                     */
                     //console.log($scope.game_rules[i].game_name);

                    if (   $scope.game_rules[i].game_name == "Race" ||  $scope.game_rules[i].game_name == "Overrun" ||  $scope.game_rules[i].game_name == "Manual Control" )
                    {

                      $scope.showplayers = true;
                      $scope.join_players = "Join a player to the game";
                      $scope.radio_list_players = true;
                      $scope.checkbox_list_players = false;
                    }  
           
                    if ( $scope.game_rules[i].game_name == "PvP" || $scope.game_rules[i].game_name == "Race" )
                    {
                      $scope.showMatchTypeLabel = false;
                      $scope.showTwoPlayerLabel = true;
                    }

                    if ( $scope.game_rules[i].game_name == "Freeplay")
                    {
                      $scope.showMatchTypeLabel = false;
                      $scope.showTwoPlayerLabel = false;
                    }

                    if ( $scope.game_rules[i].game_name == "Swarm")
                    {
                      $scope.showTotalMissesAllowedOption = true;
                      $scope.total_misses_allowed = $scope.total_misses_list[1];
                      //$scope.showMatchTypeLabel = false;
                      //$scope.showTwoPlayerLabel = true;

                      if (window.localStorage.getItem("total_misses_allowed") !== null){
                        $scope.total_misses_allowed = $scope.total_misses_list[window.localStorage.getItem("total_misses_allowed")] ;
                      }

                    }

                    if ($scope.game_rules[i].game_name == "Overrun" || $scope.game_rules[i].game_name == "Swarm" || $scope.game_rules[i].game_name == "Manual Control")
                      $scope.showMaxTimeLabel = false;
                    else
                      $scope.showMaxTimeLabel = true;

               
 
                    if ($scope.game_rules[i]['attribute_name'] == "Match type") {
                   

                      $scope.useMatchTypeStorage = true;
                      if ($scope.game_rules[i].game_name == "PvP" || $scope.game_rules[i].game_name == "Race")
                      {
                        //$scope.matchtype = $scope.matchtypes[2];
                        $scope.matchtype = '1 vs 1';
                        gameParameters['matchtype'] = $scope.matchtype; // default
                        $scope.showplayers = true;
                        $scope.join_players = "Join players to the game";
                        $scope.checkbox_list_players = true;
                        $scope.radio_list_players = false;
                        $scope.useMatchTypeStorage = false;

                        $scope.matchtypes = [
                         {name: 'Single player', id:1 },
                         {name: 'Co-op', id:2 },
                         {name: '1 vs 1', id:3 }
                        ];
                      }

                      if ($scope.game_rules[i].game_name != "PvP" &&  $scope.game_rules[i].game_name != 'Race')
                      {
                        //$scope.matchtype = $scope.matchtypes[1];
                        $scope.matchtype = 'Co-op';
                        gameParameters['matchtype'] = $scope.matchtype; // default
                        $scope.showplayers = false;
                        $scope.join_players = "Join player to the game";
                        $scope.checkbox_list_players = true;
                        $scope.radio_list_players = false;
           
                        /*
                        $scope.matchtype = $scope.matchtypes[0];
                        $scope.matchtype = 'Single Player';
                        $scope.showplayers = true;
                        $scope.join_players = "Join player to the game";
                        $scope.checkbox_list_players = true;
                        $scope.radio_list_players = false;
                        */
                        $scope.matchtypes = [
                         {name: 'Single player', id:1 },
                         {name: 'Co-op', id:2 }
             
                        ];

                      }


                    }
                    



                       if($scope.game_rules[i].game_name == "Race")
                          {
                            //console.log("resetting!!!!!!!")
                            gameParameters['firsttoscore'] = 3;
                            $scope.firsttoscore = $scope.firsttoscores[3]; 
                          }
                          
                    if ($scope.game_rules[i]['attribute_name'] == "First to score wins") {
                      //&& $scope.game_rules[i]['attribute_value'] != "All or None"
                      // populate drop list  but watch for games that are not two player

                        //console.log($scope.game_rules[i]['attribute_value']);
                           $scope.showFirstToScoreLabel = true;
                           /*
                           $scope.firsttoscores.push({
                              name: $scope.game_rules[i]['attribute_value'],
                              id: $scope.game_rules[i]['attribute_value']
                            });*/


                            //$scope.firsttoscore = $scope.firsttoscores[7]; 

                        if (window.localStorage.getItem("firsttoscore") !== null)
                          $scope.firsttoscore = $scope.firsttoscores[window.localStorage.getItem("firsttoscore")] ;
                      
                    }

                   

                    if ($scope.game_rules[i]['attribute_name'] == "Max hits") {
                      //console.log($scope.game_rules[i]['attribute_name']);
                      /*
                      $scope.max_targets.push({
                        name: $scope.game_rules[i]['attribute_value'],
                        id: $scope.game_rules[i]['attribute_value']
                      });
                      */
                      $scope.max_target = $scope.max_targets[8]; // set a default selection
                      if ($scope.game_rules[i].game_name == "All or None" || $scope.game_rules[i].game_name == "Freeplay" || $scope.game_rules[i].game_name == "Manual Control"  )
                       {
                          $scope.max_target = $scope.max_targets[29]; //default
                          gameParameters['max_targets'] = 18; //default
                       }
                       if (  $scope.game_rules[i].game_name == "Run N Gun" ||  $scope.game_rules[i].game_name == "All or None" || $scope.game_rules[i].game_name == "Freeplay")
                       {
                          $scope.max_target = $scope.max_targets[12]; //default
                          gameParameters['max_targets'] = 16; //default
                          $scope.showMaxHitsLabel = true; 

                          if (window.localStorage.getItem("max_target") !== null){
                            $scope.max_target = $scope.max_targets[window.localStorage.getItem("max_target")] ;
                            console.log("this is set to :::: " );
                            console.log( window.localStorage.getItem("max_target"));
                            console.log($scope.max_targets[window.localStorage.getItem("max_target")]);
                            gameParameters['max_targets'] =  $scope.max_targets[window.localStorage.getItem("max_target")].name ;
 

                          }


                       }
                    
                       if (  $scope.game_rules[i].game_name == "Subsecond" || $scope.game_rules[i].game_name == "Race" )
                       {
                          $scope.max_target = $scope.max_targets[32]; //default
                          gameParameters['max_targets'] = 9999; //default
                       }
                     
                    }
                    if ($scope.game_rules[i]['attribute_name'] == "Max time") {

                      $scope.showMaxTimeLabel = true;
                      //$scope.maxtimes.push({
                      //  name: $scope.game_rules[i]['attribute_value'],
                      //  id: $scope.game_rules[i]['attribute_value_2']
                      //});
                      $scope.maxtime = $scope.maxtimes[6]; // set a default selection
                      //gameParameters['maxtime'] = 300;

                      if (window.localStorage.getItem("maxtime") !== null){
                        $scope.maxtime = $scope.maxtimes[window.localStorage.getItem("maxtime")] ;
                      }

                       if ($scope.game_rules[i].game_name == "Overrun")
                       {
                          gameParameters['maxtime'] = 600; //default
                          $scope.maxtime = $scope.maxtimes[11]; // set a default selection
                       }
                       
                       
                    }

                    if ($scope.game_rules[i].game_name == "Overrun" || $scope.game_rules[i].game_name == "Subsecond" || $scope.game_rules[i].game_name == "Freeplay" || $scope.game_rules[i].game_name == "Swarm" || $scope.game_rules[i].game_name == "PvP" || $scope.game_rules[i].game_name == "Race" || $scope.game_rules[i].game_name == "Manual Control" )
                    {
                      $scope.max_target = $scope.max_targets[32]; //default
                      gameParameters['max_targets'] = 9999; //default
                      $scope.showMaxHitsLabel = false;
                      $scope.showMaxTimeLabel = false;
                    }
             
                    if ($scope.game_rules[i].game_name == "Freeplay")
                    {
                      gameParameters['maxtime'] = 3600;
                    }
                    
                    if ($scope.game_rules[i].game_name == "Swarm")
                      $scope.showTargetTimeoutTime = true;
                    if ($scope.game_rules[i].game_name == "PvP")
                       $scope.showTargetTimeoutOption = false;

                    if ($scope.game_rules[i].game_name == "Subsecond" || $scope.game_rules[i].game_name == "Overrun" || $scope.game_rules[i].game_name == "Swarm" || $scope.game_rules[i].game_name == "Manual Control")
                    {
                      gameParameters['maxtime'] = 3600; //default
                      $scope.maxtime = $scope.maxtimes[11]; // set a default selection

                    }


                    //console.log($scope.game_rules[i]['attribute_name']);

                    if ($scope.game_rules[i]['attribute_name'] == "Time between waves") {
                      $scope.showTimeBetweenWavesOption = true;
                      
                      // overriding values coming from basestation
                      /*
                      $scope.time_between_waves.push({
                        name: $scope.game_rules[i]['attribute_value'],
                        id: $scope.game_rules[i]['attribute_value_2']
                      });*/
                      
                      
                      
                    }
                    if ($scope.game_rules[i]['attribute_name'] == "Target timeout time") {
                      $scope.showTargetTimeoutTimeOption = true;

                      
                        $scope.target_timeout_times.push({
                          name: $scope.game_rules[i]['attribute_value'],
                          id: $scope.game_rules[i]['attribute_value_2']
                        });
                        $scope.target_timeout_time = $scope.target_timeout_times[2]; // set a default selection
                        if (window.localStorage.getItem("target_timeout_time") !== null)
                          $scope.target_timeout_time = $scope.target_timeout_times[window.localStorage.getItem("target_timeout_time")] ;
                      
                    
                      
                    }

                    if ($scope.game_rules[i]['attribute_name'] == "Targets per station") {
                      $scope.showTargetsPerStation = true;
                      /*
                      $scope.targets_per_station.push({
                        name: $scope.game_rules[i]['attribute_value'],
                        id: $scope.game_rules[i]['attribute_value']
                      });
                      */
                          
                    }

                    if ($scope.game_rules[i]['attribute_name'] == "Score limit") {
                      ///console.log("here: " + $scope.game_rules[i]['attribute_value']);
                      $scope.showScoreLimitLabel = true;
                      $scope.scorelimits.push({
                        name: $scope.game_rules[i]['attribute_value'],
                        id: $scope.game_rules[i]['attribute_value']
                      });
                      $scope.scorelimit = $scope.scorelimits[2]; // set a default selection
                    }

                    if ($scope.game_rules[i]['attribute_name'] == "Speed") {
                      $scope.showSpeed = true;
                      //console.log($scope.game_rules[i]['attribute_value']);
                      /*
                      $scope.speed.push({
                        name: $scope.game_rules[i]['attribute_value'],
                        id: $scope.game_rules[i]['attribute_value_2']
                      });
                      */
                      $scope.set_speed = $scope.speed[6]; // set a default selection

                      if ($scope.game_rules[i].game_name == "Overrun")
                      {
                          $scope.set_speed = $scope.speed[11];
                          gameParameters['speed'] = 3000;
                      }
                      if ($scope.game_rules[i].game_name == "PvP" || $scope.game_rules[i].game_name == "Race")
                          gameParameters['speed'] = 800;
 

                          
                  
                      
                    }

                    if ($scope.game_rules[i]['attribute_name'] == "Double tap") {

                      $scope.showDoubleTapOption = true;
                      //console.log($scope.game_rules[i]['attribute_value']);

                      
                    }

                    if ($scope.game_rules[i]['attribute_name'] == "Capture and hold") {

                      $scope.showCaptureHoldOption = true;
                      //console.log($scope.game_rules[i]['attribute_value']);

                    }

                    if ($scope.game_rules[i]['attribute_name'] == "Shoot / no shoot") {

                      $scope.showShootNoShootOption = true;
                      //console.log("shoot no shoot: " + $scope.game_rules[i]['attribute_value']);
 
                        


                    }


                    if ($scope.game_rules[i]['attribute_name'] == "Paddle sequence") {
                      $scope.showPaddleSequence = true;
                      //console.log($scope.game_rules[i]['attribute_value']);
                      $scope.paddle_sequence.push({
                        name: $scope.game_rules[i]['attribute_value'],
                        id: $scope.game_rules[i]['attribute_value']
                      });
                      $scope.set_paddle_sequence = $scope.paddle_sequence[1]; // set a default selection
                    }


                    if ($scope.game_rules[i]['attribute_name'] == "Target timeout") {
                      $scope.showTargetTimeoutOption = true;
                      //console.log($scope.game_rules[i]['attribute_value']);
                    }


                    $scope.choose_game = $scope.game_rules[i].game_name;
                    $scope.game_name = $scope.game_rules[i].game_name;
                    $scope.showGameDescription = true;
                  }
                   
                  if (window.localStorage.getItem("game_speed") !== null && $scope.game_name == "Overrun"){
                     // console.log($scope.speed);
                        $scope.set_speed = $scope.speed[window.localStorage.getItem("game_speed")] ;
                        gameParameters['speed'] = $scope.speed[window.localStorage.getItem("game_speed")].id;
                      }

                  if ( $scope.game_name == "PvP" || $scope.game_name == "Run N Gun"){
                     // console.log($scope.speed);
                        
                        gameParameters['speed'] =10;
                      }

                


                    checkMatchTypeInStorage();
                    
                   //matchtype = $scope.matchtypes[0];


                }).
                error(function(data, status) {
                  console.log("Could not talk to base station");
                });


                $scope.card = $scope.game_types[j].game_name;
                $scope.card_objective = $scope.game_types[j]['game_description'];
                if ($scope.card == "PvP")
                {
                  $scope.card_objective ="Objective: PvP is a 2 player game. Choose two players to compete against each other. The game modifier 'First to score' sets the game point at which the game ends. Enable double tap to increase difficulty."
                }
                if ($scope.card == "Overrun")
                {
                  $scope.card_objective ="Objective: Hit as many targets as you can before being overrun. After each hit, the next target will pop 50ms faster than the last target. When the field of targets are all lit green, you have been overrun and the session ends. Achievements are made by obtaining the highest target streak. Adjust the 'Speed' to activate a target at that starting interval."
                }
                if ($scope.card == "Run N Gun")
                {
                  $scope.card_objective ="Objective: Complete the stage in the fastest possible time. All targets light up in the same sequence from game to game. Change the game modifiers to increase or decrease stage difficulty."
                }
                if ($scope.card == "PvP")
                {
                  $scope.card_objective ="Objective: Beat your opponent by shooting to the frag limit faster. First person to the frag limit wins. "
                }
                if ($scope.card == "Freeplay")
                {
                  $scope.card_objective ="Freeplay is a casual game that always ensures there are few randomly activated targets in the field; ideal for warming up before a match or for function fire testing. "
                }
                if ($scope.card == "Manual Control")
                {
                  $scope.card_objective ="Manual Control gives full sequencing control of each target to the operator; ideal for firearms instructors creating drills and challenges. "
                }
                if ($scope.card == "Subsecond")
                {
                  $scope.card_objective ="Subsecond is a repetitive drill that only activates a couple of targets at a time with a pause between each drill completion to report shot times and to prepare the shooter to restart the drill. This drill enables the shooter to focus on specific fundamentals the shooter is training on, whether it be drawing from the holster, speed or accuracy. "
                }
                $scope.image = $scope.game_types[j]['game_image'];

                $scope.showcardspace = true;
              }
            }

            




    }




    $scope.add_player_to_game = function(val, name) {

  
      //console.log($scope.activity.players);
          //$scope.player_names = $scope.activity.players;
         


      console.log("Player id : " + val );
      //console.log("matchtype: " + $scope.matchtype)
 

      //for (var key in $scope.player_names) {
      //  if ($scope.player_names[key].id == val)
      //  {
          //console.log("Player name: " + $scope.player_names[key].name)
      //  }
      //}


      
      
      // single player games
      if (gameParameters['matchtype'] == "Single player" ||$scope.player_list[0] == 1) // just clear array each time and start fresh
      {
        // clearing player list array
        $scope.player_list = [];
      }



      // splicing handles checking and unchecking of checkboxes
      index = $scope.player_list.indexOf(val); // find player in array
      console.log("index: " + index);
      if (index > -1) {
        $scope.player_list.splice(index, 1); // remove player from array
      } else {
        $scope.player_list.push(val); // add player into array
      }
      console.log($scope.player_list);
    }

    gameParameters['paddle_sequence'] = "2 target presentation";
    $scope.updatePaddleSequence = function(set_paddle_sequence) {
      console.log("paddle sequence: " + set_paddle_sequence);
      $scope.set_paddle_sequence = set_paddle_sequence;
      gameParameters['paddle_sequence'] = $scope.set_paddle_sequence;
      console.log(gameParameters['paddle_sequence']);
    }

    $scope.matchType_tip = function() {
      console.log("clicked");
      var alertPopup = $ionicPopup.alert({
        title: 'Match type',
        template: 'If co-op, all shooters may participate in game/drill. Single player must have one profile chosen. Two player mode must have two profiles chosen. '

      });
    }

    $scope.maxHits_tip = function() {
      console.log("clicked");
      var alertPopup = $ionicPopup.alert({
        title: 'Frag Limit',
        template: 'The total number of target strikes before ending game.'

      });
    }

    $scope.maxTime_tip = function() {
      console.log("clicked");
      var alertPopup = $ionicPopup.alert({
        title: 'Time Limit',
        template: 'The maximum time allowed before ending game.'

      });
    }

    $scope.firstToScore_tip = function() {
      console.log("clicked");
      var alertPopup = $ionicPopup.alert({
        title: 'Frag Limit',
        template: 'Set the number of target strikes to win the round. '

      });
    }
    $scope.scoreLimit_tip = function() {
      console.log("clicked");
      var alertPopup = $ionicPopup.alert({
        title: 'Score limit',
        template: 'For points based games, game ends when score limit is reached. '

      });
    }

    $scope.speed_tip = function() {
      console.log("clicked");
      var alertPopup = $ionicPopup.alert({
        title: 'Speed',
        template: 'Increase or decrease the time between each paddle release. Reducing speed increases difficulty. '

      });
    }

    $scope.paddleSequence_tip = function() {
      console.log("clicked");
      var alertPopup = $ionicPopup.alert({
        title: 'Paddle Sequence',
        template: 'Randomize: each paddle release will be randomly selected.<br/>In sequence: paddles will be released in numerical order. <br/>Mozambique: first paddle will be double tap, subsequent paddles will be single tap. '

      });
    }

    $scope.targetsPerStation_tip = function() {
      console.log("clicked");
      var alertPopup = $ionicPopup.alert({
        title: 'Targets per station',
        template: 'For shooting targets on the move, group targets into shooting stations. '

      });
    }

    $scope.shootNoShoot_tip = function() {
      console.log("clicked");
      var alertPopup = $ionicPopup.alert({
        title: 'Shoot / no shoot',
        template: 'When popping targets, one target will be lit red and striking it will cause a deduction in points. '

      });
    }

    $scope.doubleTap_tip = function() {
      console.log("clicked");
      var alertPopup = $ionicPopup.alert({
        title: 'Doubletap',
        template: 'Target must be shot twice to sink paddle.  '

      });
    }

    $scope.targetTimeout_tip = function() {
      console.log("clicked");
      var alertPopup = $ionicPopup.alert({
        title: 'Target Timeout',
        template: 'Provide a limited amount of time to shoot a target before it timesout and moves to another target. A target that times out will count as a miss decreasing overall score.  '

      });
    }
    $scope.totalMissesAllowed_tip = function() {
      console.log("clicked");
      var alertPopup = $ionicPopup.alert({
        title: 'Total misses allowed',
        template: 'Specify the number of missed shots before the game ends. Lowering the number of missed shots increases the difficulty of reaching higher waves.  '

      });
    }

    $scope.captureAndHold_tip = function() {
      console.log("clicked");
      var alertPopup = $ionicPopup.alert({
        title: 'Capture and hold',
        template: 'This is a game modifier for Domination-Z which will engage magnets on a captured base after a sequence of light blips. If the opposing team does not neutralize base in the during this time, controlling team has opportunity to shoot targets down for addition time controlling base. '

      });
    }

    $scope.timeBetweenWaves_tip = function() {
      console.log("clicked");
      var alertPopup = $ionicPopup.alert({
        title: 'Time between waves',
        template: 'Specify the amount of time before the next wave begins. This time is intended to allow shooters time to reload their weapons.'

      });
    }

    $scope.targetTimeoutTime_tip = function() {
      console.log("clicked");
      var alertPopup = $ionicPopup.alert({
        title: 'Target Timeout Time',
        template: 'Specify the amount of time before a target times out. A target that times out will count as miss. '

      });
    }


    
    $scope.showDoubleTap = function(double_tap) {
      console.log("double_tap: " + double_tap);
      if (double_tap)
      {
        $scope.double_tap = true;
        console.log("storing as true")
      }
      else
      {
        $scope.double_tap = false;
        console.log("storing as false")
      }

      window.localStorage.setItem("double_tap", double_tap);
      console.log(window.localStorage.getItem("double_tap"));
    }

    $scope.capture_and_hold = "false";
    $scope.showCaptureHold = function(capture_and_hold) {
      console.log("capture and hold: " + capture_and_hold);
      $scope.capture_and_hold = capture_and_hold;
    }


    $scope.shoot_no_shoot = "false";
    $scope.showShootNoShoot = function(shoot_no_shoot) {
      console.log("shoot / no shoot: " + shoot_no_shoot);
      $scope.shoot_no_shoot = shoot_no_shoot;
    }

    $scope.target_timeout = "false";
    $scope.showTargetTimeout = function(target_timeout) {
      console.log("Target Timeout: " + target_timeout);
      $scope.target_timeout = target_timeout;
    }


    // package up game parameters, send it to base station to
    // echo back to all other devices for redirect to game screen
    $scope.goToGame = function($rootScope) {
      console.log("going to game:  " + $scope.set_target_per_station);
      
      console.log("before change: " + $scope.matchtype + " " + gameParameters['matchtype']);
      console.log("***************");
      console.log($scope.card);
      console.log("***************");
      gameParameters['gamename'] = $scope.card;

      if ($scope.selectedgamename == "PvP" || $scope.selectedgamename == "Race")
      {
        //gameParameters['maxtime'] = 600; 
        $scope.showMatchTypeLabel = false;
      //  gameParameters['speed'] = 800;

      }


      gameParameters['double_tap'] = $scope.double_tap;
      gameParameters['capture_and_hold'] = $scope.capture_and_hold;
      gameParameters['target_timeout'] = $scope.target_timeout;
      gameParameters['shoot_no_shoot'] = $scope.shoot_no_shoot;
      if ($scope.player_list.length == 0) {
        $scope.player_list.push(1); // player 1 is co-op
        gameParameters['player_list'] = $scope.player_list;
      }


      var err = 0;
      console.log("player list");
      console.log($scope.player_list[0]);
      console.log( $scope.matchtype);
      if ($scope.player_list[0] == 1 && gameParameters['matchtype'] == 'Single player') {
        //showChoosePlayer();
        console.log("allllelrrrrtttt");
        err = 1;

        var alertPopup = $ionicPopup.alert({
          title: 'Please add a player to the game',

        });
      }
      if ($scope.player_list.length >1 && gameParameters['matchtype'] == 'Single player') {
        //showChoosePlayer();
        err = 1;
        var alertPopup = $ionicPopup.alert({
          title: 'Please select only one player for this game',

        });
      }
      
      if (($scope.player_list.length < 2 && $scope.matchtype == '1 vs 1') || ($scope.player_list.length >2 && $scope.matchtype == '1 vs 1')) {
        //showChoosePlayer();

        err = 1;
        var alertPopup = $ionicPopup.alert({
          title: 'Two players are required for 1 vs 1',

        });
      }
      gameParameters['player_list'] = $scope.player_list;
      
      if ($scope.matchtype != '1 vs 1' && $scope.matchtype != 'Single player')
      {
        $scope.matchtype = "Co-op";
        console.log("CHANGED MATCHTHYPE TO COOP");
      }

      //gameParameters['matchtype'] = $scope.matchtype; // default
      if (!err) {
        



        gameParameters['uid'] = uid;
        console.log(gameParameters['matchtype']);
        console.log(gameParameters);
        // this has been deprecated to prevent spectator viewing
         //socket.emit('goToPage', JSON.stringify(gameParameters));

        console.log("My Uid" + uid);

         // added this for local redirect to game screen instead of spectator redirect
  

        if ($scope.scorelimit > 0)
          $scope.scorelimit = $scope.scorelimit;
        else
          $scope.scorelimit = 15;

        
        socket.emit('storePreviousGameObject', JSON.stringify(gameParameters));
        // socket.emit callback
        socket.on ('messageSuccess', function (data) {
         //do stuff here
         console.log("message success...navigating((((((((((((()))))))))))...")

         $ionicHistory.clearCache().then(function() {
          $state.go('game', {
            gameid: gameParameters['gamename'],
            maxtime: gameParameters['maxtime'],
            firsttoscore: gameParameters['firsttoscore'],
            max_targets: gameParameters['max_targets'],
            time_between_waves: gameParameters['time_between_waves'],
            target_timeout_times: gameParameters['target_timeout_times'],
            total_misses_allowed: gameParameters['total_misses_allowed'],
            paddle_sequence: gameParameters['paddle_sequence'],
            targets_per_station: gameParameters['targets_per_station'],
            speed: gameParameters['speed'],
            double_tap: gameParameters['double_tap'],
            capture_and_hold: gameParameters['capture_and_hold'],
            target_timeout: gameParameters['target_timeout'],
            matchtype: gameParameters['matchtype'],
            scorelimit: gameParameters['scorelimit'],
            player_list: gameParameters['player_list'],
            shoot_no_shoot: gameParameters['shoot_no_shoot'],
            event: gameParameters['event'],
            uid: uid
          }, {
            reload: true
          });
        });


        });

        

 

      }

    }


    $scope.showPlayerListPopup = function() {

      /*<ion-list >
       <ion-radio ng-show="radio_list_players" class="playername" ng-click="add_player_to_game('{{player.id}}')" show-reorder="shouldShowReorder"  ng-repeat="player in player_names"  ng-model="isChecked"  ng-true-value="" ng-false-value=""  >{{player.name}}</ion-radio>
       <ion-checkbox ng-show="checkbox_list_players" class="playername" ng-click="add_player_to_game('{{player.id}}')" show-reorder="shouldShowReorder" ng-repeat="player in player_names"   >{{player.name}}</ion-checkbox>
       </ion-list><!--  ng-model="player.isChecked" ng-checked="isChecked"-->
       */

      // splicing handles checking and unchecking of checkboxes
      /*
       index = $scope.player_list.indexOf(val); // find player in array
       console.log("index: " + index);
       if (index > -1) {
       $scope.player_list.splice(index, 1); // remove player from array
       }
       else
       {
       $scope.player_list.push(val); // add player into array

       }
       */
      console.log("showing player list");
      console.log("player list len " + $scope.activity.players.length);

      $scope.radio_list = '';
      for (var i = 0; i < $scope.activity.players.length; i++) {
        console.log($scope.activity.players[i].name);
        $scope.radio_list += '<ion-checkbox ng-show="checkbox_list_players" class="playername" ng-click="add_player_to_game(' + player.id + ')" show-reorder="shouldShowReorder" ng-model="isChecked" ng-value="\'' + player.name + '\'">' + player.name + '</ion-radio>';
      }
    }

    


 
  }
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});
