
var app = angular.module('myApp', []);

app.controller('searchAndListCompanies', ['$scope', '$http', function($scope, $http){
	$http.get('features/searchforcompany/searchforname.php').success(function(data){
		$scope.names = data;
	})

	$scope.formData = {
		searchName: "",
		validContract: true,
		expiredContract: false,
		startingDate: null,
		endingDate: null,
		uniqueResults: true
	}

	$scope.searchForname = function (){
		$scope.searchResults = [];
		if($scope.formData.searchName.length !==0){
			for(var i=0; i < $scope.names.length; i++){
				if($scope.names[i].company_name.substring(0,$scope.formData.searchName.length).toLowerCase() === $scope.formData.searchName.toLowerCase()){
					 $scope.searchResults.push($scope.names[i].company_name);
				}
			}
		}
	};

	$scope.clicked = function (companyName){
		$scope.formData.searchName = companyName;
		$scope.searchResults = [];
	};

	$scope.sendForm = function(){
		var request = $http({
			method: 'POST',
			url: 'features/searchforcompany/listnames.php',
			data: $scope.formData
		})
		request.success(function(data){
			console.log(data)
			$scope.companies = data;
		})
		$scope.sortField = "company_name";
	}
}]);