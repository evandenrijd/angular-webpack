import angular from 'angular';
angular.module('gecopa.models.concours', [])
    .service('concoursService', function ConcoursService($http, $q) {
        var self = {},
            URLS = {
                FETCH: 'data/concours.json'
            },
            concours;

        function extract(result) {
            return result.data;
        }

        function cacheConcours(result) {
            concours = extract(result);
            return concours;
        }

        function findConcours(concoursId) {
            return _.find(concours, function (aConcours) {
                return aConcours.id === parseInt(concoursId, 10);
            })
        }

        self.loadAllConcours = function () {
            return (concours) ? $q.when(concours) :
            $http.get(URLS.FETCH).then(cacheConcours);
        };

        self.getConcoursById = function (concoursId) {
            var deferred = $q.defer();
            if (concours) {
                deferred.resolve(findConcours(concoursId))
            } else {
                self.getConcours().then(function () {
                    deferred.resolve(findConcours(concoursId))
                })
            }
            return deferred.promise;
        };

        self.createConcours = function (aConcours) {
            aConcours.id = aConcours.length;
            concours.push(aConcours);
        };

        self.updateConcours = function (aConcours) {
            var index = _.findIndex(concours, function (b) {
                return b.id === aConcours.id
            });

            concours[index] = aConcours;
        };

        self.deleteConcours = function (aConcours) {
            _.remove(concours, function (b) {
                return b.id === aConcours.id;
            });
        };

        return self;
    });
