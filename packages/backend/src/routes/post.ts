import { Hono } from "hono"
import type { ExtEnv } from "../utils/extended-env"
import { signedIn } from "../middleware/signed-in"
import { zValidator } from "@hono/zod-validator"
import type { User } from "database/src/drizzle/schema/auth"
import { HTTPException } from "hono/http-exception"
import path from "path"
import type { PaginatedSuccessResponse, SuccessResponse } from "database/src/types"
import { createUpload } from "database/src/queries/upload"
import { postSchema } from "../validators/post"
import { File } from "buffer"
import type { Post } from "database/src/drizzle/schema/post"
import { createPostItem, getPostItems, getPostItemsCount } from "database/src/queries/post"
import { postPaginationSchema } from "database/src/validators/post-pagination"
import { Readable } from "stream"
import { createWriteStream } from "fs"
import { pipeline } from "stream/promises"

export const postRoute = new Hono<ExtEnv>()
  .post("/", signedIn, zValidator("form", postSchema), async (c) => {
    const { file, ...uploadData } = c.req.valid("form")
    const user = c.get("user") as User

    if (!(file instanceof File)) {
      throw new HTTPException(400, { message: "Invalid file" })
    }

    const filePath = path.join("file-storage", file.name)

    const readable = Readable.fromWeb(file.stream())
    const writable = createWriteStream(filePath)

    await pipeline(readable, writable)

    console.log("File uploaded", file.name)

    const upload = await createUpload({
      user,
      isPublic: false,
      filePath: file.name,
    })

    const post = await createPostItem({
      userId: user.id,
      imageId: upload.id,
      ...uploadData,
    })

    return c.json<SuccessResponse<Post>>({
      message: "File uploaded",
      data: post,
      success: true,
    })
  })
  .get("/", signedIn, zValidator("query", postPaginationSchema), async (c) => {
    const query = c.req.valid("query")
    const { page, limit } = query

    const postCount = await getPostItemsCount()
    const postItems = await getPostItems(query)

    return c.json<PaginatedSuccessResponse<Post[]>>({
      success: true,
      data: postItems,
      message: "Post items retrieved",
      pagination: {
        page,
        totalPages: Math.ceil(postCount / limit),
        totalItems: postCount,
      },
    })
  })
