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
<hr>

## High Level Design

### API server

Overview of ExpressJS API server:

<img src="./images/server.png" alt="api server" width="450px"/>

HTTP request that matched a route will be check by CORS Middleware, then pass to Security layer.

Security layer includes JWT Authentication for verify user's token, and Authorization Middleware to check user's role in database.

If middlewares throw any errors, a message will be sent to client as HTTP response.

Controllers connect with database (SQLite), get data, execute logic code and send HTTP response to client depend on its request.

#### Technology

- [ExpressJS](https://github.com/expressjs/express)
- [Bcryptjs](https://github.com/dcodeIO/bcrypt.js): help to add a salt (additional random data) to the hashing password process, [that makes each password hash unique](https://auth0.com/blog/hashing-in-action-understanding-bcrypt/).
- [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken): help to create time-limited json token, api will check this token to verify user's identity.
- [Sequelize](https://github.com/sequelize/sequelize) is a promise-based Node.js ORM, help to save time in writing raw SQL queries thereby reducing development time.
- SQLite, for quickly launch sample project and testing purpose.

<hr>

## Installation

Clone this repository

```bash
git clone https://github.com/zyakita/FullStackEngineerChallenge.git
```

### API server

1. Change dir to `server` folder

```bash
cd server
```

2. Create .env file

- PORT: api server's port
- WEB_CLIENT_URL: full url to web client
- AUTH_SECRET_KEY: server use this value to sign & verify jwt token
- AUTH_TOKEN_EXPIRE: Expired time of single jwt token

```bash
cp .env.sample .env
```

3. Install dependancies

```bash
yarn install
```

4. Start app

```bash
yarn dev
```

Testing: Test cases (unit test) can be found under folder `__test__`, use command `yarn test` to run test cases
