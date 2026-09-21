# Frontend Convention

프론트엔드 코드 스타일과 Git 협업 규칙을 정리한 문서입니다.

## 1. 기술 환경

- React / JavaScript
- ESLint / Prettier
- GitHub
- 추가 라이브러리는 팀 공유 후 도입

---

## 2. 디렉터리 구조

```text
src/
├── api/              # API 요청
├── assets/           # 이미지, 아이콘
├── components/
│   ├── common/       # 공통 컴포넌트
│   └── feature/      # 기능별 컴포넌트
├── constants/        # 상수
├── hooks/            # 커스텀 훅
├── layouts/          # 공통 레이아웃
├── pages/            # 페이지
├── routes/           # 라우팅
├── styles/           # 전역 스타일
├── utils/            # 공통 함수
├── App.jsx
└── main.jsx
```

- 공통 UI → `components/common`
- 기능별 UI → `components/feature`
- API 요청 → `api`
- 공통 로직 → `hooks`, `utils`

---

## 3. 네이밍 규칙

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| 컴포넌트 / 페이지 | PascalCase | `LoginPage.jsx` |
| 함수 / 변수 | camelCase | `getUserProfile` |
| 커스텀 훅 | use + camelCase | `useModal.js` |
| 상수 | UPPER_SNAKE_CASE | `MAX_IMAGE_COUNT` |
| CSS 클래스 | kebab-case | `profile-container` |
| Boolean | is / has / can | `isLoading` |
| 이벤트 함수 | handle | `handleSubmit` |

의미를 알 수 있는 변수명과 함수명을 사용합니다.

---

## 4. API

- API 요청은 `api/`에서 관리
- 로딩 / 성공 / 실패 상태 처리
- API URL 및 Key 하드코딩 금지
- 환경변수는 `.env`에서 관리
- 민감 정보 GitHub 업로드 금지

---

## 5. Git 브랜치

### 브랜치 이름

| Type | 용도 |
| --- | --- |
| `feat` | 기능 구현 |
| `fix` | 오류 수정 |
| `design` | UI / CSS |
| `refactor` | 코드 개선 |
| `docs` | 문서 |
| `chore` | 설정 / 기타 |


## 6. Commit

### 커밋 형식

```text
[Type] : 작업 내용
```
---

## 7. Pull Request

### PR 제목

```text
[Feat] : 로그인 페이지 구현
```

### PR 본문

```markdown
## 작업 내용
- 로그인 페이지 UI 구현
- 로그인 API 연결

## 참고 이미지
<!-- UI 작업 시 첨부 -->
```

---

## 8. Merge 전 체크

- [ ] 기능 정상 동작
- [ ] 콘솔 오류 확인
- [ ] 민감 정보 포함 여부 확인
- [ ] ESLint / Prettier 확인
