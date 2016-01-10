(function() {
  var app = angular.module('zillow', []);

  app.controller('propertyController', ['$http',function($http){
  	var store = this;
  	store.products = [];



  	// $http.get('http://52.29.132.129/api/', {headers: { 'Accept': 'application/json' }).success(function(data){
  	// 	store.products = data;
  	// });



	// $http({
	// method: 'POST',
	// url: 'http://52.29.132.129/api/',
	// data: serializedData,
	// headers: {
	//     'Content-Type': 'application/json'
	// }}).then(function(data) {
	//        store.products = data;
	//    }, function(error) {
	//        store.products = {};
	//    });



	$http({
		method: 'GET',
		url: 'http://52.29.132.129/api/',
		dataType: "json",
		data: '',
		headers: {
		    "Content-Type": "application/json; charset=utf-8",
		    "Accept": "application/json"
		}
    }).then(function(data) {
		   console.log(data);
	       store.products = data;
	   }, function(error) {
	   	   console.log(data);
	       store.products = data;
	   });



	// function jsonp_callback(data) {
	//     store.products = data;
	// }

	// $http.jsonp('http://52.29.132.129/api?callback=JSON_CALLBACK');
	// // .success(function(data){
	// // 	store.products.push(data);
	// // });


  }]);

})();
