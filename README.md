# raid

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

## 프로젝트 레이어 계층 분리

프로젝트 디렉터리 구조를 어떻게 나눌까 생각을 하다가 나누는 최소 단위를 도메인으로 결정하였다. 내가 아는 방법으로는 역할로 나누는 방법과 도메인으로 나누는 방법이 있는데 각각 특징이 있다. 확장성을 고려해서 나는 도메인 단위로 레이어를 분리하였다

### 역할 별 레이어 분리

웹 프로젝트는 크게 controller, service, repository로 나눌 수 있다. 이 구조로 프로젝트를 구성하면 위 3가지 요소 마다 각각의 디렉터리를 만들고 같은 종류의 파일을 갖는다. 이러한 구조를 레이어드 아키텍처, n-tier 아키텍처라고 한다.(이제부터 n-tier 아키텍처라고 지칭한다)

n-tier라고 하는 것은 계층의 수가 정해진게 아니고 계속 추가될 수 있다는 의미다. 레이어 수가 다른 여러 개의 n-tier 프로젝트가 있을 때 같은 n-tier라고 할 수 있는 이유는 공통적으로 위의 3계층을 꼭 포함하고 있는 것이다.

하나의 레이어는 다른 레이어에 단방향으로 의존을 한다. 컨트롤러는 서비스에 의존하고 서비스는 데이터베이스에 접근하는 DAO에 해당하는 리포지터리에 의존한다. 단 하나의 예외도 없이 동일해야하고 하나의 레이어가 추가 된다면 모든 기능에 레이어를 적용해야 한다.

내가 생각한 단점은 여기에 있다. 어떤 기능을 구현할 때 사용하지 않는 레이어가 있어도 무조건 해당 레이어를 구현해야 하는 것은 비효율적이다. 그 밖에 다른 특징들은 아래의 문서를 참고하면 좋다

[Software Architecture Patterns](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01.html)

### 도메인 별 레이어 분리

DDD 아키텍처라고 하는 디렉터리 구조다. 하나의 시스템이 구성하는 각각의 도메인 별로 디렉터리 구조를 나눈다. 각 디렉터리는 내부적으로 presentation(controller), domain(model), infra(외부 시스템), application(서비스)의 계층을 갖는다.

DDD는 마이크로서비스 아키텍처에서 언급된다.

시스템을 잘 설계했다면 하나의 도메인을 떼어내서 서비스할 수 있다. 마이크로서비스 아키텍처에서 DDD가 언급되는 이유다.

도메인에서도 여러 부분에 포함되는 도메인이 존재하는데 bounded context라고 지칭한다. 쇼핑몰 서비스에서 상품은 그 자체로 서비스로 사용할 수 있고 창고, 물류 도메인에서는 수량을 나타낼 수 있다. 다른 도메인에서 약간씩 다르게 적용해야하는 도메인이다

DDD 아키텍처를 선택하면 마이크로서비스 아키텍처를 구현하는데 수월하다

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

## 여러 개의 요청이 하나의 레이드를 시작하려고 할 때

요구 사항으로 오직 한명만 보스 레이드를 시작할 수 있고 3분 동안 누구도 레이드를 진행할 수 없다. 보스 레이드 이벤트가 시작되면 **동시에 여러 개의 요청이 한꺼번에 올 수 있는 상황**이다.

### 비관적락

트랜잭션이 충돌한다고 가정하고 먼저 락을 걸어버리는 기법이다. 데이터베이스가 지원하는 `select … for update` 키워드를 이용하여서 락을 제어한다.

비관적락은 요청을 rollback하지는 않기 때문에 현재 상황에서 사용하기는 어렵다. 여러명이 동시에 요청하면 순서대로 진행해야하는 것이 아니라 한명만 진행되고 나머지는 취소해야하기 때문이다

### 낙관적락

데이터에 versioning을 적용하여 읽어올 때의 version과 수정할 때의 version을 확인한다. 비관적 락과는 다르게 rollback으로 취소할 수 있다. 여러 명의 요청을 순서에 맞게 처리하는 것이 아니라 **최초의 커밋만을 인정**해야하기 때문에 현재 상황에 적절한 방법이다.

### 애매한 락?

예상치 못하게 낙관적락을 그대로 구현할 수 없었다. 사용하는 오픈소스에서 설명한대로 설정을 했지만 제대로 동작을 하지 않았다.(ORM model 생성 시 version이라는 속성을 주면 경합 시 특정 예외를 발생시킨다고 하였는데 그 특정 예외를 발생시키지 않았다)

<aside style = "background-color: #F1F1EF; color:black; word-break:break-all">
💡 
내가 사용하는 ORM의 트랜잭션 기능은 기본이 자동 커밋으로 되어있고 예외를 발생시키면 자동으로 rollback시킨다. update를 할 때 이전 값과 다른 값으로 변경되었다면 update된 row수를 반환하고 변경되지 않았다면 0을 반환한다

</aside>

내가 생각한 방법은 하나의 트랜잭션으로 다음 과정을 처리한다.

1. 보스 레이드가 가능한지 상태를 조회한다
2. 상태가 가능 상태면 락을 걸고 불가능으로 update를 한다.
3. update된 row수를 확인해서 처리되지 않았다면 예외를 직접 발생시킨다.
4. update가 되었다면 보스 레이드를 진행한 로그 데이터를 저장한다

rollback을 하니 낙관적락인것 같고 잠금을 사용해서 차례대로 진행을 하니 비관적락인 것도 같다.

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
