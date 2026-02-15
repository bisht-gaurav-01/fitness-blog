export default function Layout({ children }) {
  return (
    <div className="layout">
      <main className="layout__main">{children}</main>
    </div>
  );
}
