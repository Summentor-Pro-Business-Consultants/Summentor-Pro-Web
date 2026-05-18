/**
 * swagger/index.ts — Aggregator that wires all module docs into the OpenAPI registry.
 *
 * Import order matters: each docs file runs its `registry.registerPath()` calls
 * as a side effect on import. They must all be evaluated before
 * `generateOpenAPIDocument()` is called (which happens in app.ts).
 *
 * To add a new module: create `<module>.docs.ts` and add it below.
 */

export { generateOpenAPIDocument } from "./swagger.config.ts";

import "./auth.docs.ts";
import "./contact.docs.ts";
import "./events.docs.ts";
import "./blog.docs.ts";
import "./track.docs.ts";
import "./analytics.docs.ts";
