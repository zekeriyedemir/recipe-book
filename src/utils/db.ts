import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.PG_URI!);
export default sql;
