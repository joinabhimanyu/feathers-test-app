const assert = require('assert');
const app = require('../../src/app');

describe('\'blog\' service', () => {
  it('registered the service', () => {
    const service = app.service('blog');

    assert.ok(service, 'Registered the service');
  });
});
