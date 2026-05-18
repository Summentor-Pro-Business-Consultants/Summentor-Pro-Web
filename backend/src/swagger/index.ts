/**
 * swagger/index.ts — Aggregator that wires all module docs into the OpenAPI registry.
 *
 * Import order matters: each docs file runs its `registry.registerPath()` calls
 * as a side effect on import. They must all be evaluated before
 * `generateOpenAPIDocument()` is called (which happens in app.ts).
 *
 * To add a new module: create `modules/<module>/<module>.docs.ts` and add it below.
 */

export { generateOpenAPIDocument } from "./swagger.config.ts";

import "../modules/auth/auth.docs.ts";
import "../modules/contact/contact.docs.ts";
import "../modules/events/events.docs.ts";
import "../modules/blog/blog.docs.ts";
import "../modules/track/track.docs.ts";
import "../modules/analytics/analytics.docs.ts";
