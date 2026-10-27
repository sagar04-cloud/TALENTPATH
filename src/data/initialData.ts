import { Program, NewsArticle, Enquiry } from '../types';

export const INITIAL_PROGRAMS: Program[] = [
  {
    id: "prog-1",
    title: "Bachelor of Business Administration (BBA)",
    slug: "bba-distance-flexible",
    category: "undergraduate",
    short_description: "Comprehensive management foundation tailored for career aspirants and working learners seeking scheduling flexibility.",
    full_description: "The BBA program provides an in-depth understanding of business management principles, marketing dynamics, organizational behavior, financial accounting, and strategic planning. Designed with flexibility in mind, learners receive complete curriculum guidance, examination scheduling assistance, and academic mentoring.",
    eligibility: "10+2 / Pre-University Course (PUC) or equivalent from a recognized board.",
    learning_mode: "Distance & Flexible Blended",
    duration: "3 Years (6 Semesters)",
    fees: "Contact Counselor for verified fee schedule",
    is_published: true,
    featured: true,
    icon_name: "Briefcase",
    created_at: "2025-01-15T09:00:00Z"
  },
  {
    id: "prog-2",
    title: "Bachelor of Computer Applications (BCA)",
    slug: "bca-flexible-learning",
    category: "undergraduate",
    short_description: "Industry-aligned software development and computer application curriculum with practical project support.",
    full_description: "The BCA curriculum covers modern programming languages, database management, software engineering, web architectures, and system analysis. Perfect for tech enthusiasts aiming to enter the software sector or upskill while managing full-time work.",
    eligibility: "10+2 / PUC with Mathematics or Computer Science preferred.",
    learning_mode: "Online & Flexible Learning",
    duration: "3 Years (6 Semesters)",
    fees: "Contact Counselor for verified fee schedule",
    is_published: true,
    featured: true,
    icon_name: "Code2",
    created_at: "2025-01-16T10:30:00Z"
  },
  {
    id: "prog-3",
    title: "Master of Business Administration (MBA)",
    slug: "mba-executive-flexible",
    category: "postgraduate",
    short_description: "Advanced leadership, corporate strategy, finance, and human resource management for career acceleration.",
    full_description: "An advanced management degree offering specializations in Marketing, Human Resource Management, Finance, Operations, and Information Technology. Tailored specifically for ambitious professionals aiming for managerial advancement.",
    eligibility: "Graduation (Bachelor's Degree in any discipline) from a recognized university.",
    learning_mode: "Executive Flexible / Blended",
    duration: "2 Years (4 Semesters)",
    fees: "Contact Counselor for verified fee schedule",
    is_published: true,
    featured: true,
    icon_name: "Award",
    created_at: "2025-01-18T11:00:00Z"
  },
  {
    id: "prog-4",
    title: "SSLC / 10th Secondary Fast-Track Pathway",
    slug: "sslc-10th-secondary-support",
    category: "sslc_puc",
    short_description: "Accredited open schooling and private board completion assistance for discontinued or non-traditional students.",
    full_description: "Dedicated admission, study material facilitation, and examination guidance for students seeking to complete their Secondary School Leaving Certificate (SSLC / 10th Standard) through recognized open schooling boards such as NIOS and state open boards.",
    eligibility: "Minimum 14 years of age; basic literacy certification or previous academic records.",
    learning_mode: "Self-paced with weekend mentoring",
    duration: "1 Year / Flexible Exam Cycles",
    fees: "Contact Counselor for verified fee schedule",
    is_published: true,
    featured: true,
    icon_name: "GraduationCap",
    created_at: "2025-01-20T14:00:00Z"
  },
  {
    id: "prog-5",
    title: "PUC / 12th Senior Secondary Program (Arts, Comm, Sci)",
    slug: "puc-12th-senior-secondary",
    category: "sslc_puc",
    short_description: "Recognized Senior Secondary certification guidance allowing students to qualify for higher degrees and competitive exams.",
    full_description: "Guidance for Pre-University Course (PUC / +2) completion via recognized boards. Offering streams in Commerce (Accountancy, Business Studies, Economics), Arts (Sociology, History, Political Science), and Science pathways with dedicated tutor counseling.",
    eligibility: "Successful completion of SSLC / 10th standard from a recognized board.",
    learning_mode: "Distance & Open Board Mentored",
    duration: "1 to 2 Years depending on previous coursework",
    fees: "Contact Counselor for verified fee schedule",
    is_published: true,
    featured: true,
    icon_name: "BookOpen",
    created_at: "2025-01-22T08:00:00Z"
  },
  {
    id: "prog-6",
    title: "Master of Commerce (M.Com)",
    slug: "mcom-distance-flexible",
    category: "postgraduate",
    short_description: "Rigorous commerce, taxation, financial reporting, and corporate governance for finance professionals.",
    full_description: "A comprehensive post-graduate degree for finance, banking, accounting, and taxation professionals. Enables participants to deepen domain mastery while maintaining employment.",
    eligibility: "B.Com / BBA / BBM from a recognized university.",
    learning_mode: "Distance & Flexible Learning",
    duration: "2 Years (4 Semesters)",
    fees: "Contact Counselor for verified fee schedule",
    is_published: true,
    featured: false,
    icon_name: "TrendingUp",
    created_at: "2025-01-25T12:00:00Z"
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: "news-1",
    title: "How Flexible Degree Programs Are Reshaping Professional Career Growth in 2025",
    slug: "flexible-degree-programs-career-growth",
    excerpt: "With evolving workforce demands, flexible and distance degrees offer professionals a viable route to upskill without pausing their careers.",
    body: `Modern career trajectories rarely follow a single rigid path. Today's working professionals face an increasingly competitive global economy where advanced degrees and continuous education directly dictate upward mobility.

Flexible and distance degree programs, accredited by recognized higher education bodies, have emerged as a cornerstone of lifelong learning. Rather than requiring individuals to step away from full-time employment, flexible education structures provide asynchronous coursework, guided study cohorts, and strategic mentorship.

At Talent Path Solutions, we work closely with students and professionals to select programs that match their career trajectory, ensuring that every enrolled hour translates to measurable career leverage.`,
    cover_image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    category: "Education Trends",
    author: "Academic Advisory Team",
    is_published: true,
    published_at: "2025-02-10T10:00:00Z",
    seo_title: "How Flexible Degree Programs Reshape Professional Careers | Talent Path Solutions",
    seo_description: "Explore the growing role of accredited flexible degrees in career progression and how working professionals navigate higher education.",
    created_at: "2025-02-10T10:00:00Z"
  },
  {
    id: "news-2",
    title: "The Importance of Secondary & Senior Secondary Certification (SSLC & PUC)",
    slug: "importance-of-sslc-puc-certification",
    excerpt: "Why completing 10th and 12th standards remains the critical foundation for government exams, vocational growth, and university admissions.",
    body: `Discontinuing schooling midway due to financial constraints, family situations, or health challenges does not mean the end of one's educational aspirations.

SSLC (10th) and PUC / 12th Senior Secondary credentials are mandatory milestones required by:
1. University admissions boards across India and abroad.
2. Competitive government and civil service examinations.
3. Corporate and industrial employment compliance.

Open schooling pathways such as NIOS and state open boards provide legitimate, recognized second chances for learners of all ages. Talent Path Solutions provides comprehensive support from registration to exam preparation.`,
    cover_image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    category: "Career Guidance",
    author: "Admissions Counseling Desk",
    is_published: true,
    published_at: "2025-02-18T14:30:00Z",
    seo_title: "Importance of SSLC & PUC Certification | Talent Path Solutions",
    seo_description: "Learn how completing SSLC and PUC unlocks university access and career eligibility through open schooling programs.",
    created_at: "2025-02-18T14:30:00Z"
  },
  {
    id: "news-3",
    title: "Talent Acquisition Trends: What Employers Look for in 2025 Graduates",
    slug: "talent-acquisition-trends-2025",
    excerpt: "Insights into hiring standards, skill validation, and how candidates can position their portfolios effectively.",
    body: `Modern hiring managers are prioritizing practical problem-solving capabilities, cultural adaptability, and verified foundation skills alongside academic degrees.

For organizations, partnering with dedicated recruitment specialists ensures pre-screened talent pools, rapid turnaround, and lower attrition rates. For candidates, understanding employer expectations is the first step toward securing high-impact placements.`,
    cover_image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",
    category: "Recruitment Insights",
    author: "Corporate Talent Team",
    is_published: true,
    published_at: "2025-02-25T11:15:00Z",
    seo_title: "Talent Acquisition Trends 2025 | Talent Path Solutions",
    seo_description: "Explore corporate hiring trends, verified skill validation, and staffing practices for corporate leaders and ambitious candidates.",
    created_at: "2025-02-25T11:15:00Z"
  }
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: "ENQ-2025-101",
    created_at: "2025-03-01T10:15:00Z",
    full_name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98450 11223",
    service_type: "flexible_learning",
    status: "new",
    source_page: "/flexible-learning",
    interested_program: "Bachelor of Business Administration (BBA)",
    education_level: "12th Standard Passed",
    learning_mode: "distance",
    city_district: "Bengaluru",
    message: "I am currently working in sales and want to pursue a BBA through distance mode. Please share exam scheduling details.",
    consent_given: true,
    notes: [
      {
        id: "note-1",
        enquiry_id: "ENQ-2025-101",
        author: "Admin Counselor",
        content: "New lead arrived from Flexible Learning page. Verified phone format.",
        created_at: "2025-03-01T10:20:00Z"
      }
    ]
  },
  {
    id: "ENQ-2025-102",
    created_at: "2025-03-02T14:40:00Z",
    full_name: "Ananya Patel",
    email: "ananya.patel@example.com",
    phone: "+91 97234 55667",
    service_type: "career_guidance",
    status: "contacted",
    source_page: "/career-guidance",
    current_status: "Recent High School Graduate",
    area_of_interest: "Technology & Design",
    career_goal: "Transitioning to UI/UX and Software development",
    preferred_contact_method: "whatsapp",
    city_district: "Mysuru",
    message: "Seeking 1-on-1 counseling to choose between standard engineering vs flexible degree with internships.",
    consent_given: true,
    assigned_to: "Senior Advisor",
    notes: [
      {
        id: "note-2",
        enquiry_id: "ENQ-2025-102",
        author: "Senior Advisor",
        content: "Contacted student via WhatsApp on March 2. Scheduled advisory call for tomorrow 4 PM.",
        created_at: "2025-03-02T16:00:00Z"
      }
    ]
  },
  {
    id: "ENQ-2025-103",
    created_at: "2025-03-03T09:30:00Z",
    full_name: "Vikram Malhotra",
    email: "vikram@apextechsystems.com",
    phone: "+91 99801 44556",
    service_type: "recruitment",
    status: "qualified",
    source_page: "/recruitment",
    organization_name: "Apex Tech Systems Pvt Ltd",
    recruitment_requirement: "Junior Frontend Developers & Support Staff",
    number_of_positions: "5-10",
    message: "Looking for qualified candidates who have completed BCA or diploma in computer science for immediate hiring.",
    consent_given: true,
    assigned_to: "Head of Recruitment",
    notes: [
      {
        id: "note-3",
        enquiry_id: "ENQ-2025-103",
        author: "Head of Recruitment",
        content: "Reviewed organization requirements. Sent formal staffing profile deck and scheduled discovery meeting.",
        created_at: "2025-03-03T11:00:00Z"
      }
    ]
  },
  {
    id: "ENQ-2025-104",
    created_at: "2025-03-04T16:20:00Z",
    full_name: "Kavitha Sundaram",
    email: "kavitha.s@example.com",
    phone: "+91 94480 77889",
    service_type: "sslc_puc",
    status: "new",
    source_page: "/sslc-puc",
    interested_program: "PUC / 12th Senior Secondary Program (Commerce)",
    education_level: "SSLC Passed in 2021",
    learning_mode: "blended",
    city_district: "Hubballi",
    message: "Discontinued after 10th due to family responsibilities. Want to complete 12th Commerce now.",
    consent_given: true
  }
];
