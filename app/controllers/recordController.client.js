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

        .controller('RecordCtrl', ['$scope', '$http', '$window','UserService',

            function($scope, $http, $window, UserService) {
                
                var appUrl = $window.location.origin;
                var recordUrl = appUrl + '/api/:id/record';
                $scope.records = [];
                $scope.newRecord = {}; 
                $scope.myRecords = [];
                $scope.tab = 0;
  

                $scope.getUser = function() {
                UserService.getUser().then(function(result) {
                        $scope.user = result.data;
                    });
                };

                $scope.getUser();

                $scope.loadRecords = function() {
                    $http.get(recordUrl).then(function(response) {
                        var records = response.data;
                        getRecords(records);
                        checkRequests();
                    });
                };

                function getRecords(records){
                  var user = $scope.currentUser;
                  records.forEach(function(record){
                    if (record.owner === user.id){
                      $scope.myRecords.push(record);
                    }
                      $scope.records.push(record);
                  });
                 }

                function checkRequests(){
                }


                $scope.loadRecords();
                console.log($scope.user)


                $scope.addRecord = function() {
                    if ($scope.newRecord != {}) {

                        $http.post(recordUrl, {
                            'album': $scope.newRecord.album,
                            'artist': $scope.newRecord.artist,
                            'condition': $scope.newRecord.condition,
                            'description': $scope.newRecord.description
                           // 'owner': 
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
                  var user = $scope.currentUser;
                 // console.log(user)
                //  console.log(record)
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
