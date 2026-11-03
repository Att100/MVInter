# MVInter project website

基于 MVInter 论文内容制作的英文项目页，布局参考 [MV4DHMR](https://att100.github.io/MV4DHMR/)。纯 HTML / CSS / JavaScript，无需 npm、框架、构建或第三方 CDN，可直接用于 GitHub Pages，也可离线打开 `index.html`。

## 本地预览

在此目录启动静态服务器：

```powershell
python -m http.server 8000
```

然后访问 <http://localhost:8000>。也可直接双击 `index.html`。部分浏览器在 `file://` 下禁止自动复制，页面会改为选中引用，随后按 Ctrl+C 即可。

## GitHub Pages 部署

当前 Git 仓库为 `code`，页面目录为 `docs/website`。推荐使用 GitHub Actions，让网站直接显示在仓库的 Pages 根路径。

1. 将下方配置保存为仓库根目录下的 `.github/workflows/pages.yml`（即本地 `code/.github/workflows/pages.yml`）。
2. 在 GitHub 仓库的 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 提交并推送网站文件和工作流。工作流会上传 `docs/website` 中的静态内容。
4. 部署成功后，访问 Actions 结果给出的 URL。对于当前仓库，默认地址为 `https://att100.github.io/MVInter/`。

```yaml
name: Deploy project website
on:
  push:
    branches: [main]
    paths:
      - 'docs/website/**'
      - '.github/workflows/pages.yml'
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v4
        with:
          path: docs/website
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

若默认分支不叫 `main`，请调整 `branches`。配置参考 [GitHub 官方 Pages 工作流文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。本次仅生成本地文件，没有执行提交、推送或发布。

另外两种方式：

- 将本目录内容放到独立仓库根目录，在 Pages 选择 **Deploy from a branch → main → /(root)**，即可直接发布。
- 在现有仓库选择 **main → /docs**，则页面地址为 `https://att100.github.io/MVInter/website/`。

所有资源均使用相对路径，支持 GitHub Pages 的项目子路径。

## 内容来源

- 标题、正式作者顺序、单位：`tmp/WACV2027_MVInter/cr.tex`。
- 摘要：`sec/0_abstract.tex`，正文保留原文。
- 方法：`sec/1_intro.tex`、`sec/3_method.tex`。
- CHI3D、Hi4D 指标及模块消融：`sec/4_experiments.tex`。主结果使用主表数值，消融使用消融表数值。
- Panoptic 多人可视化：`sec/X_suppl.tex`。
- 图像：论文 `figures/` 和 `images/` 中的原图；PDF 已转换为 WebP，PNG 中的透明背景已合成白色。
- Code 链接：本地仓库的 `origin`，`https://github.com/Att100/MVInter`。

未使用 `main.tex` 中的匿名占位作者。未复制参考项目的研究内容、作者信息或未填写的资源链接。

## 发布前补充资源

当前提供的论文目录没有完整论文 PDF、独立补充材料 PDF 或 arXiv 编号，因此 Paper / Supplementary 按钮明确标记为 Coming soon，未添加 arXiv 入口。正式 PDF 准备好后：

1. 新建 `static/pdfs/`，放入 `paper.pdf`、`supplementary.pdf`。
2. 在 `index.html` 将对应禁用按钮改为资源链接，例如：

```html
<a class="resource" href="static/pdfs/paper.pdf" target="_blank" rel="noopener">Paper</a>
<a class="resource" href="static/pdfs/supplementary.pdf" target="_blank" rel="noopener">Supplementary</a>
```

3. 如有 arXiv 或作者主页，添加实际链接；页面当前不猜测作者主页。
4. 出版页码和 DOI 尚未提供；可在正式元数据确定后更新 `citation.bib` 和 `index.html` 的引用内容。
5. 如需完整社交分享预览，将 `og:image` 的相对路径改为部署后的绝对图片 URL；当前不猜测最终部署位置。

## 文件结构与功能

```text
website/
  index.html            页面内容、图表、引用
  citation.bib          可下载的 BibTeX
  .nojekyll             禁用 Jekyll 处理
  static/css/style.css  响应式布局
  static/js/main.js     结果标签切换、键盘导航、复制引用
  static/images/        本地 WebP 图像与 SVG 图标
```

正文、表格及图片在 JavaScript 禁用时仍可阅读；两组定性结果会同时展示。桌面和手机端均有对应布局，宽表格可横向滚动。支持 Tab / 方向键导航、可见焦点、减少动画偏好、图片替代文本和复制状态提示。
