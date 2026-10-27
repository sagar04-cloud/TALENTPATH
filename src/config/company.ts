/**
 * Central Configuration for Talent Path Solutions
 * 
 * Replace placeholders with verified client details as confirmed.
 * All phone numbers, emails, WhatsApp endpoints, and metadata are maintained here.
 */

export interface CompanyConfig {
  name: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  phone: {
    display: string;
    raw: string; // E.164 formatted for tel: links
  };
  whatsapp: {
    display: string;
    raw: string; // International format without + or spaces for wa.me link e.g. 919876543210
    defaultMessage: string;
  };
  email: {
    admissions: string;
    support: string;
    recruitment: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    fullFormatted: string;
    googleMapsUrl: string;
  };
  socialLinks: {
    linkedin: string;
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  analytics: {
    gaMeasurementId: string; // e.g. G-XXXXXXXXXX
  };
  siteUrl: string;
  operatingHours: string;
}

export const COMPANY_CONFIG: CompanyConfig = {
  name: "Talent Path Solutions",
  tagline: "Your Next Step Starts Here",
  shortDescription: "Empowering individuals and institutions through career guidance, flexible degrees, school education programs, and professional recruitment.",
  longDescription: "Talent Path Solutions is a dedicated education consultancy, career advisory, and workforce recruitment firm. We bridge the gap between academic aspiration and professional realization by delivering personalized guidance, flexible learning pathways, and trusted corporate talent solutions.",
  phone: {
    display: "+91 98765 43210", // Verified placeholder
    raw: "+919876543210",
  },
  whatsapp: {
    display: "+91 98765 43210", // Verified placeholder
    raw: "919876543210",
    defaultMessage: "Hello Talent Path Solutions! I would like to inquire about your programs and career guidance services.",
  },
  email: {
    admissions: "admissions@talentpathsolutions.com",
    support: "info@talentpathsolutions.com",
    recruitment: "recruitment@talentpathsolutions.com",
  },
  address: {
    street: "Level 4, Corporate Heights, MG Road",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    postalCode: "560001",
    fullFormatted: "Level 4, Corporate Heights, MG Road, Bengaluru, Karnataka 560001",
    googleMapsUrl: "https://maps.google.com/?q=Talent+Path+Solutions",
  },
  socialLinks: {
    linkedin: "https://www.linkedin.com/company/talent-path-solutions",
    facebook: "https://www.facebook.com/talentpathsolutions",
    instagram: "https://www.instagram.com/talentpathsolutions",
    twitter: "https://twitter.com/talentpathsol",
    youtube: "https://www.youtube.com/@talentpathsolutions",
  },
  analytics: {
    gaMeasurementId: "G-XXXXXXXXXX", // Replace with client's GA4 Measurement ID
  },
  siteUrl: "https://talentpathsolutions.com",
  operatingHours: "Monday – Saturday: 9:30 AM – 6:30 PM IST",
};
