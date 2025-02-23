import { sqliteTable, text } from "drizzle-orm/sqlite-core";
export const FilesTable = sqliteTable("files", {
  key: text(),
  url: text(),
  name: text(),
  user_id: text()
});