const faunadb = require("faunadb");
const q = faunadb.query;
require("dotenv").config();

const client = new faunadb.Client({
  secret: process.env.CURRENT_USER_TOKEN,
});

client
  .query(
    q.Create(q.Collection("Courses"), {
      data: {
        title: "General Physics",
        description: "A et soluta.",
        teachers: [],
        code: "PHY 327",
        availableFor: "",
        creditLoad: 3,
      },
    })
  )
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
