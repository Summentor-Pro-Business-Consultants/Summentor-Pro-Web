import type { Metadata } from "next";
import LegalLayout from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — Summentor Pro",
  description:
    "Refund and cancellation terms for Summentor Pro events, awards, sponsorships and consulting services.",
};

const LAST_UPDATED = "June 16, 2026";

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Refund & Cancellation Policy" lastUpdated={LAST_UPDATED}>
      <h2>Events & Conferences</h2>
      <p>
        Event registration fees are generally non-refundable unless the event is cancelled by
        Summentor Pro.
      </p>
      <p>
        If an event is postponed or rescheduled, registrations may be transferred to the revised
        date.
      </p>
      <p>Delegate substitutions may be permitted upon prior written request.</p>

      <h2>Awards & Recognition Programs</h2>
      <p>Nomination fees, application fees or participation fees are non-refundable.</p>
      <p>Submission of nominations does not guarantee selection, shortlisting or recognition.</p>

      <h2>Sponsorships & Partnerships</h2>
      <p>
        Sponsorship, exhibition and partnership fees are non-refundable once confirmed unless
        otherwise agreed in writing.
      </p>

      <h2>Consulting Services</h2>
      <p>
        Consulting engagements are governed by the specific agreement executed between Summentor Pro
        and the respective client.
      </p>
      <p>
        Any refund provisions applicable to consulting assignments shall be governed solely by the
        terms of the relevant agreement.
      </p>

      <h2>Force Majeure</h2>
      <p>
        Summentor Pro shall not be liable for cancellations, delays or disruptions caused by
        circumstances beyond its reasonable control, including natural disasters, government
        restrictions, public emergencies or other unforeseen events.
      </p>

      <h2>Contact</h2>
      <p>For any refund or cancellation-related queries, please contact:</p>
      <p>
        Email: <a href="mailto:info@summentorpro.com">info@summentorpro.com</a>
      </p>
    </LegalLayout>
  );
}
