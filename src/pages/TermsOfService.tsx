import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Terms of Service - Humble Halal"
        description="Terms of Service for using Humble Halal platform"
      />
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-heading font-bold text-4xl mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: November 2024</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Humble Halal ("the Platform"), you accept and agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our Platform.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Humble Halal is a business directory platform that connects users with halal businesses in Singapore.
              We provide information about businesses including but not limited to restaurants, cafes, services,
              and other establishments that cater to the Muslim community.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To access certain features of the Platform, you may need to create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">4. User Content</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Users may submit content including reviews, photos, and business information. By submitting content, you:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Grant us a non-exclusive, royalty-free license to use, display, and distribute your content</li>
              <li>Confirm that you own or have rights to the content you submit</li>
              <li>Agree not to submit false, misleading, or defamatory content</li>
              <li>Understand that we may moderate or remove content at our discretion</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">5. Business Listings</h2>
            <p className="text-muted-foreground leading-relaxed">
              Business owners may submit their businesses to be listed on the Platform. We reserve the right to
              approve, reject, or remove any business listing. Halal certification status displayed is based on
              information provided by businesses and/or public records. Users should verify certification status
              directly with the relevant authorities (e.g., MUIS) if in doubt.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">6. Prohibited Conduct</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Use the Platform for any unlawful purpose</li>
              <li>Submit false or misleading information</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Scrape or collect data from the Platform without permission</li>
              <li>Use the Platform to spam or send unsolicited communications</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">7. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Platform is provided "as is" without warranties of any kind. We do not guarantee the accuracy,
              completeness, or reliability of any content or information on the Platform. We are not responsible
              for the quality, safety, or legality of any business listed on our Platform.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, Humble Halal shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from your use of the Platform.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">9. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of significant
              changes by posting a notice on the Platform. Your continued use of the Platform after changes
              constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">10. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Singapore.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at{" "}
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

export default TermsOfService;
