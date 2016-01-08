 (function() {

	var app = angular.module('user-module', []);

	app.controller('UserController', ['$scope', '$http',function($scope, $http){
	  	var scope = this;
	  	scope.user = {};

	  	scope.addUser = function(user){
	  		console.log(user);
			$http({
				method: 'POST',
				url: 'http://52.29.132.129/api/users',
				dataType: "json",
				data: user,
				headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Accept": "application/json"
				}
			}).then(function(response) {
				console.log(response);
				if (response.data.ok == true){
					scope.user = {};
					scope.message = 'Success! User created sucessfully';
				}
				else{
					scope.message = 'Error! User not created';
				}
			}, function(error) {
				console.log(error);
				scope.message = 'Error! User not created';
			});
		};

		scope.updateUser = function(user){
	  		console.log(user);
			$http({
				method: 'POST',
				url: 'http://52.29.132.129/api/users',
				dataType: "json",
				data: user,
				headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Accept": "application/json"
				}
			}).then(function(response) {
				console.log(response);
				if (response.data.ok == true){
					scope.user = {};
					scope.message = 'Success! User updated sucessfully';
				}
				else{
					scope.message = 'Error! User not updated';
				}
			}, function(error) {
				console.log(error);
				scope.message = 'Error! User not updated';
			});
		};

		$http({
			method: 'GET',
			url: 'http://52.29.132.129/api/users/3',
			dataType: "json",
			data: '',
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Accept": "application/json"
			}
		}).then(function(response) {
			console.log(response.data.results);
			$scope.details = response.data.results;
			console.log($scope.details.email);
			console.log($scope.details.password);
		}, function(error) {
			console.log(error);
		});

	}]);

})();