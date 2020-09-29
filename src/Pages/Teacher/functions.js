import faunadb, { query as q } from "faunadb";

export const teacherDashboardDetails = async (teacher_id, secret) => {
  const client = new faunadb.Client({ secret: secret });
  const details = await client.query(
    q.Let(
      {
        teacher: q.Get(q.Ref(q.Collection("Teachers"), teacher_id)),
        course_refs: q.Select(["data", "courses"], q.Var("teacher"), []),
        course_count: q.Count(q.Var("course_refs")),
        student_count: q.Count(
          q.Match(
            q.Index("students_taking_course_by_teacher"),
            q.Ref(q.Collection("Teachers"), teacher_id)
          )
        ),
      },
      {
        course_count: q.Var("course_count"),
        student_count: q.Var("student_count"),
      }
    )
  );
  return details;
};

export const getAssignedCourses = async (teacher_id, secret) => {
  const client = new faunadb.Client({ secret: secret });
  const details = await client.query(
    q.Map(
      q.Select(
        ["data", "courses"],
        q.Get(q.Ref(q.Collection("Teachers"), teacher_id))
      ),
      q.Lambda(
        "ref",
        q.Let(
          { course: q.Get(q.Var("ref")) },
          {
            id: q.Select(["ref", "id"], q.Var("course")),
            title: q.Select(["data", "title"], q.Var("course")),
            code: q.Select(["data", "code"], q.Var("course")),
            student_count: q.Count(
              q.Select(["data", "registrations"], q.Var("course"), [])
            ),
          }
        )
      )
    )
  );
  return details;
};
