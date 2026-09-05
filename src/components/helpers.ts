export const currency = (value: number) =>
  `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
export const dateLabel = (value: string) =>
  new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
