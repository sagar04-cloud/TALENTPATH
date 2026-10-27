import { SEOHead } from '../components/common/SEOHead';
import { HeroSection } from '../components/home/HeroSection';
import { CompanyIntro } from '../components/home/CompanyIntro';
import { ServicesGrid } from '../components/home/ServicesGrid';
import { HowItWorks } from '../components/home/HowItWorks';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { FeaturedPrograms } from '../components/home/FeaturedPrograms';
import { CareerGuidanceCTA } from '../components/home/CareerGuidanceCTA';
import { NewsPreview } from '../components/home/NewsPreview';
import { FinalCTA } from '../components/home/FinalCTA';
import { InfiniteMarquee } from '../components/common/InfiniteMarquee';

export const HomePage = () => {
  return (
    <>
      <SEOHead
        title="Your Next Step Starts Here | Education, Career Guidance & Recruitment"
        description="Explore educational opportunities, discover career pathways, flexible degree courses, SSLC & PUC education, and corporate staffing with Talent Path Solutions."
      />
      
      <HeroSection />
      <InfiniteMarquee className="border-t-0 shadow-sm" />
      <CompanyIntro />
      <ServicesGrid />
      <HowItWorks />
      <WhyChooseUs />
      <FeaturedPrograms />
      <CareerGuidanceCTA />
      <NewsPreview />
      <FinalCTA />
    </>
  );
};
