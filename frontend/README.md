# Nexus Control

React + Vite dashboard for the Nexus line-following robot.

    npm install
    npm run dev

Runs on a built-in simulator by default. To use real data, copy `.env.example` to `.env`, set
`VITE_ESP32_URL` (ESP32 must serve `GET /api/status`) and `VITE_CAM_URL` (ESP32-CAM stream).

Expected JSON from `/api/status` (all fields optional):
`{ "mode":"house", "battery":78, "gas":210, "flame":false, "distance":64, "ir":[0,1,0] }`
