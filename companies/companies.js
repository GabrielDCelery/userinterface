
managerInterface.controller('companiesCtrl', function($scope, $http){

/***********************************************************************************
Variables and objects
***********************************************************************************/

/* Objects holding the names of companies and managers in the system */
	/* Fetch list of company names from server */
	$http.get('companies/fetchcompanynames.php').success(function(data){
		$scope.listOfCompanyNames = data;
	})
	/* Fetch list of manager names from server */
	$http.get('companies/fetchmanagernames.php').success(function(data){
		$scope.listOfManagerNames = data;
	})

/* Object holding the data of search properties while searching for a company*/
	$scope.formForSearchingCompanyData = {
		companyName: "",
		managerName: "",
		validContract: true,
		expiredContract: false,
		startingDate: null,
		endingDate: null,
		lastContractOnly: true
	}

/* Object to control what's displayed on the screen and what's not */
	$scope.display = {
		menuSearchCompany: true,
		menuSendEmail: false,
		menuShowDetails: false,
		menuAddNewCompany: true,
		menuReset: true,		
		featureSearchCompany: false,	
		featureShowDetails: false,
		featureSendEmail: false,
		featureAddNewCompany: false,
		dataMenu: false
	}

/* Object holding the data while adding new company */
	$scope.addNewCompany = {
		companyName: "",
		startingDate: new Date(),
		endingDate: new Date(),
		companyPhone: "",
		companyEmail: "",
		invoiceNumber: "",
		serviceProvider: "Zeller és Zeller Kft.",
		transferDate: new Date(),
		invoiceDate: new Date(),
		paymentMethod: "cash",
		accountNumber: "",
		priceOfServNum: 0,
		priceOfServLet: "",
		companyAddress: "",
		companyRegisterId: "",
		companyTaxId: "",
		postalNumber: "",
		postalService: "yes",
		postalName: "",
		postalAddress: "",
		managerName: "",
		managerStatus: "manager",
		managerId: "",
		managerMotherName: "",
		managerAddress: "",
		documentHolder: "",
		documentHolderAddress: "",
	}

/* Variable holding the data which email you are sending to comapnies */
	$scope.subjectOfEmail = "Your contract expired";


/***********************************************************************************
Date converter function
***********************************************************************************/

	$scope.dateConverter = function(stringDate){
		var outputDate = new Date(stringDate);
		return outputDate;
	}

/***********************************************************************************
Feature menu button functions
***********************************************************************************/

	$scope.searchCompanyButton = function(){
		$scope.display.featureSearchCompany = !$scope.display.featureSearchCompany;
		$scope.display.featureShowDetails = false;
		$scope.display.featureSendEmail = false;
		$scope.display.featureAddNewCompany = false;
	}

	$scope.sendEmailButton = function(){
		$scope.display.featureSendEmail = !$scope.display.featureSendEmail;
		$scope.display.featureSearchCompany = false;
		$scope.display.featureShowDetails = false;
		$scope.display.featureAddNewCompany = false;
	}

	$scope.showDetailsButton = function(){
		$scope.display.featureShowDetails = !$scope.display.featureShowDetails;
		$scope.display.featureSearchCompany = false;
		$scope.display.featureSendEmail = false;
		$scope.display.featureAddNewCompany = false;
	}

	$scope.addNewCompanyButton = function(){
		$scope.display.featureAddNewCompany = !$scope.display.featureAddNewCompany;
		$scope.display.featureSearchCompany = false;
		$scope.display.featureSendEmail = false;
		$scope.display.featureShowDetails = false;
	}

/***********************************************************************************
Company searchfield
***********************************************************************************/

	/* Make a google-like filtering of the listed company names */
	$scope.filterListOfCompanyNames = function (){
		$scope.filteredListOfCompanyNames = [];
		if($scope.formForSearchingCompanyData.companyName.length !==0){
			for(var i=0; i < $scope.listOfCompanyNames.length; i++){
				if($scope.listOfCompanyNames[i].company_name.substring(0,$scope.formForSearchingCompanyData.companyName.length).toLowerCase() === $scope.formForSearchingCompanyData.companyName.toLowerCase()){
					 $scope.filteredListOfCompanyNames.push($scope.listOfCompanyNames[i].company_name);
				}
			}
		}
	};

	/* Make a google-like filtering of the listed manager names */
	$scope.filterListOfManagerNames = function (){
		$scope.filteredListOfManagerNames = [];
		if($scope.formForSearchingCompanyData.managerName.length !==0){
			for(var i=0; i < $scope.listOfManagerNames.length; i++){
				if($scope.listOfManagerNames[i].manager_name.substring(0,$scope.formForSearchingCompanyData.managerName.length).toLowerCase() === $scope.formForSearchingCompanyData.managerName.toLowerCase()){
					 $scope.filteredListOfManagerNames.push($scope.listOfManagerNames[i].manager_name);
				}
			}
		}
	};

	/* Insert the selected name into the input field while searching the companies */
	$scope.insertCompanyNameToInputField = function(companyName){
		$scope.formForSearchingCompanyData.companyName = companyName;
		$scope.filteredListOfCompanyNames = [];
	};

	/* Insert the selected name into the input field while searching the manager */
	$scope.insertManagerNameToInputField = function(managerName){
		$scope.formForSearchingCompanyData.managerName = managerName;
		$scope.filteredListOfManagerNames = [];
	};

/***********************************************************************************
List the short company data 
***********************************************************************************/

	$scope.sendFormForSearchingCompanyData = function(){
		$scope.display.featureSearchCompany = false;
		$scope.display.menuSendEmail = true;
		$scope.display.menuShowDetails = true;
		$scope.display.dataMenu = true;

		$scope.companiesDetailed = {};

		var request = $http({
			method: 'POST',
			url: 'companies/fetchcompanydata.php',
			data: $scope.formForSearchingCompanyData
		})

		request.success(function(data){
			$scope.companiesShortList = data;
			/*Adding css properties to the fetched data*/
			$scope.companiesShortList.map(function(obj){
				if (obj.contract_status == true && (obj.postal_number == "" || obj.postal_number == null)){
					obj.css_color = "yellow";
				} else if (obj.contract_status == true){
					obj.css_color = "green";
				} else {
					obj.css_color = "red";
				}
			})
		})
		$scope.selectedCompanies = {
			id: [],
			allChecked: false
		}
	}

/***********************************************************************************
Checklist model
***********************************************************************************/

	$scope.checkAll = function (){
		if ($scope.selectedCompanies.allChecked == false){
			angular.forEach($scope.companiesShortList, function(item){
				$scope.selectedCompanies.id.push(item.company_id)
			})
			$scope.selectedCompanies.allChecked = true;
		} else {
			$scope.selectedCompanies.id = [];
			$scope.selectedCompanies.allChecked = false;
		}
	}


/***********************************************************************************
Get detailed info of selected companies
***********************************************************************************/

	$scope.getDetailedInfoOfSelectedCompanies = function (){
		if($scope.selectedCompanies.id.length == 0){
			alert("You haven't selected anything");
		} else {
			var request = $http({
				method: 'POST',
				url: 'companies/listdetailedinfo.php',
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

				$scope.companiesDetailedMaster = angular.copy($scope.companiesDetailed)
			})
		}
	}

/*
Reset detailed company information form
*/

	$scope.resetCompanyDetailedForm = function(){
		$scope.companiesDetailed = $scope.companiesDetailedMaster;
	}

/*
Overwrite detailed company information
*/

	$scope.overwriteCompanyData = function(data){
		$http({
			method: 'POST',
			url: 'companies/overwritecompanydata.php',
			data: data
		}).success(function(data){
			$scope.getDetailedInfoOfSelectedCompanies();
			alert("Data successfully overwritten")
		})
	}


/***********************************************************************************
Send email to selected companies
***********************************************************************************/
	$scope.sendEmailToSelectedCompanies = function (){
		if($scope.selectedCompanies.id.length == 0){
			alert("You haven't selected anything");
		} else {
			$scope.selectedCompanies.mail = $scope.subjectOfEmail;

			$http({
				method: 'POST',
				url: 'companies/sendmail.php',
				data: $scope.selectedCompanies
			}).success(function(data){
				console.log(data);
			})
		}
	}

/***********************************************************************************
Add new company to database
***********************************************************************************/

	$scope.addNewCompanyForm = function(){
		var request = $http({
				method: 'POST',
				url: 'companies/addnewcompany.php',
				data: $scope.addNewCompany
			}).success(function(data){
				alert("Company successfully added to database")
		})
	}

/***********************************************************************************
Reset data
***********************************************************************************/

	$scope.resetData = function(){
		$scope.confirmReset = confirm("Do you want to reset the page?");
		if($scope.confirmReset == true){
			$scope.formForSearchingCompanyData = {
				companyName: "",
				managerName: "",
				validContract: true,
				expiredContract: false,
				startingDate: null,
				endingDate: null,
				lastContractOnly: true
			}
			$scope.display = {
				menuSearchCompany: true,
				menuSendEmail: false,
				menuShowDetails: false,
				menuAddNewCompany: true,
				menuReset: true,		
				featureSearchCompany: false,	
				featureShowDetails: false,
				featureSendEmail: false,
				featureAddNewCompany: false,
				dataMenu: false
			}
			$scope.addNewCompany = {
				companyName: "",
				startingDate: new Date(),
				endingDate: new Date(),
				companyPhone: "",
				companyEmail: "",
				invoiceNumber: "",
				serviceProvider: "Zeller és Zeller Kft.",
				transferDate: new Date(),
				invoiceDate: new Date(),
				paymentMethod: "cash",
				accountNumber: "",
				priceOfServNum: 0,
				priceOfServLet: "",
				companyAddress: "",
				companyRegisterId: "",
				companyTaxId: "",
				postalNumber: "",
				postalService: "yes",
				postalName: "",
				postalAddress: "",
				managerName: "",
				managerStatus: "manager",
				managerId: "",
				managerMotherName: "",
				managerAddress: "",
				documentHolder: "",
				documentHolderAddress: "",
			}

			$scope.subjectOfEmail = "Your contract expired";

			$scope.filteredListOfCompanyNames = [];
			$scope.filteredListOfManagerNames = [];
			$scope.companiesShortList = {};
			$scope.companiesDetailed = {};
			$scope.companiesDetailedMaster = {};

		}
	}



})
