import EventEmitter from "events";
import { GivenUser, PublicUser } from "../types/user";

export class SelfUserClass extends EventEmitter {
  static instance: SelfUserClass;
  static getInstance() {
    if (!SelfUserClass.instance) {
      SelfUserClass.instance = new SelfUserClass();
    }
    return SelfUserClass.instance;
  }
  private constructor() {
    super();
    this.fetchUser();
  }
  private _user: GivenUser | null = null;
  private _userMap: Map<
    string,
    {
      user: PublicUser;
      lastUpdated: number;
    }
  > = new Map();
  private _fetchingMap: Map<string, Promise<PublicUser>> = new Map();
  async fetchUser() {
    await fetch("/api/users/@me")
      .then((x) => x.json())
      .then((x) => {
        if (x) {
          this.user = x;
        }
      });
  }
  get user() {
    return this._user;
  }
  async getUser(id: string, force = false) {
    const user = this._userMap.get(id);
    if (user && !force) {
      return user.user;
    }
    if (this._fetchingMap.has(id)) {
      return await this._fetchingMap.get(id);
    }
    const promise = fetch(`/api/users/${id}`)
      .then((x) => x.json())
      .then((x) => {
        this._userMap.set(id, {
          user: x,
          lastUpdated: Date.now(),
        });
        return x;
      }) as Promise<PublicUser>;
    this._fetchingMap.set(id, promise);
    return await promise;
  }
  set user(user: GivenUser | null) {
    this._user = user;
    this.emit("change", user);
  }
}
