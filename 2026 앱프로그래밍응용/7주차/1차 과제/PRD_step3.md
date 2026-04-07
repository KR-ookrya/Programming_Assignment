# PRD Step 3 — 사용자 프로필 & 레시피 저장

## 개요
사용자 계정을 생성하고, Step 2에서 생성된 레시피를 저장·관리하는 기능을 제공한다.

## 목표
- 이메일 기반 회원가입/로그인
- 레시피 저장, 조회, 삭제
- 개인 선호 설정 저장 (식이 제한 등 Step 2 옵션 기본값)

---

## 기능 요구사항

### FR-1 인증
- 이메일 + 비밀번호 회원가입 / 로그인
- 소셜 로그인: Google OAuth (선택)
- JWT 기반 세션 관리
- 비로그인 사용자도 Step 1~2 사용 가능, 저장 시도 시 로그인 유도

### FR-2 사용자 프로필
사용자가 설정할 수 있는 프로필 항목:

| 항목 | 설명 |
|------|------|
| 닉네임 | 표시 이름 |
| 기본 인원 수 | 레시피 생성 기본값 |
| 선호 음식 종류 | 한식 / 양식 등 (다중 선택) |
| 식이 제한 | 채식 / 글루텐 프리 등 (다중 선택) |
| 알레르기 재료 | 직접 입력 (Step 2 프롬프트에 자동 반영) |

### FR-3 레시피 저장
- Step 2 레시피 카드의 "저장하기" 버튼 클릭 시 DB에 저장
- 저장 항목: 제목, 설명, 재료, 조리 단계, 태그, 생성 일시, 사용 모델
- 동일 레시피 중복 저장 방지 (제목 + 재료 해시 기준)

### FR-4 저장된 레시피 관리
- 저장 목록 페이지: 카드 그리드 표시
- 필터: 태그 / 조리 시간 / 음식 종류
- 검색: 제목 또는 재료명으로 검색
- 레시피 삭제 (개별 / 선택 삭제)
- 레시피 상세 페이지: Step 2와 동일한 카드 UI 재사용

### FR-5 프로필 → Step 2 자동 연동
- 로그인 상태에서 Step 2 진입 시 프로필의 기본값이 옵션에 자동 적용
- 알레르기 재료는 레시피 생성 프롬프트에 자동으로 제외 조건 추가

---

## 비기능 요구사항
- 비밀번호는 bcrypt로 해싱하여 저장
- API 키는 서버 환경 변수에서만 사용
- 저장 레시피는 사용자별 격리 (다른 사용자 접근 불가)
- 모바일 반응형 UI

---

## UI 흐름

```
[헤더 — 로그인/회원가입 버튼]
        ↓ 로그인 성공
[헤더 — 프로필 아이콘 + "저장된 레시피"]

[저장된 레시피 페이지]
  [검색창] [필터 드롭다운]
  ┌──────┐ ┌──────┐ ┌──────┐
  │레시피1│ │레시피2│ │레시피3│
  └──────┘ └──────┘ └──────┘

[프로필 설정 페이지]
  닉네임: ___________
  기본 인원: [2인 ▼]
  선호 음식: [한식] [양식]
  알레르기: 견과류, 새우
  [저장]
```

---

## 기술 스택
| 항목 | 선택 |
|------|------|
| 인증 | NextAuth.js (Credentials + Google Provider) |
| DB | PostgreSQL (또는 SQLite — 로컬 개발) |
| ORM | Prisma |
| 스키마 | User, Recipe, SavedRecipe |

---

## DB 스키마 (Prisma)

```prisma
model User {
  id            String        @id @default(cuid())
  email         String        @unique
  passwordHash  String?
  nickname      String?
  preferences   Json?         // { servings, cuisines, dietary, allergies }
  savedRecipes  SavedRecipe[]
  createdAt     DateTime      @default(now())
}

model SavedRecipe {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  title       String
  description String?
  ingredients Json
  steps       Json
  tags        String[]
  model       String
  createdAt   DateTime @default(now())

  @@unique([userId, title])
}
```

---

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/api/auth/register` | 회원가입 |
| `POST` | `/api/auth/login` | 로그인 |
| `GET` | `/api/profile` | 내 프로필 조회 |
| `PATCH` | `/api/profile` | 프로필 수정 |
| `GET` | `/api/recipes` | 저장 레시피 목록 |
| `POST` | `/api/recipes` | 레시피 저장 |
| `DELETE` | `/api/recipes/:id` | 레시피 삭제 |

---

## 완료 기준 (Definition of Done)
- [ ] 회원가입 / 로그인 / 로그아웃 동작
- [ ] 프로필 설정 저장 및 Step 2 자동 반영
- [ ] 레시피 저장 / 목록 조회 / 삭제 동작
- [ ] 필터 및 검색 동작
- [ ] 비로그인 사용자 저장 시 로그인 유도 모달 표시
- [ ] 타 사용자 레시피 접근 차단 확인
