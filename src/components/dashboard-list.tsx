import React from 'react';

interface Event {
  name: string;
  page: string;
}

interface Props {
  events: Event[];
}

export const DashboardList = ({ events }: Props) => {
  const uniqueEvents = Array.from(new Set(events.map((event) => event.page)));
  const eventCounts: { [page: string]: number } = {};

  events.forEach((event) => {
    eventCounts[event.page] = (eventCounts[event.page] || 0) + 1;
  });

  return (
    <div className="m-4 h-96 w-96 rounded-lg bg-blue-200 text-white">
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Page</th>
            <th className="px-4 py-2">#</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {uniqueEvents.map((eventPage, index) => (
            <tr key={index} className="bg-blue-200 text-white">
              <td className="border px-4 py-2">
                {events.filter((event) => event.page === eventPage)[0].name}
              </td>
              <td className="border px-4 py-2">{eventPage}</td>
              <td className="border px-4 py-2">{eventCounts[eventPage]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
