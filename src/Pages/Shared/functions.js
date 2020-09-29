import { Client, query as q } from "faunadb";

export const getCoursePageData = async (course_id, secret) => {
  const client = new Client({ secret: secret });
  const details = await client.query(
    q.Let(
      {
        course: q.Get(q.Ref(q.Collection("Courses"), course_id)),
        availableFor: q.Select(
          ["data", "name"],
          q.Get(q.Select(["data", "availableFor"], q.Var("course")))
        ),
        student_refs: q.Select(["data", "registrations"], q.Var("course"), []),
        teacher_refs: q.Select(["data", "teachers"], q.Var("course"), []),
        students: q.Map(
          q.Var("student_refs"),
          q.Lambda(
            "ref",
            q.Let(
              {
                user: q.Get(q.Var("ref")),
                firstName: q.Select(["data", "firstName"], q.Var("user")),
                lastName: q.Select(["data", "lastName"], q.Var("user")),
              },
              {
                id: q.Select(["ref", "id"], q.Var("user")),
                name: q.Concat([q.Var("firstName"), q.Var("lastName")], " "),
              }
            )
          )
        ),
        teachers: q.Map(
          q.Var("teacher_refs"),
          q.Lambda(
            "ref",
            q.Let(
              {
                user: q.Get(q.Var("ref")),
                firstName: q.Select(["data", "firstName"], q.Var("user")),
                lastName: q.Select(["data", "lastName"], q.Var("user")),
              },
              {
                id: q.Select(["ref", "id"], q.Var("user")),
                name: q.Concat([q.Var("firstName"), q.Var("lastName")], " "),
              }
            )
          )
        ),
      },
      {
        title: q.Select(["data", "title"], q.Var("course")),
        creditLoad: q.Select(["data", "creditLoad"], q.Var("course")),
        code: q.Select(["data", "code"], q.Var("course")),
        availableFor: q.Var("availableFor"),
        students: q.Var("students"),
        teachers: q.Var("teachers"),
      }
    )
  );
  return details;
};
