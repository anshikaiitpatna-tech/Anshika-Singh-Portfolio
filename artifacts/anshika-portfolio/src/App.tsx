import { type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowDownRight, ArrowUpRight, Check, ChevronRight, Copy, Database, Github, Linkedin, Mail, Menu, MoveDown, PenTool, Phone, X } from 'lucide-react';
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

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function DataGlyph({ kind }: { kind: string }) {
  if (kind === 'fraud') return (
    <div className="relative h-full min-h-[210px] overflow-hidden rounded-sm bg-[#d5ff36] p-5 text-[#1d304b]">
      <div className="flex items-start justify-between font-mono-ui text-[10px] uppercase tracking-[.15em]"><span>risk / live</span><span>01—03</span></div>
      <svg viewBox="0 0 300 150" className="absolute inset-x-5 bottom-9 h-32 w-[calc(100%-40px)]" fill="none" aria-label="Rising risk trend">
        <path d="M0 125 C38 118 41 83 74 92 S112 115 139 71 S176 75 198 48 S246 56 300 12" stroke="#1d304b" strokeWidth="3" className="draw-line" />
        <path d="M0 138 H300" stroke="#1d304b" strokeOpacity=".25" />
        <circle cx="198" cy="48" r="5" fill="#ff6e4d" stroke="#1d304b" strokeWidth="2" />
      </svg>
      <span className="absolute bottom-5 left-5 font-mono-ui text-[9px] uppercase">behavioral signal / 84.7</span>
    </div>
  );
  if (kind === 'ecommerce') return (
    <div className="relative h-full min-h-[210px] overflow-hidden rounded-sm bg-[#ff6e4d] p-5 text-[#fff4ea]">
      <div className="flex items-start justify-between font-mono-ui text-[10px] uppercase tracking-[.15em]"><span>market / split</span><span>02—03</span></div>
      <div className="absolute inset-x-7 bottom-9 flex h-32 items-end gap-2">
        {[.42, .63, .5, .82, .71, 1, .77, .88, .66, .94].map((height, i) => <div key={i} className="bar-grow flex-1 bg-[#1d304b]" style={{ height: `${height * 100}%`, animationDelay: `${i * 70}ms` }} />)}
      </div>
      <div className="absolute bottom-5 left-5 font-mono-ui text-[9px] uppercase">pareto / top sku concentration</div>
    </div>
  );
  return (
    <div className="relative h-full min-h-[210px] overflow-hidden rounded-sm bg-[#2e5985] p-5 text-[#fff4ea]">
      <div className="flex items-start justify-between font-mono-ui text-[10px] uppercase tracking-[.15em]"><span>rides / flow</span><span>03—03</span></div>
      <svg viewBox="0 0 300 150" className="absolute inset-x-5 bottom-9 h-32 w-[calc(100%-40px)]" fill="none" aria-label="Ride flow map">
        <path d="M18 120 C48 37 73 125 105 63 S153 121 178 42 S221 107 286 22" stroke="#d5ff36" strokeWidth="2" className="draw-line" />
        <path d="M18 120 C48 37 73 125 105 63 S153 121 178 42 S221 107 286 22" stroke="#fff4ea" strokeWidth="1" strokeDasharray="2 8" />
        {[18, 105, 178, 286].map((x, i) => <circle key={i} cx={x} cy={[120, 63, 42, 22][i]} r="4" fill="#ff6e4d" />)}
      </svg>
      <div className="absolute bottom-5 left-5 font-mono-ui text-[9px] uppercase">cancellation / revenue / route</div>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  useReveal();

  const closeMenu = () => setMenuOpen(false);
  const copyEmail = async () => {
    await navigator.clipboard?.writeText('anshikaiitpatna@gmail.com');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="portfolio-shell page-grid">
      <div className="noise-layer" />
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-[#1d304b]/15 bg-[#f3eee6]/90 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 md:px-10">
          <a href="#top" data-testid="link-home" className="group flex items-center gap-3" onClick={closeMenu}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1d304b] font-display text-sm font-bold text-[#d5ff36] transition-transform group-hover:rotate-12">AS</span>
            <span className="hidden font-mono-ui text-[10px] uppercase tracking-[.17em] text-[#1d304b] sm:block">Anshika Singh / studio</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
            {['work', 'approach', 'about'].map((item) => <a key={item} href={`#${item}`} data-testid={`link-nav-${item}`} className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#1d304b]/70 transition-colors hover:text-[#1d304b]">{item}</a>)}
            <a href="#contact" data-testid="link-nav-contact" className="lime-button rounded-full px-4 py-2 font-mono-ui text-[10px] uppercase tracking-[.12em]">Let’s talk <ArrowUpRight className="ml-1 inline h-3 w-3" /></a>
          </nav>
          <button type="button" data-testid="button-toggle-menu" aria-label="Toggle navigation" className="rounded-full border border-[#1d304b]/25 p-2 md:hidden" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
        {menuOpen && <nav className="border-t border-[#1d304b]/15 bg-[#f3eee6] px-5 py-5 md:hidden" aria-label="Mobile navigation">
          {['work', 'approach', 'about', 'contact'].map((item) => <a key={item} href={`#${item}`} data-testid={`link-mobile-${item}`} onClick={closeMenu} className="block border-b border-[#1d304b]/10 py-3 font-display text-2xl">{item}</a>)}
        </nav>}
      </header>

      <main id="top">
        <section className="relative mx-auto flex min-h-[760px] max-w-[1440px] items-center overflow-hidden px-5 pb-20 pt-32 md:min-h-[880px] md:px-10 md:pt-40">
          <div className="absolute right-[4%] top-[17%] hidden h-24 w-24 rounded-full border border-[#1d304b]/30 md:block" />
          <div className="absolute right-[8%] top-[21%] hidden h-8 w-8 rounded-full bg-[#ff6e4d] md:block" />
          <div className="grid w-full gap-14 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div className="relative z-10">
              <div className="reveal mb-8 flex items-center gap-3"><span className="h-px w-12 bg-[#ff6e4d]" /><p className="eyebrow text-[#1d304b]/70">IIT Patna / Mechanical Engineering / 2024—28</p></div>
              <h1 className="reveal reveal-delay-1 max-w-4xl font-display text-[clamp(4.2rem,11vw,10.5rem)] font-bold leading-[.82] tracking-[-.08em] text-[#1d304b]">Systems<br /><span className="ml-[.18em] text-[#ff6e4d]">made</span><br /><span className="ml-[.03em]">clear.</span></h1>
              <p className="reveal reveal-delay-2 mt-9 max-w-md text-lg leading-relaxed text-[#1d304b]/75 md:ml-[18%]">Anshika Singh turns complex systems into clear, useful stories — through data analytics, interface design, and an engineer’s instinct for how things work.</p>
              <div className="reveal reveal-delay-3 mt-9 flex flex-wrap items-center gap-3 md:ml-[18%]">
                <a href="#work" data-testid="link-hero-work" className="lime-button inline-flex items-center rounded-full px-5 py-3 font-mono-ui text-[10px] uppercase tracking-[.12em]">Explore selected work <ArrowDownRight className="ml-3 h-4 w-4" /></a>
                <a href="#contact" data-testid="link-hero-contact" className="outline-button inline-flex items-center rounded-full px-5 py-3 font-mono-ui text-[10px] uppercase tracking-[.12em]">Say hello</a>
              </div>
            </div>
            <div className="reveal reveal-delay-2 relative mx-auto w-full max-w-[440px] lg:mt-20">
              <div className="float-slow relative aspect-square rounded-[48%_52%_45%_55%/52%_44%_56%_48%] bg-[#1d304b] p-7 shadow-[16px_18px_0_#ff6e4d] md:p-10">
                <div className="absolute inset-7 rounded-[48%_52%_45%_55%/52%_44%_56%_48%] border border-[#f3eee6]/30 md:inset-10" />
                <div className="relative flex h-full flex-col justify-between text-[#f3eee6]">
                  <div className="flex justify-between font-mono-ui text-[9px] uppercase tracking-[.15em]"><span>field notes / 001</span><span>26° 26′ N</span></div>
                  <div><p className="font-display text-5xl font-bold leading-[.9] tracking-[-.07em] md:text-7xl">data<br /><span className="text-[#d5ff36]">×</span> design</p><div className="mt-5 flex items-center gap-2 font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#f3eee6]/60"><span className="h-2 w-2 rounded-full bg-[#d5ff36]" /> currently curious about machine learning</div></div>
                  <div className="flex items-end justify-between"><div className="h-14 w-14 rounded-full border border-[#f3eee6]/40" /><div className="text-right font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#f3eee6]/60">mechanical<br />mind / visual<br />language</div></div>
                </div>
              </div>
              <div className="absolute -bottom-10 -left-5 hidden rotate-[-8deg] border border-[#1d304b] bg-[#f3eee6] px-4 py-3 shadow-[5px_5px_0_#1d304b] sm:block"><span className="font-mono-ui text-[10px] uppercase tracking-[.1em]">make signal visible ↗</span></div>
            </div>
          </div>
          <div className="absolute bottom-7 left-5 flex items-center gap-4 md:left-10"><MoveDown className="h-4 w-4 text-[#ff6e4d]" /><span className="eyebrow text-[#1d304b]/55">Scroll to inspect</span></div>
        </section>

        <div className="overflow-hidden border-y border-[#1d304b]/15 bg-[#1d304b] py-3 text-[#f3eee6]">
          <div className="marquee flex w-max items-center gap-8 whitespace-nowrap"><span className="eyebrow">analytics with a point of view</span><span className="text-[#d5ff36]">+</span><span className="eyebrow">interfaces with a reason</span><span className="text-[#ff6e4d]">+</span><span className="eyebrow">systems made legible</span><span className="text-[#d5ff36]">+</span><span className="eyebrow">analytics with a point of view</span><span className="text-[#ff6e4d]">+</span><span className="eyebrow">interfaces with a reason</span></div>
        </div>

        <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
          <div className="grid gap-12 md:grid-cols-[.75fr_1.25fr] md:items-end">
            <div className="reveal"><p className="eyebrow mb-5 text-[#ff6e4d]">01 / A useful tension</p><h2 className="font-display text-5xl font-bold leading-[.95] tracking-[-.06em] md:text-7xl">The numbers<br /><span className="text-[#2e5985]">have a pulse.</span></h2></div>
            <div className="reveal reveal-delay-1 grid grid-cols-3 gap-4 border-t border-[#1d304b]/20 pt-5">
              {[['10K+', 'transactions read'], ['1.51%', 'fraud found'], ['51,289', 'sales decoded']].map(([value, label], i) => <div key={label} data-testid={`stat-${i}`}><p className="font-display text-3xl font-bold tracking-[-.06em] md:text-5xl">{value}</p><p className="eyebrow mt-2 leading-relaxed text-[#1d304b]/55">{label}</p></div>)}
            </div>
          </div>
          <div className="reveal reveal-delay-2 mt-16 max-w-2xl border-l-2 border-[#ff6e4d] pl-6 text-xl leading-relaxed text-[#1d304b]/75 md:ml-[33%] md:text-2xl">Whether it is a fraud signal or a customer pattern, the work is always the same: find the shape inside the noise, then give it a form people can use.</div>
        </section>

        <section id="work" className="border-t border-[#1d304b]/15 bg-[#e8e0d4]">
          <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
            <div className="reveal mb-16 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow mb-5 text-[#ff6e4d]">02 / Selected investigations</p><h2 className="max-w-2xl font-display text-5xl font-bold leading-[.9] tracking-[-.07em] md:text-8xl">Work that<br /><span className="text-[#2e5985]">moves the needle.</span></h2></div><p className="max-w-xs text-sm leading-relaxed text-[#1d304b]/65">A few studies in making operational data feel less operational — and more like a clear next move.</p></div>
            <div className="border-t border-[#1d304b]/25">{projects.map((project, index) => <article key={project.id} className="project-row reveal group grid gap-7 border-b border-[#1d304b]/25 py-9 md:grid-cols-[.18fr_1.25fr_.68fr_.8fr] md:items-center md:py-12" data-testid={`card-project-${project.id}`}>
              <span className="project-index font-mono-ui text-xs text-[#ff6e4d]">{project.number}</span>
              <div><p className="eyebrow project-muted mb-3 text-[#1d304b]/55">{project.kicker}</p><h3 className="max-w-xl font-display text-3xl font-bold leading-[.98] tracking-[-.05em] md:text-5xl">{project.title}</h3><p className="project-muted mt-4 max-w-lg text-sm leading-relaxed text-[#1d304b]/65">{project.description}</p><div className="mt-5 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-full border border-current/25 px-2.5 py-1 font-mono-ui text-[9px] uppercase tracking-[.08em]">{tag}</span>)}</div></div>
              <DataGlyph kind={project.id} />
              <div className="flex items-end justify-between gap-5 md:flex-col md:items-start md:justify-center"><div className="flex gap-6">{project.metrics.map((metric) => <div key={metric.label}><p className="font-display text-2xl font-bold tracking-[-.05em]">{metric.value}</p><p className="project-muted mt-1 font-mono-ui text-[9px] uppercase tracking-[.08em] text-[#1d304b]/55">{metric.label}</p></div>)}</div><button type="button" data-testid={`button-open-project-${project.id}`} onClick={() => setActiveProject(project)} className="project-arrow inline-flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.1em]">Read case notes <ArrowUpRight className="h-4 w-4" /></button></div>
            </article>)}</div>
          </div>
        </section>

        <section id="approach" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
          <div className="grid gap-14 md:grid-cols-[.68fr_1.32fr]">
            <div className="reveal"><p className="eyebrow mb-5 text-[#ff6e4d]">03 / The method</p><h2 className="font-display text-5xl font-bold leading-[.92] tracking-[-.07em] md:text-7xl">Look.<br />Sort.<br /><span className="text-[#ff6e4d]">Shape.</span></h2></div>
            <div className="reveal reveal-delay-1 divide-y divide-[#1d304b]/20 border-y border-[#1d304b]/20">{[['01', 'Look closer', 'Start with the lived mess: raw tables, fuzzy needs, edge cases, the thing nobody thought to ask yet.'], ['02', 'Sort the signal', 'Use SQL, models, and visual hierarchy to find what is meaningful — not just what is available.'], ['03', 'Shape the handoff', 'Turn the insight into a dashboard, interface, or decision that another person can pick up and use.']].map(([number, title, body]) => <div key={number} className="group grid gap-5 py-8 md:grid-cols-[70px_1fr_1.2fr] md:items-start"><span className="font-mono-ui text-xs text-[#ff6e4d]">{number}</span><h3 className="font-display text-3xl font-bold tracking-[-.05em] transition-transform group-hover:translate-x-2">{title}</h3><p className="max-w-md text-sm leading-relaxed text-[#1d304b]/65">{body}</p></div>)}</div>
          </div>
        </section>

        <section id="about" className="border-y border-[#1d304b]/15 bg-[#1d304b] text-[#f3eee6]">
          <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
            <div className="reveal grid gap-12 md:grid-cols-[1fr_1fr]">
              <div><p className="eyebrow mb-5 text-[#d5ff36]">04 / In the field</p><h2 className="font-display text-5xl font-bold leading-[.9] tracking-[-.07em] md:text-8xl">Still<br /><span className="text-[#d5ff36]">learning</span><br />by doing.</h2></div>
              <div className="flex flex-col justify-end"><p className="max-w-lg text-xl leading-relaxed text-[#f3eee6]/75 md:text-2xl">Currently studying Mechanical Engineering at IIT Patna while working at the intersection of interface thinking, analytical rigour, and emerging machine learning.</p><div className="mt-10 border-t border-[#f3eee6]/20 pt-5"><p className="eyebrow text-[#f3eee6]/50">Anshika, in one line</p><p className="mt-3 font-display text-2xl font-semibold tracking-[-.04em]">A mechanical mind with a soft spot for sharp layouts.</p></div></div>
            </div>
            <div className="mt-24 grid gap-4 md:grid-cols-3">{skillGroups.map(({ label, icon: Icon, items }, groupIndex) => <div key={label} className={`reveal reveal-delay-${groupIndex + 1} border-t border-[#f3eee6]/25 pt-5`}><div className="mb-8 flex items-center justify-between"><p className="eyebrow text-[#d5ff36]">{label}</p><Icon className="h-5 w-5 text-[#ff6e4d]" /></div><ul className="space-y-3">{items.map((item) => <li key={item} className="flex items-center gap-3 text-sm text-[#f3eee6]/70"><ChevronRight className="h-3 w-3 text-[#d5ff36]" />{item}</li>)}</ul></div>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
          <div className="reveal mb-14"><p className="eyebrow mb-5 text-[#ff6e4d]">05 / Experience, in motion</p><h2 className="max-w-3xl font-display text-5xl font-bold leading-[.92] tracking-[-.07em] md:text-8xl">A practice<br /><span className="text-[#2e5985]">still becoming.</span></h2></div>
          <div className="relative ml-2 border-l border-[#1d304b]/25 pl-8 md:ml-[16%] md:pl-14">
            {[['Nov 2025 — Present', 'UI/UX Design Intern', 'Inditronix AI Labs', 'Working on interfaces that help technical products communicate with more clarity.'], ['Aug 2025 — Apr 2026', 'Design Sub-coordinator / Co-Lead', 'E-Cell · SCME · Syahi · InvisionX · NSS · SevaUtsav / IIT Patna', 'Leading visual thinking across campus communities — from first idea to the final pixel.'], ['2024 — 2028', 'B.Tech Mechanical Engineering', 'Indian Institute of Technology, Patna', 'Building the technical foundation for a more curious, systems-minded creative practice.']].map(([date, role, place, body], index) => <div key={role} className={`reveal reveal-delay-${index + 1} relative mb-12 last:mb-0`}><span className="absolute -left-[41px] top-1 h-3 w-3 rounded-full border-2 border-[#f3eee6] bg-[#ff6e4d] shadow-[0_0_0_1px_#ff6e4d] md:-left-[61px]" /><p className="eyebrow text-[#ff6e4d]">{date}</p><h3 className="mt-3 font-display text-3xl font-bold tracking-[-.05em] md:text-5xl">{role}</h3><p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[.1em] text-[#2e5985]">{place}</p><p className="mt-4 max-w-xl text-sm leading-relaxed text-[#1d304b]/65">{body}</p></div>)}
          </div>
        </section>

        <section id="contact" className="border-t border-[#1d304b]/15 bg-[#ff6e4d]">
          <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
            <div className="reveal grid gap-12 md:grid-cols-[1.1fr_.9fr] md:items-end">
              <div><p className="eyebrow mb-5 text-[#1d304b]/65">06 / Open channel</p><h2 className="font-display text-6xl font-bold leading-[.82] tracking-[-.08em] text-[#1d304b] md:text-[9rem]">Let’s<br /><span className="text-[#d5ff36]">make</span><br />sense.</h2></div>
              <div><p className="max-w-md text-xl leading-relaxed text-[#1d304b]/80">Have a messy question, a product that needs a clearer surface, or a dataset with a story hiding in it?</p><div className="mt-8 flex flex-wrap gap-3"><a href="mailto:anshikaiitpatna@gmail.com" data-testid="link-email" className="inline-flex items-center gap-2 rounded-full bg-[#1d304b] px-5 py-3 font-mono-ui text-[10px] uppercase tracking-[.1em] text-[#f3eee6] transition-transform hover:-translate-y-1"><Mail className="h-4 w-4 text-[#d5ff36]" /> Email Anshika <ArrowUpRight className="h-3 w-3" /></a><button type="button" data-testid="button-copy-email" onClick={copyEmail} className="outline-button inline-flex items-center gap-2 rounded-full px-5 py-3 font-mono-ui text-[10px] uppercase tracking-[.1em]">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy email'}</button></div></div>
            </div>
            <div className="mt-20 grid gap-8 border-t border-[#1d304b]/30 pt-6 md:grid-cols-[1fr_auto] md:items-end"><div className="flex flex-wrap gap-x-7 gap-y-3"><a href="tel:+919580327613" data-testid="link-phone" className="font-mono-ui text-[10px] uppercase tracking-[.1em] text-[#1d304b]/75 hover:text-[#1d304b]"><Phone className="mr-2 inline h-3 w-3" />+91 95803 27613</a><a href="mailto:anshikaiitpatna@gmail.com" data-testid="link-footer-email" className="font-mono-ui text-[10px] uppercase tracking-[.1em] text-[#1d304b]/75 hover:text-[#1d304b]">anshikaiitpatna@gmail.com</a></div><div className="flex gap-5"><a href="#contact" onClick={(event) => event.preventDefault()} data-testid="link-linkedin" className="font-mono-ui text-[10px] uppercase tracking-[.1em] text-[#1d304b]/75 hover:text-[#1d304b]"><Linkedin className="mr-1 inline h-3 w-3" /> LinkedIn</a><a href="#contact" onClick={(event) => event.preventDefault()} data-testid="link-github" className="font-mono-ui text-[10px] uppercase tracking-[.1em] text-[#1d304b]/75 hover:text-[#1d304b]"><Github className="mr-1 inline h-3 w-3" /> GitHub</a></div></div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1d304b] px-5 py-6 text-[#f3eee6]/55 md:px-10"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 md:flex-row"><p className="font-mono-ui text-[9px] uppercase tracking-[.1em]">Anshika Singh / personal studio</p><p className="font-mono-ui text-[9px] uppercase tracking-[.1em]">Made with curiosity · IIT Patna</p></div></footer>

      {activeProject && <div className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-[#1d304b]/70 p-0 md:items-center md:p-8" role="dialog" aria-modal="true" aria-label={`${activeProject.title} case notes`} onClick={() => setActiveProject(null)}>
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-[#f3eee6] p-6 text-[#1d304b] shadow-[10px_10px_0_#d5ff36] md:p-10" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-start justify-between gap-5"><div><p className="eyebrow text-[#ff6e4d]">Case notes / {activeProject.number}</p><h2 className="mt-4 max-w-lg font-display text-4xl font-bold leading-[.95] tracking-[-.06em] md:text-6xl">{activeProject.title}</h2></div><button type="button" data-testid="button-close-project" aria-label="Close project notes" onClick={() => setActiveProject(null)} className="rounded-full border border-[#1d304b]/30 p-2 transition-colors hover:bg-[#1d304b] hover:text-[#f3eee6]"><X size={18} /></button></div>
          <div className="mt-10 border-t border-[#1d304b]/20 pt-7"><p className="max-w-xl text-lg leading-relaxed text-[#1d304b]/75">{activeProject.description}</p><ul className="mt-8 space-y-4">{activeProject.details.map((detail) => <li key={detail} className="flex gap-3 text-sm leading-relaxed"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ff6e4d]" />{detail}</li>)}</ul></div>
          <div className="mt-10 flex flex-wrap gap-2">{activeProject.tags.map((tag) => <span key={tag} className="rounded-full border border-[#1d304b]/25 px-3 py-1.5 font-mono-ui text-[9px] uppercase tracking-[.1em]">{tag}</span>)}</div>
        </div>
      </div>}
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