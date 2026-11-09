import { LuCheck } from 'react-icons/lu';

type StepIndicatorStep = {
  id: string;
  label: string;
};

type StepIndicatorProps = {
  steps: StepIndicatorStep[];
  /** Index of the step on screen. */
  current: number;
  /** Ids of steps already completed — shown with a check. */
  completed: ReadonlySet<string>;
  /** The furthest step reached so far. Every step up to it (other than
   * the current one) can be clicked — back to a done step, or forward
   * again after an Edit. Defaults to the current step. */
  reached?: number;
  onStepClick: (index: number) => void;
  /** Names the list for screen readers, e.g. "New pickup request steps". */
  label: string;
  className?: string;
};

/** Numbered steps for a step-by-step form: done steps show a check, the
 * current one is highlighted, steps already reached can be clicked, and
 * steps beyond that are inert. On narrow screens only the circles show, with the
 * current step's name beneath; every name stays readable by screen
 * readers. Shared by every step form — don't rebuild per form. */
const StepIndicator = ({
  steps,
  current,
  completed,
  onStepClick,
  label,
  reached = current,
  className = '',
}: StepIndicatorProps) => (
  <nav aria-label={label} className={className}>
    <ol className="flex items-center">
      {steps.map((step, index) => {
        const isCurrent = index === current;
        const isDone = completed.has(step.id) && !isCurrent;
        const clickable = !isCurrent && index <= Math.max(reached, current);

        let circle = 'border-slate-200 bg-white text-slate-400';
        if (isCurrent) circle = 'border-brand-600 bg-brand-600 text-white';
        else if (isDone) circle = 'border-brand-600 bg-brand-50 text-brand-700';

        const content = (
          <>
            <span
              aria-hidden
              className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${circle}`}
            >
              {isDone ? <LuCheck className="size-4" /> : index + 1}
            </span>
            <span
              className={`hidden text-sm sm:inline ${
                isCurrent
                  ? 'font-semibold text-neutral-950'
                  : 'font-medium text-slate-500'
              }`}
            >
              {step.label}
            </span>
            <span className="sr-only sm:hidden">{step.label}</span>
            {isDone && <span className="sr-only"> (done)</span>}
          </>
        );

        return (
          <li
            key={step.id}
            className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
          >
            {clickable ? (
              <button
                type="button"
                onClick={() => onStepClick(index)}
                className="flex min-h-11 items-center gap-2 rounded-full pe-2 transition hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                {content}
              </button>
            ) : (
              <span
                aria-current={isCurrent ? 'step' : undefined}
                className="flex min-h-11 items-center gap-2 pe-2"
              >
                {content}
              </span>
            )}
            {index < steps.length - 1 && (
              <span
                aria-hidden
                className={`mx-1 h-px flex-1 sm:mx-2 ${
                  completed.has(step.id) ? 'bg-brand-300' : 'bg-slate-200'
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
    <p className="mt-1 text-sm font-semibold text-neutral-950 sm:hidden">
      {steps[current]?.label}
    </p>
  </nav>
);

export { StepIndicator };
export type { StepIndicatorProps, StepIndicatorStep };
