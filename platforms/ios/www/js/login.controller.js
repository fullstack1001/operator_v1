 




 
angular.module('app.LoginController', [])

.controller('LoginController', ['$scope', '$stateParams', 'auth', '$rootScope', 
            '$location', '$state', 'store', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function($scope, $stateParams, auth, $rootScope, $location, $state, store, $http) {


 // function LoginController($scope, $state, auth, store, $rootScope) {
    var vm = this;
 
    function doLogin() {
 
      auth.signin({
        authParams: {
          scope: 'openid offline_access',
          device: 'Mobile device'
        }
      }, function (profile, token, accessToken, state, refreshToken) {
        // Success callback
        store.set('profile', profile);
        
        $rootScope.userprofile = profile;
        console.log($rootScope.userprofile);


        $scope.change = function() {
          $scope.userprofile = profile;
          //$scope.profile_name = profile.name;
        };

        $scope.change();



        store.set('token', token);
        store.set('accessToken', accessToken);
        store.set('refreshToken', refreshToken);
        //$ionicHistory.clearCache();
        $state.go("home.profile");
        // $state.go("home.profile");

 


      }, function () {
        // Error callback
      });
    }

    doLogin();
  //}

  

}])  

 
 