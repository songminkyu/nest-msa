# NEST-SEED

NestJS 기반 프로젝트 시작을 위한 통합 템플릿으로, 다음과 같은 특징을 가집니다:

- **Docker 기반 개발 환경**: 컨테이너화된 완전한 개발 환경을 지원합니다.
- **데이터베이스 통합**: MongoDB 및 Redis에 대한 사전 구성된 설정을 포함합니다.
- **테스트 커버리지**: 모든 코드에 Jest 기반 단위/통합 테스트 코드를 제공합니다.
- **고성능 테스트 실행**: Jest의 병렬 실행 기능을 활용해 빠른 테스트 수행이 가능합니다.
- **계층화 아키텍처**: 관심사 분리를 위한 3-Layer 아키텍처를 적용했습니다.
- **MSA 지원**: NATS 메시지 브로커를 활용한 마이크로서비스 아키텍처 기반 구성이 가능합니다.
- **E2E 테스트 자동화**: Bash 스크립트 기반의 종단 간 테스트 시스템을 구축했습니다.
- **설계 문서화**: PlantUML로 작성된 상세 아키텍처 다이어그램을 포함합니다.

## 1. 실행 환경

이 프로젝트를 실행하기 위해서는 호스트 환경에 다음과 같은 필수 구성 요소가 필요합니다:

- **CPU**: 4코어 이상
- **메모리**: 16GB 이상
    - 16GB 미만이라면 Jest 실행 시 `--runInBand` 옵션을 사용해 메모리 사용량을 줄일 수 있습니다.
    - CPU 코어 수가 메모리에 비해 많다면 `jest.config.ts`에서 `maxWorkers` 값을 `(RAM / 4)`로 조정하는 것을 권장합니다. (예: 8GB RAM 환경이면 2 workers 설정)
- **Docker**
- **VSCode 및 확장 프로그램**
    - Dev Containers (ms-vscode-remote.remote-containers)

> Windows 환경에서는 호환성 문제가 생길 수 있으므로, VMware로 Ubuntu를 구동한 뒤 그 안에서 VSCode를 사용하는 방식을 권장합니다.

## 2. 프로젝트의 구조

이 프로젝트는 NestJS, Docker, 마이크로서비스 패턴 등을 종합적으로 활용할 수 있도록 설계된 **범용 백엔드 템플릿**입니다. 예시 도메인으로 영화 예매 시스템을 채택한 이유는 회원 가입, 예약, 결제 등 **다양하고 일반적인 기능을 포괄**하기 때문입니다.

현재는 3~4인의 소규모 팀을 가정했으나, 프로젝트의 규모가 커지면 `booking`, `purchase-process` 등 각 서비스를 **별도의 독립 프로젝트**로 분리하는 식으로 구성을 확장할 수 있습니다.

이 프로젝트는 여러 마이크로서비스로 구성되며, 크게 **`applications`**, **`cores`**, **`infrastructures`** 세 영역으로 분류됩니다.

- `applications`: 주요 비즈니스 로직을 담당
- `cores`: 고객/영화/티켓 관리 등 핵심 도메인 로직을 담당
- `infrastructures`: 결제나 파일 저장소 등 외부 서비스 연동을 담당

자세한 설계 방식과 구조는 [Design Guide](./docs/guides/design.guide.md)를 참고하세요.

TODO Gateway controller -> proxy -> Service controller -> service 순서로 호출되는 그림 첨부. 그림으로 해라 github에서 plantuml이 안 보인다.

```
src
├── apps
│   ├── __tests__                   # apps의 통합 테스트
│   ├── applications                # application 서비스를 모은 프로젝트
│   │   └── services
│   │       ├── booking             # 영화 티켓 예매 프로세스
│   │       ├── purchase-process    # 티켓 구매 프로세스
│   │       ├── recommendation      # 영화 추천
│   │       └── showtime-creation   # 상영 시간 등록
│   ├── cores                       # 핵심 기능 서비스를 모은 프로젝트
│   │   └── services
│   │       ├── customers           # 고객 인증 및 관리. 'name' 인덱스 설정. 서비스 분리. mock을 사용한 단위 테스트.
│   │       ├── movies              # 영화 관리(파일 업로드). 파일 업로드. 파일 url 생성.
│   │       ├── purchases           # 구매 관리.
│   │       ├── showtimes           # 상영 시간 관리. 다양한 쿼리
│   │       ├── theaters            # 극장 관리
│   │       ├── ticket-holding      # 티켓 선점 관리
│   │       ├── tickets             # 티켓 관리
│   │       └── watch-records       # 영화 관람 기록 관리
│   ├── gateway
│   │       └── controllers         # 클라이언트가 서비스를 사용할 수 있도록 REST API를 제공
│   ├── infrastructures             # 외부 서비스를 모은 프로젝트
│   │   └── services
│   │       ├── payments            # 외부 결제 시스템 연동과 결제 내역을 관리.
│   │       └── storage-files       # 파일 저장소와 저장된 파일 목록을 관리한다. AWS/GCP 등 사용하는 인프라에 맞게 변경해야 한다.
│   └── shared                      # 서비스들이 공통으로 사용하는 코드
│       ├── config                  # 설정 관련
│       ├── modules                 # 공통으로 사용하는 모듈들
│       └── pipes                   # 공통으로 사용하는 nestjs 파이프 등
└── libs                            # 특정 프로젝트에 종속되지 않는 공통 기능들
    ├── common                      # 공통 기능 모음
    └── testlib                     # 테스트 관련 기능 모음
```

## 3. 프로젝트 이름 변경

원하는 프로젝트 이름으로 변경하려면 다음 설정을 검토하고 수정합니다:

- .env.test
- package.json
    - name
- src/apps/shared/config/etc.ts
    - ProjectName

## 4. 개발 인프라 구성

이 프로젝트에서 사용하는 인프라를 변경하려면 다음 설정을 검토하고 수정합니다:

- .env.infra
    ```
    MONGO_IMAGE=mongo:8.0
    REDIS_IMAGE=redis:7.4
    NATS_IMAGE=nats:2.10-alpine
    APP_IMAGE=node:22-alpine
    ```
- .devcontainer/Dockerfile
    ```docker
    FROM node:22-bookworm
    ```
- .github/workflows/test-coverage.yaml
    ```yaml
    jobs:
    test-coverage:
        runs-on: ubuntu-24.04-arm
        container: node:22-bookworm
    ```

## 5. 개발 환경 구성

프로젝트 실행 및 디버깅을 위한 환경 설정 방법은 다음과 같습니다:

1. **개발 환경 설정**

    1. 호스트에서 [Git credentials](https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials)를 설정합니다.
    2. VSCode에서 "Reopen in Container"를 실행하면 환경이 자동 구성됩니다.

2. **환경 초기화**

    1. VSCode 메뉴: "View" → "Command Palette" → "Dev Containers: Rebuild Container"

## 6. 통합 테스트 및 디버깅

이 프로젝트는 MSA와 TDD를 지향하기 때문에 테스트를 실행해서 기능을 검증할 것을 권장합니다. 이유는 다음과 같습니다:

- MSA와 monorepo 구조로, 한 프로젝트를 실행하려면 관련된 여러 프로젝트를 모두 실행해야 하며, 이는 프로젝트가 커질수록 비효율적입니다.
- 통합 테스트는 모의(mock)를 최소화해서 작성했기 때문에 버튼 한 번으로 모든 서비스를 실제와 가깝게 테스트할 수 있습니다.

### 통합 테스트 실행 방법

1. VSCode에 `Jest Runner` 확장을 설치하면 Jest 테스트 코드 위에 `Run | Debug` 버튼이 나타납니다.

    <img src="./docs/images/jest-run-debug-button.png" alt="Jest 실행 버튼" width="344"/>

    - **Run**: 테스트를 실행하며, 콘솔에 로그를 출력하지 않습니다.
    - **Debug**: 디버거를 연결해 테스트를 실행하며, 콘솔에 로그를 출력합니다.
    - 만약 `Run | Debug` 버튼이 보이지 않는다면 Code Lens 옵션을 활성화 하세요.

2. `npm test`를 실행하면 통합 테스트 영역과 실행 횟수를 설정할 수 있습니다.

    ```sh
    /workspaces/nest-seed npm test

    > nest-seed@0.0.1 test
    > bash scripts/run-test.sh

    Select Test Suites
    > all
    apps
    common
    Enter number of runs (default 1):
    ```

## 7. 서비스 실행 및 디버깅

이 프로젝트는 서비스를 직접 실행하고 디버깅하는 방법을 권장하지 않습니다. 그럼에도 불구하고 서비스를 실행하고 디버깅을 해야 한다면 다음을 참고하세요.

- `/.vscode/launch.json`

## 8. 빌드 및 E2E 테스트

`npm run test:e2e`을 실행하면 프로젝트 빌드부터 실행까지 전체 과정을 테스트합니다. 빌드 및 실행에 필요한 자세항 사항은 이 명령에 사용된 스크립트를 참고합니다.

- ./Dockerfile
- ./docker-compose.yml
- ./scripts/run-apps.sh

## 9. 설계 문서

이 프로젝트는 PlantUML을 사용해서 설계했습니다. 설계 문서는 `./docs/designs`에 있으며 이것을 보려면 PlantUML(jebbs.plantuml) 확장을 설치해야 합니다.

<img src="./docs/images/design-sample.png" alt="PlantUML로 작성한 문서" width="588"/>

만약 PlantUML 문서가 보이지 않으면 다음을 참고하세요.

1. "PlantUML Preview"에서 md 파일 내 UML 다이어그램을 보려면 커서가 `@startuml`과 `@enduml` 사이에 있어야 합니다.
1. UML 다이어그램이 "Preview markdown"에서 나타나지 않으면 보안 설정이 필요할 수 있습니다.
    - 미리보기 화면 오른쪽 상단의 "..." 버튼을 클릭하여 "미리보기 보안 설정 변경"을 선택하세요.

## 10. 그 외

본 문서에서 다루지 않은 중요 정보는 아래 문서에 정리했습니다.

- [Design Guide](./docs/guides/design.guide.md)
- [Implementation Guide](./docs/guides/implementation.guide.md)
