'use strict';
angular.module('DemoApp')
        .controller('loginCtrl', function ($rootScope, $scope, $location, $localStorage, socialLoginService, dataService, $http) {
            //==============================================================
            //Declaration of variables
            //==============================================================

            $scope.registrationData = {
                register: {},
                myRegistrations: [],
                loginData: {}
            };

            $scope.pwdFlag = false;
            $scope.msgPassword = false;
            $scope.incorrectMessage = false;
            $scope.msg = 'Incorrect User Name or Password'
            $scope.incorrect = false;
            //==============================================================
            //Declaration of functions
            //==============================================================
            $scope.init = init;
            $scope.doLogin = doLogin;

            //==============================================================
            //Implimentation of functions
            //==============================================================
            function init() {
                
            }


            function login() {
                $scope.incorrect = false;
                $scope.LoginForm.$submitted = false;
                $scope.registrationData.loginData = {};
                $('#login').modal('show');
            }
            function doLogin() {
                var cond = {email: $scope.registrationData.loginData.userName, password: $scope.registrationData.loginData.password, role: 'Admin'};
                $http.post('http://127.0.0.1:8090/login', cond)
                        .then(function (response) {
                            
                            if (response.status === 200) {
                                $localStorage.loginData = response.data.login;
                                $scope.incorrect = false;
                                $location.path('/Home')
                                
                            } else {
                                $scope.incorrect = true;
                            }
                        });
            }


            $rootScope.$on('event:social-sign-in-success', function (event, userDetails) {
                
                $location.path('/Home');
            });
            $rootScope.$on('event:social-sign-out-success', function (event, logoutStatus) {
            });
        });