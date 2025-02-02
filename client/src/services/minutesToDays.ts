export const minutesToDays = (minutes: number) => {
  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const remainingMinutes = minutes % 60;
  return days + " day(s),  " + hours + "h,  " + remainingMinutes + "min";
};
