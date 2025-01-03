import { Collection, Db, MongoClient, ServerApiVersion, WithId } from "mongodb";

interface IUser extends WithId<Document> {
  email: string;
  firstName: string;
  lastName: string;
}

interface IWelcomePageOptions {
  includeLastName?: boolean;
  enterButtonText?: string;
  greeting?: string;
}

interface IDbClientOptions {
  uri: string;
  databaseName: string;
}

export class DatabaseManager {
  uri: string;
  databaseName: string;

  constructor(options?: IDbClientOptions) {
    this.uri = options?.uri ?? process.env.MONGODB_URI ?? "";
    this.databaseName = options?.databaseName ?? process.env.MONGODB_NAME ?? "";

    if (!this.uri.length || !this.databaseName.length) {
      throw new Error("Missing Database Configuration");
    }
  }

  getDbClient(): Db {
    const mongoClient = new MongoClient(this.uri ?? "", {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    return mongoClient.db(this.databaseName);
  }
}

export class UserClient {
  userDbCollection: Collection<IUser>;

  constructor(dbClient: Db) {
    this.userDbCollection = dbClient.collection("users");
  }

  async getUserById(userId: string) {
    const user = await this.userDbCollection.findOne({ _id: userId });

    if (!user) {
      throw new Error("User Not Found");
    }

    return user;
  }
}

export class HtmlUtil {
  static createHtmlWithBody(content: string) {
    return `<html><body>${content}</body></html>`;
  }
}

export class UserNameUtil {
  static getUserFullName(user: IUser) {
    let fullName = user.firstName;
    if (user.lastName) {
      fullName += user.lastName;
    }
    return fullName;
  }
}

export class WelcomePageRenderer {
  renderWelcomePageForUser(user: IUser, options: IWelcomePageOptions) {
    let name = options.includeLastName
      ? user.firstName
      : UserNameUtil.getUserFullName(user);

    return HtmlUtil.createHtmlWithBody(
      `<h1 class="greeting">${options.greeting ?? "Welcome"} ${name}</h1><a href="/home">${options.enterButtonText ?? "Enter"}</a>`,
    );
  }
}

export class GoodExample {
  userClient: UserClient;
  constructor() {
    const dbClient = new DatabaseManager().getDbClient();
    this.userClient = new UserClient(dbClient);
  }

  async getWelcomePageForUser(userId: string): Promise<string> {
    try {
      const user: IUser = (await this.userClient.getUserById(userId)) as IUser;

      return new WelcomePageRenderer().renderWelcomePageForUser(user, {
        includeLastName: true,
        enterButtonText: "Join The Darkside",
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to Get Welcome page");
    }
  }
}
