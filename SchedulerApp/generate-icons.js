const fs = require('fs');
const path = require('path');

// 아이콘 크기 정의 (Android)
const androidSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

// 아이콘 크기 정의 (iOS)
const iosSizes = {
  'Icon-App-20x20@1x': 20,
  'Icon-App-20x20@2x': 40,
  'Icon-App-20x20@3x': 60,
  'Icon-App-29x29@1x': 29,
  'Icon-App-29x29@2x': 58,
  'Icon-App-29x29@3x': 87,
  'Icon-App-40x40@1x': 40,
  'Icon-App-40x40@2x': 80,
  'Icon-App-40x40@3x': 120,
  'Icon-App-60x60@2x': 120,
  'Icon-App-60x60@3x': 180,
  'Icon-App-76x76@1x': 76,
  'Icon-App-76x76@2x': 152,
  'Icon-App-83.5x83.5@2x': 167,
  'Icon-App-1024x1024@1x': 1024
};

// SVG 아이콘을 PNG로 변환하는 함수 (실제로는 외부 도구 사용 필요)
function generatePNGFromSVG(svgPath, outputPath, size) {
  // 실제 구현에서는 sharp, svg2png 등의 라이브러리 사용
  console.log(`Generating ${size}x${size} PNG from SVG...`);
  
  // 임시로 SVG를 복사 (실제로는 PNG 변환 필요)
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  
  // PNG 변환을 위한 간단한 HTML 파일 생성 (브라우저에서 변환 가능)
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>SVG to PNG Converter</title>
</head>
<body>
    <div id="svg-container" style="width: ${size}px; height: ${size}px;">
        ${svgContent}
    </div>
    <script>
        // Canvas를 사용한 SVG to PNG 변환
        const svg = document.querySelector('svg');
        const canvas = document.createElement('canvas');
        canvas.width = ${size};
        canvas.height = ${size};
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        const svgBlob = new Blob([svg.outerHTML], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = function() {
            ctx.drawImage(img, 0, 0, ${size}, ${size});
            canvas.toBlob(function(blob) {
                const a = document.createElement('a');
                a.download = 'icon-${size}.png';
                a.href = URL.createObjectURL(blob);
                a.click();
            });
        };
        img.src = url;
    </script>
</body>
</html>`;
  
  fs.writeFileSync('temp-converter.html', htmlContent);
  console.log(`Created temp-converter.html for ${size}x${size} conversion`);
}

// Android 아이콘 생성
function generateAndroidIcons() {
  console.log('Generating Android icons...');
  
  const androidResPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');
  
  Object.entries(androidSizes).forEach(([folder, size]) => {
    const folderPath = path.join(androidResPath, folder);
    const iconPath = path.join(folderPath, 'ic_launcher.png');
    const iconRoundPath = path.join(folderPath, 'ic_launcher_round.png');
    
    // 폴더가 없으면 생성
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    generatePNGFromSVG('app-icon.svg', iconPath, size);
    generatePNGFromSVG('app-icon.svg', iconRoundPath, size);
  });
}

// iOS 아이콘 생성
function generateIOSIcons() {
  console.log('Generating iOS icons...');
  
  const iosPath = path.join(__dirname, 'ios', 'SchedulerApp', 'Images.xcassets', 'AppIcon.appiconset');
  
  if (!fs.existsSync(iosPath)) {
    fs.mkdirSync(iosPath, { recursive: true });
  }
  
  Object.entries(iosSizes).forEach(([filename, size]) => {
    const iconPath = path.join(iosPath, `${filename}.png`);
    generatePNGFromSVG('app-icon.svg', iconPath, size);
  });
  
  // Contents.json 파일 생성
  const contentsJson = {
    "images": [
      {
        "filename": "Icon-App-20x20@1x.png",
        "idiom": "iphone",
        "scale": "1x",
        "size": "20x20"
      },
      {
        "filename": "Icon-App-20x20@2x.png",
        "idiom": "iphone",
        "scale": "2x",
        "size": "20x20"
      },
      {
        "filename": "Icon-App-20x20@3x.png",
        "idiom": "iphone",
        "scale": "3x",
        "size": "20x20"
      },
      {
        "filename": "Icon-App-29x29@1x.png",
        "idiom": "iphone",
        "scale": "1x",
        "size": "29x29"
      },
      {
        "filename": "Icon-App-29x29@2x.png",
        "idiom": "iphone",
        "scale": "2x",
        "size": "29x29"
      },
      {
        "filename": "Icon-App-29x29@3x.png",
        "idiom": "iphone",
        "scale": "3x",
        "size": "29x29"
      },
      {
        "filename": "Icon-App-40x40@1x.png",
        "idiom": "iphone",
        "scale": "1x",
        "size": "40x40"
      },
      {
        "filename": "Icon-App-40x40@2x.png",
        "idiom": "iphone",
        "scale": "2x",
        "size": "40x40"
      },
      {
        "filename": "Icon-App-40x40@3x.png",
        "idiom": "iphone",
        "scale": "3x",
        "size": "40x40"
      },
      {
        "filename": "Icon-App-60x60@2x.png",
        "idiom": "iphone",
        "scale": "2x",
        "size": "60x60"
      },
      {
        "filename": "Icon-App-60x60@3x.png",
        "idiom": "iphone",
        "scale": "3x",
        "size": "60x60"
      },
      {
        "filename": "Icon-App-76x76@1x.png",
        "idiom": "ipad",
        "scale": "1x",
        "size": "76x76"
      },
      {
        "filename": "Icon-App-76x76@2x.png",
        "idiom": "ipad",
        "scale": "2x",
        "size": "76x76"
      },
      {
        "filename": "Icon-App-83.5x83.5@2x.png",
        "idiom": "ipad",
        "scale": "2x",
        "size": "83.5x83.5"
      },
      {
        "filename": "Icon-App-1024x1024@1x.png",
        "idiom": "ios-marketing",
        "scale": "1x",
        "size": "1024x1024"
      }
    ],
    "info": {
      "author": "xcode",
      "version": 1
    }
  };
  
  fs.writeFileSync(path.join(iosPath, 'Contents.json'), JSON.stringify(contentsJson, null, 2));
}

// 메인 실행
function main() {
  console.log('🚀 Starting icon generation...');
  
  if (!fs.existsSync('app-icon.svg')) {
    console.error('❌ app-icon.svg not found!');
    return;
  }
  
  try {
    generateAndroidIcons();
    generateIOSIcons();
    console.log('✅ Icon generation completed!');
    console.log('📝 Note: You may need to manually convert the SVG to PNG using online tools or image editing software.');
    console.log('🔗 Recommended online tools:');
    console.log('   - https://convertio.co/svg-png/');
    console.log('   - https://cloudconvert.com/svg-to-png');
    console.log('   - https://www.svgviewer.dev/');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

main();
