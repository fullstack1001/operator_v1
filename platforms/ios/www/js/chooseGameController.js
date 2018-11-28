angular.module('app.chooseGameController', [])

.controller('gamesDrills', ['$scope', '$stateParams', '$timeout', '$ionicPopup',
   '$http', '$location', '$state', '$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function($scope, $stateParams, $timeout, $ionicPopup, $http, $location, $state, $ionicHistory, $window) {
 
  
  $scope.activity;
  $scope.msg = "Configure a match or drill"
  $scope.base_msg_window = false;
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
  $scope.showPaddleSequence = false;
  $scope.showTargetsPerStation = false;
  $scope.showMaxTimeLabel = false;
  $scope.showScoreLimitLabel = false;
  $scope.showDoubleTapOption = false;
  $scope.showShootNoShootOption = false;
  $scope.showTargetTimeoutOPtion = false;
  $scope.showCaptureHoldOption = false;
  $scope.showTimeBetweenWavesOption = false;
 
  var gameParameters = {};

  $scope.doRefresh = function() {
    $state.go($state.current, {}, {reload: true});
       // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
    $window.location.href='/#/page1/page2';
 
  };

	var manager = io.Manager('http://'+ip+':'+port+'/', { /* options */ });
	manager.socket('/namespace');
	manager.on('connect_error', function() {
     $scope.$apply(function () {
          $scope.base_msg_data = "Not connected to base station";
          $scope.base_msg_window = true;
     });
	});



  // setup sockets
  var socket = io.connect('http://'+ip+':'+port+'/');
 
   socket.on('jsonrows', function(data){
       $scope.activity = angular.fromJson(data);
       console.log($scope.activity);
       $scope.$apply(function () {

       $scope.player_names = $scope.activity.players;
       $scope.base_msg_window = false;

       // display battery warnings
       $scope.lowbattery = false;
       for (var key in $scope.activity.target)
        { 
          var adc = $scope.activity.target[key].volt;
              if (adc > 1500)
                  adc = 1;
          if (adc < 100 )
          {
            $scope.lowbattery = true;
            continue;
          }
        }

        if ($scope.lowbattery)
        {
            $scope.base_msg_data = "Low battery";
            $scope.base_msg_window = true;
            $scope.msg = "";
        }
        if ($scope.activity.repeaters == 0)
        {
          $scope.base_msg_data = "No repeaters found";
          $scope.base_msg_window = true;
          $scope.msg = "";
        }

     });
   });

   $scope.$on('$destroy', function (event) {
    socket.removeAllListeners();
   });

  // if battery is low, let button click navigate
   $scope.base_msg_click = function(){
      if ( $scope.lowbattery)
      {
            $state.go('home.diagnostics'); 
      }
    }


 
  // host fired off goToPage broadcast. 
  // this is the echo back and redirects all devices to game screen
	socket.on('goToPageBroadcast', function(data){
      $scope.base_msg_window = false;
      $scope.game_data = angular.fromJson(data);

      if ($scope.scorelimit > 0)
        $scope.scorelimit = $scope.scorelimit;
      else
        $scope.scorelimit = 15;

      $ionicHistory.clearCache().then(function(){
      $state.go('game', {gameid: $scope.game_data.gamename, maxtime: $scope.game_data.maxtime, 
        max_targets: $scope.game_data.max_targets, time_between_waves: $scope.game_data.time_between_waves,
        paddle_sequence: $scope.game_data.paddle_sequence,targets_per_station: $scope.target_per_station, speed: $scope.game_data.speed, 
        double_tap: $scope.game_data.double_tap, capture_and_hold: $scope.game_data.capture_and_hold, target_timeout: $scope.game_data.target_timeout,
        matchtype: $scope.matchtype, scorelimit: $scope.scorelimit,
        player_list: $scope.game_data.player_list }, {reload: true});
      });
 
  });
 
  // Select dropdown options on screen
  gameParameters['maxtime'] = 120;//default
  $scope.showMaxTime = function(maxtime) {
    console.log("max time: " + maxtime);
    $scope.maxtime = maxtime;
    gameParameters['maxtime'] = $scope.maxtime;
  }

  gameParameters['targets_per_station'] = 2; // default
  $scope.udpateTargetsPerStation = function(target_per_station) {
    console.log("Targets per station: " + target_per_station);
    $scope.target_per_station = target_per_station;
    gameParameters['targets_per_station'] = $scope.target_per_station;
  }

  $scope.showScoreLimit = function(scorelimit) {
    console.log("score limit: " + scorelimit);
    $scope.scorelimit = scorelimit;
     gameParameters['scorelimit'] = $scope.scorelimit;
  }

  $scope.matchtype = "Co-op";
  $scope.showmatchtype = function(matchtype) {

    console.log("matchtype: " + matchtype);
    if (matchtype == "Single player")
    {
      $scope.showplayers = true;
      $scope.join_players = "Join a player to the game";
      $scope.radio_list_players = true;
      $scope.checkbox_list_players = false;
      $scope.matchtype = matchtype;
    }
    else if (matchtype == "1 vs 1")
    {
      $scope.showplayers = true;
      $scope.join_players = "Join players to the game";
      $scope.checkbox_list_players = true;
      $scope.radio_list_players = false;
      //$scope.showPlayerListPopup();
      $scope.matchtype = matchtype;
    }
    else
    {
      $scope.matchtype = "Co-op";
    }

   
    // reset for when user bounces back and forth with match types
    $scope.player_list = [1];

    

  }
 

  gameParameters['max_targets'] = 10; //default
  $scope.showMaxTargets = function(max_target) {
    console.log("max targets: " + max_target);
    $scope.max_target = max_target;
    gameParameters['max_targets'] = $scope.max_target;
  }

  gameParameters['time_between_waves'] = 10;
  $scope.showTimeBetweenWaves = function(time_between_wave) {
    console.log("time between waves: " + time_between_wave);
    $scope.time_between_wave = time_between_wave;
    gameParameters['time_between_waves'] = $scope.time_between_wave;

  }
  
 
  gameParameters['speed'] = 100;
  $scope.updateSpeed = function(set_speed) {
    console.log("speed: " + set_speed);
    $scope.set_speed = set_speed;
    gameParameters['speed'] = $scope.set_speed;
  }

  $scope.player_list = []; // array of players
  $scope.add_player_to_game = function(val){
      console.log("Player id : " + val);
      
      if ($scope.matchtype == "Single player" || $scope.player_list[0] == 1) // just clear array each time and start fresh
      {
        $scope.player_list = [];
      }
      


      // splicing handles checking and unchecking of checkboxes
      index = $scope.player_list.indexOf(val); // find player in array
      console.log("index: " + index);
      if (index > -1) {
          $scope.player_list.splice(index, 1); // remove player from array
      }
      else
      {
        $scope.player_list.push(val); // add player into array

      }

      console.log(index);
      console.log($scope.player_list);
  }

    gameParameters['paddle_sequence'] = "2 target presentation";
    $scope.updatePaddleSequence = function(set_paddle_sequence) {
    console.log("paddle sequence: " + set_paddle_sequence);
    $scope.set_paddle_sequence = set_paddle_sequence;
    gameParameters['paddle_sequence'] = $scope.set_paddle_sequence;
    console.log(gameParameters['paddle_sequence']);
  }

  $scope.matchType_tip= function() {
    console.log("clicked");
    var alertPopup = $ionicPopup.alert({
          title: 'Match type',
          template: 'If co-op, all shooters may participate in game/drill. Single player must have one profile chosen. Two player mode must have two profiles chosen. '

        });
  }

  $scope.maxHits_tip= function() {
    console.log("clicked");
    var alertPopup = $ionicPopup.alert({
          title: 'Max Hits',
          template: 'The total number of paddle hits before ending game.'

        });
  }
  
  $scope.maxTime_tip= function() {
    console.log("clicked");
    var alertPopup = $ionicPopup.alert({
          title: 'Max Time',
          template: 'The maximum time allowed before ending game.'

        });
  }
  $scope.scoreLimit_tip= function() {
    console.log("clicked");
    var alertPopup = $ionicPopup.alert({
          title: 'Score limit',
          template: 'For points based games, game ends when score limit is reached. '

        });
  }

  $scope.speed_tip= function() {
    console.log("clicked");
    var alertPopup = $ionicPopup.alert({
          title: 'Speed',
          template: 'Increase or decrease the time between each paddle release. '

        });
  }

  $scope.paddleSequence_tip= function() {
    console.log("clicked");
    var alertPopup = $ionicPopup.alert({
          title: 'Paddle Sequence',
          template: 'Randomize: each paddle release will be randomly selected.<br/>In sequence: paddles will be released in numerical order. <br/>Mozambique: first paddle will be double tap, subsequent paddles will be single tap. '

        });
  }

  $scope.targetsPerStation_tip= function() {
    console.log("clicked");
    var alertPopup = $ionicPopup.alert({
          title: 'Targets per station',
          template: 'For shooting targets on the move, group targets into shooting stations. '

        });
  }

  $scope.shootNoShoot_tip= function() {
    console.log("clicked");
    var alertPopup = $ionicPopup.alert({
          title: 'Shoot / no shoot',
          template: 'When popping targets, one target will be lit red and striking it will cause a deduction in points. '

        });
  }

  $scope.doubleTap_tip= function() {
    console.log("clicked");
    var alertPopup = $ionicPopup.alert({
          title: 'Doubletap',
          template: 'Target must be shot twice to sink paddle.  '

        });
  }

  $scope.targetTimeout_tip= function() {
    console.log("clicked");
    var alertPopup = $ionicPopup.alert({
          title: 'Target Timeout',
          template: 'Provide a limited amount of time to shoot a target before it timesout and moves to another target. A target that times out will count as a miss decreasing overall score.  '

        });
  }
 
  $scope.captureAndHold_tip= function() {
    console.log("clicked");
    var alertPopup = $ionicPopup.alert({
          title: 'Capture and hold',
          template: 'This is a game modifier for Domination-Z which will engage magnets on a captured base after a sequence of light blips. If the opposing team does not neutralize base in the during this time, controlling team has opportunity to shoot targets down for addition time controlling base. '

        });
  }

  $scope.timeBetweenWaves_tip= function() {
    console.log("clicked");
    var alertPopup = $ionicPopup.alert({
          title: 'Time between waves',
          template: 'Specify the amount of time before the next wave begins. This time is intended to allow shooters time to reload their weapons.'

        });
  }
  

  $scope.double_tap = "false";
  $scope.showDoubleTap = function(double_tap) {
    console.log("doubleTap: " + double_tap);
    $scope.double_tap = double_tap;
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
       
      gameParameters['gamename'] = $scope.data.gamename;

      console.log("going to game:  " + $scope.set_target_per_station);
      if (gameParameters['speed'] == 100 && $scope.data.gamename == "Overrun")
      gameParameters['speed'] = 4000;

      gameParameters['double_tap'] = $scope.double_tap;

      gameParameters['capture_and_hold'] = $scope.capture_and_hold;

      gameParameters['target_timeout'] = $scope.target_timeout;
      if ($scope.player_list.length == 0)
          $scope.player_list.push(1); // player 1 is co-op
      gameParameters['player_list'] = $scope.player_list;
     // gameParameters['matchtype'] = 'Co-op'; // default
     

  
      var err = 0;
      if ($scope.player_list[0] == 1 && $scope.matchtype == 'Single player'){
        //showChoosePlayer();
        err = 1;
        var alertPopup = $ionicPopup.alert({
          title: 'Please add a player to the game',
      
        });
      } 
      if ($scope.player_list.length < 2 && $scope.matchtype == '1 vs 1'){
        //showChoosePlayer();
        err = 1;
        var alertPopup = $ionicPopup.alert({
          title: 'Two players required for 1 vs 1',
   
        });
      }
      if ($scope.matchtype != '1 vs 1' && $scope.matchtype != 'Single player')
        $scope.matchtype = "Co-op"; 
        
      gameParameters['matchtype'] = $scope.matchtype; // default
      if (!err){

        console.log(gameParameters);
        socket.emit( 'goToPage', JSON.stringify(gameParameters) ); 
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
      for (var i=0; i<$scope.activity.players.length; i++)
      { 
        console.log($scope.activity.players[i].name);
        $scope.radio_list += '<ion-checkbox ng-show="checkbox_list_players" class="playername" ng-click="add_player_to_game(' + player.id + ')" show-reorder="shouldShowReorder" ng-model="isChecked" ng-value="\'' + player.name + '\'">'+player.name+'</ion-radio>';
      }


  }

    $scope.showGameListPopup = function() {
      $scope.data = {};
      
       $scope.game_types;

      // get game types
      console.log("http://"+ip+":"+port+"/?page=game_types&json_callback=JSON_CALLBACK");
      $http({method: 'GET', url: "http://"+ip+":"+port+"/?page=game_types&json_callback=JSON_CALLBACK"}).
      success(function(data, status) {
        
        $scope.game_types = angular.fromJson(data);
        console.log($scope.game_types);
               
    

      $scope.radio_list = '';
      for (var i=0; i<$scope.game_types.length; i++)
      {
        $scope.radio_list += '<ion-radio  ng-model="data.gamename" ng-value="\'' + $scope.game_types[i]['game_name'] + '\'">'+$scope.game_types[i]['game_name']+'</ion-radio>';
      }


      var confirmPopup = $ionicPopup.confirm({
         title: 'Select a Game',
         template: $scope.radio_list,

          scope: $scope
      });

      confirmPopup.then(function(res) {

        
         if(res) { // Ok button clicked



          // display game type information once selected
          for (var i=0; i<$scope.game_types.length; i++)
          {
            if ($scope.game_types[i]['game_name'] == $scope.data.gamename)
            {
                // get game options from game_rules table
                $http({method: 'GET', url: "http://"+ip+":"+port+"/?page=game_rules&game_type_id="+$scope.game_types[i]['game_type_id']+"&json_callback=JSON_CALLBACK"}).
                  success(function(data, status) {
                    
                    $scope.game_rules = angular.fromJson(data);
                    console.log($scope.game_rules);
             
                    $scope.set_speed = 500;
                    $scope.matchtypes = [];
                    $scope.max_targets = [];
                    $scope.maxtimes = [];
                    $scope.time_between_waves = [];
                    $scope.speed = [];
                    $scope.scorelimits = [];
                    $scope.paddle_sequence = [];
                    $scope.targets_per_station = [];
                    for (var i=0; i<$scope.game_rules.length; i++)
                    {
                        
                      /* the matchtype options
                        $scope.matchtypes = [
                          {name: 'Single player', id:1 },
                          {name: 'Co-op', id:2 },
                          {name: '1 vs 1', id:3 }
                        ];
                      */

                      if ($scope.game_rules[i]['attribute_name'] == "Match type")
                      {
                        //&& $scope.game_rules[i]['attribute_value'] != "All or None"
                          // populate drop list  but watch for games that are not two player
                          if (($scope.data.gamename == "Overrun"  || $scope.data.gamename == "All or None" ) && $scope.game_rules[i]['attribute_value'] == "1 vs 1"  ){
                            // don't display 1 vs 1 option
                          }
                          else
                          {
                            $scope.matchtypes.push({name: $scope.game_rules[i]['attribute_value'], id: $scope.game_rules[i]['game_type_attribute_value_id']});
                            $scope.matchtype = $scope.matchtypes[1]; // set a default selection 

                          }
                          
                      }

                      if ($scope.game_rules[i]['attribute_name'] == "Max hits")
                      {
                        //console.log($scope.game_rules[i]['attribute_name']);
                        $scope.max_targets.push({name: $scope.game_rules[i]['attribute_value'], id: $scope.game_rules[i]['attribute_value'] });
                        $scope.max_target = $scope.max_targets[8]; // set a default selection
                      }

                      if ($scope.game_rules[i]['attribute_name'] == "Max time")
                      {
                        $scope.showMaxTimeLabel = true;
                        $scope.maxtimes.push({name: $scope.game_rules[i]['attribute_value'], id: $scope.game_rules[i]['attribute_value_2'] });
                        $scope.maxtime = $scope.maxtimes[3]; // set a default selection
                      }
//console.log($scope.game_rules[i]['attribute_name']);
                      if ($scope.game_rules[i]['attribute_name'] == "Time between waves")
                      {
                         $scope.showTimeBetweenWavesOption = true;
                        console.log("waves: " + $scope.game_rules[i]['attribute_value']);
                        $scope.time_between_waves.push({name: $scope.game_rules[i]['attribute_value'], id: $scope.game_rules[i]['attribute_value_2'] });
                        $scope.time_between_wave = $scope.time_between_waves[3]; // set a default selection
                      }

                      if ($scope.game_rules[i]['attribute_name'] == "Targets per station")
                      {
                         $scope.showTargetsPerStation = true;
                       // console.log( $scope.game_rules[i]['attribute_name'] + ' ' + $scope.game_rules[i]['attribute_value']);
                        $scope.targets_per_station.push({name: $scope.game_rules[i]['attribute_value'], id: $scope.game_rules[i]['attribute_value'] });
                        $scope.set_target_per_station = $scope.targets_per_station[0]; // set a default selection
                        console.log("doulbe checking " + $scope.set_target_per_station);
                      }

                      if ($scope.game_rules[i]['attribute_name'] == "Score limit")
                      {
                        console.log("here: " + $scope.game_rules[i]['attribute_value']);
                        $scope.showScoreLimitLabel = true;
                        $scope.scorelimits.push({name: $scope.game_rules[i]['attribute_value'], id: $scope.game_rules[i]['attribute_value'] });
                        $scope.scorelimit = $scope.scorelimits[2]; // set a default selection
                      }

                      if ($scope.game_rules[i]['attribute_name'] == "Speed")
                      {
                        $scope.showSpeed = true;
                        console.log($scope.game_rules[i]['attribute_value']);
                        $scope.speed.push({name: $scope.game_rules[i]['attribute_value'], id: $scope.game_rules[i]['attribute_value_2'] });
                        $scope.set_speed = $scope.speed[7]; // set a default selection
                        if ($scope.data.gamename == "Overrun")
                          $scope.set_speed = $scope.speed[13];
                      }
                      
                      if ($scope.game_rules[i]['attribute_name'] == "Double tap")
                      {

                        $scope.showDoubleTapOption = true;
                        console.log($scope.game_rules[i]['attribute_value']);
     
                      }

                      if ($scope.game_rules[i]['attribute_name'] == "Capture and hold")
                      {

                        $scope.showCaptureHoldOption = true;
                        console.log($scope.game_rules[i]['attribute_value']);
     
                      }

                      if ($scope.game_rules[i]['attribute_name'] == "Shoot / no shoot")
                      {

                        $scope.showShootNoShootOption = true;
                        console.log($scope.game_rules[i]['attribute_value']);
     
                      }


                      if ($scope.game_rules[i]['attribute_name'] == "Paddle sequence")
                      {
                        $scope.showPaddleSequence = true;
                        console.log($scope.game_rules[i]['attribute_value']);
                        $scope.paddle_sequence.push({name: $scope.game_rules[i]['attribute_value'], id: $scope.game_rules[i]['attribute_value'] });
                        $scope.set_paddle_sequence = $scope.paddle_sequence[1]; // set a default selection
                      }

                 

                      

                      if ($scope.game_rules[i]['attribute_name'] == "Target timeout")
                      {
                        $scope.showTargetTimeoutOption = true;
                        console.log($scope.game_rules[i]['attribute_value']);
           
                      }
                      

     
                      
                    } 
                    

                   
                           
                  }).
                  error(function(data, status) {
                    console.log("Could not talk to base station");
                }); 


               $scope.card = $scope.game_types[i]['game_name'];
               $scope.card_objective = $scope.game_types[i]['game_description'];
               $scope.image=$scope.game_types[i]['game_image'];
               //$scope.image='game-rungun-anim.gif';

               $scope.showcardspace = true;
            }
             
          }

          $scope.choose_game = $scope.data.gamename;
          $scope.game_name = $scope.data.gamename;
          $scope.showGameDescription = true;
           
         } else {
           console.log('You are not sure');
         }
      });


  }).
      error(function(data, status) {
        console.log("Could not talk to base station");
         
    }); 




   };


}])


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
})
 