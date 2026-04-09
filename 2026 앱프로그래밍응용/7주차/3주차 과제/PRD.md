# PRD — 랜덤 명언 생성기

## 1. 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 랜덤 명언 생성기 |
| 버전 | 1.0.0 |
| 작성일 | 2026-04-08 |
| 목적 | 버튼 클릭 시 랜덤 명언을 보여주는 단일 페이지 웹앱 |

---

## 2. 배경 및 목표

### 배경
JavaScript 기초 학습 과정에서 **배열**, **이벤트 처리**, **DOM 조작**을 실습하기 위한 3주차 과제이다.

### 목표
- 배열에 명언 데이터를 저장하고 인덱스로 접근하는 방법을 익힌다.
- `addEventListener`를 사용한 버튼 클릭 이벤트를 처리한다.
- `textContent`를 통해 DOM 요소의 텍스트를 동적으로 변경한다.

---

## 3. 기능 요구사항

### 3.1 핵심 기능

| ID | 기능 | 설명 | 우선순위 |
|----|------|------|----------|
| F-01 | 명언 배열 저장 | 명언(텍스트 + 저자) 15개 이상을 배열에 저장 | 필수 |
| F-02 | 랜덤 명언 표시 | 버튼 클릭 시 배열에서 랜덤으로 명언 선택 후 화면에 표시 | 필수 |
| F-03 | 연속 중복 방지 | 직전에 표시된 명언과 동일한 명언이 연속으로 나오지 않도록 처리 | 필수 |
| F-04 | 저자 표시 | 명언 아래에 저자 이름을 함께 표시 | 필수 |
| F-05 | 진행 카운터 | 현재 명언 번호 / 전체 명언 수를 표시 | 선택 |
| F-06 | 페이지 로드 자동 표시 | 페이지 진입 즉시 명언 한 개를 자동으로 표시 | 선택 |

### 3.2 UI/UX 요구사항

| ID | 요구사항 |
|----|----------|
| U-01 | 버튼은 클릭 가능한 영역이 충분해야 한다 (padding 최소 12px 이상) |
| U-02 | 명언 전환 시 페이드 애니메이션으로 시각적 피드백 제공 |
| U-03 | 모바일 환경에서도 레이아웃이 깨지지 않아야 한다 (반응형) |
| U-04 | 명언 텍스트 영역의 최소 높이를 고정하여 레이아웃 흔들림 방지 |

---

## 4. 기술 스택

| 항목 | 기술 |
|------|------|
| 마크업 | HTML5 |
| 스타일 | CSS3 (Flexbox, CSS Variables, Transition) |
| 로직 | Vanilla JavaScript (ES6+) |
| 외부 의존성 | 없음 (라이브러리 미사용) |

---

## 5. 파일 구조

```
3주차 과제/
└── index.html      # HTML + CSS + JS 단일 파일
```

---

## 6. 핵심 구현 포인트

### 6.1 데이터 구조
```js
const quotes = [
  { text: "명언 내용", author: "저자명" },
  ...
];
```

### 6.2 랜덤 선택 (중복 방지 포함)
```js
let lastIndex = -1;

function getRandomQuote() {
  let index;
  do {
    index = Math.floor(Math.random() * quotes.length);
  } while (index === lastIndex);
  lastIndex = index;
  return quotes[index];
}
```

### 6.3 DOM 조작
```js
document.getElementById('quote-text').textContent = quote.text;
document.getElementById('quote-author').textContent = `— ${quote.author}`;
```

### 6.4 이벤트 처리
```js
document.getElementById('btn-new-quote').addEventListener('click', displayQuote);
```

---

## 7. 비기능 요구사항

| 항목 | 기준 |
|------|------|
| 성능 | 버튼 클릭 후 300ms 이내에 새 명언 표시 완료 |
| 호환성 | Chrome, Edge, Firefox 최신 버전 지원 |
| 유지보수성 | 명언 추가 시 `quotes` 배열에 객체 한 줄만 추가하면 됨 |

---

## 8. 학습 체크리스트

- [x] 배열에 객체 형태로 데이터 저장
- [x] `Math.random()` + `Math.floor()`로 랜덤 인덱스 생성
- [x] `addEventListener('click', handler)`로 이벤트 바인딩
- [x] `getElementById`로 DOM 요소 선택
- [x] `textContent`로 텍스트 변경
- [x] CSS `transition`으로 UX 개선
