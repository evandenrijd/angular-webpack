import angular from 'angular';
import '../../../common/settings.module';
import {dump_obj} from '../../../utils';

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
                function settingsEditControllerFactory(settings, toastMixin) {
                  "ngInject";
                  return toastMixin.mixin(settingsEditControllerConstructor({}, {settings}));
                })

  ;

  function settingsEditControllerConstructor(spec, my) {
    let self = spec || {};
    my = my || {};

    let settings; //the real settings

    //Public API
    self.submit = submit;
    self.cancel = init;

    let layout = [
      {
        className: 'layout-row',
        fieldGroup: [
          { className: 'flex-33', key: 'admins' },
        ]
      },
    ];
    my.settings.load().then(function(factory) {
      settings = factory.get();
      self.fields = settings.getFormlyFields({layout: layout});
      self.model = settings.getFormlyModel();
    });
    return self;

    function submit() {
      my.settings.set(self.model);
      my.settings.store().then(response => {
        self.toast({id: 'DATA_PERSISTED'});
      }).catch(err => {
        self.toast({id: 'DATA_NOT_PERSISTED'});
      });
    }

    function init() {
      self.model = my.settings.getFormlyModel();
      return self;
    }
  };

})();
