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

    .when('/selection', {
      templateUrl: 'selection.html',
      controller: function($http, $rootScope){
      $http.get('/api/city-selector.json')
        .then(function (response){
          console.log(arguments);
          $rootScope.cities = response.data.suggested_cities;
          $rootScope.activities = response.data.suggested_cities.activities;
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
