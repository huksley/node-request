import { request } from "./request.js";

const res = await request("https://jsonip.com");
console.info("Your IP", res.body.ip, "headers", res.headers);

const ip = await request("https://checkip.amazonaws.com", { encoding: "utf8" });
console.info("Your IP 2", ip.body, typeof ip.body);

const awsIps = await request("https://ip-ranges.amazonaws.com/ip-ranges.json");
console.info("IP ranges fetched", awsIps.headers["content-length"], "bytes", typeof awsIps.body);

const ico = await request("https://www.google.com/favicon.ico");
console.info("Ico", typeof ico.body, "headers", ico.headers);

const gzip = await request("https://httpbin.org/gzip", { verbose: true });
console.info("Gzip", gzip.body, "headers", gzip.headers);

const brotli = await request("https://httpbin.org/brotli", { verbose: true });
console.info("brotli", brotli.body, "headers", brotli.headers);

const deflate = await request("https://httpbin.org/deflate", { verbose: true });
console.info("brotli", deflate.body, "headers", deflate.headers);

const s500 = await request("https://httpbin.org/status/500", { verbose: true }).catch((err) => {
  console.warn("Error", err.response.statusCode);
});
