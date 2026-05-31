import "server-only";

export function stripPasswordHash<T extends object>(user: T): Omit<T, "password"> {
  const { password: _password, ...safeUser } = user as T & { password?: unknown };

  return safeUser as Omit<T, "password">;
}

export function stripPasswordHashes<T extends object>(
  users: readonly T[],
): Array<Omit<T, "password">> {
  return users.map((user) => stripPasswordHash(user));
}
