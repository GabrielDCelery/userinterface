
managerInterface.controller('companiesCtrl', function($scope, $http){

/***********************************************************************************
Variables and objects
***********************************************************************************/

/* Objects holding the names of companies and managers in the system */
	/* Fetch list of company names from server */
	$http.get('companies/fetch_company_names.php').success(function(data){
		$scope.listOfCompanyNames = data;
	})
	/* Fetch list of manager names from server */
	$http.get('companies/fetch_manager_names.php').success(function(data){
		$scope.listOfManagerNames = data;
	})

/* Object to control what's displayed on the screen and what's not */
	$scope.display = {
		menuSearchCompany: true,
		menuSendEmail: false,
		menuShowDetails: false,
		menuAddNewCompany: true,
		menuReset: true,		
		featureSearchCompany: false,
		featureSendEmail: false,
		featureShowDetails: false,
		featureAddNewCompany: false,
		listedDataMenu: false,
		detailedCompaniesInformation: false,
		extendingContract: false
	}

/* Formdata for searching companies */
	$scope.formForSearchingCompanyData = {
		companyName: "",
		managerName: "",
		validContract: true,
		expiredContract: false,
		startingDate: null,
		endingDate: null,
		lastContractOnly: true
	}

/* Form for adding new company */
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

/* Object holding the detailed companies information */
	$scope.companiesDetailed = [];


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

	$scope.resetDataButton = function(){
		var confirmReset = confirm("Do you want to reset the page?");
		if(confirmReset == true){
			$scope.resetData();
			$scope.resetDisplay();
		}
	}

/***********************************************************************************
Filtering company names or managers before searching and lising data
***********************************************************************************/

	/* Make a google-like filtering of the listed company names */
	$scope.filterListOfCompanyNames = function (input){
		$scope.filteredListOfCompanyNames = [];
		if(input.length !== 0){
			for(var i=0; i < $scope.listOfCompanyNames.length; i++){
				if($scope.listOfCompanyNames[i].company_name.substring(0,input.length).toLowerCase() === input.toLowerCase()){
					 $scope.filteredListOfCompanyNames.push($scope.listOfCompanyNames[i].company_name);
				}
			}
		}
	};

	/* Insert the selected name into the input field while searching the companies */
	$scope.insertCompanyNameToInputField = function(companyName){
		$scope.formForSearchingCompanyData.companyName = companyName;
		$scope.filteredListOfCompanyNames = [];
	};

	/* Make a google-like filtering of the listed manager names */
	$scope.filterListOfManagerNames = function (input){
		$scope.filteredListOfManagerNames = [];
		if(input.length !==0){
			for(var i=0; i < $scope.listOfManagerNames.length; i++){
				if($scope.listOfManagerNames[i].manager_name.substring(0,input.length).toLowerCase() === input.toLowerCase()){
					 $scope.filteredListOfManagerNames.push($scope.listOfManagerNames[i].manager_name);
				}
			}
		}
	};

	/* Insert the selected name into the input field while searching the manager */
	$scope.insertManagerNameToInputField = function(managerName){
		$scope.formForSearchingCompanyData.managerName = managerName;
		$scope.filteredListOfManagerNames = [];
	};

/***********************************************************************************
Search database for short company data
***********************************************************************************/

	$scope.sendFormForSearchingCompanyData = function(){
		$scope.display.featureSearchCompany = false;
		$scope.display.menuSendEmail = true;
		$scope.display.menuShowDetails = true;
		$scope.display.listedDataMenu = true;
		$scope.display.detailedCompaniesInformation = false;
		$scope.display.extendingContract = false;
		$http({
			method: 'POST',
			url: 'companies/form_search_companies.php',
			data: $scope.formForSearchingCompanyData
		}).success(function(data){
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
Get detailed info of selected companies
***********************************************************************************/

	$scope.formListDetailedCompaniesInfo = function (){
		$scope.companiesDetailed = {}
		$scope.display.detailedCompaniesInformation = true;
		$scope.display.extendingContract = false;
		if($scope.selectedCompanies.id.length == 0){
			alert("You haven't selected anything");
		} else {
			$http({
				method: 'POST',
				url: 'companies/form_list_detailed_companies_info.php',
				data: $scope.selectedCompanies
			}).success(function(data){
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
					if(obj.starting_date == "1970-01-01" || obj.starting_date == "0000-00-00" || obj.starting_date == null){
						obj.forwarding_date = null;
					} else {
						obj.starting_date = $scope.dateConverter(obj.starting_date);
					}
					if(obj.ending_date == "1970-01-01" || obj.ending_date == "0000-00-00" || obj.ending_date == null){
						obj.ending_date = null;
					} else {
						obj.ending_date = $scope.dateConverter(obj.ending_date);
					}
					if(obj.transfer_date == "1970-01-01" || obj.transfer_date == "0000-00-00" || obj.transfer_date == null){
						obj.transfer_date = null;
					} else {
						obj.transfer_date = $scope.dateConverter(obj.transfer_date);
					}
					if(obj.invoice_date == "1970-01-01" || obj.invoice_date == "0000-00-00" || obj.invoice_date == null){
						obj.invoice_date = null;
					} else {
						obj.invoice_date = $scope.dateConverter(obj.invoice_date);
					}
				})
				/*Formatting postal service*/
				$scope.companiesDetailed.map(function(obj){
					if(obj.postal_service == 1){
						obj.postal_service = "yes";
					} else {
						obj.postal_service = "no";
					}
				})
				$scope.companiesDetailedMaster = angular.copy($scope.companiesDetailed)
			})
		}
	}

/* Reset detailed company information form */
	$scope.resetCompanyDetailedForm = function(){
		$scope.companiesDetailed = angular.copy($scope.companiesDetailedMaster);
	}

/* Overwrite detailed company information */
	$scope.overwriteCompanyData = function(data){
		if(data.postal_service == "yes"){
			data.postal_service = 1;
		} else {
			data.posta_service = 0;
		}
		$http({
			method: 'POST',
			url: 'companies/form_overwrite_company_data.php',
			data: data
		}).success(function(data){
			$scope.formListDetailedCompaniesInfo();
			alert("Data successfully overwritten")
		})
	}

/* Change contract status */
	$scope.formChangeContractStatus = function(){
		if($scope.selectedCompanies.id.length == 0){
			alert("You haven't selected anything");
		} else {
			var alertChangeContract = confirm("Do you want to change the status of the selected company/companies?");
			if(alertChangeContract){
				$http({
					method: 'POST',
					url: 'companies/form_change_contract_status.php',
					data: $scope.selectedCompanies
				}).success(function(data){
					$scope.sendFormForSearchingCompanyData();
					alert(data);
				})
			}
		}
	}

/* Show detailed information for extending contract */
	$scope.formExtendContract = function(){
		$scope.companyDataForExtendingContract = {};

		$scope.display.detailedCompaniesInformation = false;
		$scope.display.extendingContract = true;

		if($scope.selectedCompanies.id.length == 0){
			alert("You haven't selected anything!");
		} else if($scope.selectedCompanies.id.length > 1) {
			alert("You can only extend the contract of one company at a time!");
		} else {
			$http({
				method: 'POST',
				url: 'companies/form_get_data_for_extending_contract.php',
				data: $scope.selectedCompanies
			}).success(function(data){
				console.log(data)
				$scope.companyDataForExtendingContract = data;
				/*Adding css properties to the fetched data*/
				$scope.companyDataForExtendingContract.map(function(obj){
					if (obj.contract_status == true && (obj.postal_number == "" || obj.postal_number == null)){
						obj.css_color = "yellow";
					} else if (obj.contract_status == true){
						obj.css_color = "green";
					} else {
						obj.css_color = "red";
					}
				})
				/*Formatting the date properly*/			
				$scope.companyDataForExtendingContract.map(function(obj){
					if(obj.starting_date == "1970-01-01" || obj.starting_date == "0000-00-00" || obj.starting_date == null){
						obj.forwarding_date = null;
					} else {
						obj.starting_date = $scope.dateConverter(obj.starting_date);
					}
					if(obj.ending_date == "1970-01-01" || obj.ending_date == "0000-00-00" || obj.ending_date == null){
						obj.ending_date = null;
					} else {
						obj.ending_date = $scope.dateConverter(obj.ending_date);
					}
					if(obj.transfer_date == "1970-01-01" || obj.transfer_date == "0000-00-00" || obj.transfer_date == null){
						obj.transfer_date = null;
					} else {
						obj.transfer_date = $scope.dateConverter(obj.transfer_date);
					}
					if(obj.invoice_date == "1970-01-01" || obj.invoice_date == "0000-00-00" || obj.invoice_date == null){
						obj.invoice_date = null;
					} else {
						obj.invoice_date = $scope.dateConverter(obj.invoice_date);
					}
				})
				/*Formatting postal service*/
				$scope.companyDataForExtendingContract.map(function(obj){
					if(obj.postal_service == 1){
						obj.postal_service = "yes";
					} else {
						obj.postal_service = "no";
					}
				})
				$scope.companyDataForExtendingContractMaster = angular.copy($scope.companyDataForExtendingContract)
			})
		}
	}

/* Reset company extend form */
	$scope.resetCompanyExtendForm = function(){
		$scope.companyDataForExtendingContract = angular.copy($scope.companyDataForExtendingContractMaster);
	}

/* Extend company contract */
	$scope.addExtendedContract = function(data){
		$http({
			method: 'POST',
			url: 'companies/form_extend_contract.php',
			data: data
		}).success(function(data){
			alert(data);
		})
	}

/***********************************************************************************
Send email to selected companies
***********************************************************************************/
	$scope.mailToSelectedCompanies = function (){
		if($scope.selectedCompanies.id.length == 0){
			alert("You haven't selected anything");
		} else {
			$scope.selectedCompanies.mail = $scope.subjectOfEmail;

			$http({
				method: 'POST',
				url: 'companies/mail_to_selected_companies.php',
				data: $scope.selectedCompanies
			}).success(function(data){
				console.log(data);
			})
		}
	}

/***********************************************************************************
Add new company to database
***********************************************************************************/

	$scope.formAddNewCompany = function(){
		var request = $http({
				method: 'POST',
				url: 'companies/form_add_new_company.php',
				data: $scope.addNewCompany
			}).success(function(data){
				alert(data);
		})
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
Reset data
***********************************************************************************/

	$scope.resetData = function(){
		$scope.formForSearchingCompanyData = {
			companyName: "",
			managerName: "",
			validContract: true,
			expiredContract: false,
			startingDate: null,
			endingDate: null,
			lastContractOnly: true
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
		$scope.companiesDetailed = [];
		$scope.companiesDetailedMaster = {};
	}

	$scope.resetDisplay = function(){
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
			listedDataMenu: false,
			detailedCompaniesInformation: false,
			extendingContract: false
		}
	}




})
