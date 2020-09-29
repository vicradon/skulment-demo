const { Client, query: q } = require("faunadb");
require("dotenv").config();

const client = new Client({
  secret: process.env.CURRENT_USER_SECRET,
});

client
  .query(q.Paginate(q.Documents(q.Collection("Courses"))))
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

