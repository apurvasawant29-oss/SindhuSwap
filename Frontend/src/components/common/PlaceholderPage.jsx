import PageShell from "./PageShell";

function PlaceholderPage({ title, description }) {
  return (
    <PageShell>
      <section className="placeholder container">
        <span className="eyebrow">SindhuSwap</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </PageShell>
  );
}

export default PlaceholderPage;
