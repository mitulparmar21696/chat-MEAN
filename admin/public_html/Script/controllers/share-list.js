'use strict';
angular.module('DemoApp')
        .controller('shareSpaceList', ['$scope', '$http', '$location', function ($scope, $http, $location) {
                //==============================================================
                //Declaration of variables
                //==============================================================
                $scope.jobData = {
                    jobs: []
                }
                $scope.templates = {
                    shareSpaceList: true
                };
                $scope.spaceShareListOpp = {
                    spaceList: [],
                    spaceView: {}
                }
                //==============================================================
                //Declaration of functions
                //==============================================================
                $scope.init = init;
                $scope.viewModel = viewModel;
                $scope.deleteSpace = deleteSpace;


                //==============================================================
                //Implimentation of functions
                //==============================================================
                function init() {
                    
                    getShareList();
                }
                function getShareList() {
                    
                    $http.get('http://127.0.0.1:8090/spaceShareList')
                            .then(function (response) {
                                
                                $scope.spaceShareListOpp.spaceList = response.data.data;
                            });
                }
                function viewModel(item) {
                    
                    var id = item._id;
                    $scope.spaceShareListOpp.spaceView = item;
                    $('#ViewSpace').modal('show');
                    $http.get('http://127.0.0.1:8090/image/' + id)
                            .then(function (response) {
                                
                                $scope.myArray = response.data.imageData;
                            });
                }
                function deleteSpace(item, index) {
                    var r = confirm("Are You Sure for Delete?");
                    if (r === true) {
                        var id = item._id;
                        $scope.spaceShareListOpp.spaceView = item;
                        $http.delete('http://127.0.0.1:8090/deleteSpace/' + id)
                                .then(function (response) {
                                    
                                    if (response.data.response === true) {
                                        $scope.spaceShareListOpp.spaceList.slice(index, 1);
                                    }

                                });
                    } else {
                        return;
                    }

                }

            }]);
        