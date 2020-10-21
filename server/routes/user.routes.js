'use strict';

const { jwtAuth } = require('../middlewares');
const userController = require('../controllers/user.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  // get all users
  app.get('/api/users', [jwtAuth.verifyToken], userController.getAll);

  // get by id
  app.get('/api/user/:id', [jwtAuth.verifyToken], userController.getById);

  // update by id (only admin can update)
  app.put(
    '/api/user/:id',
    [jwtAuth.verifyToken, jwtAuth.isAdmin],
    userController.updateById
  );

  // delete by id (only admin can delete)
  app.delete(
    '/api/user/:id',
    [jwtAuth.verifyToken, jwtAuth.isAdmin],
    userController.deleteById
  );

  // create new (only admin can create)
  app.post(
    '/api/user',
    [jwtAuth.verifyToken, jwtAuth.isAdmin, jwtAuth.isEmailUsable],
    userController.create
  );
};
