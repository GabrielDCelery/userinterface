managerInterface.controller('mailingCtrl', function($scope, $http){

/***********************************************************************************
Variables and objects
***********************************************************************************/

/* Objects holding the names of companies and managers in the system */
	/* Fetch list of company names from server */
	$http.get('mailing/fetchcompanynames.php').success(function(data){
		$scope.listOfCompanyNames = data;
	})

	/* Fetch list of mailing addresses from server */
	$http.get('mailing/fetchmailingaddresses.php').success(function(data){
		$scope.listOfMailingAddresses = data;
	})

/* Object to control what's displayed on the screen and what's not */
	$scope.display = {
		menuSearchMails: true,
		menuForwardMails: false,
		menuEditMails: false,
		menuAddNewMails: true,
		menuReset: true,
		featureSearchMails: false,
		featureForwardMails: false,
		featureEditMails: false,
		featureAddNewMails: false,
		dataMenu: false
	}

/* Object holding the data of search properties while searching for a company*/
	$scope.formForSearchingMailData = {
		companyName: "",
		startingDate: null,
		endingDate: null,
		nonForwarded: true,
		forwarded: true,
		hasPostalService: true,
		doesntHavePoastalService: true
	}

/* Variables for sorting listed mailing data*/
	$scope.sortShortMailsList = "receiving_date";
	$scope.listingReverse = true;

/* Formdata for forwarding mails*/
	$scope.formForForwarding = {
		forwarding_date: null,
		forwarding_method: null,
		id: null
	}

/* Formdata for adding new mails*/
	$scope.formForAddingNewMails = {
		companyName: "",
		receivingDate: null,
		mails: [{
			senderName: "",
			senderAddress: "",
			activeField: false
		}]
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
		$scope.display.featureSearchMails = !$scope.display.featureSearchMails;
		$scope.display.featureForwardMails = false;
		$scope.display.featureEditMails = false;
		$scope.display.featureAddNewMails = false;
	}

	$scope.forwardMailsButton = function(){
		$scope.display.featureForwardMails = !$scope.display.featureForwardMails;
		$scope.display.featureSearchMails = false;
		$scope.display.featureEditMails = false;
		$scope.display.featureAddNewMails = false;
	}

	$scope.editMailsButton = function(){
		$scope.display.featureEditMails = !$scope.display.featureEditMails;
		$scope.display.featureSearchMails = false;
		$scope.display.featureForwardMails = false;
		$scope.display.featureAddNewMails = false;
	}

	$scope.addNewMailsButton = function(){
		$scope.display.featureAddNewMails = !$scope.display.featureAddNewMails;
		$scope.display.featureSearchMails = false;
		$scope.display.featureEditMails = false;
		$scope.display.featureForwardMails = false;
	}

/***********************************************************************************
Mail searchfield
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

	/* Insert the selected name into the input field while filtering in add new mail */
	$scope.insertCompanyNameToAddNewMailNameField = function(companyName){
		$scope.formForAddingNewMails.companyName = companyName;
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
List the mails
***********************************************************************************/

	$scope.sendFormForSearchingMailData = function(){
		$scope.display.featureSearchMails = false;
		$scope.display.menuForwardMails = true;
		$scope.display.menuEditMails = true;
		$scope.display.dataMenu = true;

		$http({
			method: 'POST',
			url: 'mailing/fetchmaildata.php',
			data: $scope.formForSearchingMailData
		}).success(function(data){
			$scope.mailsShortList = data;
			$scope.mailsShortList.map(function(obj){
				obj.show_input = false;
				if (obj.forwarding_method == null || obj.forwarding_method == ""){
					obj.css_color = "yellow";
				} else {
					obj.css_color = "green";
				}
			})
			/*Formatting the date properly*/			
			$scope.mailsShortList.map(function(obj){
				obj.receiving_date = $scope.dateConverter(obj.receiving_date);
				obj.forwarding_date = $scope.dateConverter(obj.forwarding_date);
			})
			$scope.mailsShortListMaster = angular.copy($scope.mailsShortList);
			console.log(data)
		})
		$scope.selectedMails = {
			id: [],
			allChecked: false
		}
	}

/***********************************************************************************
Edit mails functions
***********************************************************************************/

/*
Edit mails
*/
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

/*
Reset table
*/
	$scope.resetMailData = function(){
		$scope.mailsShortList = angular.copy($scope.mailsShortListMaster);
	}

/*
Overwrite mail data
*/
	$scope.overWriteMailData = function(){
		$scope.confirmOverwrite = confirm("Do you want to ovewrite the data?");
		if($scope.confirmOverwrite == true){
			$http({
				method: 'POST',
				url: 'mailing/overwritemaildata.php',
				data: $scope.mailsShortList
			}).success(function(data){
				$scope.sendFormForSearchingMailData();
				alert(data);
			})
		}
	}

/*
Delete mails
*/
	$scope.deleteMailData = function(){
		if($scope.selectedMails.id.length == 0){
			alert("You haven't selected anything!")
		} else {
			$scope.confirmDelete = confirm("Do you want to delete the selected mails?");
			if($scope.confirmDelete == true){
				$http({
					method: 'POST',
					url: 'mailing/deletemaildata.php',
					data: $scope.selectedMails
				}).success(function(data){
					$scope.sendFormForSearchingMailData();
					alert(data);
				})
			}
		}
	}

/***********************************************************************************
Forward mails functions
***********************************************************************************/

	$scope.forwardMails = function(){
		$scope.confirmForwarding = confirm("Do you want to forward the selected mails?");
		if($scope.confirmForwarding == true){
			$scope.formForForwarding.id = $scope.selectedMails.id;
			$http({
				method: 'POST',
				url: 'mailing/forwardmaildata.php',
				data: $scope.formForForwarding
			}).success(function(data){
				$scope.sendFormForSearchingMailData();
				alert(data);
			})
		}
	}

/***********************************************************************************
Adding new mails
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

	$scope.addNewMailsToTheDatabase = function(){
		$http({
			method: 'POST',
			url: 'mailing/addnewmails.php',
			data: $scope.formForAddingNewMails
		}).success(function(data){
			$scope.sendFormForSearchingMailData();
			alert(data);
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




})