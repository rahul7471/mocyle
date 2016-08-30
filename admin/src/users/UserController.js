(function(){

  angular
       .module('users')
       .controller('AdminController', [
          'userService', '$mdSidenav', '$mdBottomSheet', '$timeout', '$log','$mdDialog','$mdMedia','$scope',
          AdminController
       ])
       .controller('MapController',[
        'userService','uiGmapGoogleMapApi','$mdDialog', MapController
        ])
       .controller('LoginController',[
        'userService','$mdDialog', LoginController
        ])
       .controller('SignupController',[
        'userService' ,'$mdDialog' ,SignupController

        ])
       .controller('PassResetController',[
        'userService' ,'$mdDialog' ,PassResetController

        ])
       .controller('waitCtrl' , [
              '$mdDialog','$rootScope',
              waitCtrl
        ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function AdminController( userService, $mdSidenav, $mdBottomSheet, $timeout, $log ,$mdDialog,$mdMedia,$scope) {
    var self = this;

    self.selected     = null;
    self.users        = [ ];
    self.selectUser   = selectUser;
    self.toggleList   = toggleUsersList;
    self.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    self.admin= {};
    self.isLoggedin=false;

    self.hidden = false;
      self.isOpen = false;
      self.hover = false;
      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
      $scope.$watch('self.isOpen', function(isOpen) {
        if (isOpen) {
          $timeout(function() {
            $scope.tooltipVisible = self.isOpen;
          }, 600);
        } else {
          $scope.tooltipVisible = self.isOpen;
        }
      });
      self.operation = [
        { name: "logout", icon: "/admin/assets/svg/power-button.svg", direction: "bottom" ,value :"logout"},
        { name: "change password", icon: "/admin/assets/svg/key.svg", direction: "bottom" ,value :"password"},
        { name: "add admin", icon: "/admin/assets/svg/user.svg",      direction: "bottom" ,value:"addadmin"}
      ];


    // Load all registered users

   var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && self.customFullscreen;

   $scope.$watch('ul.admin.selection', function(current, old) {
              
              if(!self.isLoggedin || current.value=="logout"){
                self.isLoggedin=false;
                userService.setloggedin(false);
                $mdDialog.show({
                    controller: 'LoginController',
                    controllerAs: 'lc',
                    templateUrl: '/admin/src/users/view/login.html',
                    clickOutsideToClose: false,
                    escapeToClose: false,
                    fullscreen: useFullScreen
                })
                .then(function(result) {
                 self.admin= userService.getAdmin();
                 self.isLoggedin =true;
                });
              }
              if(self.isLoggedin && current.value=="addadmin"){
                $mdDialog.show({
                    controller: 'SignupController',
                    controllerAs: 'sc',
                    templateUrl: '/admin/src/users/view/signup.html',
                    clickOutsideToClose: true,
                    escapeToClose: true,
                    fullscreen: useFullScreen
                })
                .then(function(result) {
                  console.log(result);
                  vm.admin.selection='';
                });

              }
              if(self.isLoggedin && current.value=="password"){
                $mdDialog.show({
                    controller: 'PassResetController',
                    controllerAs: 'prc',
                    templateUrl: '/admin/src/users/view/reset.html',
                    clickOutsideToClose: true,
                    escapeToClose: true,
                    fullscreen: useFullScreen
                })
                .then(function(result) {
                  console.log(result);
                });

              }
              console.log("welcome user");

            });



    userService
          .loadAllUsers()
          .then( function( users ) {
            self.users    = [].concat(users);
            self.selected = users[0];
            selectUser(self.selected);
          });
$scope.$watch('data.selectedIndex', function(current, old) {
              switch(current) {
                case 0: 	
                 userService.fetchData('quickbooking').then(function(data){
					        self.customers = data;
					      },function(reason) {
					        console.log(reason);
					      });
                			 break;
                case 1: 	
                userService.fetchData('allBookings').then(function(data){
					        self.customers = data;
					      },function(reason) {
					        console.log(reason);
					      });
                			 break;               
              }
            });
    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
      $mdSidenav('left').toggle();
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectUser ( user ) {
      if(user.name=='Bookings'){
        self.booking=true;
      userService.fetchData('quickbooking').then(function(data){
        
        self.customers = data;
       // console.log(data);
      },function(reason) {
        console.log(reason);
      });
    }
    else{
      self.booking=false;
      userService.fetchSurveyData().then(function(data){
        self.customers = data;
       // console.log(data);
      },function(reason) {
        console.log(reason);
      });
    }
    }
    
    self.openmap = function(customer){
    userService.setCustomer(customer);
      $mdDialog.show({
                    controller: 'MapController',
                    controllerAs: 'mc',
                    templateUrl: '/admin/src/users/view/map.html',
                    clickOutsideToClose: true
                })
                .then(function(result) {
                });
    }


  }

  function MapController(userService,uiGmapGoogleMapApi,$mdDialog) {
    var vm = this;
    uiGmapGoogleMapApi.then(function(maps) {
      var customer = userService.getCustomer();
      vm.customerlocation =customer.address;
                          vm.center = {
                                        latitude: customer.lat,
                                        longitude: customer.lan
                                    };
            vm.map = {
                        center: vm.center,
                        zoom: 15
                };
                vm.options = {
                        scrollwheel: false
                };
      vm.marker = {
                        id: 0,
                        coords: vm.center,
                        options: {
                                draggable: false
                        }
                };

  });
  }

  function LoginController(userService,$mdDialog) {

    var vm = this;
        vm.admin={};
        vm.admin.username = null;
        vm.admin.password = null;

        vm.handleSubmit = handleSubmit;

        function handleSubmit() {
          userService.login(vm.admin).then(function(success){          
            $mdDialog.hide();

          },function(reason){
            console.log(reason);
          });
            
        }

  }
  function SignupController(userService,$mdDialog){
var vm= this;
vm.newadmin = {};
vm.onchange = function (){
  if(!vm.newadmin.pass)
    return;
var field = vm.signupForm.password;
if(vm.newadmin.pass==vm.newadmin.againpass)
  field.$setValidity('passwrd',true);
else
  field.$setValidity('passwrd',false);
}
  vm.handleSubmit = function() {
    userService.addAdmin(vm.newadmin).then(function(data){

      $mdDialog.show({
          template:
            '<md-dialog layout="column">' +
            '<md-toolbar flex="20">'+
            '<div class="md-toolbar-tools">'+
            '<span flex></span>'+
            '<h1>Admin Succesfully Created</h1>'+
            '<span flex></span>'+
            '</div>'+
            '</md-toolbar>'+
            '  <md-dialog-content flex="40" style="color:#005c80;"><center><h3>Mocyle ID For <br>Newly created Admin is :</h3><b>{{id}}</b></center></md-dialog-content>' +
            '  <md-dialog-actions flex="20">' +
            '    <md-button ng-click="closeDialog()" class="md-primary">' +
            '      Thank you' +
            '    </md-button>' +
            '  </md-dialog-actions>' +
            '</md-dialog>',
          controller: function(userService,$scope,$mdDialog,$location){
                $scope.id = userService.getMocyleID();
               $scope.closeDialog = function() {
                $mdDialog.hide();
              }
          }
        });

    },function(reason){
      console.log(reason);
    });
    console.log("handleed submit");

  }

  }
  function PassResetController(userService,$mdDialog) {
    var vm= this;
      vm.newpass = userService.getAdmin()[0];
      vm.onchange = function (){
        if(!vm.newpass.pass)
          return;
      var field = vm.passreset.password;
      if(vm.newpass.password==vm.newpass.oldpass && vm.newpass.pass==vm.newpass.againpass)
        field.$setValidity('passwrd',true);
      else
        field.$setValidity('passwrd',false);
      }

      vm.changepass = function() {

        userService.changepass(vm.newpass).then(function(data){
            $mdDialog.hide();
            $mdDialog.show({
          template:
            '<md-dialog layout="column">' +
            '<md-toolbar flex="20">'+
            '<div class="md-toolbar-tools">'+
            '<span flex></span>'+
            '<h1>Booking Confirmation</h1>'+
            '<span flex></span>'+
            '</div>'+
            '</md-toolbar>'+
            '  <md-dialog-content flex="40" style="color:#005c80;"><center><h3>Your Password is Succesfully Reset<br>Use new Password when You Login next</h3></center></md-dialog-content>' +
            '  <md-dialog-actions flex="20">' +
            '    <md-button ng-click="closeDialog()" class="md-primary">' +
            '      Thank you' +
            '    </md-button>' +
            '  </md-dialog-actions>' +
            '</md-dialog>',
          controller: function($scope,$mdDialog,$location){
               $scope.closeDialog = function() {
                $mdDialog.hide();
              }
          }
        });

        },function(reason){
          console.log(reason);
        });
      }


  }
  function waitCtrl($mdDialog, $rootScope) {
      $rootScope.$on("hide_wait", function (event, args) {
            $mdDialog.cancel();
        }); 
    }

})();
