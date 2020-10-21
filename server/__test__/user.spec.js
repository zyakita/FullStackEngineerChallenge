const supertest = require('supertest');
const app = require('../api');

var adminJWT = '';
var userJWT = '';

describe('Testing the user API', () => {
  it('get the base route, return status code 200', function (done) {
    supertest(app).get('/').expect(200, done);
  });

  it('login with wrong password, return status code 401', function (done) {
    supertest(app)
      .post('/api/auth/signin')
      .send({ email: 'admin@example.com', password: '123456789' })
      .expect(401, done);
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

  it('login with normal user, return status code 200', function (done) {
    supertest(app)
      .post('/api/auth/signin')
      .send({ email: 'user2@example.com', password: '123456' })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body).toHaveProperty('accessToken');
        if (res.body.accessToken) userJWT = res.body.accessToken;
        done();
      });
  });

  it('get all users with admin JWT, return status code 200', function (done) {
    supertest(app)
      .get('/api/users')
      .set({ 'x-access-token': adminJWT })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body).toHaveProperty('users');
        done();
      });
  });

  it('get all users with normal JWT, return status code 200', function (done) {
    supertest(app)
      .get('/api/users')
      .set({ 'x-access-token': userJWT })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body).toHaveProperty('users');
        done();
      });
  });

  it('get single user with admin JWT, return status code 200', function (done) {
    supertest(app)
      .get('/api/user/2')
      .set({ 'x-access-token': adminJWT })
      .expect(200, done);
  });

  it('get single user with normal JWT, return status code 200', function (done) {
    supertest(app)
      .get('/api/user/2')
      .set({ 'x-access-token': userJWT })
      .expect(200, done);
  });

  const updateUser = {
    name: 'Example Updated User',
    email: 'updated.email@example.com',
    password: '123123123',
  };

  it('update single user with normal JWT, return status code 403', function (done) {
    supertest(app)
      .put('/api/user/10')
      .set({ 'x-access-token': userJWT })
      .send(updateUser)
      .expect(403, done);
  });

  it('update single user with admin JWT, return status code 200', function (done) {
    supertest(app)
      .put('/api/user/10')
      .set({ 'x-access-token': adminJWT })
      .send(updateUser)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body.name).toBe(updateUser.name);
        expect(res.body.email).toBe(updateUser.email);
        done();
      });
  });

  it('login with recently updated user, return status code 200', function (done) {
    supertest(app)
      .post('/api/auth/signin')
      .send({ email: updateUser.email, password: updateUser.password })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body).toHaveProperty('accessToken');
        done();
      });
  });

  it('delete single user with normal JWT, return status code 403', function (done) {
    supertest(app)
      .delete('/api/user/10')
      .set({ 'x-access-token': userJWT })
      .expect(403, done);
  });

  it('delete single user with admin JWT, return status code 200', function (done) {
    supertest(app)
      .delete('/api/user/10')
      .set({ 'x-access-token': adminJWT })
      .expect(200, done);
  });

  it('get deleted user, return status code 404', function (done) {
    supertest(app)
      .get('/api/user/10')
      .set({ 'x-access-token': adminJWT })
      .expect(404, done);
  });

  const newUser = {
    name: 'test new user',
    email: 'new.email@example.com',
    password: '123123123',
  };

  it('create user with normal JWT, return status code 403', function (done) {
    supertest(app)
      .post('/api/user')
      .set({ 'x-access-token': userJWT })
      .send(newUser)
      .expect(403, done);
  });

  it('create user with admin JWT, return status code 200', function (done) {
    supertest(app)
      .post('/api/user')
      .set({ 'x-access-token': adminJWT })
      .send(newUser)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body.name).toBe(newUser.name);
        expect(res.body.email).toBe(newUser.email);
        done();
      });
  });
});
