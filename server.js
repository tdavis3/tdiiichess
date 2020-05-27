const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

// Init middleware
app.use(express.json({extended: false}));

app.get("/", (req, res) => res.send("API Running"));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/tournaments", require("./routes/api/tournaments"));
app.use("/api/sections", require("./routes/api/sections"));
app.use("/api/players", require("./routes/api/players"));
app.use("/api/resultpairings", require("./routes/api/resultpairings"));
app.use("/api/pairingalgo", require("./routes/api/pairingalgo"));
app.use("/api/analytics", require("./routes/api/analytics"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
