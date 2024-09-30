import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LegacyRef, MutableRefObject, useEffect, useRef, useState } from 'react'
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
import { ControlPanel } from './components/ControlPanel'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useTranslation } from 'react-i18next'
import i18n from './i18n/configs'

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerIconShadow,
  iconAnchor: [12, 41], // アイコンのオフセット
  popupAnchor: [0, -32] // ポップアップのオフセット
})
L.Marker.prototype.options.icon = DefaultIcon

function App(): JSX.Element {
  const { t } = useTranslation()
  const [lang, setLang] = useState('ja')

  const wrapElm = useRef<HTMLDivElement>(null)
  const mapContainerElm = useRef<HTMLDivElement>(null)

  const [eorzeaMap, setEorzeaMap] = useState<L.Map>()
  const [eorzeaLayer, setEorzeaLayer] = useState<L.TileLayer>()
  const [selectPatchNo, setSelectPathNo] = useState(3)
  const [selectMapNo, setSelectMapNo] = useState(1)
  const [selectCoordNo, setSelectCoordNo] = useState(0)
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

  useEffect(() => {
    if (wrapElm.current) {
      console.debug(wrapElm.current)
      console.debug(JSON.stringify(wrapElm.current.getBoundingClientRect()))
    }
  }, [wrapElm])

  /** 言語選択 */
  const handleChangeLang = (event: SelectChangeEvent): void => {
    const language = event.target.value as string
    setLang(language)
    i18n.changeLanguage(language)
  }

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
      marker.on('click', () => {
        console.debug(`マーカークリック: ${j.mapNameJa}(${j.coordNameJa})`)
        setSelectCoordNo(j.coordNo)
      })
      marker.addTo(eorzeaMap)
      newMarkers.push(marker)
    }
    setTreasureBoxMarkers(newMarkers)
  }

  /**
   * エオルゼア座標変換
   * @param mapSize マップサイズ
   * @param coord 座標
   * @returns エオルゼア座標
   */
  const convMapPos = (mapSize: number, coord: number): number => {
    return 256 * ((coord - 10) / mapSize)
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
      <div className="wrap" ref={wrapElm}>
        <div className="map-container">
          <FormControl sx={{ m: 1, mb: 0, minWidth: 120 }} size="small">
            <InputLabel id="lang-select-label">{t('Language')}</InputLabel>
            <Select
              labelId="lang-select-label"
              id="lang-select"
              value={lang}
              label="Language"
              onChange={handleChangeLang}
            >
              <MenuItem value={'ja'}>日本語</MenuItem>
              <MenuItem value={'na'}>English(US)</MenuItem>
              <MenuItem value={'eu'}>English(UK)</MenuItem>
              <MenuItem value={'fr'}>Français</MenuItem>
              <MenuItem value={'de'}>Deutsch</MenuItem>
              <MenuItem value={'cn'}>中文</MenuItem>
              <MenuItem value={'kr'}>한국어</MenuItem>
            </Select>
          </FormControl>
          <MapSelector onSelectMap={handleChangeMap} />
          <div id="map"></div>
        </div>
        <div className="control-container">
          <div className="control-container-inner">
            <ControlPanel
              selectPatchNo={selectPatchNo}
              selectMapNo={selectMapNo}
              selectPointNo={selectCoordNo}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
