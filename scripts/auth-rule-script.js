async function loginFaunaOnUserLogin(user, context, callback) {
  const { Client, query: q } = require("faunadb@2.11.1"); // from Auth0 registry. See https://auth0.com/docs/rules
  const SERVER_SECRET = ""; // add your database’s server secret here

  const client = new Client({
    secret: SERVER_SECRET,
  });
  try {
    /**
     * Check if the user making the auth request is in a
     * collection and return the users’s document
     */
    let user_from_fauna;
    try {
      user_from_fauna = await client.query(
        q.Get(q.Match(q.Index("users_by_email"), user.email))
      );
    } catch (error) {
      throw new Error("No user with this email exists");
    }

    const role = user_from_fauna.data[0].data.role;
    const collection = `${role[0].toUpperCase()}${role.substr(1)}s`;

    const credential = await client.query(
      q.Let(
        { user: q.Match(q.Index(index), user.email) }, // Set user variable
        q.If(
          // condition
          q.Exists(q.Var("user")), // Check if the User exists
          // if true...
          q.Create(q.Tokens(null), {
            instance: q.Select("ref", q.Get(q.Var("user"))),
          }),
          // else...
          q.Let(
            {
              newUser: q.Create(q.Collection(collection), {
                data: { ...user_from_fauna.data[0].data },
              }),
              token: q.Create(q.Tokens(null), {
                instance: q.Select("ref", q.Var("newUser")),
              }),
            },
            {
              instance: q.Select(["ref"], q.Var("newUser")),
              secret: q.Select(["secret"], q.Var("token")),
            }
          )
        )
      )
    );

    /**
     * We attach the token and user_id to the user_metadata
     * so our app can use them to perform DB queries
     */
    user.user_metadata = {
      role: user_from_fauna.data[0].data.role,

      token: credential.secret,

      user_id: credential.instance.id,
    };

    /**
     * custom claim section that would allow
     * us to attach the token, userid and
     * a few other details to the object
     * returned by Auth0.
     * The namespace variable could be any url.
     */
    const namespace = "https://fauna.com/";

    context.idToken[namespace + "user_metadata"] = { ...user.user_metadata };

    auth0.users
      .updateUserMetadata(user.user_id, user.user_metadata)
      .then(() => {
        callback(null, user, context);
      })
      .catch(function (err) {
        callback(err, user, context);
      });
  } catch (err) {
    callback(err, user, context);
  }
}
