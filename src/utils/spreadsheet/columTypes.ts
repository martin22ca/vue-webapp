const UNITID = 'workbook-01'
const SUBUNITID = 'sheet-01'
import { DataValidationType } from "@univerjs/core";
import { FUniver } from "@univerjs/facade";

export const createDropdown = (univerAPI: FUniver, items: Array<String>, rowLength: number, column: number) => {
    // Generate a unique ID for the rule
    const ruleUid = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Convert the items array to a comma-separated string
    const formula = items.join(',') + ',';

    const params = {
        unitId: UNITID,
        subUnitId: SUBUNITID,
        rule: {
            uid: ruleUid,
            type: DataValidationType.LIST,
            formula1: formula,
            allowBlank: true,
            operator: undefined,
            ranges: [{
                startRow: 1,
                endRow: rowLength ,
                startColumn: column,
                endColumn: column,
            }],
        },
    };
    univerAPI.executeCommand('sheet.command.addDataValidation', params)
}

export const createCheckBox = (univerAPI: FUniver, rowLength: number, column: number) => {
    const ruleUid = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const params = {
        unitId: UNITID,
        subUnitId: SUBUNITID,
        rule: {
            uid: ruleUid,
            type: DataValidationType.CHECKBOX,
            ranges: [{
                startRow: 1,
                endRow: rowLength,
                startColumn: column,
                endColumn: column,
            }],
        },
    }
    univerAPI.executeCommand('sheet.command.addDataValidation', params)
}