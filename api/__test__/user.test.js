const request = require('supertest');
const app = require('../app');
const UserController = require('../controllers/user');
const { authentication, adminOrSelfAuth } = require('../helpers/auth');
const { v4: uuidv4 } = require('uuid');

jest.mock('../helpers/auth');
jest.mock('../controllers/user');

describe('Users Routes', () => {
  beforeEach(() => {
    authentication.mockClear();
    adminOrSelfAuth.mockClear();
    UserController.googleLogin.mockClear();
    UserController.register.mockClear();
    UserController.login.mockClear();
    UserController.checkUser.mockClear();
    UserController.updateUserById.mockClear();
    UserController.deleteUserById.mockClear();
  });

  test('POST /api/users/google should call googleLogin', async () => {
    UserController.googleLogin.mockImplementation((req, res) => res.status(200).send());

    await request(app).post('/api/users/google').send({ googleToken: 'token' }).expect(200);

    expect(UserController.googleLogin).toHaveBeenCalled();
  });

  test('POST /api/users/register should call register', async () => {
    UserController.register.mockImplementation((req, res) => res.status(201).send());

    await request(app).post('/api/users/register').send({ email: 'test@test.com', password: 'password' }).expect(201);

    expect(UserController.register).toHaveBeenCalled();
  });

  test('POST /api/users/login should call login', async () => {
    UserController.login.mockImplementation((req, res) => res.status(200).send());

    await request(app).post('/api/users/login').send({ email: 'test@test.com', password: 'password' }).expect(200);

    expect(UserController.login).toHaveBeenCalled();
  });

  test('POST /api/users should call authentication and checkUser', async () => {
    authentication.mockImplementation((req, res, next) => next());
    UserController.checkUser.mockImplementation((req, res) => res.status(200).send());

    await request(app).post('/api/users').expect(200);

    expect(authentication).toHaveBeenCalled();
    expect(UserController.checkUser).toHaveBeenCalled();
  });

  test('PUT /api/users/:id should call adminOrSelfAuth and updateUserById', async () => {
    const userId = uuidv4();
    adminOrSelfAuth.mockImplementation((req, res, next) => next());
    UserController.updateUserById.mockImplementation((req, res) => res.status(200).send());

    await request(app).put(`/api/users/${userId}`).send({ email: 'updated@test.com' }).expect(200);

    expect(adminOrSelfAuth).toHaveBeenCalled();
    expect(UserController.updateUserById).toHaveBeenCalled();
  });

  test('DELETE /api/users/:id should call adminOrSelfAuth and deleteUserById', async () => {
    const userId = uuidv4();
    adminOrSelfAuth.mockImplementation((req, res, next) => next());
    UserController.deleteUserById.mockImplementation((req, res) => res.status(200).send());

    await request(app).delete(`/api/users/${userId}`).expect(200);

    expect(adminOrSelfAuth).toHaveBeenCalled();
    expect(UserController.deleteUserById).toHaveBeenCalled();
  });
});
