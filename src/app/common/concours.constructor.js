import angular from 'angular';
import _ from 'underscore';
import {dump_obj} from '../utils';
import './meta.module';

export default function concoursConstructor(spec, my) {
  let self = {};
  let data = spec || my.meta.init({name: 'concours'});
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

  let layoutUsefulFields = [

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

  let set = function (attr, value) {
    data[attr] = value;
    return self;
  }

  let getImageAggregatedAttributes = function() {
    return ['image', 'imageName', 'imageMime'];
  }

  let getImageAggregate = function () {
    let image = {
      asURL: data && data.image,
      filename: data && data.imageName,
      mime: data && data.imageMime
    }
    return image;
  }

  let setImageAggregate = function (image) {
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


  let getFormlyFields = function(o) {
    if (!formly_fields) {
      //get fields from meta (directly related to db) by excluding the
      //aggregated fields
      formly_fields = my.meta.getFormlyFields(_.extend({
        name: 'concours',
        layout: layoutUsefulFields
      }, o, {
        exclude: [...o.exclude, ...getImageAggregatedAttributes()]
      }));
      //add the aggregated fields layout
      formly_fields.unshift({
        className: 'layout-column',
        key: 'imageAggregate',
        type: 'inputImageFile',  //custom formly type
        templateOptions: {
          label: 'Image file',
          required: true
        }
      });
    }
    return formly_fields;
  }

  let getFormlyModel = function(o) {
    //add the model from meta without the aggregated model
    formly_model = my.meta.getFormlyModel(_.extend({
      name: 'concours',
      model: data
    }, o, {
      exclude: [...o.exclude, ...getImageAggregatedAttributes()]
    }));
    //add the aggregated model
    formly_model.imageAggregate = getImageAggregate();
    return formly_model;
  }

  let setFormlyModel = function() {
    //FIXME: TODO dates are not set back
    data = formly_model;
    setImageAggregate(formly_model.imageAggregate);
    return self;
  }

  let getCachedImage = function () {
    return 'images/GECOPA.CONCOURS_CCR_T.IMAGE_CCR.' + get('id');
  }

  self.getFormlyModel = getFormlyModel;
  self.setFormlyModel = setFormlyModel;
  self.getFormlyFields = getFormlyFields;
  self.toString = toString;
  self.getImageAggregatedAttributes = getImageAggregatedAttributes;
  self.getImageAggregate = getImageAggregate;
  self.setImageAggregate = setImageAggregate;
  self.getCachedImage = getCachedImage;

  self.get = get;
  self.set = set;

  return self;
}
