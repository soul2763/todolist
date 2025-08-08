# SchedulerApp 📅

React Native로 개발된 스케줄러 앱입니다. 일정을 추가, 편집, 검색할 수 있는 모바일 애플리케이션입니다.

## 🚀 주요 기능

- **일정 관리**: 일정 추가, 편집, 삭제
- **우선순위 설정**: 높음, 중간, 낮음 우선순위 설정
- **일정 검색**: 제목과 내용으로 일정 검색
- **상세 보기**: 일정 상세 정보 확인
- **로컬 저장**: AsyncStorage를 사용한 데이터 영속성

## 🛠 기술 스택

- **React Native** 0.79.2
- **React Navigation** - 네비게이션
- **React Native Paper** - UI 컴포넌트
- **AsyncStorage** - 로컬 데이터 저장
- **React Native Calendars** - 캘린더 기능
- **Date-fns** - 날짜 처리

## 📱 앱 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   └── AddScheduleDialog.js
├── context/            # React Context
│   └── ScheduleContext.js
├── navigation/         # 네비게이션 설정
│   └── AppNavigator.js
└── screens/           # 화면 컴포넌트
    ├── HomeScreen.js
    ├── AddScheduleScreen.js
    ├── EditScheduleScreen.js
    ├── ScheduleDetailScreen.js
    └── SearchScreen.js
```

## 🚀 프로젝트 실행 방법

### 사전 요구사항

- Node.js 18 이상
- React Native 개발 환경 설정
- Android Studio (Android 개발용)
- USB로 연결된 Android 기기 또는 에뮬레이터

### 1단계: 의존성 설치

```bash
npm install
```

### 2단계: Metro 서버 시작

```bash
# Metro 번들러 시작
npx react-native start
```

### 3단계: 앱 실행

새 터미널 창을 열고 다음 명령어 실행:

```bash
# Android 앱 실행
npx react-native run-android
```

### 4단계: 개발 중 유용한 명령어

```bash
# 앱 리로드
# 터미널에서 'r' 키 입력

# 개발자 메뉴 열기
# 터미널에서 'd' 키 입력

# DevTools 열기
# 터미널에서 'j' 키 입력
```

## 📱 앱 사용법

### 홈 화면
- 일정 목록 확인
- 새 일정 추가 버튼
- 일정 검색 기능

### 일정 추가
- 제목, 내용, 날짜, 우선순위 설정
- 저장 버튼으로 일정 생성

### 일정 편집
- 기존 일정 수정
- 삭제 기능

### 일정 검색
- 제목과 내용으로 검색
- 실시간 검색 결과

## 🔧 문제 해결

### "Unable to load script" 오류
1. Metro 서버가 실행 중인지 확인
2. 포트 8081이 사용 중인지 확인
3. 앱을 완전히 종료하고 다시 실행

### 포트 충돌 해결
```bash
# 포트 8081 사용 중인 프로세스 확인
netstat -ano | findstr :8081

# Node.js 프로세스 종료
taskkill /f /im node.exe
```

### 캐시 초기화
```bash
# Metro 캐시 초기화
npx react-native start --reset-cache
```

## 📁 프로젝트 구조 상세

### 주요 파일 설명

- `App.tsx`: 앱의 진입점
- `src/context/ScheduleContext.js`: 일정 데이터 상태 관리
- `src/navigation/AppNavigator.js`: 네비게이션 설정
- `src/screens/HomeScreen.js`: 메인 홈 화면
- `src/components/AddScheduleDialog.js`: 일정 추가 다이얼로그

### 데이터 저장
- AsyncStorage를 사용하여 로컬에 일정 데이터 저장
- 앱 재시작 시에도 데이터 유지

## 🎯 개발 환경

- **OS**: Windows 10
- **Node.js**: 18+
- **React Native**: 0.79.2
- **Android**: API 36 (Android 14)

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. 프로젝트를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

---

**SchedulerApp** - 효율적인 일정 관리를 위한 모바일 앱 📱✨
