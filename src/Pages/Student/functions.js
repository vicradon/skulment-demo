import faunadb, { query as q } from "faunadb";

export const selectComponentData = async (user_id, secret) => {
  const client = new faunadb.Client({ secret });
  const courses = await client.query(
    q.Let(
      {
        student_ref: q.Ref(q.Collection("Students"), user_id),
        current_class: q.Select(
          ["data", "currentClass"],
          q.Get(q.Var("student_ref"))
        ),
        courses: q.Select(
          ["data", "courses"],
          q.Get(q.Var("current_class")),
          []
        ),
      },
      {
        courses: q.Map(
          q.Var("courses"),
          q.Lambda("course", {
            id: q.Select(["id"], q.Var("course")),
            title: q.Select(["data", "title"], q.Get(q.Var("course"))),
          })
        ),
      }
    )
  );
  return courses;
};

/* TODO: Add registerCourses function below */


export const unregisterCourse = async (course_id, user_id, secret) => {
  const client = new faunadb.Client({ secret });
  const response = await client.query(
    q.Call(q.Function("unregister_course"), [course_id, user_id])
  );
  return response;
};

export const courseCount = async (user_id, secret) => {
  const client = new faunadb.Client({ secret });
  const count = await client.query(
    q.Count(
      q.Select(
        ["data", "courses"],
        q.Get(q.Ref(q.Collection("Students"), user_id)),
        []
      )
    )
  );
  return count;
};

export const getRegisteredCourses = async (user_id, secret) => {
  const client = new faunadb.Client({ secret });
  const courses = await client.query(
    q.Map(
      q.Select(
        ["data", "courses"],
        q.Get(q.Ref(q.Collection("Students"), user_id)),
        []
      ),
      q.Lambda("ref", q.Get(q.Var("ref")))
    )
  );
  return courses;
};
