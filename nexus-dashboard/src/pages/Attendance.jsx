import { UserCheck, Nfc, Download } from 'lucide-react'
import { Panel, Badge, time } from '../components/ui'

function formatExportTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  return {
    readable: `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`,
    fileSafe: `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`,
  }
}

function escapeCsvCell(value) {
  const str = String(value ?? '')
  return `"${str.replace(/"/g, '""')}"`
}

export function Attendance({ attendance }) {
  const inside = new Set()

  // Calculate currently present users from API-driven records
  ;[...attendance].reverse().forEach((r) => {
    if (r.type === 'Entry') {
      inside.add(r.uid)
    } else {
      inside.delete(r.uid)
    }
  })

  const handleDownloadLog = () => {
    const exportedAt = formatExportTimestamp(new Date())

    const lines = [
      `Downloaded At,${escapeCsvCell(exportedAt.readable)}`,
      '',
      ['Name', 'Card', 'Type', 'Time'].map(escapeCsvCell).join(','),
      ...attendance.map((r) => {
        const recordDate = r.time ? new Date(r.time) : null
        const formattedTime =
          recordDate && !Number.isNaN(recordDate.getTime())
            ? `${recordDate.toLocaleDateString('en-IN')} ${time(recordDate)}`
            : ''

        return [r.name, r.uid, r.type, formattedTime]
          .map(escapeCsvCell)
          .join(',')
      }),
    ]

    const blob = new Blob([lines.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `nexus-attendance-log_${exportedAt.fileSafe}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid-2">
      {/* RFID Reader */}
      <Panel title="RFID reader" icon={Nfc}>
        <p className="muted">
          First tap records an entry, the second records an exit.
          Records update automatically from the robot API.
        </p>

        <p className="big">
          {inside.size}
          <small> currently inside</small>
        </p>

        <button
          type="button"
          className="btn"
          onClick={handleDownloadLog}
          disabled={attendance.length === 0}
        >
          <Download size={16} />
          Download log
        </button>
      </Panel>

      {/* Attendance Log */}
      <Panel title="Attendance log" icon={UserCheck}>
        {attendance.length === 0 ? (
          <p className="empty">
            No taps recorded yet. Logs will appear here as RFID scans arrive from the robot.
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