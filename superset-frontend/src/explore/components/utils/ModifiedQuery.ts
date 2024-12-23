
export function modifyQueryToRelative(query: string, checkTimeInterval: string) {
  const timestampPattern = /TO_TIMESTAMP\('(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+)',\s*'YYYY-MM-DD HH24:MI:SS.US'\)/g;
  const now = new Date();

  // For no filter condition
  if(checkTimeInterval.includes("No filter")){
    return query;
  }
  // For now:now  filter condition
  if (checkTimeInterval === "now : now") {
    return query.replace(timestampPattern, () => {
      return `TIMESTAMPADD(HOUR, 0, CURRENT_TIMESTAMP)`;
    });
  }
  // For today:today filter condition
  if (checkTimeInterval === "today : today") {
    return query.replace(timestampPattern, () => {
      return `TIMESTAMPADD(DAY, 0, CURRENT_TIMESTAMP)`;
    });
  }

  // For today:now filter condition
  if (checkTimeInterval === "today : now") {
    let modifiedQuery = query;
    let firstMatch = true; 
    const now = new Date(); 
  
    modifiedQuery = modifiedQuery.replace(timestampPattern, (_: any, hardcodedDate: string) => {
      if (firstMatch) {
        firstMatch = false; 
        const parsedDate = new Date(hardcodedDate); 
        const diffTime = now.getTime() - parsedDate.getTime(); 
        const diffInHours = Math.floor(diffTime / (1000 * 60 * 60)); 
        const diffInDays = Math.floor(diffInHours / 24); 
  
        if (diffInHours < 24) {
          return `TIMESTAMPADD(HOUR, ${-diffInHours}, CURRENT_TIMESTAMP)`;
        } else {
          return `TIMESTAMPADD(DAY, ${-diffInDays}, CURRENT_TIMESTAMP)`;
        }
      }
      return `TO_TIMESTAMP(HOUR, 0, CURRENT_TIMESTAMP)`;
    });
  
    return modifiedQuery;
  }
  
  // Not possile to query for now:today
  
  // For custom values don't modify the query
  // if (checkTimeInterval.includes(":") && !checkTimeInterval.includes("DATEADD") && 
  //!checkTimeInterval.includes(" now") && !checkTimeInterval.includes(" today") && 
  // (checkTimeInterval.charAt(0) !== 't') && (checkTimeInterval.charAt(0) !== 'n') ) {
  //     return query;
  // }
  
  //For today : relative
  if(checkTimeInterval.includes("today :")){
    if(checkTimeInterval.includes("today : DATEADD")){
      
      return query.replace(timestampPattern, (_: any, hardcodedDate: string | number | Date) => {
        const parsedDate = new Date(hardcodedDate);
        const diffTime = now.getTime() - parsedDate.getTime(); 
        
        const diffInHours = Math.floor(diffTime / (1000 * 60 * 60)) ; 
        const diffInDays = Math.floor(diffInHours / 24); 
    
        if (diffInHours < 24) {
          return `TIMESTAMPADD(HOUR, ${-diffInHours}, CURRENT_TIMESTAMP)`; 
        } else {
          return `TIMESTAMPADD(DAY, ${-diffInDays}, CURRENT_TIMESTAMP)`; 
        }
      });
    }

    let modifiedQuery = query;
    let firstMatch = true; // first TO_TIMESTAMP is modified

    modifiedQuery = modifiedQuery.replace(timestampPattern, (_: any, hardcodedDate: string | number | Date) => {
      const parsedDate = new Date(hardcodedDate);
      const diffTime = now.getTime() - parsedDate.getTime();

      const diffInHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);
      if (firstMatch) {
        firstMatch = false; 

        if (diffInHours < 24) {
          return `TIMESTAMPADD(HOUR, ${-diffInHours}, CURRENT_TIMESTAMP)`;
        } else {
          return `TIMESTAMPADD(DAY, ${-diffInDays}, CURRENT_TIMESTAMP)`;
        }
      }
      return `TO_TIMESTAMP('${hardcodedDate}', 'YYYY-MM-DD HH24:MI:SS.US')`; // Keep the second TO_TIMESTAMP as is
    });

    return modifiedQuery;
  
}
  //For both relative
  if (
    checkTimeInterval.includes(":") && 
    (checkTimeInterval.match(/DATEADD/g)?.length === 2)
  ) {
    return query.replace(timestampPattern, (_: any, hardcodedDate: string | number | Date) => {
          const parsedDate = new Date(hardcodedDate);
          const diffTime = now.getTime() - parsedDate.getTime(); 
          
          const diffInHours = Math.floor(diffTime / (1000 * 60 * 60)) ; 
          const diffInDays = Math.floor(diffInHours / 24); 
      
          if (diffInHours < 24) {
            return `TIMESTAMPADD(HOUR, ${-diffInHours}, CURRENT_TIMESTAMP)`; 
          } else {
            return `TIMESTAMPADD(DAY, ${-diffInDays}, CURRENT_TIMESTAMP)`; 
          }
        });
  }
  
  //For first half of query relative and second half is custom
  if (
    (checkTimeInterval.includes(":") &&
    checkTimeInterval.split(":")[0].includes("DATEADD") &&
    !checkTimeInterval.split(":")[1].includes("DATEADD"))
  )  {
    
    let modifiedQuery = query;
    let firstMatch = true; //  first TO_TIMESTAMP is modified

    modifiedQuery = modifiedQuery.replace(timestampPattern, (_: any, hardcodedDate: string | number | Date) => {
      const parsedDate = new Date(hardcodedDate);
      const diffTime = now.getTime() - parsedDate.getTime();

      const diffInHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);
      if (firstMatch) {
        firstMatch = false; // Modify only the first occurrence

        if (diffInHours < 24) {
          return `TIMESTAMPADD(HOUR, ${-diffInHours}, CURRENT_TIMESTAMP)`;
        } else {
          return `TIMESTAMPADD(DAY, ${-diffInDays}, CURRENT_TIMESTAMP)`;
        }
      }
      if(checkTimeInterval.includes(": now")){
        return `TIMESTAMPADD(HOUR, 0, CURRENT_TIMESTAMP)`;
      }
      if(checkTimeInterval.includes(": today")){
        return `TIMESTAMPADD(HOUR, ${-diffInHours}, CURRENT_TIMESTAMP)`;
      }
      return `TO_TIMESTAMP('${hardcodedDate}', 'YYYY-MM-DD HH24:MI:SS.US')`; // Keep the second TO_TIMESTAMP as is
    });

    return modifiedQuery;
  }

  //For first half of query is now 
  if (checkTimeInterval.includes("now") && checkTimeInterval.charAt(0) === 'n') {
  
    let modifiedQuery = query;
    let firstMatch = true; // first TO_TIMESTAMP is modified
  
    modifiedQuery = modifiedQuery.replace(timestampPattern, (_: any, hardcodedDate: string | number | Date) => {
      if (firstMatch) {
        firstMatch = false; // Modify only the first occurrence
        return `TIMESTAMPADD(HOUR, 0, CURRENT_TIMESTAMP)`; // First half as "now"
      } else {
        const parsedDate = new Date(hardcodedDate); 
        const diffTime = parsedDate.getTime() - now.getTime();
        const diffInHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);
        //For custom second half(3 colons)
        if ((checkTimeInterval.match(/:/g) || []).length === 3) {
          return `TO_TIMESTAMP('${hardcodedDate}', 'YYYY-MM-DD HH24:MI:SS.US')`; // Custom second half
        }
        else if (diffInHours < 24) {
          return `TIMESTAMPADD(HOUR, ${diffInHours}, CURRENT_TIMESTAMP)`;
        } else {
          return `TIMESTAMPADD(DAY, ${diffInDays}, CURRENT_TIMESTAMP)`;
        }
      }
    });
  
    return modifiedQuery;
  }
  

  //For first half of query custom and second half is relative,now,today
  if (checkTimeInterval.includes(": DATEADD") || checkTimeInterval.includes(": now") || checkTimeInterval.includes(": today")) {

    let modifiedQuery = query;
    let firstMatch = true; 
  
    modifiedQuery = modifiedQuery.replace(timestampPattern, (_: any, hardcodedDate: string | number | Date) => {
      if (firstMatch) {
        firstMatch = false; 
        return `TO_TIMESTAMP('${hardcodedDate}', 'YYYY-MM-DD HH24:MI:SS.US')`;
      } else {
        const parsedDate = new Date(hardcodedDate);
        const diffTime = parsedDate.getTime() - now.getTime();
  
        const diffInHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);
        console.log(diffInHours);
        
        if(checkTimeInterval.includes(": DATEADD")){
        if (diffInHours < 24) {
          return `TIMESTAMPADD(HOUR, ${diffInHours}, CURRENT_TIMESTAMP)`;
        } else {
          return `TIMESTAMPADD(DAY, ${diffInDays}, CURRENT_TIMESTAMP)`;
        }
      }else if(checkTimeInterval.includes(": now")){
        return `TIMESTAMPADD(HOUR, 0, CURRENT_TIMESTAMP)`;
    }else if(checkTimeInterval.includes(": today")){
      return `TIMESTAMPADD(HOUR, ${diffInHours}, CURRENT_TIMESTAMP)`;
    }
    return `TIMESTAMPADD(HOUR, ${diffInHours}, CURRENT_TIMESTAMP)`;
  }
    });
  
    return modifiedQuery;
  }

  if(!checkTimeInterval.includes(":")){
    return query.replace(timestampPattern, (_: any, hardcodedDate: string | number | Date) => {
            const parsedDate = new Date(hardcodedDate);
            const diffTime = now.getTime() - parsedDate.getTime();
      
            const diffInHours = Math.floor(diffTime / (1000 * 60 * 60));
            const diffInDays = Math.floor(diffInHours / 24);
      
            if (diffInHours < 24) {
              return `TIMESTAMPADD(HOUR, ${-diffInHours}, CURRENT_TIMESTAMP)`;
            } else {
              return `TIMESTAMPADD(DAY, ${-diffInDays}, CURRENT_TIMESTAMP)`;
            }
          });
  }
  
  // Default case: Return the query as is if none of the above cases match
  return query;
  
}

