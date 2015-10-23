var managerInterface = angular.module('managerInterface', ['ngRoute','checklist-model']);

/***********************************************************************************
ROUTING
***********************************************************************************/

managerInterface.config(function($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'login/login.html',
		controller: 'loginCtrl'
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


/***********************************************************************************
LOGIN FACTORY
***********************************************************************************/

managerInterface.factory("login", function($http){

	var cachedLoginStatus = false;
	function checkLoginStatus(callback){
		if(cachedLoginStatus){
			callback(true);
		} else {
			$http({
				method:'GET',
				url: 'login/checklogin.php'
			}).success(function(data){
				if(data == "true"){
					cachedLoginStatus = true;
					callback(true);
				} else {
					cachedLoginStatus = false;
					callback(false);
				}
			})
		}
	}

	return {
		checkLoginStatus: checkLoginStatus
	}

})

/***********************************************************************************
LANGUAGE FACTORY
***********************************************************************************/

managerInterface.factory("language", function($http){

	var cachedData;

	function getData(callback){
		if(cachedData){
			callback(cachedData);
		} else {
			$http.get("language.json").success(function(data){
				cachedData = data;
				callback(data);
			})
		}
	}

	function postalServiceConverter(input, languageFile){

		var inputData = angular.copy(input);

		if(inputData.postal_service == languageFile.companies.data.postalservice.yes){
			inputData.postal_service = 1;
		} else {
			inputData.postal_service = 0;
		}
		
		return inputData;
	}

	return {
		getData: getData,
		postalServiceConverter: postalServiceConverter
	}
})


/***********************************************************************************
GETTING AND FILTERING COMPANY NAMES FACTORY
***********************************************************************************/

managerInterface.factory("getCompanyNames", function($http){

	var cachedData;

	function getData(callback){
		if(cachedData){
			callback(cachedData);
		} else {
			$http.get('companies/fetch_company_names.php').success(function(data){
				cachedData = data;
				callback(data);
			});
		}
	}

	function filterData(inputCompanyName, callback){
		var listOfCompanyNames = [];
		var filteredListOfCompanyNames = [];
		getData(function(data){
			listOfCompanyNames = data;
			if(inputCompanyName.length != 0){
				for(var i=0; i < listOfCompanyNames.length; i++){
					if(listOfCompanyNames[i].company_name.substring(0,inputCompanyName.length).toLowerCase() === inputCompanyName.toLowerCase()){
						filteredListOfCompanyNames.push(listOfCompanyNames[i].company_name);
					}
				}
			}
		});
		callback(filteredListOfCompanyNames);
	}

	return {
		filterList: filterData
	}

})

managerInterface.factory("getManagerNames", function($http){

	var cachedData;

	function getData(callback){
		if(cachedData){
			callback(cachedData);
		} else {
			$http.get('companies/fetch_manager_names.php').success(function(data){
				cachedData = data;
				callback(data);
			});
		}
	}

	function filterData(inputManagerName, callback){
		var listOfManagerNames = [];
		var filteredListOfManagerNames = [];
		getData(function(data){
			listOfManagerNames = data;
			if(inputManagerName.length !==0){
				for(var i=0; i < listOfManagerNames.length; i++){
					if(listOfManagerNames[i].manager_name.substring(0,inputManagerName.length).toLowerCase() === inputManagerName.toLowerCase()){
						filteredListOfManagerNames.push(listOfManagerNames[i].manager_name);
					}
				}
			}
		});
		callback(filteredListOfManagerNames);
	}

	return {
		filterList: filterData
	}

})

managerInterface.factory("getMailingAddresses", function($http){

	var cachedData;

	function getData(callback){
		if(cachedData){
			callback(cachedData);
		} else {
			$http.get('mailing/fetch_mailing_addresses.php').success(function(data){
				cachedData = data;
				callback(data);
			});
		}
	}

	function filterData(inputSenderName, inputSenderAddress, callback){
		var listOfMailingAddresses = [];
		var filteredListOfMailingAddresses = [];
		getData(function(data){
			listOfMailingAddresses = data;
			if(inputSenderName.length !==0 || inputSenderAddress.length !==0){
				for(var i=0; i < listOfMailingAddresses.length; i++){
					if(listOfMailingAddresses[i].sender_name.substring(0,inputSenderName.length).toLowerCase() === inputSenderName.toLowerCase() && listOfMailingAddresses[i].sender_address.substring(0,inputSenderAddress.length).toLowerCase() === inputSenderAddress.toLowerCase()){
						filteredListOfMailingAddresses.push(listOfMailingAddresses[i]);
					}
				}
			}
		});
		callback(filteredListOfMailingAddresses);
	}

	return {
		filterList: filterData
	}

})

managerInterface.factory("companyFunctions", function($http, language){

	var data;
	var language

	language.getData(function(data){
		language = data;
	})

	function convertDate(stringDate){
		var outputDate = new Date(stringDate);
		return outputDate;
	}

	function connectToDatabase(method, url, input, callback){
		$http({
			method: method,
			url: url,
			data: input
		}).success(function(data){
			callback(data);
		})
	}

	function addColourCoding(){
		this.data.map(function(obj){
			if (obj.contract_status == true && (obj.postal_number == "" || obj.postal_number == null)){
				obj.css_color = "yellow";
			} else if (obj.contract_status == true){
				obj.css_color = "green";
			} else {
				obj.css_color = "red";
			}
		})
		return this;
	}

	function formatDateCorrectly(){
		this.data.map(function(obj){
			if(obj.starting_date == "1970-01-01" || obj.starting_date == "0000-00-00" || obj.starting_date == null){
				obj.forwarding_date = null;
			} else {
				obj.starting_date = convertDate(obj.starting_date);
			}
			if(obj.ending_date == "1970-01-01" || obj.ending_date == "0000-00-00" || obj.ending_date == null){
				obj.ending_date = null;
			} else {
				obj.ending_date = convertDate(obj.ending_date);
			}
			if(obj.transfer_date == "1970-01-01" || obj.transfer_date == "0000-00-00" || obj.transfer_date == null){
				obj.transfer_date = null;
			} else {
				obj.transfer_date = convertDate(obj.transfer_date);
			}
			if(obj.invoice_date == "1970-01-01" || obj.invoice_date == "0000-00-00" || obj.invoice_date == null){
				obj.invoice_date = null;
			} else {
				obj.invoice_date = convertDate(obj.invoice_date);
			}
		})
		return this;
	}

	function formatPostalServiceToString(){
		this.data.map(function(obj){
			if(obj.postal_service == 1){
				obj.postal_service = language.companies.data.postalservice.yes;
			} else {
				obj.postal_service = language.companies.data.postalservice.no;
			}
		})
		return this;
	}

	return {
		data: data,
		connectToDatabase: connectToDatabase,
		addColourCoding: addColourCoding,
		formatDateCorrectly: formatDateCorrectly,
		formatPostalServiceToString: formatPostalServiceToString
	}

})

managerInterface.factory("mailFunctions", function($http){

	var data;

	function convertDate(stringDate){
		var outputDate = new Date(stringDate);
		return outputDate;
	}

	function connectToDatabase(method, url, input, callback){
		$http({
			method: method,
			url: url,
			data: input
		}).success(function(data){
			callback(data);
		})
	}

	function addColourCoding(){
		this.data.map(function(obj){
			obj.show_input = false;
			if (obj.forwarding_date == null){
				obj.css_color = "yellow";
			} else {
				obj.css_color = "green";
			}
		})
		return this;
	}

	function formatDateCorrectly(){
		this.data.map(function(obj){
			obj.receiving_date = convertDate(obj.receiving_date);
			if(obj.forwarding_date == "1970-01-01" || obj.forwarding_date == "0000-00-00" || obj.forwarding_date == null){
				obj.forwarding_date = null;
			} else {
				obj.forwarding_date = convertDate(obj.forwarding_date);
			}
		})
		return this;
	}

	return {
		data: data,
		connectToDatabase: connectToDatabase,
		addColourCoding: addColourCoding,
		formatDateCorrectly: formatDateCorrectly
	}

})

managerInterface.factory("menuButtons", function(){

	function changeFormDisplay(propertyName, object, callback){
		for(var key in object){
			if(key == propertyName){
				object[key] = true;
			} else {
				object[key] = false;
			}
		}
		callback(object)
	}

	return {
		changeFormDisplay: changeFormDisplay
	}

})

managerInterface.factory("contract", function($http){

	function createContract(input, callback){

		$http({
			method: 'POST',
			url: 'companies/document_create_contract.php',
			data: input
		}).success(function(){
			callback();
		})
	}

	return {
		createContract: createContract
	}

})

managerInterface.factory("receit", function($http){

	function filterList(arrayId, arrayObjects){

		var filteredData = [];
		
		for(var i = 0; i < arrayId.length; i++){
			for(var j = 0; j < arrayObjects.length; j++){
				if(arrayId[i] == arrayObjects[j]["mail_id"]){
					filteredData.push(arrayObjects[j]);
				}
			}
		}

		return(filteredData);
	}

	function createReceit(input, callback){
		$http({
			method: 'POST',
			url: 'mailing/document_create_receit.php',
			data: input
		}).success(function(){
			callback();
		})
	}

	return {
		filterList: filterList,
		createReceit: createReceit
	}

})
