managerInterface.controller('loginCtrl', function($scope, $http, $window){
	$scope.sendLogin = function(input){
		$http({
			method: 'POST',
			url: 'login/login.php',
			data: input
		}).success(function(data){
			if(data == "Login successful!"){
				$window.location.href = $window.location.href + 'companies';
			} else {
				alert(data);
			}
		})
	}
})