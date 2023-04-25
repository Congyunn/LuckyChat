export const chinaDateToDatetime = (chinaDate) => {
    const d = new Date(chinaDate?.toString());
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
export const scheduleTime = (chinaDate) => {
    const d = new Date(chinaDate.toString());
    return {
        month: d.getMonth() + 1,
        day: d.getDate()
    }
}