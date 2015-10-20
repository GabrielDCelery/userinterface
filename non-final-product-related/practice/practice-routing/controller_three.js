console.log("Controller 3 running")

myApp.controller('ControllerThree', function($scope, $routeParams){
	$scope.name = $routeParams.template3;
	console.log($scope.name);
	console.log("Data 3 fetched")
})