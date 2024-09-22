import { LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

function App(): JSX.Element {
  const position = new LatLng(33.59337, 130.35152) // 福岡タワー

  return (
    <MapContainer center={position} zoom={13}>
      <TileLayer
        attribution='© <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
        url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          PopUp!! PopUp!! PopUp!! <br /> ポップアップ
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default App
