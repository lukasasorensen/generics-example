import { MongoClient, ServerApiVersion } from "mongodb";

interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default class BadExample {
  async getWelcomePageForUser(userId: string): Promise<string> {
    const uri = process.env.MONGODB_URI;
    const options = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    };

    const mongoClient = new MongoClient(uri, options);

    const user: IUser = await mongoClient
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

    let html: string = `<html><h1 class="greeting">Welcome ${name}</h1><a href="/home">Enter</a></html>`;

    return html;
  }
}
