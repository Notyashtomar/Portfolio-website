/**
 * Source of truth: System Analyst resume + CV (Nov 2026).
 * Do not invent roles, metrics, employers, or projects beyond those documents.
 */

export const profile = {
  name: "Yash Raj Singh Tomar",
  displayName: "YASH RAJ SINGH TOMAR",
  shortName: "Yash Tomar",
  title: "System Analyst & Team Lead",
  location: "New Delhi",
  phone: "+91 9311973552",
  email: "yash.tomar569@gmail.com",
  linkedin: "https://in.linkedin.com/in/yashraj-s-tomar200114",
  resumeFile: "/Yash-Raj-Singh-Tomar-Resume.docx",
  roles: [
    "System Analyst",
    "Team Lead",
    "MIS Analyst",
    "Business Analyst",
  ],
  summary:
    "System Analyst and Team Lead with 2+ years in system architecture, business application delivery, and financial analytics. Promoted within 7 months at Bird Group to lead a team that shipped 5 production systems, including a flight data platform used at 18 airports. Expert in prompt engineering, loop engineering, SQL, and Power BI; cut reporting turnaround by up to 40%.",
} as const;

export const focusAreas = [
  {
    title: "System Architecture",
    description:
      "Own schemas, 3-tier role-based access, audit logging, and integration flows reused across production systems.",
  },
  {
    title: "Delivery Leadership",
    description:
      "Run requirement workshops, UAT, rollout, and training with operations, finance, and station heads.",
  },
  {
    title: "Prompt & Loop Engineering",
    description:
      "Generate-evaluate-refine cycles for specs, code, tests, and documentation, adopted across the team.",
  },
  {
    title: "Business Applications",
    description:
      "FRIS, RMS, SMS, billing, and a suite of CRMs in daily use by operations, finance, and sales.",
  },
  {
    title: "Financial Analytics",
    description:
      "SQL, Python, Power BI, and Advanced Excel for MIS, KPI reporting, and forecasting.",
  },
  {
    title: "Stakeholder Reporting",
    description:
      "Daily, weekly, and monthly reports plus leadership dashboards that cut report preparation time.",
  },
] as const;

export const experience = [
  {
    id: "bird-lead",
    company: "Bird Group",
    role: "System Analyst and Team Lead",
    period: "Apr 2026 – Present",
    location: "Delhi",
    highlights: [
      "Promoted to System Analyst after 7 months as MIS Analyst and appointed to lead the team building and rolling out enterprise business applications across Bird Group.",
      "Directed delivery of 5 production systems in 8 months: FRIS, RMS, SMS, Billing Software, and a suite of 4 CRMs, each in daily use by operations, finance, and sales.",
      "Defined architecture standards (database schemas, 3-tier role-based access, audit logging, integration flows) reused across all 5 systems; owned requirement gathering, UAT, and sign-off with 3 stakeholder groups.",
      "Established prompt engineering and loop engineering practices (generate-evaluate-refine cycles) adopted by 100% of the team, shrinking documentation and build effort per release.",
    ],
  },
  {
    id: "bird-mis",
    company: "Bird Group",
    role: "MIS Analyst",
    period: "Sep 2025 – Mar 2026",
    location: "Delhi",
    highlights: [
      "Automated Excel-based financial reports and dashboards, cutting monthly report preparation time by 30%.",
      "Partnered with cross-functional stakeholders to streamline reporting workflows and reduce manual effort by 25%.",
      "Architected SQL data pipelines processing 50K+ financial records, reducing processing time by 35%.",
      "Began building internal tools with generative AI to remove repetitive reporting work, which led to the System Analyst role.",
    ],
  },
  {
    id: "wistful-finance",
    company: "Wistful Finance Pvt. Ltd.",
    role: "MIS Analyst",
    period: "Sep 2024 – Sep 2025",
    location: "New Delhi",
    highlights: [
      "Uncovered revenue and cost trends in 50K+ records using SQL, Python, and Power BI, raising reporting speed by 25%.",
      "Engineered automated reporting solutions, reducing data processing turnaround by 40%.",
      "Presented structured insights to senior management via Power BI, improving operational efficiency by 20%.",
    ],
  },
  {
    id: "sla-consultants",
    company: "SLA Consultants",
    role: "Business Analyst Intern",
    period: "Jul 2024 – Sep 2024",
    location: "New Delhi",
    highlights: [
      "Documented business requirements with cross-functional stakeholders, reducing workflow inefficiencies by 20% through structured analysis in SQL and Microsoft Excel.",
    ],
  },
] as const;

export const projects = [
  {
    slug: "fris",
    title: "Flight Recording Information System",
    subtitle: "Lead Architect · 2026",
    tagline:
      "Centralized flight data system for Bird Group ground operations, live at 18 international and domestic airports.",
    challenge:
      "Flight arrivals, departures, delays, and handling lived in station-level records, so head office had no single source of truth.",
    solution:
      "Led the team that designed and deployed one database for arrivals, departures, delays, turnaround, and handling, with role-based access and a reporting layer for station staff, supervisors, and head office.",
    tech: ["System Architecture", "Data Modeling", "RBAC", "Reporting"],
    architecture: [
      "One central database for every station",
      "Role-based access: station users see their data, management sees all stations",
      "Daily, weekly, and monthly reports plus on-time performance and exceptions",
      "Requirement gathering with station heads, phased rollout, and training across 18 airports",
    ],
    metrics: [
      { value: "18", label: "Airports live", numeric: 18, suffix: "" },
      { value: "3", label: "User tiers", numeric: 3, suffix: "" },
      { value: "2026", label: "Delivery", numeric: 0, suffix: "" },
    ],
    impact:
      "Took FRIS from concept to production at 18 airports, establishing a single source of truth for flight data across stations.",
    lessons: [
      "Shared architecture standards make multi-station rollout repeatable.",
      "Phased training is what turns a delivered system into daily use.",
    ],
  },
  {
    slug: "rms",
    title: "Resource Management System",
    subtitle: "Project Lead · 2026",
    tagline:
      "Organization-wide platform to register, allocate, and track equipment across every station.",
    challenge:
      "Equipment lived in manual station registers, so utilization and transfers were invisible to head office.",
    solution:
      "Built a master register with category, station, status, custodian, and maintenance history, plus allocation and transfer workflows with approval steps and a full audit trail.",
    tech: ["Workflow Automation", "Audit Trails", "Dashboards"],
    architecture: [
      "Master register replacing manual station books",
      "Allocation and transfer between stations with approvals",
      "Real-time utilization and availability dashboards",
      "Alerts on under-utilized or overdue assets",
    ],
    metrics: [
      { value: "100%", label: "Manual registers retired", numeric: 100, suffix: "%" },
      { value: "1", label: "Source of truth", numeric: 1, suffix: "" },
      { value: "2026", label: "Delivery", numeric: 0, suffix: "" },
    ],
    impact:
      "Retired 100% of manual registers in favour of a single source of truth with real-time utilization reporting.",
    lessons: [
      "Audit trails make station-to-station transfers trustworthy.",
      "Head-office dashboards only work if station data is the system of record.",
    ],
  },
  {
    slug: "sms",
    title: "Staff Management System",
    subtitle: "Delivery Lead · 2026",
    tagline:
      "Rosters, deployment, attendance, and headcount reporting for all stations on one shared data model with RMS.",
    challenge:
      "Workforce planning sat apart from resource tracking, so management could not see people and equipment per station together.",
    solution:
      "Delivered staff master, rosters, shift deployment, attendance, and headcount reporting on the same data model as RMS.",
    tech: ["Data Modeling", "Rosters", "Reporting"],
    architecture: [
      "Staff master shared with the RMS station model",
      "Rosters and deployment by station and shift",
      "Attendance and headcount reporting",
      "One view of people and resources per station",
    ],
    metrics: [
      { value: "1", label: "Shared data model", numeric: 1, suffix: "" },
      { value: "2026", label: "Delivery", numeric: 0, suffix: "" },
      { value: "All", label: "Stations covered", numeric: 0, suffix: "" },
    ],
    impact:
      "Station workforce planning now sits on the same model as equipment, so management sees people and resources together.",
    lessons: [
      "Reusing the RMS model avoided a second source of station truth.",
      "Headcount reporting only lands when rosters and attendance share a schema.",
    ],
  },
  {
    slug: "billing",
    title: "Billing Software",
    subtitle: "Solution Architect · 2026",
    tagline:
      "Billing engine built from scratch for private and government airport contracts, with configurable rate cards and a full audit trail.",
    challenge:
      "Private and government airport contracts needed different commercial rules without a separate codebase for each.",
    solution:
      "Designed configurable rate cards and contract rules per airport, automated invoice generation from operational data, and an approval workflow with credit notes and a complete audit trail.",
    tech: ["Billing", "Rate Cards", "Audit Trails", "Invoicing"],
    architecture: [
      "Configurable rate cards for private and government contracts",
      "Same engine serves both contract types without code changes",
      "Automated invoices from operational data",
      "Approval workflow, credit notes, and full audit trail",
    ],
    metrics: [
      { value: "2", label: "Contract types", numeric: 2, suffix: "" },
      { value: "2026", label: "Delivery", numeric: 0, suffix: "" },
      { value: "1", label: "Billing engine", numeric: 1, suffix: "" },
    ],
    impact:
      "One configurable engine invoices both private and government airport contracts without code changes per airport.",
    lessons: [
      "Rate cards belong in configuration, not in branching code.",
      "Audit trails are part of the product when invoices face compliance review.",
    ],
  },
  {
    slug: "crm-suite",
    title: "CRM Platform Suite",
    subtitle: "Technical Lead · 2026",
    tagline:
      "Four CRM systems — sales, client accounts, customer support, and vendor management — on a shared foundation.",
    challenge:
      "Each Bird Group business unit needed its own CRM workflow, and building them separately would have repeated the same access, timeline, and dashboard work.",
    solution:
      "Led four CRMs on one foundation: role-based access, activity timeline, notes, attachments, reminders, and management dashboards, using prompt templates for schema, form logic, and tests.",
    tech: ["CRM", "Prompt Engineering", "Generative AI", "RBAC"],
    architecture: [
      "Sales CRM: pipeline, follow-ups, conversion tracking",
      "Client accounts: contracts, contact history, renewals",
      "Support CRM: tickets, SLA timers, escalation",
      "Vendor CRM: onboarding, documents, performance reviews",
    ],
    metrics: [
      { value: "4", label: "CRM systems", numeric: 4, suffix: "" },
      { value: "1", label: "Shared foundation", numeric: 1, suffix: "" },
      { value: "2026", label: "Delivery", numeric: 0, suffix: "" },
    ],
    impact:
      "A shared foundation cut build time for each successive CRM across sales, accounts, support, and vendors.",
    lessons: [
      "The second CRM is where a shared architecture pays for itself.",
      "Prompt libraries for schema and tests keep each new CRM consistent.",
    ],
  },
  {
    slug: "financial-analytics",
    title: "Financial Forecasting & SQL Automation",
    subtitle: "Excel · SQL · Power BI · 2024–2026",
    tagline:
      "Forecasting models, leadership dashboards, and automated SQL pipelines across Bird Group and Wistful Finance.",
    challenge:
      "Monthly reporting depended on manual Excel work across large financial datasets, slowing leadership decisions.",
    solution:
      "Built forecasting models on 50K+ historical records, interactive Power BI dashboards, and SQL pipelines that pull from multiple sources.",
    tech: ["Excel", "SQL", "Power BI", "Python"],
    architecture: [
      "Forecasting models on historical revenue and cost records",
      "Power BI dashboards for leadership reporting",
      "Automated SQL pipelines from multiple sources",
      "KPI and MIS reports replacing manual monthly assembly",
    ],
    metrics: [
      { value: "40%", label: "Faster turnaround", numeric: 40, suffix: "%" },
      { value: "50K+", label: "Records modeled", numeric: 50, suffix: "K+" },
      { value: "25%", label: "Forecast accuracy", numeric: 25, suffix: "%" },
    ],
    impact:
      "Improved forecast accuracy by 25%, cut report preparation time by 30%, and reduced reporting turnaround by up to 40%.",
    lessons: [
      "Automation before the dashboard is what compounds reporting speed.",
      "Leadership adopts a dashboard when it replaces a recurring manual pack.",
    ],
  },
] as const;

export const skillCategories = [
  {
    category: "System Architecture",
    skills: [
      "System Architecture",
      "Solution Design",
      "Requirements Analysis",
      "Data Modeling",
      "Database Design",
      "API Design",
      "Role-Based Access Control",
      "SDLC",
      "UAT",
    ],
  },
  {
    category: "AI & Prompt Engineering",
    skills: [
      "Prompt Engineering",
      "Loop Engineering",
      "Large Language Models",
      "Agentic Workflows",
      "Generative AI",
      "AI-Assisted Development",
    ],
  },
  {
    category: "Data & Analytics",
    skills: [
      "SQL",
      "Python (Pandas)",
      "Power BI",
      "Advanced Excel",
      "MIS Reporting",
      "Financial Analysis",
      "Financial Forecasting",
      "Data Visualization",
    ],
  },
  {
    category: "Leadership",
    skills: [
      "Team Leadership",
      "Project Management",
      "Stakeholder Management",
      "Business Requirements",
      "CRM",
      "Billing Systems",
    ],
  },
] as const;

export const skillNodes = [
  { id: "arch", label: "Architecture", detail: "Schemas, access control, audit, and integration standards." },
  { id: "sql", label: "SQL", detail: "Pipelines and reporting queries across financial and operational data." },
  { id: "pbi", label: "Power BI", detail: "Leadership dashboards and a shared reporting layer." },
  { id: "excel", label: "Advanced Excel", detail: "Financial models, MIS packs, and forecasting." },
  { id: "prompt", label: "Prompt Engineering", detail: "Shared prompt library and generate-evaluate-refine loops." },
  { id: "python", label: "Python", detail: "Pandas analysis for cleaning and trend work." },
  { id: "rbac", label: "Access Control", detail: "3-tier role-based access reused across production systems." },
  { id: "crm", label: "CRM & Billing", detail: "Four CRMs and a configurable airport billing engine." },
  { id: "lead", label: "Team Lead", detail: "Sprint planning, reviews, and mentoring at Bird Group." },
  { id: "uat", label: "UAT", detail: "Requirement sign-off with operations, finance, and stations." },
  { id: "mis", label: "MIS Reporting", detail: "Automated daily, weekly, and monthly management reports." },
  { id: "forecast", label: "Forecasting", detail: "Models on 50K+ records with a 25% accuracy gain." },
] as const;

export const education = [
  {
    school: "Maharaja Agrasen College, University of Delhi",
    period: "2020 – 2023",
    credential: "Bachelor’s degree, Mathematics and Office Management",
    detail: "Focus: Statistics, Probability, and Data Analysis",
  },
  {
    school: "JM International School, Delhi",
    period: "2020",
    credential: "Higher Secondary (Physics, Chemistry, Mathematics)",
    detail: "Score: 90%",
  },
] as const;

export const certifications = [
  {
    title: "Financial Modelling and Business Analysis",
    issuer: "PwC",
    date: "",
    credentialUrl: "",
  },
  {
    title: "Data Analytics and Visualization",
    issuer: "Macquarie University",
    date: "",
    credentialUrl: "",
  },
  {
    title: "Introduction to Corporate Finance",
    issuer: "University of Pennsylvania",
    date: "",
    credentialUrl: "",
  },
] as const;

export const achievements = [
  {
    id: "systems",
    value: 5,
    suffix: "",
    label: "Production Systems",
    detail: "FRIS, RMS, SMS, Billing, and the CRM suite",
  },
  {
    id: "airports",
    value: 18,
    suffix: "",
    label: "Airports on FRIS",
    detail: "Flight data live across international and domestic stations",
  },
  {
    id: "efficiency",
    value: 40,
    suffix: "%",
    label: "Faster Reporting",
    detail: "Peak turnaround cut with SQL, Power BI, and Excel",
  },
  {
    id: "promo",
    value: 7,
    suffix: " mo",
    label: "To System Analyst",
    detail: "Promoted from MIS Analyst and given the team",
  },
  {
    id: "experience",
    value: 2,
    suffix: "+",
    label: "Years Experience",
    detail: "Architecture, business applications, and financial analytics",
  },
] as const;

export type Project = (typeof projects)[number];
