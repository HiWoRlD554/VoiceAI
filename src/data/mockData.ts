export const mockLeads = [
  { id: 1, name: "John Smith", phone: "+1 555-0101", email: "john@realestate.com", company: "Smith Realty", status: "pending" },
  { id: 2, name: "Sarah Johnson", phone: "+1 555-0102", email: "sarah@marketingpro.com", company: "Marketing Pro", status: "pending" },
  { id: 3, name: "Michael Chen", phone: "+1 555-0103", email: "m.chen@salesforce.com", company: "Chen Sales Group", status: "pending" },
  { id: 4, name: "Emily Davis", phone: "+1 555-0104", email: "emily@agency360.com", company: "Agency 360", status: "pending" },
  { id: 5, name: "Robert Wilson", phone: "+1 555-0105", email: "rwilson@leadgen.io", company: "LeadGen Solutions", status: "pending" },
];

export const mockCallResults = [
  {
    id: 1,
    leadName: "Jennifer Martinez",
    phone: "+1 555-0201",
    company: "Martinez Properties",
    duration: "4:32",
    status: "interested",
    summary: "Expressed strong interest in AI calling services. Currently spending $5k/month on manual calling. Wants to schedule a demo next week.",
    timestamp: "2024-01-15 10:30 AM",
    score: 92,
  },
  {
    id: 2,
    leadName: "David Thompson",
    phone: "+1 555-0202",
    company: "Thompson Marketing",
    duration: "3:15",
    status: "interested",
    summary: "Looking to scale outbound operations. Has 500+ leads monthly. Interested in custom voice options and CRM integration.",
    timestamp: "2024-01-15 10:45 AM",
    score: 85,
  },
  {
    id: 3,
    leadName: "Lisa Anderson",
    phone: "+1 555-0203",
    company: "Anderson Sales Co",
    duration: "2:08",
    status: "not_interested",
    summary: "Currently satisfied with existing solution. May reconsider in Q3 when contract expires.",
    timestamp: "2024-01-15 11:00 AM",
    score: 35,
  },
  {
    id: 4,
    leadName: "James Brown",
    phone: "+1 555-0204",
    company: "Brown Real Estate",
    duration: "5:47",
    status: "interested",
    summary: "Very enthusiastic about AI capabilities. Wants to automate lead qualification for new listings. Budget approved.",
    timestamp: "2024-01-15 11:15 AM",
    score: 95,
  },
  {
    id: 5,
    leadName: "Amanda White",
    phone: "+1 555-0205",
    company: "White Agency Group",
    duration: "1:45",
    status: "callback",
    summary: "Requested callback next Tuesday. Currently in a meeting but expressed preliminary interest.",
    timestamp: "2024-01-15 11:30 AM",
    score: 60,
  },
];

export const campaignStats = {
  totalCalls: 247,
  answered: 189,
  interested: 67,
  notInterested: 98,
  callbacks: 24,
  avgDuration: "3:42",
  successRate: 35,
  creditsUsed: 494,
  creditsRemaining: 1506,
};

export const useCases = [
  {
    title: "Real Estate Agencies",
    description: "Qualify property leads, schedule viewings, and follow up with potential buyers automatically.",
    icon: "Building2",
  },
  {
    title: "Marketing Agencies",
    description: "Scale client outreach, conduct surveys, and nurture leads with personalized AI conversations.",
    icon: "Megaphone",
  },
  {
    title: "Sales Teams",
    description: "Automate cold calling, qualify prospects, and book meetings while your team focuses on closing.",
    icon: "TrendingUp",
  },
  {
    title: "Lead Generation Companies",
    description: "Process thousands of leads daily with consistent quality and instant AI-powered summaries.",
    icon: "Users",
  },
];

export const features = [
  {
    title: "AI Voice Calling Bot",
    description: "Natural-sounding AI agents that handle conversations like your best sales rep.",
    icon: "Bot",
  },
  {
    title: "Custom Call Scripts",
    description: "Create tailored scripts for any industry or use case with our intuitive builder.",
    icon: "FileText",
  },
  {
    title: "Knowledge-Based Conversations",
    description: "Upload your docs and let AI answer questions about your products and services.",
    icon: "Brain",
  },
  {
    title: "Excel Lead Upload",
    description: "Import thousands of leads instantly from Excel or CSV files.",
    icon: "FileSpreadsheet",
  },
  {
    title: "Call Recording & Transcripts",
    description: "Every call recorded and transcribed for quality assurance and training.",
    icon: "Mic",
  },
  {
    title: "AI Summaries & Lead Scoring",
    description: "Instant AI-generated summaries and intelligent lead scoring after each call.",
    icon: "Sparkles",
  },
];

export const howItWorks = [
  {
    step: 1,
    title: "Upload Your Leads",
    description: "Import your customer list via Excel or CSV. Our system validates and prepares your data.",
  },
  {
    step: 2,
    title: "AI Agent Calls",
    description: "Our voice AI reaches out to each lead with natural, human-like conversations.",
  },
  {
    step: 3,
    title: "Intelligent Conversations",
    description: "AI understands context, answers questions, and guides prospects through your offering.",
  },
  {
    step: 4,
    title: "Recording & Summary",
    description: "Every call is recorded, transcribed, and summarized with key insights extracted.",
  },
  {
    step: 5,
    title: "Qualified Leads Delivered",
    description: "Receive scored leads with AI summaries, ready for your sales team to close.",
  },
];
