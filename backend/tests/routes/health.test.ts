import { expect } from 'chai';
import request from 'supertest';
import { createApp } from '../../src/app';

describe('GET /api/health', () => {
  const app = createApp();

  it('returns 200 and reports the database as disconnected when there is no connection', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ status: 'ok', database: 'disconnected' });
  });

  it('returns the 404 error shape for an unknown route', async () => {
    const res = await request(app).get('/api/does-not-exist');

    expect(res.status).to.equal(404);
    expect(res.body.error.status).to.equal(404);
  });

  it('returns 400 when the request body is broken JSON', async () => {
    const res = await request(app)
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send('{"title": ');

    expect(res.status).to.equal(400);
    expect(res.body.error.message).to.equal('Request body is not valid JSON');
  });
});
