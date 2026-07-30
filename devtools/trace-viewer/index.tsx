import React from 'react';

interface TraceEvent {
  timestamp: number;
  span: string;
  event: string;
  data: Record<string, unknown>;
}

interface TraceViewerProps {
  events: TraceEvent[];
}

export const TraceViewer: React.FC<TraceViewerProps> = ({ events }) => {
  return (
    <div className="trace-viewer">
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Span</th>
            <th>Event</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, i) => (
            <tr key={i}>
              <td>{event.timestamp}</td>
              <td>{event.span}</td>
              <td>{event.event}</td>
              <td>{JSON.stringify(event.data)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
