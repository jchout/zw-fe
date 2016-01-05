(function() {

	var app = angular.module('zillow', ['ngMap', 'ngRoute', 'property-module', 'user-module']);

	app.config(function($routeProvider){
		$routeProvider.when('/',{
			templateUrl: 'partials/homepage-map.view.html',
			controller: "propertyController"
		});

		$routeProvider.when('/property/:id',{
			templateUrl: 'partials/view-property.view.html',
			controller: "propertyController"
		});

		$routeProvider.when('/property/:id/edit',{
			templateUrl: 'partials/edit-property.view.html',
			controller: "propertyController"
		});

		$routeProvider.when('/property/:id/photos',{
			templateUrl: 'partials/view-property.view.html',
			controller: "propertyController"
		});

		$routeProvider.when('/property/:id/video',{
			templateUrl: 'partials/view-video.view.html',
			controller: "propertyController"
		});

		$routeProvider.when('/add',{
			templateUrl: 'partials/property-create.view.html',
			controller: "propertyController"
		});

		$routeProvider.when('/auth',{
			templateUrl: 'partials/auth.view.html',
			controller: "propertyController"
		});


		$routeProvider.when('/test',{
			templateUrl: 'partials/image.html',
			controller: "propertyController"
		});

		$routeProvider.when('/user',{
			templateUrl: 'partials/user.html',
			controller: "UserController"
		});
	});

	app.controller("TabController", function() {
		this.tab = 1;

		this.isSet = function(checkTab) {
		  return this.tab === checkTab;
		};

		this.setTab = function(setTab) {
		  this.tab = setTab;
		};
	});

	/* custom directives */
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

})();
