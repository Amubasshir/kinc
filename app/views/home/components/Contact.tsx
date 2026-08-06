import Image from "next/image";

export default function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-heading">
      <div className="contact-panel">
        <Image className="contact-shadow-layer" src="/contact-panel-shadow.png" alt="" width={1199} height={678} aria-hidden="true" />
        <Image className="contact-green-layer" src="/contact-panel-green.png" alt="" width={1212} height={743} aria-hidden="true" />
        <div className="contact-form-card">
          <h2 id="contact-heading">Contact us</h2>
          <p>Ready to start <strong><em>your KinCollage</em></strong> or have a question<br /> about the partnering or anything else?</p>

          <form className="contact-form">
            <div className="contact-field">
              <label htmlFor="contact-name">FULL NAME <span>*</span></label>
              <input id="contact-name" name="name" type="text" placeholder="Sammy Gordon" autoComplete="name" required />
            </div>
            <div className="contact-field">
              <label htmlFor="contact-email">EMAIL <span>*</span></label>
              <input id="contact-email" name="email" type="email" placeholder="yourname@email.com" autoComplete="email" required />
            </div>
            <div className="contact-field contact-message">
              <label htmlFor="contact-message">MESSAGE <span>*</span></label>
              <input id="contact-message" name="message" type="text" placeholder="hello" required />
            </div>
            <button type="submit">SEND</button>
          </form>
        </div>

        <Image className="contact-artwork" src="/contact-artwork.png" alt="A finished KinCollage artwork displayed outdoors" width={1820} height={2328} sizes="(max-width: 800px) 90vw, 455px" />
      </div>
    </section>
  );
}