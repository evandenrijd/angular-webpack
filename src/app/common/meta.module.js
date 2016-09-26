import angular from 'angular';
import _ from 'underscore';
import {dump_obj} from '../utils';
import metaDataCtor from '../../common/meta_data_ctor';

(function(){

  angular.module('gecopa.common.meta', [])

    .provider('meta', function metaProvider() {
      this.$get = function($translate, languagePreferenceFactory) {
        "ngInject";
        return metaCtor({}, {$translate, languagePreferenceFactory});
      }
    })

  ;

  function metaCtor(spec, my) {
    let self = metaDataCtor(spec, my);

    const data = self.get();

    //Public API
    self.getFormlyFields = getFormlyFields;
    self.getFormlyModel = getFormlyModel;
    self.getAttributeLabelId = getAttributeLabelId;
    return self;


    function formly_fields(o) {
      return data[o.name]
        .filter(d => {
          if (!o.exclude) return true;
          return !_.find(o.exclude, e => { return d.name === e});
        })
        .map(d => {
          let field = {
            key: d.name,
            templateOptions: {
              label: d.name, //default, will be overwritten by translation
              //see expressionProperties
            },
            expressionProperties: {},
          };
          if (my.$translate) {
            field.expressionProperties['templateOptions.label'] =
              function($viewValue, $modelValue, scope) {
                return my.$translate(o.name + '_' + d.name);
              }
          }
          if (typeof d.type === 'object') { //select object
            field.type = 'select';
            field.templateOptions.options = d.type;
            field.templateOptions.valueProp = 'id';
            field.templateOptions.labelProp = 'label';
            // field.templateOptions.options.map(selection => {
            //   selection.label = selection.name; //default overwritten by $translate
            // });
            if (my.$translate) {
              field.templateOptions.options.map((selection, index) => {
                field.expressionProperties['templateOptions.options[' + index + '].label'] =
                  function($viewValue, $modelValue, scope) {
                    return my.$translate(o.name + '_' + d.name + '_' + selection.name);
                  }
              });
            }
          } else if (d.type === 'date') {
            field.type = 'datepicker';
          }
          if (d.required)
            field.templateOptions.required = true;
          if (d.readonly)
            field.templateOptions.disabled = true;
          return field;
        })
      ;
    }

    function formly_fields_layout(o) {
      let ffs = formly_fields(o);
      let index = {};
      ffs.map(ff => {
        index[ff.key] = {field: ff, seen: 0};
      });
      let group = 0;
      let input = 0;

      function special_extend(field, ...args) {
        //we want className be appended
        let className = [field, ...args]
            .filter(arg => { return arg.className})
            .map(arg => { return arg.className;})
          .join(' ');
        //we want templateOptions to extend, not override
        let templateOptions = _.extend(...[field, ...args]
                                       .filter(arg => { return arg.templateOptions})
                                       .map(arg => { return arg.templateOptions;}));
        let special = {};
        if (className) special.className = className;
        if (templateOptions) special.templateOptions = templateOptions;
        _.extend(field, ...args, special);
        // console.debug('extend:', field);
        return field;
      }

      function enrich(ff) {
        let field = {};
        if (ff.key) {
          field.className = 'rtbf-formly-' + o.name + '-' + ff.key + '-' + input++;
          if (!index[ff.key]) {
            throw 'Checkout your layout: key \'' + ff.key + '\' does not exists.';
          }
          index[ff.key].seen++;
          let f = index[ff.key].field;
          special_extend(field, f, ff);
          field.type = field.type || 'input'; //default Material 'input'-type
        } else if (ff.fieldGroup) {
          field.className = 'rtbf-formly-' + o.name + '-group-' + group++;
          special_extend(field, ff);
          field.fieldGroup = ff.fieldGroup.map(f => { return enrich(f); });
        }
        return field;
      }

      let ffs_with_layout = o.layout.map(ff => {
        return enrich(ff);
      });

      ffs.map(ff => { //Put none-layed-out-fields at the end
        if (!index[ff.key].seen) ffs_with_layout.push(enrich(ff));
      });

      return ffs_with_layout;
    };

    function get_formly_model(o) {
      let ffs = formly_fields(o);
      let model = {}; //copy of the model
      ffs.map(ff => {
        let value = o.model[ff.key] || null;
        if (ff.type === 'datepicker' &&
            typeof value === 'string') { //datepickers need real dates no strings
            if (value) {
              value = new Date(value); //FIXME: expect ending with Z for UTC time
              // console.debug('converted date to: ', value);
            }
        } else {
          value = angular.copy(value);
        }
        model[ff.key] = value;
      });
      return model;
    }

    function getFormlyFields(o) {
      return formly_fields_layout({
        exclude: o.exclude,
        name: o.name,
        layout: o.layout
      });
    };

    //getFormlyModel: Massage the values of the model, but the keys stay as is,
    //  except the excluded one's will not appear.
    function getFormlyModel(o) {
      return get_formly_model({
        exclude: o.exclude,
        name: o.name,
        model: o.model
      });
    };

    //e.g. {name: 'concours', attr: 'id'}
    function getAttributeLabelId(o) {
      return o.name + '_' + o.attr;
    }

  }

})();
