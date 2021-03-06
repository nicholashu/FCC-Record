'use strict';

(function() {

    angular.module('clementineApp', ['clementineTodoApp', 'clementineRecordApp'])

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

        
        $scope.getUser = function() {
            UserService.getUser().then(function(result) {
                $scope.user = result.data;
            });
        };

        $scope.getUser();

    }]);


})();