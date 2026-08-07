export default function GiftCard() {
  return (
    <section className="gift-card" aria-labelledby="gift-card-heading">
      <div className="gift-card-content">
        <h2 id="gift-card-heading">Gift of a commission</h2>
        <p>
          Perfect for milestone birthdays, Mother&apos;s Day, or a unique baby shower gift.
          <br />
          The KinCollage digital voucher allows the recipient to curate their favourite
          <br />
          childhood memories into a bespoke work of fine art.
        </p>
        <form className="gift-card-form">
          <label htmlFor="voucher-amount">Voucher amount in Australian dollars</label>
          <input
            id="voucher-amount"
            name="amount"
            type="number"
            min="1"
            step="1"
            inputMode="decimal"
            placeholder="$ [ Enter Amount ] AUD"
            required
          />
          <button type="submit">PURCHASE VOUCHER</button>
        </form>
      </div>
    </section>
  );
}
