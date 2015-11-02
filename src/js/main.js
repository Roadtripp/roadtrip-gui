;(function(){

  angular.module('road-Trip', ['ngRoute'], function($routeProvider){
    $routeProvider.when('/', {
      templateUrl: 'welcome.html',

    })

    // .when('/home', {
    //   templateUrl: 'admin.html',
    // })

    .when('/timeline', {
      templateUrl: 'timeline.html',
    })

    .when('/selection', {
      templateUrl: 'selection.html',
    })

    .when('/start', {
      templateUrl: 'start.html',
    });

  });  // END MODULE
})(); // END IIFE
