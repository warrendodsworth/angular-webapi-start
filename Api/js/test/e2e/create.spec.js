// Here we are using the Jasmine test framework 
// See http://jasmine.github.io/2.0/introduction.html for more details
// It is a good idea to use page objects to modularize your testing logic

var angularHomepage = {
  nameInput: element(by.model('model.name')),
  result: element(by.binding('model.name')),
  get: function () {
    browser.get('#/create');
  },
  setName: function (name) {
    this.nameInput.sendKeys(name);
  }
};

describe('angularjs homepage', function () {
  it('should greet the named user', function () {
    angularHomepage.get();
    angularHomepage.setName('Julie is going to school today.');

    expect(angularHomepage.result.getText()).toEqual('Julie is going to school today.');
  });
});