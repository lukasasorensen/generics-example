import { MongoClient, ServerApiVersion, WithId } from "mongodb";

interface IUser extends WithId<Document> {
  email: string;
  firstName: string;
  lastName: string;
}

export default class BadExample {
  async getWelcomePageForUser(
    userId: string,
    includeLastName: boolean,
    enterButtonText: string,
    dbOptions: object,
    dbUri: string,
    dbName: string
  ): Promise<string> {
    const uri = dbUri;

    if (!uri) throw new Error("Missing Db URI");

    const mongoClient = new MongoClient(uri, dbOptions);

    const user: IUser = (await mongoClient
      .db(dbName ?? "mongodb_example")
      .collection("users")
      .findOne({ id: userId })) as IUser;

    if (!user) {
      throw new Error("No User Found");
    }

    let name = user.firstName;

    if (includeLastName && user.lastName) {
      name += " " + user.lastName;
    }

    let html: string = `<html><h1 class="greeting">Welcome ${name}</h1><a href="/home">${enterButtonText ?? "Enter"}</a></html>`;

    return html;
  }
}
