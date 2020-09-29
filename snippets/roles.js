/**
 * Create a Student role with basic read access to
 * the teacher and student collection
 */

CreateRole({
  name: "Student",
  privileges: [
    {
      resource: Collection("Courses"),
      actions: { read: true },
    },
    {
      resource: Collection("Teachers"),
      actions: { read: true },
    },
    {
      resource: Collection("Students"),
      actions: {
        read: Query(
          Lambda("ref", Equals(Identity(), Select(["ref"], Get(Var("ref")))))
        ),
        write: Query(
          Lambda("ref", Equals(Identity(), Select(["ref"], Get(Var("ref")))))
        ),
      },
    },
  ],
  membership: [
    {
      resource: Collection("Students"),
      predicate: Query(
        Lambda(
          "ref",
          Equals(Select(["data", "role"], Get(Var("ref"))), "student")
        )
      ),
    },
  ],
});

/**
 * Updates the student's role
 * with the ability to
 * use the courses_by_class
 * index and call
 * course_registration_data,
 * register_course and
 * unregister_course functions
 */
Let(
  {
    prevPrivileges: Select(["privileges"], Get(Role("Student"))),
    newPrivileges: [
      {
        resource: Index("courses_for_class"),
        actions: { read: true },
      },
      {
        resource: Function("course_ids_and_titles"),
        actions: {
          call: true,
        },
      },
      {
        resource: Function("register_course"),
        actions: {
          call: true,
        },
      },
    ],
  },
  {
    operation: Update(Role("Student"), {
      privileges: Append(Var("prevPrivileges"), Var("newPrivileges")),
    }),
  }
);

// When using the register courses function
Let(
  {
    prevPrivileges: Select(["privileges"], Get(Role("Student"))),
    newPrivileges: [
      {
        resource: Collection("Courses"),
        actions: { write: true },
      },
    ],
  },
  {
    operation: Update(Role("Student"), {
      privileges: Append(Var("prevPrivileges"), Var("newPrivileges")),
    }),
  }
);

// course page data
Let(
  {
    prevPrivileges: Select(["privileges"], Get(Role("Student"))),
    newPrivileges: [
      {
        resource: Function("student_course_page_data"),
        actions: {
          call: true,
        },
      },
      {
        resource: Function("teacher_ids_and_names"),
        actions: {
          call: true,
        },
      },
    ],
  },
  {
    operation: Update(Role("Student"), {
      privileges: Append(Var("prevPrivileges"), Var("newPrivileges")),
    }),
  }
);

// unregister course
Let(
  {
    prevPrivileges: Select(["privileges"], Get(Role("Student"))),
    newPrivileges: [
      {
        resource: Function("unregister_course"),
        actions: {
          call: true,
        },
      },
    ],
  },
  {
    operation: Update(Role("Student"), {
      privileges: Append(Var("prevPrivileges"), Var("newPrivileges")),
    }),
  }
);

/**
 * Create a Teacher role with read access
 * to the students and courses collections
 * and read/write access to the teachers
 * collection
 */
CreateRole({
  name: "Teacher",
  privileges: [
    {
      resource: Collection("Courses"),
      actions: { read: true },
    },
    {
      resource: Collection("Students"),
      actions: { read: true },
    },
    {
      resource: Collection("Teachers"),
      actions: {
        read: true,
        write: Query(
          Lambda("ref", Equals(Identity(), Select(["ref"], Get(Var("ref")))))
        ),
      },
    },
  ],
  membership: [
    {
      resource: Collection("Teachers"),
    },
  ],
});

// read from dashboard
Let(
  {
    prevPrivileges: Select(["privileges"], Get(Role("Teacher"))),
    newPrivileges: [
      {
        resource: Function("teacher_dashboard_details"),
        actions: {
          call: true,
        },
      },
    ],
  },
  {
    operation: Update(Role("Teacher"), {
      privileges: Append(Var("prevPrivileges"), Var("newPrivileges")),
    }),
  }
);

Let(
  {
    prevPrivileges: Select(["privileges"], Get(Role("Teacher"))),
    newPrivileges: [
      {
        resource: Function("get_assigned_courses"),
        actions: {
          call: true,
        },
      },
      {
        resource: Function("course_page_data"),
        actions: {
          call: true,
        },
      },
    ],
  },
  {
    operation: Update(Role("Teacher"), {
      privileges: Append(Var("prevPrivileges"), Var("newPrivileges")),
    }),
  }
);

Let(
  {
    prevPrivileges: Select(["privileges"], Get(Role("Teacher"))),
    newPrivileges: [
      {
        resource: Function("user_ids_and_names"),
        actions: {
          call: true,
        },
      },
    ],
  },
  {
    operation: Update(Role("Teacher"), {
      privileges: Append(Var("prevPrivileges"), Var("newPrivileges")),
    }),
  }
);

/**
 * Create a Manager role with CRUD access to
 * the teacher, courses and student collection
 */

CreateRole({
  name: "Manager",
  privileges: [
    {
      resource: Collection("Courses"),
      actions: { read: true, write: true, create: true, delete: true },
    },
    {
      resource: Collection("Teachers"),
      actions: { read: true, write: true, create: true, delete: true },
    },
    {
      resource: Collection("Students"),
      actions: { read: true, write: true, create: true, delete: true },
    },
    {
      resource: Collection("Classes"),
      actions: { read: true, write: true, create: true, delete: true },
    },
  ],
  membership: [
    {
      resource: Collection("Managers"),
    },
  ],
});

Let(
  {
    prevPrivileges: Select(["privileges"], Get(Role("Manager"))),
    newPrivileges: [
      {
        resource: Function("user_ids_and_names"),
        actions: {
          call: true,
        },
      },
      {
        resource: Function("course_page_data"),
        actions: {
          call: true,
        },
      },
      {
        resource: Function("course_ids_and_titles"),
        actions: {
          call: true,
        },
      },
    ],
  },
  {
    operation: Update(Role("Manager"), {
      privileges: Append(Var("prevPrivileges"), Var("newPrivileges")),
    }),
  }
);

Let(
  {
    prevPrivileges: Select(["privileges"], Get(Role("Manager"))),
    newPrivileges: [
      {
        resource: Function("user_ids_and_names"),
        actions: {
          call: true,
        },
      },
      {
        resource: Function("course_page_data"),
        actions: {
          call: true,
        },
      },
    ],
  },
  {
    operation: Update(Role("Manager"), {
      privileges: Append(Var("prevPrivileges"), Var("newPrivileges")),
    }),
  }
);

Let(
  {
    prevPrivileges: Select(["privileges"], Get(Role("Manager"))),
    newPrivileges: [
      {
        resource: Function("get_teacher_details"),
        actions: {
          call: true,
        },
      },
    ],
  },
  {
    operation: Update(Role("Manager"), {
      privileges: Append(Var("prevPrivileges"), Var("newPrivileges")),
    }),
  }
);

Let(
  {
    prevPrivileges: Select(["privileges"], Get(Role("Manager"))),
    newPrivileges: [
      {
        resource: Function("assign_course"),
        actions: {
          call: true,
        },
      },
    ],
  },
  {
    operation: Update(Role("Manager"), {
      privileges: Append(Var("prevPrivileges"), Var("newPrivileges")),
    }),
  }
);

Let(
  {
    prevPrivileges: Select(["privileges"], Get(Role("Manager"))),
    newPrivileges: [
      {
        resource: Function("cascade_delete_course"),
        actions: {
          call: true,
        },
      },
    ],
  },
  {
    operation: Update(Role("Manager"), {
      privileges: Append(Var("prevPrivileges"), Var("newPrivileges")),
    }),
  }
);