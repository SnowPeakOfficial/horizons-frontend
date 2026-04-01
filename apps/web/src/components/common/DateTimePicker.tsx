import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/src/style.css';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';

interface DateTimePickerProps {
  label?: string;
  value?: string; // ISO datetime string
  onChange: (isoString: string) => void;
  error?: string;
}

// Convert 24h hour to 12h parts
function to12h(hour24: number): { hour12: number; ampm: 'AM' | 'PM' } {
  if (hour24 === 0) return { hour12: 12, ampm: 'AM' };
  if (hour24 < 12) return { hour12: hour24, ampm: 'AM' };
  if (hour24 === 12) return { hour12: 12, ampm: 'PM' };
  return { hour12: hour24 - 12, ampm: 'PM' };
}

// Convert 12h parts to 24h
function to24h(hour12: number, ampm: 'AM' | 'PM'): number {
  if (ampm === 'AM') return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}

// Custom dropdown component with pink highlight
interface CustomSelectProps {
  value: string | number;
  options: { value: string | number; label: string }[];
  onChange: (val: string) => void;
  width?: number | string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, options, onChange, width = 'auto' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedLabel = options.find(o => String(o.value) === String(value))?.label ?? String(value);
  const rose500 = theme.colors.rose[500];
  const rose50 = theme.colors.rose[50];

  return (
    <div ref={ref} style={{ position: 'relative', width, flexShrink: 0 }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          padding: '8px 32px 8px 12px',
          border: `2px solid ${open ? rose500 : theme.border.medium}`,
          borderRadius: '10px',
          background: theme.bg.elevated,
          color: theme.text.primary,
          fontSize: '14px',
          fontFamily: typography.fontFamily.sans,
          cursor: 'pointer',
          outline: 'none',
          textAlign: 'left',
          position: 'relative',
          transition: 'border-color 0.15s',
        }}
      >
        {selectedLabel}
        {/* Chevron */}
        <span style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: `translateY(-50%) rotate(${open ? '180deg' : '0deg'})`,
          transition: 'transform 0.15s',
          pointerEvents: 'none',
          fontSize: '10px',
          color: theme.text.secondary,
        }}>▾</span>
      </button>

      {/* Dropdown list */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          background: '#fff',
          border: `2px solid ${rose500}`,
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 9999,
          maxHeight: '200px',
          overflowY: 'auto',
          padding: '4px',
        }}>
          {options.map(opt => {
            const isSelected = String(opt.value) === String(value);
            return (
              <div
                key={opt.value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(String(opt.value));
                  setOpen(false);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: typography.fontFamily.sans,
                  background: isSelected ? rose500 : 'transparent',
                  color: isSelected ? '#fff' : theme.text.primary,
                  fontWeight: isSelected ? 600 : 400,
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => {
                  if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = rose50;
                }}
                onMouseLeave={e => {
                  if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  const parsed = value ? new Date(value) : undefined;
  const init12 = parsed ? to12h(parsed.getHours()) : { hour12: 12, ampm: 'PM' as const };

  const [selected, setSelected] = useState<Date | undefined>(parsed);
  const [hour12, setHour12] = useState<number>(init12.hour12);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>(init12.ampm);
  const [minute, setMinute] = useState<number>(parsed ? parsed.getMinutes() : 0);

  const rose500 = theme.colors.rose[500];
  const rose50 = theme.colors.rose[50];

  // Internal time error (past-time validation)
  const [timeError, setTimeError] = useState('');

  // Helper: snap a 24h time to the next future 15-min slot
  const nextFutureSlot = (): { h12: number; ap: 'AM' | 'PM'; m: number } => {
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    const nextSlot = Math.ceil((totalMinutes + 1) / 15) * 15;
    const h24 = Math.floor(nextSlot / 60) % 24;
    const min = nextSlot % 60;
    const { hour12: h12, ampm: ap } = to12h(h24);
    return { h12, ap, m: min };
  };

  const emit = (day: Date, h12: number, ap: 'AM' | 'PM', m: number) => {
    const d = new Date(day);
    d.setHours(to24h(h12, ap), m, 0, 0);
    if (d <= new Date()) {
      setTimeError('Please choose a time in the future');
      onChange(''); // clear the value so parent treats it as unset
      return;
    }
    setTimeError('');
    onChange(d.toISOString());
  };

  const isToday = (day: Date): boolean => {
    const now = new Date();
    return day.getFullYear() === now.getFullYear() &&
      day.getMonth() === now.getMonth() &&
      day.getDate() === now.getDate();
  };

  const handleDaySelect = (day: Date | undefined) => {
    setSelected(day);
    if (!day) return;

    // If today is selected, auto-advance to next future 15-min slot
    if (isToday(day)) {
      const slot = nextFutureSlot();
      setHour12(slot.h12);
      setAmpm(slot.ap);
      setMinute(slot.m);
      emit(day, slot.h12, slot.ap, slot.m);
    } else {
      emit(day, hour12, ampm, minute);
    }
  };

  const hourOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1).padStart(2, '0'),
  }));

  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: String(i).padStart(2, '0'),
  }));

  const ampmOptions = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
  ];

  // Format preview in 12h
  const previewTime = `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${ampm}`;

  return (
    <div style={{ marginBottom: theme.spacing.lg }}>
      {label && (
        <label style={{ ...typography.styles.label, color: theme.text.primary, display: 'block', marginBottom: theme.spacing.sm }}>
          {label}
        </label>
      )}

      <div style={{
        border: `2px solid ${(error || timeError) ? '#DC2626' : theme.border.medium}`,
        borderRadius: '16px',
        overflow: 'visible', // allow dropdown to overflow the container
        background: '#FFFFFF',
      }}>
        <style>{`
          .horizons-rdp.rdp-root {
            --rdp-accent-color: ${rose500};
            --rdp-accent-background-color: ${rose50};
            --rdp-today-color: ${rose500};
            --rdp-selected-border: 2px solid ${rose500};
            margin: 0;
            padding: 12px;
            font-family: ${typography.fontFamily.sans};
            width: 100%;
            box-sizing: border-box;
          }

          /* Centering: override fit-content max-width */
          .horizons-rdp .rdp-months {
            max-width: 100%;
            width: 100%;
          }
          .horizons-rdp .rdp-month {
            width: 100%;
          }
          .horizons-rdp .rdp-month_grid {
            width: 100%;
          }

          /* Selected day */
          .horizons-rdp .rdp-selected .rdp-day_button,
          .horizons-rdp .rdp-selected .rdp-day_button:hover,
          .horizons-rdp .rdp-selected .rdp-day_button:active,
          .horizons-rdp .rdp-selected .rdp-day_button:focus {
            background-color: ${rose500} !important;
            color: #fff !important;
            border-color: ${rose500} !important;
          }

          /* No hover effect on day buttons */
          .horizons-rdp .rdp-day_button:hover:not(:disabled),
          .horizons-rdp .rdp-day_button:active:not(:disabled) {
            background-color: transparent;
          }

          /* Focus ring */
          .horizons-rdp .rdp-day_button:focus-visible,
          .horizons-rdp .rdp-button_previous:focus-visible,
          .horizons-rdp .rdp-button_next:focus-visible {
            outline: 2px solid ${rose500};
            outline-offset: 2px;
          }

          /* Caption (month name) */
          .horizons-rdp .rdp-month_caption {
            font-weight: 600;
            color: ${theme.text.primary};
          }

          /* Weekday labels */
          .horizons-rdp .rdp-weekday {
            color: ${theme.text.secondary};
            font-weight: 600;
            font-size: 12px;
          }
        `}</style>

        <DayPicker
          className="horizons-rdp"
          mode="single"
          selected={selected}
          onSelect={handleDaySelect}
          disabled={{ before: new Date() }}
          showOutsideDays={false}
        />

        {/* Time row — custom dropdowns */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px 16px',
          borderTop: `1px solid ${theme.border.light}`,
        }}>
          <span style={{ ...typography.styles.caption, color: theme.text.secondary, whiteSpace: 'nowrap' }}>Time:</span>

          {/* Hour */}
          <div style={{ flex: 1 }}>
            <CustomSelect
              value={hour12}
              options={hourOptions}
              onChange={(v) => {
                const h = parseInt(v, 10);
                setHour12(h);
                if (selected) emit(selected, h, ampm, minute);
              }}
            />
          </div>

          <span style={{ color: theme.text.secondary, fontWeight: 700 }}>:</span>

          {/* Minute */}
          <div style={{ flex: 1 }}>
            <CustomSelect
              value={minute}
              options={minuteOptions}
              onChange={(v) => {
                const m = parseInt(v, 10);
                setMinute(m);
                if (selected) emit(selected, hour12, ampm, m);
              }}
            />
          </div>

          {/* AM/PM */}
          <CustomSelect
            value={ampm}
            options={ampmOptions}
            width={72}
            onChange={(v) => {
              const ap = v as 'AM' | 'PM';
              setAmpm(ap);
              if (selected) emit(selected, hour12, ap, minute);
            }}
          />
        </div>
      </div>

      {selected && !timeError && (
        <p style={{ ...typography.styles.caption, color: theme.text.secondary, marginTop: '6px' }}>
          Blooms on {selected.toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {previewTime}
        </p>
      )}

      {timeError && (
        <p style={{ ...typography.styles.caption, color: '#DC2626', marginTop: '6px' }}>
          ⚠ {timeError}
        </p>
      )}

      {error && !timeError && (
        <p style={{ ...typography.styles.caption, color: '#DC2626', marginTop: '6px' }}>{error}</p>
      )}
    </div>
  );
};
