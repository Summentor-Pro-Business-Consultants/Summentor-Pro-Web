import type { Metadata } from "next";
import LegalLayout from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service — Summentor Pro",
  description:
    "The terms governing your use of the Summentor Pro website, services, events, programs and platforms.",
};

const LAST_UPDATED = "June 16, 2026";

export default function TermsOfServicePage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated={LAST_UPDATED}>
      <p>Welcome to Summentor Pro.</p>
      <p>
        By accessing or using our website, services, events, programs or platforms, you agree to
        comply with these Terms of Service.
      </p>

      <h2>Use of Website</h2>
      <p>Users agree to:</p>
      <ul>
        <li>Provide accurate information</li>
        <li>Use the website lawfully</li>
        <li>Refrain from activities that may harm, disrupt or interfere with website operations</li>
      </ul>

      <h2>Intellectual Property</h2>
      <p>
        All content, trademarks, logos, event brands, award brands, publications, graphics and
        materials displayed on this website are the property of Summentor Pro and may not be
        reproduced, copied or distributed without prior written permission.
      </p>

      <h2>Events & Programs</h2>
      <p>
        Participation in events, conferences, awards, summits and programs is subject to applicable
        registration requirements and eligibility criteria.
      </p>
      <p>
        Summentor Pro reserves the right to modify speakers, schedules, venues, formats and program
        details where necessary.
      </p>

      <h2>No Guarantee of Outcomes</h2>
      <p>
        Participation in our services, consulting engagements, networking activities, business
        facilitation programs, introductions, events or awards does not guarantee:
      </p>
      <ul>
        <li>Government approvals</li>
        <li>Business contracts</li>
        <li>Investments</li>
        <li>Funding</li>
        <li>Partnerships</li>
        <li>Commercial success</li>
      </ul>

      <h2>Limitation of Liability</h2>
      <p>
        Summentor Pro shall not be liable for any indirect, incidental or consequential damages
        arising from the use of its website, services, events or programs.
      </p>

      <h2>Governing Law</h2>
      <p>
        These Terms shall be governed by the laws of India. Any disputes shall be subject to the
        exclusive jurisdiction of the courts of Bengaluru, Karnataka.
      </p>

      <h2>Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. Continued use of the website
        constitutes acceptance of the updated Terms.
      </p>
    </LegalLayout>
  );
}
