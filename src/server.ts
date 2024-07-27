import express from "express";
import { json } from "body-parser";
import teacherRoutes from "./routes/teacherRoutes";
import studentRoutes from "./routes/studentRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use("/teachers", teacherRoutes);
app.use("/students", studentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
