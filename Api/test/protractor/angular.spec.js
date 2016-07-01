
//Test Angular homepage
describe('angularjs homepage todo list', function () {
  it('should add a todo', function () {

    browser.get('https://angularjs.org');

    element(by.model('todoList.todoText')).sendKeys('write first protractor test');
    element(by.css('[value="add"]')).click();

    var todoList = element.all(by.repeater('todo in todoList.todos'));
    expect(todoList.count()).toEqual(3);
    expect(todoList.get(2).getText()).toEqual('write first protractor test');

    // You wrote your first test, cross it off the list
    todoList.get(2).element(by.css('input')).click();
    var completedAmount = element.all(by.css('.done-true'));
    expect(completedAmount.count()).toEqual(2);
  });
});


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