const {validate: isValidUUID} = require('uuid');
const {NotFoundError} = require("./error");

module.exports = {
  checkUUID: (req, res, next) => {
    try {
      const {id} = req.params;
      if (!isValidUUID(id)) throw new NotFoundError("Invalid UUID");
      next();
    } catch (e) {
      next(e);
    }
  }
}
