const cycleTypeEnum = Object.freeze({
  day: 0,
  week: 1,
  month: 2,
  year: 3,
});

const dayOfWeekEnum = Object.freeze({
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
});

class RepeatSchedule {
  constructor(time, cycle, cycleType, dayOfWeek) {
    this.time = time || new Date().now();
    this.cycle = cycle || 1;
    this.cycleType = cycleType || cycleTypeEnum.week;
    this.dayOfWeek = dayOfWeek || 'NULL';
  }
}

const repeatScheduleToCron = (repeatSchedule) => {
  let cron = `0 ${repeatSchedule.time.getMinutes()} ${repeatSchedule.time.getHours()} `;

  if (repeatSchedule.cycleType === cycleTypeEnum.day) {
    cron += '* * *';
    return cron;
  }
  if (repeatSchedule.cycleType === cycleTypeEnum.week) {
    cron += '* * ';
    repeatSchedule.dayOfWeek.forEach((element) => {
      cron = `${cron + element},`;
    });
    cron = cron.slice(0, -1);
    return cron;
  }
  if (repeatSchedule.cycleType === cycleTypeEnum.month) {
    cron = `${cron + repeatSchedule.time.getDate()} * *`;
    return cron;
  }
  if (repeatSchedule.cycleType === cycleTypeEnum.year) {
    cron = `${
      cron + repeatSchedule.time.getDate()
    } ${repeatSchedule.time.getMonth()} *`;
    return cron;
  }
  return false;
};

module.exports = {
  RepeatSchedule,
  cycleTypeEnum,
  dayOfWeekEnum,
  repeatScheduleToCron,
};
