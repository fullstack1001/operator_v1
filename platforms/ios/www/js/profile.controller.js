
 
angular.module('app.profileController', [])

.controller('profileController', ['$scope', '$stateParams',  '$rootScope',
            '$location', '$state', '$http', '$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function($scope, $stateParams, $rootScope, $location, $state,  $http, $timeout ) {
 
  $scope.base_msg_window = false;

  // *********** Open socket connection to base ***********

     var manager = io.Manager('http://'+ip+':'+port+'/', { /* options */ });
     manager.socket('/namespace');
     manager.on('connect_error', function() {
         console.log("Connection error!");    

         $scope.$apply(function () {
            $scope.base_msg_data = "Not connected to base station";
            $scope.base_msg_window = true;
         });
     });
     var socket = io.connect('http://'+ip+':'+port+'/');
     $scope.$on('$destroy', function (event) {
      socket.removeAllListeners();
     })
    // END *********** Open socket connection to base ***********
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
        }

     });
   });

 

  // if battery is low, let button click navigate
   $scope.base_msg_click = function(){
      if ( $scope.lowbattery)
      {
            $state.go('home.diagnostics'); 
      }
    }


  var vm = this;

  $scope.msg = "Manage users";

  vm.addUser = addUser;
  vm.viewUsers = viewUsers;


 
  vm.viewUsers();


 



 
  function addUser() {
    console.log("adding: " + $scope.username);

    $http({method: 'GET', url: 'http://'+ip+':'+port+'/?page=adduser&name=' + $scope.username + '&callback=JSON_CALLBACK&'}).
        success(function(data, status) {
      
          console.log($scope.username + " added");
 
          $scope.msg_due = data;
          vm.viewUsers();
        }).
        error(function(data, status) {
          console.log("Add user request failed");
          $scope.msg = "Base station didn't receive: Game stopped by host!";
      }); 




  }


 
  $scope.enablePlayer = function(player) {

 
    console.log("player active: " + player.player_name);

    console.log("player id: " + player.player_id);
    console.log("player active: " + player.active);

    $http({method: 'GET', url: "http://"+ip+":"+port+"/?page=player_active&id="+ player.player_id+"&active="+player.active+"&json_callback=JSON_CALLBACK"}).
      success(function(data, status) {
        
        console.log("success");
        console.log(data);
 
      }).
        error(function(data, status) {
          console.log("View user request failed");
          $scope.msg = "Base station didn't receive: Game stopped by host!";
    }); 
 
  }

  function viewUsers() { 

  
    $http({method: 'GET', url: "http://"+ip+":"+port+"/?page=player_list_due&json_callback=JSON_CALLBACK"}).
      success(function(data, status) {
        
        $scope.player_list_arr = angular.fromJson(data);
        
        for (var key in $scope.player_list_arr) {

          console.log($scope.player_list_arr[key]);
          if ($scope.player_list_arr[key].active == 1)
            $scope.player_list_arr[key].active = true;
          else
              $scope.player_list_arr[key].active = false;


        }
        $scope.players = $scope.player_list_arr;
 
      }).
        error(function(data, status) {
          console.log("View user request failed");
          $scope.msg = "Base station didn't receive: Game stopped by host!";
    }); 


 
 

  }

  
  $scope.getUserName = function(username) {
    $scope.username = username;
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
            if(res.rows.length > 0) {
                console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
                $scope.sqllitedata = "selected";
            } else {
                console.log("No results found");
                $scope.sqllitedata = err;
            }
        }, function (err) {
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
      $state.go($state.current, {}, {reload: true});
  }


 
 




}])  


 
 
 