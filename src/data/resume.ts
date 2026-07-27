/**
 * Source of truth: Yash resume format.docx
 * Do not invent roles, metrics, employers, or projects beyond this file.
 */

export const profile = {
  name: "Yash Raj Singh Tomar",
  displayName: "YASH RAJ SINGH TOMAR",
  shortName: "Yash Tomar",
  title: "Data Analyst",
  location: "New Delhi",
  phone: "+91 9311973552",
  email: "yashtomar142001@gmail.com",
  linkedin: "https://in.linkedin.com/in/yashraj-s-tomar200114",
  resumeFile: "/Yash-Raj-Singh-Tomar-Resume.docx",
  roles: [
    "Data Analyst",
    "MIS Analyst",
    "Business Analyst",
    "Financial Analyst",
  ],
  summary:
    "Data Analyst with 2+ years of experience in financial analytics, MIS reporting, and process automation. Improved reporting efficiency by up to 40% using Advanced Excel, SQL, and Power BI. Skilled in transforming large datasets into actionable insights for cost control, forecasting, and business decisions.",
} as const;

export const focusAreas = [
  "Financial Analytics",
  "MIS Reporting",
  "Dashboard Development",
  "SQL Automation",
  "Financial Forecasting",
  "Data Visualization",
] as const;

export const experience = [
  {
    id: "bird-group",
    company: "Bird Group",
    role: "MIS Analyst",
    period: "Sep 2025 – Present",
    location: "Delhi",
    highlights: [
      "Automated Excel-based financial reports and dashboards, improving reporting efficiency by 30%.",
      "Partnered with cross-functional stakeholders to streamline reporting workflows and reduce manual effort by 25%.",
      "Architected and optimized SQL-driven data pipelines processing 50K+ financial records, reducing data processing time by 35% while elevating KPI visibility and decision intelligence.",
    ],
  },
  {
    id: "wistful-finance",
    company: "Wistful Finance Pvt. Ltd.",
    role: "MIS Analyst",
    period: "Sep 2024 – Sep 2025",
    location: "New Delhi",
    highlights: [
      "Processed and analysed 50K+ financial records using SQL, Python, and Power BI, uncovering key performance trends that improved reporting efficiency by 25% and supported data-driven strategic decisions.",
      "Engineered automated reporting solutions, reducing data processing turnaround time by 40% and significantly improving operational efficiency.",
      "Delivered structured insights to senior management using Power BI and SQL, enabling faster strategic decision-making and improving operational efficiency by 20%.",
    ],
  },
  {
    id: "sla-consultants",
    company: "SLA Consultants",
    role: "Business Analyst Intern",
    period: "Jul 2024 – Sep 2024",
    location: "New Delhi",
    highlights: [
      "Gathered and documented business requirements in collaboration with cross-functional stakeholders, improving process clarity and reducing workflow inefficiencies by 20% using structured documentation and analysis in SQL and Microsoft Excel.",
    ],
  },
] as const;

export const projects = [
  {
    slug: "financial-forecasting",
    title: "Financial Forecasting Model",
    subtitle: "Excel · Jan 2026",
    tagline:
      "Forecasting models on 50K+ records that lifted accuracy by 25%.",
    challenge:
      "Revenue trends and cost-saving opportunities were hard to isolate without structured forecasting across a large historical dataset.",
    solution:
      "Designed and implemented financial forecasting models using advanced Microsoft Excel and SQL, analyzing 50K+ historical records to identify revenue trends and cost-saving opportunities.",
    tech: ["Microsoft Excel", "SQL", "Forecasting Models"],
    architecture: [
      "Historical financial records consolidated for trend analysis",
      "Advanced Excel models for revenue and cost forecasting",
      "SQL-backed analysis on 50K+ records",
      "Outputs structured for strategic planning decisions",
    ],
    metrics: [
      { value: "25%", label: "Forecast accuracy gain" },
      { value: "50K+", label: "Historical records" },
      { value: "Jan 2026", label: "Delivery" },
    ],
    impact:
      "Improved forecast accuracy by 25% and enabled data-driven strategic planning around revenue trends and cost-saving opportunities.",
    lessons: [
      "Forecast quality depends on clean historical coverage.",
      "Excel + SQL together make large-scale forecasting practical.",
    ],
  },
  {
    slug: "data-dashboard-development",
    title: "Financial Dashboard",
    subtitle: "Excel & Power BI · Sep 2025",
    tagline:
      "Interactive leadership dashboards on 50,000+ rows of financial data.",
    challenge:
      "Leadership needed faster KPI visibility without waiting on slow, manually assembled financial reports.",
    solution:
      "Designed interactive dashboards on 50,000+ rows of financial data for leadership reporting using Excel and Power BI.",
    tech: ["Excel", "Power BI", "KPI Reporting"],
    architecture: [
      "Financial datasets prepared for interactive exploration",
      "Excel models as the analytical foundation",
      "Power BI visuals for leadership-ready storytelling",
      "KPI views optimized for faster report preparation",
    ],
    metrics: [
      { value: "30%", label: "Faster report prep" },
      { value: "50,000+", label: "Data rows" },
      { value: "Sep 2025", label: "Delivery" },
    ],
    impact:
      "Reduced report preparation time by 30% while improving visibility into KPI performance for leadership.",
    lessons: [
      "Interactive dashboards succeed when KPI clarity comes first.",
      "Scale matters — 50K+ rows need intentional model design.",
    ],
  },
  {
    slug: "sql-data-extraction",
    title: "SQL Data Automation",
    subtitle: "SQL · Aug 2024",
    tagline:
      "Automated pipelines across sources that cut turnaround by 20%.",
    challenge:
      "Reporting depended on repetitive multi-source extraction before analysis could begin.",
    solution:
      "Built automated data pipelines using SQL to extract and transform data from multiple sources, processing 100K+ records.",
    tech: ["SQL", "Data Pipelines", "ETL"],
    architecture: [
      "Multi-source SQL extraction layer",
      "Transformation logic for consistent reporting tables",
      "Automated pipelines for recurring refresh cycles",
      "Output designed for faster business insight delivery",
    ],
    metrics: [
      { value: "40%", label: "Processing efficiency" },
      { value: "100K+", label: "Records processed" },
      { value: "20%", label: "Faster turnaround" },
    ],
    impact:
      "Reduced reporting turnaround time by 20%, increased data processing efficiency by 40%, and improved reporting consistency.",
    lessons: [
      "Automation before the dashboard creates compounding speed gains.",
      "Consistent transformation logic protects insight quality at scale.",
    ],
  },
] as const;

export const skillCategories = [
  {
    category: "Data & Analytics",
    skills: [
      "SQL",
      "Python (Pandas)",
      "Data Cleaning",
      "Exploratory Data Analysis (EDA)",
      "Data Visualization",
    ],
  },
  {
    category: "Finance & Reporting",
    skills: [
      "Financial Analysis",
      "MIS Reporting",
      "Financial Forecasting",
      "Dashboard Development",
    ],
  },
  {
    category: "Tools & Platforms",
    skills: ["Advanced Excel", "Power BI", "Stakeholder Communication"],
  },
] as const;

export const skillNodes = [
  {
    id: "sql",
    label: "SQL",
    detail: "Extraction, transformation, and multi-source data pipelines.",
  },
  {
    id: "excel",
    label: "Advanced Excel",
    detail: "Financial reports, dashboards, and forecasting models.",
  },
  {
    id: "pbi",
    label: "Power BI",
    detail: "Interactive dashboards and leadership-ready visualization.",
  },
  {
    id: "python",
    label: "Python",
    detail: "Pandas-based analysis for cleaning and insight generation.",
  },
  {
    id: "fa",
    label: "Financial Analysis",
    detail: "Cost control, forecasting, and decision-focused analytics.",
  },
  {
    id: "clean",
    label: "Data Cleaning",
    detail: "Preparing large datasets for reliable analysis.",
  },
  {
    id: "eda",
    label: "EDA",
    detail: "Exploratory analysis to surface trends and performance drivers.",
  },
  {
    id: "dash",
    label: "Dashboards",
    detail: "Interactive reporting for KPI visibility and leadership use.",
  },
  {
    id: "mis",
    label: "MIS Reporting",
    detail: "Management information systems and automated financial reports.",
  },
  {
    id: "forecast",
    label: "Forecasting",
    detail: "Financial forecasting models for planning and cost strategy.",
  },
  {
    id: "viz",
    label: "Visualization",
    detail: "Clear visual storytelling from complex financial datasets.",
  },
  {
    id: "stake",
    label: "Stakeholders",
    detail: "Cross-functional communication and insight delivery.",
  },
] as const;

export const education = [
  {
    school: "Maharaja Agrasen College, University of Delhi",
    period: "Aug 2020 – Jun 2023",
    credential: "Bachelor’s degree (Math and Office Management)",
    detail: "Focus: Statistics, Probability, Data Analysis · Delhi",
  },
  {
    school: "JM International School, Delhi",
    period: "Aug 2020",
    credential: "Higher Secondary (Physics, Chemistry, Math)",
    detail: "Score: 90% · Delhi",
  },
] as const;

export const certifications = [
  {
    title: "Financial Modelling & Business Analysis",
    issuer: "PwC",
  },
  {
    title: "Data Analytics & Visualization",
    issuer: "Macquarie University",
  },
  {
    title: "Introduction to Corporate Finance",
    issuer: "University of Pennsylvania",
  },
] as const;

export const achievements = [
  {
    id: "experience",
    value: 2,
    suffix: "+",
    label: "Years Experience",
    detail: "Financial analytics · MIS · process automation",
  },
  {
    id: "efficiency",
    value: 40,
    suffix: "%",
    label: "Reporting Efficiency",
    detail: "Peak improvement across Excel, SQL, and Power BI work",
  },
  {
    id: "records",
    value: 50,
    suffix: "K+",
    label: "Financial Records",
    detail: "Analyzed and processed across MIS and dashboard work",
  },
  {
    id: "projects",
    value: 3,
    suffix: "",
    label: "Featured Projects",
    detail: "Forecasting · Dashboards · SQL automation",
  },
  {
    id: "certs",
    value: certifications.length,
    suffix: "",
    label: "Certifications",
    detail: "PwC · Macquarie · University of Pennsylvania",
  },
] as const;

export type Project = (typeof projects)[number];
