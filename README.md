# Rest API Server

Rest API Server of **eedited** Service.

This server is written in typescript, distributed by docker in AWS.

> Have to use node v14.16.1

-   [Prerequisite](#pre)
-   [Quick-Start](#start)
    -   [Production](#start-prod)
    -   [Development](#start-dev)
-   [Docs](#docs)
    -   [start](#start)
    -   [npm script](#npm-script)
    -   [APIs](#apis)
        -   [index](#api-index)
        -   [auth](#api-auth)
        -   [video](#api-video)
    -   [Database Schemas](#db-schemas)
        -   [user](#db-user)
        -   [video](#db-video)
    -   [docker](#docker)
-   [Contact](#contact)
-   [Support](#support)

---

<a id="pre"></a>

## Prerequisite

This server depends on Mysql and Prisma. You should make DB and type for it.

> npm run db:gen && npm run db:push<br>
> npm run db:create

Both script are exactly same, so you can use anything.

Also, you must make .env file in root of your project directory.

> touch .env

Some env variables have to be included in .env file, o.w. server will emit errors which env variable have to be set when it runs.

---

<a id="start"></a>

## Quick-Start

<a id="start-prod"></a>

### Production

> npm start<br>
> npm run start

To stop, use `npm run shutdown`

<a id="start-dev"></a>

### Development

> npm run dev<br>
> npm run dev:dist

`npm run dev` runs on `ts-node`, whereas `npm run dev:dist` runs on `tsc & node`.

---

<a id="docs"></a>

## DOCs

<a id="start"></a>

-   ### [start](./docs/start.md)

<a id="npm-script"></a>

-   ### [npm script](./docs/npm-script.md)

<a id="apis"></a>

-   ### APIs
    <a id="api-index"></a>
    -   [index](./docs/APIs/index.md)
        <a id="api-auth"></a>
    -   [auth](./docs/APIs/auth.md)
        <a id="api-video"></a>
    -   [video](./docs/APIs/video.md)

<a id="db-schemas"></a>

-   ### Database Schemas
    <a id="db-user"></a>
    -   [index](./docs/schemas/user.md)
        <a id="db-video"></a>
    -   [auth](./docs/schemas/video.md)

<a id="docker"></a>

-   ### [docker](./docs/docker.md)

---

<a id="contact"></a>

## Contact

### Team eedited

-   Minsu Jeon
    -   Email : minsu2530@u.sogang.ac.kr
    -   Github : [bambbam](https://github.com/bambbam)
-   Munhae Kang
    -   Email : tjdnf2eoeld@naver.com
    -   Github : [airplane9876](https://github.com/airplane9876)
-   Kiung Jung
    -   Email : answeqr@gmail.com
    -   Github : [QuqqU](https://github.com/QuqqU)

---

<a id="support"></a>

## Project Support 💸

![sw-maestro](./public/soma_logo.png)

> 이 성과는 2021년도 과학기술정보통신부의 재원으로 정보통신기획평가원의 지원을 받아 수행된 연구임(IITP-0000-SW마에스트로과정).  
> This work was supported by the Institute of Information & Communications Technology Planning & Evaluation(IITP) grant funded
> by the Ministry of Science and ICT(MSIT) (IITP-0000-SW Maestro training course).

---

<br>
<div align="center">
    <h4>Copyright © 2021. (Team. eedited) All rights reserved.</h4>
</div>
