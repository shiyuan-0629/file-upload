# 文件上传code（file-upload）

## 1. 项目简介  

> 一个基于 [Vue + Node.js] 的文件上传的示例code，可用于学习共享。  

## 2. 功能特性  

用列表清晰列核心功能，比如：  

- ✅ 多文件批量上传（支持拖拽、选择文件夹）
- ✅ 上传进度实时显示  

## 3. 技术栈  

说明前后端、依赖工具，比如：

### 前端（client 目录）  

- 框架：Vue 3 + Vite  
- 依赖：Axios（网络请求）、Element Plus（UI 组件）  
- 构建：pnpm

### 后端（server 目录）

- 语言：Node.js
- 框架：Express
- 存储：本地文件系

### 前置要求  

- 安装 Node.js、pnpm

### 启动前端（client）  

```bash
# 进入前端目录
cd client  

# 安装依赖
pnpm install  

# 本地启动（开发环境）
pnpm run dev
```

### 启动后端（server）

```bash
# 进入后端目录
cd server

# 安装依赖
pnpm install

# 本地启动 (开发环境)
node app.js
```

![启动截图](https://github.com/shiyuan-0629/file-upload/blob/master/images/init.png?raw=true)
![等待截图](https://github.com/shiyuan-0629/file-upload/blob/master/images/wait.png?raw=true)
![成功截图](https://github.com/shiyuan-0629/file-upload/blob/master/images/success.png?raw=true)
