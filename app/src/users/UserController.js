(function(){

  angular
       .module('moduleConnector')
       .controller('mainController', [
          'mainService', '$mdSidenav', '$mdBottomSheet', '$timeout', '$log','$location',
          MainController
       ])
       .controller('serviceController', [
              'mainService','$timeout', '$log','$location','$http','$scope',
          ServiceController
       ])
       .controller('aboutusController', [
              '$log','$location','$http',
          AboutController
       ])
       .controller('locationController',[
              'mainService','$log','$location','$http' ,'$mdDialog','uiGmapGoogleMapApi','$timeout','$q',
          LocationController])
       .controller('mapController',[
             'mainService' ,'$log','$location','$scope','$mdDialog',
          MapController])
       .controller('verifyController' , [
              'mainService' , '$http' , '$location','$mdDialog',
              VerifyController
        ])
       .controller('waitCtrl' , [
              '$mdDialog','$rootScope',
              waitCtrl
        ]) 
       .controller('ourService' ,[
          'mainService' , ourService]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function MainController( mainService, $mdSidenav, $mdBottomSheet, $timeout, $log ,$location) {
      var vm = this;
      vm.backgroundimgurl = "http://www.itabc.ca/sites/default/files/MotorcycleMechanic_0.jpg";
    vm.selected     = null;
    vm.users        = [ ];
    vm.selectUser   = selectUser;
    vm.toggleList   = toggleUsersList;
    vm.makeContact  = makeContact;


    // Load all registered users

    mainService
          .loadAllUsers()
          .then( function( users ) {
            vm.users    = [].concat(users);
            users[0];
          }); 


    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */

   vm.booknow =function () {

  //   alert("gereekaebfak");
   // vm.backgroundimgurl = "";
     $location.path('service');

     }


     function setBackground() {
      vm.backgroundimgurl = "http://www.itabc.ca/sites/default/files/MotorcycleMechanic_0.jpg";
     }

     function setBackgroundnone() {
      vm.backgroundimgurl = "";

     }

    function toggleUsersList() {
      $mdSidenav('left').toggle();
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectUser ( user ) {
     //angular.isNumber(user) ? $scope.users[user] : user;
     vm.selected=user;
       $location.path(user.path);

          }

if($location.path()!="/home") 
      $location.path('home');
    /**
     * Show the Contact view in the bottom sheet
     */
    
    function makeContact(selectedUser) {

        $mdBottomSheet.show({
          controllerAs  : "vm",
          templateUrl   : '/app/src/users/view/contactSheet.html',
          controller    : [ '$mdBottomSheet', ContactSheetController],
          parent        : angular.element(document.getElementById('content')),
          clickOutsideToClose: true
        }).then(function(clickedItem) {
          
        });

        /**
         * User ContactSheet controller
         */
        function ContactSheetController( $mdBottomSheet ) {
          this.user = selectedUser;
          this.items = [
            { name: 'Call Us'      , icon: 'contact' , link : 'tel:886-711-4854'},
            { name: 'Email Us'        , icon: 'email' , link :  ''  },
            { name: 'Via Facebook'     , icon: 'facebook' , link : 'http://facebook.com/Mocyle/' },
            { name: 'Via Twitter'      , icon: 'twitter' , link : ''  },
            { name: 'Message Us'      , icon: 'message' , link :  '' }
          ];
          this.contactUser = function(action) {

            document.location.href=action.link;
            $mdBottomSheet.hide(action);
          };
        }
    }

  }

function ServiceController(mainService , $timeout, $log ,$location,$http,$scope) {

var vm = this;
vm.bike = {};
vm.bike.maker="";
vm.bike.modal= "";
vm.bike.tab='maker';
vm.showSearch =true;
vm.search={};
vm.search.who= "";
var makers = {};
var modals ={};
vm.minDate = new Date();

    vm.determinateValue = 0;
     vm.show= true;
    loadAll();
    vm.newState = function (state) {
      loadModals();
      alert("Sorry! You'll need to create a Constituion for " + state + " first!");
    }
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for maker... u$timeout to simulate
     * remote dataservice call.
     */

                                      



mainService.getLocation()
.then(function(position) {
 mainService.sharePos({
                            'cuslat' : position.coords.latitude,
                            'cuslng' : position.coords.longitude
                      });
},function(reason) {
  $log.info(reason);
});


    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
      vm.bike.maker = item;
      $log.info('Item changed to ' + JSON.stringify(item));
       vm.determinateValue = 0;
    //  loadModals();
    }
    /**
     * Build `maker` lisf key/value pairs
     */
    function loadAll() {
      var request = $http.get('/app/src/data/makers.json');
      request.then(function (data) {
      vm.makers =data.data;
      });      
    }

    function getModal(maker) {
       vm.determinateValue = 33;
        var request = $http.get('/app/src/data/'+maker+'.json');
          request.then(function (data) {
              vm.modals=data.data;
          });


    }

$scope.$watch('sc.bike.maker', function(maker) {
        if (maker) {
          vm.next(vm.bike);
        } 
      });
$scope.$watch('sc.bike.modal', function(modal) {
        if (modal) {
          vm.next(vm.bike);
        } 
      });
$scope.$watch('sc.bike.pickup', function(pickup) {
        if (pickup) {
          vm.next(vm.bike);
        } 
      });

  vm.quickbook=function(){
  var bike = mainService.getBike();
  bike.tab='quick';
  bike.pickup=moment(new Date()).format('DD-MMM-YYYY');
  mainService.setBike(bike);

  $location.path('location');

}
    /**
     * Create filter function for a query string
     */

  vm.next = function (bike) {

    if(bike.tab=='maker' && bike.maker){
      getModal(bike.maker);
      vm.bike.tab='modal';
      }
    else if(bike.tab=='modal' && bike.modal){
      vm.determinateValue = 66;
      vm.bike.tab='pickup';
      }
    else if(bike.tab=='pickup' && bike.pickup){
      vm.determinateValue = 100;
      var pickup=moment(bike.pickup).format('DD-MMM-YYYY');
      var bike=angular.copy(bike);
      vm.bike.pickup=pickup;
      mainService.setBike(vm.bike);
      $location.path('location');
    }
}



  vm.selecttab = function (tab,event) {

if(tab=='modal' && vm.bike.tab=='pickup'){
  vm.bike.modal=null;
  vm.bike.pickup=null;
  vm.bike.tab=tab;
  vm.next(vm.bike);

}
else if(tab=='maker') {

  vm.bike.maker=null;
  vm.bike.modal=null;
  vm.bike.pickup=null;
  vm.bike.tab=tab;
  vm.next(vm.bike);
}


}

}

function AboutController($log,$location,$http) {

var vm = this;
 vm.aboutpage1 = true;
 vm.aboutpage2 = false;
 vm.page = "page1";


}

function LocationController(mainService,$log,$location,$http,$mdDialog,uiGmapGoogleMapApi,$timeout,$q) {

var vm=this;
vm.maps= null;
vm.isimageready = false;
vm.selectedItem = null;
vm.selectedText = '';

/**
$timeout(function() {
console.log("timeout completed");
  vm.isimageready=true;
}, 3200);
**/
var bike = mainService.getBike();
if( bike.tab=="quick" ||(bike.maker && bike.modal && bike.pickup )){

  }
  else
    $location.path('home'); 
vm.openmap = function (ev) {

if(ev){
    mainService.setLocation(null);
}
$mdDialog.show({
                    controller: 'mapController',
                    controllerAs: 'mc',
                    templateUrl: '/app/src/users/view/map.html',
                    clickOutsideToClose: false
                })
                .then(function(result) {
                 $location.path('verify');
                });


}

uiGmapGoogleMapApi.then(function(maps) {

mainService.setMap(maps);
vm.maps = maps;
  
vm.search =function(address) {
  var deferred = $q.defer();
     vm.getResults(address).then(
       function (predictions) {
        var results = [];
        predictions.map(function(prediction){
          results.push(prediction.description);
        });
        deferred.resolve(results);
    }
  );
 return deferred.promise;
} 


vm.getResults=function (address) {
  var deferred = $q.defer();
  new vm.maps.places.AutocompleteService().getQueryPredictions({input: address}, function (data) {
    deferred.resolve(data);
  });
  return deferred.promise;
}

vm.selectedItemChange = function(address) {

var geocoder = new vm.maps.Geocoder();

  geocoder.geocode( { 'address': address}, function(results, status) {

    if (status == google.maps.GeocoderStatus.OK) {
    mainService.setLocation({
      lat : results[0].geometry.location.lat(),
      lng : results[0].geometry.location.lng()
    });

    } else {
      console.log("Geocode was not successful for the following reason: " + status);
    }
    vm.openmap(null);
  });
  }
    });        // Starts at 1.       
    



}
function MapController(mainService,$log,$location,$scope,$mdDialog) {
var vm = this;

vm.saveLocation = function(e) {
var bike =mainService.getBike();
bike.address = vm.customerlocation;
bike.lat = vm.marker.coords.latitude;
bike.lan = vm.marker.coords.longitude;
mainService.setBike(bike);
$mdDialog.hide();
}

vm.position=mainService.fetchLocation();

         
  mainService.getLocation()
          .then( function(position) {

mainService.getMap().then(function(maps) {
        var geocoder = new maps.Geocoder();
                                         geocoder.geocode({ 'latLng':{ 
                                                                        lat : vm.position ? vm.position.lat:position.coords.latitude,
                                                                        lng : vm.position ? vm.position.lng:position.coords.longitude
                                                                      }
                                                                    },function(results,status){

                                                                    if (status == maps.GeocoderStatus.OK) {
                                                                          if (results[0]) {
                                                                             // alert(results[0].formatted_address);
                                                                              vm.customerlocation=results[0].formatted_address;
                                                                              console.log(vm.customerlocation)
                                                                          } else {
                                                                              alert('Location not found');
                                                                          }
                                                                      } else {
                                                                          alert('Geocoder failed due to: ' + status);
                                                                      }
                                                                  });


                        vm.center = {
                                        latitude: vm.position ? vm.position.lat:position.coords.latitude,
                                        longitude: vm.position ? vm.position.lng :position.coords.longitude
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
                                draggable: true
                        },
                        events: {
                                dragend: function(marker, eventName, args) {
                                        var lati = marker.getPosition().lat();
                                        var longi= marker.getPosition().lng();
                                        var geocoder= new maps.Geocoder();
                                        geocoder.geocode({ 'latLng':{ 
                                                                        lat : lati,
                                                                        lng :longi
                                                                      }
                                                                    },function(results,status){

                                                                    if (status == maps.GeocoderStatus.OK) {
                                                                          if (results[0]) {
                                                                             // alert(results[0].formatted_address);
                                                                              vm.customerlocation=results[0].formatted_address;
                                                                              console.log(vm.customerlocation)
                                                                          } else {
                                                                              alert('Location not found');
                                                                          }
                                                                      } else {
                                                                          alert('Geocoder failed due to: ' + status);
                                                                      }
                                                                  });
                                        vm.marker.options = {
                                                draggable: true,
                                                labelContent: "",
                                                labelAnchor: "100 0",
                                                labelClass: "marker-labels"
                                        };
                                }
                        }
                };
$scope.$watchCollection("marker.coords", function(newVal, oldVal) {
                        vm.map.center.latitude = vm.marker.coords.latitude;
                        vm.map.center.longitude = vm.marker.coords.longitude;
                        if (_.isEqual(newVal, oldVal))
                                return;
                        $scope.coordsUpdates++;
                });



    });
    } , function(reason) {
      console.log(reason);
    });
}

function VerifyController(mainService,$http,$location ,$mdDialog) {

var bike = mainService.getBike();
if(bike.tab=="quick" ||(bike.maker && bike.modal && bike.pickup && bike.address)){

  }
  else
    $location.path('home'); 

var vm = this;
vm.sendotp='';
vm.otp = '';
vm.showbook = false;
vm.gototp =false;
vm.mail='';
vm.phone='';
vm.name='';
vm.mailactive = false;
vm.phoneactive = false;
var patterns = {
      email: /^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))/,
      phone: /^[0]?[789]\d{9}$/,
      otp : /^[0-9]{4}$/
    };

vm.onChangeOTP = function () {
var value = vm.otp;
if(!value) {
  return ;
}

var field = vm.otpForm.otp;
  if(patterns.otp.test(value) && value==vm.sendotp){
      field.$setValidity('wrongOtp', true);
      vm.showbook = true; 
    }
    else{
      field.$setValidity('wrongOtp', false);
      vm.showbook = false;
}
}
vm.bookservice = function() {

  var bike = mainService.getBike();
  bike.phone = vm.phone;
  bike.mail = vm.mail;
  bike.name = vm.name;
  mainService.setBike(bike);
  mainService.showWait();
  mainService.bookservice(bike).then( function (response) {
  mainService.hideWait();

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
            '  <md-dialog-content flex="40" style="color:#005c80;"><center><h3>Your Service is Booked Succesfully <br> In few minutes Our Professionals Will call You</h3></center></md-dialog-content>' +
            '  <md-dialog-actions flex="20">' +
            '    <md-button ng-click="closeDialog()" class="md-primary">' +
            '      Thank you' +
            '    </md-button>' +
            '  </md-dialog-actions>' +
            '</md-dialog>',
          controller: function($scope,$mdDialog,$location){
               $scope.closeDialog = function() {
                $mdDialog.hide();
                $location.path('home');
              }
          }
        });

  });
}

vm.sendOtpMail = function () {
  mainService.showWait();
mainService.sendOtpMail(vm.phone,vm.email).then(function (data) {
    vm.sendotp= data;
  mainService.hideWait();
  
},function (reason) {
mainService.hideWait();
});

}



    vm.onChange = function (type) {
      if(type=='phone'){
        var value = vm.phone;
        var field = vm.phonename;
        var match = patterns.phone.test(value);
        field.$setValidity('phonematch', match);
        vm.phoneactive=match;

      }
      else if(type=='mail'){
        var value = vm.mail;
        var field = vm.mailname;
        var match = patterns.email.test(value);
        field.$setValidity('mailmatch', match);
          vm.mailactive=match;

      }
      else{
        return;
      }

      
    }

}
function waitCtrl($mdDialog, $rootScope) {
      $rootScope.$on("hide_wait", function (event, args) {
            $mdDialog.cancel();
        }); 
    }
    function ourService(mainService) {
      var vm =this;
      vm.goldfeatures = [];
      vm.platinumfeatures = [];
      mainService.loadAllService().then(function(data) {
        vm.goldfeatures =data.gold[0];
        vm.goldurl = data.gold[1].imgUrl;
        vm.platinumfeatures = data.platinum[0];
        vm.platinumurl = data.platinum[1].imgUrl;
      },function(reason){

      });

      
    }
})();
