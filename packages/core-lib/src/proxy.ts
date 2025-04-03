import { ProxyConfig } from "./types";

/**
 * Configuration for the development proxy
 */
export interface DevProxyConfig {
  /**
   * The URL of the guest app's production build
   */
  prodUrl: string;

  /**
   * The proxy configuration from the manifest
   */
  proxy: ProxyConfig;

  /**
   * Whether to enable debug logging
   */
  debug?: boolean;
}

/**
 * A class that handles proxying requests to a development server
 */
export class DevProxy {
  private prodUrl: string;
  private devUrl: string;
  private enabled: boolean;
  private pathRewrite: Record<string, string>;
  private headers: Record<string, string>;
  private debug: boolean;

  constructor(config: DevProxyConfig) {
    this.prodUrl = config.prodUrl;
    this.devUrl = config.proxy.devServerUrl;
    this.enabled = config.proxy.enabled;
    this.pathRewrite = config.proxy.pathRewrite || {};
    this.headers = config.proxy.headers || {};
    this.debug = config.debug || false;

    this.log("DevProxy initialized", {
      prodUrl: this.prodUrl,
      devUrl: this.devUrl,
      enabled: this.enabled,
    });
  }

  /**
   * Logs a message if debug is enabled
   */
  private log(...args: any[]): void {
    if (this.debug) {
      console.log("[DevProxy]", ...args);
    }
  }

  /**
   * Gets the URL to use for a given path
   * @param path The path to get the URL for
   * @returns The URL to use
   */
  getUrlForPath(path: string): string {
    if (!this.enabled) {
      return `${this.prodUrl}${path}`;
    }

    let rewrittenPath = path;
    for (const [pattern, replacement] of Object.entries(this.pathRewrite)) {
      const regex = new RegExp(pattern);
      if (regex.test(path)) {
        rewrittenPath = path.replace(regex, replacement);
        this.log(`Rewriting path: ${path} -> ${rewrittenPath}`);
        break;
      }
    }

    const url = `${this.devUrl}${rewrittenPath}`;
    this.log(`Proxying to: ${url}`);
    return url;
  }

  /**
   * Gets the headers to use for a request
   * @returns The headers to use
   */
  getHeaders(): Record<string, string> {
    return this.enabled ? this.headers : {};
  }

  /**
   * Checks if the proxy is enabled
   * @returns True if the proxy is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Sets whether the proxy is enabled
   * @param enabled Whether the proxy is enabled
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.log(`Proxy ${enabled ? "enabled" : "disabled"}`);
  }

  /**
   * Gets the development server URL
   * @returns The development server URL
   */
  getDevUrl(): string {
    return this.devUrl;
  }

  /**
   * Gets the production URL
   * @returns The production URL
   */
  getProdUrl(): string {
    return this.prodUrl;
  }
}

/**
 * Creates a new DevProxy instance
 */
export function createDevProxy(config: DevProxyConfig): DevProxy {
  return new DevProxy(config);
}
