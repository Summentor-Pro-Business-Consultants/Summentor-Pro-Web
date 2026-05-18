import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const companies = [
  { name: "acko",        domain: "acko.com",                 altDomain: "ackoinsurance.com" },
  { name: "cashfree",    domain: "cashfree.com",             altDomain: null },
  { name: "clear",       domain: "clear.in",                 altDomain: "cleartax.in" },
  { name: "dalmia",      domain: "dalmiacement.com",         altDomain: "dalmiaworld.com" },
  { name: "eastwestseed",domain: "eastwestseed.com",         altDomain: null },
  { name: "godrej",      domain: "godrejenterprises.com",    altDomain: "godrej.com" },
  { name: "isb",         domain: "isb.edu",                  altDomain: null },
  { name: "paytm",       domain: "paytm.com",                altDomain: null },
  { name: "phonepe",     domain: "phonepe.com",              altDomain: null },
  { name: "polycab",     domain: "polycab.com",              altDomain: null },
  { name: "yogabars",    domain: "yogabars.in",              altDomain: "sproutlife.in" },
  { name: "sbi",         domain: "onlinesbi.sbi",            altDomain: "sbi.co.in" },
  { name: "tatasteel",   domain: "tatasteel.com",            altDomain: null },
  { name: "tatatele",    domain: "tatatelebusiness.com",     altDomain: "tata.com" },
  { name: "zaggle",      domain: "zaggle.in",                altDomain: null },
  { name: "zetwerk",     domain: "zetwerk.com",              altDomain: null },
];

async function tryFetch(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET() {
  const logoDir = path.join(process.cwd(), "public", "assets", "logos");
  await mkdir(logoDir, { recursive: true });

  const results: { name: string; status: string; source?: string; bytes?: number }[] = [];

  for (const co of companies) {
    const domains = [co.domain, co.altDomain].filter(Boolean) as string[];
    let buf: ArrayBuffer | null = null;
    let source = "";

    // Try Clearbit for each domain variant
    for (const d of domains) {
      buf = await tryFetch(`https://logo.clearbit.com/${d}`);
      if (buf && buf.byteLength > 800) { source = `clearbit:${d}`; break; }
    }

    // Fallback: Google high-res favicon for each domain variant
    if (!buf || buf.byteLength <= 800) {
      for (const d of domains) {
        buf = await tryFetch(
          `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${d}&size=256`
        );
        if (buf && buf.byteLength > 800) { source = `google:${d}`; break; }
      }
    }

    if (buf && buf.byteLength > 800) {
      await writeFile(path.join(logoDir, `${co.name}.png`), Buffer.from(buf));
      results.push({ name: co.name, status: "ok", source, bytes: buf.byteLength });
    } else {
      results.push({ name: co.name, status: "failed" });
    }
  }

  const ok = results.filter((r) => r.status === "ok").length;
  return NextResponse.json({ downloaded: ok, total: companies.length, results });
}
