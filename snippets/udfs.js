/**
 * Register course
 * Adds a course ref to a student's
 * courses property
 * 
 */
CreateFunction({
  name: "register_course",
  body: Query(
    Lambda(
      ["course_id", "student_id"],
      Let(
        {
          student: Get(Ref(Collection("Students"), Var("student_id"))),
          courseRef: Ref(Collection("Courses"), Var("course_id")),
          studentRef: Ref(Collection("Students"), Var("student_id")),
          courses: Select(["data", "courses"], Var("student"), []),
          registrations: Select(
            ["data", "registrations"],
            Get(Var("courseRef")),
            []
          ),
          alreadyRegistered: ContainsValue(Var("courseRef"), Var("courses")),
          updatedCourseArray: Append(Var("courses"), [Var("courseRef")]),
          updatedRegistrations: Append(Var("registrations"), [
            Select(["ref"], Var("student")),
          ]),
        },
        {
          result: If(
            Not(Var("alreadyRegistered")),
            Let(
              {
                studentCoursesUpdate: Update(Var("studentRef"), {
                  data: { courses: Var("updatedCourseArray") },
                }),
                courseStudentsUpdate: Update(Var("courseRef"), {
                  data: { registrations: Var("updatedRegistrations") },
                }),
              },
              { finalResult: Get(Var("studentRef")) }
            ),
            Abort("course already exists")
          ),
        }
      )
    )
  ),
});

/**
 * Get data for course registration
 *
 * @param {string} student_id - faunaid
 * @returns id - faunaid
 * @returns title - string
 */
CreateFunction({
  name: "get_registered_courses",
  body: Query(
    Lambda(
      "student_id",
      Map(
        Paginate(
          Match(
            Index("courses_by_class"),
            Select(
              ["data", "currentClass"],
              Get(Ref(Collection("Students"), Var("student_id")))
            )
          )
        ),
        Lambda(
          "ref",
          Let(
            { course: Get(Var("ref")) },
            {
              id: Select(["ref", "id"], Var("course")),
              title: Select(["data", "title"], Var("course")),
            }
          )
        )
      )
    )
  ),
});

/**
 * Get data for course page
 *
 * @param {string} course_id
 * @returns {string} title, creditLoad, courseCode
 * @returns {(string|Array)} title, creditLoad, courseCode
 */
CreateFunction({
  name: "course_page_data",
  body: Query(
    Lambda(
      "course_id",
      Let(
        {
          course: Get(Ref(Collection("Courses"), Var("course_id"))),
          teacher_refs: Select(["data", "teachers"], Var("course")),
          teachers: Call(
            Function("teacher_ids_and_names"),
            Var("teacher_refs")
          ),
        },
        {
          title: Select(["data", "title"], Var("course")),
          creditLoad: Select(["data", "creditLoad"], Var("course")),
          courseCode: Select(["data", "code"], Var("course")),
          teachers: Var("teachers"),
        }
      )
    )
  ),
});

/**
 * Teacher ids and names
 * returns the ids and names of an array of user refs
 */
CreateFunction({
  name: "user_ids_and_names",
  body: Query(
    Lambda(
      "array",
      Map(
        Var("array"),
        Lambda(
          "ref",
          Let(
            {
              user: Get(Var("ref")),
              firstName: Select(["data", "firstName"], Var("user")),
              lastName: Select(["data", "lastName"], Var("user")),
            },
            {
              id: Select(["ref", "id"], Var("user")),
              name: Concat([Var("firstName"), Var("lastName")], " "),
            }
          )
        )
      )
    )
  ),
});

/**
 * Unregister course
 * Removes a course's ref from a student's
 * courses property
 *
 * @returns updatedCourseArray
 */
CreateFunction({
  name: "unregister_course",
  body: Query(
    Lambda(
      ["course_id", "student_id"],
      Let(
        {
          studentRef: Ref(Collection("Students"), Var("student_id")),
          courseRef: Ref(Collection("Courses"), Var("course_id")),
          courses: Select(["data", "courses"], Get(Var("studentRef")), []),
          registrations: Select(
            ["data", "registrations"],
            Get(Var("courseRef")),
            []
          ),
          updatedCourseArray: Filter(
            Var("courses"),
            Lambda("ref", Not(Equals(Var("ref"), Var("courseRef"))))
          ),
          updatedRegistrationsArray: Filter(
            Var("registrations"),
            Lambda("ref", Not(Equals(Var("ref"), Var("studentRef"))))
          ),
        },
        {
          studentUpdateSideEffect: Update(Var("studentRef"), {
            data: { courses: Var("updatedCourseArray") },
          }),
          courseUpdateSideEffect: Update(Var("courseRef"), {
            data: { registrations: Var("updatedRegistrationsArray") },
          }),
        }
      )
    )
  ),
});


/**
 * Returns the ids and titles of an array of course refs
 */
CreateFunction({
  name: "course_ids_and_titles",
  body: Query(
    Lambda(
      "array",
      Map(
        Var("array"),
        Lambda(
          "ref",
          Let(
            {
              course: Get(Var("ref")),
            },
            {
              id: Select(["ref", "id"], Var("course")),
              title: Select(["data", "title"], Var("course")),
            }
          )
        )
      )
    )
  ),
});

/**
 * Gets a student's full details
 */
CreateFunction({
  name: "get_student_details",
  body: Query(
    Lambda(
      "student_id",
      Let(
        {
          student: Get(Ref(Collection("Students"), Var("student_id"))),
          courses: Call(
            Function("course_ids_and_titles"),
            Select(["data", "courses"], Var("student"))
          ),
        },
        {
          id: Select(["ref", "id"], Var("student")),
          firstName: Select(["data", "firstName"], Var("student")),
          lastName: Select(["data", "lastName"], Var("student")),
          email: Select(["data", "email"], Var("student")),
          currentClass: Select(["data", "currentClass"], Var("student")),
          courses: Var("courses"),
        }
      )
    )
  ),
});

/**
 * Get a teacher's full details
 */
CreateFunction({
  name: "get_teacher_details",
  body: Query(
    Lambda(
      "teacher_id",
      Let(
        {
          teacher: Get(Ref(Collection("Teachers"), Var("teacher_id"))),
          course_refs: Select(["data", "courses"], Var("teacher"), []),
          courses: Call(Function("course_ids_and_titles"), Var("course_refs")),
        },
        {
          id: Select(["ref", "id"], Var("teacher")),
          firstName: Select(["data", "firstName"], Var("teacher")),
          lastName: Select(["data", "lastName"], Var("teacher")),
          email: Select(["data", "email"], Var("teacher")),
          courses: Var("courses"),
        }
      )
    )
  ),
});

/**
 * Get teacher dashboard details
 */
CreateFunction({
  name: "teacher_dashboard_details",
  body: Query(
    Lambda(
      "teacher_id",
      Let(
        {
          teacher: Get(Ref(Collection("Teachers"), Var("teacher_id"))),
          course_refs: Select(["data", "courses"], Var("teacher"), []),
          course_count: Count(Var("course_refs")),
          student_count: Reduce(
            Lambda(
              ["acc", "ref"],
              Add(
                Var("acc"),
                Count(Select(["data", "registrations"], Get(Var("ref")), []))
              )
            ),
            0,
            Var("course_refs")
          ),
        },
        {
          course_count: Var("course_count"),
          student_count: Var("student_count"),
        }
      )
    )
  ),
});

/**
 * Assign course to teacher
 */
CreateFunction({
  name: "assign_course",
  body: Query(
    Lambda(
      ["course_id", "teacher_id"],
      Let(
        {
          teacher: Get(Ref(Collection("Teachers"), Var("teacher_id"))),
          courseRef: Ref(Collection("Courses"), Var("course_id")),
          teacherRef: Ref(Collection("Teachers"), Var("teacher_id")),
          courses: Select(["data", "courses"], Var("teacher"), []),
          teachers: Select(["data", "teachers"], Get(Var("courseRef")), []),
          alreadyAssigned: ContainsValue(Var("courseRef"), Var("courses")),
          updatedCourseArray: Append(Var("courses"), [Var("courseRef")]),
          updatedTeachers: Append(Var("teachers"), [
            Select(["ref"], Var("teacher")),
          ]),
        },
        {
          result: If(
            Not(Var("alreadyAssigned")),
            Let(
              {
                teacherCoursesUpdate: Update(Var("teacherRef"), {
                  data: { courses: Var("updatedCourseArray") },
                }),
                courseTeachersUpdate: Update(Var("courseRef"), {
                  data: { teachers: Var("updatedTeachers") },
                }),
              },
              { finalResult: Get(Var("teacherRef")) }
            ),
            Abort("course already exists")
          ),
        }
      )
    )
  ),
});

/**
 * Unassign course from teacher
 */
CreateFunction({
  name: "unassign_course",
  body: Query(
    Lambda(
      ["course_id", "teacher_id"],
      Let(
        {
          teacherRef: Ref(Collection("Teachers"), Var("teacher_id")),
          courseRef: Ref(Collection("Courses"), Var("course_id")),

          courses: Select(["data", "courses"], Get(Var("teacherRef")), []),
          teachers: Select(["data", "teachers"], Get(Var("courseRef")), []),

          updatedCourseArray: Filter(
            Var("courses"),
            Lambda("ref", Not(Equals(Var("ref"), Var("courseRef"))))
          ),
          updatedTeacherArray: Filter(
            Var("teachers"),
            Lambda("ref", Not(Equals(Var("ref"), Var("teacherRef"))))
          ),
        },
        {
          teacherUpdateSideEffect: Update(Var("teacherRef"), {
            data: { courses: Var("updatedCourseArray") },
          }),
          courseUpdateSideEffect: Update(Var("courseRef"), {
            data: { teachers: Var("updatedTeacherArray") },
          }),
        }
      )
    )
  ),
});


/**
 * returns the names and ids of a teacher
 */
CreateFunction({
  name: "teacher_ids_and_names",
  body: Query(
    Lambda(
      "array",
      Map(
        Var("array"),
        Lambda(
          "ref",
          Let(
            {
              teacher: Get(Var("ref")),
              firstName: Select(["data", "firstName"], Var("teacher")),
              lastName: Select(["data", "lastName"], Var("teacher")),
            },
            {
              id: Select(["ref", "id"], Var("teacher")),
              name: Concat(Var("firstName"), Var("lastName")),
            }
          )
        )
      )
    )
  ),
});


/**
 * student_course_page_data
 * @param {string} course_id - string the id of the course
 * @returns {string} title - title of the course
 * @returns {string} creditLoad - creditLoad of course
 * @returns {string} courseCode - courseCode of course
 * @returns {(string|Array)} teachers - names and ids of teachers handling the course
 */
CreateFunction({
  name: "student_course_page_data",
  body: Query(
    Lambda(
      "course_id",
      Let(
        {
          course: Get(Ref(Collection("Courses"), Var("course_id"))),
          teacher_refs: Select(["data", "teachers"], Var("course"), []),
          teachers: Call(
            Function("teacher_ids_and_names"),
            Var("teacher_refs")
          ),
        },
        {
          title: Select(["data", "title"], Var("course")),
          creditLoad: Select(["data", "creditLoad"], Var("course")),
          courseCode: Select(["data", "code"], Var("course")),
          teachers: Var("teachers"),
        }
      )
    )
  ),
});

/**
 * Teacher dashboard details
 * @returns course_count: count of the courses assigned to a teacher
 * @returns student_count: number of students offering their course
 */
CreateFunction({
  name: "teacher_dashboard_details",
  body: Query(
    Lambda(
      "teacher_id",
      Let(
        {
          teacher: Get(Ref(Collection("Teachers"), Var("teacher_id"))),
          course_refs: Select(["data", "courses"], Var("teacher"), []),
          course_count: Count(Var("course_refs")),
          student_count: Reduce(
            Lambda(
              ["acc", "ref"],
              Add(
                Var("acc"),
                Count(Select(["data", "registrations"], Get(Var("ref")), []))
              )
            ),
            0,
            Var("course_refs")
          ),
        },
        {
          course_count: Var("course_count"),
          student_count: Var("student_count"),
        }
      )
    )
  ),
});


/**
 * Get the courses assgined to 
 * a teacher
 */
CreateFunction({
  name: "get_assigned_courses",
  body: Query(
    Lambda(
      "teacher_id",
      Map(
        Select(
          ["data", "courses"],
          Get(Ref(Collection("Teachers"), Var("teacher_id")))
        ),
        Lambda(
          "ref",
          Let(
            { course: Get(Var("ref")) },
            {
              id: Select(["ref", "id"], Var("course")),
              title: Select(["data", "title"], Var("course")),
              code: Select(["data", "code"], Var("course")),
              student_count: Count(
                Select(["data", "registrations"], Var("course"), [])
              ),
            }
          )
        )
      )
    )
  ),
});

/**
 * User ids and names
 * retunrs ids and names of 
 * the passed in array 
 */
CreateFunction({
  name: "users_ids_and_names",
  body: Query(
    Lambda(
      "array",
      Map(
        Var("array"),
        Lambda(
          "id",
          Let(
            {
              user: Get(Ref(Collection("Users"), Var("id"))),
              firstName: Select(["data", "firstName"], Var("user")),
              lastName: Select(["data", "lastName"], Var("user")),
            },
            {
              id: Select(["ref", "id"], Var("user")),
              name: Concat(Var("firstName"), Var("lastName")),
            }
          )
        )
      )
    )
  ),
});


/**
 * Returns data consumed by the 
 * course page
 */
CreateFunction({
  name: "course_page_data",
  body: Query(
    Lambda(
      "course_id",
      Let(
        {
          course: Get(Ref(Collection("Courses"), Var("course_id"))),
          student_refs: Select(["data", "registrations"], Var("course"), []),
          teacher_refs: Select(["data", "teachers"], Var("course"), []),
          students: Call(Function("users_ids_and_names"), Var("student_refs")),
          teachers: Call(Function("users_ids_and_names"), Var("teacher_refs")),
        },
        {
          title: Select(["data", "title"], Var("course")),
          creditLoad: Select(["data", "creditLoad"], Var("course")),
          code: Select(["data", "code"], Var("course")),
          students: Var("students"),
          teachers: Var("teachers"),
        }
      )
    )
  ),
});

/**
 * Assigns a course to a teacher
 */
CreateFunction({
  name: "assign_course",
  body: Query(
    Lambda(
      ["course_id", "teacher_id"],
      Let(
        {
          teacher: Get(Ref(Collection("Teachers"), Var("teacher_id"))),
          courseRef: Ref(Collection("Courses"), Var("course_id")),
          teacherRef: Ref(Collection("Teachers"), Var("teacher_id")),
          courses: Select(["data", "courses"], Var("teacher"), []),
          teachers: Select(["data", "teachers"], Get(Var("courseRef")), []),
          alreadyAssigned: ContainsValue(Var("courseRef"), Var("courses")),
          updatedCourseArray: Append(Var("courses"), [Var("courseRef")]),
          updatedTeachers: Append(Var("teachers"), [
            Select(["ref"], Var("teacher")),
          ]),
        },
        {
          result: If(
            Not(Var("alreadyAssigned")),
            Let(
              {
                teacherCoursesUpdate: Update(Var("teacherRef"), {
                  data: { courses: Var("updatedCourseArray") },
                }),
                courseTeachersUpdate: Update(Var("courseRef"), {
                  data: { teachers: Var("updatedTeachers") },
                }),
              },
              { finalResult: Get(Var("teacherRef")) }
            ),
            Abort("course already assigned")
          ),
        }
      )
    )
  ),
});

/**
 * Cascade delete a course
 */
CreateFunction({
  name: "cascade_delete_course",
  body: Query(
    Lambda(
      "course_ref",
      Let(
        {
          course: Get(Var("course_ref")),
          registrations: Select(["data", "registrations"], Var("course"), []),
          teachers: Select(["data", "teachers"], Var("course"), []),
          removeRefFromTeachers: Map(
            Var("teachers"),
            Lambda(
              "teacher_ref",
              Let(
                {
                  teacher: Get(Var("teacher_ref")),
                  courses: Select(["data", "courses"], Var("teacher"), []),
                  updated_courses: Filter(
                    Var("courses"),
                    Lambda("ref", Not(Equals(Var("ref"), Var("course_ref"))))
                  )
                },
                Update(Var("teacher_ref"), {
                  data: { courses: Var("updated_courses") }
                })
              )
            )
          ),
          removeRefFromStudents: Map(
            Var("registrations"),
            Lambda(
              "student_ref",
              Let(
                {
                  student: Get(Var("student_ref")),
                  courses: Select(["data", "courses"], Var("student")),
                  updated_courses: Filter(
                    Var("courses"),
                    Lambda("ref", Not(Equals(Var("ref"), Var("course_ref"))))
                  )
                },
                Update(Var("student_ref"), {
                  data: { courses: Var("updated_courses") }
                })
              )
            )
          ),
          deleteCourse: Delete(Var("course_ref"))
        },
        { status: "success" }
      )
    )
  )
});