import type { Metadata } from "next";
import LegalLayout from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Cookies Policy — Summentor Pro",
  description:
    "How Summentor Pro uses cookies and similar technologies, the types of cookies we use, and how to manage them.",
};

const LAST_UPDATED = "June 16, 2026";

export default function CookiesPolicyPage() {
  return (
    <LegalLayout title="Cookies Policy" lastUpdated={LAST_UPDATED}>
      <p>
        {
          'This Cookies Policy explains how Summentor Pro Sales & Marketing Consultants ("Summentor Pro", "we", "our", or "us") uses cookies and similar technologies when you visit our website.'
        }
      </p>

      <h2>What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They help
        websites function efficiently, improve user experience, remember preferences, and provide
        analytical information about website usage.
      </p>

      <h2>How We Use Cookies</h2>
      <p>We use cookies and similar technologies to:</p>
      <ul>
        <li>Ensure the proper functioning of our website</li>
        <li>Improve website performance and user experience</li>
        <li>Understand visitor behavior and website traffic</li>
        <li>Remember user preferences and settings</li>
        <li>Enhance website security</li>
        <li>Support marketing and communication activities</li>
      </ul>

      <h2>Types of Cookies We Use</h2>
      <h3>Essential Cookies</h3>
      <p>
        These cookies are necessary for the website to function properly and cannot be disabled.
      </p>
      <h3>Performance & Analytics Cookies</h3>
      <p>
        These cookies help us understand how visitors interact with our website by collecting
        anonymous information such as page visits, traffic sources, and user behavior.
      </p>
      <h3>Functionality Cookies</h3>
      <p>
        These cookies remember your preferences and settings to provide a more personalized
        experience.
      </p>
      <h3>Marketing Cookies</h3>
      <p>
        These cookies may be used to measure the effectiveness of marketing campaigns and improve
        communication with website visitors.
      </p>

      <h2>Third-Party Services</h2>
      <p>Our website may use third-party services such as:</p>
      <ul>
        <li>Google Analytics</li>
        <li>Google Tag Manager</li>
        <li>LinkedIn Insights</li>
        <li>Meta (Facebook) Pixel</li>
        <li>Other analytics and marketing tools</li>
      </ul>
      <p>
        These services may place cookies on your device in accordance with their own privacy
        policies.
      </p>

      <h2>Managing Cookies</h2>
      <p>
        Most web browsers allow you to manage, disable, or delete cookies through browser settings.
      </p>
      <p>
        Please note that disabling certain cookies may affect website functionality and user
        experience.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Cookies Policy from time to time. Any changes will be posted on this page
        with the revised effective date.
      </p>

      <h2>Contact Us</h2>
      <p>If you have any questions regarding this Cookies Policy, please contact:</p>
      <p>
        Summentor Pro Sales & Marketing Consultants
        <br />
        Email: <a href="mailto:info@summentorpro.com">info@summentorpro.com</a>
        <br />
        Website: <a href="https://www.summentorpro.com">www.summentorpro.com</a>
      </p>
    </LegalLayout>
  );
}
