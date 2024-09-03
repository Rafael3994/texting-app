export const isNotFound = (item): boolean => {
    if (!item || item === null || item.length <= 0) return true;
    return false;
}