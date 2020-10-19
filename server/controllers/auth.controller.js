'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');

exports.signin = (req, res) => {
  // validate params
  // return 400 Bad Request if params not valud
  if (!req.body.email) {
    return res.status(400).send({ message: 'Email required!' });
  }
  if (!req.body.password) {
    return res.status(400).send({ message: 'Password required!' });
  }
  db.User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        // user does not exist
        // return 404 not found
        return res.status(404).send({ message: 'User does not exist!' });
      }
      // validate user's password
      const isPasswordValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      // if password not match
      // return 401 Unauthorized
      if (!isPasswordValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!',
        });
      }

      // create JWT token and return to client
      const token = jwt.sign({ id: user.id }, process.env.AUTH_SECRET_KEY, {
        expiresIn: process.env.AUTH_TOKEN_EXPIRE || 86400,
      });

      res.status(200).send({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        accessToken: token,
      });
    })
    .catch((err) => {
      // return 500 internal server error if any error occurs
      res.status(500).send({ message: err.message });
    });
};
