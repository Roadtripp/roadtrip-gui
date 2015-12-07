

// place holder for google maps
var originCity = "";
var desinationCity = "";
var waypointCities = [];

//placeholder for google address autofill
var autocompleteorigin, autocompletedestination, autocompleteW ;
var originstart;
var destinationstart;
var wdestinationstart;

//IIFE for Angular module
;(function(){

  var BASE_URL = "https://hidden-woodland-2621.herokuapp.com";


  angular.module('road-Trip', ['ngRoute','ngCookies'], function($routeProvider){

    $routeProvider

    //WELOME PAGE
    .when('/', {
      templateUrl: 'welcome.html',
      controller: function ($location, $rootScope, $cookies){

        //activates transparent header on welcome page
        $rootScope.htstyle();

        //clears current trip number when welcome page visited
        $cookies.remove("currenTrip");

        //auto scroll on mobile
        $(function(){$("a.how-works").click(function(){
          $("html,body").animate({scrollTop:$("#categories").offset().top},"1000");return false})});


        //animation for categories
        //TODO: refactoring of codes in AngularJS
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
      },
      controllerAs: 'welcome'
    })

    //USER PAGE
    .when('/home/user/', {
      templateUrl: 'admin.html',
      controller: function ($http, $location, $routeParams, $rootScope, $scope){

        // activates teal colored header
        $rootScope.htealstyle();
        $scope.loading = true; //show loading spinner

        // get user trips
        $http.get( BASE_URL + '/api/trips/')
          .then(function (response){
            $scope.loading = false; //hide loading spinner
            $scope.usertrips = response.data;
            $scope.trips = response.data.trips;
          });

        // get user's username
        $http.get(BASE_URL + '/api/whoami/')
          .then(function(response){
            $scope.user = response.data;
          });
        }
    })

    //LOGIN PAGE
    .when('/panel-login', {
      templateUrl: 'login.html',
      controller: function($http, $location, $routeParams, $rootScope, $cookies, $scope){
        $rootScope.htealstyle();
        $scope.upvalid = true;
        var login = this;
        login.user = { };


        //post user login details
        login.submit = function(){
          $http.post( BASE_URL + '/api/login/', login.user)
            .then(function(response){
              var temp = "Token " + response.data.token;
              $cookies.put("zipt", temp);
              $rootScope.login();
              login.user = { };
              temp = "";

              // direct user to last generated timeline page or to user page
              if (!isNaN($cookies.get("currenTrip"))) {
                $location.path('/trip/' + $cookies.get("currenTrip") + '/city/');
                $cookies.remove("currenTrip"); //remove current trip number
              } else {
                $location.path('/home/user/');
              }

            },
            //post response error, show username password error.
            //TODO: verify back-end to clarify error maessages if there is any.
            function(){
              $scope.upvalid = false;
            });

        }; // END login.submit function
      },
      controllerAs: 'login'
    })

    //SIGNUP PAGE
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

        //posting user's signup details
        signup.createUser = function(){

            //checks if passwords match
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

              //post data since passwords matched
              $http.post( BASE_URL + '/api/register/', signup.user)
                .then(function(){
                  $scope.created = false;
                  signup.user = { };

                  //show success signup
                  (function (){
                    $timeout(function(){
                      $location.path('/panel-login/');
                    }, 2000);
                  }) ();

                },
                //post response error signup, username already exists
                function (response){
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
          $http.post( BASE_URL + '/api/trip/' + $routeParams.id + '/interests/', pick.selectedInt)
            .then(function(response){
              $location.path('/trip/' + $routeParams.id + '/suggestions/');
          });
        };


      },
      controllerAs: 'pick'

    }) // END .when


    // TIMELINE PAGE
    .when('/trip/:id/city', {
      templateUrl: 'timeline.html',
      controller: function($http, $scope, $location, $routeParams, $rootScope, $cookies, $timeout){
      $rootScope.htealstyle();
      $scope.loading = true; //show loading spinner
      var get1= false;
      var get2= false;
      waypointCities = []; //clears last value of waypoint
      originCity = "";
      desinationCity = "";
      var tripholder;
      $scope.canSaveTitle = false;
      $scope.titleSaved = false;

      //show map tab for mobile and tablet view
      $('.button-map').on('click', function(){
        $('#map').addClass('active');
        $('.button-map').addClass('active');
        $('.button-timeline').removeClass('active');
        initMap();
      });

      //show timeline tab for mobile and tablet view
      $('.button-timeline').on('click', function(){
        $('#map').removeClass('active');
        $('.button-timeline').addClass('active');
        $('.button-map').removeClass('active');
      });

      // Get Waypoints and Activites Details for Timeline
      $http.get( BASE_URL + '/api/trip/' + $routeParams.id + '/city/')
        .then(function (response){
          $rootScope.cities = response.data;
          $scope.loading = false; //hide loading spinner

          // Generate Waypoint cities in array for Google Maps use
          var waypoints = response.data;
          for (var i in waypoints) {
            var temp = { location: waypoints[i].city_name , stopover: waypoints[i].visited };
            waypointCities.push(temp);
          }

          //call initmap function
          get1= true;
          bothGetDone();
        });


      // Get Origin and Destination Details for Timeline
      $http.get( BASE_URL + '/api/trip/' + $routeParams.id + '/')
        .then(function(response){

          $rootScope.main = response.data;
          tripholder = response.data.id;
          $cookies.put("currenTrip", tripholder);

          if (response.data.title === null){
            $scope.displayTitle = response.data.origin + " to " + response.data.destination;
          } else {
            $scope.displayTitle = response.data.title;
          }

          // Generate Origin and Destination cities in array for Google Maps use
          originCity = $rootScope.main.origin;
          desinationCity = $rootScope.main.destination;

          // call initmap function
          get2 =true;
          bothGetDone();

        });

        //call initmap() if both get reuests are true
        function bothGetDone (){
          if (get1 && get2) {
            initMap();
          }
        }



        //saving trip, Backend accept title key in an boject to save the TRIP (not saving the title)
      $scope.savetrip = function (){
        var tripToSave = { };
        tripToSave.title = $scope.main.title;


        //if user is logged-in
        if ($http.defaults.headers.common.Authorization !== undefined){
          // post to this endpoint saves the trip to the logged user
          $http.post ( BASE_URL + '/api/trip/' + $routeParams.id + '/save/', tripToSave)
          .then ( function (response){
            $cookies.remove("currenTrip"); //remove current trip number (if saved)
            hideSaveButton(); //update save button to hide
            $location.path('/home/user/');
          }
        );
      } //if user is not logged in
        else {
          $location.path('/panel-login');
        }

      };

      //listen to changes in input form for new title, calls saveTitle function
      $('input.user-title').on('change', function (){
        $scope.saveTitle();
      });
      //pressing 'enter' will blur input form
      $('input.user-title').keypress(function (event) {
        if(event.keyCode == 13) {
          $('input.user-title').blur();
      }
      });

      //saving new title by patch
      $scope.saveTitle = function (){
        var titleToSave = { };
        titleToSave.title = $scope.new.title;
        $http.patch ( BASE_URL + '/api/trip/' + $routeParams.id + '/', titleToSave)
        .then ( function (response){
          $scope.titleSaved = true;
          (function (){
            $timeout(function(){
              $scope.titleSaved = false;
            }, 1000);
          }) ();
        },
      function(){
        $scope.canSaveTitle = true;
      }
    );

    };

      //initial values if user not saved the trip
      $scope.hideSaveButton = false;
      $scope.tripsaved = false;

      //hiding save button if trip is already saved on user's trips
      function hideSaveButton (){
        if ($http.defaults.headers.common.Authorization !== undefined) {
          $http.get( BASE_URL + '/api/trips/')
            .then(function (response){
              var usertrips = response.data.trips;
              for (var i in usertrips){
                if (usertrips[i].id == $routeParams.id){
                  $scope.hideSaveButton = true;
                  $scope.tripsaved = true;
                }
              }
            });
        }
      }
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
        $scope.sending = false; //show sending spinner

      $http.get( BASE_URL + '/api/trip/' + $routeParams.id + '/suggestions/')
        .then(function (response){
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
            $scope.sending= true; //show sending spinner

            //change cities.stopover to true if they select any activities within that city
            // as requested by the BE
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

              //post selection
              $http.post( BASE_URL + '/api/trip/' + $routeParams.id + '/selections/', $rootScope.selectedCities)
                .then(function(){
                  $location.path('/trip/' + $routeParams.id + '/city/' );
                  $rootScope.suggestions = { };
                  $rootScope.selectedCities = { };
              });
          };

    } // END selection controller function
  }) // END .when


    //START PAGE
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
//main login controller
.controller ('loginController', function ($cookies, $http, $scope, $location, $rootScope){


  //change header baackground to tranpasrent when on welcome page
  $rootScope.htstyle = function (){
    $rootScope.tstyle = {'background':'transparent'};
  };
  //change header baackground to teal when NOT on welcome page
  $rootScope.htealstyle = function (){
    $rootScope.tstyle = {'background':'#4AAAA5'};
  };

  //clears current trip number
  $cookies.remove("currenTrip");

  // set the token in header from existing cookie on page load
  $http.defaults.headers.common.Authorization = $cookies.get("zipt");

  //updates nav buttons
  function statusUpdate (){
    if ($http.defaults.headers.common.Authorization !== undefined){
      $scope.loggedIn = true;
    } else {
      $scope.loggedIn = false;
    }
  }
    statusUpdate ();

    // set header authorization and update page header
    $rootScope.login = function (){
      $http.defaults.headers.common.Authorization = $cookies.get("zipt"); //set token to cookie
      statusUpdate();
    };

    // clears header authorization and update page header
    $rootScope.logout = function (){
      var logoutObject = { };
      $http.post(BASE_URL + '/api/logout/', logoutObject)
      .then (function (response){
        $http.defaults.headers.common.Authorization = undefined;
        statusUpdate();
        $cookies.remove("zipt");  //removes token
        $cookies.remove("currenTrip"); //remove current trip number
        $location.path('/');

    }, function (){
      //fall back if server logout fails, force clearing of token
      $http.defaults.headers.common.Authorization = undefined;
      $cookies.remove("zipt");  //removes token
      $cookies.remove("currenTrip"); //remove current trip number
      statusUpdate();
      $location.path('/');
    });
  };
})

//removes ", USA" from data getting from server
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

google.maps.event.addDomListener(window, 'resize', function() {
    var center = map.getCenter();
    map.setCenter(center);
});

google.maps.event.trigger(map, "resize");

map.mapTypes.set(customMapTypeId, customMapType);
map.setMapTypeId(customMapTypeId);

var directionsDisplay = new google.maps.DirectionsRenderer({
  map: map
});

// Set destination, origin, waypoints and travel mode.
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
  originstart = place.formatted_address;

}
function fillInAddressD() {
  var place = autocompletedestination.getPlace();
  destinationstart = place.formatted_address;
}

function fillInAddressW() {
  var place = autocompleteW.getPlace();
  wdestinationstart = place.formatted_address;
  destinationstart = wdestinationstart;
}


// hamburger menu behavior
var hb=false;
$('.hamburger').on('click', function(){
  if (hb === false) {
  $('.hamburger-nav').slideToggle('show');
  setTimeout(function(){ hb=true; }, 500);
}
});

$('.hamburger-nav li a').on('click', function(){
  $('.hamburger-nav').slideToggle('show');
  hb=false;
});

$('*:not(.hamburger)').on('click', function(){
  if (hb) {
    $('.hamburger-nav').slideToggle('show');
    hb=false;
  }
});
