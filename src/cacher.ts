import hash from "object-hash";
import { User } from "./types";

const storage = new Map<string, User[]>();

function makeKey(obj: Record<string, unknown>) {
  return hash(obj);
}

function put(obj: Record<string, unknown>, users: User[]) {
  storage.set(makeKey(obj), users);
}

function get(obj: Record<string, unknown>): User[] | undefined;
function get(obj: Record<string, unknown>, callback: () => User[]): User[];
function get(obj: Record<string, unknown>, callback?: () => User[]) {
  const key = makeKey(obj);

  const storedUsers = storage.get(key);

  if (storedUsers) {
    return storedUsers;
  }

  if (callback) {
    put(obj, callback());
    return storage.get(key)!;
  }
}

export default { makeKey, put, get };
