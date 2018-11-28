angular.module('app.routes', ['ionicUIRouter'])
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js


  if (!$httpProvider.defaults.headers.get) {
  $httpProvider.defaults.headers.get = {}; 
  }


  $stateProvider
      // All Games & Drills
      .state('home.gamesDrills', {
        url: '/gamesDrills',
        views: {
          'tab2': {
            templateUrl: 'templates/gamesDrills.html',
            controller: 'gamesDrillsCtrl'
          }
        }
      })
      // Individual Game
      .state('game', {
        cache: false,
        url: '/game/:gameid/maxtime/:maxtime/event/:event/firsttoscore/:firsttoscore/max_targets/:max_targets/time_between_waves/:time_between_waves/target_timeout_times/:target_timeout_times/total_misses_allowed/:total_misses_allowed/paddle_sequence/:paddle_sequence/targets_per_station/:targets_per_station/speed/:speed/double_tap/:double_tap/capture_and_hold/:capture_and_hold/target_timeout/:target_timeout/best_of_three/:best_of_three/matchtype/:matchtype/scorelimit/:scorelimit/player_list/:player_list/shoot_no_shoot/:shoot_no_shoot/uid/:uid',
        templateUrl: 'templates/game.html',
        controller: 'gameCtrl',
      })

      // Scores
      .state('home.scores', {
        url: '/scores',
        views: {
          'tab3': {
            templateUrl: 'templates/scores.html',
            controller: 'scoresCtrl'
          },
          'tab4': {
            templateUrl: 'templates/scores.html',
            controller: 'scoresCtrl'
          }
        }
      })
      // Settings
      .state('home.settings', {
        url: '/settings',
        views: {
          'tab5': {
            templateUrl: 'templates/settings.html',
            controller: 'settingsCtrl'
          }
        }
      })
      // Profiles
      .state('home.profile', {
        cache: false,
        url: '/profile',
        views: {
          'tab6': {
            templateUrl: 'templates/profile.html',
            controller: 'profileCtrl'
          }
        }
      })

      // Home page
      .state('home.welcome', {
        url: '/welcome',
        views: {
          'tab1': {
            templateUrl: 'templates/home.html',
            controller: 'home2Ctrl'
          }
        }
      })

      // Home: Battery Levels
      .state('home.diagnostics', {
        cache: false,
        url: '/diagnostics',
        views: {
          'tab1': {
            templateUrl: 'templates/diagnostics.html',
            controller: 'diagnosticsCtrl'
          }
        }
      })
      // Home: Safety
      .state('home.safety', {
        url: '/safety',
        views: {
          'tab1': {
            templateUrl: 'templates/safety.html',
            controller: 'safetyCtrl'
          }
        }
      })

      // Home: version
      .state('home.version', {
        url: '/version',
        views: {
          'tab1': {
            templateUrl: 'templates/version.html',
            controller: 'versionCtrl'
          }
        }
      })

      // Home:  Getting Started
      .state('home.help', {
        url: '/help',
        views: {
          'tab1': {
            templateUrl: 'templates/help.html',
            controller: 'helpCtrl'
          }
        }
      })

      // TODO Home: Build Range -- NEEDS WORK
      .state('home.buildRange', {
        url: '/buildRange',
        views: {
          'tab4': {
            templateUrl: 'templates/buildRange.html',
            controller: 'buildRangeCtrl'
          }
        }
      })

      // Home: Terms & Conditions
      .state('home.terms', {
        url: '/terms',
        views: {
          'tab1': {
            templateUrl: 'templates/terms.html',
            controller: 'termsCtrl'
          }
        }
      })

      // Global Footer tabs
      .state('home', {
        cache: false,
        url: '/home',
        templateUrl: 'templates/tabs.html',
        abstract: true
      })

      // Notifications
 
      .state('notifications', {
        cache: false,
        url: '/notifications',
        templateUrl: 'templates/notifications.html',
        controller: 'notificationsCtrl'
      }) 
 
/*
      .state('notifications', {
        url: '/notifications',
        views: {
          'tab2': {
            templateUrl: 'templates/notifications.html',
            controller: 'notificationsCtrl'
          }
        }
      })
     */
      // Downloads
      .state('download', {
        url: '/download',
        templateUrl: 'templates/download.html',
        controller: 'downloadCtrl'
      })

      // Login
      .state('login', {
        cache: false,
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      });


  // Initialized the Auth0 provider
  // authProvider.init({
  //   domain: AUTH0_DOMAIN,
  //   clientID: AUTH0_CLIENT_ID,
  //   loginState: 'login'
  // });

  $urlRouterProvider.otherwise('/home/welcome');
});