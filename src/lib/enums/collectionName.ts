const COLLECTION_NAME = {
  TASKS: "tasks",
  TAGS: "tags",
  THEMES: "themes",
  ACCOUNTS: "accounts",
} as const;

type CollectionName = keyof typeof COLLECTION_NAME;

export { COLLECTION_NAME };
export type { CollectionName };
