

// place holder for google maps
var originCity = "";
var desinationCity = "";
var waypointCities = [];

//placeholder for google address autofill
var autocompleteorigin, autocompletedestination, autocompleteW ;
var originstart;
var destinationstart;
var wdestinationstart;


;(function(){

  var BASE_URL = "https://hidden-woodland-2621.herokuapp.com";


  angular.module('road-Trip', ['ngRoute','ngCookies'], function($routeProvider){

    $routeProvider.when('/', {
      templateUrl: 'welcome.html',
      controller: function ($location, $rootScope){
        var welcome = this;
        $rootScope.htstyle();

        //auto scroll
        $(function(){$("a.how-works").click(function(){
          $("html,body").animate({scrollTop:$("#categories").offset().top},"1000");return false})});


        //animation for categories
        $('.cfood').on('click', function(){
          $('.cat-pop.fo').toggleClass('active');
          $('.cat-big.fo').toggleClass('hide');
          $('.cat-small.fo').toggleClass('hide');
        });

        $('.cmusic').on('click', function(){
          $('.cat-pop.mu').toggleClass('active');
          $('.cat-big.mu').toggleClass('hide');
          $('.cat-small.mu').toggleClass('hide');
        });

        $('.csports').on('click', function(){
          $('.cat-pop.sp').toggleClass('active');
          $('.cat-big.sp').toggleClass('hide');
          $('.cat-small.sp').toggleClass('hide');
        });

        $('.crecreation').on('click', function(){
          $('.cat-pop.re').toggleClass('active');
          $('.cat-big.re').toggleClass('hide');
          $('.cat-small.re').toggleClass('hide');
        });



        // $rootScope.header.css("background", "");


        welcome.wdestination = wdestinationstart;


      },
      controllerAs: 'welcome'
    })

    .when('/home/user/', {
      templateUrl: 'admin.html',
      controller: function ($http, $location, $routeParams, $rootScope, $scope){

        $rootScope.htealstyle();
        $scope.loading = true; //show loading spinner
        $http.get( BASE_URL + '/api/trips/')
          .then(function (response){
            $scope.loading = false; //hide loading spinner
            $scope.usertrips = response.data;
            $scope.trips = response.data.trips;
            console.log($scope.trips);
          });

        $http.get(BASE_URL + '/api/whoami/')
          .then(function(response){
            $scope.user = response.data;
          });


        }
    })

    .when('/panel-login', {
      templateUrl: 'login.html',
      controller: function($http, $location, $routeParams, $rootScope, $cookies, $scope){
        $rootScope.htealstyle();
        $scope.upvalid = true;
        var login = this;

        login.user = { };

        login.submit = function(){
          $http.post( BASE_URL + '/api/login/', login.user)
            .then(function(response){
              console.log(response);
              var temp = "Token " + response.data.token;
              $cookies.put("zipt", temp);
              $rootScope.login();
              login.user = { };
              temp = "";



              if (!isNaN($cookies.get("currenTrip"))) {
                $location.path('/trip/' + $cookies.get("currenTrip") + '/city/');
                $cookies.remove("currenTrip"); //remove current trip number
                console.log("trip number cookie removed");
              } else {
                $location.path('/home/user/');
              }

            },
            function(){
              $scope.upvalid = false;
            });



          // $http.get(BASE_URL + 'api/whoami', {
          //   headers: {
          //     Authorization: "Basic" + btoa(login.user.username + ":" + login.user.password)
          //   }
          // }).then(function(){
          //   $location.path('/home/user/' + $routeParams.id);
          //   $http.defaults.headers.common.Authorization = "Basic" + btoa(login.user.username + ":" + login.user.password);
          // });

        }; // END login.submit function
      },

      controllerAs: 'login'
    })

    .when('/panel-signup', {
      templateUrl: 'signup.html',
      controller: function($http, $location, $routeParams, $scope, $rootScope, $timeout){
        $rootScope.htealstyle();
        $scope.pwvalid = true;
        $scope.unvalid = true;
        $scope.created = true;
        $scope.exists = true;
        var signup = this;
        signup.user = { };

        signup.createUser = function(){

            var pass1 = document.getElementById('pass1').value;
            var pass2 = document.getElementById('pass2').value;
            if (pass1 !== pass2)
            {
              $scope.pwvalid = false;
              document.getElementById('pass1').value = '';
              document.getElementById('pass2').value = '';
            } else {
              document.getElementById('pass1').value = '';
              document.getElementById('pass2').value = '';
              $scope.pwvalid = true;




              $http.post( BASE_URL + '/api/register/', signup.user)
                .then(function(){

                  $scope.created = false;
                  signup.user = { };

                  (function (){
                    $timeout(function(){
                      $location.path('/panel-login/');
                    }, 2000);
                  }) ();



                }, function (response){
                  $scope.exists = false;
                });



            }






         };
      }, // END controller
      controllerAs: 'signup'
    }) // END .when

      // INTERESTS PAGE
    .when('/trip/:id', {
      templateUrl: 'interests.html',
      controller: function($http, $location, $routeParams, $scope, $rootScope) {
        $rootScope.htealstyle();
        $http.get( BASE_URL + '/api/trip/' + $routeParams.id + '/')
          .then(function(response){

            $rootScope.main = response.data;

            originCity = $rootScope.main.origin;
            desinationCity = $rootScope.main.destination;
          });

        var pick = this;

        pick.selectedInt = { };

        $scope.sports = [{id: 'sport1'}];

        $scope.addNew = function(){
          var newItemNo = $scope.sports.length+1;

          $scope.sports.push({'id':'sport'+ newItemNo});
        };


        $scope.artists = [{id: 'artist1'}];

        $scope.addNewArt = function(){
          var newItem = $scope.artists.length+1;
          $scope.artists.push({'id':'artist'+ newItem});
        };


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
      controller: function($http, $scope, $location, $routeParams, $rootScope, $cookies){
      $rootScope.htealstyle();
      $scope.loading = true; //show loading spinner
      var get1= false;
      var get2= false;
      waypointCities = []; //clears last value of waypoint



       // Get Waypoints and Activites Details for Timeline
      $http.get( BASE_URL + '/api/trip/' + $routeParams.id + '/city/')
        .then(function (response){
          $rootScope.cities = response.data;
          $scope.loading = false; //hide loading spinner


          console.log($rootScope.cities);

          // Generate Waypoint cities in array for Google Maps use
          var waypoints = response.data;
          for (var i in waypoints) {
            var temp = { location: waypoints[i].city_name , stopover: waypoints[i].visited };
            waypointCities.push(temp);
          }

          get1= true;
          bothGetDone();

        });


      // Get Origin and Destination Details for Timeline
      $http.get( BASE_URL + '/api/trip/' + $routeParams.id + '/')
        .then(function(response){

          $rootScope.main = response.data;
          var tripholder = response.data.id;


          console.log($rootScope.main);

          if (response.data.title === null){
            $scope.displayTitle = response.data.origin + " to " + response.data.destination;
          } else {
            $scope.displayTitle = response.data.title;
          }


          get2 =true;
          bothGetDone();

          // Generate Origin and Destination cities in array for Google Maps use
          originCity = $rootScope.main.origin;
          desinationCity = $rootScope.main.destination;
        });


        function bothGetDone (){
          if (get1 && get2) {
            initMap();
          }
        }

        //saving trip, Backend accept title key in an boject to save the TRIP (not saving the title)
      $scope.savetrip = function (){
        var tripToSave = { };
        tripToSave.title = $scope.main.title;
        console.log($http.defaults.headers.common.Authorization);
        console.log(tripToSave);

        //if user is logged-in
        if ($http.defaults.headers.common.Authorization !== undefined){
          // sending to this endpoint saves the trip to the logged user
          $http.post ( BASE_URL + '/api/trip/' + $routeParams.id + '/save/', tripToSave)
          .then ( function (response){
            $cookies.remove("currenTrip"); //remove current trip number (if saved)
            hideSaveButton(); //update save button to hide
            $location.path('/home/user/');

          }
        );
      } //if user is not logged in
        else {
          $cookies.put("currenTrip", tripholder);
          $location.path('/panel-login');
        }

      };

      //listen to changes in input form for new title, calls saveTitle function
      $('input.user-title').on('change', function (){
        $scope.saveTitle();
      });
      //pressing 'enter' will blur iput form
      $('input.user-title').keypress(function (event) {
        if(event.keyCode == 13) {
          $('input.user-title').blur();
      }
      });


      //saving new title
      $scope.saveTitle = function (){
        var titleToSave = { };
        titleToSave.title = $scope.new.title;
        $http.patch ( BASE_URL + '/api/trip/' + $routeParams.id + '/', titleToSave)
        .then ( function (response){
          console.log(response);
      });

    };


      $scope.hideSaveButton = false;

      //hiding save button if trip is already saved on user's trips
      function hideSaveButton (){
        if ($http.defaults.headers.common.Authorization !== undefined) {
          $http.get( BASE_URL + '/api/trips/')
            .then(function (response){
              var usertrips = response.data.trips;
              for (var i in usertrips){
                if (usertrips[i].id == $routeParams.id){
                  $scope.hideSaveButton = true;
                }
              }
              console.log($scope.hideSaveButton);
            });
        }
      };
      hideSaveButton();





    },

  })



    // SELECTION PAGE
    .when('/trip/:id/suggestions', {
      templateUrl: 'selection.html',
      controller: function($http, $rootScope, $scope, $location, $routeParams){
        $rootScope.htealstyle();
        $rootScope.suggestions = { };
        $rootScope.selectedCities = { };

        $scope.loading = true; //show loading spinner

      $http.get( BASE_URL + '/api/trip/' + $routeParams.id + '/suggestions/')
        .then(function (response){
          console.log(response);

          $scope.loading = false; //hide loading spinner

          $rootScope.suggestions = response.data.waypoints;
          $rootScope.selectedCities = response.data;



      }); // END .then

      $http.get( BASE_URL + '/api/trip/' + $routeParams.id + '/')
        .then(function(response){

          $rootScope.main = response.data;

          originCity = $rootScope.main.origin;
          desinationCity = $rootScope.main.destination;
        });




          // SUBMITS THE CHECKED CITIES
          $rootScope.update = function(){

            // change cities stopover to true if they select any activities within that city
            var wp = $rootScope.suggestions;
            function cityTrue (){
            for (var i in wp){
              for (var j in wp[i].activities){
                if( wp[i].activities[j].activity_stopover === true){
                  $rootScope.selectedCities.waypoints[i].stopover = true;
                }
              }
              for (var k in wp[i].artist){
                if( wp[i].artist[k].activity_stopover === true){
                  $rootScope.selectedCities.waypoints[i].stopover = true;
                }
              }
              for (var l in wp[i].food){
                if( wp[i].food[l].activity_stopover === true){
                  $rootScope.selectedCities.waypoints[i].stopover = true;
                }
              }
              for (var m in wp[i].hotels){
                if( wp[i].hotels[m].activity_stopover === true){
                  $rootScope.selectedCities.waypoints[i].stopover = true;
                }
              }
              for (var n in wp[i].sports){
                if( wp[i].sports[n].activity_stopover === true){
                  $rootScope.selectedCities.waypoints[i].stopover = true;
                }
              }
            }
          }
          cityTrue();


              $http.post( BASE_URL + '/api/trip/' + $routeParams.id + '/selections/', $rootScope.selectedCities)
                .then(function(){
                  $location.path('/trip/' + $routeParams.id + '/city/' );
                  $rootScope.suggestions = { };
                  $rootScope.selectedCities = { };
              });
          };

    } // END selection controller function
  }) // END .when



    .when('/start', {
      templateUrl: 'start.html',
      controller: function($http, $location, $rootScope) {
        $rootScope.htealstyle();
        var add = this;
        add.wdestination = wdestinationstart;
        add.trip = { };

        add.next = function(){
          add.trip.origin = originstart;
          add.trip.destination = destinationstart;
          console.log(add.trip);
          $http.post( BASE_URL + '/api/trip/', add.trip)
            .then(function(response){
             $location.path('/trip/' + response.data.id); //TODO: path to interest page
           },
             function(){
               $location.path('/404');
             }
         );
       };
    },
    controllerAs: 'add'
  });


})
.controller ('loginController', function ($cookies, $http, $scope, $location, $rootScope){


  //change header baackground to tranpasrent when on welcome page
  $rootScope.htstyle = function (){
    $rootScope.tstyle = {'background':'transparent'};
  };
  //change header baackground to teal when NOT on welcome page
  $rootScope.htealstyle = function (){
    $rootScope.tstyle = {'background':'#4AAAA5'};
  };

  $http.defaults.headers.common.Authorization = $cookies.get("zipt");
  //updates nav buttons
  function statusUpdate (){

    if ($http.defaults.headers.common.Authorization !== undefined){
      $scope.loggedIn = true;
      console.log("status logged in");
      console.log($http.defaults.headers.common.Authorization);
    } else {
      $scope.loggedIn = false;
      console.log("status logged out");
      console.log($http.defaults.headers.common.Authorization);

    }
  }
    statusUpdate ();

    //TODO: http get whoami to show username in header

    $rootScope.login = function (){
      $http.defaults.headers.common.Authorization = $cookies.get("zipt"); //set token to cookie
      statusUpdate();
      console.log($http.defaults.headers.common.Authorization);

    };

    $rootScope.logout = function (){
      var logoutObject = { };
      $http.post(BASE_URL + '/api/logout/', logoutObject)
      .then (function (response){
        console.log("logged out from server");
        $http.defaults.headers.common.Authorization = undefined;
        statusUpdate();
        $cookies.remove("zipt");  //removes token
        $cookies.remove("currenTrip"); //remove current trip number
        $location.path('/');
        $scope.loggedIn = false;
        console.log($http.defaults.headers.common.Authorization);

    }, function (){
      $http.defaults.headers.common.Authorization = undefined;
      $location.path('/');
      statusUpdate();
    });
  };
})


.filter('removeUSA', function () {
    return function (text) {
  return text ? text.replace(', USA', '') : '';
    };
}); // END MODULE





})(); // END IIFE





///// Google Services

//Google Maps
function initMap() {

  // google map style from https://snazzymaps.com/style/70/unsaturated-browns
  var customMapType = new google.maps.StyledMapType([
    {
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ff4400"
            },
            {
                "saturation": -68
            },
            {
                "lightness": -4
            },
            {
                "gamma": 0.72
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon"
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#0077ff"
            },
            {
                "gamma": 3.1
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "hue": "#00ccff"
            },
            {
                "gamma": 0.44
            },
            {
                "saturation": -33
            }
        ]
    },
    {
        "featureType": "poi.park",
        "stylers": [
            {
                "hue": "#44ff00"
            },
            {
                "saturation": -23
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "hue": "#007fff"
            },
            {
                "gamma": 0.77
            },
            {
                "saturation": 65
            },
            {
                "lightness": 99
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "gamma": 0.11
            },
            {
                "weight": 5.6
            },
            {
                "saturation": 99
            },
            {
                "hue": "#0091ff"
            },
            {
                "lightness": -86
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": -48
            },
            {
                "hue": "#ff5e00"
            },
            {
                "gamma": 1.2
            },
            {
                "saturation": -23
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "saturation": -64
            },
            {
                "hue": "#ff9100"
            },
            {
                "lightness": 16
            },
            {
                "gamma": 0.47
            },
            {
                "weight": 2.7
            }
        ]
    }
      ], {
        name: 'Custom Style'
    });
    var customMapTypeId = 'custom_style';



var map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 41.85, lng: -87.65},
  scrollwheel: false,
  zoom: 8
});

map.mapTypes.set(customMapTypeId, customMapType);
map.setMapTypeId(customMapTypeId);

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

//Google Address Form Autofill
function initAutocompleteO() {

  autocompleteorigin = new google.maps.places.Autocomplete(
    (document.getElementById('autocomplete_origin')),
    {types: ['geocode'],componentRestrictions: {country: "us"}});
  autocompleteorigin.addListener('place_changed', fillInAddressO);

}

function initAutocompleteD() {

  autocompletedestination = new google.maps.places.Autocomplete(
    (document.getElementById('autocomplete_destination')),
    {types: ['geocode'],componentRestrictions: {country: "us"}});
  autocompletedestination.addListener('place_changed', fillInAddressD);
}

function initAutocompleteW() {

  autocompleteW = new google.maps.places.Autocomplete(
    (document.getElementById('welcome_destination')),
    {types: ['geocode'],componentRestrictions: {country: "us"}});
  autocompleteW.addListener('place_changed', fillInAddressW);
}



function fillInAddressO() {
  var place = autocompleteorigin.getPlace();
  console.log(place);

  originstart = place.formatted_address;
  console.log(originstart);
}
function fillInAddressD() {
  var place = autocompletedestination.getPlace();
  destinationstart = place.formatted_address;
  console.log(destinationstart);
}

function fillInAddressW() {
  var place = autocompleteW.getPlace();
  wdestinationstart = place.formatted_address;
  destinationstart = wdestinationstart;
  console.log(wdestinationstart);
}



$('.hamburger').on('click', function(){
  $('.hamburger-nav').slideToggle('show');
});

$('.hamburger-nav li a').on('click', function(){
  $('.hamburger-nav').slideToggle('show');
});
