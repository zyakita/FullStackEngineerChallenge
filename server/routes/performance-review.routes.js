'use strict';

const { jwtAuth } = require('../middlewares');
const prController = require('../controllers/performance-review.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  // get all prs (only admin can view)
  app.get(
    '/api/performance-reviews',
    [jwtAuth.verifyToken, jwtAuth.isAdmin],
    prController.getAll
  );

  // get all my prs
  app.get(
    '/api/performance-reviews/me',
    [jwtAuth.verifyToken],
    prController.getMy
  );

  // get all my feedback requests
  app.get(
    '/api/performance-reviews/requests-me',
    [jwtAuth.verifyToken],
    prController.getMyFeedbackRequests
  );

  // feedback detail
  app.get(
    '/api/performance-reviews/feedback/:fbId',
    [jwtAuth.verifyToken],
    prController.getMyFeedbackDetail
  );

  // get pr by id
  // TODO: permission
  // only owner/admin/people whoes going to provide feedback can request
  app.get(
    '/api/performance-review/:id',
    [jwtAuth.verifyToken],
    prController.getById
  );

  // get by userId
  app.get(
    '/api/performance-reviews/user/:userId',
    [jwtAuth.verifyToken, jwtAuth.isAdmin],
    prController.getByUserId
  );

  // update by id (only admin can update)
  app.put(
    '/api/performance-review/:id',
    [jwtAuth.verifyToken, jwtAuth.isAdmin],
    prController.updateById
  );

  // delete by id (only admin can delete)
  app.delete(
    '/api/performance-review/:id',
    [jwtAuth.verifyToken, jwtAuth.isAdmin],
    prController.deleteById
  );

  // create new (only admin can create)
  app.post(
    '/api/performance-review',
    [jwtAuth.verifyToken, jwtAuth.isAdmin],
    prController.create
  );

  // get all feedbacks
  app.get(
    '/api/performance-review/:prId/feedbacks',
    [jwtAuth.verifyToken],
    prController.getFeedbacks
  );

  // request user feedback
  app.post(
    '/api/performance-review/:prId/feedback',
    [jwtAuth.verifyToken, jwtAuth.isAdmin],
    prController.requestFeedback
  );

  // submit new feedback
  app.put(
    '/api/performance-review/:prId/feedback/:fbId',
    [jwtAuth.verifyToken],
    prController.submitFeedback
  );
};
