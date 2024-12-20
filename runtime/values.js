"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MK_NULL = MK_NULL;
exports.MK_NUMBER = MK_NUMBER;
exports.MK_BOOL = MK_BOOL;
function MK_NULL() {
    return { type: "null", value: null };
}
function MK_NUMBER(n) {
    if (n === void 0) { n = 0; }
    return { type: "number", value: n };
}
function MK_BOOL(n) {
    if (n === void 0) { n = false; }
    return { type: "boolean", value: n };
}
