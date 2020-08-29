const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user_model");

router.post("/register", (req, res) => {
  var user = new User(req.body);

  bcrypt
    .genSalt(15)
    .then((salt) => {
      if (salt) {
        bcrypt
          .hash(req.body.password, salt)
          .then((hash) => {
            if (hash) {
              user.password = hash;

              User.create(user)
                .then((user) => {
                  if (user) {
                    res.json({ success: true, message: "User Created !" });
                  } else if (!user) {
                    res.json({
                      success: false,
                      message: "User could not be Created !",
                    });
                  }
                })
                .catch((err) => console.log("Error: ", JSON.stringify(err)));
            } else {
              res.json({
                success: false,
                message: "Hash could not be generated !",
              });
            }
          })
          .catch((err) => console.log("Error: ", JSON.stringify(err)));
      } else {
        res.json({ success: false, message: "Salt could not be generated !" });
      }
    })
    .catch((err) => console.log("Error: ", JSON.stringify(err)));
});

router.patch("/update/:username", (req, res) => {
  if (req.body.password && req.body.newPassword) {
    User.findOne({ username: req.params.username })
      .then((user) => {
        if (user) {
          bcrypt
            .compare(req.body.password, user.password)
            .then((isMatch) => {
              if (isMatch) {
                bcrypt
                  .genSalt(15)
                  .then((salt) => {
                    if (salt) {
                      bcrypt
                        .hash(req.body.newPassword, salt)
                        .then((hash) => {
                          if (hash) {
                            user.password = hash;
                            user
                              .save()
                              .then((user) => {
                                if (user) {
                                  res.json({
                                    success: true,
                                    message: "Password Updated !",
                                  });
                                } else {
                                  res.json({
                                    success: false,
                                    message: "password could not be Updated !",
                                  });
                                }
                              })
                              .catch((err) =>
                                console.log("Error: ", JSON.stringify(err))
                              );
                          } else {
                            res.json({
                              success: false,
                              message: "Hash could not be created !",
                            });
                          }
                        })
                        .catch((err) =>
                          console.log("Error: ", JSON.stringify(err))
                        );
                    } else {
                      res.json({
                        success: false,
                        message: "Salt could not be generated !",
                      });
                    }
                  })
                  .catch((err) => console.log("Error: ", JSON.stringify(err)));
              } else {
                res.json({ success: false, message: "Wrong password !" });
              }
            })
            .catch((err) => console.log("Error: ", JSON.stringify(err)));
        } else {
          res.json({ success: false, message: "No User found !" });
        }
      })
      .catch((err) => console.log("Error: ", JSON.stringify(err)));
  } else {
    res.json({ success: false, message: "All things not recieved !" });
  }
});

router.delete("/delete/:username", (req, res) => {
  if (req.body.password) {
    User.findOne({ username: req.params.username })
      .then((user) => {
        if (user) {
          bcrypt
            .compare(req.body.password, user.password)
            .then((isMatch) => {
              if (isMatch) {
                User.deleteOne(user)
                  .then((user) => {
                    if (user) {
                      res.json({ success: true, message: "User Deleted !" });
                    } else {
                      res.json({
                        success: false,
                        message: "User could not be deleted !",
                      });
                    }
                  })
                  .catch((err) => console.log("Error: ", JSON.stringify(err)));
              } else {
                res.json({ success: false, message: "Wrong Password !" });
              }
            })
            .catch((err) => console.log("Error: ", JSON.stringify(err)));
        } else {
          res.json({ success: false, message: "No Such User !" });
        }
      })
      .catch((err) => console.log("Error: ", JSON.stringify(err)));
  }
});

router.get("/:username", (req, res) => {
  User.findOne({ username: req.params.username })
    .then((user) => {
      if (user) {
        res.json({
          success: true,
          message: "Recieved user !",
          user: { name: user.username, email: user.email },
        });
      } else {
        res.json({
          success: false,
          message: "No User with such username !",
          user: null,
        });
      }
    })
    .catch((err) => console.log("Error: ", JSON.stringify(err)));
});

module.exports = router;
