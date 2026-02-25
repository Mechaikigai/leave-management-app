const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("./database");
const leaveRoutes = require("./routes/leaveRoutes");
const { SECRET } = require("./auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/leaves", leaveRoutes);

// register
app.post("/api/register", async (req, res) => {
  const { username, password, role } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users(username,password,role) VALUES(?,?,?)`,
    [username, hash, role || "employee"],
    () => res.send({ message: "User created" })
  );
});

// login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE username=?`,
    [username],
    async (err, user) => {
      if (!user) return res.sendStatus(401);

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.sendStatus(401);

      const token = jwt.sign(
        { id: user.id, role: user.role },
        SECRET
      );

      res.json({ token });
    }
  );
});

app.listen(3000, () => console.log("Server running on 3000"));