export default function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="stat-card">
      <div className={`stat-accent ${accent}`} />
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
