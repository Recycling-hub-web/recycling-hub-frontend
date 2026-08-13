import { motion } from 'framer-motion';

import { ABOUT } from '../../../constants/content';
import { SectionHeading } from '../../ui/SectionHeading';

const ease = [0.22, 1, 0.36, 1] as const;

const TeamSection = () => (
  <section
    id="team"
    className="relative overflow-hidden bg-white py-16 md:py-20"
  >
    <div className="relative mx-auto max-w-7xl px-5 md:px-8">
      <div className="mb-12 text-center">
        <SectionHeading
          eyebrow="The People"
          headline="The Team Behind Recycling Hub"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ABOUT.team.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.12, ease }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center"
          >
            <div
              className="mb-6 flex size-20 items-center justify-center rounded-full font-montserrat text-2xl font-extrabold text-white"
              style={{
                background: 'linear-gradient(135deg, #404040, #0f0f0f)',
                boxShadow: '0 0 0 3px rgba(15,23,42,0.15)',
              }}
            >
              {member.initials}
            </div>

            <h3 className="font-montserrat text-lg font-bold text-neutral-950 md:text-xl">
              {member.name}
            </h3>

            <p className="mt-1 text-base font-medium italic text-slate-500">
              {member.role}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {member.tagline}
            </p>

            <div className="my-5 h-px w-12 bg-slate-200" />

            <p className="text-sm leading-relaxed text-slate-500">
              {member.bio}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export { TeamSection };
