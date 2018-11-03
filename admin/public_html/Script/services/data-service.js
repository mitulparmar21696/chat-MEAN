'use strict';
angular.module('DemoApp')

        .service('dataService', function ($http) {

            this.getCountry = function (callback) {
                
                $http.get('http://localhost:9000/api/query/Country').
                        then(callback);
                
            };

        });