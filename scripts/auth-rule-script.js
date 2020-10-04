async function loginFaunaOnUserLogin(user, context, callback) {
  const { Client, query: q } = require("faunadb@2.11.1"); // from Auth0 registry. See https://auth0.com/docs/rules

  const client = new Client({
    secret: configuration.SERVER_SECRET,
  });

  try {
    /* return user document if present in the database */
    let user_from_fauna;
    try {
      user_from_fauna = await client.query(
        q.Get(q.Match(q.Index("users_by_email"), user.email))
      );
    } catch (error) {
      throw new Error("No user with this email exists");
    }

    /* create a secret from the user's ref in the Tokens collection */
    const credential = await client.query(
      q.Create(q.Tokens(null), { instance: user_from_fauna.ref })
    );

    /* Attach the secret, user_id and role to the user_metadata */
    user.user_metadata = {
      secret: credential.secret,
      user_id: credential.instance.id,
      role: user_from_fauna.ref.collection.id.toLowerCase().slice(0, -1),
    };

    /* The custom claim allows us to attach the user_metadata to the returned object */
    const namespace = "https://fauna.com/"; // fauna because we are using FaunaDB
    context.idToken[namespace + "user_metadata"] = user.user_metadata;

    auth0.users
      .updateUserMetadata(user.user_id, user.user_metadata)
      .then(() => callback(null, user, context))
      .catch((err) => callback(err, user, context));
  } catch (err) {
    callback(err, user, context);
  }
}