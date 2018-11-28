// Ionic Starter App
var db = null;
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova','ngAudio','ngAnimate',  'ngSanitize', 'app.profileController', 'app.LoginController', 'app.controllers', 'app.homeController','app.gameController', 'app.chooseGameController', 'app.routes', 'app.directives','app.services','ui.router','chart.js'])
 .config(function($ionicConfigProvider) {
   $ionicConfigProvider.views.maxCache(0);
 })

.run(function($ionicPlatform, $rootScope, $location) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false); // false adds 'done' to select fields on iOS
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

