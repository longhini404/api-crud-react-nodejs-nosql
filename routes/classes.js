var ObjectId = require("mongodb").ObjectId;
var express = require("express");
var app = express();

// SHOW LIST OF CLASSES
app.get("/", function (req, res, next) {
  // fetch and sort classes collection by id in descending order
  req.db
    .collection("classes")
    .find()
    .sort({ _id: -1 })
    .toArray(function (err, result) {
      //if (err) return console.log(err)
      if (err) {
        req.flash("error", err);
        res.render("classe/list", {
          title: "Classe List",
          data: "",
        });
      } else {
        // render to views/classe/list.ejs template file
        res.render("classe/list", {
          title: "Classe List",
          data: result,
        });
      }
    });
});

// SHOW ADD CLASSE FORM
app.get("/add", function (req, res, next) {
  // render to views/classe/add.ejs
  res.render("classe/add", {
    title: "Add New Classe",
    name: "",
    description: "",
    video: "",
    data_init: "",
    data_end: "",
    date_created: "",
    date_updated: "",
    total_comments: "",
  });
});

// ADD NEW CLASSE POST ACTION
app.post("/add", function (req, res, next) {
  req.assert("name", "Campo obrigatório").notEmpty(); //Validate
  req.assert("description", "Campo obrigatório").notEmpty(); //Validate
  req.assert("video", "Campo obrigatório").notEmpty(); //Validate
  req.assert("data_init", "Campo obrigatório").notEmpty(); //Validate
  req.assert("data_end", "Campo obrigatório").notEmpty(); //Validate

  var errors = req.validationErrors();

  if (!errors) {
    var classe = {
      name: req.sanitize("name").escape().trim(),
      description: req.sanitize("description").escape().trim(),
      video: req.sanitize("video").escape().trim(),
      data_init: req.sanitize("data_init").escape(),
      data_end: req.sanitize("data_end").escape(),
      date_created: req.sanitize("date_created").escape(),
      date_updated: req.sanitize("date_updated").escape(),
      total_comments: req.sanitize("total_comments").escape(),
    };

    req.db.collection("classes").insert(classe, function (err, result) {
      if (err) {
        req.flash("error", err);
        // render to views/classe/add.ejs
        res.render("classe/add", {
          title: "Add New Classe",
          name: classe.name,
          description: classe.description,
          video: classe.video,
          data_init: classe.data_init,
          data_end: classe.data_end,
          date_created: classe.date_created,
          date_updated: classe.date_updated,
          total_comments: classe.total_comments,
        });
      } else {
        req.flash("success", "Dados adicionados com sucesso!");
        // redirect to classe list
        res.redirect("/classes");
      }
    });
  } else {
    //Display errors to classe
    var error_msg = "";
    errors.forEach(function (error) {
      error_msg += error.msg + "<br>";
    });
    req.flash("error", error_msg);

    res.render("classe/add", {
      title: "Add New Classe",
      name: req.body.name,
      description: req.body.description,
      video: req.body.video,
      data_init: req.body.data_init,
      data_end: req.body.data_end,
      date_created: req.body.date_created,
      date_updated: req.body.date_updated,
      total_comments: req.body.total_comments,
    });
  }
});

// SHOW EDIT CLASSE FORM
app.get("/edit/(:id)", function (req, res, next) {
  var o_id = new ObjectId(req.params.id);
  req.db
    .collection("classes")
    .find({ _id: o_id })
    .toArray(function (err, result) {
      if (err) return console.log(err);
      // if classe not found
      if (!result) {
        req.flash("error", "Classe not found with id = " + req.params.id);
        res.redirect("/classes");
      } else {
        // if classe found
        // render to views/classe/edit.ejs template file
        res.render("classe/edit", {
          title: "Edit Classe",
          //data: rows[0],
          id: result[0]._id,
          name: result[0].name,
          description: result[0].description,
          video: result[0].video,
          data_init: result[0].data_init,
          data_end: result[0].data_end,
          date_created: result[0].date_created,
          date_updated: result[0].date_updated,
        });
      }
    });
});

// EDIT CLASSE POST ACTION
app.put("/edit/(:id)", function (req, res, next) {
  req.assert("name", "Campo obrigatório").notEmpty(); //Validate
  req.assert("description", "Campo obrigatório").notEmpty(); //Validate
  req.assert("video", "Campo obrigatório").notEmpty(); //Validate
  req.assert("data_init", "Campo obrigatório").notEmpty(); //Validate
  req.assert("data_end", "Campo obrigatório").notEmpty(); //Validate

  var errors = req.validationErrors();

  if (!errors) {
    var classe = {
      name: req.sanitize("name").escape().trim(),
      description: req.sanitize("description").escape().trim(),
      video: req.sanitize("video").escape().trim(),
      data_init: req.sanitize("data_init").escape(),
      data_end: req.sanitize("data_end").escape(),
      date_created: req.sanitize("date_created").escape(),
      date_updated: req.sanitize("date_updated").escape(),
    };

    var o_id = new ObjectId(req.params.id);
    req.db
      .collection("classes")
      .update({ _id: o_id }, classe, function (err, result) {
        if (err) {
          req.flash("error", err);
          // render to views/classe/edit.ejs
          res.render("classe/edit", {
            title: "Edit Classe",
            id: req.params.id,
            name: req.body.name,
            description: req.body.description,
            video: req.body.video,
            data_init: req.body.data_init,
            data_end: req.body.data_end,
            date_created: req.body.date_created,
            date_updated: req.body.date_updated,
          });
        } else {
          req.flash("success", "Dados atualizados com sucesso!");

          res.redirect("/classes");
        }
      });
  } else {
    //Display errors to classe
    var error_msg = "";
    errors.forEach(function (error) {
      error_msg += error.msg + "<br>";
    });
    req.flash("error", error_msg);

    res.render("classe/edit", {
      title: "Edit Classe",
      id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      video: req.body.video,
      data_init: req.body.data_init,
      data_end: req.body.data_end,
      date_created: req.body.date_created,
      date_updated: req.body.date_updated,
    });
  }
});

// DELETE CLASSE
app.delete("/delete/(:id)", function (req, res, next) {
  var o_id = new ObjectId(req.params.id);
  req.db.collection("classes").remove({ _id: o_id }, function (err, result) {
    if (err) {
      req.flash("error", err);
      // redirect to classes list
      res.redirect("/classes");
    } else {
      req.flash("success", "Dado excluído com sucesso!");
      // redirect to classes list
      res.redirect("/classes");
    }
  });
});

module.exports = app;
