import { MongoClient, ServerApiVersion } from "mongodb";

interface IUser {
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
    const mongoClient = new MongoClient(
      options.dbUri ?? process.env.MONGODB_URI,
      options.dbOptions,
    );

    const user: IUser = await mongoClient
      .db(options.dbName ?? "mongodb_example")
      .findOne({ id: userId });

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
