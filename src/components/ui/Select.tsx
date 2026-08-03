import { ChevronIcon } from "@/components/icons/figma";

interface SelectProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

/**
 * A native select styled as the Figma "Open ▾ / Newest ▾" trigger. Native
 * keeps keyboard and mobile behaviour correct for free.
 */
export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectProps<T>) {
  return (
    /* 21.75 tall, 8.42 radius; label 9.82px w656 with a 14.04 chevron. */
    <div className="relative inline-flex h-7.25 items-center">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="cursor-pointer appearance-none rounded-[11.23px] bg-transparent pr-[18.72px] text-body font-semibold text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronIcon className="pointer-events-none absolute right-0 size-[18.72px] text-ink" />
    </div>
  );
}
