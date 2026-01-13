import { Client } from "pg";

export default async (req) => {
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL
  });

  await client.connect();

  const { text } = JSON.parse(req.body);

  const res = await client.query(
    "insert into bucket_items(text) values($1) returning *",
    [text]
  );

  await client.end();

  return {
    statusCode: 200,
    body: JSON.stringify(res.rows[0])
  };
};
