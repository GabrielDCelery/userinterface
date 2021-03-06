
var app = angular.module('myApp', ["checklist-model"]);

app.controller('searchAndListCompanies', ['$scope', '$http', function($scope, $http){

/********
Google-like search in an input field
********/

	$http.get('features/searchforcompany/searchforname.php').success(function(data){
		$scope.names = data;
		console.log($scope.names)
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

/********
Insert the selected name into the input field
********/

	$scope.clicked = function (companyName){
		$scope.formData.searchName = companyName;
		$scope.searchResults = [];
	};

/********
List the items according to search properties
********/

	$scope.sendForm = function(){

		var request = $http({
			method: 'POST',
			url: 'features/searchforcompany/listnames.php',
			data: $scope.formData
		})
		request.success(function(data){
			$scope.companies = data;
			/*Adding css properties to the fetched data*/
			$scope.companies.map(function(obj){
				if (obj.contract_status == true && (obj.postal_number == "" || obj.postal_number == null)){
					obj.css_color = "yellow";
				} else if (obj.contract_status == true){
					obj.css_color = "green";
				} else {
					obj.css_color = "red";
				}
			})
			console.log($scope.companies)
		})
		$scope.sortField = "company_name";
		$scope.selectedCompanies = {
			id: [],
			allChecked: false
		}
	}

/********
Checklist model
********/


	$scope.checkAll = function (){
		if ($scope.selectedCompanies.allChecked == false){
			/*$scope.selectedCompanies.id = $scope.companies.map(function(item){return item.company_id})*/
			angular.forEach($scope.companies, function(item){
				$scope.selectedCompanies.id.push(item.company_id)
			})
			$scope.selectedCompanies.allChecked = true;
		} else {
			$scope.selectedCompanies.id = [];
			$scope.selectedCompanies.allChecked = false;
		}
	}

/********
Get detailed info of selected companies
********/

	$scope.getDetailedInfo = function (){
		var request = $http({
			method: 'POST',
			url: 'features/searchforcompany/listdetailedinfo.php',
			data: $scope.selectedCompanies
		})
		request.success(function(data){
			$scope.companiesDetailed = data;
			/*Adding css properties to the fetched data*/
			$scope.companiesDetailed.map(function(obj){
				if (obj.contract_status == true && (obj.postal_number == "" || obj.postal_number == null)){
					obj.css_color = "yellow";
				} else if (obj.contract_status == true){
					obj.css_color = "green";
				} else {
					obj.css_color = "red";
				}
			})
			/*Formatting the date properly*/			
			$scope.companiesDetailed.map(function(obj){
				obj.starting_date = $scope.dateConverter(obj.starting_date);
				obj.ending_date = $scope.dateConverter(obj.ending_date);
				obj.transfer_date = $scope.dateConverter(obj.transfer_date);
				obj.invoice_date = $scope.dateConverter(obj.invoice_date);
			})
			console.log($scope.companiesDetailed)
			$scope.companiesDetailedMaster = angular.copy($scope.companiesDetailed)
		})
	}

/********
Form functions
********/

	$scope.resetForm = function(){
		$scope.companiesDetailed = $scope.companiesDetailedMaster;
	}

	$scope.overwriteData = function(data){
		console.log(data)
		$http({
			method: 'POST',
			url: 'features/searchforcompany/overwritenames.php',
			data: data
		}).success(function(data){
			console.log(data)
		})
	}

/********
Date converter function
********/
	
	$scope.dateConverter = function(stringDate){
		var outputDate = new Date(stringDate);
		return outputDate;
	}


}]);