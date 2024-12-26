
export function newQuery(query: string, filters: any[]): string {
    const now = new Date();
    const hours = now.getHours();
    const min = now.getMinutes();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth(); 
    const currentYear = now.getFullYear(); 

  const noFilterComparatorFn = (filter: any): string => {
    return "";
  };

  const lastDayComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(DAY, -1, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(HOUR, ${-hours}, CURRENT_TIMESTAMP)`;
  };

  const lastWeekComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(WEEK, -1, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(HOUR, ${-hours}, CURRENT_TIMESTAMP)`;
  };

  const lastMonthComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(MONTH, -1, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(HOUR, ${-hours}, CURRENT_TIMESTAMP)`;
  };

  const lastQuarterComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(QUARTER, -1, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(HOUR, ${-hours}, CURRENT_TIMESTAMP)`;
  };

  const lastYearComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(YEAR, -1, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(HOUR, ${-hours}, CURRENT_TIMESTAMP)`;
  };

  const previousCalenderWeekComparatorFn = (filter: any): string => {
    const currentDay = now.getDay();

    let daysToSubtractStart = 0;
    let daysToSubtractEnd = 0;
  
    switch (currentDay) {
      case 0: 
        daysToSubtractStart = 7 + 6; 
        daysToSubtractEnd = 6;       
        break;
      case 1:
        daysToSubtractStart = 7; 
        daysToSubtractEnd = 0;  
        break;
      case 2:
        daysToSubtractStart = 8; 
        daysToSubtractEnd = 1;   
        break;
      case 3: 
        daysToSubtractStart = 9; 
        daysToSubtractEnd = 2;   
        break;
      case 4: 
        daysToSubtractStart = 10; 
        daysToSubtractEnd = 3;    
        break;
      case 5: 
        daysToSubtractStart = 11;
        daysToSubtractEnd = 4;    
        break;
      case 6:
        daysToSubtractStart = 12; 
        daysToSubtractEnd = 5;    
        break;
      default:
        throw new Error("Invalid day of the week");
    }
  
    const subject = filter.subject;
    const startOfWeek = `TIMESTAMPADD(DAY, -${daysToSubtractStart}, CURRENT_TIMESTAMP)`;
    const endOfWeek = `TIMESTAMPADD(DAY, -${daysToSubtractEnd}, CURRENT_TIMESTAMP)`;
  
    return `${subject} >= ${startOfWeek} AND ${subject} < ${endOfWeek}`;
  };
  
  const previousCalenderMonthComparatorFn  = (filter: any): string => {
    const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfPreviousMonth = new Date(firstDayOfThisMonth.getTime() - 1);
    const noOfDaysInLastMonth = lastDayOfPreviousMonth.getDate();
    const currentDay = now.getDate();
    return `${filter.subject} >= TIMESTAMPADD(DAY, ${- noOfDaysInLastMonth - currentDay + 1 }, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(DAY, ${- currentDay + 1}, CURRENT_TIMESTAMP)`;
  }

  const previousCalenderYearComparatorFn = (filter: any): string => {
    const firstDayOfThisYear = new Date(now.getFullYear(), 0, 1);
    const lastDayOfPreviousYear = new Date(firstDayOfThisYear.getTime() - 1);
    const firstDayOfPreviousYear = new Date(lastDayOfPreviousYear.getFullYear(), 0, 1);

    return `${filter.subject} >= TIMESTAMPADD(DAY, ${Math.floor(
      (firstDayOfPreviousYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) + 1
    )}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(DAY, ${Math.floor(
      (firstDayOfThisYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) + 1
    )}, CURRENT_TIMESTAMP)`;
  };

  const currentDayComparatorFn = (filter: any): string => {
    const remainingHr = 24 - hours;
    return `${filter.subject} >= TIMESTAMPADD(HOUR, ${-hours}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(HOUR, ${remainingHr}, CURRENT_TIMESTAMP)`;
  }

  const currentWeekComparatorFn = (filter: any): string => {
    const daysCompleted = now.getDay() - 1;
    const daysLeft = 8 - now.getDay();
    if(now.getDay() === 1){
      return `${filter.subject} >= TIMESTAMPADD(HOUR, ${-hours}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(DAY, ${7}, CURRENT_TIMESTAMP)`;
    }
    if(now.getDay() === 0){
      return `${filter.subject} >= TIMESTAMPADD(DAY, ${-6}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(HOUR, ${24 - hours}, CURRENT_TIMESTAMP)`;
    }
    return `${filter.subject} >= TIMESTAMPADD(DAY, ${-daysCompleted}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(DAY, ${daysLeft}, CURRENT_TIMESTAMP)`;
  }

  const currentMonthComparatorFn = (filter: any): string => {

    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const remainingDays = totalDaysInMonth - currentDay; 
    const remainingHours = 24 - now.getHours(); 
    const elapsedDays = currentDay - 1; 
  
    if (currentDay === 1) {
      return `${filter.subject} >= TIMESTAMPADD(HOUR, ${-hours}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(DAY, ${remainingDays + 1}, CURRENT_TIMESTAMP)`;
    }
  
    if (currentDay === totalDaysInMonth) {
      return `${filter.subject} >= TIMESTAMPADD(DAY, ${-elapsedDays}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(HOUR, ${remainingHours}, CURRENT_TIMESTAMP)`;
    }
  
    return `${filter.subject} >= TIMESTAMPADD(DAY, ${-elapsedDays}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(DAY, ${remainingDays + 1}, CURRENT_TIMESTAMP)`;
  };
  
  const currentQuarterComparatorFn = (filter: any): string => {
  
    const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
    const quarterEndMonth = quarterStartMonth + 3; 
  
    const quarterStartDate = new Date(currentYear, quarterStartMonth, 1); 
    const quarterEndDate = new Date(currentYear, quarterEndMonth, 1); 
  
    const currentDayOfQuarter = Math.floor(
      (now.getTime() - quarterStartDate.getTime()) / (1000 * 60 * 60 * 24)
    ); 
    const totalDaysInQuarter = Math.floor(
      (quarterEndDate.getTime() - quarterStartDate.getTime()) / (1000 * 60 * 60 * 24)
    ); 
  
    const remainingDays = totalDaysInQuarter - currentDayOfQuarter;
    const remainingHours = 24 - now.getHours();
  
    if (currentDayOfQuarter === 0) {
      return `${filter.subject} >= TIMESTAMPADD(HOUR, ${-hours}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(DAY, ${remainingDays}, CURRENT_TIMESTAMP)`;
    }
  
    if (currentDayOfQuarter === totalDaysInQuarter - 1) {
      return `${filter.subject} >= TIMESTAMPADD(DAY, ${-currentDayOfQuarter}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(HOUR, ${remainingHours}, CURRENT_TIMESTAMP)`;
    }
  
    return `${filter.subject} >= TIMESTAMPADD(DAY, ${-currentDayOfQuarter}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(DAY, ${remainingDays}, CURRENT_TIMESTAMP)`;
  };

  const currentYearComparatorFn = (filter: any): string => {

    const yearStartDate = new Date(currentYear, 0, 1); 
    const nextYearStartDate = new Date(currentYear + 1, 0, 1); 
  
    const currentDayOfYear = Math.floor(
      (now.getTime() - yearStartDate.getTime()) / (1000 * 60 * 60 * 24)
    ); 
    const totalDaysInYear = Math.floor(
      (nextYearStartDate.getTime() - yearStartDate.getTime()) / (1000 * 60 * 60 * 24)
    ); 

    const remainingDays = totalDaysInYear - currentDayOfYear; 
    const remainingHours = 24 - now.getHours(); 
  
    if (currentDayOfYear === 0) {
      return `${filter.subject} >= TIMESTAMPADD(HOUR, ${-hours}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(DAY, ${remainingDays}, CURRENT_TIMESTAMP)`;
    }
  
    if (currentDayOfYear === totalDaysInYear - 1) {
      return `${filter.subject} >= TIMESTAMPADD(DAY, ${-currentDayOfYear}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(HOUR, ${remainingHours}, CURRENT_TIMESTAMP)`;
    }
  
    return `${filter.subject} >= TIMESTAMPADD(DAY, ${-currentDayOfYear}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(DAY, ${remainingDays}, CURRENT_TIMESTAMP)`;
  };
  
  const currentTimeComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(HOUR, ${0}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(HOUR, ${0}, CURRENT_TIMESTAMP)`;
  }

  const currentTimeToRelativeComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;
    
    const match = comparator.match(/DATEADD\(DATETIME\("now"\), (\d+), (\w+)\)/);
    if (!match) {
      throw new Error("Invalid comparator format for DATEADD");
    }
  
    const value = parseInt(match[1], 10);
    const operation = match[2];
  
    const operationMap: Record<string, string> = {
      second: "SECOND",
      minute: "MINUTE",
      hour: "HOUR",
      day: "DAY",
      week: "WEEK",
      month: "MONTH",
      quarter: "QUARTER",
      year: "YEAR",
    };
  
    const sqlOperation = operationMap[operation];
    if (!sqlOperation) {
      throw new Error(`Unsupported operation: ${operation}`);
    }

    return `${filter.subject} >= TIMESTAMPADD(HOUR, ${0}, CURRENT_TIMESTAMP) AND ${filter.subject} <= TIMESTAMPADD(${sqlOperation}, ${value}, CURRENT_TIMESTAMP)`;
  };
  
  const currentTimeToSpecificDateComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;
  
    const match = comparator.match(/now : (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    if (!match) {
      throw new Error("Invalid comparator format for specific date-time");
    }
  
    const dateTime = match[1];
  
    const sqlDateTime = dateTime.replace("T", " ");
  
    return `${filter.subject} >= TIMESTAMPADD(HOUR, 0, CURRENT_TIMESTAMP) AND ${filter.subject} < TO_TIMESTAMP('${sqlDateTime}.000000', 'YYYY-MM-DD HH24:MI:SS.US')`;
  };
  
  const todayComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(DAY, 0, CURRENT_TIMESTAMP) AND ${filter.subject} <= TIMESTAMPADD(DAY, 0, CURRENT_TIMESTAMP)`;
  }

  const todayTillNowComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(HOUR, ${-hours}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(SECOND, 0, CURRENT_TIMESTAMP)`;
  }

  const midnightTimeToRelativeDateComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;
    
    const match = comparator.match(/DATEADD\(DATETIME\("today"\), (\d+), (\w+)\)/);
    if (!match) {
      throw new Error("Invalid comparator format for DATEADD");
    }
  
    const value = parseInt(match[1], 10);
    const operation = match[2];
  
    const operationMap: Record<string, string> = {
      second: "SECOND",
      minute: "MINUTE",
      hour: "HOUR",
      day: "DAY",
      week: "WEEK",
      month: "MONTH",
      quarter: "QUARTER",
      year: "YEAR",
    };
  
    const sqlOperation = operationMap[operation];
    if (!sqlOperation) {
      throw new Error(`Unsupported operation: ${operation}`);
    }

    return `${filter.subject} >= TIMESTAMPADD(HOUR, ${-hours}, CURRENT_TIMESTAMP) AND ${filter.subject} <= TIMESTAMPADD(${sqlOperation}, ${value}, CURRENT_TIMESTAMP)`;
  };

  const midnightTimeToSpecificDateComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;
  
    const match = comparator.match(/today : (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    if (!match) {
      throw new Error("Invalid comparator format for specific date-time");
    }
  
    const dateTime = match[1];
  
    const sqlDateTime = dateTime.replace("T", " ");
  
    return `${filter.subject} >= TIMESTAMPADD(HOUR, ${-hours}, CURRENT_TIMESTAMP) AND ${filter.subject} < TO_TIMESTAMP('${sqlDateTime}.000000', 'YYYY-MM-DD HH24:MI:SS.US')`;
  };

  const relativeToNowComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;
  
    const match = comparator.match(/DATEADD\(DATETIME\("now"\), (-?\d+), (\w+)\)/);
  
    if (!match) {
      throw new Error("Invalid comparator format for DATEADD");
    }
  
    const value = parseInt(match[1], 10); 
    const unit = match[2];  
  
    const unitMap: { [key: string]: string } = {
      "second": "SECOND",
      "minute": "MINUTE",
      "hour": "HOUR",
      "day": "DAY",
      "week": "WEEK",
      "month": "MONTH",
      "quarter": "QUARTER",
      "year": "YEAR"
    };
  
    if (!unitMap[unit]) {
      throw new Error(`Unsupported time unit: ${unit}`);
    }
  
    return `${filter.subject} >= TIMESTAMPADD(${unitMap[unit]}, ${value}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(SECOND, ${0}, CURRENT_TIMESTAMP)`;
  };

  const relativeToMidnightComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;
  
    const match = comparator.match(/DATEADD\(DATETIME\("today"\), (-?\d+), (\w+)\)/);
  
    if (!match) {
      throw new Error("Invalid comparator format for DATEADD");
    }
  
    const value = parseInt(match[1], 10); 
    const unit = match[2];  
  
    const unitMap: { [key: string]: string } = {
      "second": "SECOND",
      "minute": "MINUTE",
      "hour": "HOUR",
      "day": "DAY",
      "week": "WEEK",
      "month": "MONTH",
      "quarter": "QUARTER",
      "year": "YEAR"
    };
  
    if (!unitMap[unit]) {
      throw new Error(`Unsupported time unit: ${unit}`);
    }
  
    return `${filter.subject} >= TIMESTAMPADD(${unitMap[unit]}, ${value}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(HOUR, ${-hours}, CURRENT_TIMESTAMP)`;
  };
  
  const relativeToRelativeComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;

    const match1 = comparator.match(/DATEADD\(DATETIME\("now"\), (-?\d+), (\w+)\)/);
    const match2 = comparator.match(/DATEADD\(DATETIME\("now"\), (\d+), (\w+)\)/);
  
    if (match1 && match2) {
      const value1 = parseInt(match1[1]);
      const unit1 = match1[2];
      const value2 = parseInt(match2[1]);
      const unit2 = match2[2];
      
      const unitMap: { [key: string]: string } = {
        "second": "SECOND",
        "minute": "MINUTE",
        "hour": "HOUR",
        "day": "DAY",
        "week": "WEEK",
        "month": "MONTH",
        "quarter": "QUARTER",
        "year": "YEAR"
      };
      
      if (unitMap[unit1] && unitMap[unit2]) {
        return `${filter.subject} >= TIMESTAMPADD(${unitMap[unit1]}, ${value1}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(${unitMap[unit2]}, ${value2}, CURRENT_TIMESTAMP)`;
      } else {
        throw new Error("Invalid unit in DATEADD expression");
      }
    } else {
      throw new Error("Invalid DATEADD expressions in comparator");
    }
  };

  const relativeToSpecificComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;

    const match = comparator.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    if (!match) {
      throw new Error("Invalid comparator format for specific date-time");
    }
  
    const dateTime = match[1];
  
    const sqlDateTime = dateTime.replace("T", " ");
  
    const match1 = comparator.match(/DATEADD\(DATETIME\("([^"]+)"\), (-?\d+), (\w+)\)/);
  
    if (!match1) {
      throw new Error("Invalid comparator format for DATEADD");
    }
  
    const value = parseInt(match1[2], 10); 
    const unit = match1[3]; 
  
    const unitMap: { [key: string]: string } = {
      "second": "SECOND",
      "minute": "MINUTE",
      "hour": "HOUR",
      "day": "DAY",
      "week": "WEEK",
      "month": "MONTH",
      "quarter": "QUARTER",
      "year": "YEAR"
    };
  
    if (!unitMap[unit]) {
      throw new Error(`Unsupported time unit: ${unit}`);
    }
    
    return `${filter.subject} >= TIMESTAMPADD(${unitMap[unit]}, ${value}, CURRENT_TIMESTAMP) AND ${filter.subject} < TO_TIMESTAMP('${sqlDateTime}.000000', 'YYYY-MM-DD HH24:MI:SS.US')`;
  };
  
  const specificToMidnightComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;

    const match = comparator.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    if (!match) {
      throw new Error("Invalid comparator format for specific date-time");
    }
    
    const dateTime = match[1];
  
    const sqlDateTime = dateTime.replace("T", " ");
    
    return `${filter.subject} >= TO_TIMESTAMP('${sqlDateTime}.000000', 'YYYY-MM-DD HH24:MI:SS.US') AND ${filter.subject} < TIMESTAMPADD(HOUR, ${-hours}, CURRENT_TIMESTAMP)`;
  };

  const specificToNowComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;

    const match = comparator.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    if (!match) {
      throw new Error("Invalid comparator format for specific date-time");
    }
    
    const dateTime = match[1];
  
    const sqlDateTime = dateTime.replace("T", " ");
    
    return `${filter.subject} >= TO_TIMESTAMP('${sqlDateTime}.000000', 'YYYY-MM-DD HH24:MI:SS.US') AND ${filter.subject} < TIMESTAMPADD(SECOND, ${0}, CURRENT_TIMESTAMP)`;
  };

  const specificToRelativeComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;

    const match = comparator.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    if (!match) {
      throw new Error("Invalid comparator format for specific date-time");
    }
    const dateTime = match[1];
    const sqlDateTime = dateTime.replace("T", " ");
    const match1 = comparator.match(/DATEADD\(DATETIME\("([^"]+)"\), (-?\d+), (\w+)\)/);
  
    if (!match1) {
      throw new Error("Invalid comparator format for DATEADD");
    }
  
    const value = parseInt(match1[2], 10); 
    const unit = match1[3]; 
    const unitMap: { [key: string]: string } = {
      "second": "SECOND",
      "minute": "MINUTE",
      "hour": "HOUR",
      "day": "DAY",
      "week": "WEEK",
      "month": "MONTH",
      "quarter": "QUARTER",
      "year": "YEAR"
    };
  
    if (!unitMap[unit]) {
      throw new Error(`Unsupported time unit: ${unit}`);
    }
    
    return `${filter.subject} >= TO_TIMESTAMP('${sqlDateTime}.000000', 'YYYY-MM-DD HH24:MI:SS.US')  AND ${filter.subject} < TIMESTAMPADD(${unitMap[unit]}, ${value}, CURRENT_TIMESTAMP)`;
  };

  const specificToSpecificComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;
  
    const match = comparator.match(/([\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2})\s*:\s*([\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2})/);
  
    if (match) {
      const startTimestamp = match[1];
      const endTimestamp = match[2];
  
      return `${filter.subject} >= TO_TIMESTAMP('${startTimestamp.replace(
        "T",
        " "
      )}.000000', 'YYYY-MM-DD HH24:MI:SS.US') AND ${filter.subject} < TO_TIMESTAMP('${endTimestamp.replace(
        "T",
        " "
      )}.000000', 'YYYY-MM-DD HH24:MI:SS.US')`;
    } else {
      throw new Error("Invalid comparator format for specific timestamps");
    }
  };
  
  
  const generateWhereClause = (filter: any): string => {
    const comparator = filter.comparator; 
    if(comparator?.includes("now : DATEADD")){
      return currentTimeToRelativeComparatorFn(filter);
    }
    if(comparator?.charAt(0) === 'D' && comparator?.includes(": now")){
      return relativeToNowComparatorFn(filter);
    }
    if(comparator?.charAt(0) === 'D' && comparator?.includes(": today")){
      return relativeToMidnightComparatorFn(filter);
    }
    if(!comparator?.includes("now : now") && comparator?.includes("now :")){
      return currentTimeToSpecificDateComparatorFn(filter);
    }
    if(comparator?.includes("today : DATEADD")){
      return midnightTimeToRelativeDateComparatorFn(filter);
    }
    if(!comparator?.includes("today : today") && !comparator?.includes("today : now") && comparator?.includes("today :")){
      return midnightTimeToSpecificDateComparatorFn(filter);
    }
    if(comparator.match(/DATEADD/g)?.length === 2){
      return relativeToRelativeComparatorFn(filter);
    }
    if(comparator?.charAt(0) === 'D' && comparator.match(/DATEADD/g)?.length === 1){
      return relativeToSpecificComparatorFn(filter);
    }
    if (comparator?.includes(": today") && (comparator.match(/today/g)?.length !== 2)) {
      return specificToMidnightComparatorFn(filter);
    }
    if (comparator?.includes(": now") && !comparator?.includes("today") && (comparator.match(/now/g)?.length !== 2)) {
      return specificToNowComparatorFn(filter);
    }
    if(comparator.charAt(0) !== 'D' && comparator.match(/DATEADD/g)?.length === 1 ){
      return specificToRelativeComparatorFn(filter);
    }
    if(!comparator?.includes("DATEADD") && !comparator?.includes("now") && !comparator?.includes("today")  && comparator?.includes(":")){
      return specificToSpecificComparatorFn(filter);
    }
    switch (comparator) {
      case "No filter":
        return noFilterComparatorFn(filter);
      case "Last day":
        return lastDayComparatorFn(filter);
      case "Last week":
        return lastWeekComparatorFn(filter);
      case "Last month":
        return lastMonthComparatorFn(filter);
      case "Last quarter":
        return lastQuarterComparatorFn(filter);
      case "Last year":
        return lastYearComparatorFn(filter);
      case "previous calendar week":
        return previousCalenderWeekComparatorFn(filter);
      case "previous calendar month":
        return previousCalenderMonthComparatorFn(filter);
      case "previous calendar year":
        return previousCalenderYearComparatorFn(filter);
      case "Current day":
        return currentDayComparatorFn(filter);
      case "Current week":
        return currentWeekComparatorFn(filter);
      case "Current month":
        return currentMonthComparatorFn(filter);
      case "Current quarter":
        return currentQuarterComparatorFn(filter);
      case "Current year":
        return currentYearComparatorFn(filter);
      case "now : now":
        return currentTimeComparatorFn(filter);
      case "today : today":
        return todayComparatorFn(filter);
      case "today : now":
        return todayTillNowComparatorFn(filter);
      default:
        return "";
    }
  };

  function processTemporalRangeFilters(filters: any[]): string {
    console.log("filters are",filters);
    
    const timeRangeFilters = filters.filter(
      (filter) => filter.operator === "TEMPORAL_RANGE"
    );

    const otherFilters = filters.filter((filter) => filter.operator !== "TEMPORAL_RANGE");

    const otherClauses = otherFilters.map((filter) => {
      const subject = filter.subject;
      const operator = filter.operator;
      const comparator = filter.comparator;
    
      switch (operator) {
        case "IN":
        case "NOT IN": {
          const values = Array.isArray(comparator) ? comparator.map((val) => `'${val}'`).join(", ") : `'${comparator}'`;
          return `${subject} ${operator} (${values})`;
        }
    
        case "==":
          return `${subject} = '${comparator}'`;
    
        case "!=":
          return `${subject} != '${comparator}'`;
    
        case "<":
        case ">":
        case "<=":
        case ">=":
          return `${subject} ${operator} '${comparator}'`;
    
        case "LIKE":
        case "NOT LIKE":
          return `${subject} ${operator} '${comparator}'`;
    
        case "IS NULL":
        case "IS NOT NULL":
          return `${subject} ${operator}`;
    
        default:
          throw new Error(`Unsupported filter operator: ${operator}`);
      }
    });
    
    
    const filterClauses = timeRangeFilters.map(generateWhereClause);
    const validClauses = filterClauses.filter((clause) => clause.trim() !== "");
    const allClauses = [...validClauses, ...otherClauses];
    return allClauses.length > 0 ? `WHERE ${allClauses.join(" AND ")}` : "";
  
  }
  

  return processTemporalRangeFilters(filters); 
}
