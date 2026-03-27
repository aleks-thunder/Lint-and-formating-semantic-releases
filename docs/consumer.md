# Consumer usage

Install package:

```bash
npm i -D @aleks-thunder/base
```

ESLint (`.eslintrc.cjs`):

```js
module.exports = {
  extends: ["@aleks-thunder/base/eslint"],
};
```

Prettier (`prettier.config.cjs`):

```js
module.exports = require("@aleks-thunder/base/prettier");
```

