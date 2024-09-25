import { Box, Tab, Tabs } from '@mui/material'
import L, { LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useLayoutEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png'
import { MapSelector } from './components/MapSelector'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps): JSX.Element {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerIconShadow,
  iconAnchor: [12, 41], // アイコンのオフセット
  popupAnchor: [0, -32] // ポップアップのオフセット
})
L.Marker.prototype.options.icon = DefaultIcon

function App(): JSX.Element {
  const [eorzeaMap, setEorzeaMap] = useState<L.Map>()
  const [eorzeaLayer, setEorzeaLayer] = useState<L.TileLayer>()
  const [selectPatchNo, setSelectPathNo] = useState(3)
  const [selectMapNo, setSelectMapNo] = useState(1)

  useEffect(() => {
    console.debug('useEffect[]')
    if (L.DomUtil.get('map')?.innerHTML !== '') return
    // if (eorzeaMap !== undefined) return

    const map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: 0,
      maxZoom: 3,
      zoomControl: false,
      zoomSnap: 0.1
    })
    setEorzeaMap(map)

    // 地図描画
    drowMap()

    // マーカー
    L.marker(L.latLng(-128, 128), {
      draggable: true
    }).addTo(map)
  }, [])

  useEffect(() => {
    console.debug('useEffect[selectPatchNo, selectMapNo]')
    drowMap()
  }, [selectPatchNo, selectMapNo])

  /**
   * 地図描画
   */
  const drowMap = (): void => {
    console.debug('drowMap')
    let eoLayer = eorzeaLayer
    if (eorzeaMap === undefined) {
      console.debug('マップインスタンスなし')
      return
    }
    console.debug('マップインスタンスあり')
    if (eoLayer !== undefined) {
      console.debug('レイヤーインスタンスあり')
      eoLayer.remove()
    }

    eoLayer = L.tileLayer(
      `src/assets/map/p${String(selectPatchNo).padStart(2, '0')}_${selectMapNo}/{z}/{x}/{y}.jpg`,
      {
        attribution: '©<a href="https://jp.finalfantasyxiv.com/">SQUARE ENIX</a>',
        noWrap: true
      }
    )

    // 画面サイズからフィットする倍率を求める
    const zoom = Math.log2(eorzeaMap.getSize().x / 256)
    // 初期位置
    eorzeaMap.setView(L.latLng(-128, 128), zoom)

    eoLayer.addTo(eorzeaMap)
    setEorzeaLayer(eoLayer)
  }

  const [value, setValue] = useState(1)

  const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
    setValue(newValue)
  }

  const handleChangeMap = (patchNo: number, mapNo: number): void => {
    setSelectPathNo(patchNo)
    setSelectMapNo(mapNo)
    console.debug(`patchNo: ${patchNo}, mapNo: ${mapNo}`)
  }

  return (
    <>
      <div className="top-wrap">sss </div>
      <div className="wrap">
        <div className="map-container">
          <MapSelector onSelectMap={handleChangeMap} />
          <div id="map"></div>
        </div>
        <div className="control-container">
          <div className="control-container-inner">side</div>
        </div>

        {/* <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Item One" {...a11yProps(0)} />
            <Tab label="Item Two" {...a11yProps(1)} />
            <Tab label="Item Three" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          Item One
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Item Two
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
      </Box> */}
      </div>
    </>
  )
}

export default App
