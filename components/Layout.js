import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="layout">
      {/* <header className="layout__header">
        <div className="layout__brand">Fit Journal</div>
        <nav className="layout__nav" aria-label="Primary">
          <Link className="layout__link" href="/blog/the-ultimate-guide">
            Articles
          </Link>
          <Link className="layout__link" href="/blog/5-tips-cardio">
            Workouts
          </Link>
          <Link className="layout__link" href="/blog/meal-prep-basics">
            Nutrition
          </Link>
        </nav>
      </header> */}
      <main className="layout__main">{children}</main>
      <footer className="layout__footer">
        <p>Fitness Blog. Crafted for strong bodies and calm minds.</p>
      </footer>
    </div>
  );
}
