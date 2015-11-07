
var originCity = "";
var desinationCity = "";
var waypointCities = [];

;(function(){

  var BASE_URL = "https://hidden-woodland-2621.herokuapp.com";


  angular.module('road-Trip', ['ngRoute'], function($routeProvider){
    $routeProvider.when('/', {
      templateUrl: 'start.html',
    })

    .when('/home/user/:id', {
      templateUrl: 'admin.html',
    })

    .when('/panel-login', {
      templateUrl: 'login.html',
    })

    .when('/panel-signup', {
      templateUrl: 'signup.html',
      controller: function($http, $location, $routeParams){
        var signup = this;

        signup.user = { };

        signup.createUser = function(){
          console.log(signup.user);
        //  $http.post('https://aqueous-sea-6980.herokuapp.com/api/users.json', $scope.user)
        //    .then(function(){
            //  $location.path('/home/user/' + routeParams.id);
          //  });
         };
      }, // END controller
      controllerAs: 'signup'
    }) // END .when

    .when('/404', {
      templateUrl: '404.html',
    })


      // INTERESTS PAGE
    .when('/trip/:id', {
      templateUrl: 'interests.html',
      controller: function($http, $location, $routeParams) {
        var pick = this;

        pick.selectedInt = { };

        pick.interest = function(){
          console.log(pick.selectedInt);
          $http.post( BASE_URL + '/api/trip/' + $routeParams.id + '/interests/', pick.selectedInt)
            .then(function(response){
              console.log(response);
              $location.path('/trip/' + $routeParams.id + '/suggestions/');
              console.log(pick.selectedInt);
          });
        };
      },
      controllerAs: 'pick'
    }) // END .when


    // TIMELINE PAGE
    .when('/trip/:id/city', {
      templateUrl: 'timeline.html',
      controller: function($http, $scope, $location, $routeParams){

      $http.get( BASE_URL + '/api/trip/' + $routeParams.id + '/city/')
        .then(function (response){
          // $scope.main = response.data;
          $scope.cities = response.data;
          var waypoints = response.data;
          console.log($scope.cities);
          for (var i in waypoints) {
            var temp = { location: waypoints[i].city_name , stopover: waypoints[i].visited };
            waypointCities.push(temp);
          }
          console.log(waypointCities);
          initMap();
          // $scope.activities = response.data.cities_along.activities;
        });

      $http.get( BASE_URL + '/api/trip/' + $routeParams.id)
        .then(function(response){
          $scope.main = response.data;
          originCity = $scope.main.origin;
          desinationCity = $scope.main.destination;
          console.log(originCity);
          initMap();
        });

    }
  })

    // SELECTION PAGE
    .when('/trip/:id/suggestions', {
      templateUrl: 'selection.html',
      controller: function($http, $rootScope, $location, $routeParams){

      $http.get( BASE_URL + '/api/trip/' + $routeParams.id + '/suggestions')
        .then(function (response){
          $rootScope.suggestions = response.data.waypoints;
          $rootScope.selectedCities = response.data;
          $rootScope.activities = response.data.waypoints.activities;
          $rootScope.sports = response.data.waypoints.sports;
          $rootScope.foods = response.data.waypoints.food;
          $rootScope.artists = response.data.waypoints.artist;

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






function initMap() {
var map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 41.85, lng: -87.65},
  scrollwheel: false,
  zoom: 7
});

var directionsDisplay = new google.maps.DirectionsRenderer({
  map: map
});

// Set destination, origin and travel mode.
var request = {
  origin: originCity,
  waypoints: waypointCities,
  destination: desinationCity,
  travelMode: google.maps.TravelMode.DRIVING,
};

// Pass the directions request to the directions service.
var directionsService = new google.maps.DirectionsService();
directionsService.route(request, function(response, status) {
if (status == google.maps.DirectionsStatus.OK) {
// Display the route on the map.
directionsDisplay.setDirections(response);
}
});
}
