import Link from 'next/link';
import {
  LuBriefcase,
  LuGraduationCap,
  LuHeart,
  LuShoppingBag,
} from 'react-icons/lu';

type SolutionKey = 'ngo' | 'education' | 'professional-services' | 'retail';

const ALL_SOLUTIONS = [
  {
    key: 'ngo' as SolutionKey,
    Icon: LuHeart,
    title: 'NGOs & Charities',
    desc: 'Certified disposal and ESG reporting for donated electronics',
    href: '/solutions/ngo',
  },
  {
    key: 'education' as SolutionKey,
    Icon: LuGraduationCap,
    title: 'Education & Colleges',
    desc: 'Decommission computer labs and campus IT, fully documented',
    href: '/solutions/education',
  },
  {
    key: 'professional-services' as SolutionKey,
    Icon: LuBriefcase,
    title: 'Professional Services',
    desc: 'Certified data destruction for client-facing firms',
    href: '/solutions/professional-services',
  },
  {
    key: 'retail' as SolutionKey,
    Icon: LuShoppingBag,
    title: 'Retail & Trading',
    desc: 'Bulk collection for returned and end-of-life inventory',
    href: '/solutions/retail',
  },
];

interface RelatedSolutionsProps {
  exclude: SolutionKey;
}

const RelatedSolutions = ({ exclude }: RelatedSolutionsProps) => {
  const solutions = ALL_SOLUTIONS.filter((s) => s.key !== exclude);

  return (
    <section className="bg-neutral-50 py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
          Also serving
        </p>
        <h2 className="mb-10 text-center font-montserrat text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
          Solutions for every sector
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {solutions.map(({ key, Icon, title, desc, href }) => (
            <Link
              key={key}
              href={href}
              className="group block rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-brand-600"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-brand-600 transition-colors group-hover:bg-brand-50">
                <Icon size={20} />
              </div>
              <p className="text-sm font-semibold text-neutral-950">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {desc}
              </p>
              <p className="mt-4 text-xs font-medium text-brand-600">
                Learn more →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export { RelatedSolutions };
