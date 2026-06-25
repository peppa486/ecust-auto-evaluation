# 🎓 华东理工大学教务系统一键评教助手 (ECUST Auto Evaluation)

<p align="center">
  <img src="https://img.shields.io/github/license/peppa486/ecust-auto-evaluation?style=flat-square" alt="License">
  <img src="https://img.shields.io/github/stars/peppa486/ecust-auto-evaluation?style=flat-square" alt="Stars">
  <img src="https://img.shields.io/github/forks/peppa486/ecust-auto-evaluation?style=flat-square" alt="Forks">
  <img src="https://img.shields.io/badge/Language-JavaScript-yellow?style=flat-square" alt="Language">
</p>

专为华东理工大学统一教学评价系统（基于强智教务系统 `jsxsd`，域名 `inquiry.ecust.edu.cn`）开发的**一键批量半自动评教工具**。

免安装任何浏览器插件，在 F12 控制台粘贴回车即可享受**秒级填充、全自动防拦截、智能规避限制**的流畅评教体验。

---

## ✨ 核心特色

- ⚡ **零依赖，即开即用**：无需安装 Tampermonkey 或其他任何浏览器插件，F12 控制台一键直达。
- 🔄 **iframe 串行加载**：通过在页面下方动态嵌套 `<iframe>` 进行评教子页面渲染，**100% 避开 Chrome 浏览器对恶意弹窗（window.open）的拦截机制**。
- 🚫 **智能规避 3 个“最爱”限额**：教务系统规定全校最多评选 3 个“最喜爱的课程”。脚本内含全局计数器，在评满 3 个后，会自动将后续课程选为“否”，彻底避开报错拦截。
- 🎲 **打分防雷同机制**：脚本引入了打分随机扰动（默认 95% 概率评 10 分优秀，5% 概率评 9 分良好），模拟人类真实打分，防止被系统筛查雷同满分。
- ✍️ **评语自适应**：内置 10 条高质量高校教师正面评语，且字数均大于 15 字，自动适配教务系统最低字数限制。
- 🔇 **弹窗静音挂载**：在底层屏蔽了 `window.alert` 和 `confirm` 的阻断弹窗，全程体验行云流水。

---

## 📂 项目结构

- **[console-batch-evaluation.js](console-batch-evaluation.js)**：多门课程一键批量评教的核心脚本。
- **[README.md](README.md)**：项目使用手册与文档。

---

## 🚀 极速使用指南

### 第一步：进入评教列表页
1. 登录华理教务系统并进入“**学生评教**”页面。
2. 此时您应能看到您所有待评课程的列表页（操作列显示为 “进入评价”）。

### 第二步：复制并运行脚本
1. 在当前列表页，按下键盘上的 **`F12`** 键（或在页面空白处右键选择“检查”），切换到 **`Console`（控制台）** 面板。
2. 打开本项目中的 **[`console-batch-evaluation.js`](console-batch-evaluation.js)**，复制其全部代码。
3. 将代码粘贴到浏览器的控制台中，按下 **`Enter` (回车)** 运行。

### 第三步：极简交互体验
1. 运行后，页面底部会生成一个虚线框，**自动为您载入并填好第 1 位老师**的所有单选框与评语。
2. 您只需看一眼，手动点击虚线框最底部的 **`[提交]`** 按钮。
3. 提交成功后，助手会自动感知，**瞬间为您载入并填好第 2 位老师**，继续等待您点击提交。
4. 依此类推，全部评完后网页会自动弹出提示并刷新列表状态。

---

## 🔒 隐私与安全性

- **100% 本地运行**：本脚本完全在您个人的浏览器控制台中执行，**不经过任何第三方服务器**，不搜集任何教务处密码和个人隐私，绝对安全。
- **开源透明**：所有源码在当前 GitHub 仓库中完全公开，欢迎审计。

---

*开发团队：Antigravity Agentic AI Team*
