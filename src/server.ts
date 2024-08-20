import express from "express";
import { json } from "body-parser";
import teacherRoutes from "./routes/teacherRoutes";
import studentRoutes from "./routes/studentRoutes";
import authenticationRoutes from "./routes/authenticationRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use("/professores", teacherRoutes);
app.use("/alunos", studentRoutes);
app.use("", authenticationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
