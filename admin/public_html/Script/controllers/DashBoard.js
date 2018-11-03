'use strict';
angular.module('DemoApp')
        .controller('dashBoardCtrl', ['$scope', '$http', '$location', 'dataService', 'socket', '$localStorage', function ($scope, $http, $location, dataService, socket, $localStorage) {
                //==============================================================
                //Declaration of variables
                //==============================================================
                $scope.jobData = {
                    jobs: []
                }
                $scope.templates = {
                    shareSpaceList: true,
                    shareSpaceAdd: false,
                    spaceFiltersConfig: false,
                    userList: false,
                    userProfile:false,
                    chat:false,
                };
                $scope.countries = {
                    country: []
                }
                //==============================================================
                //Declaration of functions
                //==============================================================
                $scope.init = init;
                $scope.openShareSpaceFrom = openShareSpaceFrom;
                $scope.spaceConfig = spaceConfig;
                $scope.openSpaceList = openSpaceList;
                $scope.logOut = logOut;
                $scope.registrationClick = registrationClick;
                $scope.getCityState = getCityState;
                $scope.UserList = UserList;
                $scope.chat = chat;
                $scope.userProfile = userProfile;


                //==============================================================
                //Implimentation of functions
                //==============================================================
                function init() {
                    
                    if (!angular.isUndefined($localStorage.templates)) {
                        $scope.templates = $localStorage.templates;
                    } else {
                        openSpaceList();
                    }
                }
                socket.on('connect', function () {

                });
                function openSpaceList() {
                    $scope.templates = {
                        shareSpaceList: true,
                        shareSpaceAdd: false,
                        spaceFiltersConfig: false,
                        userList: false,
                        chat: false,
                        userProfile:false
                    };
                    $localStorage.templates = $scope.templates;
                }
                function openShareSpaceFrom() {

                    $scope.templates = {
                        shareSpaceList: false,
                        shareSpaceAdd: true,
                        spaceFiltersConfig: false,
                        userList: false,
                        chat: false,
                        userProfile:false
                    };
                    $localStorage.templates = $scope.templates;
                }
                function spaceConfig() {

                    $scope.templates = {
                        shareSpaceList: false,
                        shareSpaceAdd: false,
                        spaceFiltersConfig: true,
                        userList: false,
                        chat: false,
                        userProfile:false
                    };
                    $localStorage.templates = $scope.templates;
                }
                function UserList() {
                    $scope.templates = {
                        shareSpaceList: false,
                        shareSpaceAdd: false,
                        spaceFiltersConfig: false,
                        userList: true,
                        chat: false,
                        userProfile:false
                    };
                    $localStorage.templates = $scope.templates;
                }
                function chat() {
                    $scope.templates = {
                        shareSpaceList: false,
                        shareSpaceAdd: false,
                        spaceFiltersConfig: false,
                        userList: false,
                        userProfile:false,
                        chat: true
                    };
                    $localStorage.templates = $scope.templates;
                }
                function userProfile() {
                    $scope.templates = {
                        shareSpaceList: false,
                        shareSpaceAdd: false,
                        spaceFiltersConfig: false,
                        userList: false,
                        userProfile:true,
                        chat: false
                    };
                    $localStorage.templates = $scope.templates;
                }
                function logOut() {
                    $location.path('/');
                }
                function registrationClick() {
                    $('#registrationModal').modal('show');
                }
                function getCityState(code) {

                    $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + code + '&sensor=true')
                            .then(function (response) {

                                angular.forEach(response.data.results[0].address_components, function (value) {
                                    if (value.types[0] === 'administrative_area_level_2') {
                                        $scope.registrationData.cityData.cityName = value.long_name;
                                    }
                                    if (value.types[0] === 'administrative_area_level_1') {

                                        $scope.registrationData.cityData.stateName = value.long_name;
                                    }
                                });
                            });
                }
                $scope.getCountry = dataService.getCountry(function (response) {

                    $scope.countries.country = response.data.data;
                });

            }]);
        