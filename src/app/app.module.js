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
      $mdThemingProvider.theme("success-toast");
      $mdThemingProvider.theme("error-toast");
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
      $httpProvider.interceptors.push('gcpAuthInterceptor');
    })

    .factory('gcpUserFactory', function gcpUserFactory($http, USER_REST_API_URL, gcpAuthTokenFactory, $q) {
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
          gcpAuthTokenFactory.setToken(response.data.token);
          return response;
        });
      }

      function logout() {
        return $q(function (resolve, reject){
          gcpAuthTokenFactory.setToken();
          resolve(self);
        });
      }

      function getUser() {
        if (gcpAuthTokenFactory.getToken()) {
          return $http.get(USER_REST_API_URL + '/me');
        } else {
          return $q.reject({ data: 'client has no auth token' });
        }
      }

      function isLoggedIn() {
        return gcpAuthTokenFactory.getToken();
      }

    })

    .factory('gcpAuthTokenFactory', function gcpAuthTokenFactory($window) {
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

    .factory('gcpAuthInterceptor', function gcpAuthInterceptor($q, gcpAuthTokenFactory, $injector) {
      "ngInject";
      return {
        request: addToken,
        responseError: handleResponseError
      }

      function addToken(config) {
        // console.debug('interceptor called', config);
        var token = gcpAuthTokenFactory.getToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      }

      function handleResponseError(error) {
        let gcpAppState = $injector.get('gcpAppState');
        console.error('response error: ', error);
        if (error.data.match(/jwt expired/)) {
          gcpAppState.logout('ERR_login_jwt_expired')
        } else if (error.data.match(/has no admin role/)) {
          gcpAppState.logout('ERR_login_user_has_no_admin_role');
        } else {
          gcpAppState.logout('ERR_login_please_login_again')
        }
        return $q.reject(error);
      }
    })

  //Use the gcpAppState to communicate between the different controllers
    .provider('gcpAppState', function gcpAppState() {
      let self = {};
      self.$get = function gcpAppStateCtorFactory(gcpUserFactory, $state, $window, $q, toastMixin) {
        "ngInject";
        return toastMixin.mixin(gcpAppStateCtor({}, {gcpUserFactory, $state, $window, $q}));
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

    .controller('GecopaController', function gecopaController($mdSidenav, $log, gcpAppState) {
      "ngInject";
      return gecopaConstructor({}, {$mdSidenav, $log, gcpAppState});
    })

  ;

  function gecopaConstructor(spec, my) {
    let self = {};
    my = my || {};

    //public API
    self.get = get;
    self.toggleCategories = toggleCategories;
    my.gcpAppState.userAPIMixin(self);
    return self;

    function get(attr) {
      return self[attr];
    }

    function set(attr, value) {
      return self[attr] = value;
    }

    function toggleCategories() {
      my.$mdSidenav('left').toggle();
    }
  }

  function toastMixinConstructor(spec, my) {
    let self = {};
    let delay = 2000;

    //Public API
    self.toast = toast;
    self.mixin = mixin;
    return self;

    function _toastMsg(msg, type) {
      let toast = my.$mdToast
          .simple()
          .textContent(msg)
          .hideDelay(delay);
      if (!type) {
        return my.$mdToast.show(toast);
      } else {
        return my.$mdToast.show(toast.theme(type + '-toast'));
      }
    }

    function _typeBasedOnId(id) {
      if (/^ERR_/.test(id)) {
        return 'error';
      } else {
        return 'success';
      }
    }

    function toast(o) {
      if (o.id) {
        let type = _typeBasedOnId(o.id);
        return my.$translate(o.id).then(msg => {
          _toastMsg(msg, type);
        }).catch(err => {
          console.error('Got translation error:', err);
          _toastMsg(o.id, type);
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

  function gcpAppStateCtor(spec, my) {
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
        my.gcpUserFactory.getUser().then(function (response) {
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
      return my.gcpUserFactory.isLoggedIn();
    }

    function login(username, password) {
      return my.$q(function(resolve, reject){
        my.gcpUserFactory.login(username, password).then(function(response) {
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
        my.gcpUserFactory.logout().then(() => {
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
