# PRD Step 1 — 냉장고 이미지 인식

## 개요
사용자가 냉장고 사진을 업로드하면 AI가 이미지를 분석하여 식재료 목록을 추출한다.

## 목표
- 이미지 업로드 UI 제공
- `google/gemma-3-27b-it:free` 모델로 식재료 인식
- 인식 결과를 구조화된 데이터(JSON)로 반환

---

## 기능 요구사항

### FR-1 이미지 업로드
- 파일 선택(drag & drop 포함) 또는 카메라 촬영으로 이미지 입력
- 지원 형식: JPG, PNG, WEBP
- 최대 파일 크기: 10MB
- 업로드 전 미리보기 표시

### FR-2 재료 인식 API 호출
- OpenRouter API (`google/gemma-3-27b-it:free`) 호출
- 프롬프트: 이미지 내 식재료를 한국어로 추출, JSON 배열로 반환 요청
- 응답 형식:
  ```json
  {
    "ingredients": [
      { "name": "당근", "quantity": "2개", "confidence": "high" },
      { "name": "두부", "quantity": "1모", "confidence": "medium" }
    ],
    "unidentified": ["불명확한 물체 1개"]
  }
  ```
- rate limit 발생 시 `gemma-3-12b-it:free` → `gemma-3-4b-it:free` 순으로 자동 폴백

### FR-3 인식 결과 표시
- 인식된 재료를 카드 형태로 목록 표시
- 사용자가 재료 추가/삭제/수정 가능 (인식 오류 보정)
- "레시피 추천받기" 버튼으로 Step 2 진행

---

## 비기능 요구사항
- API 응답 대기 중 로딩 스피너 표시
- 이미지는 base64로 인코딩하여 API 전송
- API 키는 서버사이드에서만 사용 (클라이언트에 노출 금지)

---

## UI 흐름

```
[이미지 업로드 영역]
        ↓ 파일 선택 or 드래그앤드롭
[미리보기 + "분석 시작" 버튼]
        ↓ API 호출 (로딩 중...)
[재료 목록 카드]
  - 당근 2개  [삭제]
  - 두부 1모  [삭제]
  + 재료 직접 추가
        ↓
[레시피 추천받기 →]
```

---

## 기술 스택
| 항목 | 선택 |
|------|------|
| 프레임워크 | Next.js (App Router) |
| 스타일 | Tailwind CSS |
| API 라우트 | Next.js Route Handler (`/api/recognize`) |
| 이미지 전송 | base64 인코딩 |
| 상태 관리 | React useState / Context |

---

## API 엔드포인트

### `POST /api/recognize`
**Request**
```json
{ "image": "<base64 문자열>", "mimeType": "image/jpeg" }
```
**Response**
```json
{
  "ingredients": [...],
  "unidentified": [...],
  "model": "google/gemma-3-27b-it:free"
}
```
**Error**
```json
{ "error": "인식 실패 메시지" }
```

---

## 완료 기준 (Definition of Done)
- [ ] 이미지 업로드 및 미리보기 동작
- [ ] API 호출 후 재료 목록 렌더링
- [ ] 재료 추가/삭제/수정 동작
- [ ] 폴백 모델 자동 전환 동작
- [ ] API 키 서버사이드 보호 확인
