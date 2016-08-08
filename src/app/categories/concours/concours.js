import './create/concours-create';
import './edit/concours-edit';

angular.module('categories.concours', [
  'categories.concours.create',
  'categories.concours.edit',
  'gecopa.models.concours',
]);
