const express = require("express");
const router = express.Router();
const db = require("../database");
const { auth } = require("../auth");

// create leave request
router.post("/", auth, (req, res) => {
  const { startDate, endDate, reason } = req.body;

  db.run(
    `INSERT INTO leaves(userId,startDate,endDate,reason)
     VALUES(?,?,?,?)`,
    [req.user.id, startDate, endDate, reason],
    () => res.send({ message: "Leave requested" })
  );
});

// get leaves
router.get("/", auth, (req, res) => {
  db.all(`SELECT * FROM leaves`, (err, rows) => {
    res.json(rows);
  });
});

// approve
router.put("/approve/:id", auth, (req, res) => {
  if (req.user.role !== "manager")
    return res.status(403).send("Forbidden");

  db.run(
    `UPDATE leaves SET status='approved' WHERE id=?`,
    [req.params.id],
    () => res.send({ message: "Approved" })
  );
});

// cancel
router.put("/cancel/:id", auth, (req, res) => {
  db.run(
    `UPDATE leaves SET status='cancelled' WHERE id=?`,
    [req.params.id],
    () => res.send({ message: "Cancelled" })
  );
});

module.exports = router;