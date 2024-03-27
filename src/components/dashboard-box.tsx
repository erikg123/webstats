import React from 'react';

export interface Props {
  title: string;
  number: number;
}

export const DashboardBox = ({ title, number }: Props) => {
  return (
    <div className="m-4 flex h-96 w-96 flex-col items-center justify-center rounded-lg bg-blue-200 p-8 text-white">
      <h2 className="text-2xl">{title}:</h2>
      <p className="text-4xl">{number}</p>
    </div>
  );
};
