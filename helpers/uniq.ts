/**
 * Removes duplicates from an array extremely quickly!
 */
export default function uniq(arr: string[]) {
    const seen: {
        [key: string]: 1;
    } = {};
    const result = [];
    const len = arr.length;
    let j = 0;

    for (let i = 0; i < len; i++) {
        const item = arr[i];

        if (seen[item] !== 1) {
            seen[item] = 1;
            result[j++] = item;
        }
    }

    return result;
}
