/**
 * This is a Date (utility) provider
 * with functions that are global to the app.
 */
export default class DateService {
  constructor() { 
    this.today = new Date();//get today, returns a date object
    this.current_hour = this.today.getHours();//get current hour
    this.yesterday = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()-1);//get yesterday date
  }

  /**
  * Check if date (timestamp) is today
  */
  checkIfToday(timestamp) {
    let other_date = new Date(timestamp);
    if (this.today.toDateString() == other_date.toDateString()) {
      return true;
    } else {
      return false;
    }
  }

  /**
  * Check if date (timestamp) is yesterday
  */
  checkIfYesterday(timestamp) {
    let other_date = new Date(timestamp);
    if ((this.today.getDate() - 1) == other_date.getDate()) {
      return true;
    } else {
      return false;
    }
  }

  /**
  * Check if date (timestamp) is last week
  */
  checkIfLastWeek(timestamp) {
    let today = this.today;
    let first_of_year_today = new Date(today.getFullYear(), 0, 1);
    let first_of_year_today_day = first_of_year_today.getDay();
    let today_week = Math.ceil( (((today - first_of_year_today.valueOf()) / 86400000) + first_of_year_today_day + 1) / 7 );

    let other_date = new Date(timestamp);
    let first_of_year_other_date = new Date(other_date.getFullYear(), 0, 1);
    let first_of_year_other_date_day = first_of_year_other_date.getDay();
    let other_date_week = Math.ceil( (((other_date.valueOf() - first_of_year_other_date.valueOf()) / 86400000) + first_of_year_other_date_day + 1) / 7 );

    let diff_week = (today_week - other_date_week);

    if (diff_week == 1 && this.checkIfWithinYear(timestamp)) {
      return true;
    } else {
      return false;
    }
  }

  /**
  * Format date by timestamp
  */
  formatDate(timestamp, type) {
    let other_date = new Date(timestamp);
    let day_of_month = other_date.getDate();
    let month = other_date.getMonth() + 1;
    let today_month = this.today.getMonth() + 1;
    let year = other_date.getFullYear();
    let today_year= this.today.getFullYear();
    let hour = other_date.getHours();
    let minutes = other_date.getMinutes();
    let diff_millisecs = this.today.getTime() - other_date.getTime();
    let diff_secs = Math.round(diff_millisecs / 1000);
    let diff_mins = Math.round(diff_secs / 60);
    let diff_hour = Math.round(diff_mins / 60);
    let diff_months = today_month - month;
    let diff_years = today_year - year;

    if (type == 'day') {
      if (this.checkIfToday(timestamp)) {
        return 'Today';
      } else if (this.checkIfYesterday(timestamp)) {
        return 'Yesterday';
      } else if (this.checkIfLastWeek(timestamp)) {
        return 'Last week';
      } else {
        return 'Future date';
      }
    } else {
      // formatting
      let year_string = year.toString().slice(-2);
      let month_string = month < 10 ? '0' + month : month;
      let day_of_month_string = day_of_month < 10 ? '0' + day_of_month : day_of_month;

      if (diff_secs < 1) {
        return 'right now';
      } else if (diff_mins < 1) {
        return `${diff_secs} sec. ago`;
      } else if (diff_hour < 1) {
        return `${diff_mins} min. ago`;
      } else {
        return `${day_of_month_string}.${month_string}.${year_string} ${hour}:${minutes}`;
      }      
    }
  }
}
