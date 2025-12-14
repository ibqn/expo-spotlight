import { and, asc, countDistinct, desc, eq } from "drizzle-orm"
import { db } from "../drizzle/db"
import { postTable, type Post } from "../drizzle/schema/post"
import type { ParamIdSchema } from "../validators/param"
import type { CreatePostSchema, UpdatePostSchema } from "../validators/post"
import type { UserIdSchema } from "../validators/user"
import { postPaginationSchema, type PostPaginationSchema, type PostSortedBySchema } from "../validators/post-pagination"

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

export const getPostItemsCount = async () => {
  const [{ count }] = await db.select({ count: countDistinct(postTable.id) }).from(postTable)

  return count
}

const getSortedByColumn = (sortedBy: PostSortedBySchema) => {
  switch (sortedBy) {
    case "caption":
      return postTable.caption
    case "recent":
      return postTable.createdAt
    default:
      throw new Error("Invalid sortedBy value")
  }
}

export const getPostItems = async (queryParams?: PostPaginationSchema): Promise<Post[]> => {
  const params = postPaginationSchema.parse(queryParams ?? {})

  const { limit, page, sortedBy, order } = params
  const offset = (page - 1) * limit

  const sortedByColumn = getSortedByColumn(sortedBy)
  const orderBy = order === "desc" ? desc(sortedByColumn) : asc(sortedByColumn)

  const postItems = await db.query.post.findMany({
    offset,
    limit,
    orderBy: [orderBy, asc(postTable.id)],
    with: {
      user: { columns: { passwordHash: false } },
      image: true,
    },
  })

  return postItems satisfies Post[]
}
