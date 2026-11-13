import { Flame, Wind, Camera as Cam, UserCheck, Nfc, TriangleAlert, Info, ShieldCheck } from 'lucide-react'
import { Panel, Badge, Sparkline, time } from '../components/ui'

const CAM_URL = import.meta.env.VITE_CAM_URL

export function Warnings({ t, gasHistory, events, GAS_LIMIT }) {
  const alerts = events.filter((e) => e.level !== 'info')
  return (
    <div className="grid-2">
      <Panel title="Gas level" icon={Wind} action={<Badge tone={t.gas > GAS_LIMIT ? 'critical' : 'ok'}>{t.gas > GAS_LIMIT ? 'Leak' : 'Normal'}</Badge>}>
        <p className="big">{Math.round(t.gas)}<small> ppm</small></p>
        <Sparkline data={gasHistory} limit={GAS_LIMIT} />
        <p className="muted">Dashed line marks the {GAS_LIMIT} ppm stop threshold.</p>
      </Panel>
      <Panel title="Flame sensor" icon={Flame} action={<Badge tone={t.flame ? 'critical' : 'ok'}>{t.flame ? 'Detected' : 'Clear'}</Badge>}>
        <p className="muted">When gas or fire is detected, Nexus stops, plays a voice warning and lights the alert LEDs.</p>
      </Panel>
      <Panel title="Alert history" icon={TriangleAlert} className="wide">
        {alerts.length === 0
          ? <p className="empty">No warnings so far. Alerts will appear here as they happen.</p>
          : <ul className="feed">{alerts.map((e) => (
              <li key={e.id} className={e.level}><time>{time(e.time)}</time>{e.message}</li>))}</ul>}
      </Panel>
    </div>
  )
}

export function CameraPage({ state }) {
  return (
    <Panel title="Live camera" icon={Cam} action={<Badge tone="critical">Live</Badge>}>
      <div className="viewport">
        {CAM_URL
          ? <img src={CAM_URL} alt="Live stream from the Nexus ESP32-CAM" />
          : <div className="noise"><Cam size={28} /><p>Simulated feed</p><span>Set VITE_CAM_URL to show the ESP32-CAM stream.</span></div>}
        <div className="osd">NEXUS-CAM · {state}</div>
      </div>
    </Panel>
  )
}

export function Attendance({ attendance, tapCard }) {
  const inside = new Set()
  ;[...attendance].reverse().forEach((r) => (r.type === 'Entry' ? inside.add(r.uid) : inside.delete(r.uid)))
  return (
    <div className="grid-2">
      <Panel title="RFID reader" icon={Nfc}>
        <p className="muted">First tap records an entry, the second records an exit. Nexus announces the result.</p>
        <button className="btn" onClick={() => tapCard()}><UserCheck size={16} />Simulate card tap</button>
        <p className="big">{inside.size}<small> currently inside</small></p>
      </Panel>
      <Panel title="Attendance log" icon={UserCheck}>
        {attendance.length === 0
          ? <p className="empty">No taps yet. Simulate a card tap to see records here.</p>
          : <table className="table"><thead><tr><th>Name</th><th>Card</th><th>Type</th><th>Time</th></tr></thead>
              <tbody>{attendance.map((r) => (
                <tr key={r.id}><td>{r.name}</td><td className="mono">{r.uid}</td>
                  <td><Badge tone={r.type === 'Entry' ? 'ok' : 'neutral'}>{r.type}</Badge></td><td>{time(r.time)}</td></tr>))}</tbody></table>}
      </Panel>
    </div>
  )
}

export function About() {
  const rows = [
    ['Controller', 'ESP32 with ESP32-CAM'], ['Power', '3S2P Li-ion, 11.1 V, protected by a BMS'],
    ['Navigation', '3 IR sensors, L298N motor driver'], ['Obstacles', 'HC-SR04 ultrasonic'],
    ['Attendance', 'MFRC522 RFID reader'], ['Safety', 'MQ-2 gas, flame sensor'],
  ]
  return (
    <Panel title="About Nexus" icon={Info}>
      <p className="muted lead">Nexus follows a black tape route, stops for obstacles, records attendance and watches for gas and fire. Everything is monitored from this portal.</p>
      <dl className="specs">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    </Panel>
  )
}
