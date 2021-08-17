# Video Schema

## [Back to Main](../../README.md)

> Updated: 8/16 2021. \
> v0.3.2

---

| attribute name | type         | constraint               | description                 |
| -------------- | ------------ | ------------------------ | --------------------------- |
| liker          | varchar(50)  | fk of user&#46;userId    | 좋아요를 누른 사람의 아이디 |
| videoId        | varchar(197) | fk of video&#46;id       | 비디오의 고유 id            |
| uploader       | varchar(50)  | fk of video&#46;uploader | 비디오의 업로더의 아이디    |
