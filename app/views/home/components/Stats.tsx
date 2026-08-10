import type { StatModel } from "../../../models/site";
export default function Stats({ stats }: { stats: StatModel[] }) {
  return (
    <section className="stats min-h-[534px] rounded-[20px] bg-white px-6 pt-[111px] pb-20 text-[#263443] max-[700px]:rounded-[18px] max-[700px]:px-6 max-[700px]:pt-[43px] max-[700px]:pb-[54px]" aria-label="KinCollage statistics">
      <div className="stats-grid mx-auto grid w-full max-w-[1120px] grid-cols-3 gap-16 max-[700px]:grid-cols-1 max-[700px]:gap-[58px]">
        {stats.map((stat) => (
          <article className="stat text-center max-[700px]:text-left [overflow-wrap:anywhere]" key={stat.title}>
            <div className="stat-value mx-auto grid h-[96px] w-[96px] place-items-center rounded-full bg-[#97ff77] text-[72px] leading-none max-[700px]:mx-0 max-[700px]:h-[76px] max-[700px]:w-[76px] max-[700px]:text-[64px]">{stat.value}</div>
            <h2 className="mt-7 text-[29px] max-[700px]:mt-6 max-[700px]:text-[27px]">{stat.title}</h2>
            <p className="mt-4 text-[16px] leading-[1.45] max-[700px]:mt-[17px] max-[700px]:text-[15px] max-[700px]:leading-[1.48]">{stat.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
