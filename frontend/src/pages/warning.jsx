import { TriangleAlert } from 'lucide-react'
import { Panel, time } from '../components/ui'

export function Warnings({ events }) {
  const alerts = events.filter((e) => e.level !== 'info')

  return (
    <div className="grid-2">
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