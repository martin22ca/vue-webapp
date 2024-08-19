import { FUniver, FWorksheet } from "@univerjs/facade";
import { ICellData, cellToRange, ICommandInfo } from '@univerjs/core'
import { WORKBOOK_DATA } from '@/assets/WorkbookData'


export const getRow = (activeSheet: FWorksheet, row: number, colsReference: Object) => {
    var rowObj = {}
    const width = Object.keys(colsReference).length / 2
    activeSheet.getRange(row, 0, 1, width).forEach((row: number, col: number, cell: ICellData) => {
        rowObj[colsReference[col]] = cell.v
    })
    return rowObj
}


export const insertRow = (activeSheet: FWorksheet, row: number, rowObj: Object, colsReference: Object, headers: Array<Object> | null) => {
    console.log(rowObj)
    const width = Object.keys(colsReference).length / 2
    let arrObj = new Array(width)
    const range = activeSheet.getRange(row, 0, 1, width)
    if (headers == null) {
        range.forEach((row: number, col: number, cell: ICellData) => {
            cell.v = rowObj[colsReference[col]]
            cell.s = WORKBOOK_DATA.styles.cell
            arrObj[col] = cell
        })
        range.setValues([arrObj])
    } else {
        range.forEach((row: number, col: number, cell: ICellData) => {
            const header = headers.find((element) => element['prop'] == colsReference[col]);
            cell.v = rowObj[colsReference[col]]
            cell.s = header['readonly'] ? WORKBOOK_DATA.styles.cellLock : WORKBOOK_DATA.styles.cell
            arrObj[col] = cell
        })
        range.setValues([arrObj])
    }

}

export const removeRow = (activeSheet: FWorksheet, row: number, colsReference: Object) => {
    const width = Object.keys(colsReference).length / 2
    let arrObj = new Array(width).fill(null)
    const range = activeSheet.getRange(row, 0, 1, width)
    range.setValues([arrObj])
}


export const logChanges = (univerAPI: FUniver, modifiedItems: Object,) => {
    const activeSheet = univerAPI.getActiveWorkbook().getActiveSheet()
    var row = null
    var col = null
    var preVal = null

    univerAPI.onCommandExecuted((command) => {
        if (command.id === 'sheet.operation.set-cell-edit-visible' && command.params.visible) {
            row = activeSheet.getSelection().getActiveRange().getCell().actualRow
            col = activeSheet.getSelection().getActiveRange().getCell().actualColumn
            preVal = activeSheet.getSelection().getActiveRange().getCellData()
        }
    })
    univerAPI.onCommandExecuted(async (command: ICommandInfo) => {
        if (command.id === 'sheet.operation.set-cell-edit-visible' && !command.params.visible) {
            const cell = activeSheet.getRange(row, col, 1, 1).getCellData()
            const Nrow = activeSheet.getSelection().getActiveRange().getCell().actualRow - 1
            const Ncol = activeSheet.getSelection().getActiveRange().getCell().actualColumn
        }
    })
}

export const isEmpty = (obj: Object) => {
    return Object.keys(obj).length === 0;
}

