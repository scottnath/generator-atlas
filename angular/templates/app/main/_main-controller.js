/**
* @ngdoc function
* @name <%= appNameCamel %>.MainCtrl
*
* @description
* Controller that creates an example object
*/
function MainCtrl ($scope) {
  'use strict';
  $scope.shows = [
    'Heros',
    'Real Housewives',
    'Burn Notice'
  ];
}
angular
  .module('<%= appNameCamel %>')
  .controller('MainCtrl', MainCtrl);
