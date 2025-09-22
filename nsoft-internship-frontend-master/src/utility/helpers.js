export function formatNumberWithCurrency(balance, currency, format = "de-DE") {
  return new Intl.NumberFormat(format, {
    style: currency ? "currency" : undefined,
    currency: currency ? currency : undefined,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);
}
