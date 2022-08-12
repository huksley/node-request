# HTTP(s) Request

<span class="badge-npmversion"><a href="https://npmjs.com/package/node-request" title="View this project on NPM"><img src="https://img.shields.io/npm/v/node-request.svg" alt="NPM version" /></a></span> <span class="badge-npmsize"><a href="https://npmjs.com/package/node-request" title="View this project on NPM"><img src="https://img.shields.io/bundlephobia/min/node-request.svg" alt="NPM Size" /></a></span> <span class="badge-npmstats"><a href="https://npmjs.com/package/node-request" title="View this project on NPM"><img src="https://img.shields.io/npm/dw/.svg" alt="NPM Downloads" /></a></span>

Use as a dependency or copy-paste directly into your code.
Zero-dependency alternative of fetch for NodeJS (with different API).

```js
const { request } = import("node-request");
const res = await request("https://jsonip.com");
console.info("Your IP", res.body.ip, "headers", res.headers);
```

### Features

* Both CommonJS and ESM environment supported.
* Handles JSON, binary and compressed bodies (deflate, brotli, gzip)

