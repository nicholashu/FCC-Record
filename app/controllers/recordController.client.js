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
        .controller('RecordCtrl', ['$scope', '$http', '$window','UserService','$location',

            function($scope, $http, $window, UserService, $location) {

                var appUrl = $window.location.origin;
                var recordUrl = appUrl + '/api/:id/record';
                var borrowUrl = appUrl + '/api/record/borrow';
                var approveUrl = appUrl + '/api/record/approve';
                $scope.awaitingArray = [];
                $scope.onLoan = [];
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

                function loadRecords() {
                    $scope.records = [];
                    $scope.awaitingArray = [];
                    $scope.onLoan = [];
                    $http.get(recordUrl).then(function(response) {
                        var records = response.data;
                        getRecords(records);
                        $scope.checkRequests()
                    });
                };

                function getRecords(records){
                  records.forEach(function(record){
                    if (record.owner === $scope.user._id ){
                      $scope.myRecords.push(record);
                    }
                      $scope.records.push(record);
                  });
                 }

                $scope.checkRequests = function(){
                 $scope.myRecords.forEach(function(record){
                    if (record.approved === false){
                      if (record.loaner !== ""){
                        $scope.awaitingArray.push(record);
                      }
                    }else{
                      $scope.onLoan.push(record);
                    }
                 })

                };


                loadRecords();


                $scope.addRecord = function() {
                    if ($scope.newRecord != {}) {
                        $http.post(recordUrl, {
                            'album': $scope.newRecord.album,
                            'artist': $scope.newRecord.artist,
                            'condition': $scope.newRecord.condition,
                            'description': $scope.newRecord.description,
                            'owner': $scope.user._id,
                            'loaner': ""

                        }).then(function(response) {
                            loadRecords();
                            $scope.newRecord = {};
                            $window.location.href = appUrl + "/" +  $scope.user._id + '/records';
                        });
                    }
                };



                 $scope.borrowRecord = function(record){
                    $http.put(borrowUrl, {
                      "id": record,
                      "loaner": $scope.user._id
                    }).then(function(data){
                      console.log("done adding loaner")
                      loadRecords();
                    })
                 };


                 $scope.approveRecord = function(record){
                    $http.put(approveUrl, {
                      "id": record._id,
                      "loaner": record.loaner,
                      "approved": true
                    }).then(function(data){
                      loadRecords();
                    })
                 };

                  $scope.returnRecord = function(record){
                    $http.put(approveUrl, {
                      "id": record._id,
                      "loaner": "",
                      "approved": false
                    }).then(function(data){
                      console.log(data)
                      loadRecords();
                    })
                 };



                $scope.deleteRecord = function(id) {
                    $http({
                        url: recordUrl + "/" + id,
                        method: "DELETE"
                    }).
                    then(function(data) {
                        loadRecords();
                    });
                };


                $scope.setTab = function(tab) {
                  $scope.tab = tab;
                };

                $scope.isTab = function(tab) {
                  return tab === $scope.tab;
                };

                $scope.isOwner = function(record) {
                  var user = $scope.user;
                // console.log(user)
                //  console.log(record)
                  if(record.owner === user._id){
                    return true;
                  }else{
                    return false;
                  }
                };

                $scope.cantBorrow = function(record) {
                  var user = $scope.user;
                  if(record.loaner === ''){
                    if (record.owner === user._id){
                      return true;
                    }else{
                      return false;
                    }
                  }else{
                    return false;
                  }
                };


                $scope.requested = function(record) {
                  var user = $scope.user;
                  if(record.loaner !== ''){
                    if (record.owner === user._id){
                      return false;
                    }else{
                      return true;
                    }
                  }else{
                    return false;
                  }
                };

                //show if not owner, has "" or undefined,
                $scope.isAvailable = function(record) {
                 var user = $scope.user;
                  if (record.owner === user._id){
                    return false;
                  }
                  if(record.owner !== user._id){
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
