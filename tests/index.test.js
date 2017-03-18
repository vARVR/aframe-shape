/* global assert, setup, suite, test */
require('aframe');
require('../index.js');
var entityFactory = require('./helpers').entityFactory;

suite('&lt;a-entity shape=&quot;&quot;&gt; component', function () {
  var component;
  var el;

  setup(function (done) {
    el = entityFactory();
    el.addEventListener('componentinitialized', function (evt) {
      if (evt.detail.name !== '&lt;a-entity shape=&quot;&quot;&gt;') { return; }
      component = el.components['&lt;a-entity shape=&quot;&quot;&gt;'];
      done();
    });
    el.setAttribute('&lt;a-entity shape=&quot;&quot;&gt;', {});
  });

  suite('foo property', function () {
    test('is good', function () {
      assert.equal(1, 1);
    });
  });
});
