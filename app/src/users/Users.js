(function(){
  'use strict';

  // Prepare the 'users' module for subsequent registration of controllers and delegates
  angular.module('moduleConnector', [ 'ngMaterial'])
.filter('date', function($filter)
{
 return function(input)
 {
  if(input == null){ return ""; } 
 
 	var m = moment(input).format('DD-MMM-YYYY');
 	if(m)
  		return m;
	else
		return '';
 };
});

  ;


})();
