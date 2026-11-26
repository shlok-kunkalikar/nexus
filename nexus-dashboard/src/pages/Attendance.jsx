import { UserCheck, Nfc } from 'lucide-react'
import { Panel, Badge, time } from '../components/ui'

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
          type="button"
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