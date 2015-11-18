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

                $http.get("/api/getCurrentUser").then(function(result){
                 $scope.currentUser = result.data;
                 console.log($scope.currentUser)
                });

                $scope.loadRecords = function() {
                    $http.get(recordUrl).then(function(response) {
                        getRecords(response.data);
                        $scope.records = response.data;
                    });
                    console.log($scope.records);
                    checkRequests();
                };


                function getRecords(records){
                  var user = $scope.currentUser;
                  console.log(records)
                  records.forEach(function(record){
                    if (record.owner === user.id){
                      $scope.myRecords.push(record);
                    }
                      $scope.records.push(record);
                  });
                 }

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

                $scope.loadRecords();

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
