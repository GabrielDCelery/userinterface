var managerInterface = angular.module('managerInterface', ['ngRoute','checklist-model']);

managerInterface.config(function($routeProvider){
	$routeProvider.when('/',{
		templateUrl: 'main/main.html',
		controller: 'indexCtrl'
	}).when('/companies', {
		templateUrl: 'companies/companies.html',
		controller: 'companiesCtrl'
	}).when('/mailing', {
		templateUrl: 'mailing/mailing.html',
		controller: 'mailingCtrl'
	}).when('/invoices/invoices.html', {
		templateUrl: 'invoices/invoices.html',
		controller: 'invoicesCtrl'
	}).otherwise({
		redirectTo: '/'
	})
})

managerInterface.controller('indexCtrl', function($scope){

})