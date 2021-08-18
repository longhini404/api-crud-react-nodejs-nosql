var ObjectId = require("mongodb").ObjectId;
var express = require("express");
var app = express();

// SHOW LIST OF COMMENTS
app.get("/", function (req, res, next) {
  // fetch and sort comments collection by id in descending order
  req.db
    .collection("comments")
    .find()
    .sort({ _id: -1 })
    .toArray(function (err, result) {
      //if (err) return console.log(err)
      if (err) {
        req.flash("error", err);
        res.render("comment/list", {
          title: "Comment List",
          data: "",
        });
      } else {
        // render to views/comment/list.ejs template file
        res.render("comment/list", {
          title: "Comment List",
          data: result,
        });
      }
    });
});

// SHOW ADD COMMENT FORM
app.get("/add", function (req, res, next) {
  // render to views/comment/add.ejs
  res.render("comment/add", {
    title: "Add New Comment",
    id_class: "",
    comment: "",
    date_created: "",
  });
});

// ADD NEW COMMENT POST ACTION
app.post("/add", function (req, res, next) {
  req.assert("id_class", "Campo obrigatório").notEmpty(); //Validate
  req.assert("comment", "Campo obrigatório").notEmpty(); //Validate
  req.assert("date_created", "Campo obrigatório").notEmpty(); //Validate

  var errors = req.validationErrors();

  if (!errors) {
    var comment = {
      id_class: req.sanitize("id_class").escape().trim(),
      comment: req.sanitize("comment").escape().trim(),
      date_created: req.sanitize("date_created").escape().trim(),
    };

    req.db.collection("comments").insert(comment, function (err, result) {
      if (err) {
        req.flash("error", err);
        // render to views/comment/add.ejs
        res.render("comment/add", {
          title: "Add New Comment",
          id_class: comment.id_class,
          comment: comment.comment,
          date_created: comment.date_created,
        });
      } else {
        req.flash("success", "Dados adicionados com sucesso!");
        // redirect to comment list
        res.redirect("/comments");
      }
    });
  } else {
    //Display errors to comment
    var error_msg = "";
    errors.forEach(function (error) {
      error_msg += error.msg + "<br>";
    });
    req.flash("error", error_msg);
    
    res.render("comment/add", {
      title: "Add New Comment",
      id_class: req.body.id_class,
      comment: req.body.comment,
      date_created: req.body.date_created,
    });
  }
});

// DELETE COMMENT
app.delete("/delete/(:id)", function (req, res, next) {
  var o_id = new ObjectId(req.params.id);
  req.db.collection("comments").remove({ _id: o_id }, function (err, result) {
    if (err) {
      req.flash("error", err);
      // redirect to comments list
      res.redirect("/comments");
    } else {
      req.flash("success", "Dado excluído com sucesso!");
      // redirect to comments list
      res.redirect("/comments");
    }
  });
});

module.exports = app;
