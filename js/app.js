(function() {

	var app = angular.module('zillow', ['ngMap', 'ngRoute', 'property-module', 'user-module']);

	app.config(function($routeProvider){
		$routeProvider.when('/',{
			templateUrl: 'partials/create-property.html',
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
