(function(){
  'use strict';

  angular.module('users')
         .service('userService', ['$q','$http','$rootScope','$mdDialog','$httpParamSerializerJQLike',UserService]);

  /**
   * Users DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function UserService($q,$http,$rootScope,$mdDialog,$httpParamSerializerJQLike){
    var vm =this;
    vm.customerdetail = {};
    vm.isloggedin =false;
    vm.loggedInuser = {};
    vm.mocyleid ='';
    var users = [
      {
        name: 'Bookings',
        avatar: 'build'
      },
      {
        name: 'customer survey',
        avatar: 'people' 
      }
    ];

    // Promise-based API
    return {
      loadAllUsers : function() {
        // Simulate async nature of real remote calls
        return $q.when(users);
      },
      fetchData : function (bookingtype) {

        var deferred = $q.defer();
	var url = "https://mocyle.com/admin.php?action="+bookingtype
        $http({
                    method: "post",
                    url: url
                  }).then(function(data){
                    deferred.resolve(data.data);
                  },function(reason){
                    deferred.reject(reason);
                  });

        return deferred.promise;
      },
      fetchSurveyData : function () {
        var deferred = $q.defer();

        $http({
                    method: "post",
                    url: "https://mocyle.com/surveyfetch.php"
                  }).then(function(data){
                    deferred.resolve(data.data);
                  },function(reason){
                    deferred.reject(reason);
                  });

        return deferred.promise;

      },
      setCustomer : function (customer) {

        vm.customerdetail = customer
      },
      getCustomer : function() {
        return vm.customerdetail;
      },
      login :function(user) {
        var deferred = $q.defer();
        $http({
                    method: "post",
                    url: "https://mocyle.com/admin.php?action=login",
                    data : $httpParamSerializerJQLike(user),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                  }).then(function(data){
                    if(data.data.fail){
                    vm.isloggedin = false;
                    vm.loggedInuser='';
                    deferred.reject(data.data.fail);
                  }else{
                      vm.isloggedin=true;
                      vm.loggedInuser = data.data[0];
                      deferred.resolve(data.data[0].name);
                    }
                });

        return deferred.promise;

      },
      isloggedin : function() {
        return vm.isloggedin;

      },
       getAdmin : function () {

        return vm.loggedInuser;
       },
       setloggedin : function (status) {
        vm.isloggedin = status;
        if(status==false)
          vm.loggedInuser=null;
       },
       addAdmin : function(newadmin) {

          var deferred = $q.defer();
            $http({
                    method: "post",
                    url: "https://mocyle.com/admin.php?action=addAdmin",
                    data : $httpParamSerializerJQLike(newadmin),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                  })
                  .then(function(data){
                              if(data.data.fail){
                              deferred.reject(data.data.fail);
                               }else{
                                vm.mocyleid = data.data;
                                deferred.resolve(data.data);
                              }
                          });

        return deferred.promise;


       },
       getMocyleID :function(){
          return vm.mocyleid;
       },
       changepass : function(newpass) {

        var deferred = $q.defer();
            $http({
                    method: "post",
                    url: "https://mocyle.com/admin.php?action=changePass",
                    data : $httpParamSerializerJQLike(newpass),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                  })
                  .then(function(data){
                              if(data.data.fail){
                              deferred.reject(data.data.fail);
                               }else{
                                deferred.resolve(data.data);
                              }
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
       }
    };
  }

})();
