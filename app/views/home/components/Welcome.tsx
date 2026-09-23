import Image from "next/image";

export default function Welcome() {
  return (
    <section
      className="welcome min-h-[967px] rounded-[20px] bg-white px-6 pt-[87px] pb-[76px] text-[#515151] max-[700px]:min-h-0 max-[700px]:rounded-none max-[700px]:bg-transparent max-[700px]:p-0"
      aria-labelledby="welcome-heading"
    >
      <div className="welcome-grid mx-auto grid w-full max-w-[1024px] grid-cols-2 gap-[52px] max-[940px]:gap-9 max-[700px]:flex max-[700px]:flex-col max-[700px]:gap-3">
        <div className="welcome-left">
          <div className="welcome-intro max-[700px]:order-1 max-[700px]:rounded-[20px] max-[700px]:bg-white max-[700px]:px-[18px] max-[700px]:pt-[30px] max-[700px]:pb-[27px]">
            <h2 id="welcome-heading">Drowning in Kid Art?</h2>
            <p>
              <strong>Love their artwork, but hate the clutter?</strong>
              <span className="block">
              Constant chaos. Fridge mess. You feel you can’t throw your kid’s scribbles away, but keeping them means
              constant clutter.</span>
            </p>
            <p>
              <strong>Every child is an artist, but every parent runs out of storage space.</strong>
            </p>
            <p style={{ marginTop: 0 }}>
              Between busy schedules and endless paper piles,
              <br /> organizing years of artwork feels impossible.
            </p>
            <p>
              But it <em>doesn’t have to stay</em> like that.
            </p>
          </div>

          <div className="welcome-before-wrap relative mt-[33px] w-[398px] max-[700px]:order-2 max-[700px]:mt-0 max-[700px]:w-full">
            <div className="welcome-label welcome-label-before">
              <Image unoptimized src="/cursor-before.svg" alt="" width={24} height={24} aria-hidden="true" />
              <span>Before</span>
            </div>
            <Image
              unoptimized
              className="welcome-before-photo"
              src="/welcome-design-before.png"
              alt="A collage of children's artwork, arranged as a keepsake"
              width={1660}
              height={2032}
              sizes="(max-width: 700px) 100vw, 398px"
            />
            <Image
              unoptimized
              className="welcome-connector"
              src="/welcome-arrow.svg"
              alt=""
              width={193}
              height={161}
              aria-hidden="true"
            />
            <Image
              unoptimized
              className="welcome-connector-mobile"
              src="/welcome-arrow-mobile.svg"
              alt=""
              width={114}
              height={200}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="welcome-right">
          <div className="welcome-after-wrap">
            <Image
              unoptimized
              className="welcome-after-photo"
              src="/welcome-design-after.png"
              alt="Children looking at their finished heirloom collage"
              width={1760}
              height={2176}
              sizes="(max-width: 760px) 100vw, 398px"
            />
            <div className="welcome-label welcome-label-after">
              <Image unoptimized src="/cursor-after.svg" alt="" width={24} height={24} aria-hidden="true" />
              <span>After</span>
            </div>
          </div>
          <div className="welcome-outro">
            <p>
              KinCollage turns the memories of childhood into a custom, <strong>modern fine art family heirloom</strong>
              . You provide the drawings by mail, and I curate them into a single, cohesive collage.
            </p>
            <p>
              <strong className="mt-6">No more ‘messy rooms’.</strong>
              <br />
              <strong>No more ‘we can only keep one’.</strong>
              <br />
              <strong>No more parent guilt about throwing them out.</strong>
            </p>
            <p className="welcome-closing">
              <em>Don’t hide their magic in a box.</em>
              <br />
              <strong>Elevate it. Make them proud.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
