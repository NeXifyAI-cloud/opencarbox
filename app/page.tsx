export default function Home() {
  return (
    <>
      <header>
        <h1>🚀 OpenCarBox - LIVE!</h1>
      </header>
      <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <p>Minimal deployment to verify production is working.</p>

        <section>
          <h2>Aktuelle Angebote</h2>
          <div className="card-premium">
            <img src="/logo.png" alt="Dummy vehicle" style={{ width: '100px' }} />
          </div>
        </section>

        <p style={{ color: '#666', fontSize: '12px', marginTop: '20px' }}>
          Status: Rebuilding full application... check back soon.
        </p>
      </main>
    </>
  );
}
