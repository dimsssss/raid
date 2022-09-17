# rade

<p align="center">
    <h1 align="center">
        Raid Ranking API
    </h1>
    <p align="center">게임 보스 레이드 랭킹 정보를 알려주는 API입니다<a href="https://github.com/dimsssss/raid"></a>.</p>
</p>

<p align="center">
    <a href="">
        <img alt="license" src="https://img.shields.io/github/license/dimsssss/toy-intergration-test">
    </a>
    <a href="">
        <img alt="npm" src="https://img.shields.io/node/v-lts/npm?label=npm&logo=npm">
    </a>
    <a href="https://expressjs.com/">
        <img alt="express" src="https://img.shields.io/node/v-lts/express?label=express&logo=express">
    </a>
    <a href="https://jestjs.io/">
        <img alt="jest" src="https://img.shields.io/node/v-lts/express?label=jest&logo=jest">
    </a>
    <a href="https://sequelize.org/">
        <img alt="sequelize" src="https://img.shields.io/node/v-lts/sequelize?label=sequelize&logo=sequelize">
    </a>
    <a href="https://dl.circleci.com/status-badge/redirect/gh/dimsssss/raid/tree/main">
        <img alt="circleci" src="https://dl.circleci.com/status-badge/img/gh/dimsssss/raid/tree/main.svg?style=svg">
    </a>
</p>

## 🏗 설치

### 1. 데이터베이스 설치

```shell
docker run --name=raid -e MYSQL_ROOT_PASSWORD=1234 -e MYSQL_DATABASE=raid -p 6603:3306 -d mysql:latest
```

### 2. 웹 서버 설치

```shell
git clone https://github.com/dimsssss/raid

cd raid

npm install
```

### 3. 환경 변수 설정

```
## .env 안에 들어갈 내용
DATABASE_USER = db계정
PASSWORD = db 패스워드
DATABASE = rade(임시)
HOST = db 호스트
DATABASE_PORT = db 포트
DIALECT = 사용하는 db 종류
TIMEZONE = 타임존 설정
MIN = 커넥션 풀 최소 갯수
MAX = 커넥션 풀 최대 갯수
BOSS_URL = boss 정보를 알려주는 URL

```

### 4. 데이터베이스 마이그레이션

```shell
# migration
npx sequelize-cli db:migrate
```

## 🔍 이슈 사항들

https://www.notion.so/dimsss/Boss-Rade-API-fa0b4e4ee7c148028f2fdf66f0a8ab55

## 🌐 API Document

coming soon

## 🧾 실행

```shell
npm run dev
```
