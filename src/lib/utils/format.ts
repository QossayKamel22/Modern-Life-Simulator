export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompact(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export function formatDate(time: { day: number; month: number; year: number }): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[time.month - 1]} ${time.day}, ${time.year}`;
}

export function formatTime(time: { hour: number; minute: number }): string {
  const h = time.hour % 12 === 0 ? 12 : time.hour % 12;
  const period = time.hour < 12 ? "AM" : "PM";
  return `${h}:${time.minute.toString().padStart(2, "0")} ${period}`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
