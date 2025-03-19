class ResponseEntity {
  constructor(data, status = 200, message = "Success") {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

module.exports = {
  ResponseEntity,
  generateResponse: (res, data, status = 200, message = "Success") => {
    res.status(status).json(new ResponseEntity(data, status, message));
  }
};
