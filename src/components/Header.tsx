export default function Header({
  title,
  onMenu,
  onAdd,
}: {
  title: string;
  onMenu: () => void;
  onAdd?: () => void;
}) {
  return (
    <header>
      <div className="header-title">
        <button className="menu-button" onClick={onMenu}>
          ☰
        </button>
        <h2>{title}</h2>
      </div>
      {onAdd && (
        <button className="button primary" onClick={onAdd}>
          ＋ New Project
        </button>
      )}
    </header>
  );
}
