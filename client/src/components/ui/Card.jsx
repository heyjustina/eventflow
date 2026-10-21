function Card({ title, children, className = '' }) {
  return (
    <section className={`card ${className}`}>
      {title && <h3 className="card-title">{title}</h3>}
      {children}
    </section>
  );
}

export default Card;