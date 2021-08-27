# API of Auth Router

## /auth

## [Back to Main](../../README.md)

> Updated: 8/16 2021. \
> v0.3.2

---

| API          | Sign Up                                                                                                                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Description  | Request to join the account                                                                                                                                                               |
| Domain       | https://api.eedited.com:3000                                                                                                                                                              |
| Path         | /auth/signup                                                                                                                                                                              |
| Method       | POST                                                                                                                                                                                      |
| HTTP         | 1.1                                                                                                                                                                                       |
| Header       | -                                                                                                                                                                                         |
| Content-Type | application/json                                                                                                                                                                          |
| Request      | {<br>&nbsp;&nbsp;&nbsp;&nbsp;userId,<br>&nbsp;&nbsp;&nbsp;&nbsp;password,<br>&nbsp;&nbsp;&nbsp;&nbsp;email,<br>&nbsp;&nbsp;&nbsp;&nbsp;nickname,<br>&nbsp;&nbsp;&nbsp;&nbsp;birthdy?<br>} |
| Response     | status code & json { info }<br>&nbsp;&nbsp;&nbsp;&nbsp;- 200<br>&nbsp;&nbsp;&nbsp;&nbsp;- 404, info<br>&nbsp;&nbsp;&nbsp;&nbsp;- 500, info                                                |

| API          | Log In                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Description  | Log in to the account                                                                                                                      |
| Domain       | https://api.eedited.com:3000                                                                                                               |
| Path         | /auth/login                                                                                                                                |
| Method       | POST                                                                                                                                       |
| HTTP         | 1.1                                                                                                                                        |
| Header       | -                                                                                                                                          |
| Content-Type | application/json                                                                                                                           |
| Request      | {<br>&nbsp;&nbsp;&nbsp;&nbsp;userId,<br>&nbsp;&nbsp;&nbsp;&nbsp;password<br>}                                                              |
| Response     | status code & json { info }<br>&nbsp;&nbsp;&nbsp;&nbsp;- 200<br>&nbsp;&nbsp;&nbsp;&nbsp;- 401, info<br>&nbsp;&nbsp;&nbsp;&nbsp;- 500, info |

| API          | Log Out                                      |
| ------------ | -------------------------------------------- |
| Description  | Log out of the account                       |
| Domain       | https://api.eedited.com:3000                 |
| Path         | /auth/logout                                 |
| Method       | GET                                          |
| HTTP         | 1.1                                          |
| Header       | Cookie/connect.sid                           |
| Content-Type | -                                            |
| Request      | -                                            |
| Response     | status code<br>&nbsp;&nbsp;&nbsp;&nbsp;- 200 |

| API          | Find ID                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Description  | Find ID of the account using email                                                                                                         |
| Domain       | https://api.eedited.com:3000                                                                                                               |
| Path         | /auth/find/id                                                                                                                              |
| Method       | POST                                                                                                                                       |
| HTTP         | 1.1                                                                                                                                        |
| Header       | -                                                                                                                                          |
| Content-Type | application/json                                                                                                                           |
| Request      | {<br>&nbsp;&nbsp;&nbsp;&nbsp;email<br>}                                                                                                    |
| Response     | status code & json { info }<br>&nbsp;&nbsp;&nbsp;&nbsp;- 200<br>&nbsp;&nbsp;&nbsp;&nbsp;- 401, info<br>&nbsp;&nbsp;&nbsp;&nbsp;- 500, info |

| API          | Find Password                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Description  | Find PW of the account that matches the ID                                                                                                 |
| Domain       | https://api.eedited.com:3000                                                                                                               |
| Path         | /auth/find/password                                                                                                                        |
| Method       | POST                                                                                                                                       |
| HTTP         | 1.1                                                                                                                                        |
| Header       | -                                                                                                                                          |
| Content-Type | application/json                                                                                                                           |
| Request      | {<br>&nbsp;&nbsp;&nbsp;&nbsp;userId,<br>&nbsp;&nbsp;&nbsp;&nbsp;email<br>}                                                                 |
| Response     | status code & json { info }<br>&nbsp;&nbsp;&nbsp;&nbsp;- 200<br>&nbsp;&nbsp;&nbsp;&nbsp;- 401, info<br>&nbsp;&nbsp;&nbsp;&nbsp;- 500, info |
