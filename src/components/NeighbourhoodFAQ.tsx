import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface NeighbourhoodFAQProps {
  neighbourhoodName: string;
  region: string;
  businessCount: number;
  verifiedCount?: number;
  categories?: string[];
}

export const NeighbourhoodFAQ = ({
  neighbourhoodName,
  region,
  businessCount,
  verifiedCount = 0,
  categories = [],
}: NeighbourhoodFAQProps) => {
  // Generate dynamic FAQs based on neighbourhood data
  const faqs = [
    {
      question: `How many Halal businesses are in ${neighbourhoodName}?`,
      answer: `There are ${businessCount} ${businessCount === 1 ? 'verified Halal business' : 'verified Halal businesses'} in ${neighbourhoodName}, ${region}. This includes restaurants, cafes, groceries, and other Halal-certified establishments.`,
    },
    {
      question: `What types of Halal food are available in ${neighbourhoodName}?`,
      answer: categories.length > 0
        ? `In ${neighbourhoodName}, you can find a variety of Halal food options including ${categories.slice(0, 3).join(', ')}${categories.length > 3 ? `, and more` : ''}. Whether you're looking for traditional Malay cuisine, Middle Eastern dishes, or modern Halal restaurants, ${neighbourhoodName} has something for everyone.`
        : `${neighbourhoodName} offers a diverse range of Halal food options, from traditional Malay cuisine to international Halal restaurants. Browse our directory to discover all available options in this area.`,
    },
    {
      question: `Are there MUIS-certified restaurants in ${neighbourhoodName}?`,
      answer: verifiedCount > 0
        ? `Yes! ${neighbourhoodName} has ${verifiedCount} ${verifiedCount === 1 ? 'MUIS-certified establishment' : 'MUIS-certified establishments'}. All MUIS-certified businesses are clearly marked with a verification badge on our platform, giving you confidence in your dining choices.`
        : `While ${neighbourhoodName} has many Halal options, you can filter businesses by certification type to find MUIS-certified establishments. We also list Muslim-owned businesses that may not have formal MUIS certification but maintain Halal standards.`,
    },
    {
      question: `What are the best Halal restaurants near ${neighbourhoodName}?`,
      answer: `The best Halal restaurants in ${neighbourhoodName} are ranked by community ratings and reviews. Our directory shows top-rated establishments with ${businessCount > 0 ? 'high ratings' : 'excellent reviews'} from the Muslim community. You can sort by rating, review count, or popularity to find the perfect spot for your next meal.`,
    },
    {
      question: `Do businesses in ${neighbourhoodName} offer delivery?`,
      answer: `Many Halal businesses in ${neighbourhoodName} offer delivery services. Check individual business listings for delivery availability and contact information. You can also filter businesses by services offered to find those with delivery options.`,
    },
    {
      question: `What areas do ${neighbourhoodName} businesses serve?`,
      answer: `Businesses in ${neighbourhoodName} primarily serve the ${region} region of Singapore. Many establishments also offer delivery services that extend to nearby areas. Check each business listing for specific service areas and delivery zones.`,
    },
    {
      question: `How can I find Halal groceries in ${neighbourhoodName}?`,
      answer: `You can find Halal grocery stores and supermarkets in ${neighbourhoodName} by filtering our directory by category. Look for businesses categorized as "Groceries" or "Supermarkets" and check for MUIS certification or Muslim-owned status to ensure Halal compliance.`,
    },
    {
      question: `Are there prayer facilities near ${neighbourhoodName}?`,
      answer: `${neighbourhoodName} and the surrounding ${region} area have several mosques and prayer facilities. Some businesses also provide prayer spaces for customers. Check our directory for businesses that offer prayer facilities, or search for mosques and Islamic centers in the area.`,
    },
  ];

  // Generate FAQ schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h2 className="font-heading font-bold text-2xl md:text-3xl">
              Frequently Asked Questions About {neighbourhoodName}
            </h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Common questions about Halal businesses and services in {neighbourhoodName}, {region}.
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b">
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Hidden schema markup for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        </div>
      </div>
    </section>
  );
};

