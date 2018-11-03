var app = angular.module("DemoApp", [
    'ngRoute',
    'ngStorage',
    'ui.bootstrap',
    'vsGoogleAutocomplete',
    '720kb.datepicker',
    'ngFileUpload',
]);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
                when('/', {
                    templateUrl: 'templates/menu.html',
                    controller: 'menuctrl'
                }).
                when('/Home', {
                    templateUrl: 'templates/dashboard.html',
                }).
                when('/add-share-job', {
                    templateUrl: 'templates/share-job.html',
                    controller: 'userListCtrl'
                }).
                when('/share-job', {
                    templateUrl: 'templates/share-job-list.html',
                    controller: 'shareJobCtrl'
                }).
                when('/share-space-add', {
                    templateUrl: 'templates/share-space.html',
                    controller: 'shareSpaceCtrl'
                }).
                when('/share-space', {
                    templateUrl: 'templates/share-list.html',
                    controller: 'shareSpaceList'
                }).
                otherwise({
                    redirectTo: '/'
                });
    }])
        .controller('userListCtrl', ['$scope', '$http', '$location', '$localStorage', function ($scope, $http, $location, $localStorage) {
                //==============================================================
                //Declaration of variables
                //==============================================================
                $scope.jobDetails = {
                    jobType: [],
                    jobIndustry: [],
                    jobDesignation: [],
                    jobCategory: [],
                    jobCompensation: [],
                    jobQualification: [],
                    jobExperience: [],
                    jobFlexWorkType: []
                }
                $scope.currency = {
                    countryCurrency: [
                        {
                            id: 1,
                            name: 'USD'
                        },
                        {
                            id: 2,
                            name: 'RS'
                        },
                        {
                            id: 3,
                            name: 'Dollar'
                        }
                    ]
                }
                $scope.registrationData = {
                    register: {
                        sharedBy: 'Personnal profile',
                        accessToHandicap: 'Yes'
                    }
                }
                $scope.availableDatePopup = {
                    opened: false
                };


                $scope.dateFormat = 'MM/dd/yyyy';
                //==============================================================
                //Declaration of functions
                //==============================================================
                $scope.init = init;
                $scope.postJob = postJob;

                //==============================================================
                //Implimentation of functions
                //==============================================================
                function init() {
                    debugger;
                    getJobAddPermission();
                    getJobType();
                }
                function getJobAddPermission() {

                }

                function postJob() {

                    var shareJob_json = {
                        'jobTitle': $scope.registrationData.register.jobTitle,
                        'jobType': $scope.registrationData.register.jobType.name,
                        'jobIndustry': $scope.registrationData.register.jobIndustry.name,
                        'jobDesignation': $scope.registrationData.register.jobDesignation.name,
                        'jobDescription': $scope.registrationData.register.jobDescription,
                        'jobCategory': $scope.registrationData.register.jobCategory.name,
                        'sharedBy': $scope.registrationData.register.sharedBy,
                        'address': $scope.registrationData.register.address,
                        'vacancyDates': $scope.registrationData.register.vacancyDates,
                        'jobCompensation': $scope.registrationData.register.jobCompensation.name,
                        'jobExperience': $scope.registrationData.register.jobExperience.name,
                        'jobQualification': $scope.registrationData.register.jobQualification.name,
                        'accessToHandicap': $scope.registrationData.register.accessToHandicap,
                        'jobFlexWorkType': $scope.registrationData.register.jobFlexWorkType.name,
                        'currency': $scope.registrationData.register.currency.name,
                        'userId': $localStorage.loginData._id
                    }
                    $http.post('http://127.0.0.1:8090/saveShareJobs', shareJob_json)
                            .then(function (response) {
                                $location.path('/share-job')
                            });
                }
                function getJobType() {

                    $http.get('http://109.237.25.22:3002/api/query/JobType')
                            .then(function (response) {
                                $scope.jobDetails.jobType = response.data.data;
                                getJobIndustry();
                            });
                }
                function getJobIndustry() {

                    $http.get('http://109.237.25.22:3002/api/query/JobIndustry')
                            .then(function (response) {
                                $scope.jobDetails.jobIndustry = response.data.data;
                                getJobDesignation();
                            });
                }
                function getJobDesignation() {

                    $http.get('http://109.237.25.22:3002/api/query/JobDesignation')
                            .then(function (response) {
                                $scope.jobDetails.jobDesignation = response.data.data;
                                getJobCategory();
                            });
                }
                function getJobCategory() {

                    $http.get('http://109.237.25.22:3002/api/query/Category')
                            .then(function (response) {
                                $scope.jobDetails.jobCategory = response.data.data;
                                getJobCompensation();
                            });
                }
                function getJobCompensation() {

                    $http.get('http://109.237.25.22:3002/api/query/JobCompensation')
                            .then(function (response) {
                                $scope.jobDetails.jobCompensation = response.data.data;
                                getJobQualification();
                            });
                }
                function getJobQualification() {

                    $http.get('http://109.237.25.22:3002/api/query/Qualification')
                            .then(function (response) {
                                $scope.jobDetails.jobQualification = response.data.data;
                                getJobExperience();
                            });
                }
                function getJobExperience() {

                    $http.get('http://109.237.25.22:3002/api/query/JobExperience')
                            .then(function (response) {
                                $scope.jobDetails.jobExperience = response.data.data;
                                getFlexWorkType();
                            });
                }
                function getFlexWorkType() {

                    $http.get('http://109.237.25.22:3002/api/query/JobLocation')
                            .then(function (response) {
                                $scope.jobDetails.jobFlexWorkType = response.data.data;
                            });
                }
                $scope.OpenAvailableDate = function () {

                    $scope.availableDatePopup.opened = true;
                }

            }])
        //Share Controller Start
        .controller('shareJobCtrl', ['$scope', '$http', function ($scope, $http) {
                //==============================================================
                //Declaration of variables
                //==============================================================
                $scope.jobData = {
                    jobs: []
                }

                //==============================================================
                //Declaration of functions
                //==============================================================
                $scope.init = init;

                //==============================================================
                //Implimentation of functions
                //==============================================================
                function init() {
                    getShareJobs();
                }
                function getShareJobs() {
                    $http.get('http://127.0.0.1:8090/shareJobList')
                            .then(function (response) {
                                $scope.jobData.jobs = response.data.ShareJob;
                            });
                }
            }])


        .controller('shareSpaceCtrl', ['$scope', '$http', 'Upload', 'dataService', '$window', '$location','$localStorage', function ($scope, $http, Upload, dataService, $window, $location,$localStorage) {
                //==============================================================
                //Declaration of variables
                //==============================================================
                $scope.spaceDetails = {
                    space: [],
                    categories: []
                };

                $scope.time = null;
                $scope.spaceForm = {
                    openingHours: [
                        {
                            id: 1,
                            Day: 'Monday',
                            Disable: false,
                            startFrom: null,
                            upTo: null
                        },
                        {
                            id: 2,
                            Day: 'Tuesday',
                            Disable: false,
                            startFrom: null,
                            upTo: null
                        },
                        {
                            id: 3,
                            Day: 'Wednesday',
                            Disable: false,
                            startFrom: null,
                            upTo: null
                        },
                        {
                            id: 4,
                            Day: 'Thursday',
                            Disable: false,
                            startFrom: null,
                            upTo: null
                        },
                        {
                            id: 5,
                            Day: 'Friday',
                            Disable: false,
                            startFrom: null,
                            upTo: null
                        },
                        {
                            id: 6,
                            Day: 'Saturday',
                            Disable: false,
                            startFrom: null,
                            upTo: null
                        },
                        {
                            id: 7,
                            Day: 'Sunday',
                            Disable: false,
                            startFrom: null,
                            upTo: null
                        }
                    ],
                    categoryOfSpace: [
                        {
                            categoryOfSpace: null,
                            Quantity: null,
                            Capacityofpersons: null,
                            M2: null,
                            Tarifperhour: null,
                            Tarifperhalfday: null,
                            Tarifperday: null,
                            Tarifpermonth: null
                        }
                    ],
                    requestInformation: 'Less then an hour',
                    images: []
                };
                $scope.spaceCatError = false;
                $scope.nullValue = [];
                $scope.countries = {
                    country: []
                };
                $scope.spaceid = null;
                $scope.spaceImage = {};
                //==============================================================
                //Declaration of functions
                //==============================================================
                $scope.init = init;
                $scope.getClock = getClock;
                $scope.checkTime = checkTime;
                $scope.shareSpace = shareSpace;
                $scope.addSpace = addSpace;
                $scope.checkValid = checkValid;

                //==============================================================
                //Implimentation of functions
                //==============================================================
                function init() {
                    getShareJobs()
                }
                $scope.getCountry = dataService.getCountry(function (response) {
                    $scope.countries.country = response.data.data;
                });
                function getClock(hours) {
                    debugger;
                    $('.clockpicker').clockpicker();
                    $('.clockpicker').clockpicker()
                            .find('input').change(function () {
                        // TODO: time changed
                        $scope.time = this.value;
                    });

                }
                function checkTime(hour, flag) {
                    angular.forEach($scope.spaceForm.openingHours, function (value) {
                        if (value.id === hour.id) {
                            if (flag === 0) {
                                value.startFrom = $scope.time;
                            } else {
                                value.upTo = $scope.time;
                            }
                        }
                    });
                }
                function addSpace() {
                    debugger;
                    var count = $scope.spaceForm.categoryOfSpace.length - 1;
                    var checkObj = $scope.spaceForm.categoryOfSpace[count];
                    if (!angular.isUndefined(checkObj.categoryOfSpace.name) || checkObj.categoryOfSpace !== null) {
                        if (checkObj.categoryOfSpace.name === 'Meeting room' || checkObj.categoryOfSpace.name === 'Conference area') {
                            if (
                                    checkObj.categoryOfSpace.name === null ||
                                    checkObj.Quantity === null ||
                                    checkObj.Capacityofpersons === null ||
                                    checkObj.M2 === null ||
                                    checkObj.Tarifperhour === null ||
                                    checkObj.Tarifperhalfday === null ||
                                    checkObj.Tarifperday === null
                                    ) {
                                return;
                            }
                        } else {
                            if (
                                    checkObj.categoryOfSpace.name === null ||
                                    checkObj.Quantity === null ||
                                    checkObj.Capacityofpersons === null ||
                                    checkObj.M2 === null ||
                                    checkObj.Tarifperhour === null ||
                                    checkObj.Tarifperhalfday === null ||
                                    checkObj.Tarifperday === null ||
                                    checkObj.Tarifpermonth === null
                                    ) {
                                return;

                            }
                        }
                    } else {

                        return;
                    }

                    $scope.spaceForm.categoryOfSpace.push(
                            {
                                categoryOfSpace: null,
                                Quantity: null,
                                Capacityofpersons: null,
                                M2: null,
                                Tarifperhour: null,
                                Tarifperhalfday: null,
                                Tarifperday: null,
                                Tarifpermonth: null
                            }
                    );
                }

                function checkValid() {
                    debugger;
                    $scope.nullValue = [];
                    angular.forEach($scope.spaceForm.categoryOfSpace, function (checkObj) {
                        debugger;
                        if (checkObj.categoryOfSpace.name === 'Meeting room' || checkObj.categoryOfSpace.name === 'Conference area') {
                            if (
                                    checkObj.categoryOfSpace.name === null ||
                                    checkObj.Quantity === null ||
                                    checkObj.Capacityofpersons === null ||
                                    checkObj.M2 === null ||
                                    checkObj.Tarifperhour === null ||
                                    checkObj.Tarifperhalfday === null ||
                                    checkObj.Tarifperday === null
                                    ) {
                                $scope.nullValue.push(checkObj);

                                return;
                            } else {
                                $scope.spaceCatError = false;
                            }
                        } else {
                            if (
                                    checkObj.categoryOfSpace.name === null ||
                                    checkObj.Quantity === null ||
                                    checkObj.Capacityofpersons === null ||
                                    checkObj.M2 === null ||
                                    checkObj.Tarifperhour === null ||
                                    checkObj.Tarifperhalfday === null ||
                                    checkObj.Tarifperday === null ||
                                    checkObj.Tarifpermonth === null
                                    ) {
                                $scope.nullValue.push(checkObj)
                                $scope.spaceCatError = true;
                                return;

                            } else {
                                $scope.spaceCatError = false;
                            }
                        }
                    });
                    if ($scope.nullValue.length === 0) {
                        $scope.spaceCatError = false;
                    } else {
                        $scope.spaceCatError = true;
                    }
                }

                function getShareJobs() {
                    $http.get('http://109.237.25.22:3002/api/query/SpaceType')
                            .then(function (response) {
                                debugger;
                                $scope.spaceDetails.space = response.data.data;
                                getSpaceCategory()
                            });
                }
                function getSpaceCategory() {
                    $http.get('http://109.237.25.22:3002/api/query/SpaceCategory')
                            .then(function (response) {
                                debugger;
                                $scope.spaceDetails.categories = response.data.data;
                            });
                }
                function shareSpace() {
                    checkValid();
                    if ($scope.file.length === 0) {
                        $window.alert('Please select atleast     ');
                        return;
                    }
                    if ($scope.spaceCatError === true) {
                        return;
                    }
                    $scope.spaceForm.userId=$localStorage.loginData._id;
                    $http.post('http://127.0.0.1:8090/spaceShare', $scope.spaceForm)
                            .then(function (response) {
                                debugger;
                                $scope.spaceid = response.data.spaceshare.ops[0]._id;
                                submit();

                            });
                }

                // ===========File Upload==============
                $scope.submit = submit;
                $scope.file = [];
                function submit() { //function to call on form submit
                    $scope.upload($scope.file); //call upload function
                }
                $scope.upload = function (file) {
                    debugger;
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
                        debugger;
                        console.log('Error status: ' + resp.status);
                    }, function (evt) {
                        debugger;
                        console.log(evt);
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                        $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                    });
                };
                function updateImage() {
                    debugger;
                    $scope.spaceImage._id = $scope.spaceid;
                    $scope.spaceImage.images = $scope.fileObj;
                    $http.post('http://127.0.0.1:8090/updateSpace', $scope.spaceImage)
                            .then(function (response) {
                                debugger;
                                $location.path('/share-job')
                            });
                }

            }]);
       