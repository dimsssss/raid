<p align="center">
    <h1 align="center">
        Raid Ranking API
    </h1>
    <p align="center">보스 레이드 랭킹 정보를 알려주는 API입니다<a href="https://github.com/dimsssss/raid"></a>.</p>
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

## 🏗 프로젝트 설명

보스 레이드와 관련된 API를 제공하는 서비스 입니다. 주요 특징으로는 다음이 있습니다.

- 한번에 한 명의 유저만 보스레이드를 진행할 수 있습니다.
- 아무도 보스레이드를 시작한 기록이 없다면 시작 가능합니다.
- 시작한 기록이 있다면 마지막으로 시작한 유저가 보스레이드를 종료했거나, 시작한 시간으로부터 레이드 제한시간만큼 경과되었어야 합니다.

## 캐시 적용

보스 레이드를 성공하면 레이드 레벨에 맞는 점수를 얻는다. 랭킹 API는 유저 별 레이드 점수의 총합으로 순위를 정한다. 요구사항을 보면 보스를 레이드 하는 시간은 3분만 허용한다. 3분마다 한번씩만 시도할 수 있고 레이드를 성공해야 랭킹이 변경된다. **ranking이 변동되는 경우보다 현재 rankig을 불러오는 작업이 더 많을거라 예상을 했다**.

랭킹은 데이터베이스에서 sum을 이용해서 구하기 때문에 데이터가 많아질수록 구하는 시간이 오래걸린다. 변동은 자주 없으며 구하는데 시간은 오래 걸리고 자주 요청되는 상황, 캐시를 사용하면 좋은 상황이다.

### Redis

랭킹 데이터를 서버에서 캐싱을 하다가 서버가 죽어버리면 캐싱이 무효화된다. 서버에 좌지우지 되는 상황이어서 분리하는 것이 안정적이다

in-memory 저장소 기술 가운데 redis를 선택하였는데 이유는 사용자가 많아서이다. ‘사용자가 많다’는 상대적으로 다른 기술보다 안전이 보장되고 자료가 풍부하다는 것을 의미한다. 서비스 운영중에 가장 안좋게 생각하는 경우는 사용하는 기술이 기술 지원이 끊기거나 오픈 소스라면 커뮤니티 활동이 저조하고 자료가 없는 것을 가장 안좋게 생각한다.

memcached도 많이 사용하지만 내 기준에는 redis가 더 좋았다. 둘의 차이는 아래 글에 나와있다

[Redis vs. Memcached | AWS](https://aws.amazon.com/ko/elasticache/redis-vs-memcached/)

## Sequelize 아쉬운 점

row_number라는 mysql 함수를 사용하려고 하는데 내가 의도한 sql문으로 변환을 하지 않는다.

```jsx
// fn('mysql 함수 이름', '함수에 적용될 컬럼 이름')
Sequelize.fn(`ROW_NUMBER() OVER`, Sequelize.col('ORDER BY totalScore')),
```

위와 같이 ORDER BY 키워드가 같이 들어가야 하는 경우에 sql syntax 에러를 내뿜는다. 직접 쿼리를 작성해서 해결하였다

또 하나의 아쉬운점은 공식문서가 정확하지 않다. 동시성 처리를 위해서 공식 문서 내용대로 optimistic lock을 설정했지만 동작하지 않는다. 직접 lock을 걸어서 해결해야했다

## 거의 동시에 여러 개의 요청이 왔을 때

요구 사항으로 오직 한명만 보스 레이드를 시작할 수 있고 3분 동안 누구도 레이드를 진행할 수 없다. 보스 레이드 이벤트가 시작되면 **동시에 여러 개의 요청이 한꺼번에 올 수 있는 상황**이다. 이를 해결하기 위해 다음과 같은 방법을 사용하였다.

## 낙관적 락

다양한 프레임워크가 이를 지원하는데 version 값을 두어서 트랜잭션이 커밋할 때 version이 변경되었는지 아닌지를 확인후 시작할 때 version이 그대로라면(다른 트랜잭션이 데이터를 수정하지 않았다면) 트랜잭션은 커밋을 하고 그렇지 않는다면 롤백을 한다.

https://product.kyobobook.co.kr/detail/S000001766328

낙관적락으로 해결하려고 했지만 상황이 여의치 않았다. 사용하는 ORM 공식문서에 나와있는데로 version을 설정했지만 설명대로 특정 예외를 발생시키지 않아서 사용할 수 없었다.

https://sequelize.org/docs/v6/other-topics/optimistic-locking/

### 락 보관 역할을 하는 테이블 추가

잠금을 얻기 위한 테이블을 추가하였다. 잠금에 대한 row를 생성하고 row의 특정 컬럼이 false이면 레이드 로그 테이블에 행을 삽입한다. 이 방법으로 동시성을 해결하였는데 단점은 어플리케이션의 모델 부분의 코드가 지저분해진다. 동시성을 제어하기 위한 코드가 모델 코드에 들어가기 때문이다.

## 부하테스트

요구 조건 가운데 하나는 한번에 한명만 보스 레이드를 진행할 수 있는 것이다. **이 테스트의 목적은 동시에 요청이 들어와도 하나만 정상 처리를 하는지 확인하는 것이다**

### 결과

![동시 사용자 100명으로 부하테스트](./image/2022-09-21-10-56-53.png)

동시 사용자 100명으로 부하테스트

![동시 사용자 1000명으로 부하테스트](./image/2022-09-21-17-26-43.png)

동시 사용자 1000명으로 부하테스트

### 더 생각해볼 부분

한명이 레이드를 시작하면 3분 동안 들어오는 같은 요청을 처리할 필요가 없다. 똑같은 결과인데 데이터베이스를 조회할 필요는 없다. 웹 서버에 bossState라는 객체에 입장 가능여부를 캐싱해 놓고 같은 API가 들어오면 데이터베이스 조회 대신 바로 입장불가 응답을 보냈다

![스크린샷 2022-09-21 17-30-23.png](./image/2022-09-21-17-30-23.png)

## 비동기 작업 타이밍 맞추기

보스 레이드 도중에 서버가 죽었다가 다시 시작되면 어떤 상황이 발생할 수 있을까? non-blcoking으로 처리되기 때문에 캐싱을 다시 복구하기 전에 보스 레이드 API가 시작될 수 있다. 이를 막기 위해서 캐싱을 복구하고 서버의 포트를 연결하게 하고 싶다. 병렬로 실행하면서 순서를 유지하고 싶다

nodejs 비동기 처리 기능을 생각해보다가 Promise.all 메서드가 생각났다. promise 배열을 인자로 받고 모든 프로미스가 실행이 끝나면 callback으로 처리할 수 있다. 만약 하나라도 실패한다면 reject로 처리한다.

```jsx
Promise.all([externalAPIPromise, redisInitPromise]).then(async result => {
  const [bossState, redis] = result
  const bossRaidCache = {}
  await bossStateAPI.setBossStateTo(bossRaidCache, bossState, redis)

  const port = createServer(app)
  app.set('port', port)
  app.set('bossRaidCache', bossRaidCache)
})
```

## 🌐 API Document

https://app.swaggerhub.com/apis-docs/dimsssss/raid-api/1.0.0

## 🧾 실행

```shell
npm run dev
```
