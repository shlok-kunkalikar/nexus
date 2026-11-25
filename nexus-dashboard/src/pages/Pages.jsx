
import { useState } from 'react'

import {
  Flame,
  Wind,
  Camera as Cam,
  UserCheck,
  Nfc,
  TriangleAlert,
  Info,
  ChevronDown,
  Eye,
  Cpu,
} from 'lucide-react'

import { Panel, Badge, Sparkline, time } from '../components/ui'

const CAM_URL = import.meta.env.VITE_CAM_URL

// ========================================
// WARNINGS PAGE
// ========================================

export function Warnings({ t, gasHistory, events, GAS_LIMIT }) {
  const alerts = events.filter((e) => e.level !== 'info')

  return (
    <div className="grid-2">

      {/* Gas Level */}
      <Panel
        title="Gas level"
        icon={Wind}
        action={
          <Badge tone={t.gas > GAS_LIMIT ? 'critical' : 'ok'}>
            {t.gas > GAS_LIMIT ? 'Leak' : 'Normal'}
          </Badge>
        }
      >
        <p className="big">
          {Math.round(t.gas)}
          <small> ppm</small>
        </p>

        <Sparkline data={gasHistory} limit={GAS_LIMIT} />

        <p className="muted">
          Dashed line marks the {GAS_LIMIT} ppm stop threshold.
        </p>
      </Panel>


      {/* Flame Sensor */}
      <Panel
        title="Flame sensor"
        icon={Flame}
        action={
          <Badge tone={t.flame ? 'critical' : 'ok'}>
            {t.flame ? 'Detected' : 'Clear'}
          </Badge>
        }
      >
        <p className="muted">
          When gas or fire is detected, Nexus stops, plays a
          voice warning and lights the alert LEDs.
        </p>
      </Panel>


      {/* Alert History */}
      <Panel
        title="Alert history"
        icon={TriangleAlert}
        className="wide"
      >
        {alerts.length === 0 ? (
          <p className="empty">
            No warnings so far. Alerts will appear here as they happen.
          </p>
        ) : (
          <ul className="feed">
            {alerts.map((e) => (
              <li key={e.id} className={e.level}>
                <time>{time(e.time)}</time>
                {e.message}
              </li>
            ))}
          </ul>
        )}
      </Panel>

    </div>
  )
}

// ========================================
// CAMERA PAGE
// ========================================

export function CameraPage({ state }) {
  return (
    <Panel
      title="Live camera"
      icon={Cam}
      action={<Badge tone="critical">Live</Badge>}
    >
      <div className="viewport">

        {CAM_URL ? (
          <img
            src={CAM_URL}
            alt="Live stream from the Nexus ESP32-CAM"
          />
        ) : (
          <div className="noise">
            <Cam size={28} />
            <p>Simulated feed</p>
            <span>
              Set VITE_CAM_URL to show the ESP32-CAM stream.
            </span>
          </div>
        )}

        <div className="osd">
          NEXUS-CAM · {state}
        </div>

      </div>
    </Panel>
  )
}

// ========================================
// ATTENDANCE PAGE
// ========================================

export function Attendance({ attendance, tapCard }) {
  const inside = new Set()

  // Calculate currently present users
  ;[...attendance].reverse().forEach((r) => {
    if (r.type === 'Entry') {
      inside.add(r.uid)
    } else {
      inside.delete(r.uid)
    }
  })

  return (
    <div className="grid-2">

      {/* RFID Reader */}
      <Panel title="RFID reader" icon={Nfc}>
        <p className="muted">
          First tap records an entry, the second records an exit.
          Nexus announces the result.
        </p>

        <button
          className="btn"
          onClick={() => tapCard()}
        >
          <UserCheck size={16} />
          Simulate card tap
        </button>

        <p className="big">
          {inside.size}
          <small> currently inside</small>
        </p>
      </Panel>

      {/* Attendance Log */}
      <Panel title="Attendance log" icon={UserCheck}>
        {attendance.length === 0 ? (
          <p className="empty">
            No taps yet. Simulate a card tap to see records here.
          </p>
        ) : (
          <table className="table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Card</th>
                <th>Type</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td className="mono">{r.uid}</td>

                  <td>
                    <Badge
                      tone={
                        r.type === 'Entry'
                          ? 'ok'
                          : 'neutral'
                      }
                    >
                      {r.type}
                    </Badge>
                  </td>

                  <td>{time(r.time)}</td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </Panel>

    </div>
  )
}

// ========================================
// ABOUT PAGE
// ========================================

export function About() {
  const [open, setOpen] = useState(null)

  // Nexus features
  const features = [
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

  return (
    <Panel title="About Nexus" icon={Info}>

      {/* About Section Label */}
      <div className="about-section-label">
        Project Overview
      </div>

      {/* Two Separate Cards */}
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

          {/* Features Accordion */}
          <div className="accordion-list">

            {features.map((feature) => (
              <div
                className="accordion-item"
                key={feature.key}
                data-key={feature.key}
              >

                {/* Accordion Header */}
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

                {/* Accordion Body */}
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

      {/* About Description */}
      <p className="muted lead about-footer">
        Nexus follows a black tape route, stops for obstacles,
        records attendance and watches for gas and fire.
        Everything is monitored from this portal.
      </p>

    </Panel>
  )
}
