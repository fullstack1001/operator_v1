angular.module('app.routes', ['ionicUIRouter'])


.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    

  

  .state('home.gamesDrills', {
    url: '/page2',
    views: {
      'tab1': {
        templateUrl: 'templates/gamesDrills.html',
        controller: 'gamesDrillsCtrl'
      }
    }
  })

 
 
  .state('game', {
    cache: false,
    url: '/game/:gameid/maxtime/:maxtime/max_targets/:max_targets/time_between_waves/:time_between_waves/paddle_sequence/:paddle_sequence/targets_per_station/:targets_per_station/speed/:speed/double_tap/:double_tap/capture_and_hold/:capture_and_hold/target_timeout/:target_timeout/best_of_three/:best_of_three/matchtype/:matchtype/scorelimit/:scorelimit/player_list/:player_list',
    templateUrl: 'templates/game.html',
    controller: 'gameCtrl',
 
  })



  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='home.scores'
      2) Using $state.go programatically:
        $state.go('home.scores');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab6/page3
      /page1/tab2/page3
  */
  .state('home.scores', {
    url: '/page3',
    views: {
      'tab6': {
        templateUrl: 'templates/scores.html',
        controller: 'scoresCtrl'
      },
      'tab2': {
        templateUrl: 'templates/scores.html',
        controller: 'scoresCtrl'
      }
    }
  })


  .state('home.settings', {
    url: '/page4',
    views: {
      'tab3': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  .state('home.profile', {
    cache: false,
    url: '/page12',
    views: {
      'tab7': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

  .state('home', {
    cache: false,
    url: '/page1',
    templateUrl: 'templates/home.html',
    abstract:true
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='home.buildRange'
      2) Using $state.go programatically:
        $state.go('home.buildRange');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab6/page5
      /page1/tab4/page5
  */
  .state('home.buildRange', {
    url: '/page5',
    views: {
      'tab6': {
        templateUrl: 'templates/buildRange.html',
        controller: 'buildRangeCtrl'
      },
      'tab4': {
        templateUrl: 'templates/buildRange.html',
        controller: 'buildRangeCtrl'
      }
    }
  })



  .state('download', {
    url: '/page6',
    templateUrl: 'templates/download.html',
    controller: 'downloadCtrl'
  })

  .state('home.home2', {
    url: '/page7',
    views: {
      'tab6': {
        templateUrl: 'templates/home2.html',
        controller: 'home2Ctrl'
      }
    }
  })

  .state('home.diagnostics', {
    url: '/diagnostics',
    views: {
      'tab6': {
        templateUrl: 'templates/diagnostics.html',
        controller: 'diagnosticsCtrl'
      }
    }
  })

  .state('home.help', {
    url: '/help',
    views: {
      'tab6': {
        templateUrl: 'templates/help.html',
        controller: 'helpCtrl'
      }
    }
  })

    .state('home.safety', {
    url: '/safety',
    views: {
      'tab6': {
        templateUrl: 'templates/safety.html',
        controller: 'safetyCtrl'
      }
    }
  })
    .state('home.terms', {
    url: '/terms',
    views: {
      'tab6': {
        templateUrl: 'templates/terms.html',
        controller: 'termsCtrl'
      }
    }
  })


  .state('realTimeStats', {
    url: '/page11',
    templateUrl: 'templates/realTimeStats.html',
    controller: 'realTimeStatsCtrl'
  })

  .state('home.targetInfo', {
    url: '/targetinfo',
    views: {
      'tab6': {
        templateUrl: 'templates/targetInfo.html',
        controller: 'targetInfoCtrl'
      }
    }
  })

  .state('login', {
    cache: false,
    url: '/page10',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  });

      // Initialized the Auth0 provider
 
    // authProvider.init({
    //   domain: AUTH0_DOMAIN,
    //   clientID: AUTH0_CLIENT_ID,
    //   loginState: 'login'
    // });



    
    $urlRouterProvider.otherwise('/page1/page7');



});