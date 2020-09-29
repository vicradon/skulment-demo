import faunadb, { query as q } from "faunadb";

export const getCoursePageData = async (course_id, token) => {
  const client = new faunadb.Client({ secret: token });
  const details = await client.query(
    q.Call(q.Function("course_page_data"), course_id)
  );
  return details;
};
