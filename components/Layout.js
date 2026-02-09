export default function Layout({ children }) {
  return (
    <div className="layout">
      
      <main className="layout__main">{children}</main>
      <footer className="layout__footer">
        <p>Fitness Blog. Crafted for strong bodies and calm minds.</p>
      </footer>
    </div>
  );
}
