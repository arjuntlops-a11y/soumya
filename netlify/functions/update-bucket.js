import { Client } from "pg";

export default async (req) => {
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL
  });

  await client.connect();

  const { id, done } = JSON.parse(req.body);

  await client.query(
    "update bucket_items set done=$1 where id=$2",
    [done, id]
  );

  await client.end();

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  };
};
