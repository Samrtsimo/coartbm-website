# Coart Building Materials Website

**网址**: https://www.coartbm.com<br>
**部署平台**: GitHub Pages<br>
**代码仓库**: https://github.com/Samrtsimo/coartbm-website<br>
**本地路径**: `e:\DavidSkills\网站建设\coartBM.com网站建设\site\`

宁波和艺建筑材料有限公司 / Ningbo Coart Building Material Co., Ltd
建材产品出口网站（纯英文）。品牌标语：*The Co-Art of Building Material Partnerships*

## 公司信息

| 项目 | 内容 |
|------|------|
| 中文名 | 宁波和艺建筑材料有限公司 |
| 英文名 | Ningbo Coart Building Material Co., Ltd |
| 统一社会信用代码 | 91330201MA7F0K4F64 |
| 联系人 | 陈胜 (David Chen) |
| 手机/微信/WhatsApp | +86 135 6693 0986 |
| 对外邮箱 | davidchensimo@foxmail.com |
| 地址 | 浙江省宁波鄞州区堇山中路兴裕新村49号505室 315100 |
| 核心卖点 | 20年建材出口经验 · 专业工厂对接 · 东南亚/中东/南美市场 |

## 网站内容（单页 5 大板块 + 锚点导航）

| 板块 | 内容 | 实现特点 |
|------|------|---------|
| Hero 首屏 | 品牌口号 + 背景轮播 | 多图自动轮播 + 左右大箭头按钮，AI 高清图 |
| A. 公司简介 | 20年经验/工厂对接/市场 | 数据统计 + 勾选能力 + 工厂图轮播(左右按钮) |
| B. 产品 | 7类建材产品 | 每类一张预览图，点击开模态弹窗(Products/Production/Videos 标签页 + 大图放大) |
| Production | 按产品分组的生产真实 | 每类3张小入口 + View all 展开，图片灯箱左右切换 |
| C. 服务 | 专业服务/价格公道/一站式/代理 | 4卡布局 |
| D. 联系方式 | David Chen + 询盘表单 | Web3Forms 表单 |
| E. 电子画册 | 产品目录 PDF 下载 | 金属门4个 + 其他 |

## 7 类产品 & 素材位置

| 产品 | 目录图(catalog) | 生产照(factory) | 视频(videos) |
|------|-----------------|-----------------|-------------|
| Metal Security Door | 62张 | 28张 | — |
| Interior WPC/Wood Door | 10张 | 10张 | — |
| Aluminum Door & Window | 61张 | — | 1个(高清) |
| Steel Window | 6张 | 3张 | — |
| SPC Flooring | 100张 | — | 2个 |
| PU Skirting & Moulding | 242张 | — | 7个 |
| PU Stone Panel | 17张 | — | — |

素材源 PDF 在 `产品信息/`（原始厂商目录，已去第三方品牌：铝窗去KKD、木门去王牌家居、钢窗去YALONNUS）。

## 技术要点

- **纯静态站**（HTML + CSS + JS），GitHub Pages 免费托管，除域名外零成本
- **数据驱动**：`data/products.js`（产品+图+视频清单）、`data/custom.js`（用户选的 Hero/About 图）
- **画廊/灯箱**：产品弹窗 + 生产图库，均带 prev/next 左右切换 + 计数
- **询盘表单**：Web3Forms（免费），Access Key 在 `js/main.js`
- **图片清晰度**：用户选图经 Real-ESRGAN AI 超分（GPU），压缩到 2560px 高清
- **响应式**：桌面/平板/手机三端适配
- **品牌配色**：铝灰银极简

## 部署

GitHub Pages 已启用，CNAME → www.coartbm.com。更新流程：
1. 编辑 `site/` 下文件
2. `cd site && git add . && git commit -m "msg" && git push`
3. 1-2 分钟自动生效（GitHub Pages 自动构建）

## 阿里云 DNS

- CNAME：`www` → `samrtsimo.github.io`（已生效）
- 裸域 `coartbm.com` 未跳转（可选后续配置）
