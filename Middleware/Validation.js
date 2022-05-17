const { validationResult, check } = require("express-validator");

const Validation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please enter a valid Email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more character"
  ).isLength({
    min: 6,
  }),
  check("wnumber", "Enter a Valid Mobile Number").isNumeric(),
];

const LoginValidation = [
  check("wnumber", "Please Enter a Mobile Number").not().isEmpty(),
  check('wnumber',"Enter a Valid Number").isNumeric(),
  check(
    "password",
    "Please enter a password with 6 or more character"
  ).isLength({
    min: 6,
  }),
];

const handleValidation = (req, res, next) => {
  const { name, email, wnumber, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, Error: errors.array() });
  }
  next();
};

const handleLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      Error: errors.array(),
    });
  }
  next()
};

module.exports = { 
    handleValidation, 
    Validation, 
    LoginValidation, 
    handleLogin 
};
