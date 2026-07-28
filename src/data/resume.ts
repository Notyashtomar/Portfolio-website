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
  {
    title: "Financial Analytics",
    description:
      "Transform raw financial data into actionable insights through KPI tracking, trend analysis, and business intelligence.",
  },
  {
    title: "MIS Reporting",
    description:
      "Automate daily, weekly, and monthly reports to improve operational visibility and decision-making.",
  },
  {
    title: "Dashboard Development",
    description:
      "Design interactive dashboards using Power BI, Tableau, and Excel for real-time business monitoring.",
  },
  {
    title: "SQL Automation",
    description:
      "Write optimized SQL queries, automate data extraction, and streamline reporting workflows.",
  },
  {
    title: "Financial Forecasting",
    description:
      "Build forecasting models to estimate revenue, expenses, and business growth using historical data.",
  },
  {
    title: "Data Visualization",
    description:
      "Present complex datasets with clean, intuitive charts and visuals that drive faster decisions.",
  },
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
    subtitle: "Excel · Oct 2023",
    tagline:
      "Built dynamic forecasting models on 50,000+ financial records using Excel, enabling budget planning and revenue projections with improved forecasting accuracy.",
    challenge:
      "Budget planning and revenue projections needed a reliable forecasting layer across a large historical financial dataset.",
    solution:
      "Built dynamic forecasting models on 50,000+ financial records using Excel to support budget planning and revenue projections with clearer trend visibility.",
    tech: ["Microsoft Excel", "Forecasting Models", "Financial Analysis"],
    architecture: [
      "Historical financial records structured for model inputs",
      "Dynamic Excel forecasting frameworks for budget and revenue planning",
      "Accuracy checks against historical performance",
      "Outputs designed for planning and projection decisions",
    ],
    metrics: [
      {
        value: "25%",
        label: "Forecast accuracy gain",
        numeric: 25,
        suffix: "%",
      },
      {
        value: "50K+",
        label: "Historical records",
        numeric: 50,
        suffix: "K+",
      },
      { value: "Oct 2023", label: "Delivery", numeric: 0, suffix: "" },
    ],
    impact:
      "Improved forecasting accuracy by 25% while enabling stronger budget planning and revenue projections across 50K+ historical records.",
    lessons: [
      "Dynamic models outperform static spreadsheets when planning cycles change.",
      "Forecast quality scales with clean historical coverage.",
    ],
  },
  {
    slug: "data-dashboard-development",
    title: "Executive Financial Dashboard",
    subtitle: "Excel & Power BI · Feb 2024",
    tagline:
      "Designed interactive Power BI dashboards to visualize revenue, expenses, profit margins, and KPIs across 60,000+ financial records, reducing manual reporting time.",
    challenge:
      "Leadership needed faster visibility into revenue, expenses, profit margins, and KPIs without slow manual report assembly.",
    solution:
      "Designed interactive Power BI dashboards, supported by Excel, to visualize financial performance across 60,000+ records and compress reporting cycles.",
    tech: ["Excel", "Power BI", "KPI Reporting"],
    architecture: [
      "Financial datasets prepared across revenue, expenses, and margins",
      "Excel as the structured analytical foundation",
      "Power BI visuals for executive-ready storytelling",
      "KPI views optimized to cut manual reporting effort",
    ],
    metrics: [
      {
        value: "35%",
        label: "Faster reporting",
        numeric: 35,
        suffix: "%",
      },
      {
        value: "60,000+",
        label: "Data rows",
        numeric: 60,
        suffix: "K+",
      },
      { value: "Feb 2024", label: "Delivery", numeric: 0, suffix: "" },
    ],
    impact:
      "Reduced manual reporting time by 35% while improving visibility into revenue, expenses, profit margins, and KPIs across 60,000+ financial records.",
    lessons: [
      "Executive dashboards win when KPIs are immediately actionable.",
      "Interactive visuals remove friction from recurring leadership reviews.",
    ],
  },
  {
    slug: "sql-data-extraction",
    title: "SQL Data Automation",
    subtitle: "SQL · Jun 2024",
    tagline:
      "Developed SQL scripts and automated reporting workflows to process 100,000+ records, improving data accuracy and reducing report generation time.",
    challenge:
      "Report generation depended on repetitive processing across large record volumes, slowing teams and introducing accuracy risk.",
    solution:
      "Developed SQL scripts and automated reporting workflows to process 100,000+ records with greater consistency and less manual effort.",
    tech: ["SQL", "Data Automation", "Reporting Workflows"],
    architecture: [
      "SQL scripts for structured extraction and transformation",
      "Automated reporting workflows for recurring generation",
      "Accuracy checks across large record volumes",
      "Outputs tuned for faster, cleaner business reporting",
    ],
    metrics: [
      {
        value: "40%",
        label: "Processing efficiency",
        numeric: 40,
        suffix: "%",
      },
      {
        value: "100K+",
        label: "Records processed",
        numeric: 100,
        suffix: "K+",
      },
      { value: "Jun 2024", label: "Delivery", numeric: 0, suffix: "" },
    ],
    impact:
      "Improved processing efficiency by 40%, strengthened data accuracy, and reduced report generation time across 100,000+ records.",
    lessons: [
      "Automation before the dashboard creates compounding speed gains.",
      "Consistent SQL workflows protect accuracy at scale.",
    ],
  },
  {
    slug: "financial-planning-budget",
    title: "Financial Planning & Budget Analysis",
    subtitle: "Excel · Power BI · Jan 2025",
    tagline:
      "Built a comprehensive budgeting model to analyze department-wise expenses, revenue forecasts, and budget variance, enabling faster financial planning and executive decision-making.",
    challenge:
      "Department-wise budget tracking was fragmented, causing delayed variance detection and slower executive decision cycles.",
    solution:
      "Built a comprehensive Excel budgeting model integrated with Power BI dashboards to track department expenses, revenue forecasts, and budget variance across 85K+ financial records.",
    tech: ["Excel", "Power BI", "Budget Modeling", "Variance Analysis"],
    architecture: [
      "Department-wise expense and revenue data structured in Excel",
      "Variance analysis layer comparing actuals vs. budgets",
      "Power BI dashboards for leadership budget reviews",
      "Automated alerts for budget overruns and forecast shifts",
    ],
    metrics: [
      { value: "28%", label: "Budget accuracy improved", numeric: 28, suffix: "%" },
      { value: "85K+", label: "Financial records",       numeric: 85, suffix: "K+" },
      { value: "Jan 2025", label: "Delivery",            numeric: 0,  suffix: "" },
    ],
    impact:
      "Improved budget accuracy by 28% and enabled real-time financial planning decisions across 85,000+ records for executive leadership.",
    lessons: [
      "Variance analysis surfaces gaps before they become strategic problems.",
      "Budget models are most effective when linked directly to leadership dashboards.",
    ],
  },
  {
    slug: "profitability-cost-analysis",
    title: "Profitability & Cost Analysis",
    subtitle: "SQL · Power BI · May 2025",
    tagline:
      "Designed a financial analytics dashboard to evaluate gross profit, operating costs, EBITDA trends, and product profitability across multiple business units.",
    challenge:
      "Leadership lacked a unified view of profitability drivers across product lines and business units, making cost optimization decisions slow.",
    solution:
      "Built SQL pipelines and Power BI dashboards evaluating EBITDA trends, gross profit, and operating costs across 120K+ transactions for multi-unit profitability analysis.",
    tech: ["SQL", "Power BI", "EBITDA Analysis", "Cost Modeling"],
    architecture: [
      "SQL extraction and transformation across multi-unit transaction data",
      "EBITDA and gross margin models built in Power BI",
      "Operating cost breakdown by product and business unit",
      "Trend analysis views for quarterly profitability reviews",
    ],
    metrics: [
      { value: "22%", label: "Cost optimization",        numeric: 22,  suffix: "%" },
      { value: "120K+", label: "Transactions analyzed",  numeric: 120, suffix: "K+" },
      { value: "May 2025", label: "Delivery",            numeric: 0,   suffix: "" },
    ],
    impact:
      "Drove 22% cost optimization by surfacing EBITDA and profitability trends across 120,000+ transactions in real-time Power BI dashboards.",
    lessons: [
      "Multi-unit profitability views reveal cross-subsidization that single-unit reporting hides.",
      "SQL-driven cost models allow faster scenario testing than manual spreadsheets.",
    ],
  },
  {
    slug: "cashflow-kpi-dashboard",
    title: "Cash Flow & Financial KPI Dashboard",
    subtitle: "Excel · SQL · Oct 2025",
    tagline:
      "Developed an executive dashboard to monitor cash flow, accounts receivable, accounts payable, liquidity ratios, and working capital, providing real-time visibility into organizational financial health.",
    challenge:
      "Finance teams lacked real-time cash flow visibility, leading to reactive liquidity management and delayed AP/AR decisions.",
    solution:
      "Developed an Excel and SQL-powered executive dashboard monitoring cash flow, AR/AP, liquidity ratios, and working capital across 150K+ financial entries.",
    tech: ["Excel", "SQL", "Cash Flow Modeling", "KPI Dashboards"],
    architecture: [
      "SQL pipelines aggregating AR, AP, and cash flow transaction data",
      "Excel models computing liquidity ratios and working capital",
      "Executive KPI dashboard with real-time health indicators",
      "Automated data refresh for daily financial snapshot delivery",
    ],
    metrics: [
      { value: "40%", label: "Reporting efficiency",    numeric: 40,  suffix: "%" },
      { value: "150K+", label: "Financial entries",     numeric: 150, suffix: "K+" },
      { value: "Oct 2025", label: "Delivery",           numeric: 0,   suffix: "" },
    ],
    impact:
      "Delivered 40% reporting efficiency gains by giving finance leadership real-time cash flow and liquidity visibility across 150,000+ financial entries.",
    lessons: [
      "Real-time cash flow dashboards shift finance teams from reactive to proactive liquidity management.",
      "AR/AP visibility in a single view eliminates the most common working capital blind spots.",
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
    date: "",
    credentialUrl: "",
  },
  {
    title: "Data Analytics & Visualization",
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
  {
    title: "Leadership Skills",
    issuer: "Indian Institute of Management Ahmedabad (IIMA)",
    date: "",
    credentialUrl: "",
  },
  {
    title: "How Software Ate Finance",
    issuer: "Stanford University",
    date: "",
    credentialUrl: "",
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
    value: 60,
    suffix: "K+",
    label: "Financial Records",
    detail: "Analyzed across forecasting, dashboards, and SQL automation",
  },
  {
    id: "projects",
    value: 3,
    suffix: "",
    label: "Featured Projects",
    detail: "Forecasting · Executive dashboards · SQL automation",
  },
  {
    id: "certs",
    value: certifications.length,
    suffix: "",
    label: "Certifications",
    detail: "PwC · Macquarie · UPenn · IIMA · Stanford",
  },
] as const;

export type Project = (typeof projects)[number];
