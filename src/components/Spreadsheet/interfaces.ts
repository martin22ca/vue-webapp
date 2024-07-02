export interface Column {
    prop: string | { [key: string]: number };
    name: string;
    valType?: string;
    size?: number;
}

export interface RowValue {
    [key: string]: any;
}

export interface Cell {
    v: any;
    s: any | null;
}

export interface CellData {
    [row: number]: {
        [col: number]: Cell;
    };
}
