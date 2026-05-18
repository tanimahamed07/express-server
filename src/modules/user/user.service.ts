import { pool } from "../../db";
import type { IUser } from "./user.interface";


const createUserIntoDB = async (payload: IUser) => {
  const { name, age, email, password, role } = payload;

  const result = await pool.query(
    `
    INSERT INTO users(name, email, password, age) VALUES($1, $2, $3, $4, COALESCE($5, user))
    RETURNING * `,
    [name, email, password, age, role],
  );
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
        SELECT * FROM users WHERE id=$1`,
    [id],
  );
  return result;
};

const updateUserFromDB = async (payload: IUser, id: string) => {
  const { name, password, age, is_active } = payload;

  const result = await pool.query(
    `
        UPDATE users SET name=COALESCE($1 name), password= COALESCE($2, password), age=COALESCE($3,age), is_active=COALESCE($4, is_active)
        WHERE id = $5
        `,
    [name, password, age, is_active, id],
  );
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1 `, [id]);
  return result
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserFromDB,
  deleteUserFromDB
};
