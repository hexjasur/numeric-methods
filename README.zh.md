<p align="center">
  <img src="src-tauri/icons/icon.png" width="130" alt="数值计算方法图标"/>
</p>

<h1 align="center">数值计算方法 (Numeric Methods) <sup>v3</sup></h1>

<p align="center">
  <strong>现代化跨平台应用，支持交互式与分步探索计算数学中的经典数值算法。</strong>
</p>

<p align="center">
  <a href="https://sonli-usullar.uz"><img src="https://img.shields.io/badge/在线体验-sonli--usullar.uz-00D26A?style=flat-square&logo=googlechrome&logoColor=white" alt="Live Website" /></a>
  <a href="https://github.com/hexjasur/numeric-methods/releases/latest"><img src="https://img.shields.io/github/v/release/hexjasur/numeric-methods?style=flat-square&color=blue&label=最新发布" alt="Latest Release" /></a>
  <a href="https://github.com/hexjasur/numeric-methods/releases"><img src="https://img.shields.io/badge/支持平台-Web%20%7C%20Windows%20%7C%20Linux%20%7C%20Android-purple?style=flat-square" alt="Supported Platforms" /></a>
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/包管理器-Bun-f472b6?style=flat-square&logo=bun&logoColor=white" alt="Bun Only" /></a>
  <a href="https://tauri.app"><img src="https://img.shields.io/badge/Tauri-v2-24C8D8?style=flat-square&logo=tauri&logoColor=white" alt="Tauri v2" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/开源协议-非商业授权%20%7C%20署名保护-blue?style=flat-square" alt="非商业授权" /></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-欢迎提交-brightgreen?style=flat-square" alt="欢迎提交 PR" /></a>
</p>

<p align="center">
  <b>语言切换:</b>
  <a href="README.md"><b>English</b></a> |
  <a href="README.ru.md"><b>Русский</b></a> |
  <a href="README.zh.md"><b>简体中文</b></a> |
  <a href="README.uz.md"><b>O'zbekcha</b></a>
</p>

---

## 📥 下载与安装 (Downloads)

**Numeric Methods** 基于单一代码库构建，全平台覆盖 **网页端 (Web)**、**桌面端 (Windows / Linux)** 以及 **移动端 (Android APK)**。所有官方编译且附带签名的安装包均可在 [GitHub Releases](https://github.com/hexjasur/numeric-methods/releases/latest) 直接获取。

### 📱 安卓客户端 (Android APK)

| 安装包 | CPU 架构 / 适用机型 | 直链下载地址 (Download URL) |
| :--- | :--- | :--- |
| **Numeric Methods APK (ARM64)** <br/> *(强烈推荐)* | 专为现代 64 位主流安卓手机与平板设计 (arm64-v8a)。体积更轻巧，运行性能更高。 | [⬇️ 下载 ARM64 APK](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/Numeric.Methods_3.2.0_arm64.apk) |
| **Numeric Methods APK (Universal)** | 通用安装包，兼容所有安卓处理器架构 (arm64-v8a, armeabi-v7a, x86, x86_64)。 | [⬇️ 下载 Universal APK](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/Numeric.Methods_3.2.0_universal.apk) |

> 💡 **获取最新版本镜像：**  
> 您可随时访问 [GitHub Releases 页面](https://github.com/hexjasur/numeric-methods/releases/latest) 查看或下载最新的 APK 安装文件。

---

### 💻 电脑桌面端 (Windows & Linux)

| 操作系统 | 安装包格式 | 下载直链 |
| :--- | :--- | :--- |
| **Windows 10 / 11 (64位)** | NSIS 安装程序 (`.exe`) | [⬇️ 下载 Windows x64 安装程序 (.exe)](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/numeric-methods_3.2.0_x64-setup.exe) |
| **Windows 10 / 11 (64位)** | Windows MSI 程序包 (`.msi`) | [⬇️ 下载 Windows x64 MSI 安装包](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/numeric-methods_3.2.0_x64_en-US.msi) |
| **Linux (Ubuntu / Debian)** | Debian 软件包 (`.deb`) | [⬇️ 下载 Debian 软件包 (.deb)](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/numeric-methods_3.2.0_amd64.deb) |
| **Linux (通用免安装)** | 便携式 AppImage (`.AppImage`) | [⬇️ 下载 AppImage 格式](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/numeric-methods_3.2.0_amd64.AppImage) |

---

### 🌐 网页在线版 (免安装)

通过浏览器即点即用：
- **当前最新 v3 官网：** [sonli-usullar.uz](https://sonli-usullar.uz)
- **v2 历史存档站：** [v2.sonli-usullar.uz](https://v2.sonli-usullar.uz)

---

## 🧮 已实现的数值计算方法 (Algorithms)

本应用完整实现了高等计算数学中的 10 种核心算法，覆盖 5 大计算领域：

### 1. 非线性代数与超越方程求根
- **二分法 (Bisection Method)：** 通过不断将区间 $[a, b]$ 对半折半逼近根所在区间，保证收敛性 ($O(\log_2(1/\varepsilon))$)。
- **牛顿切线法 (Newton-Raphson Method)：** 利用导数切线迭代，具备平方级局部超快收敛速度：$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$。

### 2. 线性方程组求解
- **追赶法 / 托马斯算法 (Tridiagonal Sweep Method)：** 针对三对角线性方程组的高效求解算法，时间复杂度仅为 $O(n)$。

### 3. 多项式插值
- **拉格朗日插值法 (Lagrange Interpolation)：** 基于给定离散数据节点直接构造唯一的代数插值多项式。
- **牛顿差商插值法 (Newton Divided Differences)：** 分步构造差商表，动态计算插值多项式系数。

### 4. 数值积分 (求积法)
- **矩形法 (Riemann Midpoint Rule)：** 使用左端点、右端点或中点黎曼矩形逼近定积分。
- **梯形法 (Trapezoidal Rule)：** 采用一次分段多项式梯形面积进行积分近似 ($O(h^2)$)。
- **辛普森抛物线法 (Simpson's 1/3 Rule)：** 利用二次抛物线样条求积，具备更高的代数精度 ($O(h^4)$)。

### 5. 常微分方程初值问题 (ODEs / Cauchy Problem)
- **欧拉显式法 (Euler's Method)：** 一阶基础步长数值积分算法：$y_{i+1} = y_i + h \cdot f(x_i, y_i)$。
- **经典四阶龙格-库塔法 (Runge-Kutta 4th Order / RK4)：** 加权综合四个斜率分量的高精度标准积分算法。

### ✨ 全算法通用功能亮点
- 📈 **动态交互式函数图表：** 基于 Recharts 构建，支持缩放、坐标轴自适应与函数轨迹追踪。
- 📐 **高品质公式排版：** 基于 KaTeX 纯客户端实时渲染 LaTeX 格式数学表达式。
- 📋 **步骤与审计详情表：** 提供详细的中间变量、误差估计和残差收敛列表。
- 💾 **多维数据导出：** 支持一键复制表格、CSV 导出以及带时间戳的高清 PNG 矢量图表保存。
- 🌐 **多语言即时切换：** 原生支持乌兹别克语、俄语、英语。
- 🌗 **明暗主题自适应：** 舒适的工程工业级对比度配色与裁角美学设计。

---

## 🛠 技术栈一览 (Tech Stack)

- **前端框架：** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, 静态导出 `output: "export"`)
- **UI 界面库：** [React 19](https://react.dev/)
- **原生运行环境：** [Tauri v2](https://tauri.app/) (Rust 驱动的桌面与安卓壳程序)
- **样式方案：** [Tailwind CSS 4](https://tailwindcss.com/)
- **计算核心：** [Math.js](https://mathjs.org/) (符号解析与数值计算)
- **数学排版：** [KaTeX](https://katex.org/)
- **图表库：** [Recharts](https://recharts.org/)
- **图标库：** [Lucide React](https://lucide.dev/)
- **包管理器：** [Bun](https://bun.sh/) (推荐并强制使用)

---

## 🚀 本地开发与构建指南

### 环境准备
- [Bun](https://bun.sh) (v1.2+)
- [Rust](https://rustup.rs) (仅在构建 Tauri 桌面或安卓应用时需要)

### 1. 安装项目依赖

```bash
bun install
```

### 2. 启动 Next.js 网页热重载开发模式

```bash
bun dev
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000)。

### 3. 生成静态导出包 (Static Export)

```bash
bun run build
bun start
```
静态文件将生成在 `out/` 文件夹中，供部署至静态托管平台或供 Tauri 原生客户端加载。

---

## 💻 桌面端编译 (Tauri Desktop)

在配置好 Rust 及平台系统依赖后运行：

```bash
# 桌面端调试运行 (热重载)
bun td

# 桌面端正式打包发布 (.exe / .msi / .deb / .AppImage)
bun tb
```

桌面端配置文件位于 `src-tauri/tauri.conf.json`。

---

## 📱 安卓客户端编译 (Android APK)

所需环境配置：
- Java JDK 17+
- Android SDK 与 NDK (推荐 r26d)
- Rust 的 Android 目标架构支持：
  ```bash
  rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android
  ```

### 安卓构建命令：

```bash
# 初始化安卓原生工程
bun run tauri:android:init

# 在已连接的设备或安卓模拟器中运行 (Dev)
bun run tauri:android:dev

# 构建通用的 Universal 签名 APK
bun run tauri:android:build --apk

# 按 CPU 架构独立拆分构建 (如高性能 arm64-v8a APK)
bun run tauri:android:build --apk --split-per-abi
```

编译生成的安装包保存在：  
`src-tauri/gen/android/app/build/outputs/apk/`

---

## 🔄 自动更新机制 (Auto-Updater)

- **桌面端 (Windows/Linux)：** 集成 Tauri 原生签名升级插件，通过 `minisign` 公钥验证 GitHub Releases 上的 `latest.json`，支持一键在后台平滑升级。
- **安卓端：** 应用内置更新检测逻辑，发现新版发布时弹窗提示，并可直接在系统浏览器中调起最新 APK 的快速下载。

---

## 🤝 参与贡献 (Contributing)

热烈欢迎向本项目贡献力量！在提交 Pull Request 前，请务必阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 贡献规范：

- 🐛 **发现错误或计算异常？** 提交 [Bug Report](https://github.com/hexjasur/numeric-methods/issues/new?template=bug_report.md)。
- 💡 **有新功能或界面优化建议？** 提出 [Feature Request](https://github.com/hexjasur/numeric-methods/issues/new?template=feature_request.md)。
- 🧮 **想添加新的数值算法？** 参考 [New Method Proposal](https://github.com/hexjasur/numeric-methods/issues/new?template=new_method.md) 并遵循 [CONTRIBUTING.md](CONTRIBUTING.md) 中的分步架构指南。
- 📜 社区交流请遵守 [行为准则 (CODE_OF_CONDUCT.md)](CODE_OF_CONDUCT.md)。

---

## 📄 许可证与使用条款 (License & Terms)

本项目采用**自定义非商业用途与署名保护许可证 (Custom Non-Commercial & Attribution License)**。完整条款请查阅 [LICENSE](LICENSE)。

### 核心条款说明：
- **仅限学术与非商业使用：** 本软件及其所有编译分发包（Web、桌面端、Android APK）仅供学习与学术研究免费使用，**严禁进行任何形式的销售、收费变现或商业牟利**。
- **保护原始作者与品牌：** 项目品牌名称（"Numeric Methods" / "Sonli Usullar"）以及原始作者 **Jasurbek Haydarov ([@hexjasur](https://github.com/hexjasur))** 的署名信息在所有分发和派生副本中均必须完整保留，严禁擅自修改或抹除。
- **Fork 与贡献：** 允许自由 Fork 并改进代码，贡献者在实现实质性改进后，**可以在原始作者署名旁添加自己的贡献者姓名**（但不能取代原作者）。
- **二次分发：** 任何派生分发均须附带相同许可证文件并严格遵守上述非商业与署名要求。

### 官方联系：
- **项目作者：** Jasurbek Haydarov ([@hexjasur](https://github.com/hexjasur))
- **在线主页：** [sonli-usullar.uz](https://sonli-usullar.uz)
- **Telegram 频道/联系：** [@KanYonA](https://t.me/KanYonA)
- **联系邮箱：** jasurhaydarovcode@gmail.com

