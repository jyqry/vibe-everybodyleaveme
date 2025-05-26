# 🎯 EverybodyLeaveMe

> 🤖 **AI 바이브코딩으로 만들어진 프로젝트**  
> 이 Chrome 확장 프로그램은 AI 에이전트와의 대화로 완성되었습니다. 코드를 직접 수정하지 않고 프롬프트만으로 개발했습니다.

YouTube에서 댓글과 라이브 채팅을 숨겨 집중할 수 있는 Chrome 확장 프로그램입니다.

## ✨ 주요 기능

- **댓글 숨기기**: YouTube 동영상의 모든 댓글을 깔끔하게 숨깁니다
- **라이브 채팅 숨기기**: 라이브 스트림의 채팅을 숨겨 집중할 수 있습니다
- **토글 기능**: 확장 프로그램 아이콘을 클릭하여 기능을 쉽게 조절할 수 있습니다
- **설정 저장**: 브라우저를 다시 시작해도 설정이 유지됩니다
- **실시간 적용**: 페이지를 새로고침하지 않아도 즉시 적용됩니다

## 📦 설치 방법

### 개발자 모드로 설치 (권장)

1. Chrome 브라우저를 열고 `chrome://extensions/`로 이동합니다
2. 우측 상단의 **개발자 모드**를 활성화합니다
3. **압축해제된 확장 프로그램을 로드합니다** 버튼을 클릭합니다
4. 이 프로젝트 폴더를 선택합니다

### 아이콘 생성 (선택사항)

아이콘이 없다면 다음 단계를 따라 생성하세요:

1. `icons/create_icons.html` 파일을 브라우저에서 엽니다
2. 각 크기별로 **다운로드** 버튼을 클릭하여 아이콘을 저장합니다
3. 다운로드된 아이콘들을 `icons/` 폴더에 저장합니다

## 🎯 사용법

1. **확장 프로그램 설치** 후 YouTube에 접속합니다
2. **확장 프로그램 아이콘**을 클릭하여 팝업을 엽니다
3. **댓글 숨기기** 또는 **라이브 채팅 숨기기** 토글을 조작합니다
4. 설정이 즉시 적용되며 페이지 새로고침 없이 동작합니다

## 🔧 파일 구조

```
├── manifest.json          # 확장 프로그램 설정 파일
├── popup.html             # 팝업 UI
├── popup.js               # 팝업 로직
├── content.js             # YouTube 페이지 조작 스크립트
├── content.css            # 스타일 시트
├── background.js          # 백그라운드 서비스 워커
├── icons/                 # 확장 프로그램 아이콘들
│   ├── create_icons.html  # 아이콘 생성 도구
│   └── simple_icon.html   # 간단한 아이콘 생성기
├── README.md              # 이 파일
└── INSTALL_GUIDE.md       # 상세 설치 가이드
```

## 🛠️ 기술적 세부사항

### 지원하는 YouTube 요소

**댓글 섹션:**

- `#comments`
- `ytd-comments`
- `ytd-comments-header-renderer`
- `ytd-comment-thread-renderer`
- `ytd-comments-entry-point-header-renderer`

**라이브 채팅:**

- `#chat`
- `ytd-live-chat-frame`
- `yt-live-chat-app`
- `#panels-full-bleed-container`
- 라이브 채팅 iframe 및 패널 버튼

### 동작 원리

1. **MutationObserver**를 사용하여 DOM 변화를 실시간 감지
2. **CSS display: none**을 사용하여 요소를 숨김
3. **Chrome Storage API**를 사용하여 설정 저장
4. **Message Passing**을 통해 팝업과 콘텐츠 스크립트 간 통신
5. **영화관 모드 감지**로 모든 보기 모드에서 완벽 동작

## 🔍 문제 해결

### 댓글이 완전히 사라지지 않는 경우

1. 페이지를 새로고침해보세요
2. 확장 프로그램을 비활성화했다가 다시 활성화해보세요
3. 브라우저 개발자 도구(F12)에서 콘솔 오류를 확인해보세요

### 설정이 저장되지 않는 경우

1. Chrome의 확장 프로그램 권한을 확인해보세요
2. `chrome://extensions/`에서 확장 프로그램이 활성화되어 있는지 확인하세요

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

## 🤖 개발 과정 기록

### 1단계: 프로젝트 초기 요청

**사용자 입력:** "이 프로젝트는 chrome extension을 만들기 위한 프로젝트야. 프로젝트의 목표는 @https://www.youtube.com/ 에서 comment, live chat 등을 완전히 제거하는 것이야. extention 아이콘을 누르면 코멘트와 라이브채팅을 없애는 기능을 토글할 수 있어야해"

**변경사항:**

- `manifest.json` 생성 (Chrome 확장 프로그램 설정)
- `popup.html`, `popup.js` 생성 (팝업 UI 및 로직)
- `content.js`, `content.css` 생성 (YouTube 페이지 조작)
- `background.js` 생성 (백그라운드 서비스 워커)
- 아이콘 생성 도구 (`icons/create_icons.html`) 추가

### 2단계: 아이콘 오류 해결

**사용자 입력:** "Could not load icon 'icons/icon16.png' specified in 'icons'. 매니페스트를 로드할 수 없습니다."

**변경사항:**

- `manifest.json`에서 아이콘 참조 제거
- `icons/simple_icon.html` 생성 (간단한 아이콘 생성기)

### 3단계: 영화관 모드 라이브 채팅 문제 해결

**사용자 입력:** "라이브 방송의 경우, 라이브채팅은 보이지 않지만 영화관모드일 때 라이브채팅 영역이 남아있어"

**변경사항:**

- 영화관 모드 전용 CSS 선택자 추가
- `ytd-watch-flexy[theater]` 관련 처리 강화
- `checkTheaterMode()` 함수 추가

### 4단계: panels-full-bleed-container 제거

**사용자 입력:** "<div id="panels-full-bleed-container" class="style-scope ytd-watch-flexy"></div> 영역이 라이브채팅 때 생겨 이거 지워줘"

**변경사항:**

- `#panels-full-bleed-container` 선택자 추가
- CSS 규칙에 해당 컨테이너 제거 로직 추가

### 5단계: 기본 모드 레이아웃 문제 해결

**사용자 입력:** "최근 변경사항이 영화관 모드에서는 잘 동작하지만, 영화관 모드가 아닌 기본 보기 모드에서는 영역이 이상하게 보여"

**변경사항:**

- 기본 모드와 영화관 모드 구분 처리
- 기본 모드에서는 `#secondary` 영역 유지, 라이브 채팅만 제거
- 변수명 중복 오류 해결 (`theaterMode` → `isTheaterMode`, `currentTheaterMode`, `theaterModeActive`)

### 6단계: 불필요한 파일 정리

**사용자 입력:** "이제 사용하지 않는 모든 파일들을 리스트업하고 삭제해줘"

**변경사항:**

- `src/` 디렉토리 전체 삭제 (React 관련 파일들)
- Bun/TypeScript 설정 파일들 삭제 (`bun.lock`, `tsconfig.json` 등)
- `package.json`에서 불필요한 의존성 및 스크립트 제거
- Chrome 확장 프로그램 전용 구조로 정리

### 7단계: 부정적 뉘앙스 제거 및 이름 변경

**사용자 입력:** "금지 이모지와 아이콘이 부정적인 느낌을 줘. 부정적인 뉘앙스가 없는 문구를 사용해주고, package이름과 앱 이름을 everybodyleaveme 로 바꿔줘."

**변경사항:**

- 프로젝트명 변경: `youtube-comment-remover` → `everybodyleaveme`
- 아이콘 변경: 🚫 → 🎯
- 문구 변경: "제거" → "숨기기", "활성화/비활성화" → "숨김/표시"
- 키워드 변경: `comment-remover` → `focus`, `productivity`

### 8단계: README 파일 개선

**사용자 입력:** "readme_extension.md 에 이 코드는 바이브코딩으로 직접적인 코드 수정 없이 에이전트 프롬프트만으로 작성되었다는 내용을 톤에 맞게 작성해주고, 해당 내용을 가장 상단에 넣어줘. 기여하기 및 주의 내용은 제거해주고 파일명은 README.md 로 바꿔줘"

**변경사항:**

- `README_EXTENSION.md` → `README.md`로 파일명 변경
- 바이브코딩 소개 내용 추가
- "기여하기", "주의" 섹션 제거
- `package.json`의 zip 스크립트 업데이트

### 9단계: 문구 간소화

**사용자 입력:** "이 내용이 지나치게 꾸미는 문장이야. '새로운 개발 경험', '오직', '설계부터 구현까지', '실험적 프로젝트' 같은 문장이 그렇게 느껴져. 향후 개선 계획도 제거해줘"

**변경사항:**

- 바이브코딩 소개 문구 간소화
- 과장된 표현 제거
- "향후 개선 계획" 섹션 완전 제거
