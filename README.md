## pscale

```bash
pscale connect carrot-market

Error: database branch is not ready yet
```

7일동안 접속 안해서 끊긴거!
PlanetScale 접속 후 깨워주기 버튼 클릭

### db 변경후

```bash
npx prisma db push
```

### db 확인

```bash
npx prisma studio
```

### db 레코드에 새로운 컬럼을 추가했을때

We found changes that cannot be executed: // 에러 발생
해결 방법

1. 데이터베이스 삭제 후 재시작
2. 원래 있던 리뷰에 새 컬럼 넣지 않기(필수 아니게)
3. 기본값 넣어주기

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
