'use strict';

const db = require('../models');
const {
  PB_STATUS_NEW,
  PB_STATUS_SUBMITTED,
} = require('../constants/pb.status.constant');

// get all performance reviews
exports.getAll = (req, res) => {
  db.PerformanceReview.findAndCountAll({
    attributes: ['id', 'title', 'createdAt', 'updatedAt'],
    where: { isDeleted: false },
    order: [['id', 'DESC']],
    limit: req.query.limit,
    offset: req.skip,
    include: [
      {
        model: db.User,
        where: { isDeleted: false },
        attributes: ['id', 'name', 'email'],
      },
    ],
  })
    .then((results) => {
      let itemCount = results.count;
      let pageCount = Math.ceil(results.count / req.query.limit);

      res.status(200).send({
        prs: results.rows,
        pageCount,
        itemCount,
      });
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      res.status(500).send({ message: err.message });
    });
};

// get my performance reviews,
// use jwt token to detect userId
exports.getMy = (req, res) => {
  db.PerformanceReview.findAll({
    attributes: ['id', 'title', 'createdAt', 'updatedAt'],
    where: { isDeleted: false, userId: req.userId },
    order: [['id', 'DESC']],
  })
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      res.status(500).send({ message: err.message });
    });
};

exports.getByUserId = (req, res) => {
  db.PerformanceReview.findAll({
    attributes: ['id', 'title', 'createdAt', 'updatedAt'],
    where: { isDeleted: false, userId: req.params.userId },
    order: [['id', 'DESC']],
  })
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      res.status(500).send({ message: err.message });
    });
};

// get // get all performance review by Id
exports.getById = (req, res) => {
  db.PerformanceReview.findOne({
    where: {
      id: req.params.id,
      isDeleted: false,
    },
    include: [
      {
        model: db.User,
        where: { isDeleted: false },
        attributes: ['id', 'name', 'email'],
      },
    ],
  })
    .then((pr) => {
      if (!pr) {
        // pr does not exist
        // return 404 not found
        return res
          .status(404)
          .send({ message: 'Performance review does not exist!' });
      }

      res.status(200).send(pr);
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      res.status(500).send({ message: err.message });
    });
};

exports.updateById = (req, res) => {
  db.PerformanceReview.findOne({
    where: {
      id: req.params.id,
      isDeleted: false,
    },
  })
    .then((pr) => {
      if (!pr) {
        // pr does not exist
        // return 404 not found
        return res
          .status(404)
          .send({ message: 'Performance review does not exist!' });
      }

      // update pr
      if (req.body.title) {
        pr.title = req.body.title;
      }
      if (req.body.description) {
        pr.description = req.body.description;
      }

      pr.save().then((updatedPR) => {
        res.status(200).send(updatedPR);
      });
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      res.status(500).send({ message: err.message });
    });
};

exports.deleteById = (req, res) => {
  db.PerformanceReview.findOne({
    where: {
      id: req.params.id,
      isDeleted: false,
    },
  })
    .then((pr) => {
      if (!pr) {
        // pr does not exist
        // return 404 not found
        return res
          .status(404)
          .send({ message: 'Performance review does not exist!' });
      }

      // set deleted flag
      pr.isDeleted = true;

      pr.save().then(() => {
        res.status(200).send({ message: 'Deleted successfully!' });
      });
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      res.status(500).send({ message: err.message });
    });
};

exports.create = (req, res) => {
  // validate params
  if (!req.body.title) {
    return res.status(400).send({ message: 'Title required!' });
  }
  if (!req.body.description) {
    return res.status(400).send({ message: 'Description required!' });
  }
  if (!req.body.userId) {
    return res.status(400).send({ message: 'userId required!' });
  }

  // create new pr and save to db
  db.PerformanceReview.create({
    title: req.body.title,
    description: req.body.description,
    userId: req.body.userId,
  })
    .then((newPR) => {
      res.status(200).send(newPR);
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      res.status(500).send({ message: err.message });
    });
};

// get My feedbacks request
exports.getMyFeedbackRequests = (req, res) => {
  db.PerformanceFeedback.findAll({
    attributes: ['id', 'status', 'createdAt'],
    where: { userId: req.userId, isDeleted: false },
    order: [['id', 'DESC']],
    include: [
      {
        model: db.PerformanceReview,
        attributes: ['id', 'title'],
        include: [
          {
            model: db.User,
            attributes: ['id', 'name', 'email', 'isDeleted'],
          },
        ],
      },
    ],
  })
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      res.status(500).send({ message: err.message });
    });
};

// get My feedbacks deatil
exports.getMyFeedbackDetail = (req, res) => {
  db.PerformanceFeedback.findOne({
    attributes: ['id', 'content', 'status', 'createdAt'],
    where: { userId: req.userId, id: req.params.fbId, isDeleted: false },
    include: [
      {
        model: db.PerformanceReview,
        attributes: ['id', 'title', 'description'],
        include: [
          {
            model: db.User,
            attributes: ['id', 'name', 'email', 'isDeleted'],
          },
        ],
      },
    ],
  })
    .then((results) => {
      if (!results) {
        return res.status(404).send({ message: 'Feedback do not exist!' });
      }
      return res.status(200).send(results);
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      return res.status(500).send({ message: err.message });
    });
};

// get all feedbacks
exports.getFeedbacks = (req, res) => {
  db.PerformanceFeedback.findAll({
    where: { prId: req.params.prId, isDeleted: false },
    order: [['id', 'DESC']],
    include: [
      {
        model: db.User,
        attributes: ['id', 'name', 'email', 'isDeleted'],
      },
    ],
  })
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      res.status(500).send({ message: err.message });
    });
};

// request feedback
exports.requestFeedback = (req, res) => {
  // validate params
  if (!req.body.query) {
    return res.status(400).send({ message: 'userId or email is required!' });
  }
  let search_user_condition = {};
  if (!req.body.query.includes('@')) {
    search_user_condition = { id: parseInt(req.body.query) };
  } else {
    search_user_condition = { email: req.body.query };
  }
  // 1. search and validate user
  db.User.findOne({
    where: {
      ...search_user_condition,
      isDeleted: false,
    },
  }).then((user) => {
    if (!user) {
      return res.status(400).send({ message: 'Employee do not exist!' });
    }

    // TODO: prevent pr.userId === req.body.userId
    // (only allow others to provide feedback)
    db.PerformanceFeedback.findOne({
      where: {
        prId: req.params.prId,
        userId: user.id,
        isDeleted: false,
      },
    }).then((pb) => {
      if (pb) {
        return res
          .status(400)
          .send({ message: 'Already requested this user before!' });
      }
      // create new pb and save to db
      db.PerformanceFeedback.create({
        prId: req.params.prId,
        userId: user.id,
        status: PB_STATUS_NEW,
      }).then((newPB) => {
        return res.status(200).send(newPB);
      });
    });
  });
};

// submit new feedback
exports.submitFeedback = (req, res) => {
  // validate params
  if (!req.body.content) {
    return res.status(400).send({ message: 'content required!' });
  }

  db.PerformanceFeedback.findOne({
    where: {
      id: req.params.fbId,
      prId: req.params.prId,
      userId: req.userId,
    },
  })
    .then((pb) => {
      if (!pb) {
        // pb does not exist
        // return 404 not found
        return res
          .status(404)
          .send({ message: 'Feedback request does not exist!' });
      }

      pb.content = req.body.content;
      pb.status = PB_STATUS_SUBMITTED;

      pb.save().then((updatedPB) => {
        res.status(200).send(updatedPB);
      });
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      res.status(500).send({ message: err.message });
    });
};
