describe('login.ctrl', function () {
  var $controller, LoginController;

  // Load ui.router and our components.users module which we'll create next
  beforeEach(angular.mock.module('app'));

  // Inject the $controller service to create instances of the controller (HomeController) we want to test
  beforeEach(inject(function ($rootScope, _$controller_) {
    scope = $rootScope.$new();
    $controller = _$controller_;
    LoginController = $controller('LoginController', { $scope: scope });
  }));

  // Verify our controller exists
  it('should be defined', function () {
    expect(LoginController).toBeDefined();
  });
  
  it('should title Login', function () {
    //expect(scope.$parent.title).toEqual('Login');
  });
});