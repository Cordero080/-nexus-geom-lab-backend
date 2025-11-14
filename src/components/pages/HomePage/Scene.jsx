{
  /* Scene 4: Superposition */
}

export default function Scene({ id, isActive, backgroundClass, children, animation }) {
  return (
    <section className={`quantum-scene${isActive ? ' active' : ''}`} id={id}>
      {animation}
      <div className={`scene-background ${backgroundClass}`}></div>
      <div className="scene-content">{children}</div>
    </section>
  );
}
