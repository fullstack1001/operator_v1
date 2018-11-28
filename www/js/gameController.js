angular.module('app.gameController', ['ngSanitize', 'ngAnimate'])
.controller('gameCtrl', ['$scope', 'addAlert', 'openSocketService', '$stateParams', '$http', '$timeout', '$ionicPopup', 
  '$location', '$state', '$ionicHistory', '$sce', 'ngAudio',  '$window', 
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName


  function($scope, addAlert, openSocketService, $stateParams, $http, $timeout, $ionicPopup, $location, $state, $ionicHistory, $sce, ngAudio, $window) {

 
 

    $scope.addUser  = function(username) {
      console.log("adding: " + username);
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


    // tap/ swipe to go back functionality
    $scope.swipe = function() {
      window.history.back();
      // $ionicHistory.goBack(); // doesn't work
    }
    $scope.goBack = function() {
      console.warn('go back');
      window.history.back();
      // $ionicHistory.goBack(); // doesn't work
    };
    $scope.doRefresh = function () {
     
        $window.location.reload(); 
      };
    if ($stateParams.gameid == "Manual Control")
    {
      $scope.manualControlButtons = true;
 
    }
    else
      $scope.manualControlButtons = false;

    $scope.player_list = $stateParams.player_list;

    $scope.commercialDisplay = false;
    $scope.maincolumn_width = "col-100";
 
    $scope.countUpStartTime;
    $scope.countUpInterval;
    $scope.upCountingInProgress = false;
    $scope.is_green_and_active =[];
    $scope.is_yellow_and_active =[];
    $scope.is_red_and_active =[];
    $scope.player_switch = false;
    $scope.showInstructionMsg = false;
    $scope.countdownclock = true;
    $scope.countupclock = false;
    $scope.background_color_changer = "bar bar-subheader bar-light ";
    $scope.highest_streak = 0;
    $scope.chosen_color = "green";
    $scope.chosen_tapSequence = "singletap";
    $scope.show_choosegame = false;
    $scope.show_gohome = true;
    var target_hit_data = [];

    $scope.player_1_score = 0;
    $scope.player_2_score = 0;
    $scope.arr_num_of_manualcontrol_targets = [];
    $scope.num_of_manualcontrol_targets;
    $scope.showManualControlButtons = false;
    $scope.isGameActive = false;
    $scope.sound = ngAudio.load("audio/beep.wav");
    $scope.numberDisp;
    $scope.divHitLog = '';
    $scope.num_of_manualcontrol_targets = 0;
    $scope.showMainCountdownWindow = true;

    $scope.showWinnerDeclaration = false;
    $scope.show1v1 = false;
 
    
    $scope.insertspacer = false;
    $scope.intervalcounter = 0;
    $scope.showGameOptions = false;
    $scope.showTargetButtons = true;
    $scope.showRecordTime = false;
    
    $scope.bool = true;
    $scope.showSafetyCheck = true;
    $scope.show_start = true;
 
   
    //console.log($stateParams);
    $scope.runGameOnce = 0;
    $scope.countdown2 = msToTime($stateParams.maxtime * 1000);
    //$scope.countup = 0;
    //console.log("((((((((((**** " + $scope.countdown2 + " ****))))))))))");
    if ($stateParams.gameid == "Swarm") { $scope.countdown2 = "Wave 1"; }
    if ($stateParams.gameid == "Subsecond"){ $scope.countdown2 = "Ready to start!"; }
    if ($stateParams.gameid == "Overrun" || $scope.gameTitle == "Run N Gun" || $scope.gameTitle == "Manual Control"){
        
       $scope.countdownclock = false; $scope.countupclock=true;
       $scope.countup = msToTime(0);
       $scope.countdown2 = '';
       $scope.showRecordTime = true;
       $scope.showMainCountdownWindow = false;

     }

    $scope.gameOptions = "";
    $scope.targetButtons = "";
    $scope.gameTitle = $stateParams.gameid;
    $scope.firsttoscore = $stateParams.firsttoscore;
    if ($scope.gameTitle == "PvP" )
    {
      $scope.show1v1 = true;
      $scope.showMainCountdownWindow = false;
      $scope.firstto_or_bestof = "First to ";
    }
    if ($scope.gameTitle == "Race")
    {
      $scope.show1v1 = true;
      $scope.countdown2 = "Round 1";
      $scope.showMainCountdownWindow = false;
      $scope.firstto_or_bestof = "Best of ";

      
    }

    // background color of showmaincountdown block
    $scope.countdown_bg_color = "rgb(221, 221, 221);"

    $scope.time_between_waves = $stateParams.time_between_waves;
    $scope.target_timeout_times = $stateParams.target_timeout_times;
    $scope.total_misses_allowed = $stateParams.total_misses_allowed;
    $scope.maxtime = $stateParams.maxtime;
    $scope.event = $stateParams.event;
    $scope.matchtype = $stateParams.matchtype;
    $scope.max_targets = $stateParams.max_targets;
    $scope.msg = "Waiting for host to start a game...";

    $scope.paddle_sequence = $stateParams.paddle_sequence;

    $scope.targets_per_station = $stateParams.targets_per_station;
    if ($stateParams.gameid == "Swarm" || $stateParams.gameid == "Overrun" || $stateParams.gameid == "All or None" )
        $scope.targets_per_station = 0;
    $scope.round_count = 1;
    $scope.runCountDownOnce = 0;
    $scope.runGameProgressOnce = 0;
    $scope.runPlayerMsgOnce = 0;
    $scope.speed = $stateParams.speed;
    $scope.speed_start = true;
    $scope.targets_remaining = "Hits left: " + $scope.max_targets;
    if ($scope.gameTitle == "Swarm") { $scope.targets_remaining = "Hits left: ∞"; }
    if ($scope.gameTitle == "PvP"){
      $scope.targets_remaining = "First to score " + $scope.firsttoscore + " wins";
      $scope.checkbox_list_players = true;
        $scope.radio_list_players = false;
    }
              
    if ($scope.gameTitle == "Race")
              $scope.targets_remaining = "Best of " + $scope.firsttoscore + " wins";
    if ($scope.double_tap == "true") {
      $scope.doubletap_columns = true;
      $scope.singletap_columns = false;
    } else {
      $scope.doubletap_columns = false;
      $scope.singletap_columns = true;
    }
    if ($stateParams.gameid == "Manual Control")
    {
      $scope.manualControlButtons = true;

      $scope.singletap_columns = false;
     }

    $scope.scorelimit = $stateParams.scorelimit;
    $scope.player_messages = false; // show or not show player messages
    $scope.show_col_splits = false;
    $scope.base_msg_data = $scope.base_msg_data ||[];
    $scope.wave = 0;
    if ($scope.gameTitle == "Swarm" || $scope.gameTitle == "Overrun" || $scope.gameTitle == "Race")
    {
      $scope.wave = 1;
      $scope.checkbox_list_players = false;
      $scope.radio_list_players = true;
 
    }
    /*
     $scope.currentTime = 1.5;
     var width = ($scope.currentTime / $scope.scorelimit)*100;
     var id = setInterval(frame, 100);
     function frame() {
     if (width >= 100) {
     clearInterval(id);
     } else {
     $scope.currentTime = $scope.currentTime + .3;
     width = ($scope.currentTime / $scope.scorelimit)*100;
     $scope.blueBarWidth="width:" + width + "%";
     $scope.orangeBarWidth="width:" + width + "%";
     }
     }
     */

    if ($scope.gameTitle == "Domination-Z") {
      $scope.capture_the_flag = true;
      //$scope.not_capture_the_flag = true;

    } else {
      $scope.capture_the_flag = false;
      //$scope.not_capture_the_flag = true;

    }


    // END ******* Setup Vars *******

    //socket = openSocketService.openSocket();
    // *********** Open socket connection to base ***********
    var ce_count = 0;
 

       //var manager = io.Manager('http://' + ip + ':' + port + '/', {/* options */timeout: 10, reconnectionDelay: 10000, reconnectionAttempts: 1000000, reconnection: true, autoConnect: true});
        //var manager = io.Manager('http://' + ip + ':' + port + '/', {timeout: 1000, randomizationFactor: 0.5});
        //var manager = io.Manager('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});
        manager
        .socket('/namespace')
        .on('disconnect', function(){
            // Do stuff (probably some jQuery)
            console.warn("disconnected!!!!")
            $scope.msg = "Not connected to basestation!";
            $scope.background_color_changer = "bar bar-subheader bar-light msg_bar_red_bg";
        })
        .on('connect_error', function () {
          ce_count++;
          console.warn("Connection error: " + ce_count);
          $scope.$apply(function () {
            $scope.base_msg_data = addAlert($scope, "Not connected to basestation - use AA WiFi");
            $scope.msg = "Not connected to basestation!";
            //$scope.background_color_changer = "bar bar-subheader bar-light msg_bar_red_bg";
            });
          })
        .on('connection', function () {
          console.log("connecting...")
          $scope.$apply(function () {
             console.log("connecting...")
            $scope.background_color_changer = "bar bar-subheader bar-light ";
            if ($scope.isGameActive)
            {
              $scope.msg = "Game in progress...";
              $scope.showSafetyCheck = false;
            }
            else
              $scope.msg = "Waiting for host to start a game...";
          });
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });


 




    var socket = io.connect('http://' + ip + ':' + port + '/');
    //var socket = io.connect('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});
    $scope.$on('$destroy', function(event) {
      socket.removeAllListeners();
    });
    // Check for alerts
    socket.once('jsonrows', function(data){

 


      $scope.activity = angular.fromJson(data) || {};
      $scope.$apply(function() {
 
        if ($scope.activity.account_type == "commercial" && $window.innerWidth > 1023 && ($scope.gameTitle  == "Overrun" || $scope.gameTitle  == "PvP"))
        {
            $scope.commercialDisplay = true;
            $scope.maincolumn_width = "col-80";
        }
        else
        {
          $scope.commercialDisplay = false;
          $scope.maincolumn_width = "col-100";
        }
        
      
        $scope.msg = "Waiting for host to start a game...";
        // display battery warnings
        $scope.target_online_count = 0;

         $scope.player_names = $scope.activity.players;

         // do once - 
         $scope.player_array = ($scope.player_list && typeof $scope.player_list !== 'undefined') ? $scope.player_list.split(",") : ['1'];
    
         if ($scope.gameTitle == "PvP") {
            for (var key in $scope.player_names) {

              //console.log($scope.player_names[key].id);
              if ($scope.player_names[key].id == $scope.player_array[0]) { // show player 1 name
                $scope.player_msg = $scope.player_names[key].name;
                $scope.player_names[key].isChecked = true;
             

              }
              if ($scope.player_names[key].id == $scope.player_array[1]) { // show player 2 name
                $scope.player2_msg = $scope.player_names[key].name;
                $scope.player_names[key].isChecked = true;
              }
            }
        }
        if ($scope.gameTitle == "Overrun") {
            for (var key in $scope.player_names) {


              if ($scope.player_names[key].id == $scope.player_array[0]) { // show player 1 name
                console.log("checking player " +$scope.player_names[key].name)
                $scope.player_names[key].isChecked = true;
             

              }
         
            }
        }


     

         $scope.player_array = ($scope.player_list && typeof $scope.player_list !== 'undefined') ? $scope.player_list.split(",") : ['1'];
     
        //console.log($scope.player_array);
         
  
        

         // turn list into radio list or checkbox list
         if ($scope.gameTitle  == "Overrun")
            $scope.radio_list_players = true;
        if ($scope.gameTitle  == "PvP")
            $scope.radio_list_players = false;
        for (var key in $scope.activity.target) {

          // instantiates the class of the target color buttons
           $scope.is_green_and_active[$scope.activity.target[key].id] = false;
           $scope.is_yellow_and_active[$scope.activity.target[key].id] = false;
           $scope.is_red_and_active[$scope.activity.target[key].id] = false;
           if ($scope.activity.target[key].online == true) 
           $scope.target_online_count++;

          var adc = $scope.activity.target[key].volt;
          if (adc > 1500)
            adc = 1;
          if (adc < 100) {
            $scope.lowbattery = true;
            continue;
          }
        }

         $scope.column_width = 100/$scope.target_online_count  + "%"

  
        

        if ($scope.target_online_count == 0){
          $scope.base_msg_data = addAlert($scope, "No targets found");
        }
        if ($scope.lowbattery) {
          $scope.base_msg_data = addAlert($scope, "Low battery");
        }
        console.log($scope.activity);
        if ($scope.activity.speed_start == "true")
          $scope.speed_start = true;
        else
          $scope.speed_start = false;
        if ($scope.activity.repeaters == 0) {
          $scope.base_msg_data = addAlert($scope, "No repeaters found");
        }
        if ($scope.activity.terms_conditions == "false") {
          $scope.base_msg_data = addAlert($scope, "Accept the terms & conditions to begin");
          $scope.show_start = false;
        }
      });
    })
     .on('jsonrows', function (data) {
 
        $scope.$apply(function () {
          //$scope.msg = "Waiting for host to start a game...";
          
        });
      });
    // END *********** Open socket connection to base ***********

    // if battery is low, let button click navigate
    //TODO MOVE this function to notifictionsCtrl
    /*$scope.base_msg_click = function() {
      if ($scope.lowbattery) {
        console.log("click");
        $state.go('home.diagnostics');
      }
    }*/

    // if manual control, start game when page renders and remove play button
    // and add new messaging to activate targets
    if ($scope.gameTitle == "Manual Control")
    {
      //$scope.showMainCountdownWindow = false;
      $scope.showSafetyCheck = false;
      $scope.show_start = false; // remove play button
      $scope.show_choosegame = false; // remove choose game button
      $scope.showManualControlButtons = true;

      $scope.countdown2 = "activate targets"
       $scope.showMainCountdownWindow = false;
       $scope.showInstructionMsg = false;
       $scope.msg = "Press target buttons below to activate";
       $scope.instructionMsg = "Press targets below to activate";
      var d = new Date();
      console.log(d.getTime());

      console.log("starting game now!!");
      $http({
                  cache: false,
                  method: 'GET',

                  url: "http://" + ip + ":" + port + "/?get=startgame&date=" + d.getTime() + "&max_time=" + $scope.maxtime + "&event=" + $scope.event + "&game_name=" + $scope.gameTitle +  "&first_to_score=" + $scope.firsttoscore +  "&" +
                    "max_targets=" + $scope.max_targets + "&gamespeed=" + $scope.speed + "&time_between_waves=" + $scope.time_between_waves + "&target_timeout_times=" + $scope.target_timeout_times + "&total_misses_allowed=" + $scope.total_misses_allowed + "&double_tap=" + $scope.double_tap + "&capture_and_hold=" + $scope.capture_and_hold + "&target_timeout=" + $scope.target_timeout +
                    "&targets_per_station=" + $scope.targets_per_station + "&paddle_sequence=" + $scope.paddle_sequence + "&matchtype=" + $scope.matchtype + "&scorelimit=" + $scope.scorelimit + "&player_ids=" + $scope.player_list + "&best_of_three=" + $scope.best_of_three + "&shoot_no_shoot=" + $scope.shoot_no_shoot + "&randomstring=" + Math.random().toString(36).substring(7) + "&interval=10&json_callback=JSON_CALLBACK"
                  }).
                success(function(data, status) {
                  console.log("starting game now");
 
                }).
                error(function(data, status) {
                  console.log(data);
                  console.log( "Request game start failed");
                  $scope.msg = "Request to start game failed"
                });
    }

    // ************ DISPLAY GAME OPTIONS **************

    //if ($scope.matchtype == "Co-op")
     // $scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">Co-op</button>';
    if ($scope.gameTitle == "Run N Gun")
      $scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">' + $scope.targets_per_station + ' targets/station</button>';
    //if ($scope.gameTitle != "Run N Gun")
      //$scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">' + $scope.paddle_sequence + '</button>';
    //if ($scope.speed != 500) {
      //if ($scope.speed < 1000)
        //$scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">' + $scope.speed + ' ms</button>';
      //else
        //$scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">' + $scope.speed / 1000 + ' sec</button>';
    //}
    // Double Tap
    $scope.double_tap = $stateParams.double_tap;
    if ($scope.double_tap == "true") {
      $scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive" style="width:80px;">Double tap</button>';
      $scope.show_col_splits = true;
    }

    //$scope.scorelimit = $stateParams.scorelimit;
    //if ($scope.scorelimit > 0) {
    //  $scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">Score limit: ' + $scope.scorelimit + '</button>';
    //  $scope.show_col_splits = true;
    //}

    $scope.capture_and_hold = $stateParams.capture_and_hold;
    if ($scope.capture_and_hold == "true") {
      $scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">Capture and hold</button>';
      $scope.show_col_splits = true;
    }

    $scope.target_timeout = $stateParams.target_timeout;
    if ($scope.target_timeout == "true") {
      $scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">Target timeout</button>';
      $scope.show_col_splits = true;
    }

    $scope.best_of_three = $stateParams.best_of_three
    if ($scope.best_of_three == 'true')
      $scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">Best of three</button>';



    $scope.shoot_no_shoot = $stateParams.shoot_no_shoot
    if ($scope.shoot_no_shoot == 'true')
      $scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">Shoot/No Shoot</button>';


    $scope.gameOptions = $sce.trustAsHtml($scope.gameOptions);


    /******************* TIMER SCRIPTS *******************/
    $scope.countdown3 = msToTime($scope.maxtime * 1);
    $scope.tmpcountdown3 = $scope.maxtime * 1;
    $scope.tmpcountup = 0;

    var mytimeout3 = null; // the current timeoutID
    // onTimeout3 is more accurate time than OnTimeout.
    // Using this function to update the onTimeout function periodically
    $scope.onTimeout3 = function() {

      if ($scope.tmpcountdown3 === 0) {
        $scope.$broadcast('timer-stopped', 0);
        $timeout.cancel(mytimeout3);
        $scope.runGameProgressOnce = 0;
        return;
      }
      $scope.countdown3 = $scope.tmpcountdown3--;
      
      
      if ($scope.countdown3 % 2) {
        $scope.tmpcountdown2 = (2 + $scope.tmpcountdown3) * 100;
        $scope.countdown2 = $scope.tmpcountdown3 * 100;

        //console.log("updated time");
      }

      

      mytimeout3 = $timeout($scope.onTimeout3, 1000);
    };

    //something is definitely wrong here, but onTimeout3 above works to correct it
    //needs a better fix
    //$scope.countdown2 = msToTime($scope.maxtime * 100);
    $scope.tmpcountdown2 = $scope.maxtime * 100;


    var mytimeout = null; // the current timeoutID
    // actual timer method, counts down every second, stops on zero
    $scope.onTimeout = function() {

    
      if ($scope.tmpcountdown2 === 0) {
        $scope.$broadcast('timer-stopped', 0);
        $timeout.cancel(mytimeout);
        return;
      }
      $scope.tmpcountdown2--;
      $scope.countdown2 = msToTime($scope.tmpcountdown2 * 10);
      mytimeout = $timeout($scope.onTimeout, 10);


    };


    $scope.stopTimer = function() {

      $scope.$broadcast('timer-stopped', $scope.countdown2);
      $scope.$broadcast('timer-stopped', $scope.countdown3);
      $timeout.cancel(mytimeout);
      $timeout.cancel(mytimeout3);
      countUpStop();
     
    };

    // triggered, when the timer stops, you can do something here, maybe show a visual indicator or vibrate the device
    $scope.$on('timer-stopped', function(event, remaining) {
      if (remaining === 0) {
        //console.log('your time ran out!');

      }
    });
    /******************* ENDTIMER SCRIPTS *******************/

    $scope.startClock = function(){
    
      countUpStop();
      countUpStart();
      $scope.arr_num_of_manualcontrol_targets.push($scope.num_of_manualcontrol_targets )  
      $scope.num_of_manualcontrol_targets = 0 ;
      $http({
        method: 'GET',
        url: 'http://' + ip + ':' + port + '/?restart_clock=yes&randomstring=' + Math.random().toString(36).substring(7) + '&callback=JSON_CALLBACK&'
      }).
      success(function(data, status) {

          $scope.sound.play();

      }).
      error(function(data, status) {
        console.log("Restart request failed");
        $scope.msg = "Base station didn't receive: Restart request!";
      });



    }
    // set default as singletap
    $scope.singletap_btn = " col_stable light_border";
    $scope.setTap = function(tapSequence) {

      $scope.chosen_tapSequence = tapSequence;

      if (tapSequence == "singletap"){
        $scope.singletap_btn = " col_stable light_border";
        $scope.doubletap_btn = " col_stable no_border";
        $scope.mozambique_btn = " col_stable no_border";
        $scope.showManualControlButtons = true;
        $scope.showManualControlButtons_grouped = false;
        $scope.column_width = 100/$scope.target_online_count  + "%"
      } 
      if (tapSequence == "doubletap"){
        $scope.singletap_btn = " col_stable no_border";
        $scope.doubletap_btn = " col_stable light_border";
        $scope.mozambique_btn = " col_stable no_border";
        $scope.showManualControlButtons = true;
        $scope.showManualControlButtons_grouped = false;
        $scope.column_width = 100/$scope.target_online_count  + "%"

      } 
      if (tapSequence == "mozambique"){
        $scope.singletap_btn = " col_stable no_border";
        $scope.doubletap_btn = " col_stable no_border";
        $scope.mozambique_btn = " col_stable light_border";
        $scope.showManualControlButtons = false;
        $scope.showManualControlButtons_grouped = true;
        $scope.column_width = 100/($scope.target_online_count/2).toFixed(0)  + "%"


      } 
    }

    // set default color
    $scope.colorpicker_green = " col_green heavy_border";
    $scope.setColor = function(color) {

    
      $scope.chosen_color = color;


      if (color == "purple"){
        $scope.colorpicker_purple = " col_purple heavy_border";
        $scope.colorpicker_red = " col_red no_border";
        $scope.colorpicker_blue = " col_blue no_border";
        $scope.colorpicker_yellow = " col_yellow no_border";
        $scope.colorpicker_green = " col_green no_border";
      }
      if (color == "red")
      {
        $scope.colorpicker_purple = " col_purple no_border";
        $scope.colorpicker_red = " col_red heavy_border";
        $scope.colorpicker_blue = " col_blue no_border";
        $scope.colorpicker_yellow = " col_yellow no_border";
        $scope.colorpicker_green = " col_green no_border";
      }
      if (color == "blue")
      {
        $scope.colorpicker_purple = " col_purple no_border";
        $scope.colorpicker_red = " col_red no_border";
        $scope.colorpicker_blue = " col_blue heavy_border";
        $scope.colorpicker_yellow = " col_yellow no_border";
        $scope.colorpicker_green = " col_green no_border";
      }
      if (color == "yellow")
      {
        $scope.colorpicker_purple = " col_purple no_border";
        $scope.colorpicker_red = " col_red no_border";
        $scope.colorpicker_blue = " col_blue no_border";
        $scope.colorpicker_yellow = " col_yellow heavy_border";
        $scope.colorpicker_green = " col_green no_border";
      }
      if (color == "green")
       {
        $scope.colorpicker_purple = " col_purple no_border";
        $scope.colorpicker_red = " col_red no_border";
        $scope.colorpicker_blue = " col_blue no_border";
        $scope.colorpicker_yellow = " col_yellow no_border";
        $scope.colorpicker_green = " col_green heavy_border";
      }

    }
  

    $scope.breakatinterval = 0;
    $scope.restart = function(val) {



      $scope.msg = "Get ready!";
      $scope.insertspacer = true;
  

      
      
      $scope.tmpcountup = 0;
      if ($scope.gameTitle != "Overrun"  && $scope.gameTitle != "Run N Gun" && $scope.gameTitle != "Manual Control")
      { // timeouts used for subsecond, ect
        mytimeout = $timeout($scope.onTimeout, 1);
        mytimeout3 = $timeout($scope.onTimeout3, 1);
      }
      



      console.log($scope.player_list);
      $http({
        method: 'GET',
        url: 'http://' + ip + ':' + port + '/?restart=yes&player_ids='+$scope.player_list+'&player_switch='+ $scope.player_switch + '&gamespeed=' + $scope.speed + '&randomstring=' + Math.random().toString(36).substring(7) + '&callback=JSON_CALLBACK&'
      }).
      success(function(data, status) {
        console.log(status);
        console.log("*** restart command received");
        $scope.msg = "Get ready!";
        


        // setup flag to send basestation  we are switching players mid game
         if ($scope.game_status == "game_in_progress" && $scope.player_switch )
         {
          $scope.player_switch = false;
          console.log("sent flag to basestation to end game and start a new one for " + $scope.player_list[0])
         }
   


        $scope.showRestartLabel = false;
        setTimeout( function(){
              //$scope.sound = ngAudio.load("audio/beep.wav");
              $scope.sound.play();

              if (($scope.gameTitle == "Overrun"  || $scope.gameTitle == "Run N Gun" || $scope.gameTitle == "Manual Control") && ($scope.msg == "Game in progress..." || $scope.msg == "Press target buttons below to activate"))
              {
                if ($scope.gameTitle == "Run N Gun" || $scope.gameTitle == "Overrun" || $scope.gameTitle == "Manual Control") {
                    console.log("Stopping counter!!")
                    countUpStop();
       
                }
                countUpStart();
                
              }


            },150);
        

      }).
      error(function(data, status) {
        console.log("Restart request failed");
        $scope.msg = "Base station didn't receive: Restart request!";
      });

    }

 


    // Stops game from stop game button
    // Sends command to base to stop game now
    $scope.stopGame = function(val) {
      
      if ($scope.msg != "Waiting for host to start a game...")
      {
        
        console.log("ending game now!");
        $http({
          cache: false,
          method: 'GET',
          url: 'http://' + ip + ':' + port + '/?end=yes&callback=JSON_CALLBACK&'  + new Date().getTime()
        }).
        success(function(data, status) {
          //console.log(status);
          $scope.stopTimer();
          console.log("stop game sent");
          $scope.msg = "Game stopped by host!";

        }).
        error(function(data, status) {
          console.log("Stop game request failed");
          $scope.msg = "Base station didn't receive: Game stopped by host!";
        });
      }
      else
      {
        console.log("game has not started. quit");
      }
    }


    // send request to base for countdown
    // base will emit message back signalling countdown began
    $scope.startGame = function(val) {
      
      // precheck
      // count length of array
      $scope.arr_length=0;
      for (i=0; i <=$scope.player_array.length; i++)
          {
            if ($scope.player_array[i] !== undefined)
              $scope.arr_length++;

          }
      console.log($scope.matchtype);

      if ($scope.arr_length != 2 && $scope.matchtype == "1 vs 1")
      {
        console.log("Player array not 2");
        $scope.msg = "Please select 2 players";

      }
      else
      {

        $scope.showSafetyCheck = false;
        $scope.show_start = false; // remove play button
        $scope.show_choosegame = false; // remove choose game button

        console.log("speed start: " + $scope.speed_start);
        if ($scope.speed_start == false)
        {
          console.log("emitting countdown");
          if ($scope.gameTitle == "Domination-Z")
            socket.emit('goToCountdown-domination-z', 1);
          else
            socket.emit('goToCountdown', 1);
        }
        else
        {
          var d = new Date();
          console.log(d.getTime());

          console.log("starting game now!!");
          $http({
                      cache: false,
                      method: 'GET',

                      url: "http://" + ip + ":" + port + "/?get=startgame&date=" + d.getTime() + "&max_time=" + $scope.maxtime + "&event=" + $scope.event + "&game_name=" + $scope.gameTitle +  "&first_to_score=" + $scope.firsttoscore +  "&" +
                      "max_targets=" + $scope.max_targets + "&gamespeed=" + $scope.speed + "&time_between_waves=" + $scope.time_between_waves + "&target_timeout_times=" + $scope.target_timeout_times + "&total_misses_allowed=" + $scope.total_misses_allowed + "&double_tap=" + $scope.double_tap + "&capture_and_hold=" + $scope.capture_and_hold + "&target_timeout=" + $scope.target_timeout +
                      "&targets_per_station=" + $scope.targets_per_station + "&paddle_sequence=" + $scope.paddle_sequence + "&matchtype=" + $scope.matchtype + "&scorelimit=" + $scope.scorelimit + "&player_ids=" + $scope.player_list + "&best_of_three=" + $scope.best_of_three + "&shoot_no_shoot=" + $scope.shoot_no_shoot + "&randomstring=" + Math.random().toString(36).substring(7) + "&interval=10&json_callback=JSON_CALLBACK"
                    }).
                    success(function(data, status) {
                      console.log("starting game now");

                      if ($scope.gameTitle == "Overrun" || $scope.gameTitle == "Run N Gun" || $scope.gameTitle == "Manual Control")
                        countUpStart();
                      //$scope.sound = ngAudio.load("audio/beep.wav");
                      $scope.sound.loop = false;
                      $scope.sound.play();
             

                    }).
                    error(function(data, status) {
                      console.log(data);
                      console.log( "Request game start failed");
                      $scope.msg = "Request to start game failed"
                    });
        }
        
        if ($scope.gameTitle == "Subsecond" || $scope.gameTitle == "Overrun"  || $scope.gameTitle == "Race" || $scope.gameTitle == "PvP"  || $scope.gameTitle == "Run N Gun") {
         $scope.show_start = false;
          $scope.show_restart = true;

        }



      }

      
    }


    
    
    function countUpStart() {
        
        if ($scope.upCountingInProgress == false)
        {
          $scope.countUpStartTime = Date.now();
          $scope.countUpInterval = setInterval(function(){
              $scope.countup = msToTime(Date.now() - $scope.countUpStartTime);
              //console.log(Date.now() - $scope.countUpStartTime);
          }, 50);
          $scope.upCountingInProgress = true;
        }
        
    }

    function countUpStop() {
        clearInterval($scope.countUpInterval);
        $scope.upCountingInProgress = false;
    }




    $scope.makeTargetActive = function(val, color){
       // $scope.showInstructionMsg  = false;

      if ($scope.num_of_manualcontrol_targets==0)
      {
        
        countUpStart();
      }
      
      
       $scope.showInstructionMsg = false;

        console.log(val);
              //$scope.chosen_color
                $http({
                  cache: false,
                  method: 'GET',
                  url: "http://" + ip + ":" + port + "/?get=manual_control&make_target_active="+val+"&color="+color+"&tapsequence="+$scope.chosen_tapSequence+"&randomstring=" + Math.random().toString(36).substring(7) + "&interval=10&json_callback=JSON_CALLBACK&"  + new Date().getTime()
                }).
                success(function(data, status) {
                  console.log("make target active command received");
                  $scope.num_of_manualcontrol_targets++;

                }).
                error(function(data, status) {
            
                  console.log( "Request make target active failed");
                });

    }



    // **************  UPDATE MAIN GAME SCREEN ***************** //
    // Hit data and other telemetry coming back from basestation during game play
    // this stuff adds it to the ui
    $scope.flag1 = "Flag 1";
    $scope.flag2 = "Flag 2";
    $scope.flag3 = "Flag 3";
    $scope.flag11 = "";
    $scope.bluePointsTime = 0;
    $scope.orangePointsTime = 0;
    $scope.blueControlTime = 0;
    if (socket) {
      socket.on('multiplayer_data', function (data) {






        $scope.multiplayer_data = angular.fromJson(data);
        console.log($scope.multiplayer_data);

        $scope.bluePointsTime = $scope.multiplayer_data.player1.points_time;
        console.log("Blue points time " + $scope.bluePointsTime);

        $scope.orangePointsTime = $scope.multiplayer_data.player2.points_time;
        width = ($scope.bluePointsTime / $scope.scorelimit) * 100;
        $scope.blueBarWidth = "width:" + width + "%";

        width = ($scope.orangePointsTime / $scope.scorelimit) * 100;
        $scope.orangeBarWidth = "width:" + width + "%";

        $scope.flagcontroltime = $scope.multiplayer_data.blueControlTime;

        if ($scope.multiplayer_data.control_point_1.controlTime > 0) {

          $scope.flag1 = "Flag 1 Captured"
          if ($scope.multiplayer_data.control_point_1.control_point_1_target_colors[0] == "blue") {
            $scope.flag1_msg = "+" + $scope.multiplayer_data.control_point_1.controlTime + " for Blue";
          } else {
            $scope.flag1_msg = "+" + $scope.multiplayer_data.control_point_1.controlTime + " for Orange";
          }

        } else {
          $scope.flag1 = "Flag 1";
          $scope.flag1_msg = "Neutral";

        }

        if ($scope.multiplayer_data.control_point_2.controlTime > 0) {

          $scope.flag2 = "Flag 2 Captured"
          if ($scope.multiplayer_data.control_point_2.control_point_2_target_colors[0] == "blue") {
            $scope.flag2_msg = "+" + $scope.multiplayer_data.control_point_2.controlTime + " for Blue";
          } else {
            $scope.flag2_msg = "+" + $scope.multiplayer_data.control_point_2.controlTime + " for Orange";
          }

        } else {
          $scope.flag2 = "Flag 2";
          $scope.flag2_msg = "Neutral";

        }

        if ($scope.multiplayer_data.control_point_3.controlTime > 0) {

          $scope.flag3 = "Flag 3 Captured"
          if ($scope.multiplayer_data.control_point_3.control_point_3_target_colors[0] == "blue") {
            $scope.flag3_msg = "+" + $scope.multiplayer_data.control_point_3.controlTime + " for Blue";
          } else {
            $scope.flag3_msg = "+" + $scope.multiplayer_data.control_point_3.controlTime + " for Orange";
          }

        } else {
          $scope.flag3 = "Flag 3";
          $scope.flag3_msg = "Neutral";

        }


        $scope.control_point_1_targets = $scope.multiplayer_data.control_point_1.control_point_1_targets;
        $scope.control_point_2_targets = $scope.multiplayer_data.control_point_2.control_point_2_targets;
        $scope.control_point_3_targets = $scope.multiplayer_data.control_point_3.control_point_3_targets;


        $scope.targ1 = $scope.control_point_1_targets[0];
        $scope.targ2 = $scope.control_point_1_targets[1];
        //$scope.targ3 = $scope.control_point_1_targets[2];
        $scope.targ3 = $scope.control_point_2_targets[0];
        $scope.targ4 = $scope.control_point_2_targets[1];
        //$scope.targ6 = $scope.control_point_2_targets[2];
        $scope.targ5 = $scope.control_point_3_targets[0];
        $scope.targ6 = $scope.control_point_3_targets[1];
        //$scope.targ9 = $scope.control_point_3_targets[2];

        // control point 1
        if ($scope.multiplayer_data.control_point_1.control_point_1_target_colors[0] == "blue")
          $scope.flag11 = "button-positive";
        else
          $scope.flag11 = "button-assertive";


        if ($scope.multiplayer_data.control_point_1.control_point_1_target_colors[1] == "blue")
          $scope.flag12 = "button-positive";
        else
          $scope.flag12 = "button-assertive";


        // if ($scope.multiplayer_data.control_point_1.control_point_1_target_colors[2] == "blue")
        //   $scope.flag13 = "button-positive";
        // else
        //   $scope.flag13 = "button-assertive";

        console.log($scope.multiplayer_data.control_point_2);
        // control point 2
        if ($scope.multiplayer_data.control_point_2.control_point_2_target_colors[0] == "blue")
          $scope.flag21 = "button-positive";
        else
          $scope.flag21 = "button-assertive";

        if ($scope.multiplayer_data.control_point_2.control_point_2_target_colors[1] == "blue")
          $scope.flag22 = "button-positive";
        else
          $scope.flag22 = "button-assertive";

        // if ($scope.multiplayer_data.control_point_2.control_point_2_target_colors[2] == "blue")
        //   $scope.flag23 = "button-positive";
        // else
        //   $scope.flag23 = "button-assertive";

        // control point 3
        if ($scope.multiplayer_data.control_point_3.control_point_3_target_colors[0] == "blue")
          $scope.flag31 = "button-positive";
        else
          $scope.flag31 = "button-assertive";
        if ($scope.multiplayer_data.control_point_3.control_point_3_target_colors[1] == "blue")
          $scope.flag32 = "button-positive";
        else
          $scope.flag32 = "button-assertive";
        // if ($scope.multiplayer_data.control_point_3.control_point_3_target_colors[2] == "blue")
        //   $scope.flag33 = "button-positive";
        // else
        //   $scope.flag33 = "button-assertive";

      });
    }

    socket.on('target_data', function(data) {

 

      $scope.target_data = angular.fromJson(data);
      //console.log($scope.target_data);

      // before push, there may be a duplicate if a second tap from
      // double tap is coming in. Pull that out first.
      //console.log("Checking::::: " + $scope.target_data.shottime);

      for (var key in target_hit_data) {
        //console.log("Checking::::: " + target_hit_data[key].shottime);

        if (parseInt($scope.target_data.shottime) == parseInt(target_hit_data[key].shottime)){
          //console.log("***************Found duplicate shot*****************");
        }

      }

      target_hit_data.push($scope.target_data);
      //console.log("***************");
       //console.log(target_hit_data);
       //console.log("***************");
      //console.log(target_hit_data);
     // console.log("target strike: " + $scope.target_data.target_strike);
      //console.log("by : " + $scope.target_data.player_name);
      $scope.target_strike = $scope.target_data;
      $scope.player_name_display = "";
      //if (not_capture_the_flag == true)
      $scope.player_name_display = $scope.target_data.player_name;

      



        // if  subsecond, show fastest hits at the top
        //if ($scope.gameTitle == "Subsecond") {
        //if (true) {
          $scope.divHitLog = '';
          $scope.fastest_shot_time = 40000;
          // find fastest hit
          for (var key in target_hit_data) {
            //console.log(target_hit_data[key].shottime);
            if (parseInt(target_hit_data[key].shottime) < parseInt($scope.fastest_shot_time))
              $scope.fastest_shot_time = target_hit_data[key].shottime;
            //console.log($scope.fastest_shot_time);

          }

          // display all the hits
          var i = 0;
            if ($scope.gameTitle == "Manual Control") 
            {
              $scope.doubletap_columns = true;
              $scope.countdownclock = false;
              $scope.singletap_columns = false;
              
            }

            var hitlog = [];

            if ($scope.double_tap == "true" || target_hit_data[key].ntap_private == 2) {
              for (var key in target_hit_data) {
                var hit_data = new Object();
                //console.log(target_hit_data[key].shottime);
                if ( msToTime(parseInt(target_hit_data[key].splittime)) > 0)
                { 
                    //on target #' + target_hit_data[key].target_strike + '
                   i++

                     hit_data.hit = i;
                    hit_data.column2 = msToTime(parseInt(target_hit_data[key].shottime)) ;
                    hit_data.column3 = msToTime( target_hit_data[key].shottime + target_hit_data[key].splittime) ;
                    hit_data.column4 =  msToTime(parseInt(target_hit_data[key].elapsedtime)) ;

                    /*$scope.divHitLog = ' <div class="row">' +

                    '<div class="cold col-23" >Hit ' + i + ' </div>' +
                    
                    '<div class="cold col-48">' + msToTime(target_hit_data[key].shottime) + '</div>' +
                    '<div class="cold col-24">' + msToTime(target_hit_data[key].splittime) + ' </div>' +
                    '</div>' + $scope.divHitLog;
                    */

                   // console.log (" interval counter: " + $scope.intervalcounter)
                    //console.log(" targets per station " + $scope.targets_per_station)
                    //console.log(" intervalcounter % targets per station " + ($scope.intervalcounter % $scope.targets_per_station))
                    if ((i % $scope.targets_per_station) == 0)
                    {

                      $scope.divHitLog =' <div class="row" style=" display:block;"> &nbsp; &nbsp; &nbsp;</div>' +  $scope.divHitLog ;
                   
                    }
                }
hitlog.push(hit_data);
                    
                   // '<div class="cold col-48">' + msToTime(parseInt(target_hit_data[key].shottime)) + '</div>' +
                    //'<div class="cold col-24">' + msToTime(parseInt(target_hit_data[key].splittime)) + ' </div>' +
              }


            } else {

              var hitlog = []; // list of target ids to use for random selection
              
              /* OLD LOOP.. 
              for (var key in target_hit_data) {
                i++;

                //console.log(target_hit_data[key].shottime);
                if (target_hit_data[key].ntap == 2 || $scope.gameTitle == "Manual Control") 
                { 
                  var splittimedata = "-";
                  if ($scope.target_data.splittime !== undefined)
                    splittimedata =  msToTime(target_hit_data[key].splittime) ;
                  else
                    splittimedata = "-";

                  if (target_hit_data[key].shoot_no_shoot == "pass"){
                    $scope.divHitLog = ' <div class="row">' +
                      '<div class="cold col-23 " >' + i + ' </div>' +
                      '<div class="cold col-48 ">' + msToTime(parseInt(target_hit_data[key].shottime)) + '</div>' +
                      '<div class="cold col-24 ">' + msToTime( target_hit_data[key].shottime + target_hit_data[key].splittime)  + ' </div>' +
                      '<div class="cold col-24 ">' +  msToTime(parseInt(target_hit_data[key].elapsedtime)) + ' </div>' +
                      '</div>' + $scope.divHitLog;
                  
                  }
                  if (target_hit_data[key].shoot_no_shoot == "fail"){
                    $scope.divHitLog = ' <div class="row">' +
                      '<div class="cold col-23 list_red" >' + i + ' </div>' +
                      '<div class="cold col-48 list_red"> fail </div>' +
                      '<div class="cold col-24 list_red"> fail </div>' +
                      '<div class="cold col-24 list_red"> fail </div>' +
                      '</div>' + $scope.divHitLog;
                  }

                    $scope.intervalcounter++;

                }
                else
                {
                    $scope.intervalcounter++;
                    $scope.divHitLog = ' <div class="row">' +
                    '<div class="cold col-23" >Hitdd ' + i + ' </div>' +
                    '<div class="cold col-48">' + target_hit_data[key].player_name + ' - ' + msToTime(parseInt(target_hit_data[key].shottime)) + '</div>' +
                    '</div>' + $scope.divHitLog;

                 
                }
                // This will group hits
                if ($scope.gameTitle != "Manual Control")
                {
                    //console.log (" interval counter: " + $scope.intervalcounter)
                    //console.log(" targets per station " + $scope.targets_per_station)
                    //console.log(" intervalcounter % targets per station " + ($scope.intervalcounter % $scope.targets_per_station))
                    if (($scope.intervalcounter % $scope.targets_per_station) == 0)
                    {
                     // $scope.divHitLog =' <div class="row" style=" display:block;"> &nbsp; &nbsp; &nbsp;</div>' +  $scope.divHitLog ;
              
                    }
                }

              
              }
              */

              // package up hitlog array
              for (var key in target_hit_data) {
                i++;

                  var hit_data = new Object();

                //console.log(target_hit_data[key].shottime);
                if (target_hit_data[key].ntap == 2 || $scope.gameTitle == "Manual Control") 
                { 

                   
                  var splittimedata = "-";
                  if ($scope.target_data.splittime !== undefined)
                    splittimedata =  msToTime(target_hit_data[key].splittime) ;
                  else
                    splittimedata = "-";

                  //if (target_hit_data[key].shoot_no_shoot == "pass"){
                    hit_data.hit = i;
                    hit_data.column2 = msToTime(parseInt(target_hit_data[key].shottime)) ;
                    hit_data.column3 = msToTime( target_hit_data[key].shottime + target_hit_data[key].splittime) ;
                    hit_data.column4 =  msToTime(parseInt(target_hit_data[key].elapsedtime)) ;

                  //}
                  /*
                  if (target_hit_data[key].shoot_no_shoot == "fail"){

                    hit_data.hit = i;
                    hit_data.column2 = 'fail' ;
                    hit_data.column3 = 'fail' ;
                    hit_data.column4 = 'fail';

                    
                  }
                  */



                  hitlog.push(hit_data);
                  $scope.intervalcounter++;

                }
                else
                { 

                    $scope.intervalcounter++;
                    hit_data.hit = i;
                    hit_data.column2 = target_hit_data[key].player_name + ' - ' + msToTime(parseInt(target_hit_data[key].shottime)) ;
                    hitlog.push(hit_data);
           
                }
                // This will group hits
                if ($scope.gameTitle != "Manual Control")
                {
                    //console.log (" interval counter: " + $scope.intervalcounter)
                    //console.log(" targets per station " + $scope.targets_per_station)
                    //console.log(" intervalcounter % targets per station " + ($scope.intervalcounter % $scope.targets_per_station))
                    if (($scope.intervalcounter % $scope.targets_per_station) == 0)
                    {
                     // $scope.divHitLog =' <div class="row" style=" display:block;"> &nbsp; &nbsp; &nbsp;</div>' +  $scope.divHitLog ;
              
                    }
                }



              
              }

 




              $scope.intervalcounter = 0
            }

              for (var i =hitlog.length-10; i>=0;i--)
              {
                hitlog[i] = undefined;
              }
  
              $scope.divHitLog = '';
              // write hitlog to display
              for( var key in hitlog ){
     
      
                if ($scope.gameTitle != "Manual Control" && $scope.double_tap != "true")
                {

                    if (hitlog[key] !== undefined)
                    $scope.divHitLog = ' <div class="row">' +
                    '<div class="cold col-23" >Hit ' + hitlog[key]['hit'] +'  </div>' +
                    '<div class="cold col-48"> ' + hitlog[key]['column2'] + '</div>' +
                    '</div>' + $scope.divHitLog;
                }

            
                if ( $scope.gameTitle == "Manual Control")
                { 
                   
                  if (hitlog[key] !== undefined)
                    $scope.divHitLog = ' <div class="row">' +
                    '<div class="cold col-23" >Hit ' + hitlog[key]['hit'] +'  </div>' +
                    '<div class="cold col-48"> ' + hitlog[key]['column2'] + '</div>' +
                    '<div class="cold col-48"> ' + hitlog[key]['column3'] + '</div>' +
                    '<div class="cold col-48"> ' + hitlog[key]['column4'] + '</div>' +
                    '</div>' + $scope.divHitLog;

                }
        
                if ( $scope.double_tap == "true")
                { 
                  if (hitlog[key] !== undefined)
                  $scope.divHitLog = ' <div class="row">' +
                    '<div class="cold col-23" >Hit ' + hitlog[key]['hit'] +'  </div>' +
                    '<div class="cold col-48"> ' + hitlog[key]['column2'] + '</div>' +
                    '<div class="cold col-48"> ' + hitlog[key]['column3'] + '</div>' +
                    '<div class="cold col-48"> ' + hitlog[key]['column4'] + '</div>' +
                    '</div>' + $scope.divHitLog;
                }
          

              }




          // display fastest hit
          for (var key in target_hit_data) {
            //console.log(target_hit_data[key].shottime);
            if (target_hit_data[key].shottime == $scope.fastest_shot_time) {
              //$scope.divHitLog = ' <div class="row ">' +
              //'<div class="col col-23 col-positive positive filltext_due" >Fastest shottime</div>' +
              //'<div class="col col-48 balanced filltext_due">By ' + target_hit_data[key].player_name +  ' - ' + msToTime(parseInt($scope.fastest_shot_time)) + '</div>' +
              //'</div>' + $scope.divHitLog ;
              $scope.fastest_shot_sofar = 'Fastest hit: ' + target_hit_data[key].player_name + ' - ' + msToTime(parseInt($scope.fastest_shot_time));
              break;
              //$scope.recordTime = target_hit_data[key].player_name +  ' - ' + msToTime(parseInt($scope.fastest_shot_time));
            }

          }

              //console.log("Player 1 rounds: " + $scope.target_data.player_1_rounds_won)
              //console.log("Player 2 rounds: " + $scope.target_data.player_2_rounds_won)
              if ($scope.target_data.player_1_rounds_won > 0)
                $scope.player_1_score = $scope.target_data.player_1_rounds_won;
              if ($scope.target_data.player_2_rounds_won > 0)
                $scope.player_2_score = $scope.target_data.player_2_rounds_won;
                
              
                if ($scope.gameTitle == "Race")
                {
                  $scope.countdown2 = "Round " + parseInt(1 + $scope.player_1_score + $scope.player_2_score);
                  var red_percentage = 100*($scope.target_data.player_1_rounds_won / $scope.firsttoscore);
                  $scope.red_width = red_percentage + "";

                  
                }
                // else if PvP
                else if($scope.target_data.player_1_score >= 1){
                  $scope.player_1_score = $scope.target_data.player_1_score;
                  var red_percentage = 100*($scope.player_1_score / $scope.firsttoscore);
                  $scope.red_width = red_percentage + "";
    
                }
                else
                  $scope.red_width = "0";


                  $scope.blue_width = "0";
                
                if ($scope.gameTitle == "Race")
                {
                  var blue_percentage = 100*($scope.target_data.player_2_rounds_won / $scope.firsttoscore);
                  $scope.blue_width = blue_percentage + "";
                  
                }
                else if ($scope.target_data.player_2_score >= 1){
                  $scope.player_2_score = $scope.target_data.player_2_score;
                  var blue_percentage = 100*($scope.player_2_score / $scope.firsttoscore);
                  $scope.blue_width = blue_percentage + "";
                }
                else
                  $scope.blue_width = "0";
                

     
          if ($scope.gameTitle == "PvP")
          {
            // show 1 vs 1 block
            $scope.show1v1 = true;;

          }
          else
            $scope.showRecordTime = true;
          // last shot time
          if ($scope.gameTitle != "Swarm") {
            $scope.numberDisp = msToTime(parseInt($scope.target_data.group_shot_time));
            $scope.player = $scope.player_name_display;
            $scope.showMainCountdownWindow = false;
            $scope.showGameOptions = false;
          }
          if ($scope.gameTitle == "Overrun"){
            $scope.numberDisp = $scope.target_data.run + " streak";

            // record highest streak and display it.
            if ($scope.target_data.run > $scope.highest_streak)
              $scope.highest_streak = $scope.target_data.run;
          }



          // replace fastest hit with highest streak
          if ($scope.gameTitle == "Overrun")
          {
            $scope.fastest_shot_sofar = 'Highest streak: ' +  $scope.highest_streak;
          }

        //} else { // add the new hit coming in
        //  console.log($scope.target_data.player_name);
        //  $scope.divHitLog = ' <div class="row">' +
        //      '<div class="cold col-23" >' + $scope.target_data.target_strike + ' </div>' +
        //      '<div class="cold col-48">' + $scope.target_data.player_name + ' - ' + msToTime(parseInt($scope.target_data.elapsedtime)) + '</div>' +
        //      '</div>' + $scope.divHitLog;
        //}
      


       


        
    });

    socket.on('playerData', function(data) {



      //console.log(data);
      console.log('check 2', socket.connected);
      $scope.player_data = angular.fromJson(data);
      //console.log("Active player: " + $scope.player_data.activePlayer);
      //console.log("Time till player switch " + $scope.player_data.timeTillPlayerSwitch);


      //      console.log("Starting: " + $scope.player_names[$scope.player_data.activePlayer-1].name);

      /*
       if ($scope.player_data.activePlayer  == 1)
       if ($scope.player_data.timeTillPlayerSwitch >= -5)
       {
       $scope.player_msg = "Next Player in " + $scope.player_data.timeTillPlayerSwitch + " seconds";
       $scope.sound = ngAudio.load("audio/beep.wav");
       $scope.sound.play();
       }
       else
       $scope.player_msg = "Active player: " + $scope.player_names[$scope.player_data.activePlayer-1].name ;
       else

       $scope.player_msg = "Active player: " + $scope.player_names[$scope.player_data.activePlayer-1].name;
       console.log($scope.player_msg);
       */

    });

     
 
 

    socket.on('jsonrows', function(data) {
      $scope.activity = angular.fromJson(data);
        
      //console.log($scope.activity)
if ($scope.activity.numTargetsUp ==0)
    {
      countUpStop();
    }
    if ($scope.activity.numTargetsUp >0)
    {
      countUpStart();
    }


        // check game status
        $scope.game_status = $scope.activity.game_status;
        if ($scope.game_status == "game_in_progress")
          $scope.isGameActive = true;

        // display connection status
         $scope.background_color_changer = "bar bar-subheader bar-light ";
            if ($scope.isGameActive)
            {
              $scope.msg = "Game in progress...";
              $scope.showSafetyCheck = false;
            }
            else
              $scope.msg = "Waiting for host to start a game...";



 
      // display target color state
      $scope.divTargetsOnline = '<div class="row">';
    



      // clean up array first by deleting inactive targets
      for (var key in $scope.activity.target) {
        if ($scope.activity.target[key].online == false) 
          delete $scope.activity.target[key];
        if (key == "fastest_group_time") 
          delete $scope.activity.target[key];
        if (key == "fastest_shot_time") 
          delete $scope.activity.target[key];

      }

      //console.log($scope.activity.target)
      for (var key in $scope.activity.target) {
         

        

        if ($scope.activity.target[key].online == true) {



          // game title is manual control and game has started, then allow push of target buttons
          if ($scope.gameTitle == "Manual Control" && $scope.showSafetyCheck == false )
          {
            $scope.msg = "Press target buttons below to activate";

              if ($scope.activity.target[key].color == "green")
              { 
                $scope.is_green_and_active[$scope.activity.target[key].id] = true;
                $scope.is_yellow_and_active[$scope.activity.target[key].id] = false;
                $scope.is_red_and_active[$scope.activity.target[key].id] = false;
              }
              else if ($scope.activity.target[key].color == "yellow")
              {
                $scope.is_green_and_active[$scope.activity.target[key].id] = false;
                $scope.is_yellow_and_active[$scope.activity.target[key].id] = true;
                $scope.is_red_and_active[$scope.activity.target[key].id] = false;
              }
              else if ($scope.activity.target[key].color == "red")
              {
                $scope.is_green_and_active[$scope.activity.target[key].id] = false;
                $scope.is_yellow_and_active[$scope.activity.target[key].id] = false;
                $scope.is_red_and_active[$scope.activity.target[key].id] = true;
              }
              if ($scope.activity.target[key].color == "")
              { 
                $scope.is_green_and_active[$scope.activity.target[key].id] = false;
                $scope.is_yellow_and_active[$scope.activity.target[key].id] = false;
                $scope.is_red_and_active[$scope.activity.target[key].id] = false;
              }



          }
          else
          {


            //console.log($scope.activity.target[key].id + ' color ' + $scope.activity.target[key].color);
            // console.log("target color");
            if ($scope.activity.target[key].color == "green") {
              $scope.divTargetsOnline = $scope.divTargetsOnline +
                  '<div class="col col_green col-24" >' + $scope.activity.target[key].id + '</div>';
            } else if ($scope.activity.target[key].color == "orange") {
              $scope.divTargetsOnline = $scope.divTargetsOnline +
                  '<div class="col col_orange col-24">' + $scope.activity.target[key].id + '</div>';
            
            } else if ($scope.activity.target[key].color == "yellow") {
              $scope.divTargetsOnline = $scope.divTargetsOnline +
                  '<div class="col col_yellow2 col-24">' + $scope.activity.target[key].id + '</div>';
            } else if ($scope.activity.target[key].color == "blue") {
              $scope.divTargetsOnline = $scope.divTargetsOnline +
                  '<div class="col col_blue col-24">' + $scope.activity.target[key].id + '</div>';
            } else if ($scope.activity.target[key].color == "purple") {
              $scope.divTargetsOnline = $scope.divTargetsOnline +
                  '<div class="col col_purple col-24">' + $scope.activity.target[key].id + '</div>';
            } else {
              $scope.divTargetsOnline = $scope.divTargetsOnline +
                  '<div class="col col-24" >' + $scope.activity.target[key].id + '</div>';
            }
          }

        }


      }

      $scope.divTargetsOnline = $scope.divTargetsOnline + '</div>';
      $scope.divTargetsOnline = $sce.trustAsHtml($scope.divTargetsOnline);



      // $scope.divTargetsOnline = "";


      $scope.$apply(function() {

        //$scope.player_names = $scope.activity.players;
        
        //console.log($scope.activity);
        //console.log($scope.player_names);
        //console.log($stateParams.player_list);
        //console.log($stateParams.player_list);

 
        //$scope.player_array = ($scope.player_list && typeof $scope.player_list !== 'undefined') ? $scope.player_list.split(",") : ['1'];
      
        /*

        if ($scope.gameTitle == "PvP") {
            for (var key in $scope.player_names) {

              //console.log($scope.player_names[key].id);
              if ($scope.player_names[key].id == $scope.player_array[0]) { // show player 1 name
                $scope.player_msg = $scope.player_names[key].name;
                //$scope.player_names[key].isChecked = true;
             

              }
              if ($scope.player_names[key].id == $scope.player_array[1]) { // show player 2 name
                $scope.player2_msg = $scope.player_names[key].name;
                //$scope.player_names[key].isChecked = true;
              }
            }
        }

        if ($scope.gameTitle == "Overrun") {
            for (var key in $scope.player_names) {

              //console.log($scope.player_names[key].id);
              if ($scope.player_names[key].id == $scope.player_array[0]) { // show player 1 name
                $scope.player_msg = $scope.player_names[key].name;
                //$scope.player_names[key].isChecked = true;

             
              }
           
            }
        }
        */

 
 
        if ($scope.runPlayerMsgOnce == 0) {
          $scope.runPlayerMsgOnce = 1;
          if ($scope.gameTitle != "Domination-Z") {
            $scope.player_messages = true;
          }
          if ($stateParams.matchtype != "1 vs 1" && $stateParams.matchtype != "Single player")
            $stateParams.matchtype = "Co-op";
          if ($stateParams.matchtype == "1 vs 1") {
            //$scope.player_array = $stateParams.player_list.split(",");
            for (var key in $scope.player_names) {

              //console.log($scope.player_names[key].id);
              if ($scope.player_names[key].id == $scope.player_array[0]) { // show player 1 name
                //$scope.player_msg = $scope.player_names[key].name;
               // $scope.player_names[key].isChecked = true;
            

              }
              if ($scope.player_names[key].id == $scope.player_array[1]) { // show player 1 name
               // $scope.player2_msg = $scope.player_names[key].name;
               // $scope.player_names[key].isChecked = true;
              }
            }
          }


     



          if ($stateParams.matchtype == "Single player" || $stateParams.matchtype == "Co-op") {
            $scope.player_messages = false;
            //$scope.player_array = $stateParams.player_list.split(",");
            for (var key in $scope.player_names) {
              if ($scope.player_names[key].id == $stateParams.player_list) {
                $scope.player_msg = $scope.player_names[key].name;
              }
            }
          }
        }

 
        if ($scope.activity.game_status == "game_in_progress") {
          $scope.show_choosegame = false;
          if ($scope.runGameProgressOnce == 0) {
            $scope.msg = "Game in progress...";
            isGameActive = true;
            $scope.showSafetyCheck = false;
            if ($scope.gameTitle == "Manual Control")
                $scope.msg = "Press target buttons below to activate";
            $scope.runGameProgressOnce = 1;

            if ($scope.wave > 0 && $scope.gameTitle != "Overrun") {
              // don't start the timer since its infinity
            } else if ($scope.gameTitle == "Subsecond") {
              //mytimeout = $timeout($scope.onTimeout, 1);
              //mytimeout3 = $timeout($scope.onTimeout3, 1);
              $scope.countdown2 = "∞";

            } else {
              mytimeout = $timeout($scope.onTimeout, 1);
              mytimeout3 = $timeout($scope.onTimeout3, 1);
            }

          }

          if ($scope.gameTitle == "Subsecond") {
            //mytimeout = $timeout($scope.onTimeout, 1);
            //mytimeout3 = $timeout($scope.onTimeout3, 1);
            $scope.msg = "Delayed Start - get ready";
            var five_second_countdown = 6000;
            five_second_countdown = five_second_countdown - parseInt($scope.activity.delayed_start);
            // handle NAN
            if (!(parseInt(five_second_countdown / 1000).toFixed(0) > 0))
              five_second_countdown = 5;
            $scope.showRestartLabel = false;
            $scope.countdown2 = "Starting in " + parseInt(five_second_countdown / 1000).toFixed(0);
            if (parseInt(five_second_countdown / 1000).toFixed(0) == 0) {
              $scope.countdown2 = "Targets active!";
              $scope.msg = "";
            }

            console.log(parseInt($scope.activity.delayed_start));

            if ($scope.activity.numTargetsUp == 0 && parseInt($scope.activity.delayed_start) > 5000) {
              $scope.countdown2 = "";
              $scope.showRestartLabel = true;
            }

          }

 
          if ($scope.gameTitle == "Overrun") {
            //console.log($scope.activity.game_secondary_status);
            if ($scope.activity.game_secondary_status == "ready_for_next_run" && $scope.activity.numTargetsUp == 0 ) {       
            
              $scope.msg = "Click restart button below to restart run";
              countUpStop();
 
            }

          }

          if ($scope.gameTitle == "Run N Gun") {
    
            if ($scope.activity.game_secondary_status == "ready_for_next_run" && $scope.activity.numTargetsUp == 0 ) {       
            
              $scope.msg = "Click restart button below to restart run";
              countUpStop();
 
            }

          }

          if ($scope.gameTitle == "Race") {
            $scope.countdown2 = "Round " +   parseInt(1 + $scope.player_1_score + $scope.player_2_score);
            if ($scope.activity.game_secondary_status == "ready_for_next_run") {       
            
              $scope.msg = "Click restart button below to start next round";
              

            }

          }
         
        }
        // countdown before game begins
        var startgameOnlyOnce = 0;
        //console.log($scope.activity.game_status);
        if ($scope.activity.game_status == "counting_down") {
          //console.log('countdown:', $scope.activity);
          if ($scope.runCountDownOnce == 0) {
            $scope.runCountDownOnce = 1;

            $scope.msg = "";

            $scope.counter = 3;
            $scope.divHitLog = '';
            console.log("receiving countdown from base station");

            $scope.countdown2 = "Starting in: " + $scope.counter;
             if ($scope.gameTitle == "PvP" || $scope.gameTitle == "Race") {
              $scope.countdown2 = $scope.counter;
             }
            $scope.sound.loop = 2;
            $scope.sound.play();

            $scope.onFiveSecondTimeout = function() {
              console.log("*** entering onFiveSecondTimeout");
              $scope.counter--;
              if ($scope.counter > 0) {
                myfivesecondtimeout = $timeout($scope.onFiveSecondTimeout, 1000);
                //console.log($scope.counter);
                $scope.$apply(function() {
                  $scope.countdown2 = "Starting in: " + $scope.counter;
                  if ($scope.gameTitle == "PvP" || $scope.gameTitle == "Race") {
                    $scope.countdown2 = $scope.counter;
                   }
                  //$scope.sound.play();
               
                });
          


              } else if ($scope.counter == 0) {

                console.log("Time is up!");
                $scope.$apply(function() {
                  $scope.countdown = 0;
                  //$scope.runCountDownOnce = 0;
                });

                // setup date to pass to base station
                var d = new Date();
                console.log(d.getTime());
                // tell base station to start game
                
                if (startgameOnlyOnce == 0)
                {
                  startgameOnlyOnce = 1;
                  $http({
                    cache: false,
                    method: 'GET',
                    url: "http://" + ip + ":" + port + "/?get=startgame&date=" + d.getTime() + "&max_time=" + $scope.maxtime + "&event=" + $scope.event + "&game_name=" + $scope.gameTitle +  "&first_to_score=" + $scope.firsttoscore +  "&" +
                    "max_targets=" + $scope.max_targets + "&gamespeed=" + $scope.speed + "&time_between_waves=" + $scope.time_between_waves + "&target_timeout_times=" + $scope.target_timeout_times + "&total_misses_allowed=" + $scope.total_misses_allowed + "&double_tap=" + $scope.double_tap + "&capture_and_hold=" + $scope.capture_and_hold + "&target_timeout=" + $scope.target_timeout +
                    "&targets_per_station=" + $scope.targets_per_station + "&paddle_sequence=" + $scope.paddle_sequence + "&matchtype=" + $scope.matchtype + "&scorelimit=" + $scope.scorelimit + "&player_ids=" + $scope.player_list + "&best_of_three=" + $scope.best_of_three + "&shoot_no_shoot=" + $scope.shoot_no_shoot + "&randomstring=" + Math.random().toString(36).substring(7) + "&interval=10&json_callback=JSON_CALLBACK"
                  }).
                  success(function(data, status) {
                    console.log("starting game now");

                    //0188ca
                    /*
                    $scope.targ1class = "col col_light col-24";
                    $scope.targ2class = "col col_light col-24";
                    $scope.targ3class = "col col_light col-24";
                    $scope.targ4class = "col col_light col-24";
                    $scope.targ5class = "col col_light col-24";
                    $scope.targ6class = "col col_light col-24";
                    $scope.targ7class = "col col_light col-24";
                    $scope.targ8class = "col col_light col-24";
                    $scope.targ9class = "col col_light col-24";
                    $scope.targ10class = "col col_light col-24";
                    $scope.targ11class = "col col_light col-24";
                    $scope.targ12class = "col col_light col-24";
                    $scope.targ13class = "col col_light col-24";
                    $scope.targ14class = "col col_light col-24";
                    $scope.targ15class = "col col_light col-24";
                    $scope.targ16class = "col col_light col-24";
                    */
                    clearTimeout(myfivesecondtimeout);

                  }).
                  error(function(data, status) {
                    console.log(data);
                    console.log( "Request game start failed");
                  });
                }
                



              }
            }
            var myfivesecondtimeout = $timeout($scope.onFiveSecondTimeout, 1000);
          }
        }

        // game has ended - redirect user to score results after 5 seconds
        if ($scope.activity.game_status == "game_has_ended") {
          $scope.stopTimer();
          countUpStop();
          $scope.msg = "Game Over!";
          $scope.show_restart = false;
          $scope.isGameActive = false;
          $scope.showRecordTime = false;

          

          if ($scope.wave == 1)
            $scope.countdown2 = $scope.wave + "st wave achieved";
          else if ($scope.wave == 2)
            $scope.countdown2 = $scope.wave + "nd wave achieved";
          else if ($scope.wave == 3)
            $scope.countdown2 = $scope.wave + "rd wave achieved";
          else if ($scope.wave > 4)
            $scope.countdown2 = $scope.wave + "th wave achieved";

          if ($scope.gameTitle == "Overrun")
          {
            $scope.countdown2  = 'Highest streak achieved: ' +  $scope.highest_streak;
            $scope.countup = '';
          }
          if ($scope.gameTitle == "Run N Gun")
          {
            $scope.countdown2  = 'Completed in: ' ;
            //$scope.countup = '';
          }

     


          if ($scope.gameTitle == "PvP" || $scope.gameTitle == "Race")
          {
            $scope.showWinnerDeclaration = true;
            $scope.show1v1 = false;
            //$scope.countdown2 = "Round " +   parseInt(1 + $scope.player_1_score + $scope.player_2_score);
             //$scope.countdown2 = "Round over"
             $scope.countdown2 = ""
            if ($scope.player_1_score == $scope.player_2_score )
            {
              // draw
       
              $scope.winner_declaration = "Draw"
            }
            else if ($scope.player_1_score == $scope.firsttoscore || $scope.player_1_score > $scope.player_2_score)
              {
                $scope.winner_declaration = "Green Wins"; 
                $scope.countdown_bg_color = "rgb(51, 205, 91);color:white; "

              }
            else 
              {
                $scope.winner_declaration = "Blue Wins";
                $scope.countdown_bg_color = "rgb(34, 68, 174);color:white;"
              }
          }
          else
          {
            $scope.showMainCountdownWindow = true;
          }

          $scope.counter = 10;

          
          $scope.msg = "Game Over!";
          $scope.isGameActive = false;
          $scope.show_restart = false;
          setTimeout(function(){
              //console.log("redirecting to score results page now...");
              $location.path("/home/tab4/scores");
          },4000);
          /*
          $scope.onFiveSecondTimeoutDue = function() {
            $scope.counter--;

            playHalfSecondBeep();
            if ($scope.counter > 0) {
              myfivesecondtimeoutDue = $timeout($scope.onFiveSecondTimeoutDue, 500);
              //console.log($scope.counter);
            } else {
              console.log("redirecting to score results page now...");
              $location.path("/home/tab4/scores");
            }
          }

          var myfivesecondtimeoutDue = $timeout($scope.onFiveSecondTimeoutDue, 500);
        
          */
        }

        if ($scope.activity.targets_left >= 0) {
          var ts_left = $scope.activity.targets_left;
            if ($scope.isGameActive )
            $scope.targets_remaining = "Hits left: " + $scope.activity.targets_left;
            if ($scope.gameTitle == "PvP")
            {
              $scope.targets_remaining = "First to score " + $scope.firsttoscore + " wins";
              $scope.firstto_or_bestof = "First to ";
            }
            if ($scope.gameTitle == "Race")
            {
              //$scope.targets_remaining = "Best of " + $scope.firsttoscore + " wins";
              $scope.targets_remaining = "Best of 3 wins";
              $scope.firstto_or_bestof = "Best of ";
              $scope.firsttoscore = 3;
            }
        }
 

        if ($scope.gameTitle == "Swarm") {
          $scope.targs_left = $scope.activity.targets_hit_this_wave;
          if (!($scope.targs_left > 0))
            $scope.targs_left = 0;

          if (parseInt($scope.activity.targets_per_wave - $scope.targs_left) > 0)
            $scope.numberDisp = parseInt($scope.activity.targets_remaining_in_wave) + " left";
          else
            $scope.numberDisp = "";

          $scope.misses = $scope.activity.misses_left + " misses left ";
          //console.log(target_hit_data);
          $scope.showMainCountdownWindow = true;
          $scope.showGameOptions = false;

          if ($scope.activity.wave > 0) {

   
            countdown2 = "";
            if ($scope.activity.game_status == "waiting")
            {
              $scope.showMainCountdownWindow = true;
            }
            else
            {
              $scope.wave = $scope.activity.wave;
              $scope.countdown2 = "Wave " + $scope.wave;
              if ($scope.activity.wave_pause_enabled == 1) {
                $scope.showMainCountdownWindow = false;
                $scope.showRecordTime = true;
                $scope.countdown2 = "Next wave in: " + ($scope.activity.time_till_next_wave / 1000).toFixed(0) + "";
              } else {
                $scope.showRecordTime = true;
                $scope.showMainCountdownWindow = false;
              }
            }
            
          }



        }

        

      });


    });

 
 
    $scope.add_player_to_game = function(val) {

 

      if ($scope.gameTitle == "PvP") {



                var isInArray = false
                for (var i=0; i<$scope.player_array.length; i++)
                {
                  
                  if ($scope.player_array[i] == val)
                  {
                    isInArray = true;
                  } 
                   
                }


                if (isInArray == false) // add it if it wasn't there
                {
                  $scope.player_array[$scope.player_array.length ] = val;

                  for (var key in $scope.player_names) {

                    if ($scope.player_names[key].id == val) { // show player 1 name
                      

                        $scope.player_msg = $scope.player_names[key].name;
                        //$scope.player_names[key].isChecked = true;
                        $scope.player_names[key].id = val;

                    }
                  
                  }
                }
                else
                {
 
                    for (var i=0; i<$scope.player_array.length; i++)
                    {
                      var isInArray = false
                      if ($scope.player_array[i] == val)
                      {
                        isInArray = true;
                        $scope.player_array[i] = undefined; // remove it if it was found
 
              
                      } 
                       
                    }


                }


                var nextafter = 0;
                var hasAnyValue = false;
                for (i=$scope.player_array.length; i>=0; i--)
                {
                  
                  for (var key in $scope.player_names) {

                    if ($scope.player_names[key].id == $scope.player_array[i]) { // show player 1 name
                      
                      $scope.player_msg = $scope.player_names[key].name;
                      nextafter = i;
                      console.log("next after: " + nextafter)
                      hasAnyValue = true;
                      break;


                    }
                    //else
                      //{$scope.player_msg = "";}
                  
                  }
                  
                }
                var hasAnyValue2 = false;
                for (i=$scope.player_array.length; i>=0; i--)
                {
                  console.log("next after: " + nextafter)
                  if (i != nextafter)
                  for (var key in $scope.player_names) {

                    if ($scope.player_names[key].id == $scope.player_array[i]) { // show player 1 name
                      hasAnyValue2 = true;
                      $scope.player2_msg = $scope.player_names[key].name;
                      break;
                      nextafter = 0;
                    
                    }
                    
                  
                  }

                }
                if (hasAnyValue2 == false && hasAnyValue == false)
                {
                  $scope.player_msg = "";
                  $scope.player2_msg = "";
                }
                if (hasAnyValue2 == false)
                {
                 // $scope.player_msg = "";
                  $scope.player2_msg = "";
                }


 

          console.log($scope.player_array);
          
          // player_list is what gets passed back to basestation, prep string as url string array
          $scope.player_list = "";
          //for (i=$scope.player_array.length-1; i>=0; i--)
          for (i=0; i <=$scope.player_array.length; i++)
          {
            if ($scope.player_array[i] !== undefined)
              $scope.player_list += $scope.player_array[i] + "," 

          }
          $scope.player_list = $scope.player_list.slice(0, - 1);
           


      }


      //console.log("Player selected " + val)
      //console.log("original player selected " +$scope.player_list )
   

      // for overrun style games
      if ($scope.gameTitle == "Overrun" )
        if ($scope.player_list != val)
        {
          $scope.player_list = val; // update the current player

          // if player is switching, update flag
          $scope.player_switch = true;

          console.log( "is player switching: " + $scope.player_switch);

        }

      // for multiplayer style games
      if ($scope.gameTitle == "PvP" )
      {
        console.log($scope.player_array)

      }
 
     
    }
 
  }

]);

function playCountDownBeep() {
  // var v = document.getElementsByTagName("audio")[0];
  // v.play();
  //$scope.sound = ngAudio.load("audio/beep.wav");
  //audio.play();
}

function playHalfSecondBeep() {
  var v = document.getElementsByTagName("audio")[1];
  //v.play();
}


function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000)),
      seconds = parseInt((duration / 1000) % 60),
      minutes = parseInt((duration / (1000 * 60)) % 60)

  if (duration < 1)
    return "00.00.00";
  else if (duration === null)
    return "miss";
  else if (duration < 1000)
    return "00." + pad(duration, 3);
  else if (duration < 60000)
    return pad(parseInt((duration / 1000) % 60), 2) + "." + pad(parseInt((duration % 1000)/10), 2);
  else {
    return pad(parseInt((duration / (1000 * 60)) % 60), 2) + ":" + pad(parseInt((duration / 1000) % 60), 2) + "." + pad(parseInt((duration % 1000)/10), 2);
  }
}
/*
function msToTimeUpdated(duration) {
  var milliseconds = parseInt((duration % 1000)),
      seconds = parseInt((duration / 1000) % 60),
      minutes = parseInt((duration / (1000 * 60)) % 60)

  if (duration < 1)
    return 0;
 
  else {
    return pad(parseInt((duration / (1000 * 60)) % 60), 2) + ":" + pad(parseInt((duration / 1000) % 60), 2) + "." + pad(parseInt((duration % 1000)/10),2);
  }
}
*/

function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length - size);
}

function msToTimeShort(duration) {
  //console.log("mstotime: " + duration);
  var milliseconds = parseInt((duration % 1000)),
      seconds = parseInt((duration / 100) % 60),
      minutes = parseInt((duration / (100 * 60)) % 60)
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  
    return minutes + "." + seconds + "." + milliseconds/10;
}