'use strict';

const bcrypt = require('bcryptjs');
const db = require('../models');
const { isValidEmail } = require('../utils/validator');

exports.getAll = (req, res) => {
  db.User.findAndCountAll({
    where: { isDeleted: false },
    order: [['id', 'DESC']],
    limit: req.query.limit,
    offset: req.skip,
  })
    .then((results) => {
      let itemCount = results.count;
      let pageCount = Math.ceil(results.count / req.query.limit);

      res.status(200).send({
        users: results.rows.map((user) => returnUserObject(user)),
        pageCount,
        itemCount,
      });
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      res.status(500).send({ message: err.message });
    });
};

// get single user by ID
exports.getById = (req, res) => {
  db.User.findOne({
    where: {
      id: req.params.id,
      isDeleted: false,
    },
  })
    .then((user) => {
      if (!user) {
        // user does not exist
        // return 404 not found
        return res.status(404).send({ message: 'User does not exist!' });
      }

      res.status(200).send(returnUserObject(user));
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      res.status(500).send({ message: err.message });
    });
};

// Update single user by ID
exports.updateById = (req, res) => {
  db.User.findOne({
    where: {
      id: req.params.id,
      isDeleted: false,
    },
  })
    .then((user) => {
      if (!user) {
        // user does not exist
        // return 404 not found
        return res.status(404).send({ message: 'User does not exist!' });
      }

      // update user
      if (req.body.name) {
        user.name = req.body.name;
      }
      if (req.body.email) {
        user.email = req.body.email;
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 10);
      }
      user.save().then((updatedUser) => {
        res.status(200).send(returnUserObject(updatedUser));
      });
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      res.status(500).send({ message: err.message });
    });
};

// delete single user by ID
exports.deleteById = (req, res) => {
  db.User.findOne({
    where: {
      id: req.params.id,
      isDeleted: false,
    },
  })
    .then((user) => {
      if (!user) {
        // user does not exist
        // return 404 not found
        return res.status(404).send({ message: 'User does not exist!' });
      }

      // set deleted flag
      user.isDeleted = true;

      user.save().then(() => {
        res.status(200).send({ message: 'Deleted successfully!' });
      });
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      res.status(500).send({ message: err.message });
    });
};

// create new user (with role user)
// this endpoint will not create new admin
exports.create = (req, res) => {
  // validate params
  if (!req.body.name) {
    return res.status(400).send({ message: 'Name required!' });
  }
  if (!req.body.email) {
    return res.status(400).send({ message: 'Email required!' });
  }
  if (!req.body.password) {
    return res.status(400).send({ message: 'Password required!' });
  }
  if (!isValidEmail(req.body.email)) {
    return res.status(400).send({ message: 'Email is not valid!' });
  }
  // create new user and save to db
  db.User.create({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    role: 'user',
  })
    .then((newUser) => {
      res.status(200).send(returnUserObject(newUser));
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      res.status(500).send({ message: err.message });
    });
};

// default user object structure, get from DB, return to client
const returnUserObject = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
