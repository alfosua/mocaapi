interface RuntimeEnv {
  ENTITIES: import('@cloudflare/workers-types').KVNamespace
}

namespace App {
  export interface Locals {
    runtime: import('@astrojs/cloudflare/runtime').PagesRuntime<RuntimeEnv>
  }
}
