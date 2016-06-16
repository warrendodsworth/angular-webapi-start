
describe('angularjs homepage', function () {
  it('should greet the named user', function () {
    angularHomepage.get();
    angularHomepage.setName('Julie is going to school today.');

    expect(angularHomepage.result.getText()).toEqual('Julie is going to school today.');
  });
});