import { useState, useRef, useEffect } from "react";

// ── LAYOUT ──────────────────────────────────────────────────────────────────
// 12 large nodes arranged in a circle (r=270, center 560,380)
// 3 categories at top arc, 9 domains filling the rest
// x = CX + R*sin(θ), y = CY - R*cos(θ)  (θ clockwise from north)

const CX = 560, CY = 380, R = 270;

const LARGE = [
  // ── Categories (top arc: 0°, 30°, 60°) ──
  { id: "cat-intern",   label: "Internships",     type: "cat", color: "#fb923c", x: 560, y: 110  },
  { id: "cat-research", label: "Research",         type: "cat", color: "#e879f9", x: 695, y: 146  },
  { id: "cat-projects", label: "Projects",         type: "cat", color: "#34d399", x: 794, y: 245  },
  // ── Domains (90°–330°) ──
  { id: "d-mleng",      label: "ML Engineering",   type: "dom", color: "#60a5fa", x: 830, y: 380  },
  { id: "d-sciml",      label: "Scientific ML",    type: "dom", color: "#a78bfa", x: 794, y: 515  },
  { id: "d-healthcare", label: "Healthcare",       type: "dom", color: "#fb7185", x: 695, y: 614  },
  { id: "d-timeseries", label: "Time Series",      type: "dom", color: "#4ade80", x: 560, y: 650  },
  { id: "d-remote",     label: "Remote Sensing",   type: "dom", color: "#2dd4bf", x: 425, y: 614  },
  { id: "d-robotics",   label: "Robotics",         type: "dom", color: "#818cf8", x: 326, y: 515  },
  { id: "d-cv",         label: "Computer Vision",  type: "dom", color: "#fbbf24", x: 290, y: 380  },
  { id: "d-nlp",        label: "NLP & LLMs",       type: "dom", color: "#22d3ee", x: 326, y: 245  },
  { id: "d-physics",    label: "Physics Informed",  type: "dom", color: "#f472b6", x: 425, y: 146  },
];

const LM = Object.fromEntries(LARGE.map(n => [n.id, n]));

// ── ITEMS (12 small nodes inside the ring) ──────────────────────────────────
const ITEMS = [
  // Research
  {
    id: "llm-ideation", short: "LLM Ideation",
    title: "LLM-Driven Automated Research Topic Ideation",
    cat: "cat-research", doms: ["d-nlp", "d-sciml", "d-mleng"],
    badge: "Aug 2025 – Aug 2026",
    meta: "Supervisor: Dr. Claus Horn, Yale University",
    bullets: [
      "Developing a multi-dimensional evaluation framework for AI-generated research ideas across novelty, feasibility, and diversity using signal processing and machine learning.",
      "Modeling inter-dimensional interactions with transfer learning, bias mitigation, and domain adaptation.",
    ],
    tags: ["LLMs", "Signal Processing", "Transfer Learning", "Bias Mitigation"],
    x: 681, y: 278,
  },
  {
    id: "nagan", short: "NAGAN",
    title: "Neuroplasticity Adaptive Graph Attention Networks for Motor Imagery Decoding",
    cat: "cat-research", doms: ["d-healthcare", "d-sciml", "d-timeseries"],
    badge: "May 2025 – Apr 2026",
    meta: "Final Year Thesis · Supervisor: Dr. R. Kanchana, SSN · Under review at Biomedical Signal Processing and Control",
    bullets: [
      "Developed the Neuroplasticity-Aware Graph Attention Network (NAGAN), integrating multi-scale temporal encoding with trial-specific phase-locking value (PLV) connectivity graphs, achieving up to 89.1% accuracy, 0.782 Cohen's Kappa, and 0.890 Macro-F1 on acute stroke motor imagery EEG decoding across PhysioNet, OpenBCI, and clinical stroke datasets.",
      "Extended NAGAN for calibration-free cross-subject decoding using Riemannian Procrustes Alignment (RPA), Differentiable Graph Generation (DGG), and Domain Adversarial Neural Networks (DANN), attaining 87.9% LOSO accuracy on acute stroke EEG and 75.2% on the UET-175 stroke cohort.",
    ],
    tags: ["PyTorch Geometric", "EEG", "Graph Attention", "Domain Adaptation", "BCI"],
    links: [
      { label: "Code", url: "https://github.com/juicjaane/Rewiring-Recognition" },
      { label: "Paper", url: "https://doi.org/10.2139/ssrn.6849798" },
    ],
    x: 710, y: 530,
  },
  {
    id: "argon", short: "Argon Gas",
    title: "Argon Gas Flow Optimisation for Multi-Crystalline Silicon Growth",
    cat: "cat-research", doms: ["d-sciml", "d-physics", "d-timeseries"],
    badge: "Mar 2024 – Jan 2025",
    meta: "Research Intern, SSN Research Centre · Best Paper at ICAMT & Indo-Japan Workshop on ML for Crystal Growth",
    bullets: [
      "Built an LSTM-based predictive model with a custom spatio-temporal loss to estimate CO concentration using CGSIM data; two-stage gas flow optimization via simulated annealing and gradient descent.",
      "Achieved a 1000× reduction in CO fluctuation to 0.1 ppm.",
    ],
    tags: ["LSTM", "Simulated Annealing", "Bayesian Optimisation", "Physics-Informed ML"],
    links: [
      { label: "Code", url: "https://github.com/juicjaane/Crystal-growth-Optimisation-Using-Machine-Learning" },
    ],
    x: 644, y: 482,
  },
  // Internships
  {
    id: "tyke-anomaly", short: "Anomaly Det.",
    title: "TykeVision – Anomaly Detection on Large-Scale Telemetry",
    cat: "cat-intern", doms: ["d-timeseries", "d-mleng"],
    badge: "May – Aug 2025",
    meta: "AI/ML Intern, TykeVision India",
    bullets: [
      "Developed a Kubernetes anomaly detection pipeline using ClickHouse and eBPF telemetry on large-scale time series data, improving precision from 0.2 to 0.87 with statistical and deep learning models.",
    ],
    tags: ["ClickHouse", "eBPF", "Kubernetes", "Time Series", "Anomaly Detection"],
    x: 765, y: 430,
  },
  {
    id: "tyke-agent", short: "Agentic RCA",
    title: "TykeVision – AI-Driven Root Cause Analysis Agent",
    cat: "cat-intern", doms: ["d-nlp", "d-mleng"],
    badge: "May – Aug 2025",
    meta: "AI/ML Intern, TykeVision India",
    bullets: [
      "Designed a production-deployed AI-driven root cause analysis agent using LangGraph, Qdrant, and Prometheus, reducing MTTR by 30–50% through real-time alerting.",
    ],
    tags: ["LangGraph", "Qdrant", "Prometheus", "Agentic AI"],
    x: 616, y: 231,
  },
  {
    id: "konect", short: "Konect U",
    title: "Konect U – Agentic Automation & LLM Pipeline",
    cat: "cat-intern", doms: ["d-nlp", "d-mleng"],
    badge: "Aug 2024 – Feb 2025",
    meta: "AI/ML Engineer Intern",
    bullets: [
      "Built and deployed agentic automation systems for dynamic form filling and browser workflows on AWS, reducing application processing time by 65%.",
      "Developed and optimized a locally fine-tuned LLM paraphrasing pipeline, supporting 9,000 users worldwide.",
    ],
    tags: ["AWS", "Agentic Automation", "LLM Fine-tuning", "Browser Automation"],
    x: 476, y: 250,
  },
  // Projects
  {
    id: "h2r", short: "H2R",
    title: "H2R – Human-to-Robot Trajectory Transfer from Monocular Video",
    cat: "cat-projects", doms: ["d-robotics", "d-cv", "d-mleng"],
    badge: "Apr 2026 · Personal Project",
    meta: "Democratising robot-learning data from everyday video",
    bullets: [
      "Built a pipeline that converts a single monocular webcam video of human hand manipulation into a Franka Panda joint-angle trajectory with no teleoperation hardware, producing demonstrations drop-in compatible with ACT and Diffusion Policy.",
      "Chained MediaPipe hand tracking, Depth Anything V2 metric depth, 3D smoothing, and IK solving in MuJoCo.",
    ],
    tags: ["MuJoCo", "MediaPipe", "Depth Anything V2", "Inverse Kinematics", "Robot Learning"],
    links: [
      { label: "Code", url: "https://github.com/juicjaane/H2R" },
    ],
    x: 505, y: 565,
  },
  {
    id: "fetal-us", short: "Fetal Ultrasound",
    title: "Fetal Ultrasound Landmark Detection & Segmentation",
    cat: "cat-projects", doms: ["d-cv", "d-healthcare"],
    badge: "Jan 2026",
    meta: "",
    bullets: [
      "Built a deep learning pipeline for automatic fetal landmark localization and skull boundary segmentation to support biometric measurement in prenatal screening.",
      "Implemented heatmap regression and segmentation models with geometric fitting, improving accuracy of BPD and OFD estimates on curated ultrasound datasets.",
    ],
    tags: ["Heatmap Regression", "Segmentation", "Medical Imaging", "PyTorch"],
    links: [
      { label: "Code", url: "https://github.com/juicjaane/Fetal-Ultrasound-Landmark-Detection" },
    ],
    x: 551, y: 482,
  },
  {
    id: "career-align", short: "Career Align",
    title: "Career Align – Resume Analysis & Recommendation Platform",
    cat: "cat-projects", doms: ["d-nlp", "d-mleng"],
    badge: "Aug 2025",
    meta: "Adopted by SSN peers; under review for SSN Career Development Center",
    bullets: [
      "Developed a multi-agent resume analysis system with role-based recommendations, deterministic scoring metrics, and semantic evaluation.",
    ],
    tags: ["LangGraph", "Multi-Agent", "Semantic Eval", "NLP"],
    links: [
      { label: "Live", url: "https://jobreadyssn.vercel.app" },
    ],
    x: 740, y: 345,
  },
  {
    id: "streak", short: "Streak/Stars",
    title: "Streak & Star Detection in Astronomical Images",
    cat: "cat-projects", doms: ["d-cv"],
    badge: "May 2025",
    meta: "",
    bullets: [
      "Built an image processing pipeline to segment streaks and stars and trained an RCNN-based detector for real-time inference.",
      "Designed a method that removes the need for a large labelled dataset while preserving accuracy and generalisability.",
    ],
    tags: ["RCNN", "Image Processing", "Object Detection", "OpenCV"],
    links: [
      { label: "Code", url: "https://github.com/juicjaane/Streak-and-Stars" },
    ],
    x: 445, y: 475,
  },
  {
    id: "abusive", short: "Abusive Det.",
    title: "Women-targeted Abusive Comment Detection in Tamil",
    cat: "cat-projects", doms: ["d-nlp"],
    badge: "Jan 2025 · DravidianLangTech@NAACL2025",
    meta: "Peer-reviewed paper accepted at ACL Anthology",
    bullets: [
      "Fine-tuned the MuRIL Transformer on a manually annotated Tamil dataset, achieving 77.76% accuracy for women-targeted abusive comment detection in a low-resource language setting.",
    ],
    tags: ["MuRIL", "Transformers", "Low-Resource NLP", "Tamil"],
    links: [
      { label: "Code", url: "https://github.com/saaaathvik/wise" },
      { label: "Paper", url: "https://aclanthology.org/2025.dravidianlangtech-1.6/" },
    ],
    x: 383, y: 259,
  },
  {
    id: "onyx", short: "Onyx",
    title: "Onyx – Carbon Offset Tracking for Coal Mining Operations",
    cat: "cat-projects", doms: ["d-nlp", "d-remote"],
    badge: "Nov 2024 · HackZ Finalist (1,500+ teams)",
    meta: "",
    bullets: [
      "Built a platform for carbon offset estimation in coal mining using open-source datasets and satellite-based analytics.",
      "Fine-tuned LLMs for RAG and table question answering on Indian sustainability standards.",
    ],
    tags: ["RAG", "LLM Fine-tuning", "Table QA", "Satellite Analytics"],
    x: 430, y: 560,
  },
  {
    id: "retinal", short: "Retinal Seg.",
    title: "Retinal Vessel Segmentation & Diabetic Risk Prediction",
    cat: "cat-projects", doms: ["d-cv", "d-healthcare"],
    badge: "Nov 2024",
    meta: "SSN College of Engineering",
    bullets: [
      "Built a novel retinal vessel segmentation pipeline achieving 92% accuracy compared to expert annotations.",
      "Trained classical and deep learning models (VGG16, ResNet50, EfficientNetB0); deployed the best model via Docker and GCP with a Firebase-hosted web interface for real-time inference.",
    ],
    tags: ["VGG16", "ResNet50", "EfficientNetB0", "Docker", "GCP"],
    links: [
      { label: "Code", url: "https://github.com/juicjaane/Retinal-Vessel-Segmentation-and-Automated-Diabetic-Risk-Detection-" },
    ],
    x: 620, y: 575,
  },
  {
    id: "un-fellow", short: "UN Fellow",
    title: "UN Millennium Fellow – Urbanization Study, Tamil Nadu",
    cat: "cat-projects", doms: ["d-remote", "d-cv"],
    badge: "Sep 2024 · UN Academic Impact",
    meta: "UN Academic Impact Millennium Fellow 2024, SSN College of Engineering",
    bullets: [
      "Led an environmental impact study on urbanization in Tamil Nadu, applying GIS, remote sensing, and machine learning to quantify urban sprawl.",
      "Derived data-driven insights for sustainable urban planning.",
    ],
    tags: ["GIS", "Remote Sensing", "Urban ML"],
    x: 430, y: 343,
  },
  {
    id: "blueai", short: "Blue.ai",
    title: "Blue.ai – Blue Carbon Sequestration & Green Credit Platform",
    cat: "cat-projects", doms: ["d-remote", "d-cv"],
    badge: "Jun 2024 · SAP Hackfest Finalist (2,500+ teams)",
    meta: "",
    bullets: [
      "Developed an ML-GIS solution to estimate and track blue carbon sequestration via satellite imagery and geospatial data; supervised models to map mangrove cover and identify deforestation risk.",
      "Integrated into a platform connecting companies and NGOs to generate and manage Green Credits.",
    ],
    tags: ["GIS", "Satellite Imagery", "Supervised ML", "Mangrove Mapping"],
    links: [
      { label: "Code", url: "https://github.com/juicjaane/bal" },
    ],
    x: 393, y: 454,
  },
  {
    id: "dehazer", short: "Dehazer",
    title: "Dehazer – Intelligent De-hazing Algorithm",
    cat: "cat-projects", doms: ["d-cv"],
    badge: "Dec 2023 · SIH Top 5 Nationwide · Encender 3rd",
    meta: "Smart India Hackathon 2023 DRDO Track",
    bullets: [
      "Developed a real-time de-hazing solution for smoke-obscured video using ResNet-CNN and HOG-based object detection, enhancing visibility and human tracking for search-and-rescue operations.",
    ],
    tags: ["ResNet", "HOG", "OpenCV", "Real-time CV"],
    links: [
      { label: "Code", url: "https://github.com/juicjaane/Intelligent-De-Hazing-Smoking-Algorithm" },
    ],
    x: 467, y: 417,
  },
  {
    id: "airwriting", short: "Air Writing",
    title: "AI/ML-Based Air Writing System",
    cat: "cat-projects", doms: ["d-cv"],
    badge: "Mar 2023 · SSN Internally Funded",
    meta: "",
    bullets: [
      "Led a research project to develop an air-writing system that recognizes hand-gesture trajectories and wrist-based writing movements for assistive communication and rehabilitation.",
      "Qualified for SSN's Internally Funded Project; deployed a lightweight CNN-based model on Raspberry Pi for real-time inference.",
    ],
    tags: ["CNN", "Gesture Recognition", "Raspberry Pi", "Edge AI"],
    x: 340, y: 340,
  },
];

// All edges: item → category + item → each domain
const EDGES = ITEMS.flatMap(item => [
  { itemId: item.id, largeId: item.cat },
  ...item.doms.map(d => ({ itemId: item.id, largeId: d })),
]);

// ── HELPERS ──────────────────────────────────────────────────────────────────
const getLabelPos = (node) => {
  const dx = node.x - CX, dy = node.y - CY;
  const mag = Math.hypot(dx, dy) || 1;
  const off = 46;
  return {
    x: node.x + (dx / mag) * off,
    y: node.y + (dy / mag) * off,
    anchor: Math.abs(dx) < 55 ? "middle" : dx > 0 ? "start" : "end",
    baseline: Math.abs(dy) < 55 ? "middle" : dy < 0 ? "auto" : "hanging",
  };
};

// Split label into up to 2 lines at the last space before midpoint
const splitLabel = (label) => {
  const words = label.split(" ");
  if (words.length === 1) return [label];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
};

// ── PARTICLE CANVAS ──────────────────────────────────────────────────────────
function ParticleCanvas() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 1.1 + 0.3,
      vx: (Math.random() - 0.5) * 0.17, vy: (Math.random() - 0.5) * 0.17,
      a: Math.random() * 0.16 + 0.03,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${p.a})`; ctx.fill();
        p.x = (p.x + p.vx + c.width) % c.width;
        p.y = (p.y + p.vy + c.height) % c.height;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [hovered, setHovered] = useState(null);

  const hoveredLarge = LARGE.find(n => n.id === hovered);
  const hoveredItem  = ITEMS.find(n => n.id === hovered);

  // Is an edge active given the current hover?
  const edgeActive = (itemId, largeId) => {
    if (!hovered) return false;
    if (hovered === itemId || hovered === largeId) return true;
    return false;
  };

  // Dim opacity when something is hovered but this node/edge is not active
  const itemOpacity = (item) => {
    if (!hovered) return 1;
    if (hovered === item.id) return 1;
    if (hovered === item.cat || item.doms.includes(hovered)) return 1;
    return 0.08;
  };

  const largeOpacity = (node) => {
    if (!hovered) return 1;
    if (hovered === node.id) return 1;
    if (hoveredItem && (hoveredItem.cat === node.id || hoveredItem.doms.includes(node.id))) return 1;
    return 0.1;
  };

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Tooltip content
  const tooltip = hoveredLarge
    ? { color: hoveredLarge.color, title: hoveredLarge.label, body: ITEMS.filter(i => i.cat === hoveredLarge.id || i.doms.includes(hoveredLarge.id)).map(i => i.short).join("  ·  "), sub: hoveredLarge.type === "cat" ? "Category" : "Domain" }
    : hoveredItem
    ? { color: LM[hoveredItem.cat].color, title: hoveredItem.title, body: hoveredItem.badge, sub: LM[hoveredItem.cat].label }
    : null;

  // Category sections data
  const CATS = [
    { id: "cat-research", label: "Research",     sectionId: "sec-research" },
    { id: "cat-intern",   label: "Internships",  sectionId: "sec-intern"  },
    { id: "cat-projects", label: "Projects",     sectionId: "sec-projects" },
  ];

  return (
    <div style={{ background: "#07080f", color: "#e2e8f0", fontFamily: "'Inter', system-ui, sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #07080f; } ::-webkit-scrollbar-thumb { background: #1e2235; border-radius: 4px; }
        @keyframes dashFlow { to { stroke-dashoffset: -40; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        .nav-link { background: none; border: none; cursor: pointer; font-size: 0.73rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500; color: #4b5563; transition: color 0.2s; font-family: inherit; padding: 0; }
        .nav-link:hover { color: #00e5ff; }
        .node-g { cursor: pointer; }
        .card { transition: transform 0.26s ease, box-shadow 0.26s ease; }
        .card:hover { transform: translateY(-3px); box-shadow: 0 14px 44px rgba(0,0,0,0.5); }
        .cta { display: inline-block; background: #00e5ff; color: #07080f; padding: 0.85rem 2.4rem; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 0.9rem; transition: opacity 0.2s, transform 0.2s; }
        .cta:hover { opacity: 0.85; transform: translateY(-1px); }
        .out-btn { display: inline-block; border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 0.85rem 2rem; border-radius: 8px; font-weight: 500; text-decoration: none; font-size: 0.9rem; transition: border-color 0.2s, color 0.2s; }
        .out-btn:hover { border-color: #00e5ff; color: #00e5ff; }
        .tag { font-size: 0.65rem; color: #64748b; background: #10131e; padding: 0.2rem 0.55rem; border-radius: 4px; border: 1px solid #1e2235; }
        .proj-link { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.68rem; color: #94a3b8; background: #0e1019; border: 1px solid #1e2235; padding: 0.28rem 0.7rem; border-radius: 5px; text-decoration: none; transition: border-color 0.2s, color 0.2s; }
        .proj-link:hover { border-color: #00e5ff; color: #00e5ff; }
        .skill-pill { font-size: 0.72rem; color: #94a3b8; background: #0e1019; border: 1px solid #1a1d2e; padding: 0.22rem 0.65rem; border-radius: 4px; }
        .lbl { font-size: 0.6rem; letter-spacing: 0.28em; text-transform: uppercase; }
        @media (max-width: 640px) {
          .nav-inner { padding: 0.9rem 1.25rem !important; }
          .nav-links { gap: 0.75rem !important; }
          .nav-link { font-size: 0.58rem !important; letter-spacing: 0.05em !important; }
          .about-section { padding: 5rem 1.25rem 3rem !important; }
          .about-grid { grid-template-columns: 1fr !important; gap: 1.75rem !important; }
          .skills-grid { grid-template-columns: 1fr !important; }
          .content-section { padding: 3.5rem 1.25rem 2rem !important; }
          .contact-section { padding: 4rem 1.25rem 3rem !important; }
          .contact-h2 { font-size: clamp(1.8rem, 7vw, 3rem) !important; }
          .tooltip-box { width: min(300px, calc(100vw - 2rem)) !important; }
          .card-title { max-width: 100% !important; font-size: 0.95rem !important; }
          .card-inner { padding: 1.2rem 1.25rem !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="nav-inner" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.1rem 3rem", background: "rgba(7,8,15,0.92)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ fontWeight: 900, fontSize: "0.9rem", color: "#00e5ff", letterSpacing: "0.14em" }}>JANESHVAR</span>
        <div className="nav-links" style={{ display: "flex", gap: "2rem" }}>
          {["about", "research", "internships", "projects", "contact"].map(s => (
            <button key={s} className="nav-link" onClick={() => scrollTo(s === "research" ? "sec-research" : s === "internships" ? "sec-intern" : s === "projects" ? "sec-projects" : s)}>{s}</button>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: "5rem" }}>
        <ParticleCanvas />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(0,229,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.02) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />

        {/* Headline */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", marginBottom: "1.5rem", animation: "fadeUp 0.8s ease" }}>
          <div style={{ fontSize: "0.62rem", letterSpacing: "0.38em", color: "#00e5ff", textTransform: "uppercase", marginBottom: "0.8rem" }}>Builder of AI · Fryer of GPUs</div>
          <h1 style={{ fontSize: "clamp(2.6rem, 7vw, 5rem)", fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 0.95, background: "linear-gradient(140deg,#fff 25%,#00e5ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            JANESHVAR<br/>SIVAKUMAR
          </h1>
          <p style={{ color: "#475569", marginTop: "0.9rem", fontSize: "0.85rem", maxWidth: "380px", margin: "0.9rem auto 0", lineHeight: 1.75 }}>
           AI @ CMU · CS @ SSN
          </p>
        </div>

        {/* ── GRAPH SVG ── */}
        <div style={{ position: "relative", zIndex: 2, width: "min(95vw, 1060px)" }}>
          <svg viewBox="0 0 1120 760" style={{ width: "100%", overflow: "visible" }}>
            <defs>
              <filter id="gsm" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="gmd" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glg" x="-120%" y="-120%" width="340%" height="340%">
                <feGaussianBlur stdDeviation="14" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* ── Edges ── */}
            {EDGES.map((edge, i) => {
              const item = ITEMS.find(it => it.id === edge.itemId);
              const large = LM[edge.largeId];
              const active = edgeActive(edge.itemId, edge.largeId);
              const edgeColor = large.color;
              const op = !hovered ? 0.18 : active ? 1 : 0.03;
              return (
                <line key={i}
                  x1={item.x} y1={item.y} x2={large.x} y2={large.y}
                  stroke={edgeColor}
                  strokeWidth={active ? 1.4 : 0.7}
                  strokeDasharray={active ? "7 5" : "none"}
                  opacity={op}
                  style={{ animation: active ? "dashFlow 0.9s linear infinite" : "none", transition: "opacity 0.25s, stroke-width 0.25s" }}
                />
              );
            })}

            {/* ── Large nodes ── */}
            {LARGE.map(node => {
              const op = largeOpacity(node);
              const isHov = hovered === node.id;
              const lp = getLabelPos(node);
              const lines = splitLabel(node.label);
              const isCat = node.type === "cat";
              const rBase = isCat ? 20 : 17;
              const rHov = isCat ? 26 : 22;
              const rCur = isHov ? rHov : rBase;
              return (
                <g key={node.id} className="node-g" opacity={op}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => {
                    if (node.id === "cat-research") scrollTo("sec-research");
                    else if (node.id === "cat-intern") scrollTo("sec-intern");
                    else if (node.id === "cat-projects") scrollTo("sec-projects");
                    else scrollTo("sec-research");
                  }}
                  style={{ transition: "opacity 0.25s" }}>
                  {/* Invisible tap target for mobile */}
                  <circle cx={node.x} cy={node.y} r={rCur + 20} fill="transparent" />
                  {/* Outer aura */}
                  <circle cx={node.x} cy={node.y} r={isHov ? rCur+18 : rCur+8} fill="none" stroke={node.color} strokeWidth="0.8" opacity={isHov ? 0.3 : 0.08} style={{ transition: "all 0.3s" }}/>
                  {/* Body */}
                  <circle cx={node.x} cy={node.y} r={rCur} fill={isCat ? `${node.color}30` : `${node.color}18`} stroke={node.color} strokeWidth={isHov ? 2.2 : isCat ? 2 : 1.6} filter={isHov ? "url(#glg)" : "url(#gmd)"} style={{ transition: "all 0.28s" }}/>
                  {/* Core */}
                  <circle cx={node.x} cy={node.y} r={isHov ? (isCat ? 9 : 7) : (isCat ? 6 : 5)} fill={node.color} style={{ transition: "all 0.28s" }}/>
                  {/* Category badge ring */}
                  {isCat && <circle cx={node.x} cy={node.y} r={rCur+4} fill="none" stroke={node.color} strokeWidth="1" strokeDasharray="3 3" opacity="0.4"/>}
                  {/* Label */}
                  <text x={lp.x} y={lp.y} textAnchor={lp.anchor} dominantBaseline={lp.baseline} fill={isHov ? node.color : "#64748b"} fontSize={isHov ? "11.5" : "10"} fontWeight={isHov ? "700" : isCat ? "600" : "400"} fontFamily="Inter,system-ui" style={{ transition: "all 0.28s", userSelect: "none" }}>
                    {lines.length === 1 ? lines[0] : (
                      <>
                        <tspan x={lp.x} dy={lp.baseline === "hanging" ? 0 : lp.baseline === "auto" ? "-1.15em" : "-0.6em"}>{lines[0]}</tspan>
                        <tspan x={lp.x} dy="1.15em">{lines[1]}</tspan>
                      </>
                    )}
                  </text>
                </g>
              );
            })}

            {/* ── Item nodes ── */}
            {ITEMS.map(item => {
              const op = itemOpacity(item);
              const isHov = hovered === item.id;
              const catColor = LM[item.cat].color;
              return (
                <g key={item.id} className="node-g" opacity={op}
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => scrollTo(item.id)}
                  style={{ transition: "opacity 0.25s" }}>
                  {/* Invisible tap target for mobile */}
                  <circle cx={item.x} cy={item.y} r={24} fill="transparent" />
                  <circle cx={item.x} cy={item.y} r={isHov ? 18 : 12} fill="none" stroke={catColor} strokeWidth="1" opacity={isHov ? 0.35 : 0.12} style={{ transition: "all 0.25s" }}/>
                  <circle cx={item.x} cy={item.y} r={isHov ? 12 : 7.5} fill={`${catColor}18`} stroke={catColor} strokeWidth={isHov ? 1.8 : 1.2} filter={isHov ? "url(#gmd)" : "url(#gsm)"} style={{ transition: "all 0.22s" }}/>
                  <circle cx={item.x} cy={item.y} r={isHov ? 4.5 : 2.8} fill={catColor} style={{ transition: "all 0.22s" }}/>
                  <text x={item.x} y={item.y + (isHov ? 26 : 18)} textAnchor="middle" fill={isHov ? catColor : "#334155"} fontSize={isHov ? "9.5" : "8"} fontWeight={isHov ? "600" : "400"} fontFamily="Inter,system-ui" style={{ transition: "all 0.22s", userSelect: "none" }}>{item.short}</text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {tooltip && (
            <div className="tooltip-box" style={{ position: "absolute", bottom: "-88px", left: "50%", transform: "translateX(-50%)", background: "rgba(10,12,20,0.97)", border: `1px solid ${tooltip.color}28`, borderLeft: `3px solid ${tooltip.color}`, padding: "0.85rem 1.3rem", borderRadius: "10px", width: "380px", pointerEvents: "none", animation: "fadeUp 0.15s ease", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "0.58rem", color: tooltip.color, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "0.3rem" }}>{tooltip.sub}</div>
              <div style={{ fontWeight: 600, color: "#e2e8f0", fontSize: "0.88rem", marginBottom: tooltip.body ? "0.3rem" : 0, lineHeight: 1.4 }}>{tooltip.title}</div>
              {tooltip.body && <div style={{ fontSize: "0.73rem", color: "#475569", lineHeight: 1.6 }}>{tooltip.body}</div>}
              {hoveredItem && <div style={{ marginTop: "0.4rem", fontSize: "0.6rem", color: "#1e293b" }}>Click to expand ↓</div>}
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", gap: "2rem", marginTop: "7rem", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { label: "Category hub", r: 8, dashed: true },
            { label: "Domain hub", r: 7, dashed: false },
            { label: "Work / project", r: 4, dashed: false, small: true },
          ].map(({ label, r, dashed, small }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.62rem", color: "#2d3748" }}>
              <svg width={r * 2 + 8} height={r * 2 + 8}>
                <circle cx={r + 4} cy={r + 4} r={r} fill="none" stroke="#2d3748" strokeWidth={small ? 1 : 1.4} strokeDasharray={dashed ? "3 2" : "none"}/>
                {!small && <circle cx={r + 4} cy={r + 4} r={r * 0.4} fill="#2d3748"/>}
              </svg>
              {label}
            </div>
          ))}
          <span style={{ fontSize: "0.62rem", color: "#1a1f2a" }}>HOVER · CLICK TO EXPLORE</span>
        </div>

        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", animation: "floatY 2.5s ease-in-out infinite" }}>
          <div style={{ width: 1, height: 42, background: "linear-gradient(to bottom,#1e293b,transparent)" }}/>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="about-section" style={{ maxWidth: "860px", margin: "0 auto", padding: "9rem 2rem 6rem" }}>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "4rem", alignItems: "start" }}>
          <div>
            <div className="lbl" style={{ color: "#00e5ff", marginBottom: "0.75rem" }}>About</div>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, lineHeight: 1.1, color: "#f1f5f9" }}>Building the future of AI</h2>
          </div>
          <div style={{ color: "#64748b", lineHeight: 1.85, fontSize: "0.9rem" }}>
            <p style={{ marginBottom: "1.2rem", color: "#94a3b8" }}>I'm Janeshvar Sivakumar — incoming student to the MS in Artificial Intelligence and Innovation program at Carnegie Mellon University. I recently completed my B.E. in Computer Science and Engineering from SSN College of Engineering, Anna University, where I spent four years applying AI to a wide range of problems and having a lot of fun while at it.</p>
            <p style={{ marginBottom: "1.75rem" }}>My current interests are in Robot Learning and Computer Vision — particularly Vision-Language-Action models, the data collection and augmentation pipelines behind them, and World Models. I have a lot of learning ahead of me and I'm looking forward to my time at CMU to dig deeper and contribute to this space.</p>
            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.75rem" }}>
              <a href="https://www.linkedin.com/in/janeshvar" target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#00e5ff", textDecoration: "none", borderBottom: "1px solid rgba(0,229,255,0.3)" }}>LinkedIn ↗</a>
              <a href="https://github.com/juicjaane" target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#00e5ff", textDecoration: "none", borderBottom: "1px solid rgba(0,229,255,0.3)" }}>GitHub ↗</a>
            </div>
            <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem 1.5rem" }}>
              {[["Languages","Python, C, Julia, JavaScript, Java"],["ML / DL","PyTorch, PyTorch Geometric, TensorFlow, Scikit-learn, OpenCV"],["AI & Agents","LangChain, LangGraph, vLLM, FastAPI"],["Cloud & MLOps","AWS, GCP, Docker, Kubernetes, MLflow"],["Databases","ClickHouse, Qdrant, MongoDB, PostgreSQL"],["Frontend","React, Node.js, Express.js"]].map(([g,v]) => (
                <div key={g}>
                  <div style={{ fontSize: "0.57rem", color: "#334155", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{g}</div>
                  <div style={{ fontSize: "0.72rem", color: "#475569" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)", maxWidth: "860px", margin: "0 auto" }}/>

      {/* ── RESEARCH ── */}
      <section id="sec-research" className="content-section" style={{ maxWidth: "860px", margin: "0 auto", padding: "6rem 2rem 3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3rem" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: LM["cat-research"].color, boxShadow: `0 0 10px ${LM["cat-research"].color}` }}/>
          <div className="lbl" style={{ color: LM["cat-research"].color }}>Research</div>
        </div>
        <ItemList items={ITEMS.filter(i => i.cat === "cat-research")} />
      </section>

      <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)", maxWidth: "860px", margin: "0 auto" }}/>

      {/* ── INTERNSHIPS ── */}
      <section id="sec-intern" className="content-section" style={{ maxWidth: "860px", margin: "0 auto", padding: "6rem 2rem 3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3rem" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: LM["cat-intern"].color, boxShadow: `0 0 10px ${LM["cat-intern"].color}` }}/>
          <div className="lbl" style={{ color: LM["cat-intern"].color }}>Internships</div>
        </div>
        <ItemList items={ITEMS.filter(i => i.cat === "cat-intern")} />
      </section>

      <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)", maxWidth: "860px", margin: "0 auto" }}/>

      {/* ── PROJECTS ── */}
      <section id="sec-projects" className="content-section" style={{ maxWidth: "860px", margin: "0 auto", padding: "6rem 2rem 8rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3rem" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: LM["cat-projects"].color, boxShadow: `0 0 10px ${LM["cat-projects"].color}` }}/>
          <div className="lbl" style={{ color: LM["cat-projects"].color }}>Projects</div>
        </div>
        <ItemList items={ITEMS.filter(i => i.cat === "cat-projects")} />
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="contact-section" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "7rem 2rem 5rem", textAlign: "center" }}>
        <div className="lbl" style={{ color: "#00e5ff", display: "flex", justifyContent: "center", marginBottom: "1rem" }}>Contact</div>
        <h2 className="contact-h2" style={{ fontSize: "3rem", fontWeight: 900, marginBottom: "1.2rem", color: "#f1f5f9", letterSpacing: "-0.02em" }}>Let's build something.</h2>
        <p style={{ color: "#475569", maxWidth: "360px", margin: "0 auto 2.5rem", lineHeight: 1.75, fontSize: "0.88rem" }}>Open to research collaborations, full-time AI/ML roles, and interesting conversations.</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="mailto:janeshvar2004@gmail.com" className="cta">janeshvar2004@gmail.com</a>
          <a href="https://www.linkedin.com/in/janeshvar" target="_blank" rel="noreferrer" className="out-btn">LinkedIn ↗</a>
          <a href="https://github.com/juicjaane" target="_blank" rel="noreferrer" className="out-btn">GitHub ↗</a>
        </div>
        <div style={{ marginTop: "5rem", color: "#141820", fontSize: "0.68rem", letterSpacing: "0.08em" }}>© 2026 Janeshvar Sivakumar · AI Engineer & Researcher</div>
      </section>
    </div>
  );
}

// ── ITEM CARD ─────────────────────────────────────────────────────────────────
function ItemList({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {items.map(item => {
        const catNode = LM[item.cat];
        return (
          <div key={item.id} id={item.id} className="card card-inner"
            style={{ background: "#0c0e17", border: "1px solid rgba(255,255,255,0.05)", borderLeft: `3px solid ${catNode.color}`, borderRadius: "12px", padding: "1.6rem 2rem" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.65rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <h3 className="card-title" style={{ fontSize: "1.05rem", fontWeight: 700, color: "#e2e8f0", lineHeight: 1.35, maxWidth: "72%" }}>{item.title}</h3>
              <span style={{ fontSize: "0.6rem", color: "#334155", background: "#0e1019", border: "1px solid #1a1d2e", padding: "0.22rem 0.6rem", borderRadius: "4px", whiteSpace: "nowrap" }}>{item.badge}</span>
            </div>
            {/* Meta */}
            {item.meta && <div style={{ fontSize: "0.75rem", color: "#475569", marginBottom: "0.85rem", fontStyle: "italic" }}>{item.meta}</div>}
            {/* Bullets */}
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.45rem", marginBottom: "1rem" }}>
              {item.bullets.map((b, i) => (
                <li key={i} style={{ fontSize: "0.83rem", color: "#4b5563", lineHeight: 1.75, paddingLeft: "1rem", position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: catNode.color, fontSize: "0.58rem", top: "0.45rem" }}>▸</span>{b}
                </li>
              ))}
            </ul>
            {/* Tags row: tech tags + domain tags */}
            <div style={{ display: "flex", gap: "0.38rem", flexWrap: "wrap", alignItems: "center" }}>
              {item.tags.map(t => <span key={t} className="tag">{t}</span>)}
              <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.08)", margin: "0 0.2rem" }}/>
              {item.doms.map(d => (
                <span key={d} style={{ fontSize: "0.62rem", color: LM[d].color, background: `${LM[d].color}12`, border: `1px solid ${LM[d].color}28`, padding: "0.18rem 0.5rem", borderRadius: "4px" }}>{LM[d].label}</span>
              ))}
            </div>
            {/* Links: code / paper */}
            {item.links && item.links.length > 0 && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
                {item.links.map(l => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="proj-link">
                    {l.label === "Paper" ? "📄" : l.label === "Live" ? "🔗" : "‹›"} {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}