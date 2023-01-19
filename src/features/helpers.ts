export function formatDisplayValue(displayValue: string) {
  let formattedValue = parseFloat(displayValue).toLocaleString('en-US', {
    useGrouping: true,
    maximumFractionDigits: 6,
  });

  const match = displayValue.match(/\.\d*?(0*)$/);

  if (match) formattedValue += /[1-9]/.test(match[0]) ? match[1] : match[0];

  return formattedValue;
}
