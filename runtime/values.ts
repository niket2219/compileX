export type ValueType = "null" | "number" | "boolean"

export interface RuntimeVal {
    type : ValueType
}

export interface NullVal extends RuntimeVal {
    type: "null",
    value : null
}

export function MK_NULL() {
    return { type: "null", value: null } as NullVal;
}

export interface NumberVal extends RuntimeVal {
    type: "number",
    value : number
}

export function MK_NUMBER(n = 0) {
    return { type: "number", value: n } as NumberVal;
}

export interface BooleanVal extends RuntimeVal {
    type: "boolean",
    value : boolean
}

export function MK_BOOL(n = false) {
    return { type: "boolean", value: n } as BooleanVal;
}