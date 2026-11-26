import { useState } from 'react'
import { Info, ChevronDown, Eye, Cpu } from 'lucide-react'
import { Panel } from '../components/ui'

const FEATURES = [
  {
    key: 'hazard',
    number: 1,
    title: 'Hazard Detection',
    subtitle: 'Gas · Flame · Obstacle sensing',
    description:
      'NEXUS continuously scans its surroundings for gas leaks, flames, and obstacles — flagging danger the moment it is detected and triggering safety alerts on the dashboard automatically.',
  },
  {
    key: 'surveillance',
    number: 2,
    title: 'Camera Surveillance',
    subtitle: 'Live monitoring, anywhere',
    description:
      'A built-in live camera lets NEXUS act as a roaming set of eyes — stream video in real time and keep watch over the home or office as it moves around.',
  },
  {
    key: 'attendance',
    number: 3,
    title: 'Attendance Management',
    tag: 'Office Mode',
    subtitle: 'Automated check-in tracking',
    description:
      'When switched to Office mode, NEXUS handles staff attendance automatically — logging check-ins as people pass by, no manual sign-in needed.',
  },
  {
    key: 'vacuum',
    number: 4,
    title: 'Vacuum',
    subtitle: 'Cleans as it moves',
    description:
      'A built-in vacuum module means NEXUS keeps floors clean during its regular movement around the space — everyday utility on top of monitoring and safety.',
  },
  {
    key: 'tray',
    number: 5,
    title: 'Carry Tray',
    subtitle: 'Up to 1kg capacity',
    description:
      "A sturdy built-in tray lets NEXUS carry up to 1kg with ease — perfect for ferrying snacks, documents, or small parcels wherever they're needed.",
  },
]

export function About() {
  const [open, setOpen] = useState(null)

  return (
    <Panel title="About Nexus" icon={Info}>
      <div className="about-section-label">
        Project Overview
      </div>

      <div className="about-grid">
        {/* ================= VISION CARD ================= */}
        <div className="card about-card vision-card">
          <div className="about-card-header">
            <div className="about-icon vision-icon">
              <Eye size={22} />
            </div>

            <div>
              <h3>Our Vision</h3>
              <span className="about-card-subtitle">
                Building a smarter future
              </span>
            </div>
          </div>

          <div className="vision-quote">
            To create a smarter, safer and more responsive
            environment through connected robotics and
            intelligent sensing.
          </div>

          <p className="about-description">
            NEXUS is envisioned as more than just a mobile robot.
            It is a connected safety and monitoring system
            designed to bring <strong>sensing, mobility, automation
            and human decision-making</strong> together on a single
            platform.
          </p>

          <p className="about-description">
            Our vision is to develop a system that can continuously
            monitor its surroundings, identify potential hazards,
            assist in routine tasks, and communicate important
            information to people in real time.
          </p>

          <p className="about-description">
            By combining <strong>IoT, robotics, environmental sensing,
            computer vision and web-based monitoring</strong>, NEXUS
            aims to create smarter environments where technology
            does not simply observe problems — it helps people
            respond to them.
          </p>
        </div>

        {/* ================= FEATURES CARD ================= */}
        <div className="card about-card features-card">
          <div className="about-card-header">
            <div className="about-icon features-icon">
              <Cpu size={22} />
            </div>

            <div>
              <h3>Core Features</h3>
              <span className="about-card-subtitle">
                What makes NEXUS intelligent
              </span>
            </div>
          </div>

          <div className="accordion-list">
            {FEATURES.map((feature) => (
              <div
                className="accordion-item"
                key={feature.key}
                data-key={feature.key}
              >
                <button
                  type="button"
                  className="accordion-header"
                  onClick={() =>
                    setOpen(
                      open === feature.key
                        ? null
                        : feature.key
                    )
                  }
                  aria-expanded={open === feature.key}
                >
                  <div className="accordion-number">
                    {feature.number}
                  </div>

                  <div className="accordion-title-wrap">
                    <div className="accordion-title">
                      {feature.title}

                      {feature.tag && (
                        <span className="feature-tag">
                          {feature.tag}
                        </span>
                      )}
                    </div>

                    <div className="accordion-subtitle">
                      {feature.subtitle}
                    </div>
                  </div>

                  <ChevronDown
                    size={18}
                    className={`accordion-chevron ${
                      open === feature.key ? 'open' : ''
                    }`}
                  />
                </button>

                {open === feature.key && (
                  <div className="accordion-body">
                    <div className="accordion-body-inner">
                      {feature.description}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="muted lead about-footer">
        Nexus follows a black tape route, stops for obstacles,
        records attendance and watches for gas and fire.
        Everything is monitored from this portal.
      </p>
    </Panel>
  )
}