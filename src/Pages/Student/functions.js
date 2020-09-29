import faunadb, { query as q } from "faunadb";

export const selectComponentData = async (user_id, token) => {
  const client = new faunadb.Client({ secret: token });
  const courses = await client.query(
    q.Let(
      {
        student_ref: q.Ref(q.Collection("Students"), user_id),
        current_class: q.Select(
          ["data", "currentClass"],
          q.Get(q.Var("student_ref"))
        ),
      },
      {
        courses: q.Select(
          ["data"],
          q.Call(
            q.Function("course_ids_and_titles"),
            q.Paginate(
              q.Match(q.Index("courses_for_class"), q.Var("current_class"))
            )
          )
        ),
      }
    )
  );

  return courses;
};

export const registerCourse = async (course_id, user_id, token) => {
  console.log(course_id, user_id);
  const client = new faunadb.Client({ secret: token });
  const response = await client.query(
    q.Call(q.Function("register_course"), [course_id, user_id])
  );
  return response.result.finalResult;
};

export const unregisterCourse = async (course_id, user_id, token) => {
  const client = new faunadb.Client({ secret: token });
  const response = await client.query(
    q.Call(q.Function("unregister_course"), [course_id, user_id])
  );
  return response;
};

export const getCoursePageData = async (course_id, token) => {
  const client = new faunadb.Client({ secret: token });
  const details = await client.query(
    q.Call(q.Function("student_course_page_data"), course_id)
  );
  return details;
};

export const courseCount = async (user_id, token) => {
  const client = new faunadb.Client({ secret: token });
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

export const getRegisteredCourses = async (user_id, token) => {
  const client = new faunadb.Client({ secret: token });
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
