import React from 'react';

export const StatusBar = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-teal px-5 py-2 flex justify-between items-center shrink-0">
      <span className="text-white text-[12px] font-medium">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
      </span>
      <span className="text-white text-[12px]">📶 🔋</span>
    </div>
  );
};
