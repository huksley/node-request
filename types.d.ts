export interface Options {
  method?: string;
  headers?: { [key: string]: string };
  verbose?: boolean;
  /** Default is 10000 */
  timeout?: number;
  encoding?: string;
}

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
export function request(url: string, options?: Options);
