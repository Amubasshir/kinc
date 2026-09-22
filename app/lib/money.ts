export function formatMoney(amount: number, currency: string) {
  const normalizedCurrency = currency.toUpperCase();
  const number = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (normalizedCurrency === "USD") return `US$${number.format(amount)}`;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: normalizedCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
