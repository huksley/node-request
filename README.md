# HTTP(s) Request

<span class="badge-npmversion"><a href="https://npmjs.com/package/@huksley/request" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@huksley/request.svg" alt="NPM version" /></a></span> <span class="badge-npmsize"><a href="https://npmjs.com/package/@huksley/request" title="View this project on NPM"><img src="https://img.shields.io/bundlephobia/min/@huksley/request.svg" alt="NPM Size" /></a></span> <span class="badge-npmstats"><a href="https://npmjs.com/package/@huksley/request" title="View this project on NPM"><img src="https://img.shields.io/npm/dw/.svg" alt="NPM Downloads" /></a></span>

Use as a dependency or copy-paste directly into your code.
Zero-dependency alternative of fetch for NodeJS (with different API).

```js
const { request } = require("@huksley/request");

const res = await request("https://jsonip.com");
console.info("Your IP", res.body.ip, "headers", res.headers);
```

**ESM**

```js
import { request } from "@huksley/request";

const res = await request("https://jsonip.com");
console.info("Your IP", res.body.ip, "headers", res.headers);
```

### Features

* Both CommonJS and ESM environment supported.
* Single-file & gist-sized
* Handles JSON transparently
* Handles binary
* Handles compressed bodies (deflate, brotli, gzip)
* Promise-based
* Default timeout provided

