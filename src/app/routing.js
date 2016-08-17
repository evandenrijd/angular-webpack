// routing.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider'];

export default function routing($urlRouterProvider, $locationProvider, $stateProvider) {
  $stateProvider.state('gecopa', {
    url: '',
    abstract: true
  });
  // $locationProvider.html5Mode(true);

  $urlRouterProvider.when("", "/welcome");
  $urlRouterProvider.when("/", "/welcome");

  // For any unmatched url
  $urlRouterProvider.otherwise('/');
}
