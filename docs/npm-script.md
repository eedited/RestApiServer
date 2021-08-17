# NPM Script

## [Back to Main](../README.md)

> Updated: 8/17 2021. \
> v0.3.2

---

| Script       | ENV  | Description                             |
| ------------ | ---- | --------------------------------------- |
| start        | prod | Run server on production environment    |
| shutdown     | prod | Stop server                             |
| reload       | prod | Restart server                          |
| ls           | prod | List running servers                    |
| log          | prod | Print logs                              |
| log:err      | prod | Print only errors                       |
| monitor      | prod | Monitoring tool                         |
| build        | -    | Build from src to dist                  |
| dev          | dev  | Run server on development environment   |
| dev:src      | dev  | Run server using ts-node(same above)    |
| dev:dist     | dev  | Run server using tsc & node             |
| dev:docker   | dev  | Running option for docker               |
| test         | test | Test code                               |
| test:cover   | test | Show how far the current test has gone  |
| lint         | -    | Lint code                               |
| lint:staged  | -    | Lint code only staged                   |
| db:push      | dev  | Make DB using prisma development schema |
| db:push-prod | prod | Make DB using prisma production schema  |
| db:push-dev  | dev  | Make DB using prisma development schema |
| db:push-test | test | Make DB using prisma test schema        |
| db:gen       | -    | Connect DB types to code                |
