import nc from "next-connect";
import { Pool } from "pg";

const handler = nc().post(async (req, res) => {
  try {
    const pool = new Pool({ connectionString: process.env.PG_CON_STRING });
    await pool.connect();

    const accExists = await pool.query(
      "SELECT * FROM vime_accounts WHERE login = $1",
      [req.body.login]
    );
    if (accExists.rowCount !== 0) throw Error("Account already exists");

    await pool.query(
      "INSERT INTO vime_accounts (login, level) VALUES ($1, $2);",
      [req.body.login, req.body.level]
    );

    res.json({
      error: false,
      msg: `Account ${req.body.login} added successfully!`,
    });
  } catch (e) {
    res.json({ error: true, msg: e.message });
  }
});

export default handler;
