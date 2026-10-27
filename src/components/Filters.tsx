import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import {
  ages,
  emptyFilters,
  levels,
  sports,
  type Filters as FilterState,
} from '@/features/events/model';
import { SportIcon } from './SportIcon';
export function Filters({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (value: FilterState) => void;
}) {
  const patch = (data: Partial<FilterState>) => onChange({ ...value, ...data });
  return (
    <section className="filter-panel" aria-label="Treffen filtern">
      <div className="search-row">
        <label className="search-field">
          <Search size={20} />
          <span className="sr-only">Treffen suchen</span>
          <input
            type="search"
            placeholder="Sport, Treffen oder Treffpunkt suchen"
            value={value.query}
            onChange={(e) => patch({ query: e.target.value })}
          />
        </label>
        <label className="period">
          <span className="sr-only">Zeitraum</span>
          <select
            value={value.period}
            onChange={(e) => patch({ period: e.target.value as FilterState['period'] })}
          >
            <option value="">Jederzeit</option>
            <option value="today">Heute</option>
            <option value="tomorrow">Morgen</option>
            <option value="week">Diese Woche</option>
            <option value="date">Datum wählen</option>
          </select>
        </label>
      </div>
      {value.period === 'date' && (
        <label className="date-filter">
          Datum
          <input type="date" value={value.date} onChange={(e) => patch({ date: e.target.value })} />
        </label>
      )}
      <div className="sport-filters" aria-label="Sportarten">
        <button
          className={`chip ${!value.sports.length ? 'chosen' : ''}`}
          aria-pressed={!value.sports.length}
          onClick={() => patch({ sports: [] })}
        >
          Alle Sportarten
        </button>
        {sports.map((sport) => (
          <button
            key={sport}
            className={`chip ${value.sports.includes(sport) ? 'chosen' : ''}`}
            aria-pressed={value.sports.includes(sport)}
            onClick={() =>
              patch({
                sports: value.sports.includes(sport)
                  ? value.sports.filter((s) => s !== sport)
                  : [...value.sports, sport],
              })
            }
          >
            <SportIcon sport={sport} size={18} />
            {sport}
          </button>
        ))}
      </div>
      <details className="more-filters">
        <summary>
          <SlidersHorizontal size={16} /> Weitere Filter
          {value.level || value.ageGroup ? ' · aktiv' : ''}
        </summary>
        <div className="filter-options">
          <label>
            Niveau
            <select value={value.level} onChange={(e) => patch({ level: e.target.value })}>
              <option value="">Jedes Niveau</option>
              {levels
                .filter((l) => l !== 'Alle Niveaus')
                .map((level) => (
                  <option key={level}>{level}</option>
                ))}
            </select>
          </label>
          <label>
            Altersgruppe
            <select value={value.ageGroup} onChange={(e) => patch({ ageGroup: e.target.value })}>
              <option value="">Jedes Alter</option>
              {ages.map((age) => (
                <option key={age}>{age}</option>
              ))}
            </select>
          </label>
          <button
            className="text-button"
            onClick={() => onChange({ ...emptyFilters, mine: value.mine })}
          >
            <RotateCcw size={15} /> Filter zurücksetzen
          </button>
        </div>
      </details>
    </section>
  );
}
