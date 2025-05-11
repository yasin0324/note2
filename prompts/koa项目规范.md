# Koa.js 后端项目规范1

## 项目结构

- `/app.js`: 应用程序入口
- `/router/`: 路由定义，处理 API 路径映射
- `/controller/`: 控制器，处理业务逻辑
- `/model/`: 数据模型，数据库交互
- `/prisma/`: 数据库模式和配置
- `/middleware/`: 自定义中间件
- `/utils/`: 工具函数
- `/config/`: 环境配置
- `/test/`: 测试文件

## 编码规范

### 命名规范

- 文件名：小写，单词间使用下划线分隔（例如：`user_service.js`）
- 路由：REST风格，复数表示资源集合（例如：`/api/users`）
- 变量和函数：驼峰命名法（例如：`getUserById`）
- 常量：全大写，单词间使用下划线分隔（例如：`MAX_RETRY_COUNT`）

### 函数规范

- 每个函数只做一件事
- 控制器函数应遵循 `async (ctx) => {}` 格式
- 错误处理使用 try/catch
- 避免嵌套回调，优先使用 async/await

### 路由规范

- 路由定义在 `router/` 目录下
- 路由应当分模块组织（例如：`user.js`, `product.js`）
- 路由前缀统一为 `/api`
- HTTP方法映射：
  - GET：获取资源
  - POST：创建资源
  - PUT：完全更新资源
  - PATCH：部分更新资源
  - DELETE：删除资源

### 控制器规范

- 控制器只处理请求参数和响应格式
- 业务逻辑应抽离到服务层
- 统一响应格式

### 模型规范

- 模型对应数据库表结构
- 避免在模型中包含业务逻辑
- 数据库操作使用 Prisma

### 错误处理规范

- 使用自定义错误类
- 错误信息应当明确、一致
- 所有错误应当记录日志

### 代码提交规范

- 提交信息格式：`<type>(<scope>): <subject>`
- 类型包括：feat, fix, docs, style, refactor, test, chore

## 性能优化

- 使用合适的索引
- 实施数据库连接池
- 避免 N+1 查询问题
- 实现适当的缓存策略
- 异步操作处理并发请求



# Koa.js Node.js 后端项目规范2

## 项目概述

这是一个基于 Koa.js 的 Node.js 后端项目规范，遵循 MVC 架构模式，集成了 Prisma ORM 和 RESTful API 设计理念。

## 文件结构

```bash
/ (根目录)
├── app.js # 应用程序入口点
├── router/ # 路由定义目录
│ └── index.js # 主路由文件
├── controller/ # 控制器目录
│ ├── index.js # 控制器导出文件
│ └── user.js # 用户相关控制器
├── model/ # 数据模型目录
│ ├── index.js # 模型导出文件
│ └── user.js # 用户相关模型
├── prisma/ # Prisma ORM 配置
│ ├── schema.prisma # 数据库模式定义
│ └── index.js # Prisma 客户端实例
├── generated/ # 自动生成的代码目录
├── node_modules/ # 依赖包目录
├── package.json # 项目配置和依赖
└── .env # 环境变量配置
```

## 编码规范

### 通用规范

- 使用 ES Module 模块系统 (`import`/`export`)
- 使用 `async`/`await` 处理异步操作
- 使用 try/catch 进行错误处理
- 文件名使用小写，多词使用短横线分隔（kebab-case）
- 变量和函数名使用驼峰命名法（camelCase）
- 常量使用全大写下划线分隔（SNAKE_CASE）
- 类名使用帕斯卡命名法（PascalCase）

### 路由规范

- 路由文件放在 `router` 目录下
- 使用 `@koa/router` 库创建路由
- 路由定义应遵循 RESTful API 设计原则
- API 路径使用复数名词表示资源集合（如 `/users`）
- 使用 HTTP 方法表示操作意图：
  - GET：获取资源
  - POST：创建资源/更新资源/删除资源

### 控制器规范

- 控制器文件放在 `controller` 目录下
- 每个控制器专注于特定资源或功能
- 控制器负责处理请求参数和返回响应
- 不要在控制器中直接包含业务逻辑或数据访问代码
- 使用适当的 HTTP 状态码
- 统一的响应格式

### 模型规范

- 模型文件放在 `model` 目录下
- 使用 Prisma ORM 进行数据库操作
- 模型应该封装所有数据库交互逻辑
- 避免在模型之外直接使用 Prisma 客户端
- 使用命名约定清晰表达模型方法的意图

### 数据库规范

- 使用 Prisma 管理数据库架构
- 表名使用单数形式
- 主键命名为 `id`
- 外键命名为 `<表名>_id`
- 创建和更新时间戳字段：`createdTime` 和 `updatedTime`
- 使用 Prisma 迁移功能管理数据库变更

### 分页规范

- 支持基于偏移（offset）的分页
- 分页参数：
  - `pagenum`：页码，默认为 1
  - `pagesize`：每页记录数，默认为 10
  - `name`：可选的过滤参数
- 在响应中包含分页元数据

### 错误处理规范

- 使用 try/catch 捕获异步操作中的错误
- 定义自定义错误类型和错误码
- 统一的错误响应格式
- 避免在生产环境中暴露敏感错误详情

### 环境变量规范

- 使用 `dotenv` 加载环境变量
- 敏感信息（如数据库密码、API 密钥）存储在环境变量中
- 不同环境使用不同的 .env 文件（开发、测试、生产）
- 避免将 .env 文件提交到版本控制系统

## 目录和文件约定

### 应用入口 (app.js)
- 配置和初始化 Koa 应用
- 注册中间件
- 设置全局错误处理
- 启动 HTTP 服务器

### 路由文件 (router/index.js)
- 定义 API 路由和端点
- 指定路由前缀（如 `/api`）
- 将请求分发给相应的控制器

### 控制器文件 (controller/*.js)
- 验证和处理请求参数
- 调用适当的模型方法
- 格式化和返回响应

### 模型文件 (model/*.js)
- 封装数据库操作
- 定义数据查询和操作方法
- 处理数据转换和验证

### Prisma 配置 (prisma/schema.prisma)
- 定义数据模型和关系
- 配置数据库连接

## 最佳实践

### 性能优化
- 使用适当的索引提高查询性能
- 实现数据缓存机制
- 分页获取大数据集
- 使用连接池管理数据库连接

### 安全实践
- 验证和清理所有用户输入
- 使用参数化查询防止 SQL 注入
- 实现适当的身份验证和授权
- 使用 HTTPS 保护数据传输
- 设置正确的 CORS 策略

### 代码质量
- 编写单元测试和集成测试
- 使用 ESLint 进行代码检查
- 实现持续集成和部署
- 进行代码审查

### 文档
- 为 API 提供清晰的文档
- 使用 JSDoc 注释记录代码
- 保持 README 文件更新

## 示例代码

### 路由定义
```javascript
import Router from "@koa/router";
import { getUsers, postUser } from "../controller/index.js";

const router = new Router({
  prefix: "/api",
});

router.get("/users", getUsers);
router.post("/user", postUser);

export default router;
```

### 控制器
```javascript
export const getUsers = async (ctx) => {
  try {
    const query = ctx.query;
    const name = query.name || "";
    const pagenum = Math.abs(Number(query.pagenum)) || 1;
    const pagesize = Math.abs(Number(query.pagesize)) || 10;
    const skip = (pagenum - 1) * pagesize;
    
    ctx.body = await getUsersModel(name, skip, pagesize);
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
};
```

### 模型
```javascript
export const getUsersModel = async (name, skip, pagesize) => {
  try {
    return await prisma.user.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      select: {
        name: true,
        email: true,
      },
      skip,
      take: pagesize,
      orderBy: {
        email: "desc",
      },
    });
  } catch (err) {
    throw err;
  }
};
```

## 关于项目扩展

随着项目增长，考虑添加以下目录：

- `middleware/`：自定义中间件
- `config/`：配置文件
- `utils/`：通用工具函数
- `services/`：业务逻辑层
- `tests/`：测试文件

## 参考资源

- [Koa.js 官方文档](https://koajs.com/)
- [Prisma 文档](https://www.prisma.io/docs/)
- [RESTful API 设计最佳实践](https://restfulapi.net/)
- [Node.js 最佳实践](https://github.com/goldbergyoni/nodebestpractices)