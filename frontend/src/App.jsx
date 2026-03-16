import { useState, useEffect, useRef } from 'react'
import { profileApi, projectApi, messageApi } from './services/api'
import './App.css'

const fmtDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

export default function App() {
  const [profile, setProfile]     = useState(null)
  const [projects, setProjects]   = useState([])
  const [messages, setMessages]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [activeNav, setActiveNav] = useState('intro')
  const [form, setForm]           = useState({ visitorName: '', email: '', content: '' })
  const [sending, setSending]     = useState(false)
  const [sent, setSent]           = useState(false)

  useEffect(() => {
    Promise.all([profileApi.getAll(), projectApi.getAll(), messageApi.getAll()])
      .then(([p, pr, m]) => { setProfile(p[0] ?? null); setProjects(pr); setMessages(m) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const ids = ['intro', 'about', 'skills', 'projects', 'guestbook', 'contact']
    const handler = () => {
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const { top, bottom } = el.getBoundingClientRect()
        if (top <= 80 && bottom > 80) { setActiveNav(id); break }
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const handleSend = async (e) => {
    e.preventDefault()
    if (!form.visitorName.trim() || !form.content.trim()) return
    setSending(true)
    try {
      const newMsg = await messageApi.create(form)
      setMessages(prev => [newMsg, ...prev])
      setForm({ visitorName: '', email: '', content: '' })
      setSent(true)
      setTimeout(() => setSent(false), 3000)
    } catch (err) { console.error(err) }
    finally { setSending(false) }
  }

  if (loading) return (
    <div className="splash">
      <div className="splash-ring" />
    </div>
  )

  const navItems = [
    { id: 'intro',     label: 'Home' },
    { id: 'about',     label: 'About' },
    { id: 'skills',    label: 'Skills' },
    { id: 'projects',  label: 'Work' },
    { id: 'guestbook', label: 'Guestbook' },
    { id: 'contact',   label: 'Contact' },
  ]

  return (
    <div className="app">

      {/* NAV */}
      <nav className="nav">
        <ul className="nav-list">
          {navItems.map(({ id, label }) => (
            <li key={id}>
              <button
                className={`nav-item ${activeNav === id ? 'active' : ''}`}
                onClick={() => scrollTo(id)}
              >{label}</button>
            </li>
          ))}
        </ul>
      </nav>

      {/* INTRO */}
      <section id="intro" className="intro">
        <div className="intro-deco">
          <div className="deco-ring deco-ring--lg" />
          <div className="deco-ring deco-ring--sm" />
          <div className="deco-blob" />
        </div>
        <div className="intro-content">
          <div className="intro-eyebrow">
            <span className="eyebrow-rule" />
            <span>Full-Stack Developer &amp; Creative</span>
            <span className="eyebrow-rule" />
          </div>
          <h1 className="intro-name">
            <span className="intro-name__hi">Hello, I'm</span>
            <span className="intro-name__main">
              {profile?.fullName ?? 'Nguyen Tran Ngoc Han'}
            </span>
          </h1>
          <p className="intro-tagline">
            I craft web experiences with care for both code quality and visual craft.
          </p>
          <div className="intro-cta">
            <button className="btn btn--filled" onClick={() => scrollTo('about')}>
              Get to know me
            </button>
            <button className="btn btn--ghost" onClick={() => scrollTo('projects')}>
              See my work
            </button>
          </div>
          <p className="intro-location">
            <span className="loc-dot" /> HUTECH University · Ho Chi Minh City
            &nbsp;&nbsp;·&nbsp;&nbsp;
            <span className="loc-avail">Open to internship opportunities</span>
          </p>
        </div>
        <button className="scroll-cue" onClick={() => scrollTo('about')}>
          <span>scroll</span>
          <div className="scroll-cue__line" />
        </button>
      </section>

      {/* ABOUT */}
      <AboutSection profile={profile} scrollTo={scrollTo} />

      {/* SKILLS */}
      <SkillsSection skills={profile?.skills ?? []} />

      {/* PROJECTS */}
      <ProjectsSection projects={projects} />

      {/* GUESTBOOK */}
      <section id="guestbook" className="guestbook">
        <div className="wrap">
          <RevealHeader
            eyebrow="Guestbook"
            title="Leave a note"
            sub="Glad you stopped by. Say hello if you'd like — it means a lot."
          />
          <div className="gb-layout">
            <form className="gb-form" onSubmit={handleSend}>
              <p className="gb-hint">Your message appears instantly below.</p>
              <Field label="Your name *">
                <input type="text" placeholder="e.g. Nguyen Van A"
                  value={form.visitorName}
                  onChange={e => setForm(f => ({ ...f, visitorName: e.target.value }))}
                  required />
              </Field>
              <Field label="Email" optional>
                <input type="email" placeholder="hello@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </Field>
              <Field label="Message *">
                <textarea rows={5} placeholder="Write something nice..."
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  required />
              </Field>
              <button className="btn btn--filled btn--full" type="submit" disabled={sending}>
                {sending ? 'Sending…' : sent ? '✓ Sent — thank you!' : 'Send message'}
              </button>
            </form>

            <div className="gb-feed">
              <p className="gb-count">{messages.length} message{messages.length !== 1 ? 's' : ''}</p>
              {messages.length === 0
                ? <p className="gb-empty">No messages yet. Be the first! 🌱</p>
                : (
                  <div className="gb-list">
                    {messages.map((msg, i) => (
                      <div key={msg.id} className="gb-card" style={{ animationDelay: `${i * 0.06}s` }}>
                        <div className="gb-card-head">
                          <div className="gb-avatar">{msg.visitorName?.charAt(0).toUpperCase()}</div>
                          <div>
                            <p className="gb-name">{msg.visitorName}</p>
                            <time className="gb-date">{fmtDate(msg.createdAt)}</time>
                          </div>
                        </div>
                        <p className="gb-msg">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <div className="wrap contact-inner">
          <RevealHeader
            eyebrow="Contact"
            title="Let's work together"
            sub="I'm actively seeking Full-Stack internship opportunities. Feel free to reach out anytime."
            center
          />
          <a className="contact-email" href={`mailto:${profile?.email}`}>
            {profile?.email}
          </a>
          <div className="contact-links">
            {profile?.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="contact-link">GitHub ↗</a>
            )}
            {profile?.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="contact-link">LinkedIn ↗</a>
            )}
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>Designed &amp; built by <em>Nguyen Tran Ngoc Han</em></p>
        <p className="footer-stack">React · Spring Boot · SQL Server · Docker</p>
      </footer>

    </div>
  )
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function AboutSection({ profile, scrollTo }) {
  const [ref, visible] = useReveal()
  return (
    <section id="about" className="about">
      <div className="wrap">
        <div ref={ref} className={`about-grid ${visible ? 'reveal' : ''}`}>
          <div className="about-left">
            <span className="section-eyebrow">About me</span>
            <h2 className="about-title">A developer who thinks like an artist.</h2>
            <div className="about-rule" />
          </div>
          <div className="about-right">
            <p className="about-bio">{profile?.bio}</p>
            <div className="about-facts">
              <Fact label="University" value="HUTECH — Software Engineering" />
              <Fact label="GPA"        value="3.30 / 4.00" />
              <Fact label="Year"       value="4th year" />
              <Fact label="Focus"      value="Full-Stack · PERN · Spring Boot" />
              <Fact label="Location"   value="Ho Chi Minh City, Vietnam" />
            </div>
            <button className="btn btn--ghost" onClick={() => scrollTo('contact')}>
              Get in touch →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Fact({ label, value }) {
  return (
    <div className="fact">
      <span className="fact-label">{label}</span>
      <span className="fact-value">{value}</span>
    </div>
  )
}

const SKILL_CAT = {
  'Java': 'back', 'Spring Boot': 'back', 'Node.js': 'back',
  'REST API': 'back', 'SQL Server': 'back', 'PostgreSQL': 'back',
  'React.js': 'front', 'HTML': 'front', 'CSS': 'front', 'Vite': 'front',
  'Docker': 'tools', 'Git': 'tools',
}
const CAT_LABEL = { back: 'Back-end', front: 'Front-end', tools: 'Tools & DevOps' }

function SkillsSection({ skills }) {
  const [ref, visible] = useReveal()
  const grouped = skills.reduce((acc, s) => {
    const c = SKILL_CAT[s] ?? 'tools'
    ;(acc[c] = acc[c] || []).push(s)
    return acc
  }, {})
  return (
    <section id="skills" className="skills">
      <div className="wrap">
        <RevealHeader eyebrow="Skills" title="What I work with" sub="Technologies I rely on to build modern web applications." />
        <div ref={ref} className={`skills-groups ${visible ? 'reveal' : ''}`}>
          {Object.entries(grouped).map(([cat, list], gi) => (
            <div key={cat} className="skill-group">
              <h3 className="skill-cat">{CAT_LABEL[cat] ?? cat}</h3>
              <div className="skill-chips">
                {list.map((s, i) => (
                  <span key={s} className="chip" style={{ animationDelay: `${gi * 0.12 + i * 0.06}s` }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectsSection({ projects }) {
  const [ref, visible] = useReveal()
  return (
    <section id="projects" className="projects">
      <div className="wrap">
        <RevealHeader eyebrow="Selected Work" title="Projects" sub="Things I've designed, built, and shipped." />
        <div ref={ref} className={`project-list ${visible ? 'reveal' : ''}`}>
          {projects.map((p, i) => (
            <article key={p.id} className="project-row" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="pr-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="pr-body">
                <h3 className="pr-name">{p.name}</h3>
                <p className="pr-desc">{p.description}</p>
                <p className="pr-tech">{p.techStack}</p>
              </div>
              <div className="pr-links">
                {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="pr-link">GitHub ↗</a>}
                {p.liveUrl   && <a href={p.liveUrl}   target="_blank" rel="noreferrer" className="pr-link">Live ↗</a>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function RevealHeader({ eyebrow, title, sub, center }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} className={`sec-header ${center ? 'sec-header--center' : ''} ${visible ? 'reveal' : ''}`}>
      <span className="section-eyebrow">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  )
}

function Field({ label, children, optional }) {
  return (
    <div className="field">
      <label>{label}{optional && <span className="field-opt"> (optional)</span>}</label>
      {children}
    </div>
  )
}