import { MongoClient } from "mongodb";

export default class ManyOptionsExample {
  async getWelcomePageForUser(
    userId,
    includeLastName,
    enterButtonText,
    dbOptions,
    dbUri,
    dbName
  ) {
    const uri = dbUri || process.env.MONGODB_URI;

    if (!uri) throw new Error("Missing Db URI");

    const mongoClient = new MongoClient(uri, dbOptions);

    const user = await mongoClient
      .db(dbName || "mongodb_example")
      .collection("users")
      .findOne({ id: userId });

    if (!user) {
      throw new Error("No User Found");
    }

    let name = user.firstName;

    if (includeLastName && user.lastName) {
      name += " " + user.lastName;
    }

    let html = `<html><h1 class="greeting">Welcome ${name}</h1><a href="/home">${
      enterButtonText || "Enter"
    }</a></html>`;

    return html;
  }
}
