;(function(){

  angular.module('road-Trip', ['ngRoute'], function($routeProvider){
    $routeProvider.when('/', {
      templateUrl: 'welcome.html',

    })

    .when('/home', {
      templateUrl: 'admin.html',
    })

    .when('/timeline', {
      templateUrl: 'timeline.html',
    })

    .when('/map', {
      templateUrl: 'map.html',
    })

    .when('/panel-login', {
      templateUrl: 'login.html',
    })

    .when('/panel-signup', {
      templateUrl: 'signup.html',
    })

    .when('/selection', {
      templateUrl: 'selection.html',
      controller: function($http, $rootScope, $location){
      $http.get('/api/city-selector.json')
        .then(function (response){
          console.log(arguments);
          $rootScope.cities = response.data.suggested_cities;
          $rootScope.activities = response.data.suggested_cities.activities;
        });

        // $http.post('')
        // .success(function(data){
        //   $location.path('/trip');
        // });

      } // END controller function

    }) // END .when

    .when('/start', {
      templateUrl: 'start.html',
    });

})  // END MODULE

    // ROUTES TO CREATED TRIP
    .config(function($routeProvider, $locationProvider){
      $routeProvider
        .when('/trip/:id',{
          templateUrl: 'timeline.html',
          controller: 'activityController'
        });

}); // END CONFIG.


})(); // END IIFE
