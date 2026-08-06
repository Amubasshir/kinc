import type { StatModel } from "../../../models/site";
export default function Stats({ stats }: { stats: StatModel[] }) {
  return (
    <section className="stats" aria-label="KinCollage statistics">
      <div className="stats-grid">
        {stats.map((stat) => (
          <article className="stat" key={stat.title}>
            <div className="stat-value">{stat.value}</div>
            <h2>{stat.title}</h2>
            <p>{stat.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}