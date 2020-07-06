type DataStr = string | undefined | null;

class DateUtils {
  /**
   * 格式化时间
   * @param {*} dateStr
   */
  static formate(dateStr: DataStr) {
    if (!dateStr) {
      return '';
    }
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    // const milliseconds = date.getMilliseconds()

    return (
      `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')} ` +
      `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    );
  }

  /**
   *
   */
  static diff(startDateStr: DataStr, endDateStr: DataStr, unitOfTime = 'days') {
    if (!startDateStr || !endDateStr) {
      return '';
    }
    const startTime = Date.parse(new Date(startDateStr).toUTCString());
    const endTime = Date.parse(new Date(endDateStr).toUTCString());
    const diffTime = endTime - startTime;
    switch (unitOfTime) {
      case 'seconds':
        return diffTime / 1000;
      case 'minutes':
        return diffTime / 1000 / 60;
      case 'hours':
        return diffTime / 1000 / 60 / 60;
      default:
        return diffTime / 1000 / 60 / 60 / 24;
    }
  }

  static formateChatTime(dateStr: DataStr) {
    if (!dateStr) {
      return;
    }
    const now = new Date(); // 当前日前对象
    const nowYear = now.getFullYear(); // 当前年份
    const nowWeekDay = now.getDay(); // 当前星期

    const target = new Date(dateStr); // 目标日期对象
    const targetYear = target.getFullYear(); // 目标年份
    const targetMonth = target.getMonth() + 1; // 目标月份
    const targetDay = target.getDate(); // 目标日期
    const targetWeekDay = target.getDay(); // 目标星期
    const targetHours = target.getHours(); // 目标时
    const targetMinutes = String(target.getMinutes()).padStart(2, '0'); // 目标分

    const delay = Math.round((Date.parse(now.toUTCString()) - Date.parse(target.toUTCString())) / 1000 / 3600 / 24); // 时间差
    // 时间在一天之内只返回时分
    if (delay === 0) {
      return `${targetHours}:${targetMinutes}`;
    }
    // 时间在两天之内的
    if (delay === 1) {
      return `'昨天 ${targetHours}:${targetMinutes}`;
    }

    // 当前星期内
    if (delay > 1 && nowWeekDay > targetWeekDay && delay < 7) {
      let week = '';
      switch (targetWeekDay) {
        case 0:
          week = '星期日';
          break;
        case 1:
          week = '星期一';
          break;
        case 2:
          week = '星期二';
          break;
        case 3:
          week = '星期三';
          break;
        case 4:
          week = '星期四';
          break;
        case 5:
          week = '星期五';
          break;
        case 6:
          week = '星期六';
          break;
        default:
          break;
      }
      return `${week} ${targetHours}:${targetMinutes}`;
    }

    if (delay > 1 && nowWeekDay === targetWeekDay && targetYear === nowYear) {
      return `${targetMonth}/${targetDay} ${targetHours}:${targetMinutes}`;
    }

    if (delay > 1 && nowWeekDay === targetWeekDay && targetYear < nowYear) {
      return `${targetYear}/${targetMinutes}/${targetDay} ${targetHours}:${targetMinutes}`;
    }

    if (delay > 1 && nowWeekDay < targetWeekDay && targetYear === nowYear) {
      return `${targetMonth}/${targetDay} ${targetHours}:${targetMinutes}`;
    }

    if (delay > 1 && nowWeekDay > targetWeekDay && targetYear === nowYear && delay > 7) {
      return `${targetMonth}/${targetDay} ${targetHours}:${targetMinutes}`;
    }

    if (delay > 1 && nowWeekDay > targetWeekDay && delay >= 7 && targetYear < nowYear) {
      return `${targetYear}/${targetMinutes}/${targetDay} ${targetHours}:${targetMinutes}`;
    }

    if (delay > 1 && nowWeekDay < targetWeekDay && targetYear < nowYear) {
      return `${targetYear}/${targetMonth}/${targetDay} ${targetHours}:${targetMinutes}`;
    }
    return undefined;
  }

  static formateLogTime(dateStr: DataStr) {
    if (!dateStr) {
      return '';
    }
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return (
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ` +
      `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    );
  }
}

export default DateUtils;
