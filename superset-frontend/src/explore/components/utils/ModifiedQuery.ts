
export function newQuery(query: string, filters: any[]): string {
    const now = new Date();
    const hours = now.getHours();
    const min = now.getMinutes();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth(); 
    const currentYear = now.getFullYear(); 

    const utcnow = new Date();
const utchours = utcnow.getUTCHours();  
const utcminutes = utcnow.getUTCMinutes() + (utchours * 60); 
const utcsec = (utcnow.getUTCMinutes() + (utchours * 60))*60; 


  const noFilterComparatorFn = (filter: any): string => {
    return "";
  };


  const lastDayComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(DAY, -1, DATE_TRUNC('DAY', CURRENT_TIMESTAMP)) AND ${filter.subject} < DATE_TRUNC('DAY', CURRENT_TIMESTAMP)`;
  };

  const lastWeekComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(WEEK, -1, DATE_TRUNC('DAY', CURRENT_TIMESTAMP)) AND ${filter.subject} < DATE_TRUNC('DAY', CURRENT_TIMESTAMP)`;
  };

  const lastMonthComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(MONTH, -1, DATE_TRUNC('DAY', CURRENT_TIMESTAMP)) AND ${filter.subject} < DATE_TRUNC('DAY', CURRENT_TIMESTAMP)`;
  };

  const lastQuarterComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(QUARTER, -1, DATE_TRUNC('DAY', CURRENT_TIMESTAMP)) AND ${filter.subject} < DATE_TRUNC('DAY', CURRENT_TIMESTAMP)`;
  };

  const lastYearComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(YEAR, -1, DATE_TRUNC('DAY', CURRENT_TIMESTAMP)) AND ${filter.subject} < DATE_TRUNC('DAY', CURRENT_TIMESTAMP)`;
  };

  const previousCalenderWeekComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(WEEK, -1,  DATE_TRUNC('WEEK', CURRENT_TIMESTAMP)) AND ${filter.subject} < DATE_TRUNC('WEEK', CURRENT_TIMESTAMP)`;
  };
  
  const previousCalenderMonthComparatorFn  = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(MONTH, -1,  DATE_TRUNC('MONTH', CURRENT_TIMESTAMP)) AND ${filter.subject} < DATE_TRUNC('MONTH', CURRENT_TIMESTAMP)`;
  }

  const previousCalenderYearComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(YEAR, -1,  DATE_TRUNC('YEAR', CURRENT_TIMESTAMP)) AND ${filter.subject} < DATE_TRUNC('YEAR', CURRENT_TIMESTAMP)`;
  };

  const currentDayComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(DAY, 0, DATE_TRUNC('DAY', CURRENT_TIMESTAMP)) AND ${filter.subject} < TIMESTAMPADD(DAY, 1, DATE_TRUNC('DAY', CURRENT_TIMESTAMP))`;
  }

  const currentWeekComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(WEEK, 0, DATE_TRUNC('WEEK', CURRENT_TIMESTAMP)) AND ${filter.subject} < TIMESTAMPADD(WEEK, 1, DATE_TRUNC('WEEK', CURRENT_TIMESTAMP))`;
  }

  const currentMonthComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(MONTH, 0, DATE_TRUNC('MONTH', CURRENT_TIMESTAMP)) AND ${filter.subject} < TIMESTAMPADD(MONTH, 1, DATE_TRUNC('MONTH', CURRENT_TIMESTAMP))`;
  };
  
  const currentQuarterComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(QUARTER, 0, DATE_TRUNC('QUARTER', CURRENT_TIMESTAMP)) AND ${filter.subject} < TIMESTAMPADD(QUARTER, 1, DATE_TRUNC('QUARTER', CURRENT_TIMESTAMP))`;
    };

  const currentYearComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(YEAR, 0, DATE_TRUNC('YEAR', CURRENT_TIMESTAMP)) AND ${filter.subject} < TIMESTAMPADD(YEAR, 1, DATE_TRUNC('YEAR', CURRENT_TIMESTAMP))`;
   };
  
  const currentTimeComparatorFn = (filter: any): string => {
    return `${filter.subject} >=  CURRENT_TIMESTAMP AND ${filter.subject} < CURRENT_TIMESTAMP`;
  }

  const currentTimeToRelativeComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;
    
    const match = comparator.match(/DATEADD\(DATETIME\("now"\), (\d+), (\w+)\)/);
    if (!match) {
      // throw new Error("Invalid comparator format for DATEADD");
      return ""
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
      // throw new Error(`Unsupported operation: ${operation}`);
      return ""
    }

    return `${filter.subject} >= TIMESTAMPADD(DAY, 0, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(${sqlOperation}, ${value},  CURRENT_TIMESTAMP)`;
  };
  
  const currentTimeToSpecificDateComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;
  
    const match = comparator.match(/now : (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    if (!match) {
      // throw new Error("Invalid comparator format for specific date-time");
      return ""
    }
  
    const dateTime = match[1];
  
    const sqlDateTime = dateTime.replace("T", " ");
    return `${filter.subject} >= TIMESTAMPADD(DAY, 0, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMP '${sqlDateTime}'`;
      };
  
  const todayComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(DAY, 0,  DATE_TRUNC('DAY', CURRENT_TIMESTAMP)) AND ${filter.subject} < TIMESTAMPADD(DAY, 0,  DATE_TRUNC('DAY', CURRENT_TIMESTAMP))`;
  }

  const todayTillNowComparatorFn = (filter: any): string => {
    return `${filter.subject} >= TIMESTAMPADD(DAY, 0,  DATE_TRUNC('DAY', CURRENT_TIMESTAMP)) AND ${filter.subject} <  CURRENT_TIMESTAMP`;
  }

  const midnightTimeToRelativeDateComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;
    
    const match = comparator.match(/DATEADD\(DATETIME\("today"\), (\d+), (\w+)\)/);
    if (!match) {
      // throw new Error("Invalid comparator format for DATEADD");
      return ""
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
      // throw new Error(`Unsupported operation: ${operation}`);
      return ""
    }

    return `${filter.subject} >= TIMESTAMPADD(DAY, 0,  DATE_TRUNC('DAY', CURRENT_TIMESTAMP)) AND ${filter.subject} < TIMESTAMPADD(${sqlOperation}, ${value}, DATE_TRUNC('DAY', CURRENT_TIMESTAMP))`;
  };

  const midnightTimeToSpecificDateComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;
    const match = comparator.match(/today : (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    if (!match) {
      // throw new Error("Invalid comparator format for specific date-time");
      return ""
    }
  
    const dateTime = match[1];
    const sqlDateTime = dateTime.replace("T", " "); 
    return `${filter.subject} >= TIMESTAMPADD(DAY, 0,  DATE_TRUNC('DAY', CURRENT_TIMESTAMP)) AND ${filter.subject} < TIMESTAMP '${sqlDateTime}'`;
  };
  

  const relativeToNowComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;
  
    const match = comparator.match(/DATEADD\(DATETIME\("now"\), (-?\d+), (\w+)\)/);
  
    if (!match) {
      // throw new Error("Invalid comparator format for DATEADD");
      return ""
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
      // throw new Error(`Unsupported time unit: ${unit}`);
      return ""
    }
  
    return `${filter.subject} >= TIMESTAMPADD(${unitMap[unit]}, ${value}, CURRENT_TIMESTAMP) AND ${filter.subject} < TIMESTAMPADD(SECOND, ${0}, CURRENT_TIMESTAMP)`;
  };

  const relativeToMidnightComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;
  
    const match = comparator.match(/DATEADD\(DATETIME\("today"\), (-?\d+), (\w+)\)/);
  
    if (!match) {
      // throw new Error("Invalid comparator format for DATEADD");
      return ""
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
      // throw new Error(`Unsupported time unit: ${unit}`);
      return ""
    }
  
    return `${filter.subject} >= TIMESTAMPADD(${unitMap[unit]}, ${value}, DATE_TRUNC('DAY', CURRENT_TIMESTAMP)) AND ${filter.subject} < TIMESTAMPADD(DAY, 0, DATE_TRUNC('DAY', CURRENT_TIMESTAMP))`;
  };
  
  const relativeToRelativeComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;

    const match1 = comparator.match(/DATEADD\(DATETIME\("now"\), (-?\d+), (\w+)\)/);
    const match2 = comparator.match(/DATEADD\(DATETIME\("now"\), (\d+), (\w+)\)/);
 
    const match = comparator.match(/DATEADD\(DATETIME\("(.*?)"\), (-?\d+), (\w+)\) : DATEADD\(DATETIME\("\1"\), (-?\d+), (\w+)\)/);
    
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
        // throw new Error("Invalid unit in DATEADD expression");
      return ""
      }
    }    if (match) {
      
      const referenceDate = match[1]; 
      const parsedTimestamp = `TIME_PARSE('${referenceDate}')`; 
    
      const value1 = parseInt(match[2]); 
      const unit1 = match[3]; 
      const value2 = parseInt(match[4]); 
      const unit2 = match[5]; 
    
    
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
        return `${filter.subject} >= TIMESTAMPADD(${unitMap[unit1]}, ${value1}, ${parsedTimestamp})  AND ${filter.subject} < TIMESTAMPADD(${unitMap[unit2]}, ${value2}, ${parsedTimestamp})`;
      } else {
        return "";
      }
    }
     else {
      // throw new Error("Invalid DATEADD expressions in comparator");
      return ""
    }
  };

  const relativeToSpecificComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;
    const match = comparator.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    if (!match) {
      // throw new Error("Invalid comparator format for specific date-time");
      return ""
    }
  
    const dateTime = match[1];
    const sqlDateTime = dateTime.replace("T", " ");
  
    const match1 = comparator.match(/DATEADD\(DATETIME\("([^"]+)"\), (-?\d+), (\w+)\)/);
    if (!match1) {
      // throw new Error("Invalid comparator format for DATEADD");
      return ""
    }
  
    const value = parseInt(match1[2], 10); 
    const unit = match1[3]; 
    const unitMap: { [key: string]: string } = {
      second: "SECOND",
      minute: "MINUTE",
      hour: "HOUR",
      day: "DAY",
      week: "WEEK",
      month: "MONTH",
      quarter: "QUARTER",
      year: "YEAR",
    };
  
    if (!unitMap[unit]) {
      // throw new Error(`Unsupported time unit: ${unit}`);
      return ""
    }
  
    return `${filter.subject} >= TIMESTAMPADD(${unitMap[unit]}, ${value}, TIMESTAMP '${sqlDateTime}') AND ${filter.subject} < TIMESTAMP '${sqlDateTime}'`;
  };
  
  
  const specificToMidnightComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;

    const match = comparator.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    if (!match) {
      // throw new Error("Invalid comparator format for specific date-time");
      return ""
    }
    
    const dateTime = match[1];
  
    const sqlDateTime = dateTime.replace("T", " ");
    
    return `${filter.subject} >= TIMESTAMP '${sqlDateTime}' AND ${filter.subject} < TIMESTAMPADD(DAY, 0, DATE_TRUNC('DAY', CURRENT_TIMESTAMP))`;
  };

  const specificToNowComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;

    const match = comparator.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    if (!match) {
      // throw new Error("Invalid comparator format for specific date-time");
      return ""
    }
    
    const dateTime = match[1];
  
    const sqlDateTime = dateTime.replace("T", " ");
    
    return `${filter.subject} >= TIMESTAMP '${sqlDateTime}' AND ${filter.subject} < TIMESTAMPADD(DAY, 0, CURRENT_TIMESTAMP)`;
  };

  const specificToRelativeComparatorFn = (filter: any): string => {
    const comparator = filter.comparator;

    const match = comparator.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    if (!match) {
        // throw new Error("Invalid comparator format for specific date-time");
      return ""
    }
    const dateTime = match[1]; 
    const sqlDateTime = dateTime.replace("T", " "); 

    const match1 = comparator.match(/DATEADD\(DATETIME\("([^"]+)"\), (-?\d+), (\w+)\)/);
    if (!match1) {
        // throw new Error("Invalid comparator format for DATEADD");
      return ""
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
        "year": "YEAR",
    };

    if (!unitMap[unit]) {
        // throw new Error(`Unsupported time unit: ${unit}`);
      return ""
    }

    return `${filter.subject} >= TIMESTAMP '${sqlDateTime}' AND ${filter.subject} < TIMESTAMPADD(${unitMap[unit]}, ${value}, TIMESTAMP '${sqlDateTime}')`;
};

const specificToSpecificComparatorFn = (filter: any): string => {
  const comparator = filter.comparator;

  const match = comparator.match(/([\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2})\s*:\s*([\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2})/);

  if (match) {
      const startTimestamp = match[1].replace("T", " "); 
      const endTimestamp = match[2].replace("T", " "); 

      return `${filter.subject} >= TIMESTAMP '${startTimestamp}' AND ${filter.subject} < TIMESTAMP '${endTimestamp}'`;
  } else {
      // throw new Error("Invalid comparator format for specific timestamps");
      return ""
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
    if(comparator?.match(/DATEADD/g)?.length === 2){
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
    if(comparator?.charAt(0) !== 'D' && comparator?.match(/DATEADD/g)?.length === 1 ){
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
    
    const timeRangeFilters = filters.filter(
      (filter) => filter.operator === "TEMPORAL_RANGE"
    );
    
    const otherFilters = filters.filter((filter) => filter.operator !== "TEMPORAL_RANGE");

    
    const otherClauses = otherFilters.map((filter) => {
      const subject = filter.subject;
      const operator = filter.operator;
      const comparator = filter.comparator;
      const expressionType = filter.expressionType;
      const clause = filter.clause;
      const sqlExpression = filter.sqlExpression;
      if(expressionType === "SQL" && clause === "WHERE"){
        return `${sqlExpression}`
      }

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
        
        case "ILIKE": 
        return `${subject} ILIKE '${comparator}'`;
        
        case "IS NULL":
        case "IS NOT NULL":
          return `${subject} ${operator}`;
    
        default:
          // throw new Error(`Unsupported filter operator: ${operator}`);
      return ""
      }
    });
    
    
    const filterClauses = timeRangeFilters.map(generateWhereClause);
    const validClauses = filterClauses.filter((clause) => clause.trim() !== "");
    const allClauses = [...validClauses, ...otherClauses];    

    const filteredClauses = allClauses.filter(clause => clause.trim() !== ""); 
    
    return filteredClauses.length > 0 ? `WHERE ${filteredClauses.join(" AND ")}` : "";
  }
  return processTemporalRangeFilters(filters); 
}
