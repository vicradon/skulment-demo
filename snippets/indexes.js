CreateIndex({
  name: "users_by_email",
  source: [
    { collection: Collection("Students") },
    { collection: Collection("Teachers") },
    { collection: Collection("Managers") },
  ],
  terms: [{ field: ["data", "email"] }],
});

CreateIndex({
  name: "courses_by_class",
  source: Collection("Courses"),
  terms: [{ field: ["data", "availableFor"] }],
});
