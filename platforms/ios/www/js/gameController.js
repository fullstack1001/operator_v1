angular.module('app.gameController', ['ngSanitize', 'ngAnimate'])

// .config(function($ionicConfigProvider) {
//   $ionicConfigProvider.views.maxCache(0);
// })

.controller('gameCtrl', ['$scope', 'alertService', 'openSocketService', '$stateParams', '$http', '$timeout', '$ionicPopup', 
            '$location', '$state', '$ionicHistory', '$sce', 'ngAudio',   // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName


 


function($scope, alertService, openSocketService, $stateParams, $http, $timeout, $ionicPopup, $location, $state, $ionicHistory, $sce, ngAudio) {

   

    console.log(alertService.getAlerts());


    $scope.numberDisp;
    $scope.showMainCountdownWindow = true;
    $scope.showGameOptions = true;

    //$state.go($state.current, {}, {reload:true});
    // ******* Setup Vars *******
    //$scope.show_start = true;
    $scope.showRecordTime=false;
    //$scope.recordTime = msToTime(234);
    $scope.bool = true;
    $scope.showSafetyCheck = true;

 
   $scope.show_start = true;
  

    $scope.runGameOnce = 0;
    var target_hit_data = new Array();
    $scope.countdown2 = msToTime($scope.maxtime*1000);
    if ($stateParams.gameid == "Swarm")
      $scope.countdown2 = "Wave 1";
    if ($stateParams.gameid == "Subsecond")
      $scope.countdown2 = "Ready to start!";
 
    $scope.gameOptions = "";
    $scope.gameTitle = $stateParams.gameid;
    $scope.time_between_waves = $stateParams.time_between_waves;
    $scope.maxtime = $stateParams.maxtime; 
    $scope.matchtype = $stateParams.matchtype;
    $scope.max_targets = $stateParams.max_targets;
    $scope.msg = "Waiting for host to start a game...";
    $scope.paddle_sequence = $stateParams.paddle_sequence;
    $scope.targets_per_station = $stateParams.targets_per_station;
    $scope.round_count = 1;
    $scope.runCountDownOnce = 0;
    $scope.runGameProgressOnce = 0;
    $scope.runPlayerMsgOnce = 0;
    $scope.speed = $stateParams.speed;
    $scope.targets_remaining = "Hits left: " + $scope.max_targets;
    if ($scope.gameTitle == "Swarm")
        $scope.targets_remaining = "Hits left: ∞";

 
    if ($scope.double_tap == "true"){
      $scope.doubletap_columns = true;
      $scope.singletap_columns = false;
    }
    else
    {
      $scope.doubletap_columns = false;
      $scope.singletap_columns = true;
    }

    $scope.scorelimit = $stateParams.scorelimit;
    $scope.player_messages = false; // show or not show player messages
    $scope.show_col_splits = false;

    $scope.wave = 0;
    if ($scope.gameTitle == "Swarm")
      $scope.wave = 1;
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

 

    if ($scope.gameTitle == "Domination-Z")
    {
      $scope.capture_the_flag = true;
      //$scope.not_capture_the_flag = true;
     
    }
    else
    {
      $scope.capture_the_flag = false;
      //$scope.not_capture_the_flag = true;

    }
    // END ******* Setup Vars *******

    socket =  openSocketService.openSocket();
    // *********** Open socket connection to base ***********
 
     var manager = io.Manager('http://'+ip+':'+port+'/', { /* options */ });
     manager.socket('/namespace');
     manager.on('connect_error', function() {
         console.log("Connection error!");      
         $scope.$apply(function () {
               $scope.base_msg_data = "Not connected to base station";
               $scope.base_msg_window = true;
               $scope.msg = "";
         });
     });
     var socket = io.connect('http://'+ip+':'+port+'/');
     $scope.$on('$destroy', function (event) {

      socket.removeAllListeners();
     })
   
 
    // END *********** Open socket connection to base ***********

    // if battery is low, let button click navigate
    $scope.base_msg_click = function(){
      if ( $scope.lowbattery)
      {
        console.log("click");
        $state.go('home.diagnostics'); 
      }
    }

    

     



    // ************ display game options **************
    if ($scope.matchtype == "Co-op")
      $scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">Co-op</button>';
    
    if ($scope.gameTitle == "Run N Gun")
      $scope.gameOptions = $scope.gameOptions +  '<button class="button button-small button-positive">' + $scope.targets_per_station + ' targets/station</button>'; 
    if ($scope.gameTitle != "Run N Gun")
      $scope.gameOptions = $scope.gameOptions +  '<button class="button button-small button-positive">' + $scope.paddle_sequence + '</button>';    

    if ($scope.speed != 500){
      if ($scope.speed < 1000)
        $scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">' + $scope.speed + ' ms</button>';
      else
        $scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">' + $scope.speed / 1000 + ' sec</button>';
    }
    
    $scope.double_tap = $stateParams.double_tap;
    if ($scope.double_tap == "true"){
      $scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">Double tap</button>';
      $scope.show_col_splits = true;
    }

    $scope.scorelimit = $stateParams.scorelimit;
    if ($scope.scorelimit > 0){
      $scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">Score limit: ' + $scope.scorelimit +'</button>';
      $scope.show_col_splits = true;
    }

    $scope.capture_and_hold = $stateParams.capture_and_hold;
    if ($scope.capture_and_hold == "true"){
      $scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">Capture and hold</button>';
      $scope.show_col_splits = true;
    }

    $scope.target_timeout = $stateParams.target_timeout;
    if ($scope.target_timeout == "true"){
      $scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">Target timeout</button>';
      $scope.show_col_splits = true;
    }
    
    $scope.best_of_three = $stateParams.best_of_three
    if ($scope.best_of_three == 'true')
      $scope.gameOptions = $scope.gameOptions + '<button class="button button-small button-positive">Best of three</button>';

    
    $scope.gameOptions = $sce.trustAsHtml($scope.gameOptions);

    // ************ display game options **************





    // helps with swipe to go back functionality I think
    $scope.myGoBack = function() {
       $ionicHistory.goBack();
    };
    $scope.swipe = function (direction) {
        $ionicHistory.goBack();
    }
 



    /******************* TIMER SCRIPTS *******************/
    $scope.countdown3 = msToTime($scope.maxtime*1);
    $scope.tmpcountdown3 = $scope.maxtime*1;
    var mytimeout3 = null; // the current timeoutID
    // onTimeout3 is more accurate time than OnTimeout. 
    // Using this function to update the onTimeout function periodically
    $scope.onTimeout3 = function() {
        if($scope.tmpcountdown3 ===  0) {
            $scope.$broadcast('timer-stopped', 0);
            $timeout.cancel(mytimeout3);
            $scope.runGameProgressOnce = 0;
            return;
        }
        $scope.countdown3 = $scope.tmpcountdown3--;
        if ($scope.countdown3 % 2)
        {
            $scope.tmpcountdown2 = (2+$scope.tmpcountdown3)*100;
            $scope.countdown2 = $scope.tmpcountdown3*100;
            console.log("updated time");
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
        

        if($scope.tmpcountdown2 ===  0) {
            $scope.$broadcast('timer-stopped', 0);
            $timeout.cancel(mytimeout);
            return;
        }
        $scope.tmpcountdown2--;
        $scope.countdown2 = msToTime($scope.tmpcountdown2*10);
        mytimeout = $timeout($scope.onTimeout, 10);
    };
 

    $scope.stopTimer = function() {
        $scope.$broadcast('timer-stopped', $scope.countdown2);
        $scope.$broadcast('timer-stopped', $scope.countdown3);
        $timeout.cancel(mytimeout);
        $timeout.cancel(mytimeout3);
    };

    // triggered, when the timer stops, you can do something here, maybe show a visual indicator or vibrate the device
    $scope.$on('timer-stopped', function(event, remaining) {
        if(remaining === 0) {
            console.log('your time ran out!');
        }
    });
    /******************* ENDTIMER SCRIPTS *******************/




    $scope.restart = function(val) {
    $scope.msg = "Get ready!";
      $http({method: 'GET', url: 'http://'+ip+':'+port+'/?restart=yes&randomstring=' + Math.random().toString(36).substring(7) + '&callback=JSON_CALLBACK&'}).
          success(function(data, status) {
            console.log(status); 
            console.log("session command sent");
            $scope.msg = "Get ready!";
            $scope.showRestartLabel = false;
 
          }).
          error(function(data, status) {
            console.log("Restart request failed");
            $scope.msg = "Base station didn't receive: Restart request!";
        }); 

    }
    


    // Stops game from stop game button  
    // Sends command to base to stop game now 
    $scope.stopGame = function(val) {
      $scope.stopTimer();

      $http({method: 'GET', url: 'http://'+ip+':'+port+'/?end=yes&callback=JSON_CALLBACK&'}).
          success(function(data, status) {
            //console.log(status); 
            console.log("stop game sent");
            $scope.msg = "Game stopped by host!";
 
          }).
          error(function(data, status) {
            console.log("Stop game request failed");
            $scope.msg = "Base station didn't receive: Game stopped by host!";
        }); 

    }

   
    // send request to base for countdown
    // base will emit message back signalling countdown began
    $scope.startGame = function(val) {
        $scope.showSafetyCheck = false;
        console.log("emitting countdown");
        if ($scope.gameTitle == "Domination-Z")
          socket.emit( 'goToCountdown-domination-z', 1 ); 
        else 
          socket.emit( 'goToCountdown', 1 );     
        if ($scope.gameTitle == "Subsecond")
        {
          $scope.show_start = false;
          $scope.show_restart = true;

        }
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
    if (socket)
        if ($scope.lowbattery)
          $scope.base_msg_window = true;
        else
          $scope.base_msg_window = false;

         socket.on('multiplayer_data', function(data){
       
             $scope.multiplayer_data = angular.fromJson(data);
             console.log($scope.multiplayer_data);

            


              $scope.bluePointsTime = $scope.multiplayer_data.player1.points_time ;
              console.log("Blue points time " + $scope.bluePointsTime);

              $scope.orangePointsTime = $scope.multiplayer_data.player2.points_time;
              width = ($scope.bluePointsTime / $scope.scorelimit)*100;
              $scope.blueBarWidth="width:" + width + "%";
           
              width = ($scope.orangePointsTime / $scope.scorelimit)*100;
              $scope.orangeBarWidth="width:" + width + "%";



                $scope.flagcontroltime = $scope.multiplayer_data.blueControlTime ;
                
                if ($scope.multiplayer_data.control_point_1.controlTime > 0){
                  
                  $scope.flag1 = "Flag 1 Captured"
                  if ($scope.multiplayer_data.control_point_1.control_point_1_target_colors[0] == "blue")
                  {
                    $scope.flag1_msg = "+" + $scope.multiplayer_data.control_point_1.controlTime + " for Blue";
                  } 
                  else 
                  {
                    $scope.flag1_msg = "+" + $scope.multiplayer_data.control_point_1.controlTime + " for Orange";
                  }
                    
                 }
                 else
                 {
                    $scope.flag1 = "Flag 1";
                    $scope.flag1_msg = "Neutral";

                 }

                if ($scope.multiplayer_data.control_point_2.controlTime > 0){
                  
                  $scope.flag2 = "Flag 2 Captured"
                  if ($scope.multiplayer_data.control_point_2.control_point_2_target_colors[0] == "blue")
                  {
                    $scope.flag2_msg = "+" + $scope.multiplayer_data.control_point_2.controlTime + " for Blue";
                  } 
                  else 
                  {
                    $scope.flag2_msg = "+" + $scope.multiplayer_data.control_point_2.controlTime + " for Orange";
                  }
                    
                 }
                 else
                 {
                    $scope.flag2 = "Flag 2";
                    $scope.flag2_msg = "Neutral";

                 }
           
                 if ($scope.multiplayer_data.control_point_3.controlTime > 0){
                  
                  $scope.flag3 = "Flag 3 Captured"
                  if ($scope.multiplayer_data.control_point_3.control_point_3_target_colors[0] == "blue")
                  {
                    $scope.flag3_msg = "+" + $scope.multiplayer_data.control_point_3.controlTime + " for Blue";
                  } 
                  else 
                  {
                    $scope.flag3_msg = "+" + $scope.multiplayer_data.control_point_3.controlTime + " for Orange";
                  }
                    
                 }
                 else
                 {
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
    






        socket.on('target_data', function(data){

          $scope.target_data = angular.fromJson(data);
          console.log($scope.target_data);
     
          // before push, there may be a duplicate if a second tap from 
          // double tap is coming in. Pull that out first.
          console.log("Checking::::: " + $scope.target_data.shottime);

          for (var key in target_hit_data) {
            console.log("Checking::::: " + target_hit_data[key].shottime);

            if (parseInt($scope.target_data.shottime) == parseInt(target_hit_data[key].shottime))
              console.log("***************Found duplicate *****************");

          }
          target_hit_data.push($scope.target_data);
          console.log(target_hit_data);
          console.log("target strike: " + $scope.target_data.target_strike);
          console.log("by : " + $scope.target_data.player_name);
          $scope.target_strike = $scope.target_data;
          $scope.player_name_display = "";
          //if (not_capture_the_flag == true)
            $scope.player_name_display = $scope.target_data.player_name;
          //else
            //$scope.player_name_display = "";

          
          if (false){
 
            $scope.divHitLog = ' <div class="row">' +
                  '<div class="cold col-23" >' + $scope.target_data.target_strike  + ' ' + $scope.player_name_display + '</div>' +
                  '<div class="cold col-48">' + msToTime($scope.target_data.shottime) + '</div>' +
                  '<div class="cold col-24">' + msToTime($scope.target_data.splittime) + ' </div>' +
                '</div>' + $scope.divHitLog;  

          }
          else
          { 
    
            // if  subsecond, show fastest hits at the top
            //if ($scope.gameTitle == "Subsecond")
            if (true)
            { 
              $scope.divHitLog = '';
              $scope.fastest_shot_time = 40000;
              
              // find fastest hit
              for (var key in target_hit_data) {
                console.log(target_hit_data[key].shottime);
                if (parseInt(target_hit_data[key].shottime) < parseInt($scope.fastest_shot_time))
                  $scope.fastest_shot_time = target_hit_data[key].shottime;
                  console.log($scope.fastest_shot_time);

              }

              

              // display all the hits
              var i = 0;
              if ($scope.double_tap == "true"){
                for (var key in target_hit_data) {
                  i++
                  console.log(target_hit_data[key].shottime);
                  $scope.divHitLog = ' <div class="row">' +
                  '<div class="cold col-23" >Hit '+ i + ' on target #' + target_hit_data[key].target_strike + '</div>' +
                  '<div class="cold col-48">' + msToTime(parseInt(target_hit_data[key].shottime)) + '</div>' +
                  '<div class="cold col-24">' + msToTime(parseInt(target_hit_data[key].splittime)) + ' </div>' +
                '</div>' + $scope.divHitLog; 
                }
              }
              else
              {
                for (var key in target_hit_data) {
                  i++
                  console.log(target_hit_data[key].shottime);
                  $scope.divHitLog = ' <div class="row">' +
                  '<div class="cold col-23" >Hit '+ i + ' on target #' + target_hit_data[key].target_strike + '</div>' +
                  '<div class="cold col-48">' + target_hit_data[key].player_name + ' - ' + msToTime(parseInt(target_hit_data[key].shottime)) + '</div>' +
                  '</div>' + $scope.divHitLog ;
                }

              }


              

              // display fastest hit
              for (var key in target_hit_data) {
                console.log(target_hit_data[key].shottime);
                if (target_hit_data[key].shottime == $scope.fastest_shot_time)
                {
                  //$scope.divHitLog = ' <div class="row ">' +
                  //'<div class="col col-23 col-positive positive filltext_due" >Fastest shottime</div>' +
                  //'<div class="col col-48 balanced filltext_due">By ' + target_hit_data[key].player_name +  ' - ' + msToTime(parseInt($scope.fastest_shot_time)) + '</div>' +
                  //'</div>' + $scope.divHitLog ;
                  $scope.fastest_shot_sofar =  'Fastest hit: ' + target_hit_data[key].player_name +  ' - ' + msToTime(parseInt($scope.fastest_shot_time)) ;
                  break;
                  //$scope.recordTime = target_hit_data[key].player_name +  ' - ' + msToTime(parseInt($scope.fastest_shot_time));
                }

              }
              $scope.showRecordTime=true;
              // last shot time
              if ($scope.gameTitle != "Swarm")
              {
                $scope.numberDisp = msToTime(parseInt($scope.target_data.group_shot_time));
                $scope.player = $scope.player_name_display;
                $scope.showMainCountdownWindow = false;
                $scope.showGameOptions = false;
              }
            }
            else
            { // add the new hit coming in
              $scope.divHitLog = ' <div class="row">' +
                '<div class="cold col-23" >' + $scope.target_data.target_strike + ' </div>' +
                '<div class="cold col-48">'  + target_hit_data[key].player_name + ' - ' + msToTime(parseInt($scope.target_data.elapsedtime)) + '</div>' +
                '</div>' + $scope.divHitLog ; 




            }
            
          }
 
        });

        socket.on('playerData', function(data){
          console.log(data);
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

        socket.on('jsonrows', function(data){
          $scope.activity = angular.fromJson(data);
 
          
          // display target color state
          $scope.divTargetsOnline = '<div class="row">';

          for (var key in $scope.activity.target)
          {   
            if ($scope.activity.target[key].online == true)
            {
          

           
              //console.log($scope.activity.target[key].id + ' color ' + $scope.activity.target[key].color);
              // console.log("target color");
              if ($scope.activity.target[key].color == "green")
              { 
                $scope.divTargetsOnline = $scope.divTargetsOnline + 
                       '<div class="col col_green col-24">' + $scope.activity.target[key].id + '</div>';
              }  
              else if ($scope.activity.target[key].color == "orange")
              { 
                $scope.divTargetsOnline = $scope.divTargetsOnline + 
                       '<div class="col col_orange col-24">' + $scope.activity.target[key].id + '</div>';
              }  
              else if ($scope.activity.target[key].color == "blue")
              { 
                $scope.divTargetsOnline = $scope.divTargetsOnline + 
                       '<div class="col col_blue col-24">' + $scope.activity.target[key].id + '</div>';
              }  
              else if ($scope.activity.target[key].color == "purple")
              { 
                $scope.divTargetsOnline = $scope.divTargetsOnline + 
                       '<div class="col col_purple col-24">' + $scope.activity.target[key].id + '</div>';
              }  
              else
              {
                $scope.divTargetsOnline = $scope.divTargetsOnline + 
                       '<div class="col col-24">' + $scope.activity.target[key].id + '</div>';
              }

            }
            
           
          }
        
          $scope.divTargetsOnline = $scope.divTargetsOnline +  '</div>';

          // $scope.divTargetsOnline = "";
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
            if ($scope.activity.terms_conditions == "false")
            {
              $scope.base_msg_data = "You must accept the terms & conditions before continuing";
              $scope.base_msg_window = true;
              $scope.show_start = false;
              $scope.msg = "";

            }
            else
            {

            }


            

          //console.log($scope.activity);
          $scope.$apply(function () {

          $scope.player_names = $scope.activity.players;
          $scope.player_list = $stateParams.player_list;
          //console.log($scope.player_names);
          //console.log($stateParams.player_list);
          $scope.player_array = $stateParams.player_list.split(",");
          if ($scope.runPlayerMsgOnce == 0)
          { 
            $scope.runPlayerMsgOnce = 1;
            if ($scope.gameTitle != "Domination-Z")
            {
              $scope.player_messages = true;
            }
            if ($stateParams.matchtype != "1 vs 1" && $stateParams.matchtype != "Single player")
              $stateParams.matchtype = "Co-op";
             if ($stateParams.matchtype == "1 vs 1" )
            {
               $scope.player_array = $stateParams.player_list.split(",");
              for (var key in $scope.player_names)
              { 
                  
                  //console.log($scope.player_names[key].id);
                  if ($scope.player_names[key].id == $scope.player_array[0])
                  { // show player 1 name
                    $scope.player_msg =  $scope.player_names[key].name ;
                    
                  }
                  if ($scope.player_names[key].id == $scope.player_array[1])
                  { // show player 1 name
                    $scope.player2_msg =  $scope.player_names[key].name ;
                    
                  }
              }
            }

            if ($stateParams.matchtype == "Single player" || $stateParams.matchtype == "Co-op")
            {
              $scope.player_messages = false;
              $scope.player_array = $stateParams.player_list.split(",");
              for (var key in $scope.player_names)
              {
                  if ($scope.player_names[key].id == $stateParams.player_list)
                  {
                    $scope.player_msg = $scope.player_names[key].name;
                  }
              }
            }
          }
          

          
 
          if ($scope.activity.game_status == "game_in_progress")
          {
              if ($scope.runGameProgressOnce == 0)
              {
                  $scope.msg = "Game in progress...";
                  $scope.runGameProgressOnce = 1;

                  if ($scope.wave  > 0)
                  {
                    // don't start the timer since its infinity
                  }
                  else if ($scope.gameTitle == "Subsecond")
                  {
                    //mytimeout = $timeout($scope.onTimeout, 1);
                    //mytimeout3 = $timeout($scope.onTimeout3, 1);
                    $scope.countdown2 = "∞";
             
                  }
                  else
                  {
                    mytimeout = $timeout($scope.onTimeout, 1);
                    mytimeout3 = $timeout($scope.onTimeout3, 1);
                  }
                  
              }

              if ($scope.gameTitle == "Subsecond")
              {
                //mytimeout = $timeout($scope.onTimeout, 1);
                //mytimeout3 = $timeout($scope.onTimeout3, 1);
                $scope.msg = "Delayed Start - get ready";
                var five_second_countdown = 6000;
                five_second_countdown = five_second_countdown - parseInt($scope.activity.delayed_start);
                // handle NAN
                if (!(parseInt(five_second_countdown/1000).toFixed(0) > 0))
                  five_second_countdown = 5;
                $scope.showRestartLabel = false;
                $scope.countdown2 = "Starting in " + parseInt(five_second_countdown/1000).toFixed(0);
                if (parseInt(five_second_countdown/1000).toFixed(0) == 0)
                {
                  $scope.countdown2 = "Targets active!";
                  $scope.msg = "";
                }

                console.log(parseInt($scope.activity.delayed_start));

                if ($scope.activity.numTargetsUp == 0 && parseInt($scope.activity.delayed_start) > 5000 )
                {
                  $scope.countdown2 = "";
                  $scope.showRestartLabel = true;

                }  


              }
                  //$scope.countdown2 = "Drill 2"
/*
              // start the next round
              console.log("client round count: " +$scope.round_count );
              console.log("server round count: " + $scope.activity.round_count);
              if ($scope.round_count != $scope.activity.round_count)
              {
                $scope.round_count = $scope.activity.round_count;
                
                // restart tim==ers
                mytimeout = $timeout($scope.onTimeout, 1);
                mytimeout3 = $timeout($scope.onTimeout3, 1);
              }
              */
              
          }
          // countdown before game begins
          if ($scope.activity.game_status == "counting_down")
          {
            console.log($scope.activity);
              if ($scope.runCountDownOnce == 0)
              {
                  $scope.runCountDownOnce = 1;

                  $scope.msg = "";

                  $scope.counter = 5;
                  $scope.divHitLog = '';
                  console.log("receiving countdown from base station");

                  $scope.countdown2 = "Starting in: " + $scope.counter;
                  //playCountDownBeep();
                  $scope.sound = ngAudio.load("audio/beep.wav");
                  $scope.sound.play();
                  $scope.onFiveSecondTimeout = function(){
                  
                      $scope.counter--;
                      if ($scope.counter > 0) {
                          myfivesecondtimeout = $timeout($scope.onFiveSecondTimeout,1000);
                          console.log($scope.counter);
                          $scope.$apply(function () {
                            $scope.countdown2 = "Starting in: " + $scope.counter;
                          });
                          //playCountDownBeep();
                          $scope.sound.play();
                      }
                      else {
                          console.log("Time is up!");
                          $scope.$apply(function () {
                            $scope.countdown = 0;
                            //$scope.runCountDownOnce = 0;
                          });


                          // setup date to pass to base station
                          var d = new Date();
                          console.log(d.getTime());
                          // tell base station to start game

                      
                            $http({method: 'GET', url: "http://"+ip+":"+port+"/?get=startgame&date="+ d.getTime() + "&max_time=" + $scope.maxtime + "&game_name=" + $scope.gameTitle + "&" +
                              "max_targets=" + $scope.max_targets + "&gamespeed=" + $scope.speed + "&time_between_waves=" + $scope.time_between_waves + "&double_tap=" + $scope.double_tap + "&capture_and_hold=" + $scope.capture_and_hold + "&target_timeout=" + $scope.target_timeout + 
                              "&targets_per_station="+$scope.targets_per_station + "&paddle_sequence="+$scope.paddle_sequence + "&matchtype=" + $scope.matchtype + "&scorelimit="+ $scope.scorelimit +"&player_ids=" + $scope.player_list + "&best_of_three=" + $scope.best_of_three + "&randomstring=" + Math.random().toString(36).substring(7) + "&interval=10&json_callback=JSON_CALLBACK"}).
                              success(function(data, status) {
                                console.log("starting game after countdown");
                                clearTimeout(myfivesecondtimeout);

                              }).
                              error(function(data, status) {
                                console.log(data);
                                console.log(data || "Request game start failed");
                            });  
                 
                             

                      }
                  }
                  var myfivesecondtimeout = $timeout($scope.onFiveSecondTimeout,1000);




              }


          }



          // game has ended - redirect user to score results after 5 seconds
          if ($scope.activity.game_status == "game_has_ended")
          {
              $scope.stopTimer();
              $scope.msg = "Game Over!";
              
              $scope.showRecordTime = false;
              $scope.showMainCountdownWindow = true;
              if ($scope.wave == 1)
                $scope.countdown2  = $scope.wave + "st wave achieved" ;
              else if ($scope.wave == 2)
                $scope.countdown2 = $scope.wave + "nd wave achieved" ;
              else if ($scope.wave == 3)
                $scope.countdown2 = $scope.wave + "rd wave achieved" ;
              else if ($scope.wave > 4)
                $scope.countdown2 = $scope.wave + "th wave achieved" ;


              $scope.counter = 10;
              $scope.onFiveSecondTimeout = function(){
                  $scope.counter--;

                  playHalfSecondBeep();
                  if ($scope.counter > 0) {

                      myfivesecondtimeout = $timeout($scope.onFiveSecondTimeout,500);
                      console.log($scope.counter);
                    
                  }
                  else {
                      console.log("redirecting to score results page now...");
                      $location.path("/page1/tab2/page3");
                  }
              }
              var myfivesecondtimeout = $timeout($scope.onFiveSecondTimeout,500);

          }
 
          if ($scope.activity.targets_left >= 0  ){
            
            var ts_left = $scope.activity.targets_left;
            if (ts_left > 9000)
              $scope.targets_remaining = "Hits left: ∞" ;
            else
              $scope.targets_remaining = "Hits left: " + $scope.activity.targets_left ;

          }
              
          if ($scope.gameTitle == "Swarm")
          {
            $scope.targs_left = $scope.activity.targets_hit_this_wave;
            if (!($scope.targs_left > 0))
              $scope.targs_left = 0;

            if (parseInt($scope.activity.targets_per_wave - $scope.targs_left) > 0)
              $scope.numberDisp = parseInt($scope.activity.targets_remaining_in_wave)  + " left";
            else
              $scope.numberDisp = "";

            

            $scope.misses =  $scope.activity.misses_left + " misses left ";

            

            $scope.showMainCountdownWindow = true;

            $scope.showGameOptions = false;
          }

          console.log($scope.activity);
          if ($scope.activity.wave > 0)
          { 

            countdownhidden = "";
            countdown2 = "";
            countdown3hidden = "";
            $scope.wave = $scope.activity.wave;
            $scope.countdown2 = "Wave " + $scope.wave;
            if ($scope.activity.wave_pause_enabled == 1)
            {
              $scope.showMainCountdownWindow = false;
              $scope.showRecordTime = true;
              $scope.countdown2 = "Next wave in: " + ($scope.activity.time_till_next_wave/1000).toFixed(0) + "";
            }
            else
            {
              $scope.showRecordTime = true;
              $scope.showMainCountdownWindow = false;
            }
          }
 

          });
          

        });




$scope.add_player_to_game = function(val){

    console.log("Player id : " + val);

    $scope.isChecked = false;
 

}




 
//});


}])

function playCountDownBeep()
{
  // var v = document.getElementsByTagName("audio")[0];
 
  // v.play();

          //$scope.sound = ngAudio.load("audio/beep.wav");
          //audio.play();

}
function playHalfSecondBeep()
{
  var v = document.getElementsByTagName("audio")[1];
 
          //v.play();
}

 

function msToTime(duration) {
    var milliseconds = parseInt((duration%1000))
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
      
      if (duration < 1)
        return 0;
      else if (duration === null)
        return "miss";
      else if (duration < 1000)
        return "00." + pad(duration,3);
      else if (duration < 60000)
        return  pad(parseInt((duration/1000)%60),2)+ "." + pad(parseInt((duration%1000)), 3);
      else
      {   
          return  pad(parseInt((duration/(1000*60))%60),2) + ":" + pad(parseInt((duration/1000)%60),2)+ "." + pad(parseInt((duration%1000)), 3);
      }
    
    
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}
 
function msToTimeShort(duration) {
  console.log("mstotime: " + duration);
    var milliseconds = parseInt((duration%1000))
        , seconds = parseInt((duration/100)%60)
        , minutes = parseInt((duration/(100*60))%60)
      
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    if (minutes == 0)
      return   seconds + "." + milliseconds;
    else
      return  minutes + "." + seconds + "." + milliseconds;
    
}
 

 

