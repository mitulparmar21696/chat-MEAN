'use strict';
angular.module('DemoApp')
        .controller('userProfileCtrl', ['$scope', '$http', '$localStorage', 'Upload', function ($scope, $http, $localStorage, Upload) {
                //==============================================================
                //Declaration of variables
                //==============================================================
                $scope.default = false;
                $scope.user={};
                //==============================================================
                //Declaration of functions
                //==============================================================
                $scope.init = init;


                //==============================================================
                //Implimentation of functions
                //==============================================================
                function init() {
                    $scope.userId = $localStorage.loginData._id;
                    $scope.user = $localStorage.loginData._id;
                    debugger;
                    getImage();
                }
                function getImage() {
                    $http.get('http://127.0.0.1:8090/getUserImage/' + $localStorage.loginData._id)
                            .then(function (response) {
                                debugger;
                                if (response.data.image === false) {
                                    $scope.defaultImage = true;
                                }
                                $scope.file = response.data;
                            });
                }
                $scope.upload = function (file) {
                    debugger;
                    Upload.upload({
                        url: 'http://127.0.0.1:8090/upload', //webAPI exposed to upload the file
                        data: {file: file}, //pass file as data, should be user ng-model
                        params: $localStorage.loginData._id
                    }).then(function (resp) { //upload function returns a promise
                        if (resp.data.error_code === 0) { //validate success
                            $scope.fileObj = resp.data.file;
                            updateImage();
                        } else {
                        }
                    }, function (resp) { //catch error
                        console.log('Error status: ' + resp.status);
                    }, function (evt) {

                        console.log(evt);
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                        $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                    });
                };
                function updateImage() {
                    debugger;
                    $scope.spaceImage = {};
                    $scope.spaceImage._id = $localStorage.loginData._id;
                    $scope.spaceImage.images = $scope.fileObj;
                    $http.post('http://127.0.0.1:8090/updateSpace', $scope.spaceImage)
                            .then(function (response) {
                                debugger;
                                getImage();
                            });
                }
            }]);

