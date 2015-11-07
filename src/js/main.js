

;(function(){

  var BASE_URL = "https://hidden-woodland-2621.herokuapp.com";
  var mapOrigin = "";
  var mapDestination = "";

  angular.module('road-Trip', ['ngRoute'], function($routeProvider){
    $routeProvider.when('/', {
      templateUrl: 'start.html',
    })

    .when('/home', {
      templateUrl: 'admin.html',
    })

    .when('/panel-login', {
      templateUrl: 'login.html',
    })

    .when('/panel-signup', {
      templateUrl: 'signup.html',
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
          mapOrigin = $scope.main.origin;
          mapDestination = $scope.main.destination;
        });







      // $scope.mapIframe = function (a,b) {
      //   return $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/directions?key=AIzaSyCFhgyt2qjQ_2CjcMNSqJpHhtM3wdpPjvU&origin="+ $scope.main.origin + "&destination=" + $scope.main.destination + "&waypoints=Richmond,VA|Washington,DC");
      // }
    }
  })

    .when('/trip/:id/suggestions', {
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


  .when('/trip/:id', {
    templateUrl: 'interests.html',
  })

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


    $("a.button-map").click(function () {
        $('#map').toggleClass("inactive");
    });
    $("a.button-timeline").click(function () {
        $('#map').addClass("inactive");
    });





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
