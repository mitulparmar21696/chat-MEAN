'use strict';
angular.module('DemoApp')
        .controller('shareSpaceList', ['$scope', '$http', '$location', '$localStorage', function ($scope, $http, $location, $localStorage) {
                //==============================================================
                //Declaration of variables
                //==============================================================
                $scope.jobData = {
                    jobs: []
                };
                $scope.templates = {
                    shareSpaceList: true
                };
                $scope.spaceShareListOpp = {
                    spaceList: [],
                    spaceView: {}
                };
                $scope.registrationData = {
                    registration: {}
                };
                $scope.spaceAvailability = {}
                $scope.spaceId = '';
                $scope.dateObj = {};
                $scope.incorrectTime = false;
                $scope.invalidTime = false;
                $scope.closed = false;
                //==============================================================
                //Declaration of functions
                //==============================================================
                $scope.init = init;
                $scope.viewModel = viewModel;
                $scope.deleteSpace = deleteSpace;
                $scope.registerSpaceModal = registerSpaceModal;
                $scope.Time = Time;
                $scope.registerSpace = registerSpace;
                $scope.checkAvailibality = checkAvailibality;
                $scope.checkDate = checkDate;


                //==============================================================
                //Implimentation of functions
                //==============================================================
                function init() {
                    $('.clockpicker').clockpicker();
                    $('.clockpicker').clockpicker()
                            .find('input').change(function () {

                        // TODO: time changed
                        $scope.time = this.value;
                    });
                    getShareList();
                }
                function checkDate() {
                    $scope.closed = false;
                    var weekday = new Array(7);
                    weekday[0] = "Sunday";
                    weekday[1] = "Monday";
                    weekday[2] = "Tuesday";
                    weekday[3] = "Wednesday";
                    weekday[4] = "Thursday";
                    weekday[5] = "Friday";
                    weekday[6] = "Saturday";

                    var dateDay = new Date($scope.registrationData.registration.spaceDate);
                    var dateDay = weekday[dateDay.getDay()];

                    angular.forEach($scope.spaceAvailability.openingHours, function (value) {
                        if (value.Day === dateDay) {
                            if (value.startFrom === null || value.upTo === null) {
                                $scope.closed = true;
                            }
                        }
                    });
                }

                function Time(flag) {

                    $scope.incorrectTime = false;
                    if (flag === 0) {
                        $scope.registrationData.registration.FromTime = $scope.time;
                        var t1 = new Date();
                        var parts = $scope.registrationData.registration.FromTime.split(":");
                        t1.setHours(parts[0], parts[1], 0, 0);
                        if (angular.isUndefined($scope.registrationData.registration.ToTime) || $scope.registrationData.registration.ToTime === '') {
                            return;
                        } else {
                            var t2 = new Date();
                            parts = $scope.registrationData.registration.ToTime.split(":");
                            t2.setHours(parts[0], parts[1], 0, 0);
                            if (t1.getTime() <= t2.getTime()) {
                                checkAvailibality();
                            } else {
                                $scope.incorrectTime = true;
                            }
                        }
                    } else {

                        $scope.registrationData.registration.ToTime = $scope.time;
                        var t2 = new Date();
                        parts = $scope.registrationData.registration.ToTime.split(":");
                        t2.setHours(parts[0], parts[1], 0, 0);

                        if (angular.isUndefined($scope.registrationData.registration.FromTime) || $scope.registrationData.registration.FromTime === '') {
                            return;
                        } else {

                            var t1 = new Date();
                            var parts = $scope.registrationData.registration.FromTime.split(":");
                            t1.setHours(parts[0], parts[1], 0, 0);
                            if (t1.getTime() <= t2.getTime()) {

                                checkAvailibality();
                            } else {
                                $scope.incorrectTime = true;
                            }
                        }
                    }
                }
                function checkAvailibality() {
                    // returns 1 if greater, -1 if less and 0 if the same
                    var weekday = new Array(7);
                    weekday[0] = "Sunday";
                    weekday[1] = "Monday";
                    weekday[2] = "Tuesday";
                    weekday[3] = "Wednesday";
                    weekday[4] = "Thursday";
                    weekday[5] = "Friday";
                    weekday[6] = "Saturday";

                    var dateDay = new Date($scope.registrationData.registration.spaceDate);
                    var dateDay = weekday[dateDay.getDay()];

                    angular.forEach($scope.spaceAvailability.openingHours, function (value) {
                        if (value.Day === dateDay) {

                            var t1 = new Date();
                            var parts = $scope.registrationData.registration.FromTime.split(":");
                            t1.setHours(parts[0], parts[1], 0, 0);

                            var t2 = new Date();
                            parts = $scope.registrationData.registration.ToTime.split(":");
                            t2.setHours(parts[0], parts[1], 0, 0);

                            var t3 = new Date();
                            parts = value.startFrom.split(":");
                            t3.setHours(parts[0], parts[1], 0, 0);

                            var t4 = new Date();
                            parts = value.upTo.split(":");
                            t4.setHours(parts[0], parts[1], 0, 0);


                            if (t3.getTime() <= t1.getTime() && t4.getTime() >= t2.getTime()) {
                                $scope.invalidTime = false;
                            } else {
                                $scope.invalidTime = true;
                            }
                        }
                    });
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
                function registerSpaceModal(item) {
                    $scope.spaceId = '';
                    $scope.spaceId = item._id;
                    $scope.spaceAvailability = item;

                    $scope.dateObj = {};
                    $scope.incorrectTime = false;
                    $scope.invalidTime = false;
                    $scope.closed = false;
                    $scope.registrationForm.$submitted = false;
                    $scope.registrationData.registration = {};
                    $('#RegisterSpace').modal('show');
                }

                function registerSpace() {
                    var registerData = {
                        'FirstName': $scope.registrationData.registration.FirstName,
                        'LastName': $scope.registrationData.registration.LastName,
                        'SpaceName': $scope.registrationData.registration.SpaceName,
                        'FromTime': $scope.registrationData.registration.FromTime,
                        'ToTime': $scope.registrationData.registration.ToTime,
                        'spaceDate': $scope.registrationData.registration.spaceDate,
                        'userId': $localStorage.loginData._id,
                        'spaceId': $scope.spaceId
                    };

                    $http.post('http://127.0.0.1:8090/registerSpace', registerData)
                            .then(function (response) {

                                $('#RegisterSpace').modal('hide');
                            });
                }
            }]);
        