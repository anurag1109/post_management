const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { usermodel } = require("../models/model");

const register = async (req, res) => {
  const { name, email, gender, password, age, city, is_married } = req.body;
  console.log(name, email, gender, password, age, city, is_married);
  try {
    if (await usermodel.findOne({ email })) {
      res.send({ msg: "User already exist, please login" });
    } else {
      const hashpass = await bcrypt.hash(password, 5);
      const hashuser = new usermodel({
        name,
        email,
        gender,
        age,
        city,
        password: hashpass,
        is_married,
      });
      console.log(hashuser);
      await hashuser.save();
      res.status(200).send({ msg: "user has been registered successfully" });
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isuserexist = await usermodel.findOne({ email });
    if (!isuserexist) {
      res.status(200).send("please register first");
    } else if (!(await bcrypt.compare(password, isuserexist.password))) {
      res.status(200).send("password is incorrect");
    } else {
      const token = jwt.sign({ userId: isuserexist._id }, "key");
      res.status(200).send({ msg: "login successfull", token: token });
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
module.exports = { register, login };
