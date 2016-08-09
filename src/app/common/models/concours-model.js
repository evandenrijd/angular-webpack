import angular from 'angular';
angular.module('gecopa.models.concours', [])
    .service('ConcoursModel', function ($http, $q) {
        var self = this,
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
            return _.find(concours, function (concours) {
                return concours.id === parseInt(concoursId, 10);
            })
        }

        self.getConcours = function () {
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

        self.createConcours = function (concours) {
            concours.id = concours.length;
            concours.push(concours);
        };

        self.updateConcours = function (concours) {
            var index = _.findIndex(concours, function (b) {
                return b.id === concours.id
            });

            concours[index] = concours;
        };

        self.deleteConcours = function (concours) {
            _.remove(concours, function (b) {
                return b.id === concours.id;
            });
        };
    });
