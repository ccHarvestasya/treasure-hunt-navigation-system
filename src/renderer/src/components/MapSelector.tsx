import { Box, Tab, Tabs } from '@mui/material'
import { useEffect, useState } from 'react'
import dataJson from '../assets/data.json'

function patchTabProps(index: number): { id: string; 'aria-controls': string } {
  return {
    id: `patch-select-tab-${index}`,
    'aria-controls': `patch-select-tabpanel-${index}`
  }
}

function mapTabProps(index: number): { id: string; 'aria-controls': string } {
  return {
    id: `map-select-tab-${index}`,
    'aria-controls': `map-select-tabpanel-${index}`
  }
}

export const MapSelector = (props: {
  onSelectMap: (patchNo: number, mapNo: number) => void
}): JSX.Element => {
  const [patchTabs, setPatchTabs] = useState<JSX.Element[]>([])
  const [patchTabPanels, setPatchTabPanels] = useState<JSX.Element>()
  const [selecPatchTabNo, setSelectPatchTabNo] = useState(0)
  const [selecMapTabNo, setSelectMapTabNo] = useState(0)

  const handleChangePatch = (_event: React.SyntheticEvent, newValue: number): void => {
    setSelectPatchTabNo(newValue)
    // 地図選択初期化
    setSelectMapTabNo(0)
  }

  const handleChangeMap = (_event: React.SyntheticEvent, newValue: number): void => {
    setSelectMapTabNo(newValue)
  }

  useEffect(() => {
    // パッチ抜き出し（重複無）
    const patchSet = new Set<number>()
    const patchTabsJsx: JSX.Element[] = []
    for (const data of dataJson) {
      patchSet.add(data.patch)
    }
    // タブリスト作成
    for (const p of patchSet) {
      patchTabsJsx.push(<Tab key={`Patch${p}`} label={`Patch${p}`} {...patchTabProps(p - 3)} />)
    }
    setPatchTabs(patchTabsJsx)
    // パッチ最大値取得
    setSelectPatchTabNo(patchSet.size - 1)
  }, [])

  useEffect(() => {
    // 対象パッチのデータのみ抜き出し
    const selectPatchData = dataJson.filter((val) => {
      if (selecPatchTabNo + 3 === val.patch) return true
      return false
    })
    // マップ名抜きだし（重複無）
    const mapNameSet = new Set<string>()
    for (const data of selectPatchData) {
      mapNameSet.add(data.mapNameAbbrJa)
    }
    const mapNameArray = [...mapNameSet]
    // タブパネル作成
    const mapTabsJsx: JSX.Element[] = []
    for (const m of mapNameArray) {
      mapTabsJsx.push(<Tab key={m} label={m} {...mapTabProps(mapNameArray.indexOf(m))} />)
    }
    const mapNameTabPanelsJsx = (
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        value={selecMapTabNo}
        onChange={handleChangeMap}
      >
        {mapTabsJsx}
      </Tabs>
    )
    setPatchTabPanels(mapNameTabPanelsJsx)
    // 親へ通知
    props.onSelectMap(selecPatchTabNo + 3, selecMapTabNo + 1)
  }, [selecPatchTabNo, selecMapTabNo])

  return (
    <>
      <Box sx={{ maxWidth: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            value={selecPatchTabNo}
            onChange={handleChangePatch}
          >
            {patchTabs}
          </Tabs>
        </Box>
        {patchTabPanels}
      </Box>
    </>
  )
}
