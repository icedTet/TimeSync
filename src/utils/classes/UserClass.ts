import EventEmitter from "events";
import { GivenUser } from "../types/user";

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
    this.fetchUser()
  }
  private _user: GivenUser | null = null;
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
  set user(user: GivenUser | null) {
    this._user = user;
    this.emit("change", user);
  }
}
