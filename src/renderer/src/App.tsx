import { Box, Tab, Tabs } from '@mui/material'
import L, { LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useLayoutEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png'
import { MapSelector } from './components/MapSelector'
import aetheryte from './assets/marker/aetheryte.png'
import markerA from './assets/marker/marker-a.png'
import markerB from './assets/marker/marker-b.png'
import markerC from './assets/marker/marker-c.png'
import markerD from './assets/marker/marker-d.png'
import markerE from './assets/marker/marker-e.png'
import markerF from './assets/marker/marker-f.png'
import markerG from './assets/marker/marker-g.png'
import markerH from './assets/marker/marker-h.png'
import markerI from './assets/marker/marker-i.png'
import markerJ from './assets/marker/marker-j.png'
import dataJson from './assets/data.json'

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
  const [townMarkers, setTownMarkers] = useState<L.Marker[]>([])
  const [treasureBoxMarkers, setTreasureBoxMarkers] = useState<L.Marker[]>([])

  /**
   * 初期描画時
   */
  useEffect(() => {
    console.debug('useEffect[]')
    if (L.DomUtil.get('map')?.innerHTML !== '') return

    const map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: 0,
      maxZoom: 3,
      zoomControl: false,
      zoomSnap: 0.1
    })
    setEorzeaMap(map)

    // 地図描画
    drawMap()

    // マーカー
    // L.marker(L.latLng(-128, 128), {
    //   draggable: true
    // }).addTo(map)
  }, [])

  /**
   * パッチ、マップ変更時
   */
  useEffect(() => {
    console.debug('useEffect[selectPatchNo, selectMapNo]')
    // 地図描画
    drawMap()
    // 都市マーカー描画
    drawTownMarker()
    // 宝箱マーカー描画
    drawTreasureBoxMarker()
  }, [selectPatchNo, selectMapNo])

  /**
   * 地図描画
   */
  const drawMap = (): void => {
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

  const drawTownMarker = (): void => {
    if (eorzeaMap === undefined) {
      console.debug('マップインスタンスなし')
      return
    }

    for (const townMarker of townMarkers) {
      townMarker.remove()
    }

    const jsons = dataJson.filter((val) => {
      if (val.patch === selectPatchNo && val.mapNo === selectMapNo && val.coordClass === 'E')
        return true
      return false
    })

    const newMarkers: L.Marker[] = []
    const aetheryteIcon = L.icon({
      iconUrl: aetheryte,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })
    for (const j of jsons) {
      const lat = convMapPos(j.mapSize, j.coordY) * -1
      const lng = convMapPos(j.mapSize, j.coordX)
      const marker = L.marker(L.latLng(lat, lng), {
        icon: aetheryteIcon
      })
      marker.bindTooltip(j.coordNameJa)
      marker.addTo(eorzeaMap)
      newMarkers.push(marker)
    }
    setTownMarkers(newMarkers)
  }

  const drawTreasureBoxMarker = (): void => {
    if (eorzeaMap === undefined) {
      console.debug('マップインスタンスなし')
      return
    }

    for (const treasureBoxMarker of treasureBoxMarkers) {
      treasureBoxMarker.remove()
    }

    const tbIconSize: L.PointExpression = [25, 35]
    const tbIconAnchor: L.PointExpression = [13, 35]
    const tbMarkers = {
      A: L.icon({ iconUrl: markerA, iconSize: tbIconSize, iconAnchor: tbIconAnchor }),
      B: L.icon({ iconUrl: markerB, iconSize: tbIconSize, iconAnchor: tbIconAnchor }),
      C: L.icon({ iconUrl: markerC, iconSize: tbIconSize, iconAnchor: tbIconAnchor }),
      D: L.icon({ iconUrl: markerD, iconSize: tbIconSize, iconAnchor: tbIconAnchor }),
      E: L.icon({ iconUrl: markerE, iconSize: tbIconSize, iconAnchor: tbIconAnchor }),
      F: L.icon({ iconUrl: markerF, iconSize: tbIconSize, iconAnchor: tbIconAnchor }),
      G: L.icon({ iconUrl: markerG, iconSize: tbIconSize, iconAnchor: tbIconAnchor }),
      H: L.icon({ iconUrl: markerH, iconSize: tbIconSize, iconAnchor: tbIconAnchor }),
      I: L.icon({ iconUrl: markerI, iconSize: tbIconSize, iconAnchor: tbIconAnchor }),
      J: L.icon({ iconUrl: markerJ, iconSize: tbIconSize, iconAnchor: tbIconAnchor })
    }

    const jsons = dataJson.filter((val) => {
      if (val.patch === selectPatchNo && val.mapNo === selectMapNo && val.coordClass === 'P')
        return true
      return false
    })

    const newMarkers: L.Marker[] = []
    for (const j of jsons) {
      const lat = convMapPos(j.mapSize, j.coordY) * -1
      const lng = convMapPos(j.mapSize, j.coordX)
      const marker = L.marker(L.latLng(lat, lng), {
        icon: tbMarkers[j.coordNameJa]
      })
      marker.bindTooltip(`${lng}, ${lat * -1}`)
      marker.addTo(eorzeaMap)
      newMarkers.push(marker)
    }
    setTreasureBoxMarkers(newMarkers)
  }

  const convMapPos = (mapSize: number, coord: number): number => {
    return 256 * ((coord - 10) / mapSize)
  }

  const [value, setValue] = useState(1)

  const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
    setValue(newValue)
  }

  /**
   * MapSelectorからの通知を受ける
   * @param patchNo パッチNo
   * @param mapNo マップNo
   */
  const handleChangeMap = (patchNo: number, mapNo: number): void => {
    setSelectPathNo(patchNo)
    setSelectMapNo(mapNo)
    console.debug(`patchNo: ${patchNo}, mapNo: ${mapNo}`)
  }

  return (
    <>
      <div className="top-wrap"></div>
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
