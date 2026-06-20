import type { Metadata } from "next";
import LegalLayout from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Disclaimer — Summentor Pro",
  description:
    "Summentor Pro provides professional services on a best-efforts basis and does not guarantee specific business outcomes.",
};

const LAST_UPDATED = "June 16, 2026";

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Disclaimer" lastUpdated={LAST_UPDATED}>
      <p>
        Summentor Pro provides consulting, business facilitation, networking, strategic engagement,
        event management, awards, recognition platforms and related professional services.
      </p>
      <p>All services are provided on a best-efforts basis.</p>
      <p>Summentor Pro does not guarantee:</p>
      <ul>
        <li>Government approvals or sanctions</li>
        <li>Project awards or contracts</li>
        <li>Investments or funding</li>
        <li>Business partnerships</li>
        <li>Market access outcomes</li>
        <li>Commercial success</li>
        <li>Regulatory clearances</li>
        <li>Any specific business result</li>
      </ul>
      <p>
        Any information, guidance, introductions, recommendations or opportunities shared through
        our services are intended for general business purposes and should not be construed as
        legal, financial, investment or regulatory advice.
      </p>
      <p>
        Users are encouraged to conduct their own due diligence and seek professional advice before
        making business decisions.
      </p>
      <p>
        Participation in any event, summit, award program, networking activity or consulting
        engagement does not create any guarantee of future outcomes.
      </p>
      <p>By using our website and services, you acknowledge and agree to this disclaimer.</p>
    </LegalLayout>
  );
}
