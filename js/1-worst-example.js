import { MongoClient, ServerApiVersion } from "mongodb";

export default class OneClassBadExample {
  async getWelcomePageForUser(userId) {
    const uri =
      "mongodb+srv://example:kejf3ek@example.foo.mongodb.net/?retryWrites=true&w=majority&appName=example";

    const options = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    };

    const mongoClient = new MongoClient(uri, options);

    const user = await mongoClient
      .db("mongodb_example")
      .collection("users")
      .findOne({ id: userId });

    if (!user) {
      throw new Error("No User Found");
    }

    let name = user.firstName;

    if (user.lastName) {
      name += " " + user.lastName;
    }

    let html = `<html><h1 class="greeting">Welcome ${name}</h1><a href="/home">Enter</a></html>`;

    return html;
  }
}