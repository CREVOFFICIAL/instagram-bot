# Developers Guidelines

This document provides specifications to contribute to the project.

## Branch's
 
| Name      | Type     | Checkout               | Description                                   |
| ---       | ---      | ---                    | ---                                           |
| nightly   | alpha    | git checkout nightly   | All pull request here, draft code and tests   |
| beta      | beta     | git checkout beta      | If nightly correctly work, merge in beta      |
| master    | stable   | git checkout master    | If beta correctly work, merge in master       |

All developer work in nightly or in sub-branch of nightly. [Git flow](https://www.google.com/search?q=git+flow&oq=git+flow) is recommended. Only owner (example: @ptkdev) merge in beta and merge in master if code work correctly after tests.

## Update your fork (sync your code of branch)
If you fork repo for contributing before send pull request you need align your source code to latest code. This is simple, run:
1. `npm run git-set-upstream` (only one time)
2. `npm run git-pull-upstream` (sync your code before send pull request)

## Unit testing
`/tests/` folder contains all unit test with `mocha` and `chai`. `npm run tests` provides show status of tests.

This folder is mirror of all files/class/modules of project. IMHO is good convention.

## Commit message
Is recommended for consistency use similar commit message. I love `[Tag] Message` syntax. Example:

| Message                               | Status  | Description                   |
| ---                                   | ---     | ---                           |
| `[Feature] Available likemode_name`   | Good    | Tag Feature is ok             |
| `[Fix] Bad selector likemode_name`    | Good    | Tag Fix is ok                 |
| `[Test] New test for likemode_name`   | Good    | Tag Test is ok                |
| `[Update/Test] Test likemode_name`    | Good    | Multiple tags is ok           |
| `[Refactor] Utils constructor`        | Good    | Tag Refactor is ok            |
| `[Update] package.js`                 | Good    | Tag Update is ok              |
| `Update AUTHORS.md`                   | Bad     | Missing [ ]                   |
| `Fix`                                 | Bad     | Useless comment, missing [ ]  |
| `[Fix]text text text`                 | Bad     | Need space after ]            |
| `[Fixs] Bad selector likemode_name`   | Bad     | Don't use plural tag name     |

## Linter and snake_case
**Important:** Is recommended use eslint globally (`npm install eslint -g`) and use vs-code or sublime-text with eslint plugin.

`npm run lint` provides show syntax errors (eslint plugin in ide/editor show it automatically). After `git commit` the eslint run `--fix` command and fix automatically the 90% of syntax errors.

Other `eslint` rules are marked in `eslintrc.json` file, check it. 

### Syntax

| Type          | Syntax                 | Note                                          |
| ---           | ---                    | ---                                           |
| class         | Snake_case             | First letter uppercase (capital letter)       |
| method        | snake_case             | Lower case                                    |
| function      | snake_case             | Lower case                                    |
| var name      | snake_case             | Lower case                                    |
| let name      | snake_case             | Lower case                                    |
| const name    | snake_case             | Lower case                                    |
| enum / struct | SNAKE_CASE             | All letters uppercase (all capital letters)   |

It happens that another library use camelCase method and `eslint --fix` convert camelCase method in `snake_case`. Solution for this problem is add method or variable name in `eslintrc.json` whitelist. 

Example:
`"snakecasejs/whitelist": ["defaultViewport","executablePath"]` that ignore `executablePath` and `defaultViewport` camelCase name. See [snakecasejs](https://github.com/ptkdev/eslint-plugin-snakecasejs).

## NPM Version and package.json

| Name                  | Branch     | Description                      |
| ---                   | ---        |  ---                             |
| 1.0-nightly.20180101  | nightly    | Version-BranchName-YearMonthDay  |
| 1.0-beta.1            | beta       | Version-BranchName-NumberOfBeta  |
| 1.0                   | master     | Version                          |

Update the suffix value (in nightly branch) to current day. See [semver](https://semver.npmjs.com/).

Dependences are all set on @latest, IMHO is good support latest version of libraries (why? in primis: security!)

### Repository: difference `XXX-bot.js` vs `XXX-bot-lib`
Repository with suffix `-lib` is official library. Contains all code of bot, developer work in this repo and is possible use this library in your nodejs app. Is available on npm.

Repository with suffix `-.js` use library and contains Docker files. I use this repository for provide docker container and simply version of bot in rolling release. 