import Icon from '../ui/Icon';

const PHRASE = 'La empresa dominicana que desarrolló el primer sistema PACS del país';

export default function Band() {
  return (
    <div className="band">
      <div className="marquee" style={{ '--marquee-duration': '38s' } as React.CSSProperties}>
        {[0, 1].map((copy) => (
          <div className="marquee__track" key={copy} aria-hidden={copy === 1}>
            {[0, 1].map((i) => (
              <span className="band__text" key={i}>
                <Icon name="star" size={26} className="band__star" strokeWidth={1.4} />
                La empresa dominicana que desarrolló el <b>primer sistema PACS</b> del país
              </span>
            ))}
          </div>
        ))}
      </div>
      <span className="sr-only">{PHRASE}</span>
    </div>
  );
}
