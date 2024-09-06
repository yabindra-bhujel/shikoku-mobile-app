import React from 'react';
import { format } from 'date-fns';

export const DateFormat = ({ date }: { date: string }) => {
  const dateObj = new Date(date);

  const formattedDate = format(dateObj, 'yyyy-MM-dd HH:mm');

  return <>{formattedDate}</>;
};
