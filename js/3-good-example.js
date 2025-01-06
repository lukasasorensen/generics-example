import { Collection, Db, MongoClient, ServerApiVersion, WithId } from "mongodb";

// Entry
export default class GoodExampleWithHierarchy {
  constructor() {
    const dbClient = new DatabaseManager().getDbClient();
    this.userClient = new UserClient(dbClient);
  }

  async getWelcomePageForUser(userId, options) {
    try {
      const user = await this.userClient.getUserById(userId);

      return new WelcomePageRenderer().renderWelcomePageForUser(user, {
        includeLastName: options.includeLastName ?? true,
        enterButtonText: options.enterButtonText ?? "Enter",
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to Get Welcome page");
    }
  }
}

// Renderers
class WelcomePageRenderer extends PageRenderer {
  renderWelcomePageForUser(user, options) {
    let name = options.includeLastName
      ? user.firstName
      : UserNameUtil.getUserFullName(user);

    return this.renderPage(
      `<h1 class="greeting">${options.greeting || "Welcome"} ${name}</h1><a href="/home">${options.enterButtonText || "Enter"}</a>`
    );
  }
}

class PageRenderer {
  renderPage(content) {
    return HtmlUtil.createHtmlWithBody(content);
  }
}

// DB
class UserClient {
  constructor(dbClient) {
    this.userDbCollection = dbClient.collection("users");
  }

  async getUserById(userId) {
    const user = await this.userDbCollection.findOne({ _id: userId });

    if (!user) {
      throw new Error("User Not Found");
    }

    return user;
  }
}

class DatabaseManager {
  constructor(options) {
    this.uri = options?.uri || process.env.MONGODB_URI || "";
    this.databaseName = options?.databaseName || process.env.MONGODB_NAME || "";

    if (!this.uri.length || !this.databaseName.length) {
      throw new Error("Missing Database Configuration");
    }
  }

  getDbClient() {
    const mongoClient = new MongoClient(this.uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    return mongoClient.db(this.databaseName);
  }
}

// UTILS
class HtmlUtil {
  static createHtmlWithBody(content) {
    return `<html><body>${content}</body></html>`;
  }
}

class UserNameUtil {
  static getUserFullName(user) {
    let fullName = user.firstName;
    if (user.lastName) {
      fullName += ` ${user.lastName}`;
    }
    return fullName;
  }
}


