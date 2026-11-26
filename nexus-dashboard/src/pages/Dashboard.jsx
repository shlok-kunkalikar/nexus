import { Home, Building2, Cpu, BatteryMedium, Radar, Wind, Flame } from 'lucide-react'
import { Panel, Badge, Ring } from '../components/ui'
import RobotHero from '../components/RobotHero'

export default function Dashboard({ t, setMode }) {
  const low = t.battery < 20
  return (
    <div className="grid-dash">
      <Panel className="stage"><RobotHero state={t.state} /></Panel>
      <aside className="stack">
 {/*Robot mode======================================================*/}
        <Panel title="Robot mode" icon={Cpu}>
          <div className="seg" role="radiogroup" aria-label="Robot mode">
            {[['house', Home, 'House'], ['office', Building2, 'Office']].map(([id, Icon, label]) => (
              <button key={id} role="radio" aria-checked={t.mode === id}
                className={t.mode === id ? 'on' : ''} onClick={() => setMode(id)}>
                <Icon size={16} />{label}
              </button>
            ))}
          </div>
          <dl className="kv"><dt>Current mode</dt><dd>{t.mode === 'house' ? 'House' : 'Office'}</dd></dl>
        </Panel>

   {/*Robot status======================================================*/}
        <Panel title="Robot status" icon={Radar}>
          <dl className="kv"><dt>Connection</dt>
            <dd><Badge tone={t.online ? 'ok' : 'critical'}>{t.online ? 'Online' : 'Offline'}</Badge></dd></dl>
        </Panel>

   {/*Robot battery======================================================*/}
        <Panel title="Battery" icon={BatteryMedium}>
          <div className="battery">
            <Ring value={t.battery} tone={low ? 'critical' : 'accent'} label={`${Math.round(t.battery)}%`} sub="charge" />
            <dl className="kv col">
              <dt>Pack voltage</dt><dd>{t.voltage.toFixed(1)} V</dd>
              <dt>Configuration</dt><dd>3S2P Li-ion</dd>
            </dl>
          </div>
        </Panel>

    
      </aside>
    </div>
  )
}
