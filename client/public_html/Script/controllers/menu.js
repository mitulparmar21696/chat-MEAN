'use strict';
angular.module('DemoApp')
        .controller('menuctrl', function ($scope, $location, $localStorage, dataService, $http) {
            //==============================================================
            //Declaration of variables
            //==============================================================

            $scope.registrationData = {
                register: {},
                myRegistrations: [],
                loginData: {},
            }
            $scope.countries = {
                country: [],
                states: [],
                cities: []
            }
            $scope.plans = {
                myPlans: [
                    {
                        id: 1,
                        Name: "Free Registration",
                        Price: 500,
                        Job: 1,
                        Workspaces: 1,
                        Events: 1,
                        Communities: 1
                    },
                    {
                        id: 2,
                        Name: "Premium Registration",
                        Price: 500,
                        Job: 3,
                        Workspaces: 3,
                        Events: 3,
                        Communities: 3

                    },
                    {
                        id: 3,
                        Name: "Pro Registration",
                        Price: 500,
                        Job: 6,
                        Workspaces: 6,
                        Events: 6,
                        Communities: 6
                    }
                ]
            };
            $scope.logReg = true;
            $scope.pwdFlag = false;
            $scope.msgPassword = false;
            $scope.incorrectMessage = false;
            $scope.msg = 'Incorrect User Name or Password'
            $scope.incorrect = false;
            //==============================================================
            //Declaration of functions
            //==============================================================
            $scope.init = init;
            $scope.save = save;
            $scope.login = login;
            $scope.doLogin = doLogin;
            $scope.openRegistration = openRegistration;
            $scope.pwCheck = pwCheck;
            $scope.changeLoc = changeLoc;
            $scope.userList = userList;
            $scope.shareJobList = shareJobList;
            $scope.shareSpace = shareSpace;
            $scope.shareSpaceList = shareSpaceList;
            //==============================================================
            //Implimentation of functions
            //==============================================================
            function init() {
                if ($localStorage.loginData) {
                    $scope.logReg = false;
                }
                $('.clockpicker').clockpicker();
                getUser();
            }
            function getUser() {

                $http.get('http://127.0.0.1:8090/listUsers')
                        .then(function (response) {

                        });
            }
            function changeLoc() {
                $location.path('/Home')

            }
            function userList() {
                $location.path('/add-share-job')

            }
            function shareJobList() {
                $location.path('/share-job')

            }
            function shareSpace() {
                $location.path('/share-space-add')

            }
            function shareSpaceList() {
                $location.path('/share-space')

            }
            function pwCheck() {
                $scope.registrationData.register.password;
                $scope.registrationData.register.confirmPassword;
                if (!angular.isUndefined($scope.registrationData.register.password)) {

                }
                if (!angular.isUndefined($scope.registrationData.register.confirmPassword)) {

                }
                if (!angular.isUndefined($scope.registrationData.register.confirmPassword) && !angular.isUndefined($scope.registrationData.register.password)) {
                    if ($scope.registrationData.register.password !== $scope.registrationData.register.confirmPassword) {
                        $scope.pwdFlag = true;
                    } else {
                        $scope.pwdFlag = false;
                    }


                }
                if (angular.isUndefined($scope.registrationData.register.confirmPassword) && angular.isUndefined($scope.registrationData.register.password)) {
                    $scope.pwdFlag = false;
                }

            }


            function openRegistration() {
                $scope.pwdFlag = false;
                $scope.myForm.$submitted = false;
                $scope.registrationData.register = {};
                $('#myModal').modal('show');
            }

            function save() {
                if ($scope.registrationData.register.password !== $scope.registrationData.register.confirmPassword) {
                    $scope.msgPassword = true;
                    return;
                }
                var user_data = {
   
                    'user_json': {
                        first_name: $scope.registrationData.register.FirstName,
                        last_name: $scope.registrationData.register.LastName,
                        email: $scope.registrationData.register.userName.toLowerCase(),
                        password: $scope.registrationData.register.password,
                        emp_id: "E_" + Math.floor(100000 + Math.random() * 900000),
                        role: "User",
                                //language: localStorage.getItem('language')
                    }
                };

                $http.post('http://127.0.0.1:8090/process_post', user_data)
                        .then(function (response) {

                            $('#myModal').modal('hide');
                        });

            }
            function login() {
                $scope.incorrect = false;
                $scope.LoginForm.$submitted = false;
                $scope.registrationData.loginData = {};
                $('#login').modal('show');
            }
            function doLogin() {
                debugger;
                var cond = {email: $scope.registrationData.loginData.userName, password: $scope.registrationData.loginData.password};
                $http.post('http://127.0.0.1:8090/login', cond)
                        .then(function (response) {
                            if (response.status === 200) {
                                $scope.incorrect = false;
                                $scope.logReg = false;
                                $localStorage.loginData = response.data.login;
                                $('#login').modal('hide');
                            } else {
                                $scope.incorrect = true;
                            }
                        });
            }
            $scope.getCountry = dataService.getCountry(function (response) {
                $scope.countries.country = response.data.data;
            });

            $scope.getState = function (country) {
                $scope.countries.states = [];
                var cond = {
                    where: {country: country}
                };
                $http.post('http://109.237.25.22:3002/api/query/execute/conditions/State', cond)
                        .then(function (response) {
                            $scope.countries.states = response.data.data;
                        });
            };
            $scope.getCities = function (state) {
                $scope.countries.cities = [];
                var cond = {
                    where: {state: state}
                };
                $http.post('http://109.237.25.22:3002/api/query/execute/conditions/City', cond)
                        .then(function (response) {
                            $scope.countries.cities = response.data.data;
                        });
            };


        });