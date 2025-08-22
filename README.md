<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Jays API Engine Frontend

A robust NestJS-based API engine built with TypeScript, featuring a modular architecture, comprehensive validation, and enterprise-grade patterns including **Read/Write Repository Pattern (CQRS)**.

## 🚀 Features

- **NestJS 11** with TypeScript
- **Fastify** HTTP adapter for high performance
- **TypeORM** with PostgreSQL for database operations
- **Read/Write Repository Pattern** for optimized data access
- **Class-validator** for request validation
- **Global exception handling** with consistent error responses
- **Response transformation** for standardized API responses
- **Modular architecture** with feature-based modules
- **Database migrations** support
- **Comprehensive logging** with custom logger
- **CORS** configuration
- **Environment-based configuration**
- **Testing setup** with Jest

## 📁 Project Structure

```
src/
├── config/                 # Configuration files
│   └── typeorm.config.ts   # TypeORM CLI configuration
├── modules/                # Feature modules
│   └── example/            # Example module (template)
│       ├── dto/           # Data Transfer Objects
│       ├── entities/      # Database entities
│       ├── repositories/  # Read/Write repositories
│       ├── example.controller.ts
│       ├── example.service.ts
│       └── example.module.ts
├── shared/                 # Shared utilities
│   ├── class-validators/  # Custom validation decorators
│   ├── dto/              # Base DTOs
│   ├── entities/         # Base entities
│   ├── repositories/     # Base repository classes
│   ├── enum/             # Enums
│   ├── filters/          # Exception filters
│   ├── guard/            # Guards
│   └── interceptors/     # Interceptors
├── utils/                 # Utility functions
│   ├── helper/           # Helper functions
│   └── logger/           # Custom logger
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts
```

## 🏗️ Architecture Patterns

### 1. **Read/Write Repository Pattern (CQRS)**
- **Separate repositories** for read and write operations
- **Optimized query performance** for read operations
- **Transaction management** for write operations
- **Scalable architecture** for high-performance applications
- **Easy to implement caching** and read replicas

### 2. **Modular Design**
- Each feature is organized in its own module
- Clear separation of concerns
- Scalable and maintainable

### 3. **Base Entity Pattern**
- Common fields (id, timestamps, soft delete) in base entity
- Consistent database structure across all entities

### 4. **DTO Pattern**
- Input validation with class-validator
- Type safety and documentation
- Separation of API contracts from internal models

### 5. **Global Exception Handling**
- Consistent error responses
- Proper HTTP status codes
- Detailed logging for debugging

## 🛠️ Installation

```bash
# Install dependencies
pnpm install

# Create environment file
cp .env.example .env

# Configure your database settings in .env
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
