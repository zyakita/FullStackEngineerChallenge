const supertest = require('supertest');
const app = require('../api');
const {
  PB_STATUS_NEW,
  PB_STATUS_SUBMITTED,
} = require('../constants/pb.status.constant');

var adminJWT = '';
var userJWT = '';
var prId = '';

describe('Testing the Performance review API', () => {
  it('get the base route, return status code 200', function (done) {
    supertest(app).get('/').expect(200, done);
  });

  it('login with admin user, return status code 200', function (done) {
    supertest(app)
      .post('/api/auth/signin')
      .send({ email: 'admin@example.com', password: '123456' })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body).toHaveProperty('accessToken');
        if (res.body.accessToken) adminJWT = res.body.accessToken;
        done();
      });
  });

  it('get all prs with admin JWT, return status code 200', function (done) {
    supertest(app)
      .get('/api/performance-reviews')
      .set({ 'x-access-token': adminJWT })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body).toHaveProperty('prs');
        done();
      });
  });

  it('get pr with admin JWT, return status code 200', function (done) {
    supertest(app)
      .get('/api/performance-review/1')
      .set({ 'x-access-token': adminJWT })
      .expect(200, done);
  });

  const updatePr = {
    title: 'Example Updated Title',
    description: 'updated.content',
  };

  it('update pr with admin JWT, return status code 200', function (done) {
    supertest(app)
      .put('/api/performance-review/1')
      .set({ 'x-access-token': adminJWT })
      .send(updatePr)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body.title).toBe(updatePr.title);
        expect(res.body.description).toBe(updatePr.description);
        done();
      });
  });

  it('delete pr with admin JWT, return status code 200', function (done) {
    supertest(app)
      .delete('/api/performance-review/10')
      .set({ 'x-access-token': adminJWT })
      .expect(200, done);
  });

  const newPr = {
    title: 'Example New Title',
    description: 'new.content',
    userId: 2,
  };

  it('create pr with admin JWT, return status code 200', function (done) {
    supertest(app)
      .post('/api/performance-review')
      .set({ 'x-access-token': adminJWT })
      .send(newPr)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body.title).toBe(newPr.title);
        expect(res.body.description).toBe(newPr.description);

        prId = res.body.id;
        done();
      });
  });

  it('login with normal user, return status code 200', function (done) {
    supertest(app)
      .post('/api/auth/signin')
      .send({ email: 'user3@example.com', password: '123456' })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body).toHaveProperty('accessToken');
        if (res.body.accessToken) userJWT = res.body.accessToken;
        done();
      });
  });

  it('get all user2 prs with normal JWT, return status code 200', function (done) {
    supertest(app)
      .get('/api/performance-reviews/me')
      .set({ 'x-access-token': userJWT })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body).toHaveProperty('prs');
        done();
      });
  });

  var feedbackId = '';
  it('request feedback for performance review, return status code 200', function (done) {
    supertest(app)
      .post(`/api/performance-review/${prId}/feedback`)
      .set({ 'x-access-token': adminJWT })
      .send({ userId: 3 })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body.userId).toBe(3);
        expect(res.body.status).toBe(PB_STATUS_NEW);
        feedbackId = res.body.id;
        done();
      });
  });

  it('submit feedback for performance review, return status code 200', function (done) {
    supertest(app)
      .put(`/api/performance-review/${prId}/feedback/${feedbackId}`)
      .set({ 'x-access-token': userJWT })
      .send({ content: 'ok' })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body.content).toBe('ok');
        expect(res.body.status).toBe(PB_STATUS_SUBMITTED);
        done();
      });
  });
});
