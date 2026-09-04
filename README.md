# PlaywrightPlayground

A practice repo for playwright testing framework.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Scripts](#scripts)
- [CI/CD](#cicd)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

A more detailed description of the project. Explain the purpose, the problem it solves, and who it is for.
The purpose of this repo is to provide a space for practicing the playwright framework, creating API, and UI tests.

---

## Tech Stack

| Category | Technology |
| -------- | ---------- |
| Language | TypeScript |
| Runtime  | Node.js    |
| Testing  | Playwright |
| Linting  | ESLint     |
| Format   | Prettier   |

---

## Prerequisites

- Node.js `>= 24.14.0`
- npm `>= 11.9.0`

---

## Installation

```bash
# Clone the repository
git clone https://github.com/TomiMan7/playwrightPlayground
cd REPO

# Install dependencies
npm ci
```

---

## Configuration

Create a `.env` file in the project root:

```env
API_URL=url
API_USERNAME=username
API_PASSWORD=pw
```

| Variable       | Description           | Required | Default |
| -------------- | --------------------- | -------- | ------- |
| `API_URL`      | base url for the api  | Yes      | -       |
| `API_USERNAME` | username for the user | Yes      | -       |
| `API_PASSWORD` | password for the user | Yes      | -       |

> **Where to get these:** Request credentials from the repo owner, or get your own from here: https://restful-booker.herokuapp.com/apidoc/index.html

---

## Usage

```bash
# Install dependencies
npm ci

# Run all tests
npm test

# Run only API tests
npm run test:api

# Run only UI tests
npm run test:ui

# Lint the codebase
npm run lint

# Format the codebase
npm run format

# Generate the Allure report
npm run allure:generate

# Open the Allure report
npm run allure:open
```

---

## Project Structure

```
playwrightPlayground/
├── .github/
│   ├── agents/               # Agent configurations
│   └── workflows/            # CI/CD pipeline definitions
├── .husky/
│   └── pre-commit            # Git pre-commit hook
├── config/
│   └── playwright.config.ts  # Playwright configuration
├── src/
│   ├── api/                  # API client / service layer
│   ├── fixtures/             # Custom Playwright fixtures
│   ├── test-data/            # Data factories
│   └── utils/                # Helper utilities (logger, etc.)
├── tests/
│   ├── practice1/            # API test suites
│   │   └── api.spec.ts
│   └── practice2/            # UI test suites
├── .env                      # Environment variables (git-ignored)
├── .gitignore
├── .prettierignore
├── .prettierrc               # Prettier configuration
├── eslint.config.mts         # ESLint configuration
├── package.json
├── README.md
└── tsconfig.json             # TypeScript configuration
```

---

## Testing

```bash
# Run all tests
npm test

# Run the api suite
npm run test:api

# Run the ui suite
npm run test:ui
```

---

## Scripts

| Script                    | Description                                   |
| ------------------------- | --------------------------------------------- |
| `npm run lint`            | Lint the entire codebase                      |
| `npm run lint:fix`        | Lint and automatically fix issues             |
| `npm run format`          | Format the codebase with Prettier             |
| `npm run format:check`    | Check code formatting without making changes  |
| `npm run config`          | Set the Playwright config path                |
| `npm test`                | Run all Playwright tests using the config     |
| `npm run test:api`        | Run API tests (`tests/practice1/api.spec.ts`) |
| `npm run test:ui`         | Run UI tests (`tests/practice2/ui.spec.ts`)   |
| `npm run prepare`         | Set up Husky git hooks                        |
| `npm run allure:generate` | Generate an Allure report from test results   |
| `npm run allure:open`     | Open the generated Allure report              |

---

## CI/CD

This project uses **GitHub Actions** for continuous integration and deployment. The pipeline runs on every push to `master` and on all pull requests.

### Pipeline Overview

| Job               | Description                                                                |
| ----------------- | -------------------------------------------------------------------------- |
| **Lint & Format** | Installs dependencies, runs the linter, and checks code formatting         |
| **Test**          | Runs Playwright tests in parallel across 4 shards and uploads results      |
| **Allure Report** | Merges test results, generates an Allure report, and publishes it to Pages |

### Details

- **Triggers:** Runs on push to `master` and on all pull request branches
- **Node.js:** Uses Node.js version 24 with npm caching
- **Testing:** Executes Playwright tests sharded across 4 runners for faster feedback
- **Artifacts:** Uploads Allure results and Playwright traces (retained for 30 days)
- **Reporting:** Generates an Allure report with historical trend data per branch
- **Deployment:** Publishes the Allure report to GitHub Pages (per-branch subfolder) for the `main`, `service`, and `ui` branches
- **Summary:** Adds a direct link to the published report in the workflow summary

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/name`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

**Tamás Löki** - [@TomiMan7](https://github.com/TomiMan7)

Project Link: [https://github.com/TomiMan7/playwrightPlayground](https://github.com/TomiMan7/playwrightPlayground)
