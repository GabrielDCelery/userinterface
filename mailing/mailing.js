managerInterface.controller('mailingCtrl', function($scope, $http, $window){

/***********************************************************************************
Variables and objects
***********************************************************************************/

/* Objects holding the names of companies and managers in the system */
	/* Fetch list of company names from server */
	$http.get('mailing/fetch_company_names.php').success(function(data){
		$scope.listOfCompanyNames = data;
	})

	/* Fetch list of mailing addresses from server */
	$http.get('mailing/fetch_mailing_addresses.php').success(function(data){
		$scope.listOfMailingAddresses = data;
	})

/* Object to control what's displayed on the screen and what's not */
	$scope.display = {
		menuSearchMails: true,
		menuForwardMails: false,
		menuEditMails: false,
		menuAddNewMails: true,
		menuReset: true,
		formSearchMails: false,
		formForwardMails: false,
		formEditMails: false,
		formAddNewMails: false,
		listedDataMenu: false
	}

/* Formdata for searching mails */
	$scope.formForSearchingMailData = {
		companyName: "",
		startingDate: null,
		endingDate: null,
		nonForwarded: true,
		forwarded: true,
		hasPostalService: true,
		doesntHavePoastalService: true
	}

/* Formdata for forwarding mails */
	$scope.formForForwardingMails = {
		forwardingDate: null,
		forwardingMethod: null,
		id: null
	}

/* Formdata for adding new mails */
	$scope.formForAddingNewMails = {
		companyName: "",
		receivingDate: null,
		mails: [{
			senderName: "",
			senderAddress: "",
			activeField: false
		}]
	}

/* Variables for sorting listed mailing data*/
	$scope.sortListedMailingData = "receiving_date";
	$scope.reverseListedMailingData = true;	

/* Object holding the id's of selected mails for editing or forwarding */
	$scope.selectedMails = {
		id: [],
		allChecked: false
	}

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

	$scope.searchMailsButton = function(){
		$scope.display.formSearchMails = !$scope.display.formSearchMails;
		$scope.display.formForwardMails = false;
		$scope.display.formEditMails = false;
		$scope.display.formAddNewMails = false;
	}

	$scope.forwardMailsButton = function(){
		$scope.display.formForwardMails = !$scope.display.formForwardMails;
		$scope.display.formSearchMails = false;
		$scope.display.formEditMails = false;
		$scope.display.formAddNewMails = false;
	}

	$scope.editMailsButton = function(){
		$scope.display.formEditMails = !$scope.display.formEditMails;
		$scope.display.formSearchMails = false;
		$scope.display.formForwardMails = false;
		$scope.display.formAddNewMails = false;
	}

	$scope.addNewMailsButton = function(){
		$scope.display.formAddNewMails = !$scope.display.formAddNewMails;
		$scope.display.formSearchMails = false;
		$scope.display.formEditMails = false;
		$scope.display.formForwardMails = false;
	}

	$scope.resetDataButton = function(){
		$scope.confirmReset = confirm("Do you want to reset the page?");
		if($scope.confirmReset == true){
			$scope.resetData();
			$scope.resetDisplay();
		}
	}

/***********************************************************************************
Filtering company names or mailing addresses before searching and lising data
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

	/* Insert the selected name into the input field while filtering in search menu */
	$scope.insertCompanyNameToSearchField = function(companyName){
		$scope.formForSearchingMailData.companyName = companyName;
		$scope.filteredListOfCompanyNames = [];
	};

	$scope.filterListOfMailingAddresses = function(newMail){
		$scope.filteredListOfMailingAddresses = [];
		if(newMail.senderName.length !== 0 || newMail.senderAddress.length !== 0){
			for(var i=0; i < $scope.listOfMailingAddresses.length; i++){
				if($scope.listOfMailingAddresses[i].sender_name.substring(0,newMail.senderName.length).toLowerCase() === newMail.senderName.toLowerCase() && $scope.listOfMailingAddresses[i].sender_address.substring(0,newMail.senderAddress.length).toLowerCase() === newMail.senderAddress.toLowerCase()){
					$scope.filteredListOfMailingAddresses.push($scope.listOfMailingAddresses[i]);
				}
			}
		}
		var index = $scope.formForAddingNewMails.mails.indexOf(newMail);
		for(var i = 0; i < $scope.formForAddingNewMails.mails.length; i++){
			$scope.formForAddingNewMails.mails[i].activeField = false;
		}
		$scope.formForAddingNewMails.mails[index].activeField = true;
	}

	/* Insert the selected name into the input field while filtering in add new mail */
	$scope.insertCompanyNameToAddNewMailNameField = function(companyName){
		$scope.formForAddingNewMails.companyName = companyName;
		$scope.filteredListOfCompanyNames = [];
	};

	$scope.insertMailingAddressToAddNewMailField = function(mailingAddress){
		for(var i = 0; i < $scope.formForAddingNewMails.mails.length; i++){
			if($scope.formForAddingNewMails.mails[i].activeField == true){
				$scope.formForAddingNewMails.mails[i].senderName = mailingAddress.sender_name;
				$scope.formForAddingNewMails.mails[i].senderAddress = mailingAddress.sender_address;
			}
		}
		$scope.filteredListOfMailingAddresses = [];
	}

/***********************************************************************************
Search database for mails and list the results
***********************************************************************************/

	$scope.formSearchMails = function(){

		$scope.display.menuForwardMails = true;
		$scope.display.menuEditMails = true;
		$scope.display.listedDataMenu = true;

		$http({
			method: 'POST',
			url: 'mailing/form_search_mails.php',
			data: $scope.formForSearchingMailData
		}).success(function(data){
			$scope.mailsShortList = data;
			/*Formatting the date properly*/			
			$scope.mailsShortList.map(function(obj){
				obj.receiving_date = $scope.dateConverter(obj.receiving_date);
				if(obj.forwarding_date == "1970-01-01" || obj.forwarding_date == "0000-00-00" || obj.forwarding_date == null){
					obj.forwarding_date = null;
				} else {
					obj.forwarding_date = $scope.dateConverter(obj.forwarding_date);
				}
			})
			/*Adding css property to table rows*/
			$scope.mailsShortList.map(function(obj){
				obj.show_input = false;
				if (obj.forwarding_date == null){
					obj.css_color = "yellow";
				} else {
					obj.css_color = "green";
				}
			})
			$scope.mailsShortListMaster = angular.copy($scope.mailsShortList);
		})

		$scope.selectedMails = {
			id: [],
			allChecked: false
		}
	}

/***********************************************************************************
Edit mails functions
***********************************************************************************/

/* Edit selected mails */
	$scope.editMailData = function(){
		if($scope.selectedMails.id.length == 0){
			alert("You haven't selected anything")
		} else {
			for(var i = 0; i < $scope.mailsShortList.length; i++){
				$scope.mailsShortList[i].show_input = false;
			}
			for(var i = 0; i < $scope.selectedMails.id.length; i++){
				for(var j = 0; j < $scope.mailsShortList.length; j++){
					if($scope.selectedMails.id[i] == $scope.mailsShortList[j].mail_id){
						$scope.mailsShortList[j].show_input = true;
					}
				}
			}
		}
	}

/* Reset listed mails table */
	$scope.resetMailData = function(){
		$scope.mailsShortList = angular.copy($scope.mailsShortListMaster);
	}

/* Overwrite selected mail data */
	$scope.formOverWriteMails = function(){
		var confirmOverwrite = confirm("Do you want to ovewrite the data?");
		if(confirmOverwrite == true){
			$http({
				method: 'POST',
				url: 'mailing/form_overwrite_mails.php',
				data: $scope.mailsShortList
			}).success(function(data){
				$scope.formSearchMails();
				alert(data);
			})
		}
	}

/* Delete slected mails */
	$scope.formDeleteMails = function(){
		if($scope.selectedMails.id.length == 0){
			alert("You haven't selected anything!")
		} else {
			$scope.confirmDelete = confirm("Do you want to delete the selected mails?");
			if($scope.confirmDelete == true){
				$http({
					method: 'POST',
					url: 'mailing/form_delete_mails.php',
					data: $scope.selectedMails
				}).success(function(data){
					$scope.formSearchMails();
					alert(data);
				})
			}
		}
	}

/***********************************************************************************
Forward mails functions
***********************************************************************************/

	$scope.formForwardMails = function(){
		if($scope.selectedMails.id.length > 0){
			if(($scope.formForForwardingMails.forwardingDate != null && $scope.formForForwardingMails.forwardingMethod == null) || ($scope.formForForwardingMails.forwardingDate == null && $scope.formForForwardingMails.forwardingMethod != null)){
				alert("Both fields have to be either empty, or filled!")
			} else {
				$scope.confirmForwarding = confirm("Do you want to forward the selected mails?");
				if($scope.confirmForwarding == true){
					$scope.formForForwardingMails.id = $scope.selectedMails.id;
					$http({
						method: 'POST',
						url: 'mailing/form_forward_mails.php',
						data: $scope.formForForwardingMails
					}).success(function(data){
						$scope.formSearchMails();
						alert(data);
					})
				}
			}
		} else {
			alert("You haven't selected anything!");
		}
	}

/***********************************************************************************
Adding new mails functions
***********************************************************************************/
	$scope.addNewRowToAddMailForm = function(){
		$scope.formForAddingNewMails.mails.push({
			senderName: "",
			senderAddress: ""
		});
	}

	$scope.removeRowFromAddMailForm = function(data){
		var index = $scope.formForAddingNewMails.mails.indexOf(data);
		if(index != -1 && $scope.formForAddingNewMails.mails.length > 1){
			$scope.formForAddingNewMails.mails.splice(index, 1);
		}
	}

	$scope.formAddNewMails = function(){
		var alertToFillData = false;
		if($scope.formForAddingNewMails.companyName == null){
			alertToFillData = true;
		}
		if($scope.formForAddingNewMails.receivingDate == null){
			alertToFillData = true;
		}
		for(var i = 0; i < $scope.formForAddingNewMails.mails.length; i++){
			if($scope.formForAddingNewMails.mails[i].senderName.length == 0 || $scope.formForAddingNewMails.mails[i].senderAddress.length == 0){
				alertToFillData = true;
			}
		}
		if(alertToFillData == true){
			alert("You have to fill all the fields to add mails!")
		} else {
			$http({
				method: 'POST',
				url: 'mailing/form_add_new_mails.php',
				data: $scope.formForAddingNewMails
			}).success(function(data){

				$scope.formForSearchingMailData = {
					companyName: $scope.formForAddingNewMails.companyName,
					startingDate: null,
					endingDate: null,
					nonForwarded: true,
					forwarded: false,
					hasPostalService: true,
					doesntHavePoastalService: true
				}

				$scope.formSearchMails();

				alert(data);
			})
		}
	}

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
Checklist model
***********************************************************************************/

	$scope.checkAll = function (){
		if ($scope.selectedMails.allChecked == false){
			angular.forEach($scope.mailsShortList, function(item){
				$scope.selectedMails.id.push(item.mail_id)
			})
			$scope.selectedMails.allChecked = true;
		} else {
			$scope.selectedMails.id = [];
			$scope.selectedMails.allChecked = false;
		}
	}

/***********************************************************************************
Reset data and display functions
***********************************************************************************/

	$scope.resetData = function(){
		$scope.formForSearchingMailData = {
			companyName: "",
			startingDate: null,
			endingDate: null,
			nonForwarded: true,
			forwarded: true,
			hasPostalService: true,
			doesntHavePoastalService: true
		}
		
		$scope.formForForwardingMails = {
			forwardingDate: null,
			forwardingMethod: null,
			id: null
		}

		$scope.formForAddingNewMails = {
			companyName: "",
			receivingDate: null,
			mails: [{
				senderName: "",
				senderAddress: "",
				activeField: false
			}]
		}

		$scope.sortListedMailingData = "receiving_date";
		$scope.reverseListedMailingData = true;

		$scope.filteredListOfCompanyNames = [];
		$scope.filteredListOfMailingAddresses = [];
		$scope.mailsShortList = {};
		$scope.mailsShortListMaster = {};
	}

	$scope.resetDisplay = function(){
		$scope.display = {
			menuSearchMails: true,
			menuForwardMails: false,
			menuEditMails: false,
			menuAddNewMails: true,
			menuReset: true,
			formSearchMails: false,
			formForwardMails: false,
			formEditMails: false,
			formAddNewMails: false,
			listedDataMenu: false
		}
	}


})