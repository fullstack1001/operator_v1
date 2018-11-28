angular.module('app.homeController', [])
.controller('home2Ctrl', ['$scope', 'getTargets', 'addAlert', 'removeAlert', '$stateParams', '$http', '$state', '$location', '$templateCache', '$rootScope', '$window','$sce',
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function($scope, getTargets, addAlert, removeAlert, $stateParams, $http, $state, $location, $templateCache, $rootScope, $window, $sce) {
  $scope.go = function(path) {
    $location.path( path );
  };

  $scope.home_title = '<img class="title-image" src="img/logo-small-white.png" style="height:41px;padding-top:5px;" />';

  $scope.target_online_count = 0;
  $scope.connected = false;

  //console.log(parseInt(128, 16));
  //console.log('64'.toString(16));
  // add all the numbers
  var num1 = 0x89;
  var num2 = 0x91;
  var num3 = num1 + num2;
  $scope.showSpinny = false;
  $scope.showTargetDiv = false;
  // console.log("num1 + num2 = " + num3.toString(16)  );

  // get last two bytes for checksum value
  var cs_length = num3.toString(16).length; // get
  var cs_value1 = num3.toString(16)[cs_length - 1];
  var cs_value2 = num3.toString(16)[cs_length - 2];
  var cs_value = cs_value2 + cs_value1;
  $scope.easterEggCount = 0;
  //console.log("ending values " + cs_value);

  $scope.easteregg = function () {
    console.log("easteregg")
    $scope.easterEggCount++;
    if ($scope.easterEggCount >= 5)
    {
      // navigate to buildrange page
      
          $state.go('home.buildRange', {}, {
            reload: true
          });
    
    }
  }

  setInterval(function(){
    $scope.easterEggCount=0;
  },1000);

  $scope.discoverTargets = function ($rootScope) {

    console.log("Discovering targets...");
    $scope.divTargetsOnline = '';

               $scope.showTarg1 = false;
               $scope.showTarg2 = false;
               $scope.showTarg3 = false;
               $scope.showTarg4 = false;
               $scope.showTarg5 = false;
               $scope.showTarg6 = false;
               $scope.showTarg7 = false;
               $scope.showTarg8 = false;
               $scope.showTarg9 = false;
               $scope.showTarg10 = false;
               $scope.showTarg11 = false;
               $scope.showTarg12 = false;
               $scope.showTarg13 = false;
               $scope.showTarg14 = false;
               $scope.showTarg15 = false;
               $scope.showTarg16 = false; 

    $http({method: 'GET', url: "http://" + ip + ":" + port + "/?get=discoverTargets&randomstring=" + Math.random().toString(36).substring(7) }).success(function (data, status) {
      $scope.msg = "Discovering...";
    }).error(function (data, status) {
      console.log("failed to communicate to base station");

    });

  }

  $scope.flashTarget = function(val){
 
        console.log("pinging...");


        $http({
        method: 'GET',
        url: "http://" + ip + ":" + port + "/?get=ping&target=" + val +"&randomstring=" + Math.random().toString(36).substring(7) + "&interval=10&json_callback=JSON_CALLBACK&"  + new Date().getTime()
        }).
        success(function(data, status) {

          console.log("request sent.");

        }).
        error(function(data, status) {
          console.log("failed to communicate to base station");

        });
 

    }


  $scope.doRefresh = function () {
 
    $window.location.reload(); 
  };
  /*
   if (!angular.isUndefined(auth.profile) && auth.profile !== null )
   {

   $scope.profile_name = auth.profile.name;
   profile_auth0_name = auth.profile.name;
   $scope.pic = auth.profile.picture;

   $http({method: 'GET', url: "http://"+ip+":"+port+"/?get=player_join&player_name=" +
   profile_auth0_name + "&callback=JSON_CALLBACK&"}).
   success(function(data, status) {

   console.log("player joined to base station");
   $scope.msg = "Player joined to base station";

   }).
   error(function(data, status) {
   console.log("failed to communicate to base station");

   });



   }
   else
   {

   $http({method: 'GET', url: "http://"+ip+":"+port+"/?get=player_join&player_name=" +
   profile_auth0_name + "&callback=JSON_CALLBACK&"}).
   success(function(data, status) {

   console.log("player joined to base station");
   $scope.msg = "Player joined to base station";

   }).
   error(function(data, status) {
   console.log("failed to communicate to base station");

   });

   }
   */


  // top card on game screen displays whether the players device is online
  // player's device must be connected to the base stations wifi
  $scope.base = '  <span  class="ion-wifi ion-wifi-black "></span>' +
     '<h1 class="wrapme">Connecting to base station... </h1>';
     $scope.target_online_count_display = "";
 $scope.showplayers = false;

  // connect to base station via sockets
  // TODO: remove dupe socket connection check/message
 
     //var manager = io.Manager('http://' + ip + ':' + port + '/', {/* options */});
     //var manager = io.Manager('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});
    manager
        .socket('/namespace')
        .on('connect_error', function () {
          console.warn("Connection error!");
          $scope.$apply(function () {
            $scope.showSpinny = false;
            $scope.discovery_state  = '';
            $scope.target_online_count_display = "";
            $scope.base = '<span  class=" ion-wifi ion-wifi-black"></span>' +
              '<h1 class="wrapme">Not connected to base station!</h1>' +
              '<p class="wrapme red">Make sure you are connected to Autonomous Alloys WiFi</p>';
               $scope.divTargetsOnline = '';

               $scope.showTarg1 = false;
               $scope.showTarg2 = false;
               $scope.showTarg3 = false;
               $scope.showTarg4 = false;
               $scope.showTarg5 = false;
               $scope.showTarg6 = false;
               $scope.showTarg7 = false;
               $scope.showTarg8 = false;
               $scope.showTarg9 = false;
               $scope.showTarg10 = false;
               $scope.showTarg11 = false;
               $scope.showTarg12 = false;
               $scope.showTarg13 = false;
               $scope.showTarg14 = false;
               $scope.showTarg15 = false;
               $scope.showTarg16 = false;

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


  // check if there is a command to redirect player's screen to the game screen
  // this occurs when game host hits START on the game screen
  //var socket = io.connect('http://' + ip + ':' + port + '/');
 // var socket = io.connect('http://' + ip + ':' + port + '/', {transports: ['websocket'], upgrade: false});
  // display connection status
    socket
      .once('message', function (connectionStatus) {
        $scope.$apply(function () {
          console.log("Terms & conditions: ", $scope.terms_conditions);
          var repeatercount = ($scope.activity && $scope.activity.repeaters && $scope.activity.repeaters > 0) ? $scope.activity.repeaters : 0;
          //$scope.base = '<div><span class="ion-wifi" ></span>' +
         //     '<h1 class="wrapme">Connected to basestation</h1>';
        });
      })
      .on('jsonrows', function (data) {
        $scope.thelist = '';
        $scope.activity = angular.fromJson(data) || {};

        $scope.discovery_state = $scope.activity.discover_state;

        if ($scope.activity.account_type == "commercial")
        {
          if ($scope.activity.public_designation.length > 17)
            $scope.public_designation = $scope.activity.public_designation.substring(0, 17) + "...";
          else
            $scope.public_designation = $scope.activity.public_designation
          $scope.basestation_name = $scope.activity.basestation_name;
          //if ($scope.basestation_name.length > 0)
            //$scope.home_title = $scope.public_designation + ' - ' + $scope.basestation_name ;
          
        }
        
        $scope.$apply(function () {

          if ($scope.public_designation === undefined)
              $scope.base = '<span  class="ion-wifi"></span>' +
                '<h1 class="wrapme">Connected to basestation</h1>';
          else
            $scope.base = '<span  class="ion-wifi"></span>' +
                '<h1 class="wrapme">Connected to basestation</h1>' + 
                '<p class="wrapme ">' + $scope.basestation_name + ' - ' + $scope.public_designation + '</p>';
              
                


          $scope.showTargetDiv = true;
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
          //TODO: not using the $scope.player_data here (overridden by activity)
          /*if(Object.keys($scope.player_data).length) {
           for (var key in $scope.player_data.players_in_lobby) {
           //console.log($scope.player_data.players_in_lobby[ key ]);
           $scope.thelist = $scope.thelist + '<div class="row item "><div class="cold col-5 item-avatar" >' +
           '<img src="img/badlandicon1.gif"></div><div class="cold col-75" >'
           + '<h2>' + $scope.player_data.players_in_lobby[key] + '</h2>' +
           '<p>online</p> </div></div>';
           }
           $scope.playerList = $scope.thelist;
           $scope.terms_conditions = $scope.activity.terms_conditions;
           }*/

          // ************** TODO: MOVE TO SERVICE  **************
          /*var sortedTargets = [];

           // target object contains all targets in database and says whether each is online or not
           for (var key in $scope.activity.target) {
           if ($scope.activity.target.hasOwnProperty(key)) {
           var obj = $scope.activity.target[key];
           for (var prop in obj) {
           if (obj.hasOwnProperty(prop))
           if (prop == 'id' && $scope.activity.target[key]["online"])
           sortedTargets.push($scope.activity.target[key]['id']);
           }
           }
           }

           sortedTargets.sort(function(a, b) {
           return a - b;
           });
           $scope.target_online_count = sortedTargets.length;
           */
          $scope.target_online_count = getTargets($scope);

          $scope.target_online_count_display = "";
          if ($scope.activity.discover_state == '') 
          {
            $scope.showSpinny = false;
            $scope.target_online_count_display = "Targets online: " + $scope.target_online_count.length;
          
          }
          
          //if ($scope.target_online_count > 0 ){
           // $scope.base = '<span  class="ion-wifi"></span>' +
             //   '<h1 class="wrapme">Connected to basestation</h1>';
                
          //}

          $scope.showTarg1 = $scope.showTarg2 = $scope.showTarg3 = $scope.showTarg4 = $scope.showTarg5 = false;
          $scope.showTarg6 = $scope.showTarg7 = $scope.showTarg8 = $scope.showTarg9 = $scope.showTarg10 = false;
          $scope.showTarg11 = $scope.showTarg12 = $scope.showTarg13 = $scope.showTarg14 = $scope.showTarg15 = $scope.showTarg16 = false;
 
 
          // display targets
          for (var i = 0; i < $scope.target_online_count.length; i++) {

            //console.log($scope.target_online_count);


            

            switch($scope.target_online_count[i]) {
              case 1:
                $scope.showTarg1 = true;
                break;
              case 2: 
                $scope.showTarg2 = true;
                break;
              case 3: 
                $scope.showTarg3 = true;
                break;
              case 4: 
                $scope.showTarg4 = true;
                break;
              case 5: 
                $scope.showTarg5 = true;
                break;
              case 6: 
                $scope.showTarg6 = true;
                break;
              case 7: 
                $scope.showTarg7 = true;
                break;
              case 8: 
                $scope.showTarg8 = true;
                break;
              case 9: 
                $scope.showTarg9 = true;
                break;
              case 10: 
                $scope.showTarg10 = true;
                break;
              case 11: 
                $scope.showTarg11 = true;
                break;
              case 12: 
                $scope.showTarg12 = true;
                break;
              case 13: 
                $scope.showTarg13 = true;
                break;
              case 14: 
                $scope.showTarg14 = true;
                break;
              case 15: 
                $scope.showTarg15 = true;
                break;
              case 16: 
                $scope.showTarg16 = true;
                break;
              default:
                break;


            }
           
/*
            if ($scope.target_online_count[i] == 1 )
              $scope.showTarg1 = true;
            if ($scope.target_online_count[i] == 2 )
              $scope.showTarg2 = true;
            if ($scope.target_online_count[i] == 3 )
              $scope.showTarg3 = true;
            if ($scope.target_online_count[i] == 4 )
              $scope.showTarg4 = true;
            if ($scope.target_online_count[i] == 5 )
              $scope.showTarg5 = true;
            if ($scope.target_online_count[i] == 6 )
              $scope.showTarg6 = true;
            if ($scope.target_online_count[i] == 7 )
              $scope.showTarg7 = true;
            if ($scope.target_online_count[i] == 8 )
              $scope.showTarg8 = true;
            if ($scope.target_online_count[i] == 9 )
              $scope.showTarg9 = true;
            if ($scope.target_online_count[i] == 10 )
              $scope.showTarg10 = true;
            if ($scope.target_online_count[i] == 11 )
              $scope.showTarg11 = true;
            if ($scope.target_online_count[i] == 12 )
              $scope.showTarg12 = true;
            if ($scope.target_online_count[i] == 13 )
              $scope.showTarg13 = true;
            if ($scope.target_online_count[i] == 14 )
              $scope.showTarg14 = true;
            if ($scope.target_online_count[i] == 15 )
              $scope.showTarg15 = true;
            if ($scope.target_online_count[i] == 16 )
              $scope.showTarg16 = true;
*/
            // $scope.divTargetsOnline = $scope.divTargetsOnline +
              //  '<div class="col col-24"  ng-click="flashTarget(' + $scope.target_online_count[i] + ')">' + $scope.target_online_count[i] + '</div>';
          }

          
          $scope.divTargetsOnline = '<div class="row">';
          // trust as html
          if ($scope.target_online_count == 0) {
            $scope.divTargetsOnline = '';
            $scope.showTarg1 = $scope.showTarg2 = $scope.showTarg3 = $scope.showTarg4 = $scope.showTarg5 = false;
            $scope.showTarg6 = $scope.showTarg7 = $scope.showTarg8 = $scope.showTarg9 = $scope.showTarg10 = false;
            $scope.showTarg11 = $scope.showTarg12 = $scope.showTarg13 = $scope.showTarg14 = $scope.showTarg15 = $scope.showTarg16 = false;
 


          }
          if ($scope.activity.discover_state != '') {
          //if ($scope.target_online_count == 0) {
            $scope.showSpinny = true;
            //$scope.discovery_state = "Finding targets..."
       
            
            $scope.divTargetsOnline = $scope.divTargetsOnline + '';
        
            $scope.base_msg_data = addAlert($scope, "No targets found");
          }
          $scope.divTargetsOnline = $scope.divTargetsOnline + '</div>';
          $scope.divTargetsOnline = $sce.trustAsHtml($scope.divTargetsOnline);
          // remove alert by name
          if($scope.base_msg_data && $scope.base_msg_data.length) {
            removeAlert($scope, "No basestation found - use AA WiFi");
          }
        });
      });
}]);

 
 