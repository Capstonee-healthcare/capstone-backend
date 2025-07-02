const express = require("express");
const cors = require("cors");
const app = express();

const programRoutes = require("./routes/programRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());

app.use("/api", programRoutes);
app.use("/api/user", userRoutes);

app.listen(3000, () => console.log("✅ Server running on port 3000"));
