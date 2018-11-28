// Ionic Starter App
var db = null;
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova','ngAudio','ngAnimate',  'ngSanitize', 'app.profileController', 'app.LoginController', 'app.controllers', 'app.homeController','app.gameController', 'app.chooseGameController', 'app.routes', 'app.directives','app.services','ui.router','chart.js'])


 .config(function($ionicConfigProvider) {
   $ionicConfigProvider.views.maxCache(0);

//   // note that you can also chain configs
 })

    
//.controller('home2Ctrl', function($scope, $http, $state, $location, $templateCache) {
// refresher
// $scope.items = [1,2,3];
// $scope.doRefresh = function() {
//   $http.get('/new-items')
//    .success(function(newItems) {
//      $scope.items = newItems;
//    })
//    .finally(function() {
//      // Stop the ion-refresher from spinning
//      $scope.$broadcast('scroll.refreshComplete');
//    });
//  };
 

// $scope.tasks = [
//   { title: 'Collect coins' },
//   { title: 'Eat mushrooms' },
//   { title: 'Get high enough to grab the flag' },
//   { title: 'Find the Princess' }
// ];

  //   $scope.method = 'JSONP';
  // $scope.url = 'http://192.168.8.1:8081/socket.io/socket.io.js';
  // $scope.code = null;
  //   $scope.response = null;

  // $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
  //     then(function(response) {
  //       console.log(response.status);
  //       console.log(response.data);
  //     }, function(response) {
  //       console.log(response.data || 'Request failed');
  //       console.log(response.status);
  //   });

  // $scope.fetch = function() {
  //   $scope.code = null;
  //   $scope.response = null;

  //   $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
  //     then(function(response) {
  //       console.log(response.status);
  //       console.log(response.data);
  //     }, function(response) {
  //       console.log(response.data || 'Request failed');
  //       console.log(response.status);
  //   });
  // };
 //})
// .controller('gameCtrl', function($scope, $http, $timeout, $ionicPopup, $location, $state, $ionicHistory, $stateParams) {

// })

//.controller('GamesDrills', function($scope, $ionicPopup, $location, $state) {
//   var manager = io.Manager('http://192.168.8.1:8081/', { /* options */ });
//   manager.socket('/namespace');
//   manager.on('connect_error', function() {
//       console.log("Connection error!");
      
//       $scope.$apply(function () {
//             $scope.base = "Not connected to base station";
//             $scope.userprofile = "";
//           });
//   });
 
//   var socket = io.connect('http://192.168.8.1:8081/');
 
//   socket.on('goToPageBroadcast', function(data){
         
//         //window.location = data;
//         $location.path(data);
//         //console.log(msg);
//     });
//   // $scope.serverSideList = [
//   //     { text: "Go", value: "go" },
//   //     { text: "Python", value: "py" },
//   //     { text: "Ruby", value: "rb" },
//   //     { text: "Java", value: "jv" }
//   //   ];
 
//     $scope.showSelectValue = function(maxtime) {
//     console.log(maxtime);
//     $scope.maxtime = maxtime;
// }

//     $scope.goToGame = function($rootScope) {

//       $state.go('game', {gameid: $scope.card, maxtime: $scope.maxtime});

//     }

//     $scope.card_objective = "";
//     $scope.image = "";
//     $scope.showcardspace = false;


//     $scope.showGameListPopup = function() {
//     $scope.data = {};


//   // $scope.serverSideChange = function(item) {
//   //   console.log("Selected Serverside, text:", item.text, "value:", item.value);
//   //   $scope.card = item.value;
//   //   if (item.value == 'py')
//   //     $scope.card = "you selected python"
//   // };

//    // $scope.serverSideChange = function(item) {
//    //      console.log("Selected Serverside, value:", item.value);
//    //      $scope.card = item.value;
//    //      console.log(item.value);   

//    //    };

//     // <ion-radio 
//     //                    ng-model="data.serverSide"
//     //                    ng-change="serverSideChange(item)"
//     //                    name="server-side">
//     //           {{ item.text }}
//     //         </ion-radio> -->
//     //template: '<ion-radio ng-model="choice" ng-value="A">Choose A</ion-radio><ion-radio ng-model="choice" ng-value="B">Choose B</ion-radio><ion-radio ng-model="choice" ng-value="C">Choose C</ion-radio>',
//      //  template: '<ion-radio ng-model="clientSideList" ng-value="A">Choose A</ion-radio><ion-radio ng-model="choice" ng-value="B">Choose B</ion-radio><ion-radio ng-model="choice" ng-value="C">Choose C</ion-radio>',
               
//      var confirmPopup = $ionicPopup.confirm({
//        title: 'Select a Game',
//        template: '<ion-radio  ng-model="data.gamename" ng-value="\'overrun\'">Overrun</ion-radio>'+
//        '<ion-radio ng-model="data.gamename" ng-value="\'All-or-none\'">All or None</ion-radio>' + 
//        '<ion-radio ng-model="data.gamename" ng-value="\'run-n-gun\'">Run N Gun</ion-radio>' +
//        '<ion-radio ng-model="data.gamename" ng-value="\'domination\'">Domination</ion-radio>' +
//        '<ion-radio ng-model="data.gamename" ng-value="\'zombies\'">Zombies</ion-radio>' +
//        '<ion-radio ng-model="data.gamename" ng-value="\'free-for-all\'">Free for All</ion-radio>' +
//        '<ion-radio ng-model="data.gamename" ng-value="\'domination-z\'">Domination Z</ion-radio>'+
//        '<ion-radio ng-model="data.gamename" ng-value="\'marksman\'">Marksman</ion-radio>',
//         scope: $scope
//      });

//      confirmPopup.then(function(res) {

      
//        if(res) { // hit OK

//         if ($scope.data.gamename == 'overrun')
//         {
//            $scope.card = 'Overrun';
//            $scope.card_objective = "The objective of Overrun is kill as many enemies as you can before you are overrun. When all targets are lit, game ends. Game speed increases over time.";
//            $scope.image='game-swarm.jpg';
//            $scope.showcardspace = true;
//         }

//         if ($scope.data.gamename == 'domination' || $scope.data.gamename == 'domination-z')
//         {
//            $scope.card = 'Domination';
//            $scope.card_objective = "The objective of Domination is to own all of the control points on the map. There are usually at least three of these control points scattered around the map, and are usually found in key strategic locations. To capture a control point, a player must stand near it for 10 seconds with no enemies nearby to capture it for the player's team.";
//            $scope.image='game-swarm.jpg';
//            $scope.showcardspace = true;
//         }

//         if ($scope.data.gamename == 'run-n-gun' )
//         {
//            $scope.card = 'Run N Gun';
//            $scope.card_objective = "Simulate shoot/no shoot scenarios, marksmanship, and endurance while advancing through a shoot house or open course. Complete each stage of the course as quickly as you can. Advance on target groups being careful not to shoot hostage, as hostage kills end round. ";
//            $scope.image='RunGunny.gif';
//            $scope.showcardspace = true;
//         }

//         if ($scope.data.gamename == 'zombies')
//         {
//            $scope.card = 'Zombies';
//            $scope.card_objective = "Survive as many waves of zombies as possible. Configure range into a grid minimum 2 columns with 3 rows. Waves of targets will begin in the back row and advance forward indicated by LEDs. Shoot the lit target before it reaches you. If successfully cleared, the next wave will begin and advance .200 sec faster then the last wave.";
//            $scope.image='Zomby.gif';
//            $scope.showcardspace = true;
//         }
//         if ($scope.data.gamename == 'free-for-all')
//         {
//            $scope.card = 'Free for All';
//            $scope.card_objective = "The objective of Free for All is to own all of the control points on the map. There are usually at least three of these control points scattered around the map, and are usually found in key strategic locations. To capture a control point, a player must stand near it for 10 seconds with no enemies nearby to capture it for the player's team.";
//            $scope.image='game-swarm.jpg';
//            $scope.showcardspace = true;
//         }
//         if ($scope.data.gamename == 'marksman')
//         {
//            $scope.card = 'Marksman';
//            $scope.card_objective = "Marksman is a single player or multiplayer game with the objective being to complete the set number of hits in the least amount of time. This is a slower paced game designed for longer ranged shots.";
//            $scope.image='giphy-marksman.gif';
//            $scope.showcardspace = true;
//         }
         
//        } else {
//          console.log('You are not sure');
//        }
//      });


//    };
 

 //})
 


.run(function($ionicPlatform, $rootScope, $location) {


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

    // db = $cordovaSQLite.openDB("my.db");
    // $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
    


  });

  // This hooks all auth events to check everything as soon as the app starts
  //auth.hookEvents();


  //This event gets triggered on URL change
  /*
    var refreshingToken = null;
    $rootScope.$on('$locationChangeStart', function () {
      var token = store.get('token');
      var refreshToken = store.get('refreshToken');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          if (!auth.isAuthenticated) {
            auth.authenticate(store.get('profile'), token);
          }
        } else {
          if (refreshToken) {
            if (refreshingToken === null) {
              refreshingToken = auth.refreshIdToken(refreshToken).then(function (idToken) {
                store.set('token', idToken);
                auth.authenticate(store.get('profile'), idToken);
              }).finally(function () {
                refreshingToken = null;
              });
            }
            return refreshingToken;
          } else {
            $location.path('/login');// Notice: this url must be the one defined
          }                          // in your login state. Refer to step 5.
        }
      }
    });
    */


});


 
 

 

