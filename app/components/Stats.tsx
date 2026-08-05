const stats = [
  {
    value: "55+",
    title: "Artworks curated",
    description: "From loose preschool sketches to home made scribbles, we’ve sorted, preserved, and transformed over a thousand memories into permanent history.",
  },
  {
    value: "40+",
    title: "Hours work per piece",
    description: "Every single collage undergoes a physical layout process to ensure the final composition matches your vision.",
  },
  {
    value: "0+",
    title: "Forgotten stories",
    description: "Instead of sitting hidden in a storage bin or a dark drawer, these fleeting moments of childhood imagination are now proudly displayed on living room walls.",
  },
];

export default function Stats() {
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