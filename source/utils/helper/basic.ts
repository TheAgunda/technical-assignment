
import crypto from 'crypto';
/** Function to parseQuery Params and set default value if not set */
export function parseQueryParam(value: any, defaultValue: number): number {
    if (value !== undefined && value !== '' && !isNaN(value)) {
        return parseInt(value);
    }
    return defaultValue;
}
