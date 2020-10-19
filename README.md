# Full Stack Developer Challenge

## Requirements

Design a web application that allows employees to submit feedback toward each other's performance review.

### Admin view

- Add/remove/update/view employees
- Add/update/view performance reviews
- Assign employees to participate in another employee's performance review

### Employee view

- List of performance reviews requiring feedback
- Submit feedback

# High Level Design

## API server

Overview of ExpressJS API server:

<img src="./images/server.png" alt="api server" width="450px"/>

HTTP request that matched a route will be check by CORS Middleware, then pass to Security layer.

Security layer includes JWT Authentication for verify user's token, and Authorization Middleware to check user's role in database.

If middlewares throw any errors, a message will be sent to client as HTTP response.

Controllers connect with database (SQLite), get data, execute logic code and send HTTP response to client depend on its request.

### Technology

- [ExpressJS](https://github.com/expressjs/express)
- [Bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [Sequelize](https://github.com/sequelize/sequelize)
- SQLite

Bcrypt help to add a salt (additional random data) to the hashing password process, [that makes each password hash unique](https://auth0.com/blog/hashing-in-action-understanding-bcrypt/).

Jsonwebtoken help to create time-limited json token, server can use this token to verify user's identity. And avoid to using traditional SESSION ID validate way - which is consider as [difficult to scale](https://hackernoon.com/why-do-we-need-the-json-web-token-jwt-in-the-modern-web-k29l3sfd).

Sequelize is a promise-based Node.js ORM, help us to save time in writing raw SQL queries thereby reducing development time.

SQLite, better for quickly launch sample project and testing purpose.
