import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface Props {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  image?: string;
  children?: ReactNode;
}

export function PageHeader({ eyebrow, title, lead, image, children }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-navy py-16 text-white sm:py-24">
      {image && <img src={image} alt="" className="absolute inset-0 -z-20 size-full object-cover opacity-30" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/90 to-navy/50" />
      <div className="stripes absolute inset-y-0 right-0 -z-10 w-1/3" aria-hidden />
      <div className="container-x max-w-4xl">
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-4 text-4xl text-white sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">{lead}</p>
          {children}
        </Reveal>
      </div>
    </section>
  );
}
