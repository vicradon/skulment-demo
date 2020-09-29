const faunadb = require("faunadb");
const q = faunadb.query;
const { capitalize } = require("../../services/sharedFunctions");
require("dotenv").config();

export const getCourses = async (secret) => {
  const client = new faunadb.Client({ secret });

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

export const getTeachers = async (secret) => {
  const client = new faunadb.Client({ secret });
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

export const getStudents = async (secret) => {
  const client = new faunadb.Client({ secret });
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

export const fetchCourseAdditionDependencies = async (secret) => {
  const client = new faunadb.Client({ secret });
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

export const getTeacherDetails = async (teacher_id, secret) => {
  const client = new faunadb.Client({ secret });
  const teacher = await client.query(
    q.Let(
      {
        teacher: q.Get(q.Ref(q.Collection("Teachers"), teacher_id)),
        course_refs: q.Select(["data", "courses"], q.Var("teacher"), []),
        courses: q.Map(
          q.Var("course_refs"),
          q.Lambda("ref", {
            id: q.Select(["id"], q.Var("ref")),
            title: q.Select(["data", "title"], q.Get(q.Var("ref"))),
          })
        ),
      },
      {
        firstName: q.Select(["data", "firstName"], q.Var("teacher")),
        lastName: q.Select(["data", "lastName"], q.Var("teacher")),
        email: q.Select(["data", "email"], q.Var("teacher")),
        courses: q.Var("courses"),
      }
    )
  );
  return teacher;
};

export const addCourse = async (data, secret) => {
  const client = new faunadb.Client({ secret });

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

export const addUser = async (user, role, secret) => {
  const client = new faunadb.Client({ secret });
  const collection = `${capitalize(role)}s`;
  return await client.query(
    q.Create(q.Collection(collection), { data: { ...user, courses: [] } })
  );
};

export const studentTeacherCourseCount = async (secret) => {
  const client = new faunadb.Client({ secret });
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

export const deleteCourse = async (course_id, secret) => {
  const client = new faunadb.Client({ secret });
  const response = await client.query(
    q.Call(q.Function("cascade_delete_course"), course_id)
  );
  return response;
};

export const assignCourse = async (course_id, teacher_id, secret) => {
  const client = new faunadb.Client({ secret });
  const response = await client.query(
    q.Let(
      {
        courseRef: q.Ref(q.Collection("Courses"), course_id),
        teacherRef: q.Ref(q.Collection("Teachers"), teacher_id),
        teacher: q.Get(q.Var("teacherRef")),
        courses: q.Select(["data", "courses"], q.Var("teacher"), []),
        teachers: q.Select(["data", "teachers"], q.Get(q.Var("courseRef")), []),
        alreadyAssigned: q.ContainsValue(q.Var("courseRef"), q.Var("courses")),
        updatedCourseArray: q.Append(q.Var("courses"), [q.Var("courseRef")]),
        updatedTeachersArray: q.Append(q.Var("teachers"), [
          q.Select(["ref"], q.Var("teacher")),
        ]),
      },
      q.If(
        q.Not(q.Var("alreadyAssigned")),
        q.Let(
          q.Do([
            q.Update(q.Var("teacherRef"), {
              data: { courses: q.Var("updatedCourseArray") },
            }),
            q.Update(q.Var("courseRef"), {
              data: { teachers: q.Var("updatedTeachersArray") },
            }),
          ]),
          q.Get(q.Var("courseRef"))
        ),
        q.Abort("course already exists")
      )
    )
  );
  return response;
};

export const selectCourseComponentData = async (secret) => {
  const client = new faunadb.Client({ secret });
  const courses = await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("Courses"))),
      q.Lambda("ref", {
        id: q.Select(["id"], q.Var("ref")),
        title: q.Select(["data", "title"], q.Get(q.Var("ref"))),
      })
    )
  );
  return courses.data;
};
