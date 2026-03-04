export class NearestTime {
  public static getTime(date: Date): Date {
    const newDate = new Date(date);

    const minutes = newDate.getMinutes();
    const roundedMinutes = Math.round(minutes / 15) * 15;

    newDate.setMinutes(roundedMinutes);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);

    return newDate;
  }
}
