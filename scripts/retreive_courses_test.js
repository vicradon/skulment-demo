const faunadb = require("faunadb");
const q = faunadb.query;
require("dotenv").config();

const client = new faunadb.Client({
  secret: process.env.CURRENT_USER_TOKEN,
});

client
  .query(q.Paginate(q.Documents(q.Collection("Courses"))))
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
