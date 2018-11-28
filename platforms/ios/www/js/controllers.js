angular.module('app.controllers', [])
  
.controller('gamesDrillsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('scoresCtrl', ['$scope', '$stateParams', '$state', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $http) {
 
	// **** setup vars ******
  $scope.avg_split = 0;
  $scope.avg_split_p2 = 0;
  $scope.avg_response = 0;
  $scope.avg_response_p2 = 0;	
	var socket = io.connect('http://'+ip+':'+port+'/');
  $scope.base_msg_window = false;
  $scope.fastest_split = 100;
  $scope.fastest_split_p2 = 100;
  $scope.fastest_response = 100000;
  $scope.fastest_response_p2 = 100000;
  $scope.fastest_player;
 
  $scope.show_prevgames = false;
  $scope.show_currgame = true;
  $scope.show_avg_split = false;
  $scope.show_best_split = false;
  $scope.show_all_splits = false;
  $scope.show_avg_response = true;
  $scope.show_most_hits = false;
   $scope.showBestTimes = false;
   $scope.completed_game_time = 0;
  var stats = {};
  stats = [];
	// END **** setup vars ******

  var manager = io.Manager('http://'+ip+':'+port+'/', { /* options */ });
  manager.socket('/namespace');
  manager.on('connect_error', function() {
     $scope.$apply(function () {
       // setTimeout(function() {
          $scope.base_msg_data = "Not connected to base station";
          $scope.base_msg_window = true;
       // },1000);
     });
  });

    // setup sockets
  var socket = io.connect('http://'+ip+':'+port+'/');
 
   socket.on('jsonrows', function(data){
       $scope.activity = angular.fromJson(data);
       //console.log($scope.activity);
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
        }

        if ($scope.activity.repeaters == 0)
        {
          $scope.base_msg_data = "No repeaters found";
          $scope.base_msg_window = true;
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
    $scope.show_past_game = function(game_id){
     
      $scope.fastest_response = 100000;
        // get results
  $http({method: 'GET', url: "http://"+ip+":"+port+"/?page=last_game_results&gameid="+ game_id +"&json_callback=JSON_CALLBACK"}).
      success(function(data, status) {
       

        $scope.result_data_arr = angular.fromJson(data);
        $scope.result_data_last_round = $scope.result_data_arr[1];
        $scope.result_data = $scope.result_data_arr[0];
        $scope.match_type = $scope.result_data_arr[0][0].match_type;
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

        // gather multiplayer names
        $scope.matchtype =  $scope.result_data_arr[0][0].player_name;

        if ($scope.match_type == "1 vs 1")
        {
          // for multiplayer - get counters and player names
          $scope.player1_incrementer = 0;
          $scope.player2_incrementer = 0;
          $scope.player1 = $scope.result_data_arr[0][0].player_name;
          
          // get player2 name
          for (var i=0; i<$scope.result_data.length; i++)
          { 
             if ($scope.player1 != $scope.result_data[i].player_name){
              $scope.player2 = $scope.result_data[i].player_name;
              break;
            }
          }
          // display names on client 
          $scope.matchtype =   " " + $scope.player1 + ' vs ' + $scope.player2;
          $scope.player_column = true;
          $scope.show_most_hits = true;
        }
        
        console.log($scope.result_data);
 
        // package up hit detail log into stats[] array and do summary data math
        for (var i=0; i<$scope.result_data.length; i++)
        {
            

            // gather stats
            if ($scope.result_data[i].shot_time > 1)
            {
              // for detail hit log
              $scope.stats[i].time_till_hit = $scope.result_data[i].shot_time;
              
 
              // count up average hit responses
              $scope.avg_response += parseFloat($scope.stats[i].time_till_hit);
            }
            else
            {
              $scope.stats[i].time_till_hit = "miss";

            }
           
            // fastest response
             if($scope.result_data[i].shot_time < $scope.fastest_response && $scope.result_data[i].shot_time !== null)
            {
              
              $scope.fastest_response = $scope.result_data[i].shot_time ;
              if ($scope.match_type == "1 vs 1")
              {

                console.log("***********");
                console.log($scope.result_data[i].shot_time);
                console.log($scope.stats[i].player_name);
                console.log("***********");
                $scope.fastest_player = $scope.stats[i].player_name;

                $scope.show_avg_response = false;
              }
              else
              {
                  $scope.fastest_player = $scope.result_data[i].player_name;
              }
              console.log($scope.result_data);
            }
            $scope.showBestTimes = true;
            // highest wave
            if ( $scope.result_data[i].wave > $scope.highest_wave)
            {
              $scope.highest_wave =  $scope.result_data[i].wave ;
              $scope.shot_or_group_time = "Highest wave: ";
            }
            console.log("highest wave: " +$scope.highest_wave );


             

            // charting
            if ($scope.result_data[i].target_hit == 1)
            {
              if ($scope.match_type == "1 vs 1")
              { 

                if ($scope.stats[i].player_name == $scope.player1)
                {
                  $scope.shot_time_arr[$scope.player1_incrementer] = msToTime($scope.stats[i].time_till_hit);
                  $scope.shot_cnt_arr[$scope.player1_incrementer] = 'Shot '+ $scope.shot_cnt_incrementer++;
                  $scope.player1_incrementer++;

                }
                else if ($scope.stats[i].player_name == $scope.player2)
                { 
                  
                    $scope.shot_time_arr_p2[$scope.player2_incrementer] = msToTime($scope.stats[i].time_till_hit);
                    $scope.shot_cnt_arr_p2[$scope.player2_incrementer] = 'Shot '+ $scope.shot_cnt_incrementer_p2++;
                    $scope.player2_incrementer++;

                }
                

              }
              else
              {
                $scope.shot_time_arr[i] = msToTime(parseFloat($scope.stats[i].time_till_hit));
                $scope.shot_cnt_arr[i] = 'Shot '+ $scope.shot_cnt_incrementer++;    
              } 
            }

 
            

            $scope.stats[i].target_hit_time = msToTime($scope.result_data[i].target_hit_time);
            
            $scope.stats[i].split_time = msToTime($scope.result_data[i].target_split_time);

            // count up average splits
            $scope.avg_split += parseFloat(msToTime($scope.result_data[i].target_split_time));

            // display most hits
            if ($scope.match_type == "1 vs 1")
            {
              if($scope.player1_incrementer > $scope.player2_incrementer)
              {
                $scope.most_hits = $scope.player1_incrementer + ' -' +$scope.player1;
              }
              else
              {
                $scope.most_hits = $scope.player2_incrementer + ' -' + $scope.player2;
              }
              // if both players hit the same number of hits, hide
              if ($scope.player2_incrementer == $scope.player1_incrementer)
                $scope.show_most_hits = false;
            }
            // fastest split
            if ($scope.match_type == "1 vs 1")
            { 
              if ($scope.stats[i].split_time < $scope.fastest_split)
                $scope.fastest_split = $scope.stats[i].split_time + ' - ' + $scope.stats[i].player_name;
            }
            else
            { 
              if ($scope.stats[i].split_time > 0)
                $scope.fastest_split = $scope.stats[i].split_time;
              else
                {
                  $scope.stats[i].split_time = "-";
                  //$scope.stats[i].target_hit_time  = "-";
                }
            }
            console.log($scope.stats[i]);
        

            
            $scope.stats[i].target_presented = $scope.result_data[i].target_presented;

            $scope.stats[i].player_name = $scope.result_data[i].player_name;
            
            // hits vs serves
            if ($scope.match_type == "1 vs 1")
            { 
              if ($scope.stats[i].player_name == $scope.player1)
              {
                // count serves vs hits
                $scope.paddles_served++;
                if ($scope.result_data[i].target_hit == 1)
                  $scope.paddles_hit++;
              }
              else if ($scope.stats[i].player_name == $scope.player2)
              {
                 $scope.paddles_served_p2++;
                if ($scope.result_data[i].target_hit == 1)
                  $scope.paddles_hit_p2++;
              }
              

            }
            else
            {
              // count serves vs hits
              $scope.paddles_served++;
              if ($scope.result_data[i].target_hit == 1)
                $scope.paddles_hit++;  
            } 
            


            // just get last hit to calculate completion time in game
            if ($scope.result_data[i].target_hit_time > $scope.completed_game_time)
            {
              console.log("completed in " + $scope.result_data[i].target_hit_time);
              $scope.completed_game_time = $scope.result_data[i].target_hit_time; // msToTime($scope.result_data[i].target_hit_time*100);
            }
            // not working
            $scope.average_hit_time =  $scope.stats[i].time_till_hit;
            $scope.gamename = $scope.result_data[i].game_name;

            

        }
        // format the milliseconds to time format
        for (var i=0; i<$scope.stats.length; i++)
        {
          if ($scope.stats[i].time_till_hit != "miss")
            $scope.stats[i].time_till_hit = msToTime($scope.stats[i].time_till_hit);
        }
        $scope.fastest_response = msToTime($scope.fastest_response);

        // done formatting milliseconds to time format

          // if current game was not 1v1, then show previous game shot time results in 
          // chart for comparison of current game
 
          console.log($scope.result_data_last_round);
 
          for (var i=0; i<$scope.result_data_last_round.length; i++)
          {

            $scope.player_name_last_round = $scope.stats_last_round[i].player_name;
            if ($scope.stats_last_round[i].target_hit_time > 1)
              $scope.stats_last_round[i].time_till_hit = msToTimeShort(($scope.stats_last_round[i].shot_time));
            else  
              $scope.stats_last_round[i].time_till_hit = 0;
              console.log($scope.stats_last_round[i].time_till_hit);
            // charting
            $scope.shot_time_arr_last_round[i] = parseFloat($scope.stats_last_round[i].time_till_hit);    
 
          }   

          // calculate split times
          if ($scope.match_type == "1 vs 1")
          {
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
  
          }
          else
          {
            $scope.avg_split = ($scope.avg_split / $scope.paddles_hit).toFixed(2);
            if ($scope.avg_split > 0)
              $scope.show_avg_split = true;
            if ($scope.fastest_split > 0)
              $scope.show_best_split = true;
            if ($scope.best_split > 0)
              $scope.show_all_splits = true;
          }

 
          // calculate average response
          if ($scope.paddles_hit > 0)
            $scope.avg_response = msToTime(($scope.avg_response / $scope.paddles_hit).toFixed(0));

          
        

          $scope.hits_vs_serves = Math.round(($scope.paddles_hit / $scope.paddles_served)*100) ;
          
 
          // chart data
          if ($scope.match_type == "1 vs 1")
          {
            $scope.series = [$scope.player1, $scope.player2];

            $scope.data = [
              $scope.shot_time_arr
              , $scope.shot_time_arr_p2
            ]; 

          }
          else
          {
            $scope.series = ['Current - ' + $scope.matchtype, 'Previous game - ' + $scope.player_name_last_round];

            $scope.data = [
              $scope.shot_time_arr
              , $scope.shot_time_arr_last_round
            ];  
 
          } 
          $scope.labels = $scope.shot_cnt_arr; 
          if ($scope.fastest_response == 100000)
            $scope.fastest_response = 0;

          if ($scope.gamename == "Subsecond")
          {
            //post best group time instead of best shot time
            $scope.shot_or_group_time = "Best group time ";

          }
          else if ($scope.gamename == "Swarm")
          {
            $scope.shot_or_group_time = "Highest wave ";
            $scope.fastest_response = " " + $scope.highest_wave + " " ;
          }
          else
          {
            $scope.shot_or_group_time = "Best shot time ";
          }
          
      }).
      error(function(data, status) {
        console.log("Get score results failed");
    });



      ////END

    }
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  // chart setup data
  $scope.colors = ['#FF3100', '#1300D7', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' } ];
  $scope.options = {
    legend: {display: true},
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Time in seconds'
          },
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
          labelString: 'Time in seconds'
        } 
        
      ]
    }
  };
 
//result_data_last_round







        // get results
  $http({method: 'GET', url: "http://"+ip+":"+port+"/?page=last_game_results&json_callback=JSON_CALLBACK"}).
      success(function(data, status) {
        
       
        $scope.result_data_arr = angular.fromJson(data);
        $scope.result_data_last_round = $scope.result_data_arr[1];
        $scope.result_data = $scope.result_data_arr[0];
        $scope.match_type = $scope.result_data_arr[0][0].match_type;
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

        // gather multiplayer names
        $scope.matchtype =  $scope.result_data_arr[0][0].player_name;

        if ($scope.match_type == "1 vs 1")
        {
          // for multiplayer - get counters and player names
          $scope.player1_incrementer = 0;
          $scope.player2_incrementer = 0;
          $scope.player1 = $scope.result_data_arr[0][0].player_name;
          
          // get player2 name
          for (var i=0; i<$scope.result_data.length; i++)
          { 
             if ($scope.player1 != $scope.result_data[i].player_name){
              $scope.player2 = $scope.result_data[i].player_name;
              break;
            }
          }
          // display names on client 
          $scope.matchtype =   " " + $scope.player1 + ' vs ' + $scope.player2;
          $scope.player_column = true;
          $scope.show_most_hits = true;
        }
        
        console.log($scope.result_data);
 
        // package up hit detail log into stats[] array and do summary data math
        for (var i=0; i<$scope.result_data.length; i++)
        {
            

            // gather stats
            if ($scope.result_data[i].shot_time > 1)
            {
              // for detail hit log
              $scope.stats[i].time_till_hit = $scope.result_data[i].shot_time;
              
 
              // count up average hit responses
              $scope.avg_response += parseFloat($scope.stats[i].time_till_hit);
            }
            else
            {
              $scope.stats[i].time_till_hit = "miss";

            }
           
            // fastest response
             if($scope.result_data[i].shot_time < $scope.fastest_response && $scope.result_data[i].shot_time !== null)
            {
              
              $scope.fastest_response = $scope.result_data[i].shot_time ;
              if ($scope.match_type == "1 vs 1")
              {

                console.log("***********");
                console.log($scope.result_data[i].shot_time);
                console.log($scope.stats[i].player_name);
                console.log("***********");
                $scope.fastest_player = $scope.stats[i].player_name;

                $scope.show_avg_response = false;
              }
              else
              {
                  $scope.fastest_player = $scope.result_data[i].player_name;
              }
              console.log($scope.result_data);
            }
            $scope.showBestTimes = true;
            // highest wave
            if ( $scope.result_data[i].wave > $scope.highest_wave)
            {
              $scope.highest_wave =  $scope.result_data[i].wave ;
              $scope.shot_or_group_time = "Highest wave: ";
            }
            console.log("highest wave: " +$scope.highest_wave );


             

            // charting
            if ($scope.result_data[i].target_hit == 1)
            {
              if ($scope.match_type == "1 vs 1")
              { 

                if ($scope.stats[i].player_name == $scope.player1)
                {
                  $scope.shot_time_arr[$scope.player1_incrementer] = msToTime($scope.stats[i].time_till_hit);
                  $scope.shot_cnt_arr[$scope.player1_incrementer] = 'Shot '+ $scope.shot_cnt_incrementer++;
                  $scope.player1_incrementer++;

                }
                else if ($scope.stats[i].player_name == $scope.player2)
                { 
                  
                    $scope.shot_time_arr_p2[$scope.player2_incrementer] = msToTime($scope.stats[i].time_till_hit);
                    $scope.shot_cnt_arr_p2[$scope.player2_incrementer] = 'Shot '+ $scope.shot_cnt_incrementer_p2++;
                    $scope.player2_incrementer++;

                }
                

              }
              else
              {
                $scope.shot_time_arr[i] = msToTime(parseFloat($scope.stats[i].time_till_hit));
                $scope.shot_cnt_arr[i] = 'Shot '+ $scope.shot_cnt_incrementer++;    
              } 
            }

 
            

            $scope.stats[i].target_hit_time = msToTime($scope.result_data[i].target_hit_time);
            
            $scope.stats[i].split_time = msToTime($scope.result_data[i].target_split_time);

            // count up average splits
            $scope.avg_split += parseFloat(msToTime($scope.result_data[i].target_split_time));

            // display most hits
            if ($scope.match_type == "1 vs 1")
            {
              if($scope.player1_incrementer > $scope.player2_incrementer)
              {
                $scope.most_hits = $scope.player1_incrementer + ' -' +$scope.player1;
              }
              else
              {
                $scope.most_hits = $scope.player2_incrementer + ' -' + $scope.player2;
              }
              // if both players hit the same number of hits, hide
              if ($scope.player2_incrementer == $scope.player1_incrementer)
                $scope.show_most_hits = false;
            }
            // fastest split
            if ($scope.match_type == "1 vs 1")
            { 
              if ($scope.stats[i].split_time < $scope.fastest_split)
                $scope.fastest_split = $scope.stats[i].split_time + ' - ' + $scope.stats[i].player_name;
            }
            else
            { 
              if ($scope.stats[i].split_time > 0)
                $scope.fastest_split = $scope.stats[i].split_time;
              else
                {
                  $scope.stats[i].split_time = "-";
                  //$scope.stats[i].target_hit_time  = "-";
                }
            }
            console.log($scope.stats[i]);
        

            
            $scope.stats[i].target_presented = $scope.result_data[i].target_presented;

            $scope.stats[i].player_name = $scope.result_data[i].player_name;
            
            // hits vs serves
            if ($scope.match_type == "1 vs 1")
            { 
              if ($scope.stats[i].player_name == $scope.player1)
              {
                // count serves vs hits
                $scope.paddles_served++;
                if ($scope.result_data[i].target_hit == 1)
                  $scope.paddles_hit++;
              }
              else if ($scope.stats[i].player_name == $scope.player2)
              {
                 $scope.paddles_served_p2++;
                if ($scope.result_data[i].target_hit == 1)
                  $scope.paddles_hit_p2++;
              }
              

            }
            else
            {
              // count serves vs hits
              $scope.paddles_served++;
              if ($scope.result_data[i].target_hit == 1)
                $scope.paddles_hit++;  
            } 
            


            // just get last hit to calculate completion time in game
            if ($scope.result_data[i].target_hit_time > $scope.completed_game_time)
            {
              console.log("completed in " + $scope.result_data[i].target_hit_time);
              $scope.completed_game_time = $scope.result_data[i].target_hit_time; // msToTime($scope.result_data[i].target_hit_time*100);
            }
            // not working
            $scope.average_hit_time =  $scope.stats[i].time_till_hit;
            $scope.gamename = $scope.result_data[i].game_name;

            

        }
        // format the milliseconds to time format
        for (var i=0; i<$scope.stats.length; i++)
        {
          if ($scope.stats[i].time_till_hit != "miss")
            $scope.stats[i].time_till_hit = msToTime($scope.stats[i].time_till_hit);
        }
        $scope.fastest_response = msToTime($scope.fastest_response);

        // done formatting milliseconds to time format

          // if current game was not 1v1, then show previous game shot time results in 
          // chart for comparison of current game
 
          console.log($scope.result_data_last_round);
 
          for (var i=0; i<$scope.result_data_last_round.length; i++)
          {

            $scope.player_name_last_round = $scope.stats_last_round[i].player_name;
            if ($scope.stats_last_round[i].target_hit_time > 1)
              $scope.stats_last_round[i].time_till_hit = msToTimeShort(($scope.stats_last_round[i].shot_time));
            else  
              $scope.stats_last_round[i].time_till_hit = 0;
              console.log($scope.stats_last_round[i].time_till_hit);
            // charting
            $scope.shot_time_arr_last_round[i] = parseFloat($scope.stats_last_round[i].time_till_hit);    
 
          }   

          // calculate split times
          if ($scope.match_type == "1 vs 1")
          {
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
  
          }
          else
          {
            $scope.avg_split = ($scope.avg_split / $scope.paddles_hit).toFixed(2);
            if ($scope.avg_split > 0)
              $scope.show_avg_split = true;
            if ($scope.fastest_split > 0)
              $scope.show_best_split = true;
            if ($scope.best_split > 0)
              $scope.show_all_splits = true;
          }

 
          // calculate average response
          if ($scope.paddles_hit > 0)
            $scope.avg_response = msToTime(($scope.avg_response / $scope.paddles_hit).toFixed(0));

          
        

          $scope.hits_vs_serves = Math.round(($scope.paddles_hit / $scope.paddles_served)*100) ;
          
 
          // chart data
          if ($scope.match_type == "1 vs 1")
          {
            $scope.series = [$scope.player1, $scope.player2];

            $scope.data = [
              $scope.shot_time_arr
              , $scope.shot_time_arr_p2
            ]; 

          }
          else
          {
            $scope.series = ['Current - ' + $scope.matchtype, 'Previous game - ' + $scope.player_name_last_round];

            $scope.data = [
              $scope.shot_time_arr
              , $scope.shot_time_arr_last_round
            ];  
 
          } 
          $scope.labels = $scope.shot_cnt_arr; 
          if ($scope.fastest_response == 100000)
            $scope.fastest_response = 0;

          if ($scope.gamename == "Subsecond")
          {
            //post best group time instead of best shot time
            $scope.shot_or_group_time = "Best group time ";

          }
          else if ($scope.gamename == "Swarm")
          {
            $scope.shot_or_group_time = "Highest wave ";
            $scope.fastest_response = " " + $scope.highest_wave + " " ;
          }
          else
          {
            $scope.shot_or_group_time = "Best shot time ";
          }
          
      }).
      error(function(data, status) {
        console.log("Get score results failed");
    });



	$http({method: 'GET', url: "http://"+ip+":"+port+"/?page=past_game_results&json_callback=JSON_CALLBACK"}).
	    success(function(data, status) {
	      
	      $scope.result_data = angular.fromJson(data);
	      //console.log($scope.result_data);
	      $scope.items = $scope.result_data;

	      $scope.items.total_game_time = $scope.result_data.total_game_time;
 
	      for (var i=0; i<$scope.result_data.length; i++)
          {

          	// console.log($scope.result_data[i].game_id);
          	// console.log($scope.result_data[i].game_name);
          	// console.log($scope.result_data[i].total_game_time);
          	// console.log($scope.result_data[i].targets_hit);
            //console.log("Avg hit response: " + msToTime($scope.result_data[i].avg_hit_response/10));
            $scope.result_data[i].avg_hit_response = msToTime($scope.result_data[i].avg_hit_response);
            $scope.result_data[i].fastest_hit_response = msToTime($scope.result_data[i].fastest_hit_response);
            
            if ($scope.result_data[i].date > 0)
            {
              var utcSeconds = parseInt($scope.result_data[i].date);
           
              $scope.result_data[i].date_formatted = timeConverter(utcSeconds);
               
            }
   
          } 


          function timeConverter(UNIX_timestamp){
            var a = new Date(UNIX_timestamp );
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
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

	socket.on('goToPageBroadcast', function(data){

	    $scope.game_data = angular.fromJson(data);

      $ionicHistory.clearCache().then(function(){
      $state.go('game', {gameid: $scope.game_data.gamename, maxtime: $scope.game_data.maxtime, 
        max_targets: $scope.game_data.max_targets, time_between_waves: $scope.game_data.time_between_waves,
        paddle_sequence: $scope.game_data.paddle_sequence,targets_per_station: $scope.target_per_station, speed: $scope.game_data.speed, 
        double_tap: $scope.game_data.double_tap, capture_and_hold: $scope.game_data.capture_and_hold, target_timeout: $scope.game_data.target_timeout,
        matchtype: $scope.matchtype, scorelimit: $scope.scorelimit,
        player_list: $scope.game_data.player_list }, {reload: true});
      });

	});


}])
   

.controller('realTimeStatsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('settingsCtrl', ['$scope', '$stateParams', '$state', '$http',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $http) {

 

  // setup sockets
  var socket = io.connect('http://'+ip+':'+port+'/');
 
   socket.on('jsonrows', function(data){
       $scope.activity = angular.fromJson(data);
       
       $scope.$apply(function () {

       $scope.brightness_level_from_base = $scope.activity.led_brightness;
 
        if ($scope.activity.idle_blink == "true")
          $scope.idle_blink = true;
        else
          $scope.idle_blink = false;
        

      



       $scope.rangeValue = parseInt($scope.brightness_level_from_base,10);
       $scope.updatedValue = parseInt($scope.brightness_level_from_base,10);
  
       console.log($scope.activity.idle_blink);
     });
   });

   $scope.$on('$destroy', function (event) {
    socket.removeAllListeners();
   });


  $scope.drag = function(value) {
      $scope.updatedValue = value;
      
       $http({method: 'GET', url: 'http://'+ip+':'+port+'/?update=brightness&level=' + $scope.updatedValue + '&callback=JSON_CALLBACK&'}).
          success(function(data, status) {
            //console.log(status); 
            console.log("update brightness sent");
      
 
          }).
          error(function(data, status) {
            console.log("update brightness request failed");
       
        }); 

  };

  $scope.toggle_idle_blink = function(idle_blink) {
    console.log("Terms & conditions: " + idle_blink);
    $scope.idle_blink = idle_blink;
       $http({method: 'GET', url: 'http://'+ip+':'+port+'/?update=idle_blink&idle_blink_value=' + $scope.idle_blink + '&callback=JSON_CALLBACK&'}).
          success(function(data, status) {
            console.log("update blink sent");
          }).
          error(function(data, status) {
            console.log("update blink request failed");
       
        }); 


  }

  $scope.clearTargetList = function() {
    console.log("clearing target list");
 
       $http({method: 'GET', url: 'http://'+ip+':'+port+'/?update=clearTargetList&callback=JSON_CALLBACK&'}).
          success(function(data, status) {
            console.log("Target list cleared");
            $scope.msg = "Target list cleared. Check homescreen for refreshed target list";

 
        console.log("refreshing target list...");
       
  
              $http({method: 'GET', url: "http://"+ip+":"+port+"/?get=discoverTargets"}).
                success(function(data, status) {
           
                  console.log("request sent.");
                  $scope.msg = "New targets discovered";
       
                }).
                error(function(data, status) {
                  console.log("failed to communicate to base station");
              
              }); 
 




          }).
          error(function(data, status) {
            console.log("clear target list failed");
       
        }); 


  }
  $scope.restartGameScript = function() {

    $http({method: 'GET', url: 'http://'+ip+':'+port+'/?update=restartGameScript&callback=JSON_CALLBACK&'}).
          success(function(data, status) {
            console.log("Restarting base station now!");
            $scope.restart_msg = "Restarting basestation now! Please go to the homescreen and wait for reconnection.";
 
 
          }).
          error(function(data, status) {
            console.log("restart command failed");
       
        });

  }


  
 

  	// host fired off goToPage broadcast. 
  	// this is the echo back and redirects all devices to game screen
	socket.on('goToPageBroadcast', function(data){

	    $scope.game_data = angular.fromJson(data);

	    $ionicHistory.clearCache().then(function(){
      $state.go('game', {gameid: $scope.game_data.gamename, maxtime: $scope.game_data.maxtime, 
        max_targets: $scope.game_data.max_targets, time_between_waves: $scope.game_data.time_between_waves,
        paddle_sequence: $scope.game_data.paddle_sequence,targets_per_station: $scope.target_per_station, speed: $scope.game_data.speed, 
        double_tap: $scope.game_data.double_tap, capture_and_hold: $scope.game_data.capture_and_hold, target_timeout: $scope.game_data.target_timeout,
        matchtype: $scope.matchtype, scorelimit: $scope.scorelimit,
        player_list: $scope.game_data.player_list }, {reload: true});
      });

	});

}])
      

.controller('profileCtrl', ['$scope', '$stateParams', '$rootScope', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,  $rootScope, $state) {
 

	// check if there is a command to redirect player's screen to the game screen
  	// this occurs when game host hits START on the game screen
  	var socket = io.connect('http://'+ip+':'+port+'/');

  	// host fired off goToPage broadcast. 
  	// this is the echo back and redirects all devices to game screen
	socket.on('goToPageBroadcast', function(data){

	    $scope.game_data = angular.fromJson(data);

	    $ionicHistory.clearCache().then(function(){
      $state.go('game', {gameid: $scope.game_data.gamename, maxtime: $scope.game_data.maxtime, 
        max_targets: $scope.game_data.max_targets, time_between_waves: $scope.game_data.time_between_waves,
        paddle_sequence: $scope.game_data.paddle_sequence,targets_per_station: $scope.target_per_station, speed: $scope.game_data.speed, 
        double_tap: $scope.game_data.double_tap, capture_and_hold: $scope.game_data.capture_and_hold, target_timeout: $scope.game_data.target_timeout,
        matchtype: $scope.matchtype, scorelimit: $scope.scorelimit,
        player_list: $scope.game_data.player_list }, {reload: true});
      });

	});

  $scope.msg="Manage users";



}])
      
.controller('buildRangeCtrl', ['$scope', '$stateParams', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state) {

	// check if there is a command to redirect player's screen to the game screen
  	// this occurs when game host hits START on the game screen
  	var socket = io.connect('http://'+ip+':'+port+'/');

  	// host fired off goToPage broadcast. 
  	// this is the echo back and redirects all devices to game screen
	socket.on('goToPageBroadcast', function(data){

	    $scope.game_data = angular.fromJson(data);

	    $ionicHistory.clearCache().then(function(){
      $state.go('game', {gameid: $scope.game_data.gamename, maxtime: $scope.game_data.maxtime, 
        max_targets: $scope.game_data.max_targets, time_between_waves: $scope.game_data.time_between_waves,
        paddle_sequence: $scope.game_data.paddle_sequence,targets_per_station: $scope.target_per_station, speed: $scope.game_data.speed, 
        double_tap: $scope.game_data.double_tap, capture_and_hold: $scope.game_data.capture_and_hold, target_timeout: $scope.game_data.target_timeout,
        matchtype: $scope.matchtype, scorelimit: $scope.scorelimit,
        player_list: $scope.game_data.player_list }, {reload: true});
      });

	});

}])
   
.controller('downloadCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('home2Ctrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {




  //$scope.goToGameController = function(){
  //  console.log("hi");
  //}




  
	// check if there is a command to redirect player's screen to the game screen
  	// this occurs when game host hits START on the game screen
  	var socket = io.connect('http://'+ip+':'+port+'/');

  	// host fired off goToPage broadcast. 
  	// this is the echo back and redirects all devices to game screen
	socket.on('goToPageBroadcast', function(data){

	    $scope.game_data = angular.fromJson(data);

	    $ionicHistory.clearCache().then(function(){
      $state.go('game', {gameid: $scope.game_data.gamename, maxtime: $scope.game_data.maxtime, 
        max_targets: $scope.game_data.max_targets, time_between_waves: $scope.game_data.time_between_waves,
        paddle_sequence: $scope.game_data.paddle_sequence,targets_per_station: $scope.target_per_station, speed: $scope.game_data.speed, 
        double_tap: $scope.game_data.double_tap, capture_and_hold: $scope.game_data.capture_and_hold, target_timeout: $scope.game_data.target_timeout,
        matchtype: $scope.matchtype, scorelimit: $scope.scorelimit,
        player_list: $scope.game_data.player_list }, {reload: true});
      });

	});


}])
   
.controller('diagnosticsCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $http, $ionicHistory) {


  // helps with swipe to go back functionality I think
    $scope.myGoBack = function() {
       $ionicHistory.goBack();
    };
    $scope.swipe = function (direction) {
        $ionicHistory.goBack();
    }

 

 

  var socket = io.connect('http://'+ip+':'+port+'/');
 
   socket.on('jsonrows', function(data){
      $scope.activity = angular.fromJson(data);
      $scope.$apply(function () {

      $scope.items = $scope.activity.target;
      $scope.targets = $scope.activity.target;

    


       for (var key in $scope.targets)
        {
            $scope.targets[key].online_msg = "Offline";
            $scope.targets[key].volt_percent =0;
            $scope.targets[key].battery_icon = 'icon ion-battery-empty';
            if ($scope.targets[key].online)
            { 
              if ($scope.targets[key].volt === undefined)
                $scope.targets[key].volt_percent = "please wait...";
              else
              {


                // voltage circuit is narrow. If volts drop below 14.3 volts, as adc drops below 0, it flips to 
                // +2000 adc.
                // battery range is between 0 and 650 units
                // or 14.3v to 16.3 volts 
                var adc = $scope.targets[key].volt;
                if (adc > 1500)
                    adc = 1;
                // adc / full adc swing
                // 16.8v tops at around 740 adc units
                var volt_percent = Math.floor(((adc)/700)*100);
                // floor + converted voltage
                var voltage = 14 + (2.2 * (volt_percent/100));
                //console.log(  Math.floor((($scope.targets[key].volt - 460)/140)*100));
                /// adc: ' + $scope.targets[key].volt + '
                $scope.targets[key].volt_percent = volt_percent+ '%  / ' + voltage.toFixed(2) + 'v';
                if (volt_percent > 5)
                  $scope.targets[key].battery_icon = 'icon ion-battery-low';
                if (volt_percent > 50 )
                  $scope.targets[key].battery_icon = 'icon ion-battery-half';
                if (volt_percent > 85)
                  $scope.targets[key].battery_icon = 'icon ion-battery-full';
              }
              $scope.targets[key].online_msg = "Online";
              

              //console.log($scope.targets[key].id + ' ' + $scope.targets[key].online + ' ' + $scope.targets[key].volt_percent);
            }
            else
            {
              // target is offline - splice from array
              delete $scope.targets[key];
              
            }
        }
 

      
   
     });
   });


  $scope.pingTarget = function($id) {
        console.log("pinging target: " + $id);

        $http({method: 'GET', url: "http://"+ip+":"+port+"/?get=ping&target=" + $id}).
          success(function(data, status) {
             
            console.log("request sent.");
 
          }).
          error(function(data, status) {
            console.log("failed to communicate to base station");
        
        }); 



    }
 


}])
   
.controller('targetInfoCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('loginCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('gameCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('termsCtrl', ['$scope', '$stateParams', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http) {


    // setup sockets
  var socket = io.connect('http://'+ip+':'+port+'/');
 
   socket.on('jsonrows', function(data){
       $scope.activity = angular.fromJson(data);
       //console.log($scope.activity);
       $scope.$apply(function () {
        if ($scope.activity.terms_conditions == "true")
          $scope.terms_value = true;
        else
          $scope.terms_value = false;
  
     });
   });

   $scope.$on('$destroy', function (event) {
    socket.removeAllListeners();
   });

 

 



  $scope.toggle_terms = function(terms_value) {
    console.log("Terms & conditions: " + terms_value);
    $scope.terms_value = terms_value;

       $http({method: 'GET', url: 'http://'+ip+':'+port+'/?update=terms_conditions&term_value=' + $scope.terms_value + '&callback=JSON_CALLBACK&'}).
          success(function(data, status) {
            //console.log(status); 
            console.log("update terms sent");
      
 
          }).
          error(function(data, status) {
            console.log("update terms request failed");
       
        }); 


  }

}])

.controller('safetyCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('helpCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

$scope.shownGroup = null;

  /*
  $scope.groups = [];
  for (var i=0; i<10; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j=0; j<3; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }
  */
  
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

}])
 



