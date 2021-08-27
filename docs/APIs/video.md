# API of Video Router

## /video

## [Back to Main](../../README.md)

> Updated: 8/16 2021. \
> v0.3.2

---

| API          | Get Pagenated Video                                                                                                                                                                       |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Description  | Get a page of videos                                                                                                                                                                      |
| Domain       | https://api.eedited.com:3000                                                                                                                                                              |
| Path         | /video/signup                                                                                                                                                                             |
| Method       | POST                                                                                                                                                                                      |
| HTTP         | 1.1                                                                                                                                                                                       |
| Header       | -                                                                                                                                                                                         |
| Content-Type | application/json                                                                                                                                                                          |
| Request      | {<br>&nbsp;&nbsp;&nbsp;&nbsp;userId,<br>&nbsp;&nbsp;&nbsp;&nbsp;password,<br>&nbsp;&nbsp;&nbsp;&nbsp;email,<br>&nbsp;&nbsp;&nbsp;&nbsp;nickname,<br>&nbsp;&nbsp;&nbsp;&nbsp;birthdy?<br>} |
| Response     | status code & json { info }<br>&nbsp;&nbsp;&nbsp;&nbsp;- 200<br>&nbsp;&nbsp;&nbsp;&nbsp;- 404, info<br>&nbsp;&nbsp;&nbsp;&nbsp;- 500, info                                                |
