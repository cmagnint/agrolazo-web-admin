import "server-only";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { parse } from "yaml";
import { z } from "zod";

type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

const CONFIG_FILENAME = "config.yaml";
const ENV_PLACEHOLDER_PATTERN = /\$\{([A-Z0-9_]+)\}/g;

const booleanStringSchema = z.string().transform((value, context) => {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  context.addIssue({
    code: z.ZodIssueCode.custom,
    message: "Must be either \"true\" or \"false\"",
  });

  return z.NEVER;
});

const positiveIntegerStringSchema = z
  .string()
  .regex(/^\d+$/, "Must be a positive integer")
  .transform((value) => Number(value))
  .refine((value) => value > 0, "Must be greater than 0");

const portStringSchema = positiveIntegerStringSchema.refine(
  (value) => value <= 65535,
  "Must be a valid TCP port",
);

const configSchema = z
  .object({
    node: z
      .object({
        env: z.enum(["development", "production", "test"]),
      })
      .strict(),
    api: z
      .object({
        organization: z
          .object({
            url: z.string().url(),
          })
          .strict(),
        factory: z
          .object({
            url: z.string().url(),
          })
          .strict(),
      })
      .strict(),
    session: z
      .object({
        cookie: z
          .object({
            name: z.string().min(1),
            secure: booleanStringSchema,
            max_age_seconds: positiveIntegerStringSchema,
          })
          .strict(),
      })
      .strict(),
    http: z
      .object({
        port: portStringSchema,
      })
      .strict(),
  })
  .strict()
  .transform((value) => ({
    node: value.node,
    api: value.api,
    session: {
      cookie: {
        name: value.session.cookie.name,
        secure: value.session.cookie.secure,
        maxAgeSeconds: value.session.cookie.max_age_seconds,
      },
    },
    http: value.http,
  }));

export type Config = DeepReadonly<z.infer<typeof configSchema>>;

let _config: Config | null = null;

export function getConfig(): Config {
  if (_config !== null) return _config;
  _config = loadConfig();
  return _config;
}

function loadConfig(): Config {
  const configPath = resolve(process.cwd(), CONFIG_FILENAME);
  const rawConfig = readConfigFile(configPath);
  const parsedYaml = parseConfigYaml(rawConfig, configPath);
  const resolvedConfig = resolveEnvPlaceholders(parsedYaml);
  const parsedConfig = configSchema.safeParse(resolvedConfig);

  if (!parsedConfig.success) {
    const details = parsedConfig.error.issues
      .map((issue) => `${formatPath(issue.path)}: ${issue.message}`)
      .join("; ");

    throw new Error(`Invalid web-admin config: ${details}`);
  }

  return deepFreeze(parsedConfig.data);
}

function readConfigFile(configPath: string): string {
  try {
    return readFileSync(configPath, "utf8");
  } catch (error) {
    throw new Error(`Unable to read web-admin config at ${configPath}`, {
      cause: error,
    });
  }
}

function parseConfigYaml(rawConfig: string, configPath: string): unknown {
  try {
    return parse(rawConfig);
  } catch (error) {
    throw new Error(`Unable to parse web-admin config at ${configPath}`, {
      cause: error,
    });
  }
}

function resolveEnvPlaceholders(value: unknown, path: Array<string | number> = []): unknown {
  if (Array.isArray(value)) {
    return value.map((item, index) => resolveEnvPlaceholders(item, [...path, index]));
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        resolveEnvPlaceholders(item, [...path, key]),
      ]),
    );
  }

  if (typeof value !== "string") {
    return value;
  }

  return value.replace(ENV_PLACEHOLDER_PATTERN, (_placeholder, envKey: string) => {
    const envValue = process.env[envKey];

    if (envValue === undefined) {
      throw new Error(
        `Missing environment variable ${envKey} referenced by ${CONFIG_FILENAME} at ${formatPath(path)}`,
      );
    }

    return envValue;
  });
}

function deepFreeze<T>(value: T): DeepReadonly<T> {
  if (value && typeof value === "object") {
    for (const nestedValue of Object.values(value)) {
      deepFreeze(nestedValue);
    }

    return Object.freeze(value) as DeepReadonly<T>;
  }

  return value as DeepReadonly<T>;
}

function formatPath(path: Array<string | number>): string {
  return path.length > 0 ? path.join(".") : "<root>";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}