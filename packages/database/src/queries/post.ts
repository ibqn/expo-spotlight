import { and, eq } from "drizzle-orm"
import { db } from "../drizzle/db"
import { postTable, type Post } from "../drizzle/schema/post"
import type { ParamIdSchema } from "../validators/param"
import type { CreatePostSchema, UpdatePostSchema } from "../validators/post"
import type { UserIdSchema } from "../validators/user"

export const createPostItem = async (input: CreatePostSchema): Promise<Post> => {
  const [postItem] = await db.insert(postTable).values(input).returning()

  return postItem satisfies Post
}

export const updatePostItem = async (input: ParamIdSchema & UpdatePostSchema): Promise<Post> => {
  const [postItem] = await db
    .update(postTable)
    .set(input)
    .where(and(eq(postTable.id, input.id), eq(postTable.userId, input.userId)))
    .returning()

  return postItem satisfies Post
}

export const deletePostItem = async ({ id, userId }: ParamIdSchema & UserIdSchema): Promise<Post> => {
  const [postItem] = await db
    .delete(postTable)
    .where(and(eq(postTable.id, id), eq(postTable.userId, userId)))
    .returning()

  return postItem satisfies Post
}
