import faunadb, { query as q } from "faunadb";

export const teacherDashboardDetails = async (teacher_id, token) => {
  const client = new faunadb.Client({ secret: token });
  const details = await client.query(
    q.Call(q.Function("teacher_dashboard_details"), teacher_id)
  );
  return details;
};


export const getAssignedCourses = async (teacher_id, token) => {
  const client = new faunadb.Client({ secret: token });
  const details = await client.query(
    q.Call(q.Function("get_assigned_courses"), teacher_id)
  );
  return details;
};

