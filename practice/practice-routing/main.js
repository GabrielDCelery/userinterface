var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'templateOne.html',
		controller: 'ControllerOne'
	}).when('/template2', {
		templateUrl: 'templateTwo.html',
		controller: 'ControllerTwo'
	}).when('/:template3', {
		templateUrl: 'templateThree.html',
		controller: 'ControllerThree'
	}).otherwise({
		redirectTo: '/'
	})

})