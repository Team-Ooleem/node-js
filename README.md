# Node.js & Express 기본 프로젝트

Node.js와 Express를 학습하기 위한 최소한의 기본 설정 프로젝트입니다.

## 시작하기

### 1. 필요한 패키지 설치
```bash
npm install
```

### 2. 서버 실행
```bash
# 일반 실행
npm start

# 개발 모드 (파일 변경 시 자동 재시작)
npm run dev
```

### 3. 브라우저에서 확인
- 홈페이지: http://localhost:3000
- API 테스트: http://localhost:3000/api/test

## 파일 구조
```
node-js/
├── package.json    # 프로젝트 설정 및 의존성
├── app.js         # Express 서버 메인 파일
└── README.md      # 이 파일
```

## 주요 개념

### Express란?
- Node.js를 위한 웹 프레임워크
- 웹 서버를 쉽게 만들 수 있게 도와줌

### 라우트(Route)란?
- URL 경로와 HTTP 메서드에 따라 다른 응답을 하는 것
- 예: `app.get('/', ...)` - GET 요청으로 홈페이지에 접근할 때

### 포트(Port)란?
- 서버가 요청을 받는 통로
- 기본값: 3000번 포트

## 다음 단계로 학습할 것들
- [ ] 더 많은 라우트 추가하기
- [ ] 정적 파일 서빙 (HTML, CSS, JS)
- [ ] 템플릿 엔진 사용하기
- [ ] 데이터베이스 연결하기
- [ ] 미들웨어 사용하기
