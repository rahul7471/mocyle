(function(){
  'use strict';

  angular.module('moduleConnector')
         .service('mainService', ['$q','$window','$http','$httpParamSerializerJQLike','$mdDialog','$rootScope', MenuService]);

  /**
   * Users DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function MenuService($q , $window,$http,$httpParamSerializerJQLike,$mdDialog,$rootScope){
    var vm = this;
      vm.bike ={};
     vm.maps = {};
    var menu = [
      {
        name: 'Home',
        avatar: 'home',
        path: 'home'
      },
      {
        name: ' Our Services',
        avatar: 'service',
        path: 'ourservice'
      },
      {
        name: 'about us',
        avatar: 'team',
        path: 'about'
      }
    ];


    // Promise-based API
    return {
      loadAllUsers : function() {
        // Simulate async nature of real remote calls
        return $q.when(menu);
      },
      getLocation : function () {
        var deferred = $q.defer();

        if (!$window.navigator) {
            $rootScope.$apply(function() {
                deferred.reject(new Error("Geolocation is not supported"));
            });
        } else {
            $window.navigator.geolocation.getCurrentPosition( function (position) {
                $rootScope.$apply(function() {
                    deferred.resolve(position);
                });
            },function (error) {
                $rootScope.$apply(function() {
                    deferred.reject(error);
                });
            });
        }

        return deferred.promise;
    },
    setBike : function(bikelatest) {
    vm.bike = bikelatest;
  },
  getBike :function () {
    return vm.bike;
  },
  setLocation : function (position) {
      vm.position= position
  },
  fetchLocation : function () {
    return vm.position;
  },
  setMap : function (maps) {
    vm.maps = maps;
  },
  getMap : function() {
    return $q.when(vm.maps);
  },
  sharePos : function(pos) {
    $http({
                    method: "post",
                    url: "https://mocyle.com/locate.php",
                    data: $httpParamSerializerJQLike(pos),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });

      },
  bookservice :  function (bike) {
  var deferred = $q.defer();
  var request = $http({
                    method: "post",
                    url: "https://mocyle.com/bookservice.php",
                    data: $httpParamSerializerJQLike(bike),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(function (response) {
                  console.log(response);
                  deferred.resolve(response);
                });
    return deferred.promise;

  },
   hideWait: function (){
          setTimeout(function(){
                   $rootScope.$emit("hide_wait"); 
                },5);
      },
  
  showWait: function (){
              $mdDialog.show({
                controller: 'waitCtrl',
                template: '<md-dialog id="plz_wait" style="background-color:transparent;box-shadow:none">' +
                            '<div layout="row" layout-sm="column" layout-align="center center" aria-label="wait">' +
                                '<md-progress-circular md-mode="indeterminate" ></md-progress-circular>' +
                            '</div>' +
                         '</md-dialog>',
                parent: angular.element(document.body),
                clickOutsideToClose:false,
                fullscreen: false
              })
              .then(function(answer) {
                
              });
       },
      loadAllService : function () {
      var deferred = $q.defer();
    $http.get('/app/src/data/features.json').
        then(function(data) {
          deferred.resolve(data.data);      
        },function(reason) {
          deferred.reject(reason);
        });
        return deferred.promise;
    },
    sendOtpMail : function (phone,mail) {
    var deferred = $q.defer();
    var contact = {
          "email": mail,
          "phone" : phone,
          "countryCode": "91"
       };
 $http({
      method  : "post",
      url     : "https://mocyle.com/sendotp.php?action=verifyByOTPMail",
      data    : $httpParamSerializerJQLike(contact),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then(function(response) {
    if(response.data.response.oneTimePassword){
        deferred.resolve(response.data.response.oneTimePassword);
      }
    else{
        deferred.reject(response);
   }
   });
    return deferred.promise;
    }


    };


  }

})();
