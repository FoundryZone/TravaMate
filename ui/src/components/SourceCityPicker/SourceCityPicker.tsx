'use client';

import { useState, useRef, useEffect } from 'react';
import type { SourceAirport } from '@/types/citiesRoute';
import { SOURCE_AIRPORTS } from '@/data/sourceAirports';
import styles from './SourceCityPicker.module.css';

interface SourceCityPickerProps {
  value: SourceAirport | null;
  onChange: (airport: SourceAirport | null) => void;
}

export default function SourceCityPicker({ value, onChange }: SourceCityPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = SOURCE_AIRPORTS.filter(a => {
    const q = query.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.iata.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
    );
  });

  function openDropdown() {
    setIsOpen(true);
    setQuery('');
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function select(airport: SourceAirport) {
    onChange(airport);
    setIsOpen(false);
    setQuery('');
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={openDropdown}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.planeIcon}>✈</span>

        {isOpen ? (
          <input
            ref={inputRef}
            className={styles.searchInput}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search city or airport code..."
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className={`${styles.valueText} ${!value ? styles.placeholder : ''}`}>
            {value
              ? `${value.name} ${value.country}`
              : 'Select your departure city'}
          </span>
        )}

        {value && !isOpen && (
          <span className={styles.iataTag}>{value.iata}</span>
        )}

        <div className={styles.controls}>
          {value && (
            <button className={styles.clearBtn} onClick={clear} aria-label="Clear selection">
              ×
            </button>
          )}
          <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
        </div>
      </div>

      {isOpen && (
        <ul className={styles.dropdown} role="listbox">
          {filtered.length === 0 ? (
            <li className={styles.noResults}>No airports found</li>
          ) : (
            filtered.map(airport => (
              <li
                key={airport.id}
                className={`${styles.option} ${value?.id === airport.id ? styles.optionSelected : ''}`}
                role="option"
                aria-selected={value?.id === airport.id}
                onClick={() => select(airport)}
              >
                <span className={styles.optionName}>{airport.name} {airport.country}</span>
                <span className={styles.optionIata}>{airport.iata}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
