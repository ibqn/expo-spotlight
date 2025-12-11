import { text, uuid } from "drizzle-orm/pg-core"
import { relations, type InferSelectModel } from "drizzle-orm"
import { schema } from "./schema"
import { createdAtUpdatedAt } from "./utils"
import { uploadTable, type Upload } from "./upload"
import { userTable, type User } from "./auth"

export const postTable = schema.table("post", {
  id: uuid("id").primaryKey().defaultRandom(),
  caption: text("caption"),

  imageId: uuid("image_id")
    .notNull()
    .references(() => uploadTable.id, { onDelete: "cascade" }),

  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  ...createdAtUpdatedAt,
})

export const postRelations = relations(postTable, ({ one }) => ({
  user: one(userTable, { fields: [postTable.userId], references: [userTable.id] }),
  image: one(uploadTable, { fields: [postTable.imageId], references: [uploadTable.id] }),
}))

export type Post = InferSelectModel<typeof postTable> & {
  image?: Upload | null
  user?: User | null
}
