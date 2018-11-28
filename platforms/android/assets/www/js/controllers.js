//TODO move all controlers to their own nameCtrl.js
angular.module('app.controllers', [])

.controller('gamesDrillsCtrl', ['$scope', '$stateParams',
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams) {
  }
])

.controller('scoresCtrl', ['$scope', '$rootScope', 'getTargets', 'addAlert', '$stateParams', '$state', '$http', '$ionicHistory', '$window', '$sce',
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $rootScope, getTargets, addAlert, $stateParams, $state, $http, $ionicHistory, $window, $sce) {



    $ionicHistory.clearCache();
    reloadScorePage++;
    if (reloadScorePage == 4) // need to hard refresh page or things stat to spaz out after a while
    { 
      reloadScorePage = 0;
  
      //$window.location.reload(); 
    }
    $scope.doRefresh = function () {
      $window.location.reload(); 
    };
    
    function msToTime(duration) {
      var milliseconds = parseInt((duration % 1000)),
          seconds = parseInt((duration / 1000) % 60),
          minutes = parseInt((duration / (1000 * 60)) % 60)

      if (duration < 1)
        return 0;
      else if (duration === null)
        return "miss";
      else if (duration < 1000)
        return "00." + pad(duration, 3);
      else if (duration < 60000)
        return pad(parseInt((duration / 1000) % 60), 2) + "." + pad(parseInt((duration % 1000)), 2);
      else {
        return pad(parseInt((duration / (1000 * 60)) % 60), 2) + ":" + pad(parseInt((duration / 1000) % 60), 2) + "." + pad(parseInt((duration % 1000)), 2);
      }
    }
    

    // **** setup vars ******
    $scope.avg_split = 0;
    $scope.avg_split_p2 = 0;
    $scope.avg_response = 0;
    $scope.avg_response_p2 = 0;
    $scope.fastest_split = 100;
    $scope.fastest_split_p2 = 100;
    $scope.fastest_response = '';
    $scope.fastest_response_p2 = '';
    $scope.fastest_player;
    $scope.highest_streak = 0;
    $scope.lowbattery = false;
    $scope.show_prevgames = false;
    $scope.show_currgame = true;
    $scope.show_avg_split = false;
    $scope.show_versus_score = false;
    $scope.show_best_split = false;
    $scope.show_all_splits = false;
    $scope.show_avg_response = true;
    $scope.show_hit_factor = false;
    $scope.show_most_hits = false;
    $scope.showBestTimes = true;
    $scope.shot_or_group_time = "Loading... ";
    $scope.showHitTime = false;
    $scope.show_shoot_no_shoot = false;
    $scope.completed_game_time = 0;
    $scope.player1_incrementer = 0;
    $scope.commercialDisplay = false;
    $scope.player2_incrementer = 0;

          
    $scope.base_msg_data = $scope.base_msg_data ||[];
    $scope.lowbattery = $scope.lowbattery || false;
    var stats = {};
    stats = [];
    $scope.shot_or_group_time_class = "shot_or_group_time_class";


    // setup sockets
    //var socket = io.connect('http://' + ip + ':' + port + '/');
    //var socket = io.connect('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});

    socket.once('jsonrows', function(data) {
      $scope.activity = angular.fromJson(data);
      console.log("account type: " + $scope.activity.account_type);
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
        

        // check for Alerts

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
    });

    $scope.$on('$destroy', function(event) {
      socket.removeAllListeners();
    });



    
    $scope.play_previous_game = function(){
      console.log("loading previous game");
      socket.emit('restartLastGame', '1');
    }

    // if a game is marked as uploaded, then pushing the button will mark it to be deleted from cloud
    // if the game is already marked as deleted, then mark it to be uploaded
    $scope.changeCloudStatus = function(game_id){

      for (var i = 0; i < $scope.items.length; i++) {
 
        if ($scope.items[i].game_id== game_id)
        {
 
            if ($scope.items[i].cloud_action == "delete")
            {
          
              $scope.items[i].cloud_status = '<img src="img/cloud-upload.png" style="width:100px;"/>';
              $scope.items[i].cloud_status = $sce.trustAsHtml($scope.items[i].cloud_status);
              $scope.items[i].cloud_action = "upload";

              $http({
                cache: false,
                method: 'GET',
                url: 'http://' + ip + ':' + port + '/?page=change_cloud_status&cloud_game_id=' + $scope.items[i].cloud_game_id + '&cloud_action=delete&callback=JSON_CALLBACK&'  + new Date().getTime()
              }).
              success(function(data, status) {console.log("message sent");}).
              error(function(data, status) {console.log("message not sent");});


            } 
            else if ($scope.items[i].cloud_action == "upload")
            {
              var vcloud_status = '<img src="img/cloud-online.png" style="width:100px;"/>';
              $scope.items[i].cloud_status = $sce.trustAsHtml(vcloud_status);
              $scope.items[i].cloud_action = "delete";

              $http({
                cache: false,
                method: 'GET',
                url: 'http://' + ip + ':' + port + '/?page=change_cloud_status&cloud_game_id=' + $scope.items[i].cloud_game_id + '&cloud_action=upload&callback=JSON_CALLBACK&'  + new Date().getTime()
              }).
              success(function(data, status) {console.log("message sent");}).
              error(function(data, status) {console.log("message not sent");});
            }
            
        }
      }


      
 

    }
 


  // get results
    $http({
      method: 'GET',
      url: "http://" + ip + ":" + port + "/?page=last_game_results&json_callback=JSON_CALLBACK"
    }).
    success(function(data, status) {

      console.log("Computing scores...")
    
      compute_scores(data);
      

    }).
    error(function(data, status) {
      console.log("Get score results failed");
    });

 
    $scope.show_past_game = function(game_id) {

      //$scope.fastest_response = '';
      // get results
      $http({
        method: 'GET',
        url: "http://" + ip + ":" + port + "/?page=last_game_results&gameid=" + game_id + "&json_callback=JSON_CALLBACK"
      }).
      success(function(data, status) {
        console.log("results are back...")
        compute_scores(data);

      }).
      error(function(data, status) {
        console.log("Get score results failed");
      });

    };
    $scope.onClick = function(points, evt) {
      console.log('On click points, event: ',points, evt);
    };
 

 

   

  
function compute_scores(data)
{


      $scope.avg_split = 0;
    $scope.avg_split_p2 = 0;
    $scope.avg_response = 0;
    $scope.avg_response_p2 = 0;
    $scope.fastest_split = 100;
    $scope.fastest_split_p2 = 100;
    $scope.fastest_response = '';
    $scope.fastest_response_p2 = '';
    $scope.fastest_player;
    $scope.highest_streak = 0;
    $scope.lowbattery = false;
    $scope.show_prevgames = false;
    $scope.show_currgame = true;
    $scope.show_avg_split = false;
    $scope.show_versus_score = false;
    $scope.show_best_split = false;
    $scope.show_all_splits = false;
    $scope.show_avg_response = true;
    $scope.show_most_hits = false;
    $scope.showBestTimes = true;
    $scope.shot_or_group_time = "Loading... ";
    $scope.showHitTime = false;
    $scope.show_shoot_no_shoot = false;
    $scope.completed_game_time = 0;
    $scope.player1_incrementer = 0;
    //$scope.commercialDisplay = false;
    $scope.player2_incrementer = 0;

          
    $scope.base_msg_data = $scope.base_msg_data ||[];
    $scope.lowbattery = $scope.lowbattery || false;
    var stats = {};
    stats = [];
    $scope.shot_or_group_time_class = "shot_or_group_time_class";



    $scope.result_data_arr = angular.fromJson(data);

  
   
      if ($scope.result_data_arr[2] == "prev_game_is_available")
        $scope.show_restart_button = true;
      else
        $scope.show_restart_button = false;
     
      $scope.showFastestResponsePvP = false;
      $scope.showFastestResponse = false;
      $scope.result_data_last_round = $scope.result_data_arr[0];
      $scope.result_data = $scope.result_data_arr[0];


      $scope.match_type = $scope.result_data_arr[0][0].match_type;
      // gather multiplayer names
      $scope.matchtype = $scope.result_data_arr[0][0].player_name;

      if ($scope.match_type == "1 vs 1") {

       // console.log($scope.result_data_arr[0]);
        // for multiplayer - get counters and player names
        $scope.player1_incrementer = 0;
        $scope.player2_incrementer = 0;
        $scope.showFastestResponsePvP = true;
        $scope.player1 = $scope.result_data_arr[0][0].player_name;
        $scope.player2 = $scope.result_data_arr[0][0].player2_name;

        // get player2 name
        /*
        for (var i = 0; i < $scope.result_data.length; i++) {
          
          if ($scope.player1 != $scope.result_data[i].player_name) {

            $scope.player2 = $scope.result_data[i].player_name;
            break;
          }
        }
        */
        // display names on client
        $scope.matchtype = " " + $scope.player1 + ' vs ' + $scope.player2;
        $scope.player_column = true;
        $scope.show_most_hits = true;
      }
      else
      {
        $scope.showFastestResponse = true;
      }


      // if gamename = manual control - filter out missed shots
      for (var i = 0; i < $scope.result_data_last_round.length; i++) {
        if ($scope.result_data_last_round[i].game_name == "Manual Control" && $scope.result_data_last_round[i].target_hit != 1)
          delete $scope.result_data_last_round[i];

      }

       $scope.result_data_last_round = $scope.result_data_last_round.filter(function(val){return val});

      // if gamename = manual control - filter out missed shots
      for (var i = 0; i < $scope.result_data.length; i++) {
        //if (( $scope.result_data[i].game_name === undefined)  && $scope.result_data[i].target_hit != 1)
          //delete $scope.result_data[i];

      }
      
       $scope.result_data = $scope.result_data.filter(function(val){return val});
 
 
      $scope.stats = $scope.result_data;
      $scope.stats_last_round = $scope.result_data_last_round;
      $scope.paddles_served = 0;
      $scope.paddles_hit = 0;
      $scope.paddles_served_p2 = 0;
      $scope.paddles_hit_p2 = 0;
      $scope.shot_time_arr = [];
      $scope.shot_time_arr_p2 = [];
      $scope.shot_time_arr_avg = []; //Math.random() * (max - min) + min;
      $scope.shot_time_arr_last_round = [];
      $scope.shot_cnt_arr = [];
      $scope.shot_cnt_arr_p2 = [];
      $scope.shot_cnt_incrementer = 1;
      $scope.shot_cnt_incrementer_p2 = 1;
      $scope.highest_wave = 0;
      $scope.by_player = true;

      $scope.fastest_response = 100000;


      var fail_count = 0;
      var pass_count = 0;
      // package up hit detail log into stats[] array and do summary data math
      for (var i = 0; i < $scope.result_data.length; i++) {



        // gather stats
        if ($scope.result_data[i].shot_time > 0) {
          // for detail hit log
          $scope.stats[i].time_till_hit = $scope.result_data[i].shot_time;


          // count up average hit responses
          $scope.avg_response += parseFloat($scope.stats[i].time_till_hit);
        } else {
          $scope.stats[i].time_till_hit = "miss";

        }

        // Shoot no shoot
        if ($scope.result_data[i].game_name == "Manual Control") {

          $scope.show_shoot_no_shoot = true;
          $scope.showHitTime = false;
          // count fails
          if ($scope.result_data[i].variation == "fail")
            fail_count++;
          if ($scope.result_data[i].variation == "pass")
            pass_count++;

 
          $scope.shoot_no_shoot = 100 -((fail_count /  (pass_count + fail_count)).toFixed(2)*100).toFixed(2) + "%";

        } 
 
        if (parseInt($scope.result_data[i].shot_time)>0)
        {

          if ($scope.result_data[i].shot_time < $scope.fastest_response && $scope.result_data[i].shot_time !== null) {

             //console.log ("********* shot time: " +$scope.result_data[i].shot_time + " fastest response: " +$scope.fastest_response)
    

            $scope.fastest_response = $scope.result_data[i].shot_time;
            if ($scope.match_type == "1 vs 1") {

            
              $scope.fastest_player = $scope.result_data[i].player_name;
 
              $scope.show_avg_response = false;
            } else {

              $scope.fastest_player = $scope.result_data[i].player_name;
            }
            //console.log('fastest result_data: ',$scope.result_data);
          }
        }
        

        $scope.showBestTimes = true;
        // highest wave
        if ($scope.result_data[i].wave > $scope.highest_wave) {
          $scope.highest_wave = $scope.result_data[i].wave;
          $scope.shot_or_group_time = "Highest wave: ";
        }
        //console.log("highest wave: " + $scope.highest_wave);


        // charting
        if ($scope.result_data[i].target_hit == 1) {
          if ($scope.match_type == "1 vs 1") {

            if ($scope.stats[i].shot_by_player == $scope.player1) {

              $scope.shot_time_arr[$scope.player1_incrementer] = msToTime($scope.stats[i].time_till_hit);
              $scope.shot_cnt_arr[$scope.player1_incrementer] = 'Shot ' + $scope.shot_cnt_incrementer++;
              $scope.player1_incrementer++;
 
            } else if ($scope.stats[i].shot_by_player == $scope.player2) {

              $scope.shot_time_arr_p2[$scope.player2_incrementer] = msToTime($scope.stats[i].time_till_hit);
              $scope.shot_cnt_arr_p2[$scope.player2_incrementer] = 'Shot ' + $scope.shot_cnt_incrementer_p2++;
              $scope.player2_incrementer++;
             }


          } else {
            $scope.shot_time_arr[i] = msToTime(parseFloat($scope.stats[i].time_till_hit));
            $scope.shot_cnt_arr[i] = 'Shot ' + $scope.shot_cnt_incrementer++;

            

          }
        }

        if ($scope.result_data[i].variation == "fail")
          $scope.stats[i].target_hit_time = "fail";
        else
          $scope.stats[i].target_hit_time = msToTime($scope.result_data[i].target_hit_time);
        if ($scope.result_data[i].variation == "fail")
          $scope.stats[i].split_time = "fail";
        else
          $scope.stats[i].split_time = msToTime($scope.result_data[i].target_split_time);


        // count up average splits
        $scope.avg_split += parseFloat(msToTime($scope.result_data[i].target_split_time));

        // display most hits
        if ($scope.match_type == "1 vs 1") {
          if ($scope.player1_incrementer > $scope.player2_incrementer) {
            $scope.most_hits = $scope.player1_incrementer + ' -' + $scope.player1;
          } else {
            $scope.most_hits = $scope.player2_incrementer + ' -' + $scope.player2;
          }
          // if both players hit the same number of hits, hide
          if ($scope.player2_incrementer == $scope.player1_incrementer)
            $scope.show_most_hits = false;
        }
        // fastest split
        
        if ($scope.match_type == "1 vs 1") {
          if ($scope.stats[i].split_time < $scope.fastest_split)
          {
            $scope.fastest_split = $scope.stats[i].split_time;
            $scope.fastest_split = $scope.stats[i].split_time + ' - ' + $scope.stats[i].player_name;
          }
        } else {
          if ($scope.stats[i].split_time > 0)
          {
            if ($scope.stats[i].split_time < $scope.fastest_split )
              {
                $scope.fastest_split = $scope.stats[i].split_time;
              }
            //$scope.fastest_split = $scope.stats[i].split_time;
          }
          else {
            $scope.stats[i].split_time = "-";
            //$scope.stats[i].target_hit_time  = "-";
          }
        }
        //console.log('Stats: ',$scope.stats[i]);

        // adding up the shots
        //console.log("Player 1 total hits: " + $scope.player1_incrementer)
        //console.log("Player 2 total hits: " + $scope.player2_incrementer)

        $scope.stats[i].target_presented = i+1; //$scope.result_data[i].target_presented;

        $scope.stats[i].player_name = $scope.result_data[i].shot_by_player;

        // hits vs serves

        if ($scope.match_type == "1 vs 1") {

          if ($scope.stats[i].shot_by_player == $scope.player1) {
            // count serves vs hits
            $scope.paddles_served++;
            if ($scope.result_data[i].target_hit == 1)
              $scope.paddles_hit++;
          } else if ($scope.stats[i].shot_by_player == $scope.player2) {
            $scope.paddles_served_p2++;
            if ($scope.result_data[i].target_hit == 1)
              $scope.paddles_hit_p2++;
          }
          if ($scope.player2_incrementer > $scope.player1_incrementer)
            $scope.paddles_hit = $scope.player2_incrementer;
        } else {
          // count serves vs hits
          $scope.paddles_served++;
          if ($scope.result_data[i].target_hit == 1)
            $scope.paddles_hit++;
        }




        $scope.completed_game_time =  msToTime($scope.result_data[i].elapsed_time);
          if ($scope.result_data[i].game_name == "Overrun")
          {
            $scope.completed_game_time =  msToTime($scope.result_data[i].best_streak_time);
            $scope.paddles_hit =  ($scope.result_data[i].best_streak_total);

          }
 


        // not working
        $scope.average_hit_time = $scope.stats[i].time_till_hit;
        $scope.gamename = $scope.result_data[i].game_name;

      }
      // format the milliseconds to time format
      for (var i = 0; i < $scope.stats.length; i++) {


        if ($scope.stats[i].time_till_hit != "miss")
          $scope.stats[i].time_till_hit = msToTime($scope.stats[i].time_till_hit);
        if ($scope.result_data[i].variation == "fail")
          $scope.stats[i].time_till_hit = "fail";
      }

      
     

      // done formatting milliseconds to time format
      // if current game was not 1v1, then show previous game shot time results in
      // chart for comparison of current game


      

      //console.log('Last round data 2: ',$scope.result_data_last_round);
      var current_wave = 0;
      var streak_counter = 0;
      $scope.show_versus_score = false;
      console.log("last round")

      for (var i = 0; i < $scope.result_data_last_round.length; i++) {

        $scope.player_name_last_round = $scope.stats_last_round[i].player_name;
        if ($scope.stats_last_round[i].target_hit_time > 0)
          $scope.stats_last_round[i].time_till_hit = msToTime(($scope.stats_last_round[i].shot_time));
        else
          $scope.stats_last_round[i].time_till_hit = 0;
        //console.log('Time til hit: ',$scope.stats_last_round[i].time_till_hit);
        // charting
        $scope.shot_time_arr_last_round[i] = parseFloat($scope.stats_last_round[i].time_till_hit);
 

        // count highest streak
        if ($scope.gamename == "Overrun") {
          if (current_wave !=  $scope.stats_last_round[i].wave)
          {
            current_wave = $scope.stats_last_round[i].wave;
            streak_counter = 0;
          }
          if (current_wave ==  $scope.stats_last_round[i].wave && $scope.stats_last_round[i].target_hit == 1)
          {
             

            streak_counter++;
          }
          if ($scope.highest_streak < streak_counter)
          {
            $scope.highest_streak  = streak_counter;
            //console.log("Highest streak: " + $scope.highest_streak)
          } 
          $scope.highest_streak  = $scope.stats_last_round[i].best_streak_total;
        }



      }




      // calculate split times
      if ($scope.match_type == "1 vs 1") {
        $scope.avg_split = ($scope.avg_split / $scope.paddles_hit).toFixed(2);
        if ($scope.avg_split > 0)
          $scope.show_avg_split = true;
        if ($scope.fastest_split > 0)
          $scope.show_best_split = true;
        if ($scope.best_split > 0)
          $scope.show_all_splits = true;

        $scope.avg_split = ($scope.avg_split / $scope.paddles_hit).toFixed(2);
        if ($scope.avg_split > 0)
          $scope.show_avg_split = true;
        if ($scope.fastest_split > 0)
          $scope.show_best_split = true;

      } else {
        $scope.avg_split = ($scope.avg_split / $scope.paddles_hit).toFixed(2);
        if ($scope.avg_split > 0)
          $scope.show_avg_split = true;
        if ($scope.fastest_split > 0)
          $scope.show_best_split = true;
        if ($scope.best_split > 0)
          $scope.show_all_splits = true;
      }

      // calculate average response
      if ($scope.paddles_hit > 0) {
        $scope.avg_response = msToTime(($scope.avg_response / $scope.paddles_hit).toFixed(0));
        $scope.hits_vs_serves = Math.round(($scope.paddles_hit / $scope.paddles_served) * 100);
      }



      // chart data
      if ($scope.match_type == "1 vs 1") {
        $scope.series = [$scope.player1, $scope.player2];
        $scope.data = [
          $scope.shot_time_arr, $scope.shot_time_arr_p2
        ];
        

      } else {
        $scope.series = ['Current - ' + $scope.matchtype, 'Previous game - ' + $scope.player_name_last_round];

        $scope.data = [
          $scope.shot_time_arr, $scope.shot_time_arr_last_round
        ];


        

      }


      // calculate power factor
        if ($scope.gamename == "Overrun" || $scope.gamename == "Run N Gun")
        {
          $scope.show_hit_factor = true;
          if ($scope.paddles_hit > 0)
            $scope.hit_factor = ($scope.paddles_hit / $scope.completed_game_time).toFixed(2);
          else
            $scope.hit_factor = "N/A"
        }

      // fastest response gets converted to other stuff below... so to retain fastest response, put to another var
      $scope.fastest_response1 = msToTime($scope.fastest_response);
      $scope.labels = $scope.shot_cnt_arr;
      if ($scope.fastest_response == '')
        $scope.fastest_response = 0;




      if ($scope.gamename == "Subsecond") {
        //post best group time instead of best shot time
        $scope.shot_or_group_time = "Best group time ";

      } else if ($scope.gamename == "Swarm") {
        $scope.shot_or_group_time = "Highest wave ";
        $scope.fastest_response = " " + $scope.highest_wave + " ";
        $scope.shot_or_group_time_class = "shot_or_group_time_class_lg";
      }
      else if ($scope.gamename == "Overrun") {

        $scope.shot_or_group_time = "Highest streak ";
        $scope.fastest_response = " " + $scope.highest_streak + " ";
        $scope.shot_or_group_time_class = "shot_or_group_time_class_lg";
      }
      else if ($scope.gamename == "Run N Gun") {

        $scope.shot_or_group_time = "Completed in";
        $scope.fastest_response = " " + $scope.completed_game_time + " ";
        $scope.shot_or_group_time_class = "shot_or_group_time_class_lg";
      }
      else if ($scope.gamename == "PvP")
      { 
        $scope.show_versus_score = true;
        $scope.by_player = false;
        // display winner

        //if ($scope.player1_incrementer > $scope.player2_incrementer)
          //console.log($scope.result_data_last_round)
        if ($scope.result_data_last_round[0].player1_score > $scope.result_data_last_round[0].player2_score)
        {
          $scope.shot_or_group_time = "Winner ";
          $scope.showFastestResponsePvP = true;
          $scope.fastest_response2 = $scope.fastest_player + " " + msToTime($scope.fastest_response);
          $scope.fastest_response = $scope.result_data_last_round[0].player_name ;
          
          $scope.shot_or_group_time_class = "shot_or_group_time_class_lg";
          $scope.vs_score =  $scope.player1_incrementer + " to " +  $scope.player2_incrementer
          $scope.matchtype = " " + $scope.player1 + ' vs ' + $scope.player2;
        }
        else if ($scope.result_data_last_round[0].player1_score < $scope.result_data_last_round[0].player2_score)
        {
          $scope.shot_or_group_time = "Winner ";
          $scope.showFastestResponsePvP = true;
          $scope.fastest_response2 = $scope.fastest_player + " " + msToTime($scope.fastest_response);
          $scope.fastest_response = $scope.result_data_last_round[0].player2_name ;
          
          $scope.shot_or_group_time_class = "shot_or_group_time_class_lg";
          $scope.vs_score =  $scope.player2_incrementer + " to " +  $scope.player1_incrementer
          $scope.matchtype = " " + $scope.player2 + ' vs ' + $scope.player1;
        }
        else
        {
          $scope.shot_or_group_time = " ";
          $scope.fastest_response = "Draw";
          $scope.vs_score =  $scope.player1_incrementer + " to " +  $scope.player2_incrementer
        }
        //$scope.fastest_response = " " + $scope.highest_streak + " ";
        //$scope.shot_or_group_time_class = "shot_or_group_time_class_lg";

         //console.log("Player 1 total hits: " + $scope.player1_incrementer)
         // console.log("Player 2 total hits: " + $scope.player2_incrementer)
      } else {
        $scope.shot_or_group_time = "Best shot time ";
      }
      $scope.showHitTime = true;


}             




    $http({
      method: 'GET',
      url: "http://" + ip + ":" + port + "/?page=past_game_results&json_callback=JSON_CALLBACK"
    }).
    success(function(data, status) {

      $scope.result_data = angular.fromJson(data);
      //console.log($scope.result_data);
      $scope.items = $scope.result_data;

      $scope.items.total_game_time = $scope.result_data.total_game_time;

      for (var i = 0; i < $scope.items.length; i++) {


        // defaults
        $scope.items[i].names = $scope.items[i].player_name;
        $scope.items[i].scores = $scope.items[i].targets_hit+0;

        if ($scope.items[i].game_name == "PvP")
        {
          if ($scope.items[i].player1_score === null)
          {
            $scope.items[i].scores = '';
          }
          else
          {
             if ($scope.items[i].player1_score > $scope.items[i].player2_score )
            {
              $scope.items[i].scores = $scope.items[i].player1_score + " to " + $scope.items[i].player2_score ;
              $scope.items[i].names = $scope.items[i].player_name + " vs " + $scope.items[i].player2_name;
            }
            else
            {
              $scope.items[i].scores = $scope.items[i].player2_score + " to " + $scope.items[i].player1_score ;
              $scope.items[i].names = $scope.items[i].player2_name + " vs " + $scope.items[i].player_name;
            } 
          }
          
        }
        if ($scope.items[i].game_name == "Overrun")
        {
          $scope.items[i].scores = $scope.items[i].best_streak_total;
          $scope.items[i].overall_time = msToTime($scope.items[i].best_streak_time);
        }

        if ($scope.items[i].game_name == "Run N Gun")
        {
          $scope.items[i].scores = $scope.items[i].best_streak_total;
          $scope.items[i].overall_time = msToTime($scope.items[i].best_streak_time);
        }
        $scope.items[i].overall_time = msToTime($scope.items[i].best_streak_time);
         
        // console.log($scope.result_data[i].game_name);
        // console.log($scope.result_data[i].total_game_time);
        // console.log($scope.result_data[i].targets_hit);
        //console.log("Avg hit response: " + msToTime($scope.result_data[i].avg_hit_response/10));
        //console.log($scope.items[i].cloud_status);
        if ($scope.items[i].posted_to_cloud == 1 && $scope.items[i].cloud_game_id !== null)
        {
          $scope.items[i].cloud_status = '<img src="img/cloud-online.png" style="width:100px;"/>';
          $scope.items[i].cloud_status = $sce.trustAsHtml($scope.items[i].cloud_status);
          $scope.items[i].cloud_action = "delete";
          $scope.items[i].id = i;
        }
        // 2 == removed
        if ($scope.items[i].posted_to_cloud == "2" && $scope.items[i].cloud_game_id !== null)
        {

          $scope.items[i].cloud_status = '<img src="img/cloud-upload.png" style="width:100px;"/>';
          $scope.items[i].cloud_status = $sce.trustAsHtml($scope.items[i].cloud_status);
          $scope.items[i].cloud_action = "upload";
          $scope.items[i].id = i;
        }
        if ($scope.items[i].posted_to_cloud === null && $scope.items[i].cloud_game_id !== null)
        {

          $scope.items[i].cloud_status = '<img src="img/cloud-upload.png" style="width:100px;"/>';
          $scope.items[i].cloud_status = $sce.trustAsHtml($scope.items[i].cloud_status);
          $scope.items[i].cloud_action = "upload";
          $scope.items[i].id = i;
        }
         
        $scope.result_data[i].avg_hit_response = msToTime($scope.result_data[i].avg_hit_response);
        $scope.result_data[i].fastest_hit_response = msToTime($scope.result_data[i].fastest_hit_response);

        if ($scope.result_data[i].date > 0) {
          var utcSeconds = parseInt($scope.result_data[i].date);

          $scope.result_data[i].date_formatted = timeConverter(utcSeconds);

        }

      }


      function timeConverter(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
      }

    }).
    error(function(data, status) {
      console.log("Get score results failed");
    });

    // check if there is a command to redirect player's screen to the game screen
    // this occurs when game host hits START on the game screen


    // host fired off goToPage broadcast.
    // this is the echo back and redirects all devices to game screen
    
    socket.on('goToPageBroadcast', function(data) {

      $scope.game_data = angular.fromJson(data);


      // this apps unique uid. prevents other apps that are open 
      // from being redirected for spectator mode
      console.log("*********** uid" + uid + " *****************");
      console.log($scope.game_data);
      
      if ($scope.game_data.uid == uid)
      {
          console.log("reloading game")
          console.log($scope.game_data);
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
              event_id: $scope.game_data.event_id,
              uid: uid
            }, {
              reload: true
            });
          });
      }
      

    });
   

  }
])

.controller('settingsCtrl', ['$scope', 'getTargets', 'addAlert', '$stateParams', '$state', '$http', '$ionicHistory', '$window',
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, getTargets, addAlert, $stateParams, $state, $http, $ionicHistory, $window) {
    // setup sockets

    $scope.restart_label = "Restart Basestation";
    $scope.sensitivity_msg = "Lower values are higher in sensitivity";
    $scope.doRefresh = function () {
   
      $window.location.reload(); 
    };
    //var socket = io.connect('http://' + ip + ':' + port + '/');
    //var socket = io.connect('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});
    socket.once('jsonrows', function(data) {
      $scope.activity = angular.fromJson(data);
      $scope.$apply(function() {
        
        console.log('Brightness raw: ',$scope.activity.led_brightness);
        $scope.target_online_count = getTargets($scope).length;
        $scope.brightness_level_from_base = parseInt($scope.activity.led_brightness,16);
        console.log('Brightness converted: ',$scope.brightness_level_from_base);
        $scope.rangeValue = $scope.brightness_level_from_base;
 
        $scope.hitSensitivityRangeValue = $scope.activity.lumatic_hit_sensitivity;

        $scope.updatedValue = $scope.brightness_level_from_base;
        if ($scope.activity.idle_blink == "true") {
          $scope.idle_blink = true;
        }else {
          $scope.idle_blink = false;
          
        }

        if ($scope.activity.speed_start == "true") {
          $scope.speed_start = true;
        }else {
          $scope.speed_start = false;
          
        }
 

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
        console.warn('settings messages: ',$scope.base_msg_data);
      });
    });

    $scope.$on('$destroy', function(event) {
      socket.removeAllListeners();
    });
    // get method
 
    $scope.drag = function(value) {
      $scope.updatedValue = parseInt(value,10);
      console.log("slider dragged");
      var k =  parseInt(value,10);
    
 

      $http({method: 'GET', url: 'http://' + ip + ':' + port + '/?update=brightness&level=' + $scope.updatedValue.toString(16) + '&randomstring=' + Math.random().toString(36).substring(7) + '&callback=JSON_CALLBACK&'}).
          success(function(data, status) {
         
              console.log("*** brightness request received");

   
          }).
          error(function(data, status) {
            console.log("update brightness failed");
            console.log(data);
            console.log(status);
        }); 
 

    };
   

     $scope.changeHitSensitivity = function(value) {
       
      if (value == 0 )
        value = 1;
      $scope.hitSensitivityRangeValue  = value;
      if (value > 0)
        $scope.sensitivity_msg = "Hit senstivity adjusted to airsoft/pellet forces ";
      if (value > 10)
        $scope.sensitivity_msg = "Hit senstivity adjusted to .22 forces ";
      if (value > 29)
        $scope.sensitivity_msg = "Hit senstivity adjusted to pistol forces" ;
      if (value > 40)
        $scope.sensitivity_msg = "Hit senstivity adjusted to rifle forces" ;
 
    
      $http({method: 'GET', url: 'http://' + ip + ':' + port + '/?update=updateHitSensitivity&hitSenstivityValue=' + $scope.hitSensitivityRangeValue + '&randomstring=' + Math.random().toString(36).substring(7) + '&callback=JSON_CALLBACK&'}).
          success(function(data, status) {
         
              console.log("*** update hitsenstivity value request received");

   
          }).
          error(function(data, status) {
            console.log("update hitsenstivity failed");
            console.log(data);
            console.log(status);
        }); 
 

    };
   
 
 
    $scope.toggle_idle_blink = function(idle_blink) {
      console.log("Idle blink: " + idle_blink);
      $scope.idle_blink = idle_blink;
      $http({
        method: 'GET',
        url: 'http://' + ip + ':' + port + '/?update=idle_blink&idle_blink_value=' + $scope.idle_blink + '&callback=JSON_CALLBACK&'
      }).
      success(function(data, status) {
        console.log("update blink sent");
      }).
      error(function(data, status) {
        console.log("update blink request failed");

      });
    };

    $scope.toggle_speed_start = function(speed_start) {
      console.log("speed_start: " + speed_start);
      $scope.speed_start = speed_start;
      $http({
        method: 'GET',
        url: 'http://' + ip + ':' + port + '/?update=speed_start&speed_start_value=' + $scope.speed_start + '&callback=JSON_CALLBACK&'
      }).
      success(function(data, status) {
        console.log("update speed_start sent");
      }).
      error(function(data, status) {
        console.log("update speed_start request failed");

      });
    };


    



  $scope.clearTargetList = function() {
        console.log("clearing target list requested");
 
       $http({method: 'GET', url: 'http://'+ip+':'+port+'/?update=clearTargetList&randomstring=' + Math.random().toString(36).substring(7) + '&callback=JSON_CALLBACK&'}).
          success(function(data, status) {
            console.log("*** clearing target request recieved");
        
             
              $http({method: 'GET', url: 'http://'+ip+':'+port+'/?get=discoverTargets&randomstring=' + Math.random().toString(36).substring(7) + '&callback=JSON_CALLBACK&'}).
                success(function(data, status) {
                  console.log("*** request received.");
                  $scope.msg = "Target list cleared ";
                  setTimeout(function(){
                    $state.go('home.welcome');
                  }, 2000);   
                }).
                error(function(data, status) {
                  console.log("failed to communicate to base station");
                  console.log(data);
                  console.log(status);
              }); 

          }).
          error(function(data, status) {
            console.log("clear target list failed");
            console.log(data);
            console.log(status);
   
        }); 


  }

  $scope.resetTargets = function() {
        console.log("reset target list requested");
 
  
        $http({
          method: 'GET',
          url: 'http://' + ip + ':' + port + '/?resetTargets=yes&callback=JSON_CALLBACK&'
        }).
        success(function(data, status) {
          //console.log(status);
          console.log("*** reset targets request received");
          $scope.reset_msg = "Targets are being reset!";

        }).
        error(function(data, status) {
          console.log("reset target request failed");
          $scope.reset_msg = "Base station didn't receive: Reset targets!";
        });

  }

  $scope.restartGameScript = function() {
    

    
    $http({method: 'GET', url: 'http://'+ip+':'+port+'/?update=restartGameScript&callback=JSON_CALLBACK&'}).
          success(function(data, status) {
            console.log("Restarting base station now!");
            $scope.restart_msg = "Restarting basestation now! Please go to the homescreen and wait for reconnection.";
            $scope.restart_label = "Restarting basestation";
        
            setTimeout(function(){
              $state.go('home.welcome');
            }, 1000);
          }).
          error(function(data, status) {
            console.log("restart command failed");
            $scope.restart_msg = "Message not received. Make sure you are connected to the basestation.";
            $scope.restart_label = "Message not received.";
        });
 

  }

    /*
    // host fired off goToPage broadcast.
    // this is the echo back and redirects all devices to game screen
    socket.on('goToPageBroadcast', function(data) {

      $scope.game_data = angular.fromJson(data);

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
          event_id: $scope.game_data.event_id
        }, {
          reload: true
        });
      });

    });
    */

  }
])

.controller('profileCtrl', ['$scope', 'getTargets', 'addAlert', '$stateParams', '$rootScope', '$state', '$ionicHistory',
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, getTargets, addAlert, $stateParams, $rootScope, $state, $ionicHistory) {

    // check if there is a command to redirect player's screen to the game screen
    // this occurs when game host hits START on the game screen
    //var socket = io.connect('http://' + ip + ':' + port + '/');
    //var socket = io.connect('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});

    // host fired off goToPage broadcast.
    // this is the echo back and redirects all devices to game screen
    socket.on('goToPageBroadcast', function(data) {

      /*
      $scope.game_data = angular.fromJson(data);

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
          event_id: $scope.game_data.event_id
        }, {
          reload: true
        });
      });
      */

    })
    .once('jsonrows', function(data) {
      //$scope.player_data = angular.fromJson(data) || {};
      $scope.activity = angular.fromJson(data) || {};
      $scope.$apply(function () {
        $scope.target_online_count = getTargets($scope);
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
        // Display alerts
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
    $scope.msg = "Manage users";



  }
])

 

// TODO Home: Build Range -- FINALIZE WORK
.controller('buildRangeCtrl', ['$scope', 'getTargets', 'addAlert', '$stateParams', '$state', '$http', '$ionicHistory', '$window', '$sce', '$rootScope',
 
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, getTargets, addAlert, $stateParams, $state, $http, $ionicHistory, $window, $sce, $rootScope) {


  


    $scope.doRefresh = function () {
 
      $window.location.reload(); 
    };
    

    $scope.current_sequence = 0;

    // stable - light gray
    // positive - blue
    // assertive - red
    // balanced - green
    // energized -yellow
    // royal - purple
    $scope.showSequence2button = true;
    $scope.showSequence2 = false;
    $scope.showSequence3button = false;
    $scope.showSequence3 = false;
    $scope.showSequence4button = false;
    $scope.showSequence4 = false;
    $scope.showSequence5button = false;
    $scope.showSequence5 = false;
    $scope.showSequence6button = false;
    $scope.showSequence6 = false;

    // populate droplists
    $scope.when_selection = [
      {name: "Immediately", id: 0},
      {name: "After target 1 cleared", id: 'after', after_target: 0},
      {name: "After target 2 cleared", id: 'after', after_target: 1},
      {name: "After target 3 cleared", id: 'after', after_target: 2},
      {name: "After target 4 cleared", id: 'after', after_target: 3},
      {name: "After target 5 cleared", id: 'after', after_target: 4},
      {name: "After target 6 cleared", id: 'after', after_target: 5},
      {name: "After target 7 cleared", id: 'after', after_target: 6},
      {name: "After target 8 cleared", id: 'after', after_target: 7},
      {name: "After target 9 cleared", id: 'after', after_target: 8},
      {name: "After target 10 cleared", id: 'after', after_target: 9},

      {name: "in 100 ms", id: 100},
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

    $scope.timeout_selection = [
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
      {name: "in 5 sec", id: 5000},
      {name: "6 sec", id: 6000},
      {name: "7 sec", id: 7000},
      {name: "8 sec", id: 8000},
      {name: "9 sec", id: 9000},
      {name: "10 sec", id: 10000}
    ];
    // set defaults in droplists
    $scope.set_timeout = $scope.timeout_selection[15]; // set a default selection
    //$scope.set_when = $scope.when_selection[0]; // set a default selection
    $scope.set_when = [];
    for (var i=0;i<=10; i++){
      $scope.set_when[i] = $scope.when_selection[0];
    }
    // setup variables
    $scope.nextColor = 'button-balanced';
    $scope.display_drop = 'display_drop';
    $scope.color_to_store = "green";
    $scope.timeout = [false,false,false];

    var sequence = [];


    // pupulate sequence with target default states
    var target = [];

    target.push({ "target_num": 1, "color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 1
    target.push({ "target_num": 2,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 2
    target.push({ "target_num": 3,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 3
    target.push({ "target_num": 4,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 4
    target.push({ "target_num": 5,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 5
    target.push({ "target_num": 6,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 6
    target.push({ "target_num": 7,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 7
    target.push({ "target_num": 8,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 8
    target.push({ "target_num": 9,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 9
    target.push({ "target_num": 10,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 10

    var target2 = [];

    target2.push({ "target_num": 1,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 1
    target2.push({ "target_num": 2,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 2
    target2.push({ "target_num": 3,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 3
    target2.push({ "target_num": 4,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 4
    target2.push({ "target_num": 5,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 5
    target2.push({ "target_num": 6,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 6
    target2.push({ "target_num": 7,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 7
    target2.push({ "target_num": 8,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 8
    target2.push({ "target_num": 9,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 9
    target2.push({ "target_num": 10,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 10

    var target3 = [];

    target3.push({ "target_num": 1,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 1
    target3.push({ "target_num": 2,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 2
    target3.push({ "target_num": 3,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 3
    target3.push({ "target_num": 4,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 4
    target3.push({ "target_num": 5,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 5
    target3.push({ "target_num": 6,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 6
    target3.push({ "target_num": 7,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 7
    target3.push({ "target_num": 8,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 8
    target3.push({ "target_num": 9,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 9
    target3.push({ "target_num": 10,"color": "green", "active": false, "timeout": "0", "when": "0", "hit": false}); // target 10
    // sequence 1
    sequence.push(target);
    // sequence 2
    sequence.push(target2);
    // sequence 3
    sequence.push(target3);

    console.log(sequence);

    // updateTimeout reacts to the timeout droplist selection
    $scope.updateTimeout = function(set_timeout, sequence_num) {
      console.log("set_timeout val: ")
      console.log(set_timeout);
 
      $scope.set_timeout = set_timeout;
      sequence[sequence_num][0].timeout = set_timeout.id;
      sequence[sequence_num][1].timeout = set_timeout.id;
      sequence[sequence_num][2].timeout = set_timeout.id;
      sequence[sequence_num][3].timeout = set_timeout.id;
      sequence[sequence_num][4].timeout = set_timeout.id;
      sequence[sequence_num][5].timeout = set_timeout.id;
      sequence[sequence_num][6].timeout = set_timeout.id;
      sequence[sequence_num][7].timeout = set_timeout.id;
      sequence[sequence_num][8].timeout = set_timeout.id;
      sequence[sequence_num][9].timeout = set_timeout.id;
      $scope.activate_timeout();
 
    }

    

    // activate_timeout reacts to "activate with timetout" button
    $scope.activate_timeout_button = [];
    $scope.activate_timeout = function(sequence_num){
      console.log($scope.set_timeout.id);
      if ($scope.timeout[sequence_num])
      {
        $scope.activate_timeout_button[sequence_num] = 'button-stable';
        $scope.timeout[sequence_num] = 0;
   
      }
      else
      {
        $scope.activate_timeout_button[sequence_num] = 'button-balanced';
        $scope.timeout[sequence_num] = $scope.set_timeout.id;
      }
      
    }
    
    // updateWhen reacts to the when droplist selection
    $scope.updateWhen = function(set_when, sequence_num, target_num) {
      console.log("set_when val: ")
      console.log(set_when);
  console.log("set_when.id2" + set_when.id2)
      //$scope.set_when = set_when;
      sequence[sequence_num][target_num].when = set_when.id;
      sequence[sequence_num][target_num].after_target = set_when.after_target;
      console.log(sequence[sequence_num])
    
 
    }

    $scope.add_sequence = function (num) {

      if (num == 2)
      {
        $scope.showSequence2button = false;
        $scope.showSequence2 = true;
        $scope.showSequence3button = true;
      }
      if (num == 3)
      {
        $scope.showSequence3button = false;
        $scope.showSequence3 = true;
        $scope.showSequence4button = true;
      }
    }
    // 5 color buttons
    // changeColor function highlights the active button
    $scope.changeColor = function (color) {
      $scope.resetButtonSizes();
      $scope.nextColor = color;

      if (color == 'button-assertive'){
        $scope.red_button = 'active-small-button';
        $scope.color_to_store = "red";
      }
      if (color == 'button-energized'){
        $scope.yellow_button = 'active-small-button';
        $scope.color_to_store = "yellow";
      }
      if (color == 'button-balanced'){
        $scope.green_button = 'active-small-button';
        $scope.color_to_store = "green";
      } 
      if (color == 'button-positive'){
        $scope.blue_button = 'active-small-button';
        $scope.color_to_store = "blue";
      }
      if (color == 'button-royal'){
        $scope.purple_button = 'active-small-button';
        $scope.color_to_store = "purple";
      }
    
    }

    // helper function to reset active button to inactive
    $scope.resetButtonSizes = function() {
       $scope.red_button = 'inactive-small-button';
       $scope.yellow_button = 'inactive-small-button';
       $scope.green_button = 'inactive-small-button';
       $scope.blue_button = 'inactive-small-button';
       $scope.purple_button = 'inactive-small-button';
       $scope.nextColor = 'button-balanced';
       $color_to_store = "green";
    }

    $scope.target_color_arr = [];
    $scope.show_when = [];
    // activateTarget reacts to a target button being selected
    // updates the active state in the sequence object array
    $scope.activateTarget = function(target_number, sequence_num) {
      
      if (sequence[sequence_num][target_number].active == false)
      {
        //$scope.target_color1 = $scope.nextColor;
        $scope.target_color_arr[sequence_num + '' + target_number] = $scope.nextColor;
        $scope.show_when[sequence_num + '' + target_number] = 'display_drop';
        sequence[sequence_num][target_number].active = true;
        sequence[sequence_num][target_number].color = $scope.color_to_store;
        
        
      }
      else
      {
        //$scope.target_color1 = "button-stable";
        $scope.target_color_arr[sequence_num + '' + target_number] = "button-stable";
        sequence[sequence_num][target_number].active = false;
        $scope.show_when[sequence_num + '' + target_number] = '';
      }

      $scope.resetButtonSizes();
      console.log(sequence);
      console.log(sequence[0].when);


    }
    $scope.target_sim = [];
    $scope.target_sim[0] = "button-stable";
    var counter = 0;
    var counter2 = 0;
    // run simulation
    setInterval(function(){

/*
        
        console.log(counter2++);
        
        if (counter == 0)
          {
            //console.log( "0 is active and " +$scope.getSimColor(sequence[0][0].color) )
            $scope.target_sim1 = 'button-balanced';
            $scope.showTarg1 = true;
            counter++;
          }
          else
          {
            // set to grey
            //console.log("not active")
            $scope.target_sim1 = "button-stable";
            $scope.showTarg1 = false;
            counter=0;
          }
*/
          //console.log(counter);

/*
        for (var i = 0; i<=9; i++)
        {
          if (sequence[0][i].active)
          {
            console.log(i + " is active and " +$scope.getSimColor(sequence[0][i].color) )
            $scope.target_sim[i] = $scope.getSimColor(sequence[0][i].color);
            console.log($scope.target_sim[i]);
          }
          else
          {
            // set to grey
            $scope.target_sim[i] = "button-stable";
          }
        }*/

        //console.log(sequence[0][0].color + " " + sequence[0][0].active + " " + $scope.target_sim[0] );
      
    }, 500);


    $scope.getSimColor = function (color) {
 

      if (color == 'red'){
        return 'button-assertive';
      }
      if (color == 'yellow'){
        return 'button-energized';
      }
      if (color == 'green'){
        return 'button-balanced';
      } 
      if (color == 'blue'){
        return 'button-positive';
      }
      if (color == 'purple'){
        return 'button-royal';
      }
    
    }


    
    manager
        .socket('/namespace')
        .on('connect_error', function () {
          console.warn("Connection error!");
          $scope.$apply(function () {
        

            });
          })
        .on('connection', function () {
          $scope.$apply(function () {
            //$scope.base = '<span  class="ion-wifi"></span>' +
            //    '<h1 class="wrapme">Connected to basestation</h1>';
          });
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });


 
    socket
 
      .on('jsonrows', function (data) {
        $scope.thelist = '';
        $scope.activity = angular.fromJson(data) || {};

        if ($scope.activity.simulate != undefined)
        {

          //var sim_sequence = JSON.parse($scope.activity.simulate);
          var sim_sequence = $scope.activity.simulate;
          $scope.current_sequence = $scope.activity.current_sequence ;
          //console.log(sim_sequence);
          //console.log(sim_sequence[0].active);


          for (var i = 0; i<=9; i++)
          {
            if (sim_sequence[i].active && sim_sequence[i].hit == false)
            {
              //console.log(i + " is active and " +$scope.getSimColor(sim_sequence[i].color) )
              $scope.target_sim[i] = $scope.getSimColor(sim_sequence[i].color);
              //console.log($scope.target_sim[i]);
            }
            else
            {
              // set to grey
              $scope.target_sim[i] = "button-stable";
            }
          }
        



        }
        

        
        $scope.$apply(function () {

      
          
          
          
         
        });
      });


    $scope.hitTarget = function(target_num) {
      console.log("hit target " + target_num);
      console.log("current sequence " + $scope.current_sequence)
      console.log(sequence[$scope.current_sequence][target_num].target_num)
    
      

          $http({
                  cache: false,
                  method: 'GET',
                  url: 'http://'+ip+':'+port+'/?simulate_target_hit=yes&target_num=' + target_num +'&sequence='+ $scope.current_sequence + "&randomstring=" + Math.random().toString(36).substring(7) + "&interval=10&json_callback=JSON_CALLBACK&"  + new Date().getTime()
                }).
                success(function(data, status) {
                  console.log("drill info received");
          

                }).
                error(function(data, status) {
            
                  console.log( "  failed");
                });
    }

    $scope.saveDrill = function() {
      console.log("save drill");
    
      $http({method: 'GET', url: 'http://'+ip+':'+port+'/?savedrill=yes&drillinfo='+ JSON.stringify(sequence) + '&randomstring=' + Math.random().toString(36).substring(7) + '&callback=JSON_CALLBACK&'}).
          success(function(data, status) {   
            console.log("drill info received")     
          }).
          error(function(data, status) {
            console.log("save drill failed");
            console.log(data);
            console.log(status);
   
        }); 
    }

    // demo stuff  
    $scope.bluelights = function() {
        console.log("blue list requested");
 
       $http({method: 'GET', url: 'http://'+ip+':'+port+'/?activatelights=blue&randomstring=' + Math.random().toString(36).substring(7) + '&callback=JSON_CALLBACK&'}).
          success(function(data, status) {        
          }).
          error(function(data, status) {
            console.log("clear target list failed");
            console.log(data);
            console.log(status);
   
        }); 
    }

    $scope.cycle = function() {
        console.log("blue list requested");
 
       $http({method: 'GET', url: 'http://'+ip+':'+port+'/?activatelights=cycle&randomstring=' + Math.random().toString(36).substring(7) + '&callback=JSON_CALLBACK&'}).
          success(function(data, status) {        
          }).
          error(function(data, status) {
            console.log("clear target list failed");
            console.log(data);
            console.log(status);
   
        }); 
    }

    $scope.greenlights = function() {
        console.log("green list requested");
 
       $http({method: 'GET', url: 'http://'+ip+':'+port+'/?activatelights=green&randomstring=' + Math.random().toString(36).substring(7) + '&callback=JSON_CALLBACK&'}).
          success(function(data, status) {        
          }).
          error(function(data, status) {
            console.log("clear target list failed");
            console.log(data);
            console.log(status);
   
        }); 
    }


    $scope.redlights = function() {
        console.log("red list requested");
 
       $http({method: 'GET', url: 'http://'+ip+':'+port+'/?activatelights=red&randomstring=' + Math.random().toString(36).substring(7) + '&callback=JSON_CALLBACK&'}).
          success(function(data, status) {        
          }).
          error(function(data, status) {
            console.log("clear target list failed");
            console.log(data);
            console.log(status);
   
        }); 
    }



                /*
      switch(target_number) {
          case 1:
              console.log(sequence[0]);
              if (sequence[0][target_number].active == false)
              {
                //$scope.target_color1 = $scope.nextColor;
                $scope.target_color_arr[target_number] = $scope.nextColor;
                sequence[0][target_number].active = true;
                sequence[0][target_number].color = $scope.color_to_store;
              }
              else
              {
                //$scope.target_color1 = "button-stable";
                $scope.target_color_arr[1] = "button-stable";
                sequence[0][target_number].active = false;
              }
              $scope.resetButtonSizes();
              break;
          case 2:
       
              if (sequence[0][1].active == false)
              {
                $scope.target_color2 = $scope.nextColor;
                sequence[0][1].active = true;
                sequence[0][1].color = $scope.color_to_store;
              }
              else
              {
                $scope.target_color2 = "button-stable";
                sequence[0][1].active = false;
              }
              $scope.resetButtonSizes();
              break;

          case 3:
              if (sequence[0][2].active == false)
              {
                $scope.target_color3 = $scope.nextColor;
                sequence[0][2].active = true;
                sequence[0][2].color = $scope.color_to_store;
              }
              else
              {
                $scope.target_color3 = "button-stable";
                sequence[0][2].active = false;
              }
              $scope.resetButtonSizes();
              break;
          case 4:
              if (sequence[0][3].active == false)
              {
                $scope.target_color4 = $scope.nextColor;
                sequence[0][3].active = true;
                sequence[0][3].color = $scope.color_to_store;
              }
              else
              {
                $scope.target_color4 = "button-stable";
                sequence[0][3].active = false;
              }
              $scope.resetButtonSizes();
              break;
          case 5:
              if (sequence[0][4].active == false)
              {
                $scope.target_color5 = $scope.nextColor;
                sequence[0][4].active = true;
                sequence[0][4].color = $scope.color_to_store;
              }
              else
              {
                $scope.target_color5 = "button-stable";
                sequence[0][4].active = false;
              }
              $scope.resetButtonSizes();
              break;
          case 6:
              if (sequence[0][5].active == false)
              {
                $scope.target_color6 = $scope.nextColor;
                sequence[0][5].active = true;
                sequence[0][5].color = $scope.color_to_store;
              }
              else
              {
                $scope.target_color6 = "button-stable";
                sequence[0][5].active = false;
              }
              $scope.resetButtonSizes();
              break;
          case 7:
              if (sequence[0][6].active == false)
              {
                $scope.target_color7 = $scope.nextColor;
                sequence[0][6].active = true;
                sequence[0][6].color = $scope.color_to_store;
              }
              else
              {
                $scope.target_color7 = "button-stable";
                sequence[0][6].active = false;
              }
              $scope.resetButtonSizes();
              break;

          case 8:
              if (sequence[0][7].active == false)
              {
                $scope.target_color8 = $scope.nextColor;
                sequence[0][7].active = true;
                sequence[0][7].color = $scope.color_to_store;
              }
              else
              {
                $scope.target_color8 = "button-stable";
                sequence[0][7].active = false;
              }
              $scope.resetButtonSizes();
              break;
          case 9:
              if (sequence[0][8].active == false)
              {
                $scope.target_color9 = $scope.nextColor;
                sequence[0][8].active = true;
                sequence[0][8].color = $scope.color_to_store;
              }
              else
              {
                $scope.target_color9 = "button-stable";
                sequence[0][8].active = false;
              }
              $scope.resetButtonSizes();
              break;
          case 10:
              if (sequence[0][9].active == false)
              {
                $scope.target_color10 = $scope.nextColor;
                sequence[0][9].active = true;
                sequence[0][9].color = $scope.color_to_store;
              }
              else
              {
                $scope.target_color10 = "button-stable";
                sequence[0][9].active = false;
              }
              $scope.resetButtonSizes();
              break;

 
          default:
              break;


      }
      */


    // check if there is a command to redirect player's screen to the game screen
    // this occurs when game host hits START on the game screen
    //var socket = io.connect('http://' + ip + ':' + port + '/');
    //var socket = io.connect('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});
    /*
    // host fired off goToPage broadcast.
    // this is the echo back and redirects all devices to game screen
    socket.on('goToPageBroadcast', function(data) {

      $scope.game_data = angular.fromJson(data);

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
          event_id: $scope.game_data.event_id
        }, {
          reload: true
        });
      });

    });
    */

  }
])

.controller('downloadCtrl', ['$scope', '$stateParams', 
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams) {
  }
])

.controller('home2Ctrl', ['$scope', '$stateParams', '$ionicHistory',
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, $ionicHistory) {

    // check if there is a command to redirect player's screen to the game screen
    // this occurs when game host hits START on the game screen
    //var socket = io.connect('http://' + ip + ':' + port + '/');
    //var socket = io.connect('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});
    // host fired off goToPage broadcast.
    // this is the echo back and redirects all devices to game screen
    /*
    socket.on('goToPageBroadcast', function(data) {

      $scope.game_data = angular.fromJson(data);
      $scope.target_online_count = getTargets($scope);
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
          event_id: $scope.game_data.event_id
        }, {
          reload: true
        });
      });

    });
    */


  }
])

.controller('diagnosticsCtrl', ['$scope', 'getTargets', 'addAlert', '$stateParams', '$state', '$http', '$location', '$window',
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, getTargets, addAlert, $stateParams, $state, $http, $location, $window) {


    // tap/ swipe to go back functionality
    $scope.swipe = $scope.goBack = function() {
      $location.path( '/home/welcome' );
    };
      $scope.doRefresh = function () {
   
      $window.location.reload(); 
    };


    //var socket = io.connect('http://' + ip + ':' + port + '/');
    //var socket = io.connect('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});
    socket.once('jsonrows', function(data) {
      $scope.activity = angular.fromJson(data);
      $scope.$apply(function() {
        console.warn('scope: ',$scope);
        $scope.target_online_count = getTargets($scope).length;
        $scope.items = $scope.activity.target;
        $scope.targets = $scope.activity.target;

        for (var key in $scope.targets) {
          $scope.targets[key].online_msg = "Offline";
          $scope.targets[key].volt_percent = 0;
          $scope.targets[key].battery_icon = 'icon ion-battery-empty';
          if ($scope.targets[key].online) {
            if ($scope.targets[key].volt === undefined) {
              $scope.targets[key].volt_percent = "please wait...";
              console.log('Battery: ', $scope.targets[key]);
            } else {
              // voltage circuit is narrow. If volts drop below 14.3 volts, as adc drops below 0, it flips to
              // +2000 adc.
              // battery range is between 0 and 650 units
              // or 14.3v to 16.3 volts
              var adc = $scope.targets[key].volt;
              if (adc > 1500)
                adc = 1;
              // adc / full adc swing
              // 16.8v tops at around 740 adc units
              var volt_percent = Math.floor(((adc) / 700) * 100);
              // floor + converted voltage
              var voltage = 14 + (2.2 * (volt_percent / 100));
              //console.log(  Math.floor((($scope.targets[key].volt - 460)/140)*100));
              /// adc: ' + $scope.targets[key].volt + '
              $scope.targets[key].volt_percent = volt_percent + '%  / ' + voltage.toFixed(2) + 'v';
              if (volt_percent > 5)
                $scope.targets[key].battery_icon = 'icon ion-battery-low';
              if (volt_percent > 50)
                $scope.targets[key].battery_icon = 'icon ion-battery-half';
              if (volt_percent > 85)
                $scope.targets[key].battery_icon = 'icon ion-battery-full';
            }
            $scope.targets[key].online_msg = "Online";

            console.log('Battery: ',$scope.targets[key].volt_percent);
            //console.log($scope.targets[key].id + ' ' + $scope.targets[key].online + ' ' + $scope.targets[key].volt_percent);
          }
          else {
            // target is offline - splice from array
            delete $scope.targets[key];
          }
        }
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
        // Display alerts
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


    $scope.pingTarget = function($id) {
      console.log("pinging target: " + $id);

      $http({
        method: 'GET',
        url: "http://" + ip + ":" + port + "/?get=ping&target=" + $id
      }).
      success(function(data, status) {

        console.log("request sent.");

      }).
      error(function(data, status) {
        console.log("failed to communicate to base station");

      });

    }

  }
])

.controller('targetInfoCtrl', ['$scope', '$stateParams', 
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams) {


  }
])


.controller('notificationsCtrl', ['$scope', 'getTargets', 'addAlert', 'removeAlert', 'openSocketService', '$stateParams', '$http', '$state', '$location', '$templateCache', '$rootScope', '$ionicHistory',
  function($scope, getTargets, addAlert, removeAlert, openSocketService, $stateParams, $http, $state, $location, $templateCache, $rootScope, $ionicHistory,  $window) {
  //navigate
  $scope.go = function(path) {
    $location.path( path );
  };

  //back button /swipe
    $scope.swipe = $scope.goBack = function() {
      $location.path( 'home.welcome' );
 
    };
      $scope.doRefresh = function () {
   
      $window.location.reload(); 
    };
 
  // Assume no base station, show message
  if(!$scope.show_notice_count){
    $scope.base_msg_data = addAlert($scope, "No basestation found - use AA WiFi");
  }
  // setup sockets
  //var socket = io.connect('http://' + ip + ':' + port + '/');
  //var socket = io.connect('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});
  if(socket) {

    socket.once('jsonrows', function (data) {
      $scope.activity = angular.fromJson(data);
      $scope.$apply(function () {
        if($scope.show_notice_count){
          $scope.base_msg_data = removeAlert($scope, "No basestation found - use AA WiFi");
        }
        $scope.target_online_count = getTargets($scope);
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
        if ($scope.target_online_count == 0) {
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
  }
}])

.controller('loginCtrl', ['$scope', '$stateParams', 
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams) {


  }
])

.controller('termsCtrl', ['$scope', 'getTargets', 'addAlert', '$stateParams', '$http', '$location',
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, getTargets, addAlert, $stateParams, $http, $location) {

    //back button /swipe
    $scope.swipe = $scope.goBack = function() {
      $location.path( '/home/welcome' );
    };

    // setup sockets
    //var socket = io.connect('http://' + ip + ':' + port + '/');
    //var socket = io.connect('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});
    socket.once('jsonrows', function(data) {
      $scope.activity = angular.fromJson(data);
      $scope.target_online_count = getTargets($scope);
      //console.log($scope.activity);
      $scope.$apply(function() {
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
          $scope.terms_value = false;
        }else{
          $scope.terms_value = true;
        }

      });
    });

    $scope.$on('$destroy', function(event) {
      socket.removeAllListeners();
    });

    $scope.toggle_terms = function(terms_value) {
      console.log("Terms & conditions: " + terms_value);
      $scope.terms_value = terms_value;

      $http({
        method: 'GET',
        url: 'http://' + ip + ':' + port + '/?update=terms_conditions&term_value=' + $scope.terms_value + '&callback=JSON_CALLBACK&'
      }).
      success(function(data, status) {
        //console.log(status);
        console.log("update terms sent");


      }).
      error(function(data, status) {
        console.log("update terms request failed");
      });
    }

  }
])

.controller('safetyCtrl', ['$scope', 'getTargets', 'addAlert', '$stateParams', '$location',
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, getTargets, addAlert, $stateParams, $location) {
    // tap/ swipe to go back functionality
    $scope.swipe = $scope.goBack = function() {
      $location.path( '/home/welcome' );
    };


    // setup sockets
    //var socket = io.connect('http://' + ip + ':' + port + '/');
    //var socket = io.connect('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});
    socket.once('jsonrows', function(data) {
      $scope.activity = angular.fromJson(data);
      //console.log($scope.activity);
      $scope.$apply(function() {
        $scope.target_online_count = getTargets($scope);
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
  }
])

.controller('versionCtrl', ['$scope', 'getTargets', 'addAlert', '$stateParams', '$location', '$sce', '$http', 
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, getTargets, addAlert, $stateParams, $location, $sce, $http) {
    // tap/ swipe to go back functionality
    $scope.swipe = $scope.goBack = function() {
      $location.path( '/home/welcome' );
    };
    $scope.current_version = "";
    $scope.basestation_version_description = "";

    




     $http({
        method: 'GET',
        url: "http://" + ip + ":" + port + "/?page=basestation_version&json_callback=JSON_CALLBACK"
      }).
      success(function(data, status) {
            $scope.version = angular.fromJson(data);
            //console.log($scope.version);

            // display current version
            $scope.current_version = $scope.version[0];

            // list out version history
            for (var i = 0; i < $scope.version.length; i++) {

              if (i%2 == 0)
                $scope.basestation_version_description = $scope.basestation_version_description + "<strong>Version " + $scope.version[i] + "</strong><br/>";
              else
                $scope.basestation_version_description = $scope.basestation_version_description + $scope.version[i] + "<br/><br/>";

            }

      }).
      error(function(data, status) {
        console.log("Connect to basestation to view version information");
      });



    // setup sockets
    //var socket = io.connect('http://' + ip + ':' + port + '/');
    //var socket = io.connect('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});


    socket.on('jsonrows', function(data) {
      $scope.activity = angular.fromJson(data);
      //console.log($scope.activity.version);
 
      //$scope.basestation_version = $scope.activity.version;
      //$scope.basestation_version_description = $scope.activity.version_description;
      //$scope.basestation_version_description = $sce.trustAsHtml($scope.basestation_version_description);

      $scope.$apply(function() {
        $scope.target_online_count = getTargets($scope);
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
  }
])




.controller('helpCtrl', ['$scope', 'getTargets', 'addAlert', '$stateParams', '$location',
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, getTargets, addAlert, $stateParams, $location) {

    $scope.shownGroup = null;

    // tap/ swipe to go back functionality
    $scope.swipe = $scope.goBack = function() {
      $location.path( '/home/welcome' );
    };

    // setup sockets
    //var socket = io.connect('http://' + ip + ':' + port + '/');
    //var socket = io.connect('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});
    socket.once('jsonrows', function(data) {
      $scope.activity = angular.fromJson(data);
      $scope.$apply(function() {
        $scope.target_online_count = getTargets($scope);
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

     /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = function(group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
    };
    $scope.isGroupShown = function(group) {
      return $scope.shownGroup === group;
    };

  }


]);
