(function() {

	var app = angular.module('property-module', ['ngMap', 'youtube-embed', 'pascalprecht.translate']);

	app.config(function($translateProvider) {
		$translateProvider.translations('en',{
			'APARTMENT': 'Apartment',
			'HOUSE': 'House',
			'BUILDING': 'Building',
			'LOFT': 'Loft',
			'COMMERCIAL': 'Commercial Space',
			'CASTLE': 'Castle'
		});

		$translateProvider.translations('fr',{
			'APARTMENT': 'APppartement',
			'HOUSE': 'Maison',
			'BUILDING': 'Immeuble',
			'LOFT': 'Loft',
			'COMMERCIAL': 'Local commercial',
			'CASTLE': 'Château'
		}).preferredLanguage('fr');

		$translateProvider.useSanitizeValueStrategy('sanitize');
	});
	app.controller('propertyController', ['$http', '$scope', '$location', '$routeParams', '$translate', 'NgMap', function(
		$http, $scope, $location, $routeParams, $translate, NgMap){
			$customSlider = $('.multiple-items');
			setTimeout(function(){
				$customSlider.slick({
	            infinite: false,
	            arrows: true,
	            infinite: true,
	            variableWidth: true,
	            adaptiveHeight: true,
	            responsive: [
	              {
	                breakpoint: 768,
	                settings: {
	                  arrows: false,
	                  centerMode: true,
	                  centerPadding: '40px',
	                  slidesToShow: 3
	              }
	              },
	              {
	                breakpoint: 480,
	                settings: {
	                  arrows: false,
	                  centerMode: true,
	                  centerPadding: '40px',
	                  slidesToShow: 1
	                }
	              }
	            ]
	      });
			}, 0);
		var vm = this;
		vm.API_URL = window.API_URL;
		vm._centerAddress = '30B avenue du Louvre, 78000, Versailles';
		NgMap.getMap().then(function(map) {
	    vm.map = map;
	  });
		var scope = this;
		scope.property = {
			'address' : {
				'street1': '',
				'city' : '',
				'country' : 'FR',
				'state' : '',
				'zipCode' : '',
				'coordinates' : []
			},
			additional_areas: {},
			equipments: {},
			'createdBy': {}
		};
		$scope.properties = [];
		$scope.property = {};

		scope.authenticate = function authenticate() {
			console.log(scope.auth);
			$http({
				method: 'POST',
				url: API_URL + '/users/auth',
				dataType: "json",
				data: {
					email: scope.auth.email,
					password: scope.auth.password,
					propertyId: scope.auth.property
				},
				headers: {
					"Content-Type": "application/json; charset=utf-8",
					"Accept": "application/json"
				}
			}).then(function successCallback(response) {
				console.log(response);
				if (response.data.ok) {
					$location.path('/property/' + scope.auth.property + '/edit');
				}
			}, function errorCallback(response) {
				console.log(response);
			});
		}

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

		function findCoords(property, callback) {
			var addr = [
				property.address.street1,
				property.address.zipCode,
				property.address.city,
				property.address.state,
				property.address.country].filter(Boolean).join(',');
			console.log(addr);
			$.get('http://maps.google.com/maps/api/geocode/json?address=' + addr + '&sensor=false',
			function( data ) {
				if (data.status != 'OK') return callback(new Error('We cannot find the coordinates of the location.'));
				var coords = data.results[0].geometry.location;
				coords = [coords.lat, coords.lng];
				return callback(null, coords);
			});
		}

		scope.addProperty = function(property) {
			// $('#submit-create-property').attr('ng-disabled', true).val('Please wait..');
			console.log(property);
			var fileList = document.getElementById('upload-photos').files;
			findCoords(property, function(err, coords) {
				if (err) {
					// Show error.
					return alert(err.message);
				}
				property.address.coordinates = coords;

				convertToBase64(fileList, function convertedCallback(err, images) {
					$http({
						method: 'POST',
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
											 if (!response.data.ok) return done(response);
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
										console.log('> E: ', arguments);
										return false;
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
							console.log('CANNOT CREATE PROPERTY', response);
						}
					}, function(error) {
						console.log(error);
						scope.message = 'Error! property not created';
					});
				});
			});
		};

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
					record._options = {
						labelContent : '<br />120',
						labelAnchor: "36 61",
						labelClass: 'labelClass',
						// labelStyle: newstyle,
						labelInBackground: false
					};
					return record;
				});

				vm.properties = results;

			}, function(error) {
				console.log(error);
				scope.message = 'Error! property not created';
			});
		};

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
				$scope.fullVideo = $scope.property.video;
			}, function(error) {
				console.log(error);
			});
		};

		// UPDATE the map view when each field changes.
		vm._updateMap = function _updateMap() {
			// prepare address.
			var address = [
				vm.property.address.street1,
				vm.property.address.zipCode,
				vm.property.address.city,
				'France'
			].filter(Boolean).join(', ');
			vm._centerAddress = address;
		};

		vm.showDetails = function showDetails(evt, property) {
			vm.info = property;
			$scope.map.showInfoWindow('iwb', 'm-' + property._id);
			// $scope.map.showInfoWindow(evt.screenPoint, 'iw-' + property._id, property._id);
		};
	}]);
})();
