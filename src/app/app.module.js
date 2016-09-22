import $ from "jquery";
import '../assets/css/gecopa.less';

import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import ngMessages from 'angular-messages';
import ngFormly from 'angular-formly';
import ngFormlyMaterial from 'angular-formly-material';
import {dump_obj} from './utils';
import './common/preferences.module';
import './common/settings.module';
import 'angular-translate';
import 'angular-translate-loader-static-files';

import './categories/categories.module';

(function () {

  angular.module('gecopa.app', [
    ngAnimate,
    ngMaterial,
    uiRouter,
    ngMessages,
    ngFormly,
    ngFormlyMaterial,
    'gecopa.common.settings',
    'gecopa.common.preferences',
    'categories',
    'gecopa.common.concours',
    'pascalprecht.translate',
  ])

    .config(function($compileProvider, $logProvider) {
      "ngInject";
      if ('prod' === process.env.npm_lifecycle_event) {
        console.debug('production version enabled');
        $compileProvider.debugInfoEnabled(false);
        $logProvider.debugEnabled(false);
      } else {
        console.debug('none production version');
      }
    })

    .config(function($mdThemingProvider) { //ngMaterial theme
      "ngInject";
      $mdThemingProvider.theme('default')
        .primaryPalette('indigo');
    })

    .config(function uiRouter($urlRouterProvider, $locationProvider, $stateProvider) { //ui-router
      "ngInject";
      $stateProvider.state('gecopa', {
        url: '',
        abstract: true
      });
      // $locationProvider.html5Mode(true);
      $urlRouterProvider.when("", "/welcome");
      $urlRouterProvider.when("/", "/welcome");
      // For any unmatched url
      $urlRouterProvider.otherwise('/');
    })

    .run(function uiRouterErrorHandler($rootScope, $state) { //ui-router error handling
      "ngInject";
      $rootScope.$on('$stateChangeError',
                     (event, toState, toParams,
                      fromState, fromParams, error) => {
                       if (error) {
                         console.debug('$stateChangeError: ',
                                       dump_obj({toState,
                                                 toParams,
                                                 fromState,
                                                 fromParams,
                                                 error}));
                         $state.go('/');
                       }
                     }
                    );
      $rootScope.$on('$stateNotFound',
                     function(event, unfoundState, fromState, fromParams){
                       console.error('$stateNotFound: ',
                                     dump_obj({unfoundState,
                                               fromState,
                                               fromParams}));
                     });
      let date = new Date();
      console.debug('app bootstrapped at ' + date);
    })

    .run(function(formlyConfig) { //Specify custom formly templates
      "ngInject";
      formlyConfig.setType({
        name: 'inputImageFile',
        template: require('./common/formly/inputImageFile.tmpl.html')
      });
    })

    .value('defaultLanguage', 'en-BE')

    .factory('languagePreferenceFactory', function languagePreferenceFactory($window, defaultLanguage) {
      "ngInject";
      let store = $window.localStorage;
      let key = 'gecopa.admin.language';

      return {
        getLanguage: getLanguage,
        setLanguage: setLanguage
      };

      function getLanguage() {
        return store.getItem(key) || defaultLanguage;
      }

      function setLanguage(lang) {
        if (lang) {
          store.setItem(key, lang);
        } else {
          store.removeItem(key);
        }
      }
    })

  //setup i18n
    .config(function ($translateProvider, languagePreferenceFactoryProvider) {
      "ngInject";
      $translateProvider.useStaticFilesLoader({
        prefix: 'data/languages/',
        suffix: '/gecopa.lang.json'
      });
      $translateProvider.preferredLanguage(languagePreferenceFactoryProvider.$get().getLanguage());
      $translateProvider.useSanitizeValueStrategy(null); //FIXME: allow for XSS
    })

  //setup JWT
    .constant('USER_REST_API_URL', 'http://localhost:3000')
    .config(function($httpProvider) {
      "ngInject";
      $httpProvider.interceptors.push('authInterceptor');
    })

    .factory('userFactory', function userFactory($http, USER_REST_API_URL, authTokenFactory, $q) {
      "ngInject";
      return {
        login: login,
        logout: logout,
        getUser: getUser,
        isLoggedIn: isLoggedIn,
      };

      function login(username, password) {
        return $http.post(USER_REST_API_URL + '/login', {
          username: username,
          password: password
        }).then(function (response) {
          authTokenFactory.setToken(response.data.token);
          return response;
        });
      }

      function logout() {
        return $q(function (resolve, reject){
          authTokenFactory.setToken();
          resolve(self);
        });
      }

      function getUser() {
        if (authTokenFactory.getToken()) {
          return $http.get(USER_REST_API_URL + '/me');
        } else {
          return $q.reject({ data: 'client has no auth token' });
        }
      }

      function isLoggedIn() {
        return authTokenFactory.getToken();
      }

    })

    .factory('authTokenFactory', function authTokenFactory($window) {
      "ngInject";
      let store = $window.localStorage;
      let key = 'gecopa.admin.auth-token';

      return {
        getToken: getToken,
        setToken: setToken
      };

      function getToken() {
        return store.getItem(key);
      }

      function setToken(token) {
        if (token) {
          store.setItem(key, token);
        } else {
          store.removeItem(key);
        }
      }
    })

    .factory('authInterceptor', function authInterceptor($q, authTokenFactory, $injector) {
      "ngInject";
      return {
        request: addToken,
        responseError: handleResponseError
      }

      function addToken(config) {
        // console.debug('interceptor called', config);
        var token = authTokenFactory.getToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      }

      function handleResponseError(error) {
        let appState = $injector.get('appState');
        console.error('response error: ', error);
        if (error.data.match(/jwt expired/)) {
          appState.logout('ERR_login_jwt_expired')
        } else if (error.data.match(/has no admin role/)) {
          appState.logout('ERR_login_user_has_no_admin_role');
        } else {
          appState.logout('ERR_login_please_login_again')
        }
        return $q.reject(error);
      }
    })

  //Use the appState to communicate between the different controllers
    .provider('appState', function appState() {
      let self = {};
      self.$get = function appStateConstructorFactory(userFactory, $state, $window, $q, toastMixin) {
        "ngInject";
        return toastMixin.mixin(appStateConstructor({}, {userFactory, $state, $window, $q}));
      }
      return self;
    })

    .provider('toastMixin', function toastMixin() {
      let self = {};
      self.$get = function toastMixinFactory($translate, $mdToast, $q) {
        "ngInject";
        return toastMixinConstructor({}, {$translate, $mdToast, $q});
      }
      return self;
    })

    .controller('GecopaController', function gecopaController($mdSidenav, $log, appState) {
      "ngInject";
      return gecopaConstructor({}, {$mdSidenav, $log, appState});
    })

  ;

  function gecopaConstructor(spec, my) {
    let self = {};
    my = my || {};

    //public API
    self.get = get;
    self.toggleCategories = toggleCategories;
    my.appState.userAPIMixin(self);

    function get(attr) {
      return self[attr];
    }

    function set(attr, value) {
      return self[attr] = value;
    }

    function toggleCategories() {
      my.$mdSidenav('left').toggle();
    }

    return self;
  }

  function toastMixinConstructor(spec, my) {
    let self = {};

    //Public API
    self.toast = toast;
    self.mixin = mixin;
    return self;


    function _toastMsg(msg) {
      return my.$mdToast.show(my.$mdToast.simple().textContent(msg));
    }

    function toast(o) {
      if (o.id) {
        return my.$translate(o.id).then(msg => {
          _toastMsg(msg);
        }).catch(err => {
          console.error('Got translation error:', err);
          _toastMsg(o.id);
        });
      } else {
        return my.$q.resolve(_toastMsg(o.msg));
      }
    }

    function mixin(that) {
      that.toast = toast;
      return that;
    }
  }

  function appStateConstructor(spec, my) {
    let self = {};
    let data = {};

    //Public API
    self.get = get;
    self.set = set;
    self.init = init;
    self.getUserIdentifier = getUserIdentifier;
    self.isLoggedIn = isLoggedIn;
    self.login = login;
    self.logout = logout;
    self.toString = toString;
    self.userAPIMixin = userAPIMixin;

    //Initialisation, we get the username based on the auth-token
    init();
    return self;

    function init() {
      return my.$q(function(resolve, reject) {
        my.userFactory.getUser().then(function (response) {
          set('username', response.data.username); //cache only username, not password
          resolve(self);
        }).catch(function (error) {
          set('username', null);
          reject(error);
        });
      });
    }

    function get(attr) {
      return data && data[attr];
    }

    function set(attr, value) {
      data[attr] = value;
      return self;
    }

    //Expose the user API by delegation
    function userAPIMixin(that) {
      that.getUserIdentifier = self.getUserIdentifier;
      that.isLoggedIn = self.isLoggedIn;
      that.login = self.login;
      that.logout = self.logout;
      return that
    }

    function getUserIdentifier() {
      return get('username');
    };

    function isLoggedIn() {
      return my.userFactory.isLoggedIn();
    }

    function login(username, password) {
      return my.$q(function(resolve, reject){
        my.userFactory.login(username, password).then(function(response) {
          set('username', response.data.username);
          my.$window.location.reload();
          resolve(self);
        }).catch(function(error){
          set('username', null);
          console.error('login error: ', error);
          self.toast({id: 'ERR_login_wrong_username_or_password'});
          reject(error);
        });
      });
    }

    function logout(id) {
      return my.$q(function(resolve) {
        my.userFactory.logout().then(() => {
          set('username', null);
          my.$state.go('gecopa.admin.welcome');
          resolve(self);
        });
      }).then(() => {
        if (id) self.toast({id: id});
      });
    }

    function toString(){
      let result = '{';
      Object.keys(data).map(a => {
        result = result + a + ': ' + dump_obj(self.get(a));
      });
      result = result + 'data: ' + dump_obj(data);
      result = result + '}';
      return result;
    }
  }

})();
