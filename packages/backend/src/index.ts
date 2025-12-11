import { serve } from "@hono/node-server"
import { Hono } from "hono"
import type { ExtEnv } from "./utils/extended-env"
import { prettyJSON } from "hono/pretty-json"
import { error as errorResponse, response } from "database/src/utils/response"
import type { SuccessResponse, ErrorResponse } from "database/src/types"
import { HTTPException } from "hono/http-exception"
import { getErrorMessage } from "./utils/error"
import { cors } from "hono/cors"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { validateSessionToken } from "database/src/lucia"
import { authRoute } from "./routes/auth"
import { getSessionCookieOptions, sessionCookieName } from "database/src/cookie"
import { pinoLogger } from "./middleware/pino-logger"
import { env } from "./env"
import { userRoute } from "./routes/user"
import { socialAuthRoute } from "./routes/social-auth"
import { fileRoute, uploadRoute } from "./routes/upload"

const app = new Hono<ExtEnv>()

app.use(pinoLogger())
app.use(prettyJSON())

app.notFound((c) => c.json<ErrorResponse<string>>(errorResponse("Not Found"), 404))

app.get("/", (c) => c.json<SuccessResponse>(response("Hello Hono!"), 201))

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    const response = error.res ?? c.json<ErrorResponse>(errorResponse(error.message), error.status)
    return response
  }

  return c.json<ErrorResponse>({ success: false, error: getErrorMessage(error) }, 500)
})

app.use(
  "*",
  cors({
    origin: (origin) => {
      // console.log("origin", origin)
      if (origin.includes("localhost") || origin.includes(env.FRONTEND_URL)) {
        return origin
      }
    },
    credentials: true,
  }),
  async (c, next) => {
    const token = getCookie(c, sessionCookieName)
    if (!token) {
      c.set("user", null)
      c.set("session", null)
      return await next()
    }

    const { session, user } = await validateSessionToken(token)
    if (session) {
      setCookie(c, sessionCookieName, token, getSessionCookieOptions())
    } else {
      deleteCookie(c, sessionCookieName)
    }
    c.set("session", session)
    c.set("user", user)

    await next()
  }
)

export const routes = app
  .route("/auth", socialAuthRoute)
  .route("/uploads", fileRoute)
  .basePath("/api")
  .route("/auth", authRoute)
  .route("/user", userRoute)
  .route("/uploads", uploadRoute)

const port = env.PORT
const hostname = "0.0.0.0"
console.log(`Server is running on http://${hostname}:${port}`)

serve({ fetch: app.fetch, port, hostname })
