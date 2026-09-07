import { type ReactNode, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Check, ChevronRight, Copy, Database, Github, Linkedin, Mail, Menu, MoveDown, PenTool, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Project = {
  id: string;
  number: string;
  title: string;
  kicker: string;
  description: string;
  tags: string[];
  metrics: { value: string; label: string }[];
  color: string;
  details: string[];
};

const projects: Project[] = [
  {
    id: 'fraud', number: '01', title: 'Financial Fraud Detection & Risk Engine', kicker: 'Decision systems / risk intelligence',
    description: 'A practical risk layer that turns transaction patterns into a daily fraud operations view — from messy records to an actionable queue.',
    tags: ['Python', 'SQL', 'SMOTE', 'Power BI'], metrics: [{ value: '10K+', label: 'transactions' }, { value: '1.51%', label: 'fraud rate' }],
    color: 'lime', details: ['Balanced imbalanced transaction data with SMOTE.', 'Built SQL behavioral features to surface repeat patterns and unusual velocity.', 'Shaped the model output into a Power BI Fraud Operations Hub for human review.'],
  },
  {
    id: 'ecommerce', number: '02', title: 'E-Commerce Sales & Customer Analytics', kicker: 'Commercial systems / story-led reporting',
    description: 'A sales intelligence dashboard built to make a large, multi-market catalogue legible: who buys, what moves, and where attention should go next.',
    tags: ['Power BI', 'RFM', 'Pareto', 'Power Query'], metrics: [{ value: '$12.64M', label: 'revenue' }, { value: '51,289', label: 'sales records' }],
    color: 'coral', details: ['Cleaned and modelled 51,289 sales records across 7+ countries.', 'Applied 5-tier RFM segmentation to distinguish customer value and recency.', 'Used Pareto SKU analysis to focus the narrative around high-impact products.'],
  },
  {
    id: 'ola', number: '03', title: 'OLA RideBookings Data Analysis', kicker: 'Operations / friction mapping',
    description: 'A compact operational read on 20K+ rides — making cancellation patterns, vehicle mix, and revenue KPIs easy to interrogate.',
    tags: ['Excel', 'SQL', 'Power BI', 'KPI design'], metrics: [{ value: '20K+', label: 'bookings' }, { value: '5', label: 'vehicle categories' }],
    color: 'blue', details: ['Compared booking outcomes across five vehicle categories.', 'Mapped cancellation behaviour against operational and customer signals.', 'Translated volume and revenue KPIs into a clean decision-ready report.'],
  },
];

const skillGroups = [
  { label: 'Data layer', icon: Database, items: ['SQL / PostgreSQL / MySQL', 'Python / Pandas / NumPy', 'Power BI / DAX', 'Advanced Excel / Power Query', 'MATLAB'] },
  { label: 'Interface layer', icon: PenTool, items: ['Figma', 'Canva', 'Wireframing', 'User research', 'Information hierarchy'] },
  { label: 'Engineering layer', icon: MoveDown, items: ['C / C++', 'ANSYS', 'SolidWorks / CAD', 'Mechanical systems', 'Emerging ML'] },
];

function SwingReveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 16, x: -8 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: 'linear', delay }}
    >
      {children}
    </motion.div>
  );
}

function WebDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`web-divider ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1200 28" preserveAspectRatio="none">
        <path d="M0 14 C38 14 38 7 76 7 S114 21 152 21 190 9 228 9 266 18 304 18 342 6 380 6 418 21 456 21 494 12 532 12 570 22 608 22 646 8 684 8 722 19 760 19 798 5 836 5 874 18 912 18 950 10 988 10 1026 23 1064 23 1102 8 1140 8 S1178 14 1200 14" />
        <circle cx="304" cy="18" r="2" />
        <circle cx="684" cy="8" r="2" />
        <circle cx="1064" cy="23" r="2" />
      </svg>
    </div>
  );
}

function DataGlyph({ kind }: { kind: string }) {
  if (kind === 'fraud') return (
    <div className="data-panel data-panel-red">
      <div className="data-panel-meta"><span>risk / live</span><span>01—03</span></div>
      <svg viewBox="0 0 300 150" className="data-chart" fill="none" aria-label="Rising risk trend">
        <path d="M0 125 C38 118 41 83 74 92 S112 115 139 71 S176 75 198 48 S246 56 300 12" className="chart-line chart-line-light" />
        <path d="M0 138 H300" className="chart-baseline" />
        <circle cx="198" cy="48" r="5" className="chart-node chart-node-blue" />
      </svg>
      <span className="data-panel-label">behavioral signal / 84.7</span>
    </div>
  );
  if (kind === 'ecommerce') return (
    <div className="data-panel data-panel-blue">
      <div className="data-panel-meta"><span>market / split</span><span>02—03</span></div>
      <div className="data-bars">
        {[.42, .63, .5, .82, .71, 1, .77, .88, .66, .94].map((height, i) => <div key={i} className="data-bar" style={{ height: `${height * 100}%`, animationDelay: `${i * 70}ms` }} />)}
      </div>
      <div className="data-panel-label">pareto / top sku concentration</div>
    </div>
  );
  return (
    <div className="data-panel data-panel-ink">
      <div className="data-panel-meta"><span>rides / flow</span><span>03—03</span></div>
      <svg viewBox="0 0 300 150" className="data-chart" fill="none" aria-label="Ride flow map">
        <path d="M18 120 C48 37 73 125 105 63 S153 121 178 42 S221 107 286 22" className="chart-line chart-line-red" />
        <path d="M18 120 C48 37 73 125 105 63 S153 121 178 42 S221 107 286 22" className="chart-line chart-line-dashed" />
        {[18, 105, 178, 286].map((x, i) => <circle key={i} cx={x} cy={[120, 63, 42, 22][i]} r="4" className="chart-node chart-node-blue" />)}
      </svg>
      <div className="data-panel-label">cancellation / revenue / route</div>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveProject(null);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const copyEmail = async () => {
    await navigator.clipboard?.writeText('anshikaiitpatna@gmail.com');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  const ctaTransition = reduceMotion ? { duration: 0 } : { duration: 0.12, ease: 'linear' as const };

  return (
    <div className="portfolio-shell">
      <div className="noise-layer" />
      <header className="site-header">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 md:px-10">
          <a href="#top" data-testid="link-home" className="brand-lockup group" onClick={closeMenu}>
            <span className="brand-mark">AS</span>
            <span className="brand-name">Anshika Singh / studio</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
            {['work', 'approach', 'about'].map((item) => <a key={item} href={`#${item}`} data-testid={`link-nav-${item}`} className="nav-link">{item}</a>)}
            <motion.a href="#contact" data-testid="link-nav-contact" className="cta-button cta-button-small" whileHover={{ scale: 1.04, rotate: -0.5 }} transition={ctaTransition}>Let’s talk <ArrowUpRight className="ml-1 inline h-3 w-3" /></motion.a>
          </nav>
          <button type="button" data-testid="button-toggle-menu" aria-label="Toggle navigation" className="menu-toggle md:hidden" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
        {menuOpen && <nav className="mobile-nav md:hidden" aria-label="Mobile navigation">
          {['work', 'approach', 'about', 'contact'].map((item) => <a key={item} href={`#${item}`} data-testid={`link-mobile-${item}`} onClick={closeMenu} className="mobile-nav-link">{item}</a>)}
        </nav>}
      </header>

      <main id="top">
        <section className="hero-section web-surface">
          <div className="hero-orbit hero-orbit-small" />
          <div className="hero-red-dot" />
          <div className="mx-auto grid w-full max-w-[1440px] gap-14 px-5 pb-20 pt-32 md:min-h-[880px] md:px-10 md:pt-40 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div className="relative z-10">
              <SwingReveal className="hero-kicker"><span className="accent-rule" /><p className="eyebrow muted-copy">IIT Patna / Mechanical Engineering / 2024—28</p></SwingReveal>
              <SwingReveal delay={0.08}><h1 className="hero-title">Systems<br /><span className="hero-title-red">made</span><br /><span className="hero-title-blue">clear.</span></h1></SwingReveal>
               <SwingReveal delay={0.16}><p className="hero-intro">Anshika Singh turns complex systems into clear, useful stories — through data analytics, interface design, and an engineer’s instinct for how things work.</p><div className="hero-status" aria-label="UI/UX level 03 progress"><div className="hero-status-meta"><span>UI/UX LEVEL 03</span><span>XP 680 / 1000</span></div><div className="xp-track"><span className="xp-fill" /></div></div></SwingReveal>
              <SwingReveal delay={0.24} className="hero-actions">
                 <motion.a href="#work" data-testid="link-hero-work" className="cta-button start-button inline-flex items-center" whileHover={{ x: 4 }} transition={ctaTransition}><span className="start-blink">START</span><ArrowDownRight className="ml-3 h-4 w-4" /></motion.a>
                <motion.a href="#contact" data-testid="link-hero-contact" className="outline-button inline-flex items-center" whileHover={{ scale: 1.03 }} transition={ctaTransition}>Say hello</motion.a>
              </SwingReveal>
            </div>
            <SwingReveal delay={0.18} className="hero-orb-wrap">
              <div className="hero-orb">
                <div className="hero-orb-web" />
                <div className="hero-orb-content">
                  <div className="data-panel-meta"><span>field notes / 001</span><span>26° 26′ N</span></div>
                  <div><p className="hero-orb-title">data<br /><span className="hero-title-red">×</span> design</p><div className="hero-orb-note"><span className="hero-orb-pulse" /> currently curious about machine learning</div></div>
                  <div className="flex items-end justify-between"><div className="hero-orb-ring" /><div className="hero-orb-caption">mechanical<br />mind / visual<br />language</div></div>
                </div>
              </div>
              <div className="hero-sticker">make signal visible ↗</div>
            </SwingReveal>
          </div>
          <div className="scroll-cue"><MoveDown className="h-4 w-4 text-pixel-pink" /><span className="eyebrow muted-copy">Scroll to inspect</span></div>
        </section>

        <WebDivider className="mx-auto max-w-[1440px] px-5 md:px-10" />
        <div className="marquee-strip">
          <div className="marquee flex w-max items-center gap-8 whitespace-nowrap"><span className="eyebrow">analytics with a point of view</span><span className="text-pixel-pink">+</span><span className="eyebrow">interfaces with a reason</span><span className="text-pixel-green">+</span><span className="eyebrow">systems made legible</span><span className="text-pixel-pink">+</span><span className="eyebrow">analytics with a point of view</span><span className="text-pixel-green">+</span><span className="eyebrow">interfaces with a reason</span></div>
        </div>

        <section className="section-shell">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-[.75fr_1.25fr] md:items-end md:px-10 md:py-36">
            <SwingReveal><p className="eyebrow section-kicker">Level 01 / A useful tension</p><h2 className="section-title">The numbers<br /><span className="section-title-blue">have a pulse.</span></h2></SwingReveal>
            <SwingReveal delay={0.1} className="stats-grid">
              {[['10K+', 'transactions read'], ['1.51%', 'fraud found'], ['51,289', 'sales decoded']].map(([value, label], i) => <div key={label} data-testid={`stat-${i}`}><p className="stat-value">{value}</p><p className="eyebrow muted-copy">{label}</p></div>)}
            </SwingReveal>
          </div>
          <SwingReveal delay={0.16} className="mx-auto max-w-2xl px-5 pb-24 md:ml-[33%] md:px-0 md:pb-36"><div className="callout-copy">Whether it is a fraud signal or a customer pattern, the work is always the same: find the shape inside the noise, then give it a form people can use.</div></SwingReveal>
        </section>

        <WebDivider className="mx-auto max-w-[1440px] px-5 md:px-10" />
        <section id="work" className="section-projects web-surface">
          <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
             <SwingReveal className="mb-16 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow section-kicker">Level 02 / Selected investigations</p><h2 className="section-title section-title-large">Work that<br /><span className="section-title-blue">moves the needle.</span></h2></div><p className="max-w-xs text-sm leading-relaxed muted-copy">A few studies in making operational data feel less operational — and more like a clear next move.</p></SwingReveal>
            <div className="project-list">{projects.map((project, index) => <SwingReveal key={project.id} delay={index * 0.06}><article className="project-row group grid gap-7 md:grid-cols-[.18fr_1.25fr_.68fr_.8fr] md:items-center" data-testid={`card-project-${project.id}`}>
              <span className="project-index font-mono-ui text-xs">{project.number}</span>
              <div><p className="eyebrow project-muted mb-3">{project.kicker}</p><h3 className="project-title">{project.title}</h3><p className="project-muted mt-4 max-w-lg text-sm leading-relaxed">{project.description}</p><div className="mt-5 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="tag-chip">{tag}</span>)}</div></div>
              <DataGlyph kind={project.id} />
              <div className="flex items-end justify-between gap-5 md:flex-col md:items-start md:justify-center"><div className="flex gap-6">{project.metrics.map((metric) => <div key={metric.label}><p className="metric-value">{metric.value}</p><p className="project-muted mt-1 font-mono-ui text-[9px] uppercase tracking-[.08em]">{metric.label}</p></div>)}</div><button type="button" data-testid={`button-open-project-${project.id}`} onClick={() => setActiveProject(project)} className="project-arrow inline-flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.1em]">Read case notes <ArrowUpRight className="h-4 w-4" /></button></div>
            </article></SwingReveal>)}</div>
          </div>
        </section>

        <WebDivider className="mx-auto max-w-[1440px] px-5 md:px-10" />
        <section id="approach" className="section-shell">
          <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
            <div className="grid gap-14 md:grid-cols-[.68fr_1.32fr]">
              <SwingReveal><p className="eyebrow section-kicker">Level 03 / The method</p><h2 className="section-title">Look.<br />Sort.<br /><span className="section-title-red">Shape.</span></h2></SwingReveal>
               <SwingReveal delay={0.1} className="method-list">{[['01', 'Look closer', 'Start with the lived mess: raw tables, fuzzy needs, edge cases, the thing nobody thought to ask yet.'], ['02', 'Sort the signal', 'Use SQL, models, and visual hierarchy to find what is meaningful — not just what is available.'], ['03', 'Shape the handoff', 'Turn the insight into a dashboard, interface, or decision that another person can pick up and use.']].map(([number, title, body]) => <div key={number} className="method-row"><span className="font-mono-ui text-xs text-pixel-pink">{number}</span><h3 className="method-title">{title}</h3><p className="max-w-md text-sm leading-relaxed muted-copy">{body}</p></div>)}</SwingReveal>
            </div>
          </div>
        </section>

        <WebDivider className="mx-auto max-w-[1440px] px-5 md:px-10" />
        <section id="about" className="section-ink web-surface">
          <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
            <SwingReveal className="grid gap-12 md:grid-cols-[1fr_1fr]">
               <div><p className="eyebrow section-kicker">Level 04 / In the field</p><h2 className="section-title section-title-large">Still<br /><span className="section-title-red">learning</span><br />by doing.</h2></div>
               <div className="flex flex-col justify-end"><p className="max-w-lg text-xl leading-relaxed text-pixel-cream/75 md:text-2xl">Currently studying Mechanical Engineering at IIT Patna while working at the intersection of interface thinking, analytical rigour, and emerging machine learning.</p><div className="mt-10 border-t border-pixel-cream/20 pt-5"><p className="eyebrow text-pixel-cream/50">Anshika, in one line</p><p className="mt-3 font-display text-2xl font-semibold tracking-[-.04em]">A mechanical mind with a soft spot for sharp layouts.</p></div></div>
            </SwingReveal>
            <div className="mt-24 grid gap-4 md:grid-cols-3">{skillGroups.map(({ label, icon: Icon, items }, groupIndex) => <SwingReveal key={label} delay={(groupIndex + 1) * 0.08} className="skill-group"><div className="mb-8 flex items-center justify-between"><p className="eyebrow text-pixel-pink">{label}</p><Icon className="h-5 w-5 text-pixel-green" /></div><ul className="space-y-3">{items.map((item) => <li key={item} className="flex items-center gap-3 text-sm text-pixel-cream/70"><ChevronRight className="h-3 w-3 text-pixel-pink" />{item}</li>)}</ul></SwingReveal>)}</div>
          </div>
        </section>

        <WebDivider className="mx-auto max-w-[1440px] px-5 md:px-10" />
        <section className="section-shell">
          <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
             <SwingReveal className="mb-14"><p className="eyebrow section-kicker">Level 05 / Experience, in motion</p><h2 className="section-title section-title-large">A practice<br /><span className="section-title-blue">still becoming.</span></h2></SwingReveal>
            <div className="experience-list">
              {[['Nov 2025 — Present', 'UI/UX Design Intern', 'Inditronix AI Labs', 'Working on interfaces that help technical products communicate with more clarity.'], ['Aug 2025 — Apr 2026', 'Design Sub-coordinator / Co-Lead', 'E-Cell · SCME · Syahi · InvisionX · NSS · SevaUtsav / IIT Patna', 'Leading visual thinking across campus communities — from first idea to the final pixel.'], ['2024 — 2028', 'B.Tech Mechanical Engineering', 'Indian Institute of Technology, Patna', 'Building the technical foundation for a more curious, systems-minded creative practice.']].map(([date, role, place, body], index) => <SwingReveal key={role} delay={index * 0.08} className="experience-item"><span className="experience-dot" /><p className="eyebrow text-pixel-pink">{date}</p><h3 className="experience-role">{role}</h3><p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[.1em] text-pixel-green">{place}</p><p className="mt-4 max-w-xl text-sm leading-relaxed muted-copy">{body}</p></SwingReveal>)}
            </div>
          </div>
        </section>

        <WebDivider className="mx-auto max-w-[1440px] px-5 md:px-10" />
        <section id="contact" className="section-contact web-surface">
          <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
            <SwingReveal className="grid gap-12 md:grid-cols-[1.1fr_.9fr] md:items-end">
               <div><p className="eyebrow section-kicker">Level 06 / Open channel</p><h2 className="section-title section-title-large">Let’s<br /><span className="section-title-red">make</span><br />sense.</h2></div>
               <div><p className="max-w-md text-xl leading-relaxed text-pixel-cream/75">Have a messy question, a product that needs a clearer surface, or a dataset with a story hiding in it?</p><div className="mt-8 flex flex-wrap gap-3"><motion.a href="mailto:anshikaiitpatna@gmail.com" data-testid="link-email" className="cta-button inline-flex items-center" whileHover={{ x: 4 }} transition={ctaTransition}><Mail className="mr-2 h-4 w-4" /> Email Anshika <ArrowUpRight className="ml-2 h-3 w-3" /></motion.a><button type="button" data-testid="button-copy-email" onClick={copyEmail} className="outline-button outline-button-light inline-flex items-center gap-2">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy email'}</button></div></div>
            </SwingReveal>
             <div className="contact-footer"><div className="flex flex-wrap gap-x-7 gap-y-3"><a href="mailto:anshikaiitpatna@gmail.com" data-testid="link-footer-email" className="contact-link">anshikaiitpatna@gmail.com</a></div><div className="flex gap-5"><a href="#contact" onClick={(event) => event.preventDefault()} data-testid="link-linkedin" className="contact-link"><Linkedin className="mr-1 inline h-3 w-3" /> LinkedIn</a><a href="#contact" onClick={(event) => event.preventDefault()} data-testid="link-github" className="contact-link"><Github className="mr-1 inline h-3 w-3" /> GitHub</a></div></div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 md:flex-row"><p className="font-mono-ui text-[9px] uppercase tracking-[.1em] text-pixel-cream/50">Anshika Singh / personal studio</p><p className="font-mono-ui text-[9px] uppercase tracking-[.1em] text-pixel-cream/50">Made with curiosity · IIT Patna</p></div></footer>

      <AnimatePresence>
        {activeProject && <motion.div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`${activeProject.title} case notes`} onClick={() => setActiveProject(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="project-modal" onClick={(event) => event.stopPropagation()} initial={reduceMotion ? false : { opacity: 0, y: 24, rotate: -2 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: 18, rotate: 1 }} transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 24 }}>
            <div className="flex items-start justify-between gap-5"><div><p className="eyebrow text-pixel-pink">Case notes / {activeProject.number}</p><h2 className="modal-title">{activeProject.title}</h2></div><button type="button" data-testid="button-close-project" aria-label="Close project notes" onClick={() => setActiveProject(null)} className="modal-close"><X size={18} /></button></div>
            <div className="mt-10 border-t border-pixel-cream/15 pt-7"><p className="max-w-xl text-lg leading-relaxed text-pixel-cream/75">{activeProject.description}</p><ul className="mt-8 space-y-4">{activeProject.details.map((detail) => <li key={detail} className="flex gap-3 text-sm leading-relaxed text-pixel-cream/80"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-pixel-pink" />{detail}</li>)}</ul></div>
            <div className="mt-10 flex flex-wrap gap-2">{activeProject.tags.map((tag) => <span key={tag} className="tag-chip tag-chip-light">{tag}</span>)}</div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={App} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Root() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default Root;