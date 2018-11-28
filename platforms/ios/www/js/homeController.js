
//angular.module('ionicApp').controller('MainCtrl', function ($scope) { ... });

angular.module('app.homeController', [])

.controller('home2Ctrl', ['$scope', '$stateParams', '$http', '$state', '$location', '$templateCache',
          '$rootScope',
// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function($scope, $stateParams, $http, $state, $location, $templateCache, $rootScope) {
  var ip = '192.168.8.1';
  var port = '8081';
  $scope.target_online_count = "0";
    //console.log(parseInt(128, 16));
    //console.log('64'.toString(16));
    // add all the numbers
    var num1 = 0x89;
    var num2 = 0x91;
    var num3 = num1 + num2;
   // console.log("num1 + num2 = " + num3.toString(16)  );

    // get last two bytes for checksum value
    var cs_length = num3.toString(16).length; // get 
    var cs_value1 = num3.toString(16)[cs_length-1];
    var cs_value2 = num3.toString(16)[cs_length-2];
    var cs_value = cs_value2 + cs_value1;
    //console.log("ending values " + cs_value);


    $scope.divTargetsOnline = '<div class="row"><div class="col-notargets col-24">#</div><div class="col-notargets col-24">#</div><div class="col-notargets col-24">#</div><div class="col-notargets col-24">#</div></div>';
 
  

  $scope.discoverTargets = function($rootScope) {
        console.log("discovering...");
        $scope.divTargetsOnline = '<div class="row"><div class="col-notargets col-24">discovering</div><div class="col-notargets col-24">discovering</div><div class="col-notargets col-24">discovering</div><div class="col-notargets col-24">discovering</div></div>';
 
  
        $http({method: 'GET', url: "http://"+ip+":"+port+"/?get=discoverTargets"}).
          success(function(data, status) {
             $scope.divTargetsOnline = '<div class="row"><div class="col-notargets col-24">discovering</div><div class="col-notargets col-24">discovering</div><div class="col-notargets col-24">discovering</div><div class="col-notargets col-24">discovering</div></div>';
 
            console.log("request sent.");
            $scope.msg = "Discovering targets...";
 
          }).
          error(function(data, status) {
            console.log("failed to communicate to base station");
        
        }); 

    }

  $scope.doRefresh = function() {
    $state.go($state.current, {}, {reload: true});

    // connect to base station via sockets
    var manager = io.Manager('http://'+ip+':'+port+'/', { /* options */ });
    manager.socket('/namespace');
    manager.on('connect_error', function() {
        console.log("Connection error!");
        
        $scope.$apply(function () {
          $scope.base = '<span  class="ion-wifi "></span>'+
              '<h1 >Not connected to base station </h1>'+
              '<p>Make sure you are connected to Autonomous Alloys WiFi</p>';
         });
    });
  

   
    // check if there is a command to redirect player's screen to the game screen
    // this occurs when game host hits START on the game screen
    var socket = io.connect('http://'+ip+':'+port+'/');


       // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
 
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



  $scope.base = '  <span  class="ion-wifi "></span>'+
            '<h1 style="font-size: 20px;padding-bottom:0;margin-bottom:0">Connecting to base station... </h1>'+
            '<p>Make sure you are connected to Autonomous Alloys WiFi</p>';
  //$scope.base_sub_msg = "Make sure you are connected to Autonomous Alloys WiFi";
  //$scope.userprofile = "logged in as " + profile_auth0_name;
 


  

  $scope.showplayers = false;
    
  // connect to base station via sockets
  var manager = io.Manager('http://'+ip+':'+port+'/', { /* options */ });
  manager.socket('/namespace');
  manager.on('connect_error', function() {
      console.log("Connection error!");
      
      $scope.$apply(function () {
        $scope.base = '<span  class="ion-wifi "></span>'+
            '<h1 >Not connected to base station </h1>'+
            '<p>Make sure you are connected to Autonomous Alloys WiFi</p>';
       });
  });
 
  // check if there is a command to redirect player's screen to the game screen
  // this occurs when game host hits START on the game screen
  var socket = io.connect('http://'+ip+':'+port+'/');

 
  $scope.$on('$destroy', function (event) {
    socket.removeAllListeners();
   })

  // display connection status
  if (socket)
      socket.on('message', function(connectionStatus){
        //$scope.base = ';'
        $scope.base = '<div><span  class="ion-wifi "></span>'+
            '<h1>' +connectionStatus+' </h1></div>';
            //$scope.target_online_count = "";
        //$scope.base_sub_msg = "";
        $scope.$apply(function () {
          

          console.log("terms: "  + $scope.terms_conditions);
          $scope.base = '<div><span class="ion-wifi" ></span>'+
            '<h1 style="font-size: 20px;padding-bottom:0;margin-bottom:0">' +connectionStatus+' </h1>' +
            '<p>Connected to ' + $scope.activity.repeaters + ' repeaters</p></div>';
        
          if ($scope.terms_conditions != "true")
          {
            $scope.base = '<div><span class="ion-wifi " ></span>'+
            '<h1 style="font-size: 20px;padding-bottom:0;margin-bottom:0">Connected to basestation </h1>' +
            '<p><span class="red" >Please accept the Terms & Conditions before continuing</span></p></div>';
          }
         


        });


        







      });
 
 


      socket.on('jsonrows', function(data){
          $scope.thelist = '';
          $scope.player_data = angular.fromJson(data);
          $scope.activity = angular.fromJson(data);

          for (var key in $scope.player_data.players_in_lobby) {

           //console.log($scope.player_data.players_in_lobby[ key ]);
            $scope.thelist = $scope.thelist + '<div class="row item "><div class="cold col-5 item-avatar" >'+
              '<img src="img/badlandicon1.gif"></div><div class="cold col-75" >'
              + '<h2>' + $scope.player_data.players_in_lobby[ key ] + '</h2>'+
              '<p>online</p> </div></div>';


          } 
          $scope.playerList = $scope.thelist;
          $scope.terms_conditions = $scope.activity.terms_conditions;
          
        
          // **************  show sorted targets  **************
          var sortedTargets = [];

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

          $scope.divTargetsOnline = '<div class="row">';
 
          // display targets
          for (var i=0; i<sortedTargets.length; i++)
          {
            $scope.divTargetsOnline = $scope.divTargetsOnline + 
                     '<div class="col col-24">' + sortedTargets[i] + '</div>';
          }
          if (sortedTargets.length == 0){
            $scope.divTargetsOnline = $scope.divTargetsOnline + 
                     '<div class="col-notargets col-24"><i class="icon ion-android-locate"></i></div>' + 
                     '<div class="col-notargets col-24"><i class="icon ion-android-locate"></i></div>' + 
                     '<div class="col-notargets col-24"><i class="icon ion-android-locate"></i></div>' + 
                     '<div class="col-notargets col-24"><i class="icon ion-android-locate"></i></div>' 
                     ;
            $scope.target_online_count = 0;
          }
          else
          {
            $scope.target_online_count = sortedTargets.length; ;
          }
          $scope.divTargetsOnline = $scope.divTargetsOnline +  '</div>';
          // ************** End show sorted targets  **************


        });



}])

 
 