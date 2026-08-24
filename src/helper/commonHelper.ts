import crypto from 'crypto';

export function hashedRefreshToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

export function getDevice(userAgent = "") {
    if (/Edg/i.test(userAgent)) {
        return "Edge";
    }

    if (/Chrome/i.test(userAgent)) {
        return "Chrome";
    }

    if (/Mobile/i.test(userAgent)) {
        return "Mobile";
    }

    return "Unknown";
}