import angular from 'angular';
import _ from 'underscore';
import {dump_obj} from '../../utils';
import '../meta.module';

(function(){

  let concoursConstructor = function(spec, my) {
    let self = {};
    let data = spec;
    my = my || {};
    let formly_fields;
    let formly_model; //copy of the data used in formly

    let getFormlyField = function(key) {
      let result = undefined;
      let search = function(field, key) {
        _.each(field, f => {
          if (!result) {
            if (!!f.fieldGroup) {
              search(f.fieldGroup, key);
            } else if (!!f.key) {
              if (f.key === key) {
                result = f;
              }
            }
          }
        });
        return result;
      };
      return search(formly_fields, key);
    }

    let layoutEdit = [

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
                expression: function($viewValue, $modelValue, scope) {
                  let value = $modelValue || $viewValue;
                  if (value) {
                    value = value.setHours(0,0,0,0); //only compare date not time
                    if (!scope.to.data) scope.to.data = {};
                    scope.to.data.lhs = scope.to.label;
                    let endDate;
                    if (scope.model.drawingDate) {
                      endDate = scope.model.drawingDate.setHours(0,0,0,0);
                      scope.to.data.rhs = getFormlyField('drawingDate').templateOptions.label;
                    } else if (scope.model.endDate) {
                      if (!endDate || (endDate && scope.model.endDate.setHours(0,0,0,0) < endDate)) {
                        endDate = scope.model.endDate.setHours(0,0,0,0);
                        scope.to.data.rhs = getFormlyField('endDate').templateOptions.label;
                      }
                    } else {
                      return true; //No end date filled in
                    }
                    return value < endDate;
                  }
                  return true;
                },
                message: function($viewValue, $modelValue, scope) {
                  return my.$translate.instant("ERR_LHS_LESS_THEN_RHS", scope.to.data);
                }
              }
            },
          },
          { className: 'flex',
            key: 'endDate',
            validators: {
              checkDrawingDate: {
                expression: function(viewValue, modelValue, scope) {
                  let value = modelValue || viewValue;
                  if (value && scope.model.drawingDate) {
                    value = value.setHours(0,0,0,0); //only compare date not time
                    if (!scope.to.data) scope.to.data = {};
                    scope.to.data.lhs = scope.to.label;
                    scope.to.data.rhs = getFormlyField('drawingDate').templateOptions.label;
                    return value <= scope.model.drawingDate.setHours(0,0,0,0);
                  }
                  return true;
                },
                message: function($viewValue, $modelValue, scope) {
                  return my.$translate.instant("ERR_LHS_LESS_THEN_OR_EQUAL_TO_RHS", scope.to.data);
                }
              }
            }
          },
          { className: 'flex',
            key: 'drawingDate',
            validators: {
              checkDrawingDate: {
                expression: function(viewValue, modelValue, scope) {
                  let value = modelValue || viewValue;
                  if (value && scope.model.endDate) {
                    value = value.setHours(0,0,0,0); //only compare date not time
                    if (!scope.to.data) scope.to.data = {};
                    scope.to.data.lhs = scope.to.label;
                    scope.to.data.rhs = getFormlyField('endDate').templateOptions.label;
                    return value >= scope.model.endDate.setHours(0,0,0,0);
                  }
                  return true;
                },
                message: function($viewValue, $modelValue, scope) {
                  return my.$translate.instant("ERR_LHS_GREATER_THEN_OR_EQUAL_TO_RHS", scope.to.data);
                }
              }
            },
          },
        ]
      },

      {
        className: 'layout-row',
        fieldGroup: [
          { className: 'flex', key: 'mailWinners' },
        ]
      },

      {
        className: 'layout-row',
        fieldGroup: [
          { className: 'flex', key: 'mailLosers' },
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
          { className: 'flex-33', key: 'status' },
          { className: 'flex-20', key: 'creationDate',
            templateOptions: {
              disabled: true,
            },
          },
        ]
      },

    ];

    let toString = function() {
      return dump_obj(data);
    }

    let get = function (attr) {
      return data && data[attr];
    }

    let getFormlyFields = function(o) {
      if (!formly_fields) {
        formly_fields = my.meta.getFormlyFields(_.extend({
          name: 'concours',
          layout: layoutEdit
        }, o));
      }
      return formly_fields;
    }

    let getFormlyModel = function(o) {
      formly_model = my.meta.getFormlyModel(_.extend({
        name: 'concours',
        model: data
      }, o));
      return formly_model;
    }

    let setFormlyModel = function() {
      //FIXME: TODO dates are not set back
      data = formly_model;
      return self;
    }

    let getCachedImage = function () {
      return 'images/GECOPA.CONCOURS_CCR_T.IMAGE_CCR.' + get('id');
    }

    let getImageObject = function () {
      let image = {
        asURL: data && data.image,
        filename: data && data.imageName,
        mime: data && data.imageMime
      }
      return image;
    }

    let setImageObject = function (image) {
      if (data.image !== image.asURL) {
        data.image = image.asURL;
      }
      if (data.imageMime !== image.mime) {
        data.imageMime = image.mime;
      }
      if (data.imageName !== image.filename) {
        data.imageName = image.filename;
      }
      return data.image;
    }

    self.getFormlyModel = getFormlyModel;
    self.setFormlyModel = setFormlyModel;
    self.getFormlyFields = getFormlyFields;
    self.toString = toString;
    self.getImageObject = getImageObject;
    self.setImageObject = setImageObject;
    self.getCachedImage = getCachedImage;

    self.get = get;

    return self;
  };

  let concoursListConstructor = function(spec, my) {
    let self = spec || {};
    my = my || {};
    let URLS = {
      FETCH: 'data/concours.json'
    };
    let concours;

    function extract(result) {
      // console.debug('result: ', result);
      return result.data.map(spec => {
        return concoursConstructor(spec, my);
      });
    }

    function cacheConcours(result) {
      concours = extract(result);
      // console.debug('concours: ', concours);
      return concours;
    }

    function findConcours(concoursId) {
      return _.find(concours, function (aConcours) {
        return aConcours.get('id') === parseInt(concoursId, 10);
      })
    }

    //public API
    self.loadAllConcours = function () {
      return (concours) ? my.$q.when(concours) :
        my.$http.get(URLS.FETCH).then(result => {
          return cacheConcours(result);
        });
    };

    self.getConcoursById = function (concoursId) {
      var deferred = my.$q.defer();
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
      //FIXME Normal create REST call
    };

    self.updateConcours = function (aConcours) {
      let image = aConcours.getImageObject();
      if (image.asURL.match(/^data:/)) {
        //FIXME push data into the database + copy a file into the images-directory.
        //  => should be a SPECIAL REST call that does that.
        image.asURL = aConcours.getCachedImage();
        aConcours.setImageObject(image); //take the image from the cache if successful.
      } else {
        //FIXME Normal update REST call
      }
      var index = _.findIndex(concours, function (b) {
        return b.get('id') === aConcours.get('id');
      });
      concours[index] = aConcours;
    };

    self.deleteConcours = function (aConcours) {
      //FIXME Normal delete REST call
      _.remove(concours, function (b) {
        return b.get('id') === aConcours.get('id');
      });
    };

    return self;
  }

  angular.module('gecopa.models.concours', [
    'gecopa.common.appState', //Use for translation
    'gecopa.models.meta'
  ])
    .provider('concoursList', function concoursListProvider() {
      this.$get = function concoursListConstructorFactory($http, $q, $translate, meta) {
        return concoursListConstructor({}, {$http, $q, $translate, meta});
      }
    });

})();
