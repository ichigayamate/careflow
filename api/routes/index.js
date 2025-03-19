const {generateResponse} = require("../views/response-entity");
const {adminOnlyAuth, authentication} = require("../helpers/auth");
const router = require("express").Router();

router.get("/status", (req, res) => {
  generateResponse(res, "Server is running");
});
router.use("/public", require("./public"));

router.use("/users", require("./users"));

router.use(authentication);
router.use("/items", require("./items"));
router.use("/categories", require("./categories"));
router.use("/orders", require("./orders"));

module.exports = router;
