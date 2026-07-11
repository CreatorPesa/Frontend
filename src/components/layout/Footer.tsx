export function Footer() {
  return (
    <footer className="border-t border-ink-100 py-8 text-sm text-ink-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <p>&copy; {new Date().getFullYear()} CreatorPesa. Built on Stellar.</p>
        <div className="flex gap-4">
          <a href="https://developers.stellar.org" className="hover:text-ink-800">
            Stellar Developers
          </a>
        </div>
      </div>
    </footer>
  );
}
