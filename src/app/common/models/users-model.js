angular.module("gecopa.models.users", [])
    .service('UsersModel', function ($http, $q) {
        var self = this,
            URLS = {
                FETCH: 'data/users.json'
            },
            users;

        function extract(result) {
            return result.data;
        }

        function cacheUsers(result) {
            users = extract(result);
            return users;
        }

        function findUser(userId) {
            return _.find(users, function (user) {
                return user.id === parseInt(userId, 10);
            })
        }

        self.getUsers = function () {
            return (users) ? $q.when(users) : $http.get(URLS.FETCH).then(cacheUsers);
        };

        self.getUserById = function (userId) {
            var deferred = $q.defer();
            if (users) {
                deferred.resolve(findUser(userId))
            } else {
                self.getUsers().then(function () {
                    deferred.resolve(findUser(userId))
                })
            }
            return deferred.promise;
        };

        self.createUser = function (user) {
            user.id = user.length;
            user.push(user);
        };

        self.updateUser = function (user) {
            var index = _.findIndex(users, function (b) {
                return b.id === user.id
            });

            users[index] = user;
        };

        self.deleteUser = function (user) {
            _.remove(users, function (b) {
                return b.id === user.id;
            });
        };
});
