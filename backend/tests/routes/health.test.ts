import { expect } from 'chai';
import request from 'supertest';
import { createApp } from '../../src/app';

// Returning the supertest chain lets Mocha wait for it and fail the test if it rejects
describe('GET /api/health', () => {
  const app = createApp();

  it('returns 200 and reports the database as disconnected when there is no connection', () => {
    return request(app)
      .get('/api/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).to.deep.equal({ status: 'ok', database: 'disconnected' });
      });
  });

  it('returns the 404 error shape for an unknown route', () => {
    return request(app)
      .get('/api/does-not-exist')
      .expect(404)
      .expect((res) => {
        expect(res.body.error.status).to.equal(404);
      });
  });

  it('returns 400 when the request body is broken JSON', () => {
    return request(app)
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send('{"title": ')
      .expect(400)
      .expect((res) => {
        expect(res.body.error.message).to.equal('Request body is not valid JSON');
      });
  });
});
