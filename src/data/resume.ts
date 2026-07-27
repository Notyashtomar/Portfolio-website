/**
 * Source of truth: Yash Bird Analyst (1).pdf
 * Do not invent roles, metrics, employers, or projects beyond this file.
 */

export const profile = {
  name: "Yash Raj Singh Tomar",
  displayName: "YASH RAJ SINGH TOMAR",
  shortName: "Yash Tomar",
  title: "Analyst",
  location: "New Delhi",
  phone: "+91 9311973552",
  email: "yashtomar142001@gmail.com",
  resumeFile: "/Yash-Raj-Singh-Tomar-Resume.pdf",
  roles: [
    "Business Analyst",
    "Financial Analyst",
    "MIS Analyst",
    "Project Lead",
    "Analyst",
  ],
  summary:
    "Results-driven Project Lead and Financial Analyst with expertise in data analytics, financial modelling, and project management. Skilled in leading teams, optimizing workflows, and delivering impactful business solutions. Proven ability to turn complex data into actionable insights that drive operational efficiency.",
} as const;

export const focusAreas = [
  "Business Analysis",
  "Financial Analytics",
  "MIS",
  "Project Leadership",
  "Automation",
  "Data Insights",
] as const;

export const experience = [
  {
    id: "bird-group",
    company: "Bird Group",
    role: "MIS Analyst",
    period: "Sep 2025 – Present",
    location: "New Delhi",
    highlights: [
      "Ensured accuracy and timely processing of financial transactions.",
      "Supported financial reporting and operational analysis.",
      "Led cross-functional teams to improve workflow efficiency and project delivery.",
      "Planned timelines, delegated tasks, and monitored progress to meet business goals.",
    ],
  },
  {
    id: "wistful-finance",
    company: "Wistful Finance Pvt. Ltd.",
    role: "MIS Analyst",
    period: "Sep 2024 – Aug 2025",
    location: "New Delhi",
    highlights: [
      "Collected, cleaned, and analyzed large financial datasets.",
      "Identified trends, risks, and growth opportunities.",
      "Supported management with data-driven insights.",
    ],
  },
  {
    id: "sla-consultants",
    company: "SLA Consultants India",
    role: "Business Analyst Intern",
    period: "Jul 2024 – Sep 2024",
    location: "New Delhi",
    highlights: [
      "Gathered and documented business requirements.",
      "Prepared workflow diagrams and process documents.",
      "Assisted in improving operational processes.",
    ],
  },
] as const;

export const projects = [
  {
    slug: "data-dashboard-development",
    title: "Data Dashboard Development",
    subtitle: "Excel & Power BI",
    tagline: "Interactive leadership dashboards that compressed reporting cycles.",
    challenge:
      "Reporting lived across fragmented spreadsheets, slowing decision cycles and making KPI visibility inconsistent for leadership.",
    solution:
      "Built interactive dashboards with Pivot Tables, VBA, and Power BI so financial and operational metrics could be explored in one place.",
    tech: ["Excel", "Pivot Tables", "VBA", "Power BI"],
    architecture: [
      "Source workbooks consolidated into structured Excel models",
      "Pivot-driven summary layers for fast slicing",
      "VBA automation for repeatable refresh workflows",
      "Power BI visuals for leadership-ready storytelling",
    ],
    metrics: [
      { value: "30%", label: "Faster reporting time" },
      { value: "Excel + Power BI", label: "Delivery stack" },
      { value: "Interactive", label: "Dashboard format" },
    ],
    impact:
      "Improved reporting time by 30%, giving stakeholders clearer KPI visibility with less manual assembly.",
    lessons: [
      "Automation compounds when the underlying data model is clean.",
      "Leadership dashboards succeed when exploration and clarity coexist.",
    ],
  },
  {
    slug: "sql-data-extraction",
    title: "SQL Data Extraction & Transformation",
    subtitle: "SQL Automation",
    tagline: "Automated multi-source extraction that lifted processing efficiency.",
    challenge:
      "Data lived across multiple sources, forcing repetitive manual extraction before analysis could even begin.",
    solution:
      "Automated data fetching and transformation with SQL queries so multi-source inputs could be prepared consistently and faster.",
    tech: ["SQL", "Data Extraction", "Transformation"],
    architecture: [
      "Multi-source query layer for structured extraction",
      "Transformation logic for clean analytical tables",
      "Reusable SQL patterns for recurring reporting needs",
    ],
    metrics: [
      { value: "40%", label: "Processing efficiency gain" },
      { value: "Multi-source", label: "Data coverage" },
      { value: "Automated", label: "Fetch workflow" },
    ],
    impact:
      "Improved processing efficiency by 40% by removing repetitive manual extraction steps.",
    lessons: [
      "The highest ROI automation often sits before the dashboard.",
      "Consistent transformation logic protects insight quality.",
    ],
  },
  {
    slug: "financial-forecasting",
    title: "Financial Data Analysis & Forecasting",
    subtitle: "Excel Analytics",
    tagline: "Trend analysis and forecasting models for revenue and cost decisions.",
    challenge:
      "Financial trends and cost-saving opportunities were hard to see without structured forecasting and comparative analysis.",
    solution:
      "Used advanced Excel techniques — VLOOKUP, INDEX-MATCH, and forecasting models — to analyze trends and surface revenue and cost-saving strategies.",
    tech: ["Excel", "VLOOKUP", "INDEX-MATCH", "Forecasting Models"],
    architecture: [
      "Lookup-driven reconciliation across financial tables",
      "Trend analysis on historical performance",
      "Forecasting models for planning scenarios",
    ],
    metrics: [
      { value: "Forecasting", label: "Model focus" },
      { value: "Revenue & Cost", label: "Decision lenses" },
      { value: "Excel", label: "Primary platform" },
    ],
    impact:
      "Enabled clearer trend visibility and supported optimization of revenue and cost-saving strategies.",
    lessons: [
      "Strong lookup architecture makes forecasting trustworthy.",
      "Financial insight is most useful when tied to an action lever.",
    ],
  },
] as const;

export const skillCategories = [
  {
    category: "Analytics & Finance",
    skills: [
      "Financial Analysis & Reporting",
      "Financial Modeling & Forecasting",
    ],
  },
  {
    category: "Project & Operations",
    skills: [
      "Project Planning & Execution",
      "Workflow & Process Optimization",
    ],
  },
  {
    category: "Leadership & Communication",
    skills: [
      "Team Leadership & Mentoring",
      "Presentation & Reporting",
      "Problem Solving & Time Management",
    ],
  },
  {
    category: "Tools & Technology",
    skills: [
      "Advanced MS Excel & Google Sheets",
      "Power BI / Tableau",
      "SQL",
      "Python (Data Analysis)",
      "MS Office Suite",
      "CRM / ERP Systems",
    ],
  },
] as const;

export const skillNodes = [
  {
    id: "ba",
    label: "Business Analysis",
    detail: "Requirements gathering, process documentation, and operational clarity.",
  },
  {
    id: "fm",
    label: "Financial Modelling",
    detail: "Forecasting, scenario thinking, and structured financial analysis.",
  },
  {
    id: "pbi",
    label: "Power BI",
    detail: "Interactive dashboards and leadership-ready visualization.",
  },
  {
    id: "excel",
    label: "Excel",
    detail: "Pivot Tables, lookups, and financial workbook architecture.",
  },
  {
    id: "adv-excel",
    label: "Advanced Excel",
    detail: "Complex modelling, automation-ready sheets, and analysis depth.",
  },
  {
    id: "sql",
    label: "SQL",
    detail: "Extraction, transformation, and multi-source data preparation.",
  },
  {
    id: "python",
    label: "Python",
    detail: "Data analysis workflows for cleaning and insight generation.",
  },
  {
    id: "vba",
    label: "VBA",
    detail: "Spreadsheet automation used in dashboard delivery workflows.",
  },
  {
    id: "tableau",
    label: "Tableau",
    detail: "Visual analytics alongside Power BI for storytelling.",
  },
  {
    id: "pm",
    label: "Project Management",
    detail: "Timeline planning, delegation, and delivery ownership.",
  },
  {
    id: "erp",
    label: "ERP",
    detail: "Working across ERP systems for operational and financial data.",
  },
  {
    id: "crm",
    label: "CRM",
    detail: "CRM systems for business and operational context.",
  },
  {
    id: "auto",
    label: "Automation",
    detail: "Reducing manual effort across reporting and data workflows.",
  },
  {
    id: "mis",
    label: "MIS",
    detail: "Management information systems, reporting accuracy, and analysis.",
  },
] as const;

export const education = [
  {
    school: "Delhi University (Maharaja Agrasen College)",
    period: "2020 – 2023",
    credential:
      "Bachelor’s in Mathematics (Hons.) with OMSP (Mathematical Statistics & Probability)",
    detail: "Focus on core mathematics, statistics, and data analysis.",
  },
  {
    school: "JM International School",
    period: "2020",
    credential: "Senior Secondary (Class XII) — Science",
    detail: "Score: 90%. Foundation in Physics, Chemistry, and Mathematics.",
  },
  {
    school: "JM International School",
    period: "2018",
    credential: "Secondary (Class X)",
    detail: "Score: 90%. Focus on analytical and problem-solving skills.",
  },
] as const;

export const certifications = [
  {
    title: "Introduction to Corporate Finance",
    issuer: "University of Pennsylvania",
  },
  {
    title: "Fundamentals of Quantitative Modeling",
    issuer: "University of Pennsylvania",
  },
  {
    title: "Financial Acumen for Non-Financial Managers",
    issuer: "University of Pennsylvania",
  },
  {
    title: "How Software Ate Finance",
    issuer: "Stanford University",
  },
  {
    title: "Financial Modeling & Business Analysis",
    issuer: "PwC",
  },
  {
    title: "Problem-Solving with Excel",
    issuer: "PwC",
  },
  {
    title: "Leadership Skills",
    issuer: "IIM Ahmedabad",
  },
  {
    title: "Excel Skills for Business: Essentials",
    issuer: "Macquarie University",
  },
  {
    title: "Analyzing & Visualizing Data with Microsoft Power BI",
    issuer: "Office Master",
  },
  {
    title: "Business Analytics & Finance Tools",
    issuer: "SLA Consultants India",
  },
] as const;

export const achievements = [
  {
    id: "experience",
    value: 3,
    suffix: "",
    label: "Professional Roles",
    detail: "Bird Group · Wistful Finance · SLA Consultants",
  },
  {
    id: "dashboards",
    value: 30,
    suffix: "%",
    label: "Faster Reporting",
    detail: "From interactive Excel & Power BI dashboards",
  },
  {
    id: "automation",
    value: 40,
    suffix: "%",
    label: "Processing Efficiency",
    detail: "From SQL extraction & transformation automation",
  },
  {
    id: "projects",
    value: 3,
    suffix: "",
    label: "Featured Projects",
    detail: "Dashboards · SQL automation · Financial forecasting",
  },
  {
    id: "certs",
    value: certifications.length,
    suffix: "",
    label: "Certifications",
    detail: "PwC · UPenn · Stanford · IIM Ahmedabad · more",
  },
] as const;

export type Project = (typeof projects)[number];
