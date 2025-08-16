// Express 모듈을 가져옵니다
const express = require('express');

// Express 앱을 생성합니다
const app = express();

// 포트 번호를 설정합니다 (환경변수가 있으면 사용하고, 없으면 3000)
const PORT = process.env.PORT || 3000;

// JSON 요청을 처리할 수 있도록 설정
app.use(express.json());

// 기본 라우트 - 홈페이지
app.get('/', (req, res) => {
  res.send('안녕하세요! Node.js와 Express 서버가 실행 중입니다! 🚀');
});

// API 테스트용 라우트
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API가 정상적으로 작동합니다!',
    timestamp: new Date().toISOString()
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
  console.log('서버를 중지하려면 Ctrl+C를 누르세요');
});
