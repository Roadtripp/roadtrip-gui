;(function(){

  angular.module('road-Trip', ['ngRoute'], function($routeProvider){
    $routeProvider.when('/', {
      templateUrl: 'welcome.html',

    })

    .when('/home', {
      templateUrl: 'admin.html',
    })

    .when('/404', {
      templateUrl: '404.html',
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
        });
    }})

    .when('/map', {
      templateUrl: 'map.html',
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
      controller: function($http, $location){
        var newTrip = this;

        newTrip.add = { };
        console.log(newTrip.add);

        newTrip.next = function() {
          console.log('tracer bullet');

        $http.post('https://hidden-woodland-2621.herokuapp.com/api/users/trip/', newTrip.add)
          .then(function(){
            $location.path('/selection'); //TODO: path to interest page
          }, function(){
            $location.path('/selection');
          }
        );
        };
      },
      controllerAs: 'start'
    });

})  // END MODULE

    // ROUTES TO CREATED TRIP
    // .config(function($routeProvider, $locationProvider){
    //   $routeProvider
    //     .when('/trip/:id',{
    //       templateUrl: 'timeline.html',
    //       controller: 'activityController'
    //     });

// }); // END CONFIG.

.controller('tripController', function($scope, $http, $location){
     $scope.add = { };

     console.log($scope.add);

   $scope.next = function(){
     $http.post('https://hidden-woodland-2621.herokuapp.com/api/users/trip/', $scope.add)
       .then(function(){
        $location.path('/selection'); //TODO: path to interest page
  },
        function(){
          $location.path('/404');
        }
);
};
}); // END SIGNUP CONTROLLER




})(); // END IIFE
