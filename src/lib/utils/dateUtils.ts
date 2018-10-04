import * as moment from "moment"

export interface WeekRange {
  start: Date
  end: Date
}

export const getFirstDateOfWeekForDate = (input: Date): Date => {
  return moment(input)
    .utc()
    .startOf("isoWeek")
    .toDate()
}

export const weekRangeFor = (input: Date): WeekRange => {
  return {
    start: moment(input)
      .utc()
      .startOf("isoWeek")
      .utc()
      .toDate(),
    end: moment(input)
      .utc()
      .endOf("isoWeek")
      .utc()
      .toDate(),
  }
}

export const earliestDateIn = (dates: Date[]): Date | undefined => {
  if (dates.length === 0) {
    return undefined
  }
  return dates.reduce((previousDate, nextDate) => {
    return moment(previousDate).isBefore(moment(nextDate)) ? previousDate : nextDate
  }, dates[0])
}
