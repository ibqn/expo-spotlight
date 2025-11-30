## Getting started

if not created, generate migration and apply it

```shell
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

start postgres database via docker compose by running

```sh
docker compose up -d
```

seed tables with users and permission

```shell
pnpm seed
```
