import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";

const app: Application = express();
const port = 3000;
app.use(express.json());

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_6Bg1bkzXiKvw@ep-tiny-field-ap2mwd3j-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20),
                email VARCHAR(20) NOT NULL,
                password VARCHAR(20) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                age INT,
                created_at TIMESTAMP DEFAULT NOW(),
                update_at TIMESTAMP DEFAULT NOW())`);
    console.log("Database connected successfully!");
  } catch (error) {
    console.log(error);
  }
};
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/", async (req: Request, res: Response) => {
  const { name, age, email, password } = req.body;

  try {
    const result = await pool.query(
      `
    INSERT INTO users(name, email, password, age) VALUES($1, $2, $3, $4)
    RETURNING * `,
      [name, email, password, age],
    );
    //   console.log(result);
    res.status(201).json({
      message: "user created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`server run on ${port}`);
});
