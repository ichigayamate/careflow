const UserController = require("../controllers/user");
const {authentication, adminOrSelfAuth, adminOnlyAuth} = require("../helpers/auth");
const router = require("express").Router();

router.post("/google", UserController.googleLogin);
router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.use(authentication)
router.post("/", UserController.checkUser);
router.put("/:id", adminOrSelfAuth, UserController.updateUserById);
router.delete("/:id", adminOrSelfAuth, UserController.deleteUserById);

router.get("/cms", adminOnlyAuth, UserController.getAllUsers);
router.put("/cms/:id", adminOnlyAuth, UserController.updateUserById);
router.delete("/cms/:id", adminOrSelfAuth, UserController.deleteUserById);

module.exports = router;
