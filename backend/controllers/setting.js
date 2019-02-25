const express = require("express");
const Term = require('../models/term')
const router = express.Router();
const setting  = require("../service/setting_service.js");


router.get("/upload_timetable", (req, res) => {
  setting.upload_timetable()
  res.send("uploadTimetable")
});
router.get("/upload_user", (req, res) => {
  setting.upload_user();
  res.send("uploadUser")
});
router.post("/time_period", (req, res) => {
  var s = [], e = [],r = [];
  r = req.body.period
  for (var i in r) {
    s.push(r[i].startDate);
    e.push(r[i].endDate);
  }
  var termData = {
    termID: req.body.term,
    StartDate: s.join(","),
    EndDate: e.join(",")
  }
  Term.findOne({
    where: {
      termID:req.body.term
    }
  })
    .then(Term => {
      if (!Term) {
        res.send("termData has create");
        Term.create(termData)
      }
      else if (Term) {
       res.send("Term already exists' ")
      }
    }).catch(err => {
      res.send("error: " + err)
    });})
  //router.post("/login", UserController.userLogin);
  //router.post("/timetable", timetable.timetable;
  module.exports = router;
