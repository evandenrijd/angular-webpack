import angular from 'angular';

import '../common/category.module';

import './concours/concoursList.module';
import './settings/settings.module';
import './preferences/preferences.module';

(function() {

  angular.module('categories', [
    'categories.concoursList',
    'categories.settings',
    'categories.preferences',
    'gecopa.common.category'
  ])
    .config(function ($stateProvider) {
      "ngInject";
      $stateProvider

        .state('gecopa.admin', {
          url: '',
          abstract: true,
          views: {
            'categories@': {
              controller: 'CategoriesListController as vm',
              template: require('./categories.tmpl.html')
            },
          }
        })

        .state('gecopa.admin.welcome', {
          url: '/welcome',
          views: {
            'content@': { //absolutely targets the named view in root unnamed state.
                          //<div ui-view='content'/> within index.html
              controller: 'WelcomeController as vm',
              template: require('./welcome.tmpl.html')
            }
          },
        })

      ;
    })

    .controller('CategoriesListController', function ($log, $state, gcpAppState, gcpCategoryService) {
      "ngInject";
      return categoriesListControllerConstructor({}, {$log, $state, gcpAppState, gcpCategoryService});
    })

    .controller('WelcomeController', function($log, gcpAppState, $translate){
      "ngInject";
      return welcomeControllerConstructor({}, {$log, gcpAppState, $translate});
    })
  ;

  function categoriesListControllerConstructor(spec, my) {
    let self = {};
    my = my || {}; //shared state (global deps);
    let categories = my.gcpCategoryService.load();

    //Public API
    self.getCategories = getCategories;
    self.selectCategory = selectCategory;
    self.getSelectedCategory = getSelectedCategory;
    return self;

    function getCategories() {
      return categories;
    }

    function selectCategory(category) {
      my.gcpAppState.set('category', category);
      my.$state.go(my.gcpAppState.get('category').getNgUiRouterState());
    }

    function getSelectedCategory() {
      return my.gcpAppState.get('category');
    }

  }

  function welcomeControllerConstructor(spec, my) {
    let self = {};
    my = my || {}; //shared state (global deps);

    //public API
    my.gcpAppState.userAPIMixin(self);
    self.onSubmit = onSubmit;
    self.onReset = onReset;

    self.fields = [
      {
        className: 'layout-column',
        fieldGroup: [
          {
            key: 'username',
            className: 'layout-row flex-33',
            type: 'input',
            templateOptions: {
              label: 'Username:', //overwritten by expressionProperties
              required: true,
            },
            expressionProperties: {
              'templateOptions.label': () => {
                return my.$translate('login_username');
              }
            }
          },
          {
            key: 'password',
            className: 'layout-row flex-33',
            type: 'input',
            templateOptions: {
              label: 'Password:', //overwritten by expressionProperties
              required: true,
            },
            expressionProperties: {
              'templateOptions.label': () => {
                return my.$translate('login_password');
              }
            }
          },
        ],
      },
    ];

    self.model = {
      username: '',
      password: ''
    };

    self.options = {};

    function onSubmit() {
      self.login(self.model.username, self.model.password).then(() => {
        self.options.updateInitialValue();
      }).catch(() => {
        onReset();
      });
    }

    function onReset() {
      self.model.username = '';
      self.model.password = '';
    }

    function getFormlyVersion() {
      var versionGetter = /formly-js\/angular-formly\/(.*?)\/dist\//;
      var script = document.querySelector('script[src$="formly.js"]');
      var match = script && script.src && versionGetter.exec(script.src);
      return match && match[1];
    };

    self.env = {};
    if (angular.version.full) self.env.angularVersion = angular.version.full;
    if (getFormlyVersion()) self.env.formlyVersion = getFormlyVersion();
    if (my.gcpAppState.toString()) self.env.gcpAppState = my.gcpAppState.toString();

    return self;
  }

})();
