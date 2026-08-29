'use client';
import * as React from 'react';

export { Card } from './ui/card';
export { Field } from './ui/field';
export { Input } from './ui/input';
export { Textarea } from './ui/textarea';

import {
  Select as UISelect, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from './ui/select';

interface OptionLike {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

/**
 * Drop-in replacement for a native <select> backed by the real shadcn/ui
 * (Radix) Select underneath. Accepts the same `<option>` children, `value`,
 * `onChange`, `name`, `required`, `disabled` API the rest of the app already
 * uses, so every existing call site works unchanged while actually rendering
 * genuine shadcn/ui components.
 */
export function Select({
  children, value, defaultValue, onChange, disabled, name, required, className,
}: {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  className?: string;
}) {
  const options: OptionLike[] = React.Children.toArray(children)
    .filter((c): c is React.ReactElement<any> => React.isValidElement(c))
    .map((c) => ({ value: c.props.value, label: c.props.children, disabled: c.props.disabled }));

  const placeholderOpt = options.find((o) => o.value === '');
  const realOptions = options.filter((o) => o.value !== '');

  return (
    <UISelect
      value={value ? value : undefined}
      defaultValue={defaultValue}
      onValueChange={(v) => onChange?.({ target: { value: v, name } })}
      disabled={disabled}
      name={name}
      required={required}
    >
      <SelectTrigger className={className ?? 'w-full'}>
        <SelectValue placeholder={placeholderOpt ? String(placeholderOpt.label) : 'Select…'} />
      </SelectTrigger>
      <SelectContent>
        {realOptions.map((o) => (
          <SelectItem key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </UISelect>
  );
}
