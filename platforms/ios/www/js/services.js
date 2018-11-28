angular.module('app.services', ['ngSanitize', 'ngAnimate'])

.factory('BlankFactory', [function(){
 	
 
}])

.service('alertService', [function(openSocketService){
	return {

			getAlerts: function (openSocketService) {

			
			/*
			 	var socket = openSocketService.openSocket();
			  	 socket.on('jsonrows', function(data){
			          $scope.activity = angular.fromJson(data);
			          console.log("************");
			          console.log($scope.activity);
			          console.log("************");
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
/*
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
	            */
	            return "Hello from alert service!";


			}

	}
	
 
}])

.service('openSocketService', [function($scope, alertService, openSocketService, $stateParams, $http, $timeout, $location, $state, $sce){
	return {

			openSocket: function () {

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
		     /*
		     $scope.$on('$destroy', function (event) {

		      socket.removeAllListeners();
		     });
*/	


			 console.log("socket opened");
			 return socket; }

	}
	
 
}])

.service('BlankService', [function(){

}]);

