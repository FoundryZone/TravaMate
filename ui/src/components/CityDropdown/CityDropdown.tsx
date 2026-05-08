'use client';

import { useState, useRef, useEffect } from 'react';
import type { DestinationCity } from '@/types/citiesRoute';
import styles from './CityDropdown.module.css';

interface CityDropdownProps {
  availableCities: DestinationCity[];
  selectedIds: string[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function CityDropdown({
  availableCities,
  selectedIds,
  onAdd,
  onRemove,
}: CityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = availableCities.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  function openDropdown() {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function toggleDropdown() {
    if (isOpen) {
      setIsOpen(false);
      setQuery('');
    } else {
      openDropdown();
    }
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
        onClick={toggleDropdown}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.searchIcon}>🔍</span>
        <input
          ref={inputRef}
          className={styles.input}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Select or search cities..."
          onClick={e => { e.stopPropagation(); if (!isOpen) openDropdown(); }}
          readOnly={!isOpen}
        />
        <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <ul className={styles.dropdown} role="listbox">
          {filtered.length === 0 ? (
            <li className={styles.noResults}>No cities found</li>
          ) : (
            filtered.map(city => {
              const isAdded = selectedIds.includes(city.id);
              return (
                <li
                  key={city.id}
                  className={styles.option}
                  role="option"
                  aria-selected={isAdded}
                >
                  <div className={styles.cityInfo}>
                    <span className={styles.cityAvatar}>{city.emoji}</span>
                    <span className={styles.cityName}>{city.name}</span>
                  </div>
                  <button
                    className={`${styles.actionBtn} ${isAdded ? styles.removeBtn : styles.addBtn}`}
                    onClick={e => {
                      e.stopPropagation();
                      isAdded ? onRemove(city.id) : onAdd(city.id);
                    }}
                  >
                    {isAdded ? '× Remove' : '+ Add'}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
