# Video Schema

## [Back to Main](../../README.md)

> Updated: 8/16 2021. \
> v0.3.2

---

| attribute name | type         | constraint             | description              |
| -------------- | ------------ | ---------------------- | ------------------------ |
| id             | varchar(197) | uuid                   | 비디오의 고유 id         |
| uploader       | varchar(50)  | fk of user&#46;userId      | 비디오의 업로더의 아이디 |
| title          | varchar(50)  | not null               | 비디오의 제목            |
| description    | text         | not null               | 비디오의 설명            |
| url            | varchar(200) | not null               | 비디오의 s3 url          |
| thumbnail      | varchar(200) | not null               | 썸네일의 s3 url          |
| likeCnt        | int          | not null<br/>default=0 | 좋아요 수                |
| viewCnt        | int          | not null<br/>default=0 | 시청 수                  |
