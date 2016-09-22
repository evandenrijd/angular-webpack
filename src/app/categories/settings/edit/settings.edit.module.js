import angular from 'angular';
import '../../../common/settings.module';
import {dump_obj} from '../../../utils';
import settingsCtor from '../../../../common/settings_ctor';

(function() {

  angular.module('categories.settings.edit', [])
    .config(function ($stateProvider) {
      "ngInject";
      $stateProvider

        .state('gecopa.admin.settings', {
          url: '/settings',
          views: {
            'content@': {  //absolutely targets the named view in root unnamed state.
              //<div ui-view='content'/> within index.html
              controller: 'SettingsEditController as vm',
              template: require('./settings.edit.tmpl.html')
            }
          }
        })

      ;
    })

    .controller('SettingsEditController',
                function settingsEditControllerFactory(gcpSettingsCtorFactory, gcpSettingsService, toastMixin) {
                  "ngInject";
                  return toastMixin.mixin(settingsEditControllerCtor({}, {gcpSettingsCtorFactory, gcpSettingsService}));
                })

  ;

  function settingsEditControllerCtor(spec, my) {
    let self = {};
    my = my || {};

    let settings; //the real settings

    //Public API
    self.submit = submit;
    self.cancel = init;

    let layout = [
      {
        className: 'layout-row',
        fieldGroup: [
          {
            className: 'flex',
            key: 'admins',
            validators: {
              checkListSeparatedByColons: {
                expression: function($modelValue, $viewValue, scope) {
                  let value = $modelValue || $viewValue;
                  return my.gcpSettingsCtorFactory({admins: value}).check();
                },
                message: function($modelValue, $viewValue, scope) {
                  return 'Not good';
                }
              }
            }
          },
        ]
      },
    ];
    //Initialise and fetch remotely
    my.gcpSettingsService.load().then(function(factory) {
      settings = factory.get();
      self.fields = settings.getFormlyFields({layout: layout});
      self.model = settings.getFormlyModel();
    });
    return self;

    function submit() {
      my.gcpSettingsService.set(self.model);
      my.gcpSettingsService.store().then(response => {
        self.toast({id: 'DATA_PERSISTED'});
      }).catch(err => {
        console.error('Failed to store settings, ', err);
        self.toast({id: 'DATA_NOT_PERSISTED'});
      });
    }

    function init() {
      self.model = settings.getFormlyModel();
      return self;
    }
  };

})();
