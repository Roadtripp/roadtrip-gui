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
      controller: function($http, $scope, $location){
      $http.get('/api/timeline.json')
        .then(function (response){
          console.log(arguments);
          $scope.main = response.data;
          $scope.cities = response.data.cities_along;
          $scope.activities = response.data.cities_along.activities;
        })
    }})

    .when('/selection', {
      templateUrl: 'selection.html',
      controller: function($http, $rootScope, $location){
      $http.get('/api/city-selector.json')
        .then(function (response){
          console.log(arguments);
          $rootScope.cities = response.data.suggested_cities;
          $rootScope.activities = response.data.suggested_cities.activities;
        });

        $http.post('')
        .success(function(data){
          $location.path('/trip');
        });

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
