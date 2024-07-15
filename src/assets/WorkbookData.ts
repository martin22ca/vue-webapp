/**
 * Copyright 2023-present DreamNum Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
    BooleanNumber,
    LocaleType,
    SheetTypes
} from '@univerjs/core';

/**
 * Default workbook data
 * @type {IWorkbookData} document see https://univer.work/api/core/interfaces/IWorkbookData.html
 */
export var WORKBOOK_DATA = {
    id: 'workbook-01',
    locale: LocaleType.EN_US,
    name: 'universheet',
    sheetOrder: ['sheet-01'],
    appVersion: '3.0.0-alpha',
    styles: {
        'header': {
            "ht": 2,
            "bg": {
                "rgb": "#A2B3F6"
            },
            "bd": {
                "t": {
                    "s": 4,
                    "cl": {
                        "rgb": "#000000"
                    }
                },
                "b": {
                    "s": 4,
                    "cl": {
                        "rgb": "#000000"
                    }
                },
                "l": {
                    "s": 4,
                    "cl": {
                        "rgb": "#000000"
                    }
                },
                "r": {
                    "s": 4,
                    "cl": {
                        "rgb": "#000000"
                    }
                }
            },
            "bl": 1
        }, 'cell': {
            "bg": {
                "rgb": "#eeeeee"
            },
            'ht':3,
            'tb':3,
            "bd": {
                "t": {
                    "s": 2,
                    "cl": {
                        "rgb": "#000000"
                    }
                },
                "b": {
                    "s": 2,
                    "cl": {
                        "rgb": "#000000"
                    }
                },
                "l": {
                    "s": 2,
                    "cl": {
                        "rgb": "#000000"
                    }
                },
                "r": {
                    "s": 2,
                    "cl": {
                        "rgb": "#000000"
                    }
                }
            }
        }, 'cellLock': {
            "bg": {
                "rgb": "#CCCCCC"
            },
            'ht':3,
            'tb':3,
            "bd": {
                "t": {
                    "s": 2,
                    "cl": {
                        "rgb": "#000000"
                    }
                },
                "b": {
                    "s": 2,
                    "cl": {
                        "rgb": "#000000"
                    }
                },
                "l": {
                    "s": 2,
                    "cl": {
                        "rgb": "#000000"
                    }
                },
                "r": {
                    "s": 2,
                    "cl": {
                        "rgb": "#000000"
                    }
                }
            }
        }
        
    },
    sheets: {
        'sheet-01': {
            type: SheetTypes.GRID,
            id: 'sheet-01',
            cellData: {},
            name: 'Table',
            hidden: BooleanNumber.FALSE,
            rowCount: 20000,
            columnCount: 20,
            defaultRowHeight: 27,
        },
        'sheet-02': {
            type: SheetTypes.GRID,
            id: 'sheet-02',
            cellData: {},
            name: 'sheet_2',
            hidden: BooleanNumber.FALSE,
            rowCount: 100,
            columnCount: 20,
            defaultRowHeight: 27,
        },
    },

};