const { body, validationResult, check } = require("express-validator");
var bcrypt = require("bcrypt");
const db = require("../Helper/Connect");
const axios = require("axios");
const runquery = db.con;
const { SECRET } = require("../Helper/Constant");
var jwt = require("jsonwebtoken");

const Register = async (req, res) => {
  const { name, email, wnumber, password } = req.body;
  const genSalt = 10;
  const hash = await bcrypt.hash(password, genSalt);
  var val = Math.floor(1000 + Math.random() * 9000);
  let mess = `Hello ${name} \n Thankyou for registering in instaphantom \n Your OTP is: ${val}`;
  const MsgUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=CgS6KLa6FZIWC4rGhHqjXUuBqaxaPbHxxgM8NItmRKFtJx1ncwGkmM1NqPEV&route=v3&sender_id=Cghpet&message=${mess}&language=english&flash=0&numbers=${wnumber}`;

  if (name != "" || email != "" || wnumber != "" || password != "") {
    var sql = `SELECT email,mnumber FROM users WHERE email = '${email}' AND mnumber = '${wnumber}'`;
    db.con.query(sql, (err, result, field) => {
      if (err) console.log(err);
      console.log(result);
      if (result.length > 0) {
        res.send({
          status: false,
          msg: "Email or Mobile Number already exist",
        });
      } else {
        var sql = `INSERT INTO users (name, mnumber, email,verify_Otp,password) VALUES ('${name}', '${wnumber}','${email}','${val}','${hash}')`;
        db.con.query(sql, (err, result, field) => {
          if (err) console.log(err);
          console.log(result);
          if (result.insertId) {
            axios
              .get(MsgUrl)
              .then(function (response) {
                // handle success
                res
                  .status(200)
                  .send({ status: true, msg: response.data.message[0] });
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              });
          }
        });
      }
    });
  } else {
    res.status(400).send({ status: true, msg: "All fields are required" });
  }
};

//For resending the OTP
const ResendOtp = async (req, res) => {
  console.log(req.params.id);
  var val = Math.floor(1000 + Math.random() * 9000);
  let mess = `Ooh You not got the Otp \n Here is the new OTP : ${val}`;
  const MsgUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=CgS6KLa6FZIWC4rGhHqjXUuBqaxaPbHxxgM8NItmRKFtJx1ncwGkmM1NqPEV&route=v3&sender_id=Cghpet&message=${mess}&language=english&flash=0&numbers=${req.params.num}`;

  var sql = `UPDATE users SET verify_Otp = '${val}' WHERE id = '${req.params.id}'`;
  runquery.query(sql, (err, result) => {
    if (err) {
      res.status(500).send({ status: false, msg: err });
    } else if (result) {
      axios
        .get(MsgUrl)
        .then(function (response) {
          // handle success
          res.status(200).send({ status: true, msg: response.data.message[0] });
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    } else {
      res.status(404).send({ status: false, msg: "Something went wrong" });
    }
  });
};

const Login = async (req, res) => {
  const { wnumber, password } = req.body;
  db.con.query(
    `SELECT id, password FROM users WHERE mnumber = '${wnumber}'`,
    async (err, result) => {
      if (err) {
        res.status(522).send({ status: false, msg: err });
      } else {
        const working = await bcrypt.compare(password, result[0].password);
        if (working) {
          var token = jwt.sign(
            {
              id: result[0].id,
            },
            SECRET
          );
          res.status(200).send({ status: true, msg: token });
        } else {
          res
            .status(200)
            .send({ status: true, msg: "Please Enter the Corect Passwords" });
        }
      }
    }
  );
};

const VerifyOtp = async (req, res) => {
  const { wnumber, otp } = req.body;
  db.con.query(
    `UPDATE users SET verified = '1' WHERE mnumber = '${wnumber}' AND verify_Otp = '${otp}'`,
    async (err, result) => {
      if (err) {
        res.status(200).send({ status: false, msg: err });
      } else {
        res.status(200).send({ status: true, msg: result });
      }
    }
  );
};

const forgotPasswordsendOTP = async (req, res) => {
  const { wnumber } = req.body;
  var val = Math.floor(1000 + Math.random() * 9000);
  let mess = `Ooh Please verify your number to update your password \n Here is the new OTP : ${val}`;
  const MsgUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=CgS6KLa6FZIWC4rGhHqjXUuBqaxaPbHxxgM8NItmRKFtJx1ncwGkmM1NqPEV&route=v3&sender_id=Cghpet&message=${mess}&language=english&flash=0&numbers=${wnumber}`;

  if (!wnumber) {
    res.status(404).send({ status: false, msg: "Mobile Number is required" });
  }
  db.con.query(
    `SELECT mnumber from users WHERE mnumber = '${wnumber}'`,
    async (err, result) => {
      if (err) {
        res.status(500).send({ status: false, msg: err });
      }
      if (result.length > 0) {
        const sqlQuery = `UPDATE users SET verify_Otp = '${val}' WHERE mnumber = '${wnumber}'`;
        db.con.query(sqlQuery, (err, query) => {
          if (err) {
            res.status(500).send({ status: false, msg: err });
          } else {
            axios
              .get(MsgUrl)
              .then(function (response) {
                // handle success
                res
                  .status(200)
                  .send({ status: true, msg: response.data.message[0] });
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              });
          }
        });
      } else {
        res.send({
          status: false,
          msg: "Your are not registered with this number",
        });
      }
    }
  );
};

const UpdateForgotPassword = async(req, res) =>{
  const {reOtp, repassword, wnumber} = req.body
  const genSalt = 10;
  const hash = await bcrypt.hash(repassword, genSalt);
  if(reOtp != "" || repassword != "" || wnumber != ""){
    const result = db.con.query(`SELECT * from users WHERE mnumber = '${wnumber}'`)
    result.on('result',(row)=>{
      if(row.verify_Otp == reOtp){
          db.con.query(`Update users SET password = '${hash}' WHERE mnumber = '${wnumber}'`,(err, result)=>{
            if(err){
              res.status(500).send({status:false, msg:'Something went wrong'})
            }else{
              res.status(200).send({status:true, msg:'Password updated please login'})
            }
          })
      }else{
        res.status(200).send({status:false, msg:'Entered wrong OTP'})
      }
    })
  }
}

module.exports = {
  Register,
  ResendOtp,
  Login,
  VerifyOtp,
  forgotPasswordsendOTP,
  UpdateForgotPassword
};
