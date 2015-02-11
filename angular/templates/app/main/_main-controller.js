'use strict';

/**
* @ngdoc function
* @name <%= appNameCamel %>.MainCtrl
*
* @description
* Controller that creates an example object
*/

angular.module('<%= appNameCamel %>')
  .controller('MainCtrl', function ($scope) {
    $scope.shows = [
      'Heros',
      'Real Housewives',
      'Burn Notice'
    ];

  });

