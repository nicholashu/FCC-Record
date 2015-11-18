'use strict';

(function() {
    angular
        .module('clementineRecordApp', [])

        .controller('RecordCtrl', ['$scope', '$http', '$window', 

            function($scope, $http, $window) {
                
                var appUrl = $window.location.origin;
                var recordUrl = appUrl + '/api/:id/record';
                $scope.records = [];
                $scope.newRecord = {}; 
                $scope.myRecords = [];
                $scope.tab = 0;

                $scope.getRecords = function() {
                    var user = $scope.currentUser;
                    $http.get(recordUrl).then(function(response) {
                        response.forEach(function(data){
                            if (data.record.owner === user.id){
                              $scope.myRecords.push(data);
                            }
                        $scope.records = response.data;
                        });
                    });
                    console.log($scope.records);
                };

                $http.get("/api/getCurrentUser").then(function(result){
                 $scope.currentUser = result.data;
                 console.log($scope.currentUser)
                });

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

                function checkRequests(){
                  $scope.myRecords.forEach(function(record){
                    if(record.loaner !== ''){
                      if(record.approved !== true){
                        $scope.awaitingArray.push(record);
                      }
                      else if(record.approved === true){
                        $scope.onLoan.push(record);
                      }
                    }
                  });
                }

                $scope.setTab = function(tab) {
                  $scope.tab = tab;
                };

                $scope.isTab = function(tab) {
                  return tab === $scope.tab;
                };

                $scope.isOwner = function(record) {
                  var user = $scope.currentUser
                  if(record.owner === user.id){
                    return true;
                  }else{
                    return false;
                  }
                };

                $scope.cantBorrow = function(record) {
                  var user = $scope.currentUser;
                  if(record.loaner !== ''){
                    if (record.owner === user.id){
                      return false;
                    }else{
                      return true;
                    }
                  }
                  else{
                    return false;
                  }
                };

                //show if not owner, has "" or undefined, 
                $scope.isAvailable = function(record) {
                  var user = $scope.currentUser;
                  if (record.owner === user.id){
                    return false;
                  }
                  if(record.owner !== user.id){
                    if (record.loaner !== ''){
                      return false;
                    }else{
                      return true;
                    }
                  }else if(record.loaner !== ''){
                    return true;
                  }
                  else{
                    return false;
                  }
                };







            }
        ]);

})();
