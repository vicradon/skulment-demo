import axios from "axios";
const faunadb = require("faunadb");
const q = faunadb.query;
const { capitalize } = require("../../services/sharedFunctions");
require("dotenv").config();

export const getCourses = async (token) => {
  const client = new faunadb.Client({
    secret: token,
  });

  const courses = await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("Courses"))),
      q.Lambda(
        "ref",
        q.Let(
          {
            course: q.Get(q.Var("ref")),
            id: q.Select(["ref", "id"], q.Var("course")),
            title: q.Select(["data", "title"], q.Var("course")),
            creditLoad: q.Select(["data", "creditLoad"], q.Var("course")),
            code: q.Select(["data", "code"], q.Var("course")),
            class_id: q.Select(["data", "availableFor", "id"], q.Var("course")),
            class_name: q.Select(
              ["data", "name"],
              q.Get(q.Ref(q.Collection("Classes"), q.Var("class_id")))
            ),
          },
          {
            id: q.Var("id"),
            title: q.Var("title"),
            creditLoad: q.Var("creditLoad"),
            code: q.Var("code"),
            availableFor: q.Var("class_name"),
          }
        )
      )
    )
  );

  return courses.data;
};

export const getTeachers = async (token) => {
  const client = new faunadb.Client({
    secret: token,
  });
  const teachers = await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("Teachers"))),
      q.Lambda(
        "ref",
        q.Let(
          {
            teacher: q.Get(q.Var("ref")),
            id: q.Select(["ref", "id"], q.Var("teacher")),
            firstName: q.Select(["data", "firstName"], q.Var("teacher")),
            lastName: q.Select(["data", "lastName"], q.Var("teacher")),
            email: q.Select(["data", "email"], q.Var("teacher")),
          },
          {
            id: q.Var("id"),
            firstName: q.Var("firstName"),
            lastName: q.Var("lastName"),
            email: q.Var("email"),
          }
        )
      )
    )
  );
  return teachers.data;
};

export const getStudents = async (token) => {
  const client = new faunadb.Client({
    secret: token,
  });
  const students = await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("Students"))),
      q.Lambda(
        "ref",
        q.Let(
          {
            student: q.Get(q.Var("ref")),
            firstName: q.Select(["data", "firstName"], q.Var("student")),
            lastName: q.Select(["data", "lastName"], q.Var("student")),
            currentClassRef: q.Select(
              ["data", "currentClass"],
              q.Var("student"),
              null
            ),
            currentClass: q.If(
              q.Not(q.IsNull(q.Var("currentClassRef"))),
              q.Select(["data", "name"], q.Get(q.Var("currentClassRef"))),
              "Not assigned"
            ),
            courseCount: q.Count(
              q.Select(["data", "courses"], q.Var("student"))
            ),
            id: q.Select(["ref", "id"], q.Var("student")),
          },
          {
            id: q.Var("id"),
            firstName: q.Var("firstName"),
            lastName: q.Var("lastName"),
            currentClass: q.Var("currentClass"),
            courseCount: q.Var("courseCount"),
          }
        )
      )
    )
  );
  return students.data;
};

export const fetchCourseAdditionDependencies = async (token) => {
  const client = new faunadb.Client({
    secret: token,
  });
  const teachersAndClasses = await client.query(
    q.Let(
      {
        teachers: q.Call(
          q.Function("user_ids_and_names"),
          q.Paginate(q.Documents(q.Collection("Teachers")))
        ),
        classes: q.Map(
          q.Paginate(q.Documents(q.Collection("Classes"))),
          q.Lambda(
            "ref",
            q.Let(
              {
                class: q.Get(q.Var("ref")),
                id: q.Select(["ref", "id"], q.Var("class")),
                name: q.Select(["data", "name"], q.Var("class")),
              },
              {
                id: q.Var("id"),
                name: q.Var("name"),
              }
            )
          )
        ),
      },
      {
        teachers: q.Select(["data"], q.Var("teachers")),
        classes: q.Select(["data"], q.Var("classes")),
      }
    )
  );
  return teachersAndClasses;
};

export const getTeacherDetails = async (teacher_id, token) => {
  const client = new faunadb.Client({
    secret: token,
  });
  const teacher = await client.query(
    q.Call(q.Function("get_teacher_details"), teacher_id)
  );
  return teacher;
};

export const getCourseDetails = async (course_id, token) => {
  const client = new faunadb.Client({
    secret: token,
  });
  const course = await client.query(
    q.Let(
      {
        course: q.Get(q.Ref(q.Collection("Courses"), course_id)),
        teachers: q.Call(
          q.Function("teacher_ids_and_names"),
          q.Select(["data", "teachers"], q.Var("course"), [])
        ),
        availableFor: q.Get(
          q.Ref(
            q.Collection("Classes"),
            q.Select(["data", "availableFor"], q.Var("course"))
          )
        ),
      },
      {
        id: q.Select(["ref", "id"], q.Var("course")),
        title: q.Select(["data", "title"], q.Var("course")),
        code: q.Select(["data", "code"], q.Var("course")),
        creditLoad: q.Select(["data", "creditLoad"], q.Var("course")),
        availableFor: q.Select(["data", "name"], q.Var("availableFor")),
        enrolment_count: q.Count(
          q.Select(["data", "registrations"], q.Var("course"), [])
        ),
        teachers: q.Var("teachers"),
      }
    )
  );
  return course;
};

export const addCourse = async (data, token) => {
  const client = new faunadb.Client({
    secret: token,
  });

  const { teacher, availableFor, ...rest } = data;
  const course = await client.query(
    q.Create(q.Collection("Courses"), {
      data: {
        ...rest,
        availableFor: q.Ref(q.Collection("Classes"), availableFor),
        teachers: [q.Ref(q.Collection("Teachers"), teacher)],
        registrations: [],
      },
    })
  );
  return course;
};

export const unAssginCourse = async (token, data) => {
  const client = new faunadb.Client({
    secret: token,
  });
  const course = await client.query(
    q.Create(q.Collection("Courses"), { data })
  );
  return course;
};

export const assginCourse = async (data, token) => {
  const client = new faunadb.Client({
    secret: token,
  });
  const course = await client.query(
    q.Create(q.Collection("Courses"), { data })
  );
  return course;
};

export const fetchUserAdditionDependencies = async (role, token) => {
  const client = new faunadb.Client({
    secret: token,
  });
  const details = await client.query(
    q.Let(
      {
        classes: q.If(
          q.Equals(role, "student"),
          q.Call(q.Function("class_ids_and_names")),
          []
        ),
        courses: q.If(
          q.Equals(role, "teacher"),
          q.Call(
            q.Function("course_ids_and_titles"),
            q.Paginate(q.Documents(q.Collection("Courses")))
          ),
          []
        ),
      },
      {
        classes: q.Select(["data"], q.Var("classes")),
        courses: q.Var("courses"),
      }
    )
  );
  return details;
};

export const addUser = async (user, role, token) => {
  const client = new faunadb.Client({
    secret: token,
  });
  const collection = `${capitalize(role)}s`;
  return await client.query(
    q.Create(q.Collection(collection), { data: { ...user, role, courses: [] } })
  );
};

export const studentTeacherCourseCount = async (token) => {
  const client = new faunadb.Client({
    secret: token,
  });
  const count = await client.query(
    q.Let(
      {
        student_count: q.Count(q.Documents(q.Collection("Students"))),
        teacher_count: q.Count(q.Documents(q.Collection("Teachers"))),
        course_count: q.Count(q.Documents(q.Collection("Courses"))),
      },
      {
        student_count: q.Var("student_count"),
        teacher_count: q.Var("teacher_count"),
        course_count: q.Var("course_count"),
      }
    )
  );
  return count;
};

export const deleteUser = async (user_id, email, collection, token) => {
  const client = new faunadb.Client({
    secret: token,
  });
  const response = await client.query(
    q.Let(
      {
        deletionOfUserInCollection: q.Delete(
          q.Ref(q.Collection(collection), user_id)
        ),
        user_in_users_collection: q.Match(q.Index("users_by_email"), email),
        deletionOfUserInUsers: q.Delete(q.Var("user_in_users_collection")),
      },
      {
        result: "successfully deleted user",
      }
    )
  );
  return response;
};

export const deleteCourse = async (course_id, token) => {
  const client = new faunadb.Client({
    secret: token,
  });
  const response = await client.query(
    q.Call(
      q.Function("cascade_delete_course"),
      q.Ref(q.Collection("courses"), course_id)
    )
  );
  return response;
};

export const assignCourse = async (course_id, teacher_id, token) => {
  const client = new faunadb.Client({
    secret: token,
  });
  const response = await client.query(
    q.Call(q.Function("assign_course"), [course_id, teacher_id])
  );
  return {
    id: response.result.finalResult.ref.id,
    title: response.result.finalResult.data.title,
  };
};

export const selectCourseComponentData = async (token) => {
  const client = new faunadb.Client({
    secret: token,
  });
  const courses = await client.query(
    q.Call(
      q.Function("course_ids_and_titles"),
      q.Paginate(q.Documents(q.Collection("Courses")))
    )
  );
  return courses.data;
};

/*
Create(Collection('Students'), {
  data: {
    firstName: "student2",
    lastName: "Db",
    email: "student2@skulment.edu",
    role: "student",
    courses: [],
    currentClass: ""
  }
})
*/
