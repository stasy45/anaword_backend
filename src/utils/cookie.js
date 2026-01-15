"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignedUserId = verifySignedUserId;
const crypto = require("crypto");
const env_1 = require("../../env");
function verifySignedUserId(signedCookie) {
    if (!signedCookie) {
        return null;
    }
    const [idPart, signature] = signedCookie.split('.');
    if (!idPart || !signature || signature.length !== 64) {
        return null;
    }
    if (!/^\d+$/.test(idPart)) {
        return null;
    }
    const expectedSignature = crypto
        .createHmac('sha256', env_1.COOKIE_SECRET)
        .update(idPart)
        .digest('hex');
    const safeEqual = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    return safeEqual ? parseInt(idPart, 10) : null;
}
//# sourceMappingURL=cookie.js.map