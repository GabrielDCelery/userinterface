
managerInterface.controller('companiesCtrl', function($scope, $http, $window, login, getCompanyNames, getManagerNames, companyFunctions, menuButtons, contract){

	login.checkLoginStatus(function(data){
		if(data){
			$scope.showContent = data;
		} else {
			$window.location.href = '';
		}
	});

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
		payment_method: "cash",
		account_number: "",
		price_of_serv_num: 0,
		price_of_serv_let: "",
		company_address: "",
		company_register_id: "",
		company_tax_id: "",
		postal_number: "",
		postal_service: "yes",
		postal_name: "",
		postal_address: "",
		manager_name: "",
		manager_status: "manager",
		manager_id: "",
		manager_mother_name: "",
		manager_address: "",
		document_holder: "",
		document_holder_address: "",
	}

/* Variable holding the data which email you are sending to comapnies */
	$scope.subjectOfEmail = "Your contract expired";

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
		console.log($scope.display)
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
Search database for short company data
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
Get detailed info of selected companies
***********************************************************************************/

	$scope.formListDetailedCompaniesInfo = function (){
		$scope.companiesDetailed = {};
		$scope.display.data.companiesDetailed = true;
		$scope.display.data.companiesExtendContract = false;
		if($scope.selectedCompanies.id.length == 0){
			alert("You haven't selected anything");
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
		if(data.postal_service == "yes"){
			data.postal_service = 1;
		} else {
			data.postal_service = 0;
		}

		companyFunctions.connectToDatabase(
			'POST',
			'companies/form_overwrite_company_data.php',
			data,
			function(data){
				$scope.formListDetailedCompaniesInfo();
				alert("Data successfully overwritten");
			}
		)
	}

/* Change contract status */
	$scope.formChangeContractStatus = function(){
		if($scope.selectedCompanies.id.length == 0){
			alert("You haven't selected anything");
		} else {
			var alertChangeContract = confirm("Do you want to change the status of the selected company/companies?");
			if(alertChangeContract){
				companyFunctions.connectToDatabase(
					'POST',
					'companies/form_change_contract_status.php',
					$scope.selectedCompanies,
					function(data){
						$scope.sendFormForSearchingCompanyData();
						alert(data);
					}
				)
			}
		}
	}

/* Show detailed information for extending contract */
	$scope.formExtendContract = function(){
		$scope.companyDataForExtendingContract = {};

		$scope.display.data.companiesDetailed = false;
		$scope.display.data.companiesExtendContract = true;

		if($scope.selectedCompanies.id.length == 0){
			alert("You haven't selected anything!");
		} else if($scope.selectedCompanies.id.length > 1) {
			alert("You can only extend the contract of one company at a time!");
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
		companyFunctions.connectToDatabase(
			'POST',
			'companies/form_extend_contract.php',
			data,
			function(data){
				alert(data);
			}
		)
	}

/***********************************************************************************
Send email to selected companies
***********************************************************************************/
	$scope.mailToSelectedCompanies = function (){
		if($scope.selectedCompanies.id.length == 0){
			alert("You haven't selected anything");
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
Add new company to database
***********************************************************************************/

	$scope.formAddNewCompany = function(){
		companyFunctions.connectToDatabase(
			'POST',
			'companies/form_add_new_company.php',
			$scope.addNewCompany,
			function(data){
				alert(data);
			}
		)
	}

/***********************************************************************************
Print Contract
***********************************************************************************/
	
	$scope.newContract = function(input){
		contract.createContract(input, function(){
			window.location.replace("companies/contract.docx");
		})
	}

	$scope.existingContract = function(input){
		contract.createContract(input, function(){
			window.location.replace("companies/contract.docx");
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


})
