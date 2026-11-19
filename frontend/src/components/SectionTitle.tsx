import { Reveal } from "./Reveal";

interface Props {
  eyebrow: string;
  title: string;
  lead?: string;
  center?: boolean;
}

export function SectionTitle({ eyebrow, title, lead, center = true }: Props) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="heading mt-3">{title}</h2>
      {lead && <p className="lead mt-4">{lead}</p>}
    </Reveal>
  );
}
