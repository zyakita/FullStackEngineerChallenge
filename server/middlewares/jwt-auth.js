'use strict';
const jwt = require('jsonwebtoken');
const db = require('../models');

const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      message: 'Missing JWT token!',
    });
  }

  jwt.verify(token, process.env.AUTH_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Request unauthorized!',
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isEmailUsable = (req, res, next) => {
  db.User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: 'Email is already in use!',
      });
      return;
    }

    next();
  });
};

const isAdmin = (req, res, next) => {
  db.User.findByPk(req.userId).then((user) => {
    if (user.role === 'admin') {
      next();
      return;
    }
    res.status(403).send({
      message: 'Only Administrator can submit this request!',
    });
    return;
  });
};

module.exports = {
  verifyToken: verifyToken,
  isEmailUsable: isEmailUsable,
  isAdmin: isAdmin,
};
