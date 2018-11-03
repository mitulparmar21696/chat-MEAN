'use strict';
angular.module('DemoApp')

        .service('dataService', function ($http) {
            
            this.getCountry = function (callback) {
                debugger;
                $http.get('http://109.237.25.22:3002/api/query/Country').
                        then(callback);
            };
           
        });