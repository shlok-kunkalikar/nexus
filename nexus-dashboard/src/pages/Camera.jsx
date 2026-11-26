import { Camera as Cam } from 'lucide-react'
import { Panel, Badge } from '../components/ui'

const CAM_URL = import.meta.env.VITE_CAM_URL

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