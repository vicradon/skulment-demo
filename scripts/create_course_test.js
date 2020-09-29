const { Client, query: q } = require("faunadb");
require("dotenv").config();

const client = new Client({
  secret: process.env.CURRENT_USER_SECRET,
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
