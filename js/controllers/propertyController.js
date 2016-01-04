(function() {

	var app = angular.module('property-module', ['ngMap']);
	app.controller('propertyController', ['$http', '$scope', '$location', '$routeParams', 'NgMap', function(
		$http, $scope, $location, $routeParams, NgMap){
		var vm = this;
		$('#add-equip').tagsinput({
			maxTags: 50,
			allowDuplicates: false
			// tagClass: 'big'
		});
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

		function convertToBase64(fileList, callback) {
			fileList = fileList || [];
			var images = [];
			var funcs = [];
			var itor =[];
			if (fileList.length == 0) return callback(null, null);
			for (var k = 0; k < fileList.length; k++) {
				itor.push(fileList.item(k));
			}

			itor.forEach(function(item) {
				funcs.push(function _convert(done) {
					var fileReader = new FileReader();
					fileReader.onload = function(evt) {
						var srcData = evt.target.result; // <--- data: base64
						images.push(srcData);
						return done();
					};
					fileReader.readAsDataURL(item);
				});
			});

			async.parallel(funcs, function(err, ok) {
				if (err) return callback(err);
				return callback(null, images);
			});
		}

		scope.addProperty = function(property) {
			var fileList = document.getElementById('upload-photos').files;
			property.equipments = $('#add-equip').tagsinput('items');
			convertToBase64(fileList, function convertedCallback(err, images) {
				$http({
					method: 'POST',
					// url: 'http://52.29.132.129/api/properties',
					url: API_URL + '/properties',
					dataType: "json",
					data: property,
					headers: {
						"Content-Type": "application/json; charset=utf-8",
						"Accept": "application/json"
					}
				}).then(function(response) {
					console.log(response);
					var body = response.data.results;
					if (response.data.ok == true) {
						// Lets upload images if it they are.
						var funcs = [];
						if (images.length > 0) {
							images.forEach(function(base64str) {
								funcs.push(function uploadPhoto(done) {
									$http({
										method: 'POST',
										// url: 'http://52.29.132.129/api/properties/' + body._id + '/photos',
										url: API_URL + '/properties/' + body._id + '/photos',
										dataType: "json",
										data: {
											photo: base64str
										},
										headers: {
											"Content-Type": "application/json; charset=utf-8",
											"Accept": "application/json"
										}
									}).then(function successOK(response) {
										//  var body = response.data.results;
										 return done(null, response);
									}, function errorFound(response) {
										return done(response);
									});
								});
							});

							async.parallel(funcs, function photosUploaded(err, ok) {
								console.log(arguments);
								if (err) {
									// Something went wrong to upload photo.
								}

								$('input').removeClass('ng-valid').removeClass('ng-invalid').removeClass('ng-dirty');
								$('textarea').removeClass('ng-invalid').removeClass('ng-valid').removeClass('ng-dirty');
								scope.message = 'Success! property created sucessfully';
								$location.path('/property/' + body._id);
							});
						}
						// scope.property = {};
						// $('input').removeClass('ng-valid').removeClass('ng-invalid').removeClass('ng-dirty');
						// $('textarea').removeClass('ng-invalid').removeClass('ng-valid').removeClass('ng-dirty');
						// scope.message = 'Success! property created sucessfully';
					}
					else{
						scope.message = 'Error! property not created';
					}
				}, function(error) {
					console.log(error);
					scope.message = 'Error! property not created';
				});
			});
		};

		scope.photo = '';
		$scope.uploadImage = function () {
			console.log("Changed");
		}


		// $scope.setFiles = function(form) {
		// 	console.log(1);
		// 	// if ( form.files && form.files[0] ) {
		// 	// 	var fileReader = new FileReader();
		// 	// 	fileReader.onload = function(e) {
		// 	// 	     $('#img').attr( "src", e.target.result );
		// 	// 	     console.log(e.target.result);

		// 	// 	     // keep this in array    $('#base').text( e.target.result );
		// 	// 	};
		// 	// 	fileReader.readAsDataURL( form.files[0] );
		// 	// }
		// };

		$scope.listProperties = function() {
			console.log('helllo..');
			$http({
				method: 'GET',
				url: API_URL + '/properties',
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
			$http({
				method: 'GET',
				// url: 'http://52.29.132.129/api/properties/' + $routeParams.id,
				url: API_URL + '/properties/' + $routeParams.id,

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
