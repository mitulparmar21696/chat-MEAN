'use strict';
angular.module('DemoApp')
        .controller('shareSpaceConfigCtrl', ['$scope', '$http', '$location', 'Upload', function ($scope, $http, $location, Upload) {
                //==============================================================
                //Declaration of variables
                //==============================================================
                $scope.addType = false;
                $scope.shareSpaceData = {
                    type: {},
                    typeData: []
                };
                $scope.myConfig = {
                    typeOfSpace: true,
                    categoryOfSpace: false,
                    facilitiesOfSpace: false
                };
                //==============================================================
                //Declaration of functions
                //==============================================================
                $scope.init = init;
                $scope.addTypeOfSpace = addTypeOfSpace;
                $scope.saveType = saveType;
                $scope.editTypeOfSpace = editTypeOfSpace;
                $scope.deleteSpaceType = deleteSpaceType;
                $scope.categoryTab = categoryTab;
                $scope.typeSpaceTab = typeSpaceTab;
                $scope.facilitySpaceTab = facilitySpaceTab;
                //==============================================================
                //Implimentation of functions
                //==============================================================
                function init() {
                    getShareType();
                    getCategories();
                    getFacilities();
                }
                //===========Tab Operations===========================
                function categoryTab() {
                    $scope.myConfig = {
                        typeOfSpace: false,
                        categoryOfSpace: true,
                        facilitiesOfSpace: false
                    };
                }
                function typeSpaceTab() {
                    $scope.myConfig = {
                        typeOfSpace: true,
                        categoryOfSpace: false,
                        facilitiesOfSpace: false
                    };
                }
                function facilitySpaceTab() {
                    $scope.myConfig = {
                        typeOfSpace: false,
                        categoryOfSpace: false,
                        facilitiesOfSpace: true
                    };
                }
                //Add Share Type
                function addTypeOfSpace() {
                    $scope.addType = !$scope.addType;
                }
                //Get Share Type
                function getShareType() {
                    $http.get('http://127.0.0.1:8090/getShareType')
                            .then(function (response) {
                                $scope.shareSpaceData.typeData = response.data.data;
                            });

                }
                function editTypeOfSpace(item) {
                    $scope.shareSpaceData.type = {};
                    $scope.shareSpaceData.type = item;
                    $scope.addType = !$scope.addType;
                }
                //Save Share Type
                function saveType() {
                    if ($scope.shareSpaceData.type._id) {
                        $http.post('http://127.0.0.1:8090/updateShareType', $scope.shareSpaceData.type)
                                .then(function (response) {
                                    init();
                                    $scope.addType = !$scope.addType;
                                });
                    } else {
                        $http.post('http://127.0.0.1:8090/saveShareType', $scope.shareSpaceData.type)
                                .then(function (response) {
                                    init();
                                    $scope.addType = !$scope.addType;
                                });
                    }
                    $scope.shareSpaceData.type = {};
                }
                //Delete Share Space Type
                function deleteSpaceType(item, index) {
                    var r = confirm("Are You Sure for Delete?");
                    if (r === true) {
                        var id = item._id;
                        $http.delete('http://127.0.0.1:8090/deleteShareSpace/' + id)
                                .then(function (response) {
                                    if (response.data.response === true) {
                                        $scope.shareSpaceData.typeData.splice(index, 1);
                                    }
                                });
                    } else {
                        return;
                    }
                }

                //==================Category====================================

                //==============================================================
                //Declaration of variables
                //==============================================================
                $scope.addCategory = false;
                $scope.category = {
                    categoryList: [],
                    catData: {}
                };
                $scope.spaceImage = {};
                $scope.myImage = null;
                //==============================================================
                //Declaration of functions
                //==============================================================
                $scope.addTypeOfCategory = addTypeOfCategory;
                $scope.saveCategory = saveCategory;
                $scope.deleteSpaceCategory = deleteSpaceCategory;
                $scope.editTypeOfCategory = editTypeOfCategory;
                $scope.deleteCategoryImage = deleteCategoryImage;
                //==============================================================
                //Implimentation of functions
                //==============================================================
                function getCategories() {
                    $http.get('http://127.0.0.1:8090/getCategories')
                            .then(function (response) {
                                
                                $scope.category.categoryList = response.data.data;
                            });
                }
                function addTypeOfCategory() {
                    $scope.category.catData = {};
                    $scope.addCategory = !$scope.addCategory;
                }
                function editTypeOfCategory(item) {
                    
                    $scope.category.catData = item;
                    $scope.addCategory = !$scope.addCategory;
                    var id = item._id;
                    $http.get('http://127.0.0.1:8090/image/' + id)
                            .then(function (response) {
                                
                                $scope.myImage = response.data.imageData[0].b64;
                            });
                }

                function saveCategory() {
                    $scope.category.catData;
                    
                    if ($scope.category.catData._id) {
                        
                        $http.post('http://127.0.0.1:8090/updateCategory', $scope.category.catData)
                                .then(function (response) {
                                    
                                    if ($scope.category.catData.file) {
                                        $scope.spaceid = $scope.category.catData._id
                                        $scope.upload($scope.category.catData.file);
                                    } else {

                                    }
                                });
                    } else {
                        $http.post('http://127.0.0.1:8090/saveCategory', $scope.category.catData)
                                .then(function (response) {
                                    
                                    $scope.spaceid = response.data.data.ops[0]._id;
                                    $scope.upload($scope.category.catData.file);
                                });
                    }

                }

                $scope.upload = function (file) {
                    Upload.upload({
                        url: 'http://127.0.0.1:8090/upload', //webAPI exposed to upload the file
                        data: {file: file}, //pass file as data, should be user ng-model
                        params: $scope.spaceid
                    }).then(function (resp) { //upload function returns a promise
                        if (resp.data.error_code === 0) { //validate success
                            $scope.fileObj = resp.data.file;
                            updateImage()
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
                    $scope.spaceImage._id = $scope.spaceid;
                    $scope.spaceImage.images = $scope.fileObj;
                    $http.post('http://127.0.0.1:8090/updateSpace', $scope.spaceImage)
                            .then(function (response) {
                                $scope.addCategory = !$scope.addCategory;
                                init();
                            });
                }
                function deleteSpaceCategory(item, index) {
                    var r = confirm("Are You Sure for Delete?");
                    if (r === true) {
                        var id = item._id;
                        $http.delete('http://127.0.0.1:8090/deleteSpaceCategory/' + id)
                                .then(function (response) {
                                    
                                    if (response.data.response === true) {
                                        $scope.category.categoryList.splice(index, 1);
                                    }
                                });
                    } else {
                        return;
                    }
                }
                function deleteCategoryImage(item) {
                    
                    var id = item;
                    $http.delete('http://127.0.0.1:8090/deleteCategoryImage/' + id)
                            .then(function (response) {
                                if (response.data.response === true) {
                                    $scope.myImage = null;
                                }
                            });
                }
                //==================Facilities==================================

                //==============================================================
                //Declaration of variables
                //==============================================================
                $scope.spaceFacilities = {
                    facility: {},
                    facilityList: []
                }

                //==============================================================
                //Declaration of functions
                //==============================================================
                $scope.addFacilityOfSpace = addFacilityOfSpace;
                $scope.saveFacility = saveFacility;
                $scope.deleteSpaceFacility = deleteSpaceFacility;
                $scope.editTypeOfFacility = editTypeOfFacility;
                //==============================================================
                //Implimentation of functions
                //==============================================================
                function addFacilityOfSpace() {
                    $scope.spaceFacilities.facility = {};
                    $scope.addFacility = !$scope.addFacility;

                }
                function editTypeOfFacility(item) {
                    $scope.spaceFacilities.facility = item;
                    var id = item._id;
                    $scope.addFacility = !$scope.addFacility;
                    $http.get('http://127.0.0.1:8090/image/' + id)
                            .then(function (response) {
                                
                                $scope.myArray = response.data.imageData;
                            });
                }
                function getFacilities() {
                    $http.get('http://127.0.0.1:8090/getFacilities')
                            .then(function (response) {
                                $scope.spaceFacilities.facilityList = response.data.data;
                            });
                }
                function saveFacility() {
                    
                    if ($scope.spaceFacilities.facility._id) {
                        
                        $http.post('http://127.0.0.1:8090/updateFacilities', $scope.spaceFacilities.facility)
                                .then(function (response) {
                                    $scope.addFacility = !$scope.addFacility;
                                    init();
                                });
                    } else {
                        
                        $http.post('http://127.0.0.1:8090/saveFacilities', $scope.spaceFacilities.facility)
                                .then(function (response) {
                                    $scope.addFacility = !$scope.addFacility;
                                    init();
                                });
                    }

                }
                function deleteSpaceFacility(item, index) {
                    var r = confirm("Are You Sure for Delete?");
                    if (r === true) {
                        var id = item._id;
                        
                        $http.delete('http://127.0.0.1:8090/deleteSpaceFacility/' + id)
                                .then(function (response) {
                                    
                                    if (response.data.response === true) {
                                        $scope.spaceFacilities.facilityList.splice(index, 1);
                                    }
                                });
                    } else {
                        return;
                    }
                }
            }
        ]);
        