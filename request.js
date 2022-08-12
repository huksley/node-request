import { request as httpsRequest } from "https";
import { IncomingMessage, request as httpRequest } from "http";
import * as zlib from "zlib";
import { inspect } from "util";

/**
 * Makes HTTP(s) request and returns response with parsed body.
 *
 * ```
 * const res = await request("https://jsonip.com")
 * console.info("Your IP", res.body.ip, "headers", res.headers)
 * ```
 * @param {*} url - Absolute URL
 * @param {*} options - Options, like in fetch
 * @returns {IncomingMessage} Http response with body
 */
export const request = async (url, options) => {
  const { method, body, headers, timeout, verbose, encoding } = options || {};
  const payload = body ? (typeof body == "object" ? JSON.stringify(body) : body) : undefined;
  const u = new URL(url);

  if (verbose) {
    console.info("HTTP", method || "GET", url, payload ? "payload " + payload.length + " bytes" : "");
  }

  return new Promise((resolve, reject) => {
    const req = (u.protocol === "http:" ? httpRequest : httpsRequest)(
      url,
      {
        timeout: timeout || 10000,
        servername: u.host,
        rejectUnauthorized: options?.rejectUnauthorized || true,
        method: method || "GET",
        encoding: encoding !== undefined ? null : encoding,
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:103.0) Gecko/20100101 Firefox/103.0",
          ...(typeof body == "object"
            ? {
                "Content-Type": "application/json",
                "Content-Length": payload.length,
              }
            : {}),
          ...headers,
        },
      },
      (res) => {
        const contentType = res.headers["content-type"];
        const contentEncoding = res.headers["content-encoding"];
        if (verbose) {
          console.info("Got response", res.statusCode, res.statusMessage, "contentType", contentType, contentEncoding);
        }

        // Collect body
        let data = Buffer.alloc(0);
        res.on("data", (chunk) => (data = Buffer.concat([data, chunk])));
        res.on("error", (e) => {
          const err = new Error("HTTP request failed: " + url);
          err.cause = e;
          // Add properties but disallow too verbose dumping
          res[inspect.custom] = () => {
            return "**Response**";
          };
          // This disallows dump of response in error log and in 
          Object.defineProperty(err, "response", { enumerable: true, get: () => res });
          reject(err);
        });

        let handler = (func) => () => func(undefined, data);

        if (contentEncoding === "gzip") {
          handler = (func) => () => zlib.gunzip(data, (err, data) => func(err, data));
        }

        if (contentEncoding === "br") {
          handler = (func) => () => zlib.brotliDecompress(data, (err, data) => func(err, data));
        }

        if (contentEncoding === "deflate") {
          handler = (func) => () => zlib.inflate(data, (err, data) => func(err, data));
        }

        res.on(
          "end",
          handler((e, data) => {
            if (e) {
              const err = new Error("HTTP request failed: " + url);
              err.cause = e;
              // Add properties but disallow too verbose dumping
              res[inspect.custom] = () => {
                return "**Response**";
              };
              Object.defineProperty(err, "response", { enumerable: true, get: () => res });
              reject(err);
              return;
            }

            try {
              if (contentType === "application/json" || (contentType && contentType.startsWith("application/json;"))) {
                res.body = JSON.parse(data.toString(encoding || "utf-8"));
              } else if (!contentType || contentType.startsWith("text/")) {
                res.body = data.toString("utf-8");
              } else if (encoding) {
                res.body = data.toString(encoding);
              } else {
                res.body = data;
              }
            } catch (e) {
              const err = new Error("HTTP request failed: " + url);
              err.cause = e;
              // Add properties but disallow too verbose dumping
              res[inspect.custom] = () => {
                return "**Response**";
              };
              Object.defineProperty(err, "response", { enumerable: true, get: () => res });
              reject(err);
            }

            if (res.statusCode && res.statusCode >= 200 && res.statusCode <= 399) {
              resolve(res);
            } else {
              if (verbose) {
                console.info("HTTP request failed", url, res.statusCode);
              }
              const err = new Error("HTTP request failed: " + url);
              err.statusCode = res.statusCode;
              // Add properties but disallow too verbose dumping
              res[inspect.custom] = () => {
                return "**Response**";
              };
              Object.defineProperty(err, "response", { enumerable: true, get: () => res });
              reject(err);
            }
          })
        );
      }
    );

    if (payload !== undefined) {
      req.write(payload);
    }

    req.end();
  });
};
