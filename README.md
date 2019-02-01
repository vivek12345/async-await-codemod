## ✨ async-await-codemod [![Build Status](https://travis-ci.org/vivek12345/async-await-codemod.svg)](https://travis-ci.org/vivek12345/async-await-codemod)

This repository contains a codemod script for use with
[JSCodeshift](https://github.com/facebook/jscodeshift) that help add try catch statements to asyc await calls.

### 🚚 Setup & Run

1. `yarn global add jscodeshift`
1. `git clone https://github.com/vivek12345/async-await-codemod.git`
1. Run `yarn install` in the async-await-codemod directory
1. `jscodeshift -t <codemod-script> <path>`
   * `codemod-script` - path to the transform file, see available scripts below;
   * `path` - files or directory to transform;
   * use the `-d` option for a dry-run and use `-p` to print the output for comparison;
   * use the `--extensions` option if your files have different extensions than `.js` (for example, `--extensions js,jsx`);
   * see all available [jscodeshift options](https://github.com/facebook/jscodeshift#usage-cli).

### 📒 Included Script

#### `async-await-with-try-catch`

Converts async await functions like below:-

```javascript
async function completeApplicationFlow() {
  // wait for get session status api to check the status
  let response;
  response = await getSessionStatusApi();
  // wait for getting next set of questions api
  response = await getNextQuestionsApi();
  // finally submit application
  response = await submitApplication();
}

```

To the following with try catch statements:-

```javascript
async function completeApplicationFlow() {
  // wait for get session status api to check the status
  let response;
  try {
    response = await getSessionStatusApi();
  } catch(e) {
    console.log(e);
  }
  // wait for getting next set of questions api
  try {
    response = await getNextQuestionsApi();
  } catch(e) {
    console.log(e);
  }
  // finally submit application
  try {
    response = await submitApplication();
  } catch(e) {
    console.log(e);
  }
}

```

## ⭐ Usage

```sh
jscodeshift -t transforms/async-await-with-try-catch.js <path>
```

If you want to replace the default `console.log(e)` with your custom function call for example `error.handleError(e)`,
you can pass that as an option `--catchBlock`

```sh
jscodeshift -t transforms/async-await-with-try-catch.js <path> --catchBlock=error.handleError
```

This will transform your code to:-

```javascript
async function completeApplicationFlow() {
  // wait for get session status api to check the status
  let response;
  try {
    response = await getSessionStatusApi();
  } catch(e) {
    error.handleError(e)
  }
  // wait for getting next set of questions api
  try {
    response = await getNextQuestionsApi();
  } catch(e) {
    error.handleError(e)
  }
  // finally submit application
  try {
    response = await submitApplication();
  } catch(e) {
    error.handleError(e)
  }
}

```


### Recast Options

Options to [recast](https://github.com/benjamn/recast)'s printer can be provided
through the `printOptions` command line argument

```sh
jscodeshift -t transform.js <path> --printOptions='{"quote":"double"}'
```

## 👍 Contribute

Show your ❤️ and support by giving a ⭐. Any suggestions and pull request are welcome !

### 📝 License

MIT © [viveknayyar](https://github.com/vivek12345)