/// <reference types="astro/client" />

namespace App {
  export interface Locals {
    runtime: import('@astrojs/cloudflare/runtime').PagesRuntime
  }
}
