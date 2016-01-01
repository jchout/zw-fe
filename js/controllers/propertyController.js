(function() {

	var app = angular.module('property-module', ['ngMap']);
	app.controller('propertyController', ['$http', '$scope', '$routeParams', 'NgMap',function($http, $scope, $routeParams, NgMap){
		var vm = this;
		NgMap.getMap().then(function(map) {
	    console.log('map --> ', map);
	    vm.map = map;
	  });
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
		$scope.properties = [];
		$scope.property = {};
		$scope._iw = {};
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
					$('input').removeClass('ng-valid').removeClass('ng-invalid').removeClass('ng-dirty');
					$('textarea').removeClass('ng-invalid').removeClass('ng-valid').removeClass('ng-dirty');
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

		$scope.listProperties = function() {
			console.log('helllo..');
			$http({
				method: 'GET',
				url: 'http://52.29.132.129/api/properties',
				dataType: "json",
				data: {},
				headers: {
					"Content-Type": "application/json; charset=utf-8",
					"Accept": "application/json"
				}
			}).then(function(response) {
				var body = response.data;
				if (!body.ok) {
					 return alert('We cannot pull properties at the moment.');
				}

				var results = body.results;
				results = results.map(function (record) {
					// record.address.lat = "-25.363882";
					// record.address.lng = "131.044922";
					console.log(record.address.coordinates);
					record.address.lat = record.address.coordinates[0];
					record.address.lng = record.address.coordinates[1];
					return record;
				});

				console.log(results);
				$scope.properties = results;

			}, function(error) {
				console.log(error);
				scope.message = 'Error! property not created';
			});
		};

		$scope.showDetails = function(record) {
			console.log('Show>>>', $scope._iw);
			 vm.map.showInfoWindow('info-window', 'marker-' + record._id);
		}

		$scope.findOne = function findOne() {
			console.log('hello foo');
			$http({
				method: 'GET',
				url: 'http://52.29.132.129/api/properties/' + $routeParams.id,
				dataType: "json",
				data: '',
				headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Accept": "application/json"
				}
			}).then(function(response) {
				$scope.property = response.data.results;
				console.log(response.data.results);

			}, function(error) {
				console.log(error);
			});
		}


	}]);
})();
