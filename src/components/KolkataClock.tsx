import { useEffect, useState } from "react";

function formatKolkataTime() {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

export function KolkataClock() {
  const [time, setTime] = useState(formatKolkataTime);

  useEffect(() => {
    const id = setInterval(() => setTime(formatKolkataTime()), 15000);
    return () => clearInterval(id);
  }, []);

  return <div className="kolkata-clock">Kolkata · {time}</div>;
}
