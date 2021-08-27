# User Schema

## [Back to Main](../../README.md)

> Updated: 8/16 2021. \
> v0.3.2

---

| Attribute      | Type         | Constraints                     | Description         |
| -------------- | ------------ | ------------------------------- | ------------------- |
| userId         | varchar(50)  | pk                              | 유저의 아이디       |
| password       | varchar(100) | not null                        | 비밀번호            |
| birthday       | date         |                                 | 생년월일            |
| nickname       | varchar(10)  | not null<br/>unique             | 닉네임              |
| email          | varchar(100) | not null                        | 이메일              |
| profilePicture | varchar(200) | not null<br/>default=기본이미지 | 프로필사진의 s3 url |
| followerCnt    | int          | not null<br/>default=0          | 팔로워 수           |
| uploadVideoCnt | int          | not null<br/>default=0          | 업로드 한 영상의 수 |
| proTag         | bool         | not null<br/>default=false      | proTag 여부         |
| createdAt      | dateTime     | not null<br/>default=now        | 모든 테이블 공통    |
| updatedAt      | dateTime     | not null<br/>default=updatedAt  | 모든 테이블 공통    |
| deletedAt      | dateTime     |                                 | 모든 테이블 공통    |
