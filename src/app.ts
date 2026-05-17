import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { initDB, pool } from "./db";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";

const app: Application = express();
app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);

export default app;
