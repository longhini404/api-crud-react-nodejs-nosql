var express = require("express");
var app = express();
var ObjectId = require("mongodb").ObjectId;

// SHOW LIST OF USERS
app.get("/", function (req, res, next) {
  // fetch and sort users collection by id in descending order
  req.db
    .collection("users")
    .find()
    .sort({ _id: -1 })
    .toArray(function (err, result) {
      //if (err) return console.log(err)
      if (err) {
        req.flash("error", err);
        res.render("user/list", {
          title: "User List",
          data: "",
        });
      } else {
        // render to views/user/list.ejs template file
        res.render("user/list", {
          title: "User List",
          data: result,
        });
      }
    });
});

// SHOW ADD USER FORM
app.get("/add", function (req, res, next) {
  // render to views/user/add.ejs
  res.render("user/add", {
    title: "Add New User",
    name: "",
    email: "",
    password: "",
  });
});

// ADD NEW USER POST ACTION
app.post("/add", function (req, res, next) {
  req.assert("name", "Nome é obrigatório").notEmpty(); //Validate name
  req.assert("email", "Email é obrigatório").notEmpty(); //Validate email
  req.assert("password", "Senha é obrigatório").notEmpty(); //Validate password

  var errors = req.validationErrors();

  if (!errors) {
    var user = {
      name: req.sanitize("name").escape().trim(),
      email: req.sanitize("email").escape().trim(),
      password: req.sanitize("password").escape().trim(),
    };

    req.db.collection("users").insert(user, function (err, result) {
      if (err) {
        req.flash("error", err);

        // render to views/user/add.ejs
        res.render("user/add", {
          title: "Add New User",
          name: user.name,
          email: user.email,
          password: user.password,
        });
      } else {
        req.flash("success", "Dados adicionados com sucesso!");

        // redirect to user list
        res.redirect("/users");
      }
    });
  } else {
    //Display errors to user
    var error_msg = "";
    errors.forEach(function (error) {
      error_msg += error.msg + "<br>";
    });
    req.flash("error", error_msg);

    /**
     * Using req.body.name
     * because req.param('name') is deprecated
     */
    res.render("user/add", {
      title: "Add New User",
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
  }
});

// SHOW EDIT USER FORM
app.get("/edit/(:id)", function (req, res, next) {
  var o_id = new ObjectId(req.params.id);
  req.db
    .collection("users")
    .find({ _id: o_id })
    .toArray(function (err, result) {
      if (err) return console.log(err);

      // if user not found
      if (!result) {
        req.flash("error", "User not found with id = " + req.params.id);
        res.redirect("/users");
      } else {
        // if user found
        // render to views/user/edit.ejs template file
        res.render("user/edit", {
          title: "Edit User",
          //data: rows[0],
          id: result[0]._id,
          name: result[0].name,
          email: result[0].email,
          password: result[0].password,
        });
      }
    });
});

// EDIT USER POST ACTION
app.put("/edit/(:id)", function (req, res, next) {
  req.assert("name", "Nome é obrigatório").notEmpty(); //Validate name
  req.assert("email", "Email é obrigatório").notEmpty(); //Validate email
  req.assert("password", "Senha é obrigatório").notEmpty(); //Validate password

  var errors = req.validationErrors();

  if (!errors) {
    var user = {
      name: req.sanitize("name").escape().trim(),
      email: req.sanitize("email").escape().trim(),
      password: req.sanitize("password").escape().trim(),
    };

    var o_id = new ObjectId(req.params.id);
    req.db
      .collection("users")
      .update({ _id: o_id }, user, function (err, result) {
        if (err) {
          req.flash("error", err);

          // render to views/user/edit.ejs
          res.render("user/edit", {
            title: "Edit User",
            id: req.params.id,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });
        } else {
          req.flash("success", "Dados atualizados com sucesso!");

          res.redirect("/users");
        }
      });
  } else {
    //Display errors to user
    var error_msg = "";
    errors.forEach(function (error) {
      error_msg += error.msg + "<br>";
    });
    req.flash("error", error_msg);

    /**
     * Using req.body.name
     * because req.param('name') is deprecated
     */
    res.render("user/edit", {
      title: "Edit User",
      id: req.params.id,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
  }
});

// DELETE USER
app.delete("/delete/(:id)", function (req, res, next) {
  var o_id = new ObjectId(req.params.id);
  req.db.collection("users").remove({ _id: o_id }, function (err, result) {
    if (err) {
      req.flash("error", err);
      // redirect to users list
      res.redirect("/users");
    } else {
      req.flash("success", "Usuário excluído com sucesso!");
      // redirect to users list
      res.redirect("/users");
    }
  });
});

module.exports = app;
