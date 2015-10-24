
angular.module("ConcurrencyClicker",["firebase"])
.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/login', {
        templateUrl: 'login.html',
        controller: 'LoginController',
        resolve: {

        }
    })
    .when('/signup', {
        templateUrl: 'signup.html',
        controller: 'SignupController',
        resolve: {

        }
    })
  .when('/', {
    templateUrl: 'main.html',
    controller: 'MainController'
  })
})
.controller("MainController", function($scope,$http,$firebase){
	var fb_root = new Firebase("https://con-clicker.firebaseio.com");

	$http.get("/ping")
		.success(function(data){
			$scope.pong = data.data;
			console.log(data);
		})
		.error(function(data){
			console.log("Error: "+ data);
		});

})
.controller("LoginController", function($scope,$http,$firebase){
    var fb_root = new Firebase("https://con-clicker.firebaseio.com");
    var token = localStorage.getItem("con_token");

})
.controller("SignupController", function($scope,$http,$firebase){
    var fb_root = new Firebase("https://con-clicker.firebaseio.com");
    var token = localStorage.getItem("con_token");

});
