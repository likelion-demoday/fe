Frontend Convention

프론트엔드 코드 스타일과 Git 협업 규칙을 통일하기 위한 문서입니다.

1. 기술 환경

- React / JavaScript
- ESLint / Prettier
- GitHub
- 추가 라이브러리는 팀에 공유 후 도입

---

2. 디렉터리 구조

src/
├── api/              # API 요청
├── assets/           # 이미지, 아이콘 등
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

- 공통 UI → components/common
- 특정 기능에서만 사용 → components/feature
- API 요청 → api
- 반복 로직 → hooks 또는 utils
- 반복되는 고정값 → constants

---

3. 네이밍 규칙
대상	규칙	예시
컴포넌트/페이지	PascalCase	LoginPage.jsx
함수/변수	camelCase	getUserProfile
API/유틸 파일	camelCase	userApi.js
커스텀 훅	use + camelCase	useModal.js
상수	UPPER_SNAKE_CASE	MAX_IMAGE_COUNT
CSS 클래스	kebab-case	profile-container
Boolean	is/has/can/should	isLoading
이벤트 함수	handle	handleSubmit
이벤트 Props	on	onClick

의미 없는 data, value, temp 등의 이름은 지양합니다.

---

4. 컴포넌트 규칙

- 함수형 컴포넌트 사용
- Props 구조 분해 할당
- 파일명과 컴포넌트명 통일
- 한 컴포넌트는 하나의 역할 담당
- 반복되는 UI는 공통 컴포넌트로 분리
- 큰 컴포넌트는 UI/로직 기준으로 분리
- 직접 DOM 조작 대신 ref 사용
- 복잡한 중첩 삼항 연산자 지양
- 변경 가능한 배열에서 index를 key로 사용하지 않기

const UserCard = ({ user }) => {
  return <div>{user.name}</div>;
};


---

5. 코드 스타일

- 들여쓰기: 공백 2칸
- 문자열: 작은따옴표 '
- 세미콜론 사용
- 사용하지 않는 변수/import 제거
- Prettier 기준으로 포맷팅

Import 순서

// 1. 외부 라이브러리
import { useState } from 'react';

// 2. 내부 코드
import Button from '../components/common/Button';
import { getUser } from '../api/userApi';

// 3. 이미지 / 스타일
import './ProfilePage.css';


---

6. 상태 및 API

상태

- 한 컴포넌트에서만 사용 → 지역 상태
- 부모-자식 간 사용 → Props
- 여러 페이지에서 공유 → 전역 상태
- 같은 데이터를 여러 state에 중복 저장하지 않기

API

API 요청은 컴포넌트에 직접 작성하지 않고 api/에서 관리합니다.

// api/userApi.js
export const getUserProfile = async () => {
  const response = await fetch('/api/users/me');
  return response.json();
};

- 로딩 / 성공 / 실패 상태 처리
- 에러를 빈 catch로 무시하지 않기
- API URL, Key 하드코딩 금지
- 환경변수는 .env에서 관리
- .env 등 민감 정보 GitHub 업로드 금지
- Vite 클라이언트 환경변수는 VITE_ 사용

---

7. 스타일

- 공통 스타일과 컴포넌트 스타일 분리
- 반복되는 색상/간격 등은 공통 변수 사용
- 인라인 스타일은 동적 값이 필요한 경우에만 사용
- !important 지양
- 임시 하드코딩 값은 작업 완료 전 정리

---

8. Git 브랜치

feat/#12-login-page
fix/#24-modal-scroll
design/#31-main-page
refactor/#45-api-structure
Type	용도
feat	기능 구현
fix	오류 수정
design	UI/CSS
refactor	코드 구조 개선
docs	문서
chore	설정/기타

작업 순서

develop 최신화
    ↓
작업 브랜치 생성
    ↓
개발 및 Commit
    ↓
Push
    ↓
PR → develop
    ↓
Review → Merge

main, develop 직접 Push 금지

---

9. Commit

[Type] : 작업 내용

예시:

[Feat] : 로그인 기능 구현
[Fix] : 모달 스크롤 오류 수정
[Design] : 메인 페이지 반응형 적용
[Refactor] : 사용자 API 함수 분리
[Docs] : README 수정
[Chore] : ESLint 설정

- 하나의 커밋에는 하나의 작업
- 무엇을 변경했는지 구체적으로 작성
- 수정, 업데이트, 기능 추가처럼 모호한 메시지 지양

---

10. Pull Request

제목

[Feat] : 로그인 페이지 구현

본문

## 작업 내용
- 로그인 페이지 UI 구현
- 로그인 API 연결

## 확인 사항
- 로그인 성공/실패 확인
- 모바일 UI 확인

## 관련 이슈
- close #12

## 참고 이미지
<!-- UI 작업 시 첨부 -->

- 하나의 PR = 하나의 기능/작업
- UI 변경 시 이미지 또는 영상 첨부
- 관련 Issue 연결
- 충돌은 PR 작성자가 우선 해결

---

11. Merge 전 체크

- 기능 정상 동작
- 콘솔 오류 확인
- console.log 제거
- 사용하지 않는 코드/import 제거
- 불필요한 주석 코드 제거
- 환경변수/민감정보 확인
- 모바일 UI 확인
- 로딩/에러 상태 확인
* ESLint / Prettier 확인
