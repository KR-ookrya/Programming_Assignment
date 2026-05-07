# AI 자기소개서 첨삭 앱

Claude AI를 활용해 자기소개서를 분석하고 전문적인 피드백을 제공하는 웹 애플리케이션입니다.

---

## 주요 기능

### 핵심 기능
| 기능 | 설명 |
|------|------|
| AI 첨삭 | Claude Opus AI가 자기소개서를 심층 분석하여 점수, 피드백, 첨삭본 제공 |
| 스트리밍 출력 | 분석 결과를 실시간으로 타이핑되듯 출력 (SSE 방식) |
| 직무/회사 맞춤 | 지원 직무와 회사를 입력하면 해당 맥락에 맞는 맞춤 첨삭 제공 |

### 추가 기능
| 기능 | 설명 |
|------|------|
| 글자 수 경고 | 권장 글자 수(1,000자) 초과 시 실시간 경고 표시 |
| 예시 불러오기 | 샘플 자기소개서를 클릭 한 번으로 자동 입력 |
| PDF 저장 | 첨삭 결과를 PDF 파일로 저장 |
| 추가 질문 | 첨삭 결과를 바탕으로 AI에게 후속 질문 가능 |
| 결과 복사 | 첨삭 결과 전체를 클립보드에 복사 |

---

## 첨삭 결과 구성

AI가 다음 5가지 항목으로 피드백을 제공합니다.

1. **종합 평가** - 자기소개서의 전반적인 수준과 첫인상
2. **점수** - 100점 만점 (내용의 구체성 / 문장 표현력 / 직무 적합성 / 차별화 포인트 각 25점)
3. **잘된 점** - 긍정적인 요소 목록
4. **개선이 필요한 부분** - 문제점과 구체적 해결 방법
5. **첨삭된 자기소개서** - 수치·성과 중심으로 개선된 완성본

---

## 시작하기

### 필수 조건
- Node.js 18 이상
- Anthropic API 키

### 설치 및 실행

```bash
# 1. 패키지 설치
npm install

# 2. 환경변수 설정 (.env 파일 생성)
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env

# 3. 서버 실행
npm start
```

### 접속
브라우저에서 http://localhost:3000 으로 접속

---

## 프로젝트 구조

```
프로그래밍(기말)/
├── server.js          # Express 서버 + Anthropic API 연동
├── package.json       # 프로젝트 설정 및 의존성
├── .env               # 환경변수 (API 키)
└── public/
    ├── index.html     # 프론트엔드 UI
    └── style.css      # 스타일시트
```

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 런타임 | Node.js |
| 서버 프레임워크 | Express.js |
| AI 모델 | Claude Opus 4.7 (Anthropic) |
| 스트리밍 방식 | Server-Sent Events (SSE) |
| 마크다운 렌더링 | marked.js |
| 스타일 | Vanilla CSS |

---

## API 엔드포인트

### `POST /api/analyze`
자기소개서 첨삭 요청

**Request Body**
```json
{
  "text": "자기소개서 본문 (필수, 50자 이상)",
  "jobTitle": "지원 직무 (선택)",
  "company": "지원 회사 (선택)"
}
```

**Response**
- `Content-Type: text/event-stream`
- 스트리밍 방식으로 분석 결과 전송

---

### `POST /api/followup`
첨삭 결과에 대한 후속 질문

**Request Body**
```json
{
  "originalText": "원본 자기소개서",
  "jobTitle": "지원 직무",
  "company": "지원 회사",
  "analysisResult": "이전 첨삭 결과 전문",
  "question": "추가 질문 내용 (5자 이상)"
}
```

**Response**
- `Content-Type: text/event-stream`
- 스트리밍 방식으로 답변 전송

---

## 단축키

| 단축키 | 동작 |
|--------|------|
| `Ctrl + Enter` | 첨삭 시작 / 질문 보내기 |

---

## 환경변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `ANTHROPIC_API_KEY` | Anthropic API 인증 키 | 필수 |
| `PORT` | 서버 포트 번호 | `3000` |
