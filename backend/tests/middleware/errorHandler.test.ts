import { expect } from 'chai';
import { NextFunction, Request, Response } from 'express';
import sinon from 'sinon';
import { errorHandler, notFound } from '../../src/middleware/errorHandler';
import { AppError } from '../../src/utils/AppError';
import { logger } from '../../src/utils/logger';

function fakeResponse() {
  const res = {
    status: sinon.stub(),
    json: sinon.stub(),
  };
  res.status.returns(res);
  return res;
}

describe('errorHandler middleware', () => {
  const req = { method: 'GET', originalUrl: '/api/nothing-here' } as Request;
  const next = sinon.stub() as unknown as NextFunction;

  afterEach(() => {
    sinon.restore();
  });

  it('sends the status and message of an AppError', () => {
    const res = fakeResponse();

    errorHandler(new AppError('Note not found', 404), req, res as unknown as Response, next);

    expect(res.status.calledWith(404)).to.equal(true);
    expect(res.json.firstCall.args[0]).to.deep.equal({ error: { message: 'Note not found', status: 404 } });
  });

  it('returns 400 for a body that is not valid JSON', () => {
    const res = fakeResponse();
    const parseError = { type: 'entity.parse.failed', status: 400 };

    errorHandler(parseError, req, res as unknown as Response, next);

    expect(res.status.calledWith(400)).to.equal(true);
    expect(res.json.firstCall.args[0].error.message).to.equal('Request body is not valid JSON');
  });

  it('hides the details of an unexpected error and logs it', () => {
    const res = fakeResponse();
    const logStub = sinon.stub(logger, 'error');

    errorHandler(new Error('connection string leaked here'), req, res as unknown as Response, next);

    expect(res.status.calledWith(500)).to.equal(true);
    expect(res.json.firstCall.args[0].error.message).to.not.include('connection string');
    expect(logStub.calledOnce).to.equal(true);
  });
});

describe('notFound middleware', () => {
  it('passes a 404 AppError naming the route to next', () => {
    const next = sinon.spy();
    const req = { method: 'POST', originalUrl: '/api/unknown' } as Request;

    notFound(req, {} as Response, next);

    const err = next.firstCall.args[0];
    expect(err).to.be.instanceOf(AppError);
    expect(err.status).to.equal(404);
    expect(err.message).to.equal('Route not found: POST /api/unknown');
  });
});
