import express from "express";
import cors from "cors";
import { json } from "body-parser";
import teacherRoutes from "./routes/teacherRoutes";
import studentRoutes from "./routes/studentRoutes";
import authenticationRoutes from "./routes/authenticationRoutes";
import projectRoutes from "./routes/projectRoutes";
import activitiesRoutes from "./routes/activitiesRoutes";
import usersRoutes from "./routes/usersRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(json());
app.use("/professores", teacherRoutes);
app.use("/alunos", studentRoutes);
app.use("/projetos", projectRoutes);
app.use("/atividades", activitiesRoutes);
app.use("/usuarios", usersRoutes);
app.use("", authenticationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
