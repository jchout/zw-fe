(function() {
  var app = angular.module('zillow', ['ngMap']);

 //  app.controller('propertyController', ['$http',function($http){
 //  	var store = this;
 //  	store.products = [];
 //  	scope.message = '';

	// $http({
	// 	method: 'GET',
	// 	url: 'http://52.29.132.129/api/',
	// 	dataType: "json",
	// 	data: '',
	// 	headers: {
	// 	    "Content-Type": "application/json; charset=utf-8",
	// 	    "Accept": "application/json"
	// 	}
 //    }).then(function(response) {
	// 	   console.log(response);
	//        store.products = response.data;
	//        scope.message = 'Success! User created sucessfully';
	//    }, function(error) {
	//    	   console.log(error);
	//        scope.message = 'Error! User not created';
	//    });

 //  }]);


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



	//$scope.details = { 'password': '-', 'email': '-'};
  	//$scope.getUser = function(){
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
	//};



	
 }]);
  	



  app.controller("TabController", function() {
    this.tab = 1;

    this.isSet = function(checkTab) {
      return this.tab === checkTab;
    };

    this.setTab = function(setTab) {
      this.tab = setTab;
    };
  });



  app.directive("userCreate", function() {
    return {
      restrict: 'E',
      templateUrl: "partials/user-create.html"
    };
  });



app.directive("userGet", function() {
    return {
      restrict: "E",
      templateUrl: "partials/user-get.html"
    };
 });




/* map module */


app.controller('propertyController', ['$http',function($http){

	var scope = this;
	scope.property = {
		'address' : {
			'street1': '',
			'city' : '',
			'country' : '',
			'state' : '',
			'zipCode' : '',
			'coordinates' : []
		},
		'createdBy': {} 
	};
	scope.positions = [{lat:37.7699298,lng:-122.4469157}];
	scope.property.address.coordinates = [37.7699298,-122.4469157];

	scope.addMarker = function(event) {
		var place = event.latLng;
		scope.positions = scope.property.address.coordinates = [];
		scope.positions.push({lat:place.lat(), lng: place.lng()});
		scope.property.address.coordinates.push(place.lat());
		scope.property.address.coordinates.push(place.lng());
		console.log(scope.property.address.coordinates);
	}

	scope.deleteMarkers = function() {
		scope.positions = [];
	};



	scope.addProperty = function(property){
  		console.log(property);
		$http({
			method: 'POST',
			url: 'http://52.29.132.129/api/properties',
			dataType: "json",
			data: property,
			headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Accept": "application/json"
			}
		}).then(function(response) {
			console.log(response);
			if (response.data.ok == true){
				scope.property = {};
				scope.message = 'Success! property created sucessfully';
			}
			else{
				scope.message = 'Error! property not created';
			}
		}, function(error) {
			console.log(error);
			scope.message = 'Error! property not created';
		});
	};



}]);




})();
