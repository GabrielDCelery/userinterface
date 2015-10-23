
managerInterface.controller('companiesCtrl', function($scope, $http, $window, login, language, getCompanyNames, getManagerNames, companyFunctions, menuButtons, contract){

/***********************************************************************************
LOGIN START
***********************************************************************************/

login.checkLoginStatus(function(data){
	if(data){

		$scope.showContent = data;

		language.getData(function(data){
			$scope.language = data;
		


/***********************************************************************************
Logout
***********************************************************************************/

	$scope.logout = function(){
		$http({
			method:'GET',
			url: 'login/logout.php'
		}).success(function(data){
			$window.location.href = '';
		})
	}

/***********************************************************************************
Variables and objects
***********************************************************************************/

/* Object to control what's displayed on the screen and what's not */
	$scope.display = {
		menu: {
			searchCompany: true,
			sendEmail: false,
			showDetails: false,
			extendContract: false,
			addNewCompany: true,
			reset: true
		},

		form: {
			searchCompany: false,
			sendEmail: false,
			showDetails: false,
			extendContract: false,
			addNewCompany: false
		},

		data: {
			companiesShortlist: false,
			companiesDetailed: false,
			companiesExtendContract: false
		}
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
		company_name: "",
		starting_date: new Date(),
		ending_date: new Date(),
		company_phone: "",
		company_email: "",
		invoice_number: "",
		service_provider: "Zeller és Zeller Kft.",
		transfer_date: new Date(),
		invoice_date: new Date(),
		payment_method: $scope.language.companies.data.paymentmethod.cash,
		account_number: "",
		price_of_serv_num: 0,
		price_of_serv_let: "",
		company_address: "",
		company_register_id: "",
		company_tax_id: "",
		postal_number: "",
		postal_service: $scope.language.companies.data.postalservice.yes,
		postal_name: "",
		postal_address: "",
		manager_name: "",
		manager_status: $scope.language.companies.data.managerstatus.manager,
		manager_id: "",
		manager_mother_name: "",
		manager_address: "",
		document_holder: "",
		document_holder_address: "",
	}

/* Variable holding the data which email you are sending to comapnies */
	$scope.subjectOfEmail = $scope.language.companies.form.email.contractexpired;

/* Object holding the detailed companies information */
	$scope.companiesDetailed = [];

/* Object holding the information of checkboxes */
	$scope.selectedCompanies = {
		id: [],
		allChecked: false
	}

/* Master objects */
	$scope.formForSearchingCompanyDataMaster = angular.copy($scope.formForSearchingCompanyData);
	$scope.addNewCompanyMaster = angular.copy($scope.addNewCompany);
	$scope.subjectOfEmailMaster = angular.copy($scope.subjectOfEmail);
	$scope.selectedCompaniesMaster = angular.copy($scope.selectedCompanies);
	$scope.displayMaster = angular.copy($scope.display);

/***********************************************************************************
Menu button functions
***********************************************************************************/
	$scope.searchCompanyButton = function(){
		menuButtons.changeFormDisplay("searchCompany", $scope.display.form, function(data){
			$scope.display.form = data;
		})
	}

	$scope.sendEmailButton = function(){
		menuButtons.changeFormDisplay("sendEmail", $scope.display.form, function(data){
			$scope.display.form = data;
		})
	}

	$scope.showDetailsButton = function(){
		menuButtons.changeFormDisplay("showDetails", $scope.display.form, function(data){
			$scope.display.form = data;
		})
	}

	$scope.extendContractButton = function(){
		menuButtons.changeFormDisplay("extendContract", $scope.display.form, function(data){
			$scope.display.form = data;
		})
	}

	$scope.addNewCompanyButton = function(){
		menuButtons.changeFormDisplay("addNewCompany", $scope.display.form, function(data){
			$scope.display.form = data;
			
		})
	}

	$scope.resetDataButton = function(){
		var confirmReset = confirm($scope.language.companies.alert.resetpage);
		if(confirmReset == true){
			$scope.resetData();
			$scope.resetDisplay();
		}
	}

/***********************************************************************************
FORM - SEARCH / FILTER COMPANY/MANAGER NAMES
***********************************************************************************/

	/* Make a google-like filtering of the listed company names */
	$scope.filterListOfCompanyNames = function(){
		getCompanyNames.filterList($scope.formForSearchingCompanyData.companyName, function(data){
		$scope.filteredListOfCompanyNames = data;
	})};

	/* Insert the selected name into the input field while searching the companies */
	$scope.insertCompanyNameToInputField = function(companyName){
		$scope.formForSearchingCompanyData.companyName = companyName;
		$scope.filteredListOfCompanyNames = [];
	};

	/* Make a google-like filtering of the listed manager names */
	$scope.filterListOfManagerNames = function(){
		getManagerNames.filterList($scope.formForSearchingCompanyData.managerName, function(data){
		$scope.filteredListOfManagerNames = data;
	})};

	/* Insert the selected name into the input field while searching the manager */
	$scope.insertManagerNameToInputField = function(managerName){
		$scope.formForSearchingCompanyData.managerName = managerName;
		$scope.filteredListOfManagerNames = [];
	};

/***********************************************************************************
FORM - SEARCH
***********************************************************************************/

	$scope.sendFormForSearchingCompanyData = function(){
		$scope.display.form.searchCompany = false;
		$scope.display.menu.sendEmail = true;
		$scope.display.menu.showDetails = true;
		$scope.display.menu.extendContract = true;
		$scope.display.data.companiesShortList = true;
		$scope.display.data.companiesDetailed = false;
		$scope.display.data.companiesExtendContract = false;

		companyFunctions.connectToDatabase(
			'POST',
			'companies/form_search_companies.php',
			$scope.formForSearchingCompanyData,
			function(data){
				companyFunctions.data = data;
				companyFunctions.addColourCoding();
				$scope.companiesShortList = companyFunctions.data;
				$scope.selectedCompanies = angular.copy($scope.selectedCompaniesMaster);
			}
		)
	}

/***********************************************************************************
FORM - EMAIL
***********************************************************************************/
	$scope.mailToSelectedCompanies = function (){
		if($scope.selectedCompanies.id.length == 0){
			alert($scope.language.companies.alert.checklistempty);
		} else {
			$scope.selectedCompanies.mail = $scope.subjectOfEmail;
			companyFunctions.connectToDatabase(
				'POST',
				'companies/mail_to_selected_companies.php',
				$scope.selectedCompanies,
				function(data){
					console.log(data);
				}
			)
		}
	}

/***********************************************************************************
FORM - DETAILS
***********************************************************************************/

	$scope.formListDetailedCompaniesInfo = function (){
		$scope.companiesDetailed = {};
		$scope.display.data.companiesDetailed = true;
		$scope.display.data.companiesExtendContract = false;
		if($scope.selectedCompanies.id.length == 0){
			alert($scope.language.companies.alert.checklistempty);
		} else {
			companyFunctions.connectToDatabase(
				'POST',
				'companies/form_list_detailed_companies_info.php',
				$scope.selectedCompanies,
				function(data){
					companyFunctions.data = data;
					companyFunctions.addColourCoding().formatDateCorrectly().formatPostalServiceToString();
					$scope.companiesDetailed = companyFunctions.data;
					$scope.companiesDetailedMaster = angular.copy($scope.companiesDetailed);
				})
		}
	}

/* Reset detailed company information form */
	$scope.resetCompanyDetailedForm = function(){
		$scope.companiesDetailed = angular.copy($scope.companiesDetailedMaster);
	}

/* Overwrite detailed company information */
	$scope.overwriteCompanyData = function(data){

		data = language.postalServiceConverter(data, $scope.language);

		companyFunctions.connectToDatabase(
			'POST',
			'companies/form_overwrite_company_data.php',
			data,
			function(data){
				$scope.formListDetailedCompaniesInfo();
				alert($scope.language.companies.alert.successfuloverwrite);
			}
		)
	}


/***********************************************************************************
FORM - EXTEND
***********************************************************************************/

/* Change contract status */
	$scope.formChangeContractStatus = function(){
		if($scope.selectedCompanies.id.length == 0){
			alert($scope.language.companies.alert.checklistempty);
		} else {
			var alertChangeContract = confirm($scope.language.companies.confirm.changecontractstatus);
			if(alertChangeContract){
				companyFunctions.connectToDatabase(
					'POST',
					'companies/form_change_contract_status.php',
					$scope.selectedCompanies,
					function(data){
						$scope.sendFormForSearchingCompanyData();
						alert($scope.language.companies.alert.changedcontractstatus);
					}
				)
			}
		}
	}


/* Show contract */
	$scope.formExtendContract = function(){
		$scope.companyDataForExtendingContract = {};

		$scope.display.data.companiesDetailed = false;
		$scope.display.data.companiesExtendContract = true;

		if($scope.selectedCompanies.id.length == 0){
			alert($scope.language.companies.alert.checklistempty);
		} else if($scope.selectedCompanies.id.length > 1) {
			alert($scope.language.companies.alert.selectonlyone);
		} else {
			companyFunctions.connectToDatabase(
				'POST',
				'companies/form_get_data_for_extending_contract.php',
				$scope.selectedCompanies,
				function(data){
					companyFunctions.data = data;
					companyFunctions.addColourCoding().formatDateCorrectly().formatPostalServiceToString();
					$scope.companyDataForExtendingContract = companyFunctions.data;
					$scope.companyDataForExtendingContractMaster = angular.copy($scope.companyDataForExtendingContract);
				}
			)
		}
	}

/* Reset company extend form */
	$scope.resetCompanyExtendForm = function(){
		$scope.companyDataForExtendingContract = angular.copy($scope.companyDataForExtendingContractMaster);
	}

/* Extend company contract */
	$scope.addExtendedContract = function(data){

		data = language.postalServiceConverter(data, $scope.language);

		companyFunctions.connectToDatabase(
			'POST',
			'companies/form_extend_contract.php',
			data,
			function(data){
				alert($scope.language.companies.alert.changecontractstatus);
			}
		)
	}

/***********************************************************************************
FORM - ADD NEW
***********************************************************************************/

	$scope.formAddNewCompany = function(data){

		data = language.postalServiceConverter(data, $scope.language);

		companyFunctions.connectToDatabase(
			'POST',
			'companies/form_add_new_company.php',
			data,
			function(data){
				alert($scope.language.companies.alert.newcompanyadded);
			}
		)

	}

/***********************************************************************************
PRINT CONTRACT
***********************************************************************************/
	
	$scope.newContract = function(input){

		input = language.postalServiceConverter(input, $scope.language);

		contract.createContract(input, function(){
			window.location.replace("companies/contract.docx");
		})
	}

/***********************************************************************************
CHECKLIST MODEL
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
RESET DATA
***********************************************************************************/

	$scope.resetData = function(){
		$scope.formForSearchingCompanyData = angular.copy($scope.formForSearchingCompanyDataMaster);
		$scope.addNewCompany = angular.copy($scope.addNewCompanyMaster);
		$scope.subjectOfEmail = angular.copy($scope.subjectOfEmailMaster);

		$scope.filteredListOfCompanyNames = [];
		$scope.filteredListOfManagerNames = [];
		$scope.companiesShortList = {};
		$scope.companiesDetailed = [];
		$scope.companiesDetailedMaster = {};
	}

	$scope.resetDisplay = function(){
		$scope.display = angular.copy($scope.displayMaster);
	}

/***********************************************************************************
LOGIN END
***********************************************************************************/
		})
	} else {
		$window.location.href = '';
	}

});

}) //End of controller
