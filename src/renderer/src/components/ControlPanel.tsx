import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Tab,
  Tabs,
  TextField
} from '@mui/material'
import { useEffect, useState } from 'react'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { useTranslation } from 'react-i18next'
import dataJson from '../assets/data.json'
import i18n from '@renderer/i18n/configs'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const CustomTabPanel = (props: TabPanelProps): JSX.Element => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  )
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

interface eorzeaLocation {
  mapName: string
  coord: string
}

/**
 * 登録リスト
 */
interface EntryList {
  memberName: string
  patchNo: number
  mapNo: number
  coordNo: number
}

/**
 * 進行リスト
 */
interface ProgressList extends EntryList {
  entryId: number
  isComplete: boolean
  diveLeve: number
}

export const ControlPanel = (props: {
  selectPatchNo: number
  selectMapNo: number
  selectPointNo: number
}): JSX.Element => {
  const { t } = useTranslation()

  const [memName1, setMemName1] = useState('')
  const [memName2, setMemName2] = useState('')
  const [memName3, setMemName3] = useState('')
  const [memName4, setMemName4] = useState('')
  const [memName5, setMemName5] = useState('')
  const [memName6, setMemName6] = useState('')
  const [memName7, setMemName7] = useState('')
  const [memName8, setMemName8] = useState('')
  const [memLocation1, setMemLocation1] = useState('未設定')
  const [memLocation2, setMemLocation2] = useState('未設定')
  const [memLocation3, setMemLocation3] = useState('未設定')
  const [memLocation4, setMemLocation4] = useState('未設定')
  const [memLocation5, setMemLocation5] = useState('未設定')
  const [memLocation6, setMemLocation6] = useState('未設定')
  const [memLocation7, setMemLocation7] = useState('未設定')
  const [memLocation8, setMemLocation8] = useState('未設定')
  const [inputLocationNo, setInputLocationNo] = useState(0)
  const [inputLocationName, setInputLocationName] = useState('')
  const [isInputLocationSnac, setIsInputLocationSnac] = useState(false)
  const [entryList, setEntryList] = useState<(EntryList | undefined)[]>([])

  const [value, setValue] = useState(1)

  /**
   * 親からマップ選択通知受信
   */
  useEffect(() => {
    console.debug('useEffect[props.selectPointNo]')

    if (inputLocationNo === 0) return // マップ選択中でない場合は終了
    const selJsons = dataJson.filter((val) => {
      if (
        val.patch === props.selectPatchNo &&
        val.mapNo === props.selectMapNo &&
        val.coordNo === props.selectPointNo
      )
        return true
      return false
    })
    const selJson = selJsons[0]
    // メンバー名取得
    const memberName =
      getMemberNameTextbox(inputLocationNo) !== ''
        ? getMemberNameTextbox(inputLocationNo)
        : t('光の戦士') + inputLocationNo
    // エントリーリストに登録
    const eList = entryList
    eList[inputLocationNo] = {
      memberName: memberName,
      patchNo: selJson.patch,
      mapNo: selJson.mapNo,
      coordNo: selJson.coordNo
    }
    setEntryList([...eList])
    // スナックバー閉じる
    setIsInputLocationSnac(false)
    // 座標選択ナンバー初期化
    setInputLocationNo(0)
    // 座標選択者初期化
    setInputLocationName('')
  }, [props.selectPointNo])

  /**
   * エントリーリスト変更
   * entryList
   */
  useEffect(() => {
    console.debug('useEffect[entryList]')

    for (const [no, entry] of entryList.entries()) {
      if (!entry) continue // データなし

      const selJsons = dataJson.filter((val) => {
        if (
          val.patch === entry.patchNo &&
          val.mapNo === entry.mapNo &&
          val.coordNo === entry.coordNo
        ) {
          return true
        }
        return false
      })

      let mapCoordText = t('未設定')
      if (selJsons.length !== 0) {
        const selJson = selJsons[0]
        switch (i18n.language) {
          case 'ja':
            mapCoordText = `${selJson.mapNameJa}: ${selJson.coordNameJa}`
            break
          case 'na':
            mapCoordText = `${selJson.mapNameNa}: ${selJson.coordNameNa}`
            break
          case 'eu':
            mapCoordText = `${selJson.mapNameEu}: ${selJson.coordNameEu}`
            break
          case 'fr':
            mapCoordText = `${selJson.mapNameFr}: ${selJson.coordNameFr}`
            break
          case 'de':
            mapCoordText = `${selJson.mapNameDe}: ${selJson.coordNameDe}`
            break
          case 'cn':
            mapCoordText = `${selJson.mapNameCn}: ${selJson.coordNameCn}`
            break
          case 'kr':
            mapCoordText = `${selJson.mapNameKr}: ${selJson.coordNameKr}`
            break
          default:
            mapCoordText = `${selJson.mapNameJa}: ${selJson.coordNameJa}`
            break
        }
        mapCoordText +=
          `(${selJson.coordX.toString().replace(/(\d*)(\d)$/gm, '$1.$2')}, ` +
          `${selJson.coordY.toString().replace(/(\d*)(\d)$/gm, '$1.$2')})`
      }
      // 画面に名前表示
      setMemberNameTextbox(no, entry.memberName)
      // 画面に座標表示
      if (no === 1) setMemLocation1(mapCoordText)
      else if (no === 2) setMemLocation2(mapCoordText)
      else if (no === 3) setMemLocation3(mapCoordText)
      else if (no === 4) setMemLocation4(mapCoordText)
      else if (no === 5) setMemLocation5(mapCoordText)
      else if (no === 6) setMemLocation6(mapCoordText)
      else if (no === 7) setMemLocation7(mapCoordText)
      else if (no === 8) setMemLocation8(mapCoordText)
    }
  }, [entryList])

  const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
    setValue(newValue)
  }

  // const handleValueMemberName = (no: number): string => {
  //   return getMemberNameTextbox(no)
  // }

  const getMemberNameTextbox = (no: number): string => {
    if (no === 1) return memName1
    else if (no === 2) return memName2
    else if (no === 3) return memName3
    else if (no === 4) return memName4
    else if (no === 5) return memName5
    else if (no === 6) return memName6
    else if (no === 7) return memName7
    else if (no === 8) return memName8
    return ''
  }

  const handleValueSecondary = (no: number): string => {
    if (no === 1) return memLocation1
    else if (no === 2) return memLocation2
    else if (no === 3) return memLocation3
    else if (no === 4) return memLocation4
    else if (no === 5) return memLocation5
    else if (no === 6) return memLocation6
    else if (no === 7) return memLocation7
    else if (no === 8) return memLocation8
    return '未設定'
  }

  const handleChangeMemberName = (no: number, val: string): void => {
    setMemberNameTextbox(no, val)
  }

  const setMemberNameTextbox = (no: number, val: string): void => {
    if (no === 1) setMemName1(val)
    else if (no === 2) setMemName2(val)
    else if (no === 3) setMemName3(val)
    else if (no === 4) setMemName4(val)
    else if (no === 5) setMemName5(val)
    else if (no === 6) setMemName6(val)
    else if (no === 7) setMemName7(val)
    else if (no === 8) setMemName8(val)
  }

  /**
   * 地図座標追加
   * @param no メンバー№
   */
  const handleAddLocation = (no: number): void => {
    console.debug(no)
    setInputLocationNo(no)
    const name = getMemberNameTextbox(no) === '' ? t('光の戦士') + no : handleValueMemberName(no)
    setInputLocationName(name)
    setIsInputLocationSnac(true)
  }

  const handleCancelAddLocation = (): void => {
    setInputLocationNo(0)
    setInputLocationName('')
    setIsInputLocationSnac(false)
  }

  /**
   * メンバー削除ボタンハンドラ
   * @param no メンバー№
   */
  const handleDeleteMember = (no: number): void => {
    deleteMember(no)
  }

  /**
   * メンバー情報削除
   * @param no メンバー№
   */
  const deleteMember = (no: number): void => {
    const eList = entryList
    eList[no] = {
      memberName: '',
      patchNo: 0,
      mapNo: 0,
      coordNo: 0
    }
    setEntryList([...eList])
  }

  /**
   * エントリーリスト表示
   * @param no メンバー№
   * @returns JSX.Element
   */
  const drawEntryList = (no: number): JSX.Element => {
    return (
      <ListItem key={`member${no}`} disablePadding>
        <ListItemIcon sx={{ p: 0, minWidth: 0 }}>
          <DragIndicatorIcon />
        </ListItemIcon>
        <ListItemText secondary={handleValueSecondary(no)}>
          <TextField
            fullWidth
            variant="standard"
            size="small"
            placeholder={`${t('光の戦士')}${no}`}
            value={getMemberNameTextbox(no)}
            onChange={(e) => handleChangeMemberName(no, e.target.value)}
          />
        </ListItemText>
        <ListItemIcon sx={{ p: 0, minWidth: 0 }}>
          <IconButton size="small" onClick={() => handleAddLocation(no)}>
            <AddLocationAltIcon />
          </IconButton>
        </ListItemIcon>
        <ListItemIcon sx={{ p: 0, minWidth: 0 }}>
          <IconButton size="small" onClick={() => handleDeleteMember(no)}>
            <DeleteIcon />
          </IconButton>
        </ListItemIcon>
      </ListItem>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="チャット一括登録" {...a11yProps(0)} />
          <Tab label="個別手動登録" {...a11yProps(1)} />
          <Tab label="旅程" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <p>
          チャットをコピペして一括で登録します。
          <br />
          (座標以外のモノが含まれていても問題ありません)
        </p>
        <TextField
          id="outlined-textarea"
          label={t('チャット')}
          placeholder="Placeholder"
          rows={15}
          multiline
          fullWidth
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <List>
          {drawEntryList(1)}
          {drawEntryList(2)}
          {drawEntryList(3)}
          {drawEntryList(4)}
          {drawEntryList(5)}
          {drawEntryList(6)}
          {drawEntryList(7)}
          {drawEntryList(8)}
        </List>
        <Snackbar
          open={isInputLocationSnac}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          autoHideDuration={6000}
          message={inputLocationName + ' ' + t('座標選択中...')}
          action={
            <Button color="inherit" size="small" onClick={handleCancelAddLocation}>
              {t('キャンセル')}
            </Button>
          }
          sx={{ bottom: { xs: 90, sm: 0 } }}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  )
}
