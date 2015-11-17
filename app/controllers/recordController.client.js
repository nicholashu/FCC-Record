'use strict';

(function() {
    angular
        .module('clementineRecordApp', [])
        .controller('RecordCtrl', ['$scope', '$http', '$window',

            function($scope, $http, $window) {
                
                var appUrl = $window.location.origin;
                var recordUrl = appUrl + '/api/:id/record';

                $scope.newRecord = {};
                $scope.hi = "hi from the record controller!";



                $scope.getRecords = function() {
                    $http.get(recordUrl).then(function(response) {
                        $scope.recordList = response.data;
                    });
                };


                $scope.getRecords();

                $scope.addRecord = function() {
                    if ($scope.newRecord != {}) {

                        $http.post(recordUrl, {
                            'album': $scope.newRecord.album,
                            'artist': $scope.newRecord.artist,
                            'condition': $scope.newRecord.condition,
                            'description': $scope.newRecord.description
                        }).then(function(response) {
                            $scope.getRecords();
                            $scope.newRecord = {};
                        });
                    }
                };

                //fix for record
                $scope.editRecord = function(id, title, message) {
                    $scope.title = title;
                    $scope.message = message;
                    $scope.hideEditedTodo = id;
                };
                
                
                
                  //fix for record
                $scope.cancelEdit = function() {
                    $scope.title = "";
                    $scope.message = "";
                    $scope.hideEditedTodo = "";
                };
                
                  //fix for record
                $scope.putTodo = function() {
                    $http.put(todoUrl, {
                        'id': $scope.hideEditedTodo,
                        'title': $scope.title,
                        'message': $scope.message
                    }).then(function(response) {
                        $scope.getTodos();
                        $scope.title = "";
                        $scope.message = "";
                        $scope.hideEditedTodo = "";
                    });
                };



                $scope.deleteRecord = function(id) {
                    $http({
                        url: recordUrl + "/" + id,
                        method: "DELETE"
                    }).
                    then(function(data) {
                        $scope.getRecords();
                    });
                };

            }
        ]);

})();
