export const chinaDateToDatetime = (chinaDate) => {
    const d = new Date(chinaDate.toString());
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
}
export const scheduleTime = (chinaDate) => {
    const d = new Date(chinaDate.toString());
    return {
        month: d.getMonth() + 1,
        day: d.getDate()
    }
}