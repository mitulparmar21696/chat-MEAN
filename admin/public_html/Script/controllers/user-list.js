'use strict';
angular.module('DemoApp')
        .controller('userListController', ['$scope', '$http','socket', function ($scope, $http,socket) {
                //==============================================================
                //Declaration of variables
                //==============================================================
                $scope.user = {
                    userList: []
                };
                $scope.jobData = {
                    job: {}
                }
                //==============================================================
                //Declaration of functions
                //==============================================================
                $scope.init = init;
                $scope.editPlanDetail = editPlanDetail;
                $scope.updatePlanDetails = updatePlanDetails;

                //==============================================================
                //Implimentation of functions
                //==============================================================
                function init() {
                    getUserList();
                }
                socket.on('connect', function () {
                });
                function getUserList() {
                    $http.get('http://127.0.0.1:8090/getUserList')
                            .then(function (response) {
                                
                                $scope.user.userList = response.data.User;
                            });
                }

                function editPlanDetail(item) {
                    $scope.jobData.job = item;
                    $('#planDetails').modal('show');
                }
                function updatePlanDetails() {
                    
                    var planData = {
                        'Job': $scope.jobData.job.user_json.planDetails.Job,
                        'Workspaces': $scope.jobData.job.user_json.planDetails.Workspaces,
                        'Events': $scope.jobData.job.user_json.planDetails.Events,
                        'Communities': $scope.jobData.job.user_json.planDetails.Communities,
                        '_id': $scope.jobData.job._id,
                    }
                    $http.post('http://127.0.0.1:8090/updatePlanDetail', planData)
                            .then(function (response) {
                                $('#planDetails').modal('hide');
                                init();
                            });
                }
            }]);

