# 词条调研汇报

一个中文词条调研汇报训练工具：抽到一个词条、现象或技术问题后，先调研它是什么，再分析它为什么出现、影响是什么，最后完成 1-2 分钟口头汇报。

## 功能

- 日常现象、职场概念、技术问题、社会议题、关系心理、文化消费、面试常用 7 类材料
- 每个词条配有词汇库、调研任务和分析任务
- 面试常用问题配有参考答案，方便先模仿再改写
- 三段式流程：调研计时、整理计时、汇报计时
- 汇报时长可选 60 秒、90 秒、120 秒
- 支持换词条、复制练习材料、收藏词条、查看最近词条

## 本地运行

需要先安装 [Node.js](https://nodejs.org/)。

```bash
npm install
npm run dev
```

如果 PowerShell 提示脚本被禁止，可以改用：

```bash
npm.cmd install
npm.cmd run dev
```

## 生产构建

```bash
npm run build
```

## GitHub Pages

当前仓库名如果是 `unprompt.cool-cn`，需要把 `vite.config.js` 里的 `base` 改成：

```js
base: "/unprompt.cool-cn/",
```

如果你的仓库名不同，就把 `base` 改成对应的 `"/仓库名/"`。
