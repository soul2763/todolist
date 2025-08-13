# SchedulerApp 📅

React Native로 개발된 고급 스케줄러 앱입니다. 직관적인 캘린더 인터페이스와 강력한 일정 관리 기능을 제공하는 모바일 애플리케이션입니다.

## 🚀 주요 기능

### 📅 **캘린더 뷰**
- **일간/주간/월간 뷰**: 다양한 시간 단위로 일정 확인
- **인터랙티브 캘린더**: 날짜 선택, 길게 누르기로 일정 추가
- **시각적 표시**: 일정이 있는 날짜에 컬러 점 표시
- **주말 구분**: 주말 색상으로 구분하여 가독성 향상

### 📝 **일정 관리**
- **일정 추가/편집/삭제**: 완전한 CRUD 기능
- **카테고리 시스템**: 업무, 개인, 가족, 기타로 분류
- **우선순위 설정**: 높음(🔴), 중간(🟠), 낮음(🟢) 3단계
- **상태 관리**: 예정, 진행중, 완료 상태 추적
- **반복 설정**: 매일, 매주, 매월, 매년 반복 일정

### ⏰ **시간 관리**
- **시작/종료 시간**: 정확한 시간 범위 설정
- **기간 일정**: 하루를 넘어가는 일정 지원
- **알람 기능**: 5분, 10분, 30분, 1시간, 하루 전 알림 (현재 비활성화)

### 🔍 **검색 및 필터링**
- **실시간 검색**: 제목과 내용으로 일정 검색
- **카테고리별 필터**: 카테고리별 일정 조회
- **날짜별 필터**: 특정 날짜의 일정만 표시

### 🎨 **사용자 경험**
- **모던 UI**: React Native Paper 기반 Material Design
- **반응형 디자인**: 다양한 화면 크기 지원
- **직관적 인터페이스**: 터치 제스처와 시각적 피드백

## 🛠 기술 스택

### **프레임워크 & 라이브러리**
- **React Native** 0.79.2 - 크로스 플랫폼 모바일 앱 개발
- **React** 19.0.0 - 최신 React 버전
- **TypeScript** 5.0.4 - 타입 안전성과 개발 생산성

### **네비게이션 & UI**
- **React Navigation** 7.x - 화면 간 이동 및 네비게이션
- **React Native Paper** 5.14.4 - Material Design 컴포넌트
- **React Native Vector Icons** 10.2.0 - 아이콘 라이브러리

### **데이터 & 상태 관리**
- **AsyncStorage** 2.2.0 - 로컬 데이터 영속성
- **React Context** - 전역 상태 관리
- **Date-fns** 4.1.0 - 날짜 처리 및 포맷팅

### **캘린더 & 알림**
- **React Native Calendars** 1.1312.0 - 캘린더 컴포넌트
- **DateTimePicker** 8.3.0 - 날짜/시간 선택기
- **Push Notification** 1.11.0 - 푸시 알림 (현재 비활성화)

### **개발 도구**
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Jest** - 테스트 프레임워크

## 📱 앱 구조

```
src/
├── components/              # 재사용 가능한 컴포넌트
│   ├── AddScheduleDialog.tsx    # 일정 추가 다이얼로그
│   └── ScheduleDetailDialog.tsx # 일정 상세 보기 다이얼로그
├── context/                 # React Context
│   └── ScheduleContext.js      # 일정 데이터 상태 관리
├── navigation/              # 네비게이션 설정
│   └── AppNavigator.js         # 스택 네비게이션 구성
├── screens/                 # 화면 컴포넌트
│   ├── HomeScreen.tsx          # 메인 홈 화면 (캘린더 + 일정 목록)
│   ├── EditScheduleScreen.js   # 일정 편집 화면
│   └── ScheduleDetailScreen.js # 일정 상세 화면
├── services/                # 서비스 레이어
│   └── AlarmService.js         # 알람 관리 서비스 (현재 비활성화)
├── styles/                  # 스타일 정의
│   └── HomeScreenStyles.ts    # 홈 화면 스타일
└── types/                   # TypeScript 타입 정의
    ├── index.ts                 # 주요 타입 정의
    └── react-native-vector-icons.d.ts # 아이콘 타입 정의
```

## 🚀 프로젝트 실행 방법

### 사전 요구사항

- **Node.js** 18 이상
- **React Native CLI** 설치
- **Android Studio** (Android 개발용)
- **Xcode** (iOS 개발용, macOS 필요)
- **USB로 연결된 기기** 또는 **에뮬레이터/시뮬레이터**

### 1단계: 프로젝트 클론 및 의존성 설치

```bash
# 프로젝트 클론
git clone [repository-url]
cd SchedulerApp

# 의존성 설치
npm install
```

### 2단계: iOS 의존성 설치 (macOS만)

```bash
cd ios
pod install
cd ..
```

### 3단계: Metro 서버 시작

```bash
# Metro 번들러 시작
npx react-native start
```

### 4단계: 앱 실행

새 터미널 창을 열고 다음 명령어 실행:

```bash
# Android 앱 실행
npx react-native run-android

# iOS 앱 실행 (macOS만)
npx react-native run-ios
```

### 5단계: 개발 중 유용한 명령어

```bash
# 앱 리로드
# Metro 터미널에서 'r' 키 입력

# 개발자 메뉴 열기
# Metro 터미널에서 'd' 키 입력

# DevTools 열기
# Metro 터미널에서 'j' 키 입력

# 캐시 초기화
npx react-native start --reset-cache
```

## 📱 앱 사용법

### 🏠 **홈 화면**
- **캘린더 뷰**: 월간 캘린더로 전체 일정 파악
- **뷰 모드 전환**: 일간/주간/월간 뷰로 시간 단위 변경
- **일정 목록**: 선택된 기간의 일정을 우선순위별로 정렬
- **빠른 추가**: FAB 버튼으로 새 일정 즉시 추가

### ➕ **일정 추가**
- **기본 정보**: 제목, 설명, 시작/종료 시간
- **카테고리 선택**: 업무/개인/가족/기타 중 선택
- **우선순위 설정**: 3단계 우선순위로 중요도 표시
- **반복 설정**: 반복 없음, 매일, 매주, 매월, 매년
- **알람 설정**: 일정 전 알림 시간 설정 (현재 비활성화)

### ✏️ **일정 편집**
- **상세 정보 수정**: 모든 일정 정보 변경 가능
- **상태 변경**: 예정 → 진행중 → 완료 상태 전환
- **일정 삭제**: 불필요한 일정 영구 제거

### 🔍 **일정 검색**
- **실시간 검색**: 타이핑과 동시에 결과 표시
- **제목/내용 검색**: 두 필드 모두에서 키워드 검색
- **필터링**: 카테고리별, 날짜별 일정 필터링

## 🔧 문제 해결

### **일반적인 문제들**

#### "Unable to load script" 오류
```bash
# 1. Metro 서버 상태 확인
npx react-native start

# 2. 포트 8081 사용 중인 프로세스 확인
netstat -ano | findstr :8081

# 3. Node.js 프로세스 종료
taskkill /f /im node.exe

# 4. 캐시 초기화
npx react-native start --reset-cache
```

#### **Android 빌드 오류**
```bash
# 1. Android 프로젝트 클린
cd android
./gradlew clean
cd ..

# 2. node_modules 재설치
rm -rf node_modules
npm install

# 3. Metro 캐시 초기화
npx react-native start --reset-cache
```

#### **iOS 빌드 오류**
```bash
# 1. iOS 프로젝트 클린
cd ios
xcodebuild clean
cd ..

# 2. Pod 재설치
cd ios
pod deintegrate
pod install
cd ..
```

### **개발 환경 문제**

#### **포트 충돌 해결**
```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID [PID] /F

# macOS/Linux
lsof -ti:8081 | xargs kill -9
```

#### **메모리 부족 문제**
```bash
# Node.js 메모리 제한 증가
export NODE_OPTIONS="--max-old-space-size=4096"
```

## 📁 프로젝트 구조 상세

### **핵심 컴포넌트 설명**

#### **HomeScreen.tsx**
- 메인 화면으로 캘린더와 일정 목록을 통합
- 일간/주간/월간 뷰 모드 지원
- 드래그 앤 드롭으로 일정 추가
- 반응형 레이아웃과 최적화된 렌더링

#### **ScheduleContext.js**
- 전역 상태 관리 및 비즈니스 로직
- AsyncStorage를 통한 데이터 영속성
- 일정 CRUD 작업 및 검색 기능
- 카테고리 및 설정 관리

#### **AddScheduleDialog.tsx**
- 모달 형태의 일정 추가 인터페이스
- 폼 검증 및 에러 처리
- 날짜/시간 선택기 통합
- 카테고리 및 우선순위 선택

### **데이터 모델**

#### **Schedule 타입**
```typescript
type Schedule = {
  id?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  categoryId: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  isCompleted?: boolean;
  repeat?: string;
  repeatEndDate?: string;
  alarmEnabled?: boolean;
  alarmTime?: string;
};
```

#### **Category 타입**
```typescript
type Category = {
  id: string;
  name: string;
  color: string;
};
```

### **데이터 저장**
- **AsyncStorage**: 로컬 데이터베이스로 일정 정보 저장
- **JSON 직렬화**: 일정 객체를 문자열로 변환하여 저장
- **자동 동기화**: 앱 재시작 시 데이터 자동 복원

## 🎯 개발 환경

### **지원 플랫폼**
- **Android**: API 21+ (Android 5.0+)
- **iOS**: iOS 12.0+
- **개발 OS**: Windows 10, macOS, Linux

### **권장 사양**
- **Node.js**: 18.x LTS
- **React Native**: 0.79.2
- **Android Studio**: Arctic Fox 이상
- **Xcode**: 13.0 이상 (macOS만)

### **테스트 환경**
- **Jest**: 단위 테스트 프레임워크
- **React Native Testing Library**: 컴포넌트 테스트
- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅

## 🚧 현재 상태 및 향후 계획

### **구현 완료된 기능**
✅ 일정 CRUD 작업  
✅ 캘린더 뷰 (일간/주간/월간)  
✅ 카테고리 시스템  
✅ 우선순위 및 상태 관리  
✅ 반복 일정 설정  
✅ 검색 및 필터링  
✅ 반응형 UI/UX  

### **개발 중인 기능**
🔄 알람 시스템 (현재 비활성화)  
🔄 푸시 알림  
🔄 데이터 백업/복원  

### **향후 계획**
📋 클라우드 동기화  
📋 다중 사용자 지원  
📋 통계 및 분석  
📋 위젯 지원  
📋 다크 모드  

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. **프로젝트 포크**: GitHub에서 프로젝트를 포크합니다
2. **기능 브랜치 생성**: `git checkout -b feature/AmazingFeature`
3. **변경사항 커밋**: `git commit -m 'Add some AmazingFeature'`
4. **브랜치 푸시**: `git push origin feature/AmazingFeature`
5. **Pull Request 생성**: GitHub에서 PR을 생성합니다

### **기여 가이드라인**
- 코드 스타일은 Prettier 설정을 따릅니다
- 새로운 기능은 TypeScript로 작성합니다
- 테스트 코드를 포함하여 PR을 제출합니다
- 커밋 메시지는 명확하고 설명적으로 작성합니다

## 📞 지원 및 문의

- **이슈 리포트**: GitHub Issues에서 버그나 기능 요청
- **문서**: 이 README와 코드 주석 참조
- **커뮤니티**: 프로젝트 토론 및 질문

---

**SchedulerApp** - 효율적인 일정 관리를 위한 모던 모바일 앱 📱✨

*React Native로 구축된 강력하고 직관적인 스케줄러*
