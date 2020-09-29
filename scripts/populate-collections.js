const faker = require("faker");
const faunadb = require("faunadb");
const q = require("faunadb").query;
require("dotenv").config();

const client = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_SECRET,
});

const availableClasses = () => {
  return Array(6)
    .fill(0)
    .map((_, index) => {
      return {
        name: `Grade ${index + 7}`,
        courses: [],
      };
    });
};

const storeClassesOnFauna = async (classes) => {
  const result = await client.query(
    q.Map(
      classes,
      q.Lambda(
        "classItem",
        q.Create(q.Collection("Classes"), {
          data: q.Var("classItem"),
        })
      )
    )
  );
  return result;
};

const generateRandomCourses = (limit = 50, classObjects) => {
  return Array(limit)
    .fill(1)
    .map((_) => {
      const title = `${faker.random.word()} ${faker.random.word()}`;
      return {
        title,
        description: faker.lorem.sentence(),
        teachers: [],
        registrations: [],
        code: `${title.slice(0, 3).toUpperCase()} ${faker.random.number({
          min: 100,
          max: 600,
        })}`,
        availableFor:
          classObjects[
            faker.random.number({
              min: 0,
              max: 5,
            })
          ].ref,
        creditLoad: faker.random.number({
          min: 1,
          max: 5,
        }),
      };
    });
};

const storeCoursesOnFauna = async (courses) => {
  const generatedCourses = await client.query(
    q.Map(
      courses,
      q.Lambda(
        "course",
        q.Select(
          ["course"],
          q.Let(
            {
              course: q.Create(q.Collection("Courses"), {
                data: q.Var("course"),
              }),
              availableClass: q.Select(
                ["data", "availableFor"],
                q.Var("course")
              ),
              previousCourses: q.Select(
                ["data", "courses"],
                q.Get(q.Var("availableClass")),
                []
              ),
              courseRef: q.Select(["ref"], q.Var("course")),
              updateClassWithCourse: q.Update(q.Var("availableClass"), {
                data: {
                  courses: q.Append(q.Var("previousCourses"), [
                    q.Var("courseRef"),
                  ]),
                },
              }),
            },
            {
              course: q.Var("course"),
            }
          )
        )
      )
    )
  );
  return generatedCourses;
};

const generateRandomUsers = (userType, limit = 50, dependentObjects) => {
  return Array(limit)
    .fill(1)
    .map((_) => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const classesRandomNumber = faker.random.number({
        min: 0,
        max: dependentObjects.classes.length - 1,
      });
      const coursesRandomNumber = faker.random.number({
        min: 0,
        max: dependentObjects.courses.length - 1,
      });
      const currentClass = dependentObjects.classes[classesRandomNumber].ref;
      const course = dependentObjects.courses[coursesRandomNumber].ref;
      const base = {
        firstName: firstName,
        lastName: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@skulment.edu`,
      };
      if (userType === "student")
        return {
          data: { ...base, currentClass, courses: [course] },
          role: "student",
        };
      if (userType === "teacher")
        return { data: { ...base, courses: [course] }, role: "teacher" };
      return { data: base, role: "manager" };
    });
};

const storeUsersOnFauna = async (users) => {
  await client.query(
    q.Map(
      users,
      q.Lambda(
        "user",
        q.Select(
          ["user"],
          q.Let(
            {
              role: q.Select(["role"], q.Var("user")),
              user: q.Create(
                q.Collection(q.Concat([q.TitleCase(q.Var("role")), "s"], "")),
                {
                  data: q.Select(["data"], q.Var("user")),
                }
              ),
              user_ref: q.Select(["ref"], q.Var("user")),

              notManager: q.If(
                q.Not(q.Equals(q.Var("role"), "manager")),
                q.Let(
                  {
                    course_ref: q.Select(
                      ["data", "courses", 0],
                      q.Get(q.Var("user_ref"))
                    ),
                    course: q.Get(q.Var("course_ref")),

                    target_array_name: q.If(
                      q.Equals(q.Var("role"), "teacher"),
                      "teachers",
                      "registrations"
                    ),
                    previous_items: q.Select(
                      ["data", q.Var("target_array_name")],
                      q.Var("course"),
                      []
                    ),

                    updateTargetArrayWithUser: q.If(
                      q.Equals(q.Var("role"), "teacher"),
                      q.Update(q.Var("course_ref"), {
                        data: {
                          teachers: q.Append(q.Var("previous_items"), [
                            q.Var("user_ref"),
                          ]),
                        },
                      }),
                      q.Update(q.Var("course_ref"), {
                        data: {
                          registrations: q.Append(q.Var("previous_items"), [
                            q.Var("user_ref"),
                          ]),
                        },
                      })
                    ),
                  },
                  {}
                ),
                ""
              ),
            },
            {
              user: q.Var("user"),
            }
          )
        )
      )
    )
  );
};

storeClassesOnFauna(availableClasses())
  .then((classObjects) => {
    console.log("Successfully created classes on faunadb");

    const randomCourses = generateRandomCourses(20, classObjects);

    storeCoursesOnFauna(randomCourses)
      .then((courseObjects) => {
        console.log("Successfully created courses on faunadb");
        const randomUsers = [
          ...generateRandomUsers("student", 49, {
            classes: classObjects,
            courses: courseObjects,
          }),
          ...generateRandomUsers("teacher", 9, {
            classes: classObjects,
            courses: courseObjects,
          }),
          ...generateRandomUsers("manager", 1, {
            classes: classObjects,
            courses: courseObjects,
          }),
          {
            data: {
              firstName: "Student",
              lastName: "Default",
              email: "student1@skulment.edu",
              currentClass: classObjects[0].ref,
              courses: [courseObjects[0].ref],
            },
            role: "student",
          },
          {
            data: {
              firstName: "Teacher",
              lastName: "Default",
              email: "teacher1@skulment.edu",
              courses: [courseObjects[0].ref],
            },
            role: "teacher",
          },
          {
            data: {
              firstName: "Manager",
              lastName: "Default",
              email: "manager1@skulment.edu",
            },
            role: "manager",
          },
        ];

        storeUsersOnFauna(randomUsers)
          .then(() => console.log("Successfully created users on faunadb"))
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  })
  .catch((error) => console.error(error));
