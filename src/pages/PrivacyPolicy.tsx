import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Privacy Policy - Humble Halal"
        description="Privacy Policy for Humble Halal platform - how we collect, use, and protect your data"
      />
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-heading font-bold text-4xl mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: November 2024</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Humble Halal ("we", "our", or "us") respects your privacy and is committed to protecting your
              personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We may collect the following types of information:</p>

            <h3 className="font-heading font-semibold text-xl mb-2 mt-6">Personal Information</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Name and email address when you create an account</li>
              <li>Phone number (optional)</li>
              <li>Profile information you choose to provide</li>
              <li>Business information if you register a business</li>
            </ul>

            <h3 className="font-heading font-semibold text-xl mb-2 mt-6">Usage Information</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Pages and features you access</li>
              <li>Search queries and interactions</li>
              <li>Device information and browser type</li>
              <li>IP address and approximate location</li>
            </ul>

            <h3 className="font-heading font-semibold text-xl mb-2 mt-6">Cookies and Tracking</h3>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to enhance your experience, analyze usage, and deliver
              personalized content. You can manage cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Provide and maintain our services</li>
              <li>Process your account registration and manage your account</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Send you updates, newsletters, and promotional content (with your consent)</li>
              <li>Improve our platform and develop new features</li>
              <li>Analyze usage patterns and optimize performance</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">4. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We may share your information with:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>
                <strong>Service providers:</strong> Third-party companies that help us operate our platform
                (e.g., hosting, analytics, payment processing)
              </li>
              <li>
                <strong>Business partners:</strong> With your consent, to provide joint services or promotions
              </li>
              <li>
                <strong>Legal authorities:</strong> When required by law or to protect our rights
              </li>
              <li>
                <strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We do not sell your personal information to third parties for their marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data
              against unauthorized access, alteration, disclosure, or destruction. However, no method of
              transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">6. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal data for as long as necessary to fulfill the purposes outlined in this
              Privacy Policy, unless a longer retention period is required by law. When you delete your account,
              we will delete or anonymize your personal data within a reasonable timeframe.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">7. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Withdraw consent at any time</li>
              <li>Data portability (receive your data in a structured format)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To exercise these rights, please contact us at the email address provided below.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">8. Third-Party Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our platform may contain links to third-party websites. We are not responsible for the privacy
              practices of these external sites. We encourage you to read their privacy policies before
              providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">9. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our services are not intended for children under 13 years of age. We do not knowingly collect
              personal information from children under 13. If we become aware that we have collected such
              information, we will take steps to delete it.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">10. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes
              by posting the new policy on this page and updating the "Last updated" date. We encourage you
              to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:{" "}
              <a href="mailto:hello@humblehalal.sg" className="text-primary hover:underline">
                hello@humblehalal.sg
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
