import type { Metadata } from "next";
import LegalLayout from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — Summentor Pro",
  description:
    "How Summentor Pro Sales & Marketing Consultants collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "June 16, 2026";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <p>
        {
          'Summentor Pro Sales & Marketing Consultants ("Summentor Pro", "we", "our", or "us") values your privacy and is committed to protecting your personal information.'
        }
      </p>

      <h2>Information We Collect</h2>
      <p>We may collect information including:</p>
      <ul>
        <li>Name</li>
        <li>Company Name</li>
        <li>Email Address</li>
        <li>Phone Number</li>
        <li>Designation</li>
        <li>Business Information</li>
        <li>Event Registration Details</li>
        <li>Website Usage Information</li>
      </ul>

      <h2>How We Use Information</h2>
      <p>We may use collected information to:</p>
      <ul>
        <li>Respond to inquiries</li>
        <li>Deliver consulting and facilitation services</li>
        <li>Manage event registrations and award nominations</li>
        <li>Share updates, newsletters and opportunities</li>
        <li>Improve website performance and user experience</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>Information Sharing</h2>
      <p>
        We do not sell or rent personal information. Information may be shared with trusted service
        providers, event partners or regulatory authorities when necessary for service delivery or
        legal compliance.
      </p>

      <h2>Data Security</h2>
      <p>
        We implement reasonable security measures to protect personal information from unauthorized
        access, misuse or disclosure.
      </p>

      <h2>Third-Party Links</h2>
      <p>
        Our website may contain links to third-party websites. We are not responsible for their
        content or privacy practices.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may request access, correction or deletion of your personal information by contacting
        us.
      </p>

      <h2>Changes to Policy</h2>
      <p>
        We reserve the right to update this Privacy Policy at any time. Changes will be posted on
        this page.
      </p>

      <h2>Contact</h2>
      <p>
        Email: <a href="mailto:info@summentorpro.com">info@summentorpro.com</a>
        <br />
        Website: <a href="https://www.summentorpro.com">www.summentorpro.com</a>
      </p>
    </LegalLayout>
  );
}
