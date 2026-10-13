// 从母版生成仓库发布版 index.html：
//   node build-from-canonical.js
// 母版：workspace/default/镇江扬州-旅行计划.html（CDN 版，单文件可移植）
// 产物：本仓库 index.html（Leaflet 与景点图全部同源自托管，国内手机可达）
var fs = require('fs');
var path = require('path');

var root = __dirname;
var canonical = path.join(root, '..', 'default', '镇江扬州-旅行计划.html');
var s = fs.readFileSync(canonical, 'utf8');

// 1) Leaflet CSS：CDN 双链 → 本地同源单链
s = s.replace('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css">\n<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/leaflet/1.9.4/leaflet.min.css.css">', '<link rel="stylesheet" href="leaflet/leaflet.css">');
s = s.replace('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css">', '<link rel="stylesheet" href="leaflet/leaflet.css">');
s = s.replace('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/leaflet/1.9.4/leaflet.min.css">\n', '');

// 2) Leaflet JS：三级 CDN 加载链 → 本地同源
s = s.replace(/var JS = \[[\s\S]*?\];/, "var JS = ['leaflet/leaflet.js'];");

// 2.5) Google Fonts 国内不可达，直接去掉（字体栈有 Kaiti SC / 宋体等系统兜底）
s = s.replace('<link rel="preconnect" href="https://fonts.googleapis.com">\n', '');
s = s.replace('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n', '');
s = s.replace('<link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;600;900&display=swap" rel="stylesheet">\n', '');

// 3) 景点图：Wikimedia 外链 → 仓库 img/（Wikimedia 在国内不可达）
var IMG = {
  'https://commons.wikimedia.org/wiki/Special:FilePath/Platform%20of%20Zhenjiang%20South%20Railway%20Station%2020260523.jpg?width=640': 'img/zhenjiannan.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/%E8%A5%BF%E6%B4%A5%E6%B8%A1%E5%8E%86%E5%8F%B2%E6%96%87%E5%8C%96%E8%A1%97%E5%8C%BA%20-%20Xijin%20Ferry%20Historic%20Area%20-%202015.04%20-%20panoramio.jpg?width=640': 'img/xijindu.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Zhaoguan-stonetower.jpg?width=640': 'img/zhaoguan.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Zhenjiang%20Jinshan.jpg?width=640': 'img/jinshan.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/%E5%8C%97%E5%9B%BA%E5%B1%B1%20-%20Beigu%20Mountain%20-%202015.04%20-%20panoramio.jpg?width=640': 'img/beigushan.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/%E6%89%AC%E5%B7%9E%E4%B8%9C%E5%85%B3%E8%A1%97%20-%20Dongguan%20Street%20of%20Yangzhou%20-%202015.04%20-%20panoramio.jpg?width=640': 'img/dongguanjie.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/%E6%89%AC%E5%B7%9E%E4%B8%AA%E5%9B%AD.jpg?width=640': 'img/geyuan.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/%E7%98%A6%E8%A5%BF%E6%B9%96%20-%20%E4%BA%94%E4%BA%AD%E6%A1%A5%E3%80%81%E7%99%BD%E5%A1%94%20-%20panoramio.jpg?width=640': 'img/shouxihu.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/%E6%89%AC%E5%B7%9E%E5%A4%A7%E6%98%8E%E5%AF%BA%E6%A0%96%E7%81%B5%E5%A1%94%20%28Qiling%20Pagoda%20in%20Daming%20Temple%29%20-%20panoramio.jpg?width=640': 'img/damingsi.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/%E4%BD%95%E5%9B%AD%E8%88%B9%E5%8E%852019.jpg?width=640': 'img/heyuan.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Yangzhoudong%20Railway%20Station%20Facade.jpg?width=640': 'img/yangzhoudong.jpg',
};
var replaced = 0;
Object.keys(IMG).forEach(function (u) {
  if (s.indexOf(u) !== -1) { s = s.split(u).join(IMG[u]); replaced++; }
});

fs.writeFileSync(path.join(root, 'index.html'), s);
console.log('OK index.html 已生成：Leaflet 本地化，图片本地化 ' + replaced + '/11，大小 ' + Math.round(s.length / 1024) + 'KB');
if (replaced < 11) { console.error('警告：有 ' + (11 - replaced) + ' 张图片 URL 未匹配，请检查母版与映射表'); process.exit(1); }
