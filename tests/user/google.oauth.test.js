
import request from 'supertest';
import app from '../../src/app'; // assuming your Express app is exported as "app"
import { expect, describe, test } from '@jest/globals';

describe('Google OAuth2 authentication', () => {
  it('should redirect to Google login page when user clicks on "Login with Google"', async () => {
    const res = await request(app)
      .get('/api/v1/auth/google')
      .expect(302); // 302 is the HTTP status code for redirection

    expect(res.header.location).toMatch(/https:\/\/accounts\.google\.com\/o\/oauth2\/v2\/auth\?/);
    // The above line tests that the user is redirected to the Google OAuth2 login page.
    // You can customize this test based on your specific use case.
  });

  // Add more test cases here based on your specific use case.
});