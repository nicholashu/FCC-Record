'use strict';

(function() {
    angular
        .module('clementineRecordApp', [])
        .service('UserService', ['$http', '$window', '$q', function($http, $window, $q) {

        var appUrl = $window.location.origin;
        var apiUrl = appUrl + '/api/:id';

        var deferred = $q.defer();

        this.getUser = function() {
            $http.get(apiUrl).then(function(result) {
                deferred.resolve(result);
            });

            return deferred.promise;
        };


    }])
        .controller('UserCtrl', ['$scope', '$http', '$window','UserService','$location',

            function($scope, $http, $window, UserService, $location) {
                
                $scope.user = {};
                $scope.tab = 0;
                var appUrl = $window.location.origin;
              //  var userUrl = appUrl + '/api/profile/:id';
  

                $scope.getUser = function() {
                UserService.getUser().then(function(result) {
                        $scope.user = result.data;
                    });
                };

                $scope.getUser();

                $scope.stupidButton = function(){
                	$http.get("/hi").then(function(){
                		console.log("done");
                	})
                };

                $scope.editUser = function(id) {
                    $http.put( '/api/profile/', {
                    			'id': $scope.user._id,
                    			'email':  $scope.user.local.email,
                    			'password': $scope.user.local.password,
                        	'name': $scope.user.shared.name,
													'country': $scope.user.shared.country,
											   'state': $scope.user.shared.state,
											    'city': $scope.user.shared.city
                   }).then(function(user) {
                  			$window	.location.href = appUrl + "/profile";
                    });
                };


                $scope.setTab = function(tab) {
                  $scope.tab = tab;
                };

                $scope.isTab = function(tab) {
                  return tab === $scope.tab;
                };
            }
        ]);

})();
