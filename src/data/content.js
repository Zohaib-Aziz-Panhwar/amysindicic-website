import { asset } from '../lib/asset.js'

// ---------------------------------------------------------------------------
// Every string below is transcribed from the client's approved design.
// Nothing here is invented copy. Where the design supplies no text for a page,
// the component renders a <Placeholder> — see components/Common.jsx.
//
// TODO (client): supply contact details and inner-page copy.
// ---------------------------------------------------------------------------

export const site = {
  name: 'Amy Sindicic',
  tagline: 'Executive Career Strategist & Coach',
  servicesUrl: 'https://transformations123.com',
  // Every "Book a Discovery Call" CTA points here.
  bookingUrl: 'https://amysindicic.simplybook.me/v2/#book',
  // Not present in the design — leave blank rather than invent.
  email: '',
  linkedin: '',
}

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'About Amy', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Testimonials', to: '/testimonials' },
]

export const hero = {
  eyebrow: 'Executive Career Strategist & Coach',
  titleLine1: 'Position Yourself For',
  titleLine2: 'What Comes Next.',
  text: 'Strategic guidance for accomplished leaders ready for their next chapter.',
  cta: 'Book a Discovery Call',
}

export const banner = {
  titleLine1: 'Experience Isn’t',
  titleLine2: 'The Problem.',
  titleLine3: 'Positioning Is.',
  text: 'Translate your experience into a clear, compelling executive value.',
  cta: 'Explore How I Can Help',
}

export const servicesHeading = 'Strategic Services For Executives'

export const services = [
  { slug: 'executive-coaching', title: 'Executive Coaching', blurb: 'Gain clarity and move forward with purpose.' },
  { slug: 'executive-positioning', title: 'Executive Positioning', blurb: 'Define and communicate your executive value.' },
  { slug: 'executive-branding', title: 'Executive Branding', blurb: 'Strengthen your resume, LinkedIn, and leadership brand.' },
  { slug: 'job-search-strategy', title: 'Job Search Strategy', blurb: 'Target the right opportunities and build visibility.' },
  { slug: 'interview-prep', title: 'Interview Prep', blurb: 'Communicate your value with confidence.' },
]

export const servicesCta = {
  line1: 'Visit transformations123.com',
  line2: 'For a full list of services',
  href: 'https://transformations123.com',
}

export const audiences = [
  { slug: 'government-leaders', title: 'Government Leaders', blurb: 'Position your experience for private-sector leadership.' },
  { slug: 'ses-leaders', title: 'SES Leaders & Candidates', blurb: 'Strengthen executive positioning and career strategy.' },
  { slug: 'military-leaders', title: 'Military Leaders', blurb: 'Translate military leadership into executive value.' },
  { slug: 'corporate-executives', title: 'Corporate Executives', blurb: 'Prepare for advancement, reinvention, or what comes next.' },
]

export const approachHeading = 'My Approach'

export const approach = [
  { n: '1', title: 'Clarity', text: 'Know where you’re going.' },
  { n: '2', title: 'Positioning', text: 'Define your value.' },
  { n: '3', title: 'Visibility', text: 'Strengthen your presence.' },
  { n: '4', title: 'Opportunity', text: 'Move forward strategically.' },
]

export const blogHeading = 'From The Blog'

export const posts = [
  {
    slug: 'why-government-executives-struggle-to-translate-their-value',
    title: 'Why Government Executives Struggle to Translate Their Value',
    image: asset('/images/blog-1.jpg'),
  },
  {
    slug: 'your-title-isnt-your-executive-brand',
    title: 'Your Title Isn’t Your Executive Brand',
    image: asset('/images/blog-2.jpg'),
  },
  {
    slug: 'everyone-has-ai-not-everyone-has-a-strategy',
    title: 'Everyone Has AI. Not Everyone Has a Strategy.',
    image: asset('/images/blog-3.jpg'),
  },
  {
    slug: '3-ways-to-position-your-experience-for-whats-next',
    title: '3 Ways to Position Your Experience for What’s Next',
    image: asset('/images/blog-4.jpg'),
  },
]

export const blogCta = 'View All Blog Posts'

export const closing = {
  titleLine1: 'You’ve built the experience.',
  titleLine2: 'Now position it for what’s next.',
  text: 'Ready to define your next move?',
  cta: 'Book a Discovery Call',
}

export const footer = {
  copyright: '© 2024 Amy Sindicic. All rights reserved.',
  connect: 'Let’s Connect',
  legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
  ],
}

// ---------------------------------------------------------------------------
// About Amy — supplied by the client (Google Doc, verbatim).
// ---------------------------------------------------------------------------
export const about = {
  name: 'Amy Sindicic',
  credentials: 'Executive Coach | Career Coach | Career Strategist | Personal Branding Specialist',
  lede: 'Amy Sindicic helps professionals navigate significant career transitions, strengthen their leadership, and position themselves for what comes next.',
  body: [
    'Her work combines executive and career coaching, career strategy, personal branding, and professional communication. She works with government and military leaders transitioning to the private sector, corporate professionals pursuing greater responsibility, and accomplished individuals seeking clarity and direction for their next chapter.',
    'Amy brings more than 30 years of experience teaching, coaching, and developing professionals across four continents. Her international background includes work with universities, businesses, and multinational organizations, as well as translation work for the French government and the World Bank.',
    'Her graduate education in international management and marketing, education, and communication brings an additional dimension to her work. She approaches career development through both a human and a market perspective: identifying a client’s strengths, understanding the audience, clarifying differentiators, and building a compelling professional position.',
    'Amy is particularly skilled at helping professionals translate complex experience into clear market value. For government and military leaders, that means transforming mission-driven responsibilities, leadership scope, and specialized expertise into language that resonates with private-sector decision-makers.',
  ],
  philosophyLead: 'Her philosophy is simple:',
  philosophy: 'Many accomplished professionals are not underqualified. They are underpositioned and undertranslated.',
  closing: 'Amy helps clients change that through greater clarity, stronger communication, and a strategy built around who they already are and where they want to go.',
  // Pulled from the paragraphs above for the stat strip.
  stats: [
    { figure: '30+', label: 'Years teaching, coaching\nand developing professionals' },
    { figure: '4', label: 'Continents of international\nexperience' },
    { figure: '2', label: 'Institutional clients — the French\ngovernment and the World Bank' },
  ],
}

// ---------------------------------------------------------------------------
// Testimonials — supplied by the client (Google Doc, verbatim).
//
// `photo`: reviewer portraits extracted from the client's own Google Doc
// (the plain-text export drops them; the ZIP/HTML export contains them).
// An empty string falls back to an initials monogram.
// ---------------------------------------------------------------------------
export const testimonials = [
  {
    name: 'Shehjad Khan',
    role: '',
    date: 'Sep 17, 2025',
    photo: asset('/images/testimonials/shehjad-khan.jpg'),
    rating: 5,
    quote: [
      'I had the pleasure of working with Amy on polishing my resume and preparing for interviews. She was incredibly responsive and went above and beyond what I asked for. Amy took the time to really listen, understand my background, and tailor her guidance to my specific profile. Her insights were practical, actionable, and made a real difference in how I present myself.',
      'I would highly recommend Amy to any senior executive looking to make a career transition. Her professionalism, expertise, and ability to truly connect with her clients set her apart',
    ],
  },
  {
    name: 'April Friedeman, RPA',
    role: 'Vice President Property Management',
    date: 'September 20, 2024',
    photo: asset('/images/testimonials/april-friedeman.jpg'),
    rating: 0,
    quote: [
      'Amy is an extremely talented and articulate writer who has a firm grasp on what present day employers are looking for from an employment screening process. Her personal coaching is superb and has helped me to secure numerous executive level leads. I would highly recommend her to anyone looking for their next career position.',
    ],
  },
  {
    name: 'Sandi L. Coleman, MD, MS',
    role: 'Board-Certified Internist · Medical Director · Principal Investigator · Career Pivot Community Founder and Coach',
    date: 'October 17, 2023',
    photo: asset('/images/testimonials/sandi-coleman.jpg'),
    rating: 0,
    quote: [
      'Amy was wonderful to work with. She helped me to update my CV and transform it into a resume for a career pivot. Amy also did a wonderful job in helping me to set up my LinkedIn profile which ultimately led to me being recruited for my new job. Thanks to Amy, I had an updated CV, resume, and cover letter. She was always very kind, professional, and patient. Amy gave great tips for my career pivot and I am ecstatic about the results. Thanks Amy!',
    ],
  },
  {
    name: 'Andrea Enzo P.',
    role: '',
    date: 'Mar 8, 2026',
    photo: asset('/images/testimonials/andrea-enzo.jpg'),
    rating: 5,
    quote: [
      'Amy helped me navigate the changes in my new role and my workplace by helping me step back, analyze the dynamics objectively, and develop a clear strategy for addressing any situation professionally.',
      'Her structured approach gave me the confidence and clarity to handle anything effectively and achieve a much better outcome than I expected.',
    ],
  },
  {
    name: 'Juan David Roa Giraldo, MD MSc MBA',
    role: 'Neurointensivista pediatra | Neuroinmunología - Epilepsia | Docente con enfoque en Investigación clínica',
    date: 'September 29, 2024',
    photo: asset('/images/testimonials/juan-david-roa.jpg'),
    rating: 0,
    quote: [
      'I had an important job interview, for a faculty position, for which I felt very well prepared; however, I decided to seek some advice from her. It was the best decision I could have made because my preparation was definitely insufficient for the interview I had to do. Thanks to her support, I was able to understand some important points that I hadn’t considered, and they were crucial for the success of the final interview. Highly recommended!',
    ],
  },
  {
    name: 'Eudith Januario',
    role: 'Medical Doctor',
    date: 'July 28, 2025',
    photo: asset('/images/testimonials/eudith-januario.jpg'),
    rating: 0,
    quote: [
      'The Best Interview Coach! I was referred to her by another MD and was truly impressed by her expertise, experience, and thorough approach. Her guidance greatly enhanced my interview skills, leading to excellent experiences during my application for the U.S. medical residency matching program.',
    ],
  },
]
