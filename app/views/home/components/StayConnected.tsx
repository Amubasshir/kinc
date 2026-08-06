export default function StayConnected() {
  return (
    <section className="stay-connected" aria-labelledby="stay-connected-heading">
      <h2 id="stay-connected-heading">Stay connected</h2>
      <p>
        Sign up for exclusive studio updates and curation tips, and receive a<br />
        complimentary <mark>$50 framing credit</mark> toward your first collage order.
      </p>
      <form className="stay-connected-form">
        <div className="stay-connected-field">
          <label htmlFor="subscriber-name">FULL NAME <span>*</span></label>
          <input id="subscriber-name" name="name" type="text" placeholder="Sammy Milson" autoComplete="name" required />
        </div>
        <div className="stay-connected-field">
          <label htmlFor="subscriber-email">EMAIL <span>*</span></label>
          <input id="subscriber-email" name="email" type="email" placeholder="yourname@email.com" autoComplete="email" required />
        </div>
        <button type="submit">SECURE YOUR CREDIT</button>
      </form>
    </section>
  );
}