export class FormatDate {
  date: Date;
  formattedDate: string;

  constructor(date: Date, showTime?: boolean) {
    this.date = date;
    this.formattedDate = this.formatDate(date, showTime);
  }

  private formatDate(date: Date, showTime?: boolean): string {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedDay = day < 10 ? `0${day}` : day.toString();
    const formattedMonth = month < 10 ? `0${month}` : month.toString();

    const formattedHours = hours < 10 ? `0${hours}` : hours.toString();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();

    if (showTime) {
      return `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}`;
    }
    else {
      return `${formattedDay}/${formattedMonth}/${year}`;
    }
  }
}
