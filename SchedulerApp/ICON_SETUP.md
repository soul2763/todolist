# 🎨 SchedulerApp 아이콘 설정 가이드

## 📋 개요

이 가이드는 SchedulerApp에 커스텀 아이콘을 적용하는 방법을 설명합니다.

## 🎯 생성된 아이콘

`app-icon.svg` 파일에 다음과 같은 디자인의 아이콘이 생성되었습니다:

- **배경**: 파란색 그라데이션 원형 배경
- **캘린더**: 흰색 배경의 모던한 캘린더 디자인
- **시계**: 우상단에 위치한 시계 아이콘
- **일정 표시**: 캘린더 내부에 컬러풀한 점들로 일정 표시

## 🚀 빠른 설정 방법

### 1. SVG를 PNG로 변환

#### 온라인 도구 사용 (권장)

1. **Convertio** (https://convertio.co/svg-png/)
   - `app-icon.svg` 파일 업로드
   - 출력 크기: 1024x1024
   - PNG 형식으로 다운로드

2. **CloudConvert** (https://cloudconvert.com/svg-to-png)
   - SVG 파일 업로드
   - 다양한 크기로 일괄 변환 가능

3. **SVG Viewer** (https://www.svgviewer.dev/)
   - 브라우저에서 직접 변환

#### 로컬 도구 사용

```bash
# ImageMagick 설치 (macOS)
brew install imagemagick

# SVG를 PNG로 변환
convert app-icon.svg -resize 1024x1024 icon-1024.png
```

### 2. Android 아이콘 적용

#### 필요한 크기
- `mipmap-mdpi`: 48x48
- `mipmap-hdpi`: 72x72
- `mipmap-xhdpi`: 96x96
- `mipmap-xxhdpi`: 144x144
- `mipmap-xxxhdpi`: 192x192

#### 적용 방법

1. **각 크기별로 PNG 생성**
   ```bash
   # 예시: 48x48 크기 생성
   convert app-icon.svg -resize 48x48 icon-48.png
   ```

2. **Android 프로젝트에 복사**
   ```bash
   # 48x48 아이콘을 mdpi 폴더에 복사
   cp icon-48.png android/app/src/main/res/mipmap-mdpi/ic_launcher.png
   cp icon-48.png android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
   
   # 72x72 아이콘을 hdpi 폴더에 복사
   cp icon-72.png android/app/src/main/res/mipmap-hdpi/ic_launcher.png
   cp icon-72.png android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
   
   # 나머지 크기도 동일하게 적용
   ```

### 3. iOS 아이콘 적용

#### 필요한 크기
- `Icon-App-20x20@1x`: 20x20
- `Icon-App-20x20@2x`: 40x40
- `Icon-App-20x20@3x`: 60x60
- `Icon-App-29x29@1x`: 29x29
- `Icon-App-29x29@2x`: 58x58
- `Icon-App-29x29@3x`: 87x87
- `Icon-App-40x40@1x`: 40x40
- `Icon-App-40x40@2x`: 80x80
- `Icon-App-40x40@3x`: 120x120
- `Icon-App-60x60@2x`: 120x120
- `Icon-App-60x60@3x`: 180x180
- `Icon-App-76x76@1x`: 76x76
- `Icon-App-76x76@2x`: 152x152
- `Icon-App-83.5x83.5@2x`: 167x167
- `Icon-App-1024x1024@1x`: 1024x1024

#### 적용 방법

1. **Xcode에서 설정**
   - Xcode에서 `ios/SchedulerApp.xcworkspace` 열기
   - `SchedulerApp` 프로젝트 선택
   - `Images.xcassets` > `AppIcon` 선택
   - 각 크기별로 PNG 파일 드래그 앤 드롭

2. **수동 복사**
   ```bash
   # iOS 아이콘 폴더로 복사
   cp icon-20.png ios/SchedulerApp/Images.xcassets/AppIcon.appiconset/Icon-App-20x20@1x.png
   cp icon-40.png ios/SchedulerApp/Images.xcassets/AppIcon.appiconset/Icon-App-20x20@2x.png
   # ... 나머지 크기도 동일하게 적용
   ```

## 🛠️ 자동화 스크립트

### 스크립트 실행

```bash
# Node.js 스크립트 실행
node generate-icons.js
```

### 스크립트 기능

- SVG 파일 확인
- Android/iOS 아이콘 크기 정의
- 임시 HTML 변환기 생성
- 폴더 구조 자동 생성

## 📱 테스트

### Android 테스트
```bash
# Android 앱 빌드
cd android
./gradlew assembleDebug
```

### iOS 테스트
```bash
# iOS 앱 빌드
cd ios
pod install
npx react-native run-ios
```

## 🎨 아이콘 커스터마이징

### 색상 변경

`app-icon.svg` 파일에서 다음 색상을 수정할 수 있습니다:

```xml
<!-- 배경 그라데이션 -->
<linearGradient id="bgGradient">
  <stop offset="0%" style="stop-color:#2C5282"/>  <!-- 메인 색상 -->
  <stop offset="100%" style="stop-color:#1A365D"/> <!-- 어두운 색상 -->
</linearGradient>

<!-- 캘린더 색상 -->
<rect fill="#2C5282"/>  <!-- 캘린더 헤더 색상 -->

<!-- 시계 색상 -->
<linearGradient id="clockGradient">
  <stop offset="0%" style="stop-color:#A5D8FF"/>  <!-- 시계 배경 시작 -->
  <stop offset="100%" style="stop-color:#81C784"/> <!-- 시계 배경 끝 -->
</linearGradient>
```

### 디자인 수정

- 캘린더 크기: `rect x="200" y="300" width="624" height="424"`
- 시계 위치: `circle cx="750" cy="200" r="80"`
- 일정 점들: `circle cx="257" cy="437" r="6"`

## 🔧 문제 해결

### 일반적인 문제

1. **아이콘이 적용되지 않음**
   - 앱을 완전히 재빌드
   - 캐시 삭제 후 재시작

2. **아이콘이 흐릿함**
   - 고해상도 PNG 사용
   - 정확한 크기로 변환

3. **iOS에서 아이콘 오류**
   - Xcode에서 `AppIcon` 확인
   - 모든 크기가 올바르게 설정되었는지 확인

### 디버깅

```bash
# Android 빌드 로그 확인
cd android && ./gradlew assembleDebug --info

# iOS 빌드 로그 확인
cd ios && xcodebuild -workspace SchedulerApp.xcworkspace -scheme SchedulerApp -configuration Debug
```

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. 파일 경로가 올바른지 확인
2. PNG 파일이 손상되지 않았는지 확인
3. 앱을 완전히 재빌드했는지 확인

## 🎉 완료!

아이콘이 성공적으로 적용되면 앱을 실행하여 새로운 아이콘을 확인할 수 있습니다!

