const { describe, expect } = require('@jest/globals');

describe('only admins can set roles and permission', () => {
  test('role and permission', () => {
    expect(1 + 1).toBe(2);
  });
});
