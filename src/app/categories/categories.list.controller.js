import '../common/models/category.module';

export default function CategoriesListController($log, $state, appState, categoryList) {
  let self = {};
  let my = {$log}; //shared state (global deps);

  let categories = categoryList.getCategories();

  let getCategories = function () {
    return categories;
  }

  let selectCategory = function(category) {
    appState.set('category', category);
    $state.go(appState.get('category').getNgUiRouterState());
  }

  let getSelectedCategory = function() {
    return appState.get('category');
  }

  self.getCategories = getCategories;
  self.selectCategory = selectCategory;
  self.getSelectedCategory = getSelectedCategory;

  return self;
}
