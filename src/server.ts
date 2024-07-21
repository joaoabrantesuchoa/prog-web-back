import express, { Request, Response } from "express";
import path from "path";
import multer from "multer";

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Wordl!");
});

app.post(
  "/upload-redacao",
  upload.single("image"),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Nenhuma imagem foi enviada",
        });
      }

      return res.status(201).json({
        message: "Imagem da redação enviada com sucesso",
        image: req.file.path,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro ao enviar imagem da redação",
      });
    }
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
