const TermsPage = () => {
  return (
    <section className="bg-white dark:bg-slate-950">
      <div className="container m-auto max-w-3xl px-6 py-16">
        <h1 className="mb-8 text-3xl font-bold">Terms of Service</h1>
        <div className="space-y-7 text-slate-600 dark:text-slate-300">
          <div>
            <h2 className="mb-2 text-lg font-bold text-slate-950 dark:text-white">Using Life World</h2>
            <p>By using Life World, you agree to use the service lawfully and to verify property availability, pricing, and terms directly with the listing owner before making a decision.</p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-bold text-slate-950 dark:text-white">Listings and accounts</h2>
            <p>Listing owners are responsible for the accuracy and legality of the content they publish. Account holders are responsible for safeguarding their credentials and for activity under their accounts.</p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-bold text-slate-950 dark:text-white">Service availability</h2>
            <p>We may update, suspend, or remove content and features to protect users, maintain the service, or comply with legal obligations. Continued use of Life World means you accept the current version of these terms.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TermsPage;

