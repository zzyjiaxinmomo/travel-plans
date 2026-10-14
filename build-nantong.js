// 从母版生成仓库发布版 nantong.html：
//   node build-nantong.js
// 母版：workspace/default/南通-旅行计划.html（CDN 版）
// 产物：本仓库 nantong.html（Leaflet 与景点图同源自托管，国内手机可达）
var fs = require('fs');
var path = require('path');

var root = __dirname;
var canonical = path.join(root, '..', 'default', '南通-旅行计划.html');
var s = fs.readFileSync(canonical, 'utf8');

// 1) Leaflet CSS：CDN 双链 → 本地同源单链
s = s.replace('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css">', '<link rel="stylesheet" href="leaflet/leaflet.css">');
s = s.replace('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/leaflet/1.9.4/leaflet.min.css">\n', '');

// 2) Leaflet JS：三级 CDN 加载链 → 本地同源
s = s.replace(/var JS = \[[\s\S]*?\];/, "var JS = ['leaflet/leaflet.js'];");

// 2.5) Google Fonts 国内不可达，直接去掉（字体栈有系统兜底）
s = s.replace('<link rel="preconnect" href="https://fonts.googleapis.com">\n', '');
s = s.replace('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n', '');
s = s.replace('<link href="https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&family=Noto+Serif+SC:wght@400;600;900&display=swap" rel="stylesheet">\n', '');

// 3) 景点图：Wikimedia 外链 → 仓库 img/
var IMG = {
  'https://commons.wikimedia.org/wiki/Special:FilePath/Nantong%20Railway%20Station%2001%202013-01.JPG?width=640': 'img/nt-station.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Andong%20Haohe.JPG?width=640': 'img/nt-haohe.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Nantong%20Langshan%20Scenic%20Spot%20%28Wolf%20Hill%29.jpg?width=640': 'img/nt-langshan.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Nantong%20Museum%202.jpg?width=640': 'img/nt-museum.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Dasheng%20Cotton%20Mill%20in%20Nantong%2C%20Jiangsu%2C%20China%2020260220-1.jpg?width=640': 'img/nt-tangzha.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/%E5%90%AF%E4%B8%9C%E5%B8%82%E4%B8%9C%E9%83%A8%E6%B5%B7%E5%A0%A4%E8%A7%82%E6%BD%AE%E5%8F%B0.jpg?width=640': 'img/nt-sea.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/%E4%BD%8D%E4%BA%8E%E5%90%95%E5%9B%9B%E9%B9%A4%E5%9F%8E%E5%85%AC%E5%9B%AD%E7%9A%84%E9%9B%86%E5%BA%86%E5%BA%B5.jpg?width=640': 'img/nt-lusi.jpg',
};
var replaced = 0;
Object.keys(IMG).forEach(function (u) {
  if (s.indexOf(u) !== -1) { s = s.split(u).join(IMG[u]); replaced++; }
});

fs.writeFileSync(path.join(root, 'nantong.html'), s);
console.log('OK nantong.html 已生成：Leaflet 本地化，图片本地化 ' + replaced + '/7，大小 ' + Math.round(s.length / 1024) + 'KB');
if (replaced < 7) { console.error('警告：有 ' + (7 - replaced) + ' 张图片 URL 未匹配，请检查母版与映射表'); process.exit(1); }
