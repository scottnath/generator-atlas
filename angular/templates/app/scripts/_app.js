'use strict';

/**
 * @ngdoc overview
 * @name <%= appNameCamel %>
 * @description
 * # <%= appNameCamel %>
 *
 * Main module of the application.
 */
angular
  .module('<%= appNameCamel %>', [<%= angularModules %>])<% if (ngRoute) { %>
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'main/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })<% } %>;
