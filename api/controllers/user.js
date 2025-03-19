const {User} = require('../models')
const {generateResponse} = require("../views/response-entity");
const {BadRequestError, UnauthorizedError, NotFoundError} = require("../helpers/error");
const jwtHelper = require("../helpers/jwt");
const {OAuth2Client} = require("google-auth-library");

module.exports = {
  async register(req, res, next) {
    try {
      const user = await User.create(req.body);
      generateResponse(res, {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role,
      }, 201, "Created");
    } catch (err) {
      next(err)
    }
  },

  async login(req, res, next) {
    const {email, password} = req.body;
    try {
      if (!email || !password) {
        throw new BadRequestError("Username and password are required");
      }
      const user = await User.findOne({where: {email}});
      if (!user) {
        throw new UnauthorizedError("Invalid email or password");
      }
      const checkPass = await user.comparePassword(password);
      if (!checkPass) {
        throw new UnauthorizedError("Invalid email or password");
      }

      const token = jwtHelper.generateToken({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      });

      generateResponse(res, {token});
    } catch (err) {
      next(err)
    }
  },
  async checkUser(req, res, next) {
    try {
      generateResponse(res, req.user);
    } catch (err) {
      next(err)
    }
  },
  async googleLogin(req, res, next) {
    const {googleToken} = req.body;
    try {
      if (!googleToken) {
        throw new BadRequestError("Google token is required");
      }

      const client = new OAuth2Client();
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const {email, given_name, family_name} = ticket.getPayload();

      const [user, isCreated] = await User.findOrCreate({
        where: {email},
        defaults: {
          firstName: given_name,
          lastName: family_name,
          email,
          password: process.env.GOOGLE_PASSWORD,
          dob: "1970-01-01"
        }
      });

      const token = jwtHelper.generateToken({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      });

      const response = isCreated ? 201 : 200;
      const responseMessage = isCreated ? "User is created" : "Logged in";
      generateResponse(res, {token}, response, responseMessage);
    } catch (err) {
      next(err)
    }
  },

  async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ["password"]
        }
      });
      generateResponse(res, users);
    } catch (err) {
      next(err)
    }
  },
  async updateUserById(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        throw new NotFoundError("User not found");
      }
      await user.update(req.body);
      generateResponse(res, {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role,
      });
    } catch (err) {
      next(err)
    }
  },
  async deleteUserById(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        throw new NotFoundError("User not found");
      }
      await user.destroy();
      generateResponse(res, null, 200, "User deleted");
    } catch (err) {
      next(err)
    }
  }
}
