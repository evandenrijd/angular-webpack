import angular from 'angular';
import _ from 'underscore';
import {dump_obj} from '../utils';

(function(){

  let metaConstructor = function(spec, my) {
    let self = spec || {};

    let data = {
      concours: [
        { name: "id", type: "number", oracle: 'PK_CCR', init: function() { return null; } },
        { name: "code", type: "string", required: true, oracle: "CODE_CCR", init: function() { return null; } },
        { name: "title", type: "string", required: true, oracle: "INTITULE_CCR", init: function() { return null; } },
        { name: "description", type: "string", required: true, oracle: "DESCRIPTION_CCR", init: function() { return null; } },
        { name: "image", type: "blob", oracle: "IMAGE_CCR", init: function() { return null; } },
        { name: "startDate", type: "date", oracle: "DATE_DEBUT_CCR", init: function() { return null; } },
        { name: "endDate", type: "date", required: true, oracle: "DATE_FIN_CCR", init: function() { return null; } },
        { name: "winners", type: "number", required: true, oracle: "NOMBRE_CCR", init: function() { return 0; } },
        { name: "question", type: "string", oracle: "QUESTION_CCR", init: function() { return null; } },
        { name: "answer", type: "string", oracle: "REPONSE_CCR", init: function() { return null; } },
        { name: "status", type: "enum", oracle: "STATUT_CCR", init: function() { return null; } },
        { name: "link", type: "string", oracle: "LIEN_CCR", init: function() { return null; } },
        { name: "admins", type: "string", oracle: "GESTIONNAIRE_CCR", init: function() { return null; } },
        { name: "comments", type: "string", oracle: "COMMENTAIRE_CCR", init: function() { return null; } },
        { name: "finalWinners", type: "number", oracle: "GAGNANT_CCR", init: function() { return 0; } },
        { name: "finalLosers", type: "number", oracle: "PERDANT_CCR", init: function() { return 0; } },
        { name: "drawingDate", type: "date", required: true, oracle: "TIRAGE_DATE_CCR", init: function() { return null; } },
        { name: "drawingAdmin", type: "string", oracle: "TIREUR_CCR", init: function() { return null; } },
        { name: "exclusionRule", type: "string", oracle: "EXCLUSION_CCR", init: function() { return null; } },
        { name: "creationDate", type: "date", readonly: true, oracle: "CREATION_CCR", init: function() { return new Date(); } },
        { name: "creationAdmin", type: "string", readonly: true, oracle: "CREATEUR_CCR", init: function() { return null; } },
        { name: "imageName", type: "string", oracle: "IMAGE_NOM_CCR", init: function() { return null; } },
        { name: "imageMime", type: "string", oracle: "IMAGE_TYPE_CCR", init: function() { return null; } }
      ]
    };

    let formly_fields = function(o) {
      return data[o.name]
        .filter(d => { return d.name !== 'id'
                       && d.name !== 'image'
                       && d.name !== 'imageName'
                       && d.name !== 'imageMime'
                       ;
                     })
        .map(d => {
          let field = {
            key: d.name,
            templateOptions: {
              label: d.name, //default, will be overwritten by translation
              //see expressionProperties
            },
          };
          if (my.$translate) {
            field.expressionProperties = {
              'templateOptions.label': function($viewValue, $modelValue, scope) {
                return my.$translate('concours_' + d.name);
              }
            }
          }
          if (d.type === 'date')
            field.type = 'datepicker';
          if (d.required)
            field.templateOptions.required = true;
          if (d.readonly)
            field.templateOptions.disabled = true;
          return field;
        })
      ;
    }

    let formly_fields_layout = function(o) {
      let ffs = formly_fields(o);
      let index = {};
      ffs.map(ff => {
        index[ff.key] = {field: ff, seen: 0};
      });
      let group = 0;
      let input = 0;

      let special_extend = function (field, ...args) {
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
        return field;
      }

      let enrich = function(ff) {
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

    let get_formly_model = function(o) {
      let ffs = formly_fields(o);
      let model = {}; //copy of the model
      ffs.map(ff => {
        let value = o.model[ff.key] || null;
        if (ff.type === 'datepicker' &&
            typeof value === 'string') { //datepickers need real dates no strings
            if (value) {
              value = new Date(value); //FIXME: expect ending with Z for UTC time
              console.debug('converted date to: ', value);
            }
        }
        model[ff.key] = value;
      });
      return model;
    }

    //public API
    self.getFormlyFields = function (o) {
      return formly_fields_layout({name: o.name,
                                   layout: o.layout});
    };
    self.getFormlyModel = function (o) {
      return get_formly_model({name: o.name,
                               model: o.model});
    };

    return self;
  }

  angular.module('gecopa.models.meta', [])
    .provider('meta', function metaProvider() {
      this.$get = function metaConstructorFactory($translate) {
        return metaConstructor({}, {$translate});
      }
    });

})();
