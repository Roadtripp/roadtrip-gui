;(function(){

  var BASE_URL = "https://hidden-woodland-2621.herokuapp.com";

  angular.module('road-Trip', ['ngRoute'], function($routeProvider){
    $routeProvider.when('/', {
      templateUrl: 'start.html',
    })

    .when('/home', {
      templateUrl: 'admin.html',
    })

    .when('/404', {
      templateUrl: '404.html',
    })

    .when('/trip/:id/city', {
      templateUrl: 'timeline.html',
      controller: function($http, $scope, $location, $routeParams){
      $http.get( BASE_URL + '/api/trip/' + $routeParams.id + '/city/')
        .then(function (response){
          console.log(arguments);
          // $scope.main = response.data;
          $scope.cities = response.data;
          // $scope.activities = response.data.cities_along.activities;
        });


      $http.get( BASE_URL + '/api/trip/' + $routeParams.id)
        .then(function(response){
          console.log(arguments);
          $scope.main = response.data;
        });
    }
  })

    .when('/trip/:id', {
      templateUrl: 'selection.html',
      controller: function($http, $rootScope, $location, $routeParams){


      $http.get( BASE_URL + '/api/trip/' + $routeParams.id + '/suggestions')
        .then(function (response){
          $rootScope.suggestions = response.data.waypoints;
          $rootScope.activities = response.data.waypoints.activities;
          $rootScope.selectedCities = response.data;

      }); // END .then

          // SUBMITS THE CHECKED CITIES
          $rootScope.update = function(city){

            console.log($rootScope.selectedCities);
              $http.post( BASE_URL + '/api/trip/' + $routeParams.id + '/selections/', $rootScope.selectedCities)
                .then(function(){
                  console.log($rootScope.selectedCities);

                  $location.path('/trip/' + $routeParams.id + '/city/' );
              });
          };

    } // END selection controller function
  }) // END .when

    .when('/start', {
      templateUrl: 'start.html',
    });

})  // END MODULE


// START FORM
.controller('tripController', function($scope, $http, $location){
     $scope.add = { };

   $scope.next = function(){
     console.log($scope.add);
     $http.post( BASE_URL + '/api/trip/', $scope.add)
       .then(function(response){
        $location.path('/trip/' + response.data.id); //TODO: path to interest page
      },
        function(){
          $location.path('/404');
        }
    );
  };
}); // END START FORM CONTROLLER




})(); // END IIFE



//TODO:
// ROUTES TO CREATED TRIP
// .config(function($routeProvider, $locationProvider){
//   $routeProvider
//     .when('/trip/:id',{
//       templateUrl: 'timeline.html',
//       controller: 'activityController'
//     });

// }); // END CONFIG.



//TODO: fix start controller

// controller: function($http, $location){
//   var newTrip = this;
//
//   newTrip.add = { };
//   console.log(newTrip.add);
//
//   newTrip.next = function() {
//     console.log('tracer bullet');
//
//   $http.post('https://hidden-woodland-2621.herokuapp.com/api/users/trip/', newTrip.add)
//     .then(function(){
//       $location.path('/selection'); //TODO: path to interest page
//     }, function(){
//       $location.path('/selection');
//     }
//   );
//   };
// },
// controllerAs: 'start'
