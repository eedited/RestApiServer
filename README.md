# Rest Api Server

Rest Api Server of **eedited** Service.

This server is written in typescript, distributed by docker in AWS.

> Have to use node v14.16.1

- [Prerequisite](#pre)
- [Start](#start)
    - [Production](#start-prod)
    - [Development](#start-dev)
- [APIs](#api)
    - [Auth](#api-auth)
- [Contact](#contact)
- [Support](#support)

--------------------------------------------------------------------

<a id="pre"></a>
## Prerequisite
This server depends on Mysql and Prisma. You should make DB and type for it.
> npm run db:gen && npm run db:push<br>
npm run db:create

Both script are exactly same, so you can use anything.

Also, you must make .env file in root of your project directory.
> touch .env

Some env variables have to be included in .env file, o.w. server will emit errors which env variable have to be set when it runs.

--------------------------------------------------------------------

<a id="start"></a>
## Start

<a id="start-prod"></a>
### Production
> npm start<br>
npm run start

To stop, use ```npm run shutdown```

<a id="start-dev"></a>
### Development
> npm run dev<br>
npm run dev:dist

```npm run dev```  runs on ```ts-node```, whereas ```npm run dev:dist``` runs on ```tsc & node```.

--------------------------------------------------------------------

<a id="api"></a>
## APIs

<a id="api-auth"></a>
### Auth

| API          | Sign Up                                                                               |
|--------------|---------------------------------------------------------------------------------------|
| Description  | Request to join the account                                                           |
| Domain       | https://api.eedited.com:3000                                                          |
| Path         | /auth/signup                                                                          |
| Method       | POST                                                                                  |
| HTTP         | 1.1                                                                                   |
| Header       | -                                                                                     |
| Content-Type | application/json                                                                      |
| Request      | {<br>&nbsp;&nbsp;&nbsp;&nbsp;userId,<br>&nbsp;&nbsp;&nbsp;&nbsp;password,<br>&nbsp;&nbsp;&nbsp;&nbsp;email,<br>&nbsp;&nbsp;&nbsp;&nbsp;nickname,<br>&nbsp;&nbsp;&nbsp;&nbsp;birthdy?<br>} | 
| Response     | status code & json { info }<br>&nbsp;&nbsp;&nbsp;&nbsp;- 200<br>&nbsp;&nbsp;&nbsp;&nbsp;- 404, info<br>&nbsp;&nbsp;&nbsp;&nbsp;- 500, info |

| API          | Log In                                                                                |
|--------------|---------------------------------------------------------------------------------------|
| Description  | Log in to the account                                                                 |
| Domain       | https://api.eedited.com:3000                                                          |
| Path         | /auth/login                                                                           |
| Method       | POST                                                                                  |
| HTTP         | 1.1                                                                                   |
| Header       | -                                                                                     |
| Content-Type | application/json                                                                      |
| Request      | {<br>&nbsp;&nbsp;&nbsp;&nbsp;userId,<br>&nbsp;&nbsp;&nbsp;&nbsp;password<br>} | 
| Response     | status code & json { info }<br>&nbsp;&nbsp;&nbsp;&nbsp;- 200<br>&nbsp;&nbsp;&nbsp;&nbsp;- 401, info<br>&nbsp;&nbsp;&nbsp;&nbsp;- 500, info |

| API          | Log Out                                                                               |
|--------------|---------------------------------------------------------------------------------------|
| Description  | Log out of the account                                                                |
| Domain       | https://api.eedited.com:3000                                                          |
| Path         | /auth/logout                                                                          |
| Method       | GET                                                                                   |
| HTTP         | 1.1                                                                                   |
| Header       | Cookie/connect.sid                                                                    |
| Content-Type | -                                                                                     |
| Request      | - | 
| Response     | status code<br>&nbsp;&nbsp;&nbsp;&nbsp;- 200 |

| API          | Find ID                                                                               |
|--------------|---------------------------------------------------------------------------------------|
| Description  | Find ID of the account using email                                                    |
| Domain       | https://api.eedited.com:3000                                                          |
| Path         | /auth/find/id                                                                         |
| Method       | POST                                                                                  |
| HTTP         | 1.1                                                                                   |
| Header       | -                                                                                     |
| Content-Type | application/json                                                                      |
| Request      | {<br>&nbsp;&nbsp;&nbsp;&nbsp;email<br>} | 
| Response     | status code & json { info }<br>&nbsp;&nbsp;&nbsp;&nbsp;- 200<br>&nbsp;&nbsp;&nbsp;&nbsp;- 401, info<br>&nbsp;&nbsp;&nbsp;&nbsp;- 500, info |

| API          | Find Password                                                                         |
|--------------|---------------------------------------------------------------------------------------|
| Description  | Find PW of the account that matches the ID                                            |
| Domain       | https://api.eedited.com:3000                                                          |
| Path         | /auth/find/password                                                                   |
| Method       | POST                                                                                  |
| HTTP         | 1.1                                                                                   |
| Header       | -                                                                                     |
| Content-Type | application/json                                                                      |
| Request      | {<br>&nbsp;&nbsp;&nbsp;&nbsp;userId,<br>&nbsp;&nbsp;&nbsp;&nbsp;email<br>} | 
| Response     | status code & json { info }<br>&nbsp;&nbsp;&nbsp;&nbsp;- 200<br>&nbsp;&nbsp;&nbsp;&nbsp;- 401, info<br>&nbsp;&nbsp;&nbsp;&nbsp;- 500, info |


--------------------------------------------------------------------

<a id="contact"></a>
## Contact
### Team eedited

- Minsu Jeon
    - Email : minsu2530@u.sogang.ac.kr
    - Github : [bambbam](https://github.com/bambbam)
- Munhae Kang
    - Email : tjdnf2eoeld@naver.com
    - Github : [airplane9876](https://github.com/airplane9876) 
- Kiung Jung
    - Email : answeqr@gmail.com
    - Github : [QuqqU](https://github.com/QuqqU)

--------------------------------------------------------------------

<a id="support"></a>
## Project Support 💸

![sw-maestro](./public/docs/soma_logo.png)

> 이 성과는 2021년도 과학기술정보통신부의 재원으로 정보통신기획평가원의 지원을 받아 수행된 연구임(IITP-0000-SW마에스트로과정).   
This work was supported by the Institute of Information & Communications Technology Planning & Evaluation(IITP) grant funded
by the Ministry of Science and ICT(MSIT) (IITP-0000-SW Maestro training course).

--------------------------------------------------------------------

<br>
<div align="center">
    <h4>Copyright © 2021. (Team. eedited) All rights reserved.</h4>
</div>