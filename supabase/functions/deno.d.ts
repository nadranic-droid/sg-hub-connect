/// <reference types="https://deno.land/x/types/index.d.ts" />

declare namespace Deno {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
  export namespace env {
    export function get(key: string): string | undefined;
  }
}

