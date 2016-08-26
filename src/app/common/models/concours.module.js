import angular from 'angular';
import _ from 'underscore';
import {dump_obj} from '../../utils';

(function(){

  let concoursConstructor = function(spec, my) {
    let self = {};
    let data = spec;
    my = my || {};

    let metaConstructor = function(spec, my) {
      let self = spec || {};
      my = my || {};

      let data = [
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
        { name: "finalWinners", type: "string", oracle: "GAGNANT_CCR", init: function() { return ''; } },
        { name: "finalLosers", type: "string", oracle: "PERDANT_CCR", init: function() { return ''; } },
        { name: "drawingDate", type: "date", required: true, oracle: "TIRAGE_DATE_CCR", init: function() { return null; } },
        { name: "drawingAdmin", type: "string", oracle: "TIREUR_CCR", init: function() { return null; } },
        { name: "exclusionRule", type: "string", oracle: "EXCLUSION_CCR", init: function() { return null; } },
        { name: "creationDate", type: "date", readonly: true, oracle: "CREATION_CCR", init: function() { return new Date(); } },
        { name: "creationAdmin", type: "string", readonly: true, oracle: "CREATEUR_CCR", init: function() { return null; } },
        { name: "imageName", type: "string", oracle: "IMAGE_NOM_CCR", init: function() { return null; } },
        { name: "imageMime", type: "string", oracle: "IMAGE_TYPE_CCR", init: function() { return null; } }
      ];

      let formly_fields = function() {
        return data
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

      let layoutEdit = {
        name: 'concours',
        layout: [
          {
            className: 'layout-row',
            fieldGroup: [
              { className: 'flex-33', key: 'code' },
              { className: 'flex', key: 'title' }
            ]
          },

          {
            className: 'layout-row',
            fieldGroup: [
              { className: 'flex', key: 'description',
                type: 'textarea',
                templateOptions: {
                  grow: false,
                  rows: 3
                },
              }
            ]
          },

          {
            className: 'layout-row',
            fieldGroup: [
              { className: 'flex', key: 'comments',
                type: 'textarea',
                templateOptions: {
                  grow: false,
                  rows: 2
                },
              }
            ]
          },

          {
            className: 'layout-row',
            fieldGroup: [
              { className: 'flex', key: 'question' },
              { className: 'flex', key: 'answer' },
            ]
          },

          {
            className: 'layout-row',
            fieldGroup: [
              { className: 'flex-20', key: 'winners' },
              { className: 'flex',
                key: 'startDate',
                validators: {
                  checkEndDate: {
                    expression: function(viewValue, modelValue, scope) {
                      let value = modelValue || viewValue;
                      if (value) value = value.setHours(0,0,0,0); //only compare date not time
                      if (value) {
                        let drawingDate = scope.model.drawingDate.setHours(0,0,0,0);
                        let endDate = scope.model.endDate.setHours(0,0,0,0);
                        if (endDate && drawingDate) endDate = endDate < drawingDate?drawingDate:endDate;
                        return value < endDate;
                      }
                      return true;
                    },
                    message: '"Should be less then end and/or drawing date."'
                  }
                }
              },
              { className: 'flex',
                key: 'endDate',
                validators: {
                  checkDrawingDate: {
                    expression: function(viewValue, modelValue, scope) {
                      let value = modelValue || viewValue;
                      if (value) value = value.setHours(0,0,0,0); //only compare date not time
                      if (scope.model.drawingDate) {
                        return value <= scope.model.drawingDate.setHours(0,0,0,0);
                      }
                      return true;
                    },
                    message: '"Should be less then or equal to drawing date."'
                  }
                }
              },
              { className: 'flex',
                key: 'drawingDate',
                validators: {
                  checkDrawingDate: {
                    expression: function(viewValue, modelValue, scope) {
                      let value = modelValue || viewValue;
                      if (value) value = value.setHours(0,0,0,0); //only compare date not time
                      if (scope.model.endDate) {
                        return value >= scope.model.endDate.setHours(0,0,0,0);
                      }
                      return true;
                    },
                    message: '"Should be bigger then or equal to end date."'
                  }
                },
              },
            ]
          },

          {
            className: 'layout-row',
            fieldGroup: [
              { className: 'flex-20', key: 'finalWinners' },
              { className: 'flex-20', key: 'finalLosers' },
              { className: 'flex-20', key: 'status' },
            ]
          },

          {
            className: 'layout-row',
            fieldGroup: [
              { className: 'flex', key: 'admins' },
              { className: 'flex', key: 'drawingAdmin' },
              { className: 'flex', key: 'creationAdmin' },
            ]
          },

          {
            className: 'layout-row',
            fieldGroup: [
              { className: 'flex-33', key: 'exclusionRule' },
              { className: 'flex', key: 'link' },
            ]
          },

          {
            className: 'layout-row layout-align-end-center',
            fieldGroup: [
              { className: 'flex-20', key: 'creationDate',
                templateOptions: {
                  disabled: true,
                },
              },
            ]
          },

        ]
      };

      let formly_fields_layout = function(o) {
        o.name = o.name || '';
        let ffs = formly_fields();
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

        ffs.map(ff => { //Put none grouped fields at the end
          if (!index[ff.key].seen) ffs_with_layout.push(enrich(ff));
        });

        return ffs_with_layout;
      };

      self.getFormlyFieldsWithoutLayout = function () { return formly_fields(); };
      self.getFormlyFieldsLayout = function () { return formly_fields_layout(layoutEdit); };

      return self;
    }


    let getTitle = function() {
      return data && data.title;
    }

    let getEndDate = function() {
      return data && data.endDate;
    }

    let getId = function() {
      return data && data.id;
    }

    let getImage = function() {
      return data && data.image;
    }

    let toString = function() {
      return dump_obj(data);
    }

    let getState = function() {
      return data;
    }

    let setState = function(state) {
      data = state;
    }

    let getFormlyFields = function() {
      return metaConstructor({}, my).getFormlyFieldsLayout();
    }

    let getFormlyModel = function() {
      let model = {}; //copy of the data
      metaConstructor({}, my).getFormlyFieldsWithoutLayout().map(f => {
        let value = data[f.key] || null;
        if (f.type === 'datepicker' &&
            typeof value === 'string') { //datepickers need real dates no strings
            if (value) {
              value = new Date(value); //FIXME: expect ending with Z for UTC time
              console.debug('converted date to: ', value);
            }
        }
        model[f.key] = value;
      });
      return model;
    }

    let setFormlyModel = function(model) {
      //FIXME: TODO
      data = model;
      return self;
    }

    self.getFormlyModel = getFormlyModel;
    self.getFormlyFields = getFormlyFields;
    self.getTitle = getTitle;
    self.getId = getId;
    self.getImage = getImage;
    self.getEndDate = getEndDate;
    self.toString = toString;
    self.getState = getState;
    self.setState = setState;

    return self;
  };

  let concoursListConstructor = function($http, $q, $translate) {
    let self = {};
    let my = {};
    let URLS = {
      FETCH: 'data/concours.json'
    };
    let concours;

    function extract(result) {
      console.debug('result: ', result);
      return result.data.map(spec => {
        return concoursConstructor(spec, {$translate});
      });
    }

    function cacheConcours(result) {
      concours = extract(result);
      console.debug('concours: ', concours);
      return concours;
    }

    function findConcours(concoursId) {
      return _.find(concours, function (aConcours) {
        return aConcours.getId() === parseInt(concoursId, 10);
      })
    }

    self.loadAllConcours = function () {
      return (concours) ? $q.when(concours) :
        $http.get(URLS.FETCH).then(result => {
          return cacheConcours(result);
        });
    };

    self.getConcoursById = function (concoursId) {
      var deferred = $q.defer();
      if (concours) {
        deferred.resolve(findConcours(concoursId))
      } else {
        self.loadAllConcours().then(function () {
          deferred.resolve(findConcours(concoursId))
        })
      }
      return deferred.promise;
    };

    self.createConcours = function (aConcours) {
      aConcours.setId(concours.length);
      concours.push(aConcours);
    };

    self.updateConcours = function (aConcours) {
      var index = _.findIndex(concours, function (b) {
        return b.getId() === aConcours.getId();
      });
      concours[index] = aConcours;
    };

    self.deleteConcours = function (aConcours) {
      _.remove(concours, function (b) {
        return b.getId() === aConcours.getId();
      });
    };

    return self;
  }

  angular.module('gecopa.models.concours', [
    'gecopa.common.appState' //Use for translation
  ])
    .provider('concoursList', function concoursListProvider() {
      this.$get = function concoursListConstructorFactory($http, $q, $translate) {
        return concoursListConstructor($http, $q, $translate);
      }
    });

})();
