import { MongoClient, ServerApiVersion, WithId } from "mongodb";

interface IUser extends WithId<Document> {
  email: string;
  firstName: string;
  lastName: string;
}

interface IWelcomePageOptions {
  includeLastName?: boolean;
  enterButtonText?: string;
  dbOptions?: object;
  dbUri?: string;
  dbName?: string;
}

export default class BadExample {
  async getWelcomePageForUser(
    userId: string,
    options: IWelcomePageOptions,
  ): Promise<string> {
    const uri = options.dbUri ?? process.env.MONGODB_URI;

    if (!uri) throw new Error("Missing Db URI");

    const mongoClient = new MongoClient(uri, options.dbOptions);

    const user: IUser = (await mongoClient
      .db(options.dbName ?? "mongodb_example")
      .collection("users")
      .findOne({ id: userId })) as IUser;

    if (!user) {
      throw new Error("No User Found");
    }

    let name = user.firstName;

    if (options.includeLastName && user.lastName) {
      name += " " + user.lastName;
    }

    let html: string = `<html><h1 class="greeting">Welcome ${name}</h1><a href="/home">${options.enterButtonText ?? "Enter"}</a></html>`;

    return html;
  }
}
