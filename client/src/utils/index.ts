export const isValidEmail = (email: string): boolean => {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const ucWords = (str: string) => {
  return (str.toLowerCase() + '').replace(/^(.)|\s+(.)/g, function($1) {
    return $1.toUpperCase();
  });
};

export const csvToJson = (csv: string, delimeter: string) => {
  const [firstLine, ...lines] = csv.split('\n');
  const keys = firstLine.replace(/\s/g, '').split(delimeter);
  const data = lines.filter(entry => {
    return entry.trim() !== '';
  });
  return data.map(line =>
    (values =>
      keys.reduce(
        (curr, next, index) => ({
          ...curr,
          [next]: values[index]
        }),
        {}
      ))(line.split(delimeter))
  );
};

export const minutesConvertToHours = (numberOfMinutes: number) => {
  const hours = numberOfMinutes / 60;
  let rhours = ('0' + Math.floor(hours)).slice(-2);
  const minutes = (hours - Number(rhours)) * 60;
  let rminutes = ('0' + Math.round(minutes)).slice(-2);
  return { rhours, rminutes, hours };
};

export const hoursConvertToMinutes = (hours: number, minutes: number) => {
  const minutesFromHours = hours * 60;
  const numberOfMinutes = minutesFromHours + minutes;
  return numberOfMinutes;
};
