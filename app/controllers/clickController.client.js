'use strict';

(function() {

    angular.module('clementineApp', ['clementineTodoApp'])

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

    .controller('ClementineAppCtrl', ['$scope', '$http', '$window', 'UserService', 
        function($scope, $http, $window, UserService) {

        var appUrl = $window.location.origin;
        var apiUrl = appUrl + '/api/:id/clicks';
        
        $scope.getClicks = function() {
            $http.get(apiUrl).then(function(result) {
                $scope.clicks = result.data.clicks;
            });
        };

        $scope.addClick = function() {
            $http.put(apiUrl).then(function(result) {
                $scope.getClicks();
            });
        };

        $scope.resetClicks = function() {
            $http.delete(apiUrl).then(function(result) {
                $scope.getClicks();
            });
        };

        
        $scope.getUser = function() {
            UserService.getUser().then(function(result) {
                $scope.user = result.data;
            });
        };
        
        
        $scope.getClicks();
        $scope.getUser();

    }]);


})();