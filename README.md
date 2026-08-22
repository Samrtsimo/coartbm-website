# Coart Building Materials Website

**网址**: www.coartbm.com<br>
**部署平台**: GitHub Pages<br>
**代码仓库**: https://github.com/Samrtsimo/coartbm-website

宁波和艺建筑材料有限公司 / Ningbo Coart Building Material Co., Ltd
建材产品出口网站（纯英文）。

## 网站内容

| 板块 | 说明 |
|------|------|
| A. 公司简介 | 20年出口经验，专业工厂对接，三大市场（东南亚/中东/南美），生产照片 |
| B. 产品 | 7类建材产品，每类展示全部目录图（点击"View all models"展开画廊）|
| C. 服务 | 专业服务/价格公道/一站式采购/代理服务 |
| D. 联系方式 | David Chen，微信/WhatsApp/手机，地址 |
| E. 电子画册 | 产品目录 PDF 下载 |

## 产品

- Metal Security Entrance Door 金属防盗门
- Interior WPC & Wood Door 室内WPC/木门
- Aluminum Door & Window 铝合金门窗
- Steel Window 钢窗
- SPC Flooring SPC地板
- PU Skirting & Crown Moulding PU踢脚线及顶角线
- PU Stone Panel PU石皮

## 技术要点

- **纯静态站**（HTML + CSS + JS），GitHub Pages 免费托管，除域名外零成本
- **产品画册**：`data/products.js` 列出每类全部图片，画廊 + 灯箱展示
- **询盘表单**：Web3Forms（免费），Access Key 在 `js/main.js`
- **响应式**：桌面/平板/手机三端适配
- **品牌**：铝灰银极简配色（`css/style.css`）
- 图片压缩至 ≤800px 宽，PDF 为完整电子画册

## DNS 配置（阿里云）

- **CNAME 记录**: `www` → `samrtsimo.github.io`
- **裸域跳转**: `coartbm.com` 用阿里云"显式URL跳转"重定向到 www

## 更新流程

1. 编辑 `site/` 下文件
2. `git add . && git commit -m "xxx" && git push`
3. 1-2 分钟后自动生效

## 公司信息

- 中文名: 宁波和艺建筑材料有限公司
- 统一社会信用代码: 91330201MA7F0K4F64
- 联系人: 陈胜 (David Chen)
- 手机/微信/WhatsApp: +86 135 6693 0986
- 对外邮箱: davidchensimo@foxmail.com
- 地址: 浙江省宁波鄞州区堇山中路兴裕新村49号505室 315100
