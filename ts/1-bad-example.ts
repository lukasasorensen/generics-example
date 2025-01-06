import { MongoClient, ServerApiVersion, WithId } from "mongodb";

interface IUser extends WithId<Document> {
  email: string;
  firstName: string;
  lastName: string;
}

export default class BadExample {
  async getWelcomePage(): Promise<string> {
    const userId = 'de2rg6heletg36lk';
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

    const user: IUser = (await mongoClient
      .db("mongodb_example")
      .collection("users")
      .findOne({ id: userId })) as IUser;

    if (!user) {
      throw new Error("No User Found");
    }

    let name = user.firstName;

    if (user.lastName) {
      name += " " + user.lastName;
    }

    let html: string = `<html><h1 class="greeting">Welcome ${name}</h1><a href="/home">Enter</a></html>`;

    return html;
  }
}
