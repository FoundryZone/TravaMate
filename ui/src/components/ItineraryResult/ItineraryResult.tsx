'use client';

import { MOCK_SPITI } from '@/data/mockSpiti';
import styles from './ItineraryResult.module.css';

interface ItineraryResultProps {
  onModify: () => void;
}

export default function ItineraryResult({ onModify }: ItineraryResultProps) {
  const data = MOCK_SPITI;

  return (
    <div className={styles.page}>

      {/* ── Top Tab Nav ── */}
      <nav className={styles.tabNav}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.tabActive}`}>Itinerary</button>
          <button className={styles.tab} disabled>🔒 Stays</button>
          <button className={styles.tab} disabled>🔒 Activities</button>
          <button className={styles.tab} disabled>🔒 Restaurants</button>
        </div>
        <button className={styles.modifyBtn} onClick={onModify}>
          ← Modify Plan
        </button>
      </nav>

      <div className={styles.body}>

        {/* ── Hero ── */}
        <div className={styles.hero}>
          <img
            src={data.coverImage}
            alt={data.destination}
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay}>
            <div className={styles.heroBadge}>✨ AI Generated</div>
            <h1 className={styles.heroTitle}>{data.title}</h1>
            <div className={styles.heroStats}>
              <span>📍 {data.destination}</span>
              <span>🗓 {data.duration}</span>
              <span>👥 {data.groupSize} people</span>
              <span>💰 {data.budget}</span>
            </div>
          </div>
        </div>

        <div className={styles.container}>

          {/* ── AI Recommendation ── */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>✨ Smart Plan for Your Group</h2>
            <p className={styles.sectionSubtitle}>
              For your group of {data.groupSize} people from Pune with a budget of {data.budget} and a {data.duration} trip, the smartest plan is:
            </p>
            <ul className={styles.summaryList}>
              {data.aiSummary.map((item, i) => (
                <li key={i} className={styles.summaryItem}>
                  <span className={styles.bulletDot} />
                  {item}
                </li>
              ))}
            </ul>
            <div className={styles.aiReason}>
              <span className={styles.aiReasonIcon}>💡</span>
              <p>{data.aiReason}</p>
            </div>
          </section>

          {/* ── Day-by-Day ── */}
          <section>
            <h2 className={styles.sectionTitle}>Recommended {data.duration} Itinerary</h2>

            <div className={styles.timeline}>
              {data.days.map((day) => (
                <article key={day.day} className={styles.dayCard}>
                  <div className={styles.dayCardLeft}>
                    <div className={styles.dayBadge}>Day {day.day}</div>
                    {day.day < data.days.length && <div className={styles.connector} />}
                  </div>

                  <div className={styles.dayCardRight}>
                    <img
                      src={day.image}
                      alt={day.title}
                      className={styles.dayImage}
                      loading="lazy"
                    />
                    <div className={styles.dayContent}>
                      <h3 className={styles.dayTitle}>{day.title}</h3>

                      <div className={styles.dayMeta}>
                        <span className={styles.metaItem}>
                          <span className={styles.metaIcon}>🗺</span>
                          {day.route}
                        </span>
                        {day.travel && (
                          <span className={styles.metaItem}>
                            <span className={styles.metaIcon}>🚌</span>
                            {day.travel.duration}
                          </span>
                        )}
                        {day.accommodation !== '—' && (
                          <span className={styles.metaItem}>
                            <span className={styles.metaIcon}>🏨</span>
                            {day.accommodation}
                          </span>
                        )}
                      </div>

                      <ul className={styles.highlights}>
                        {day.highlights.map((h, i) => (
                          <li key={i} className={styles.highlightItem}>
                            <span className={styles.highlightDot} />
                            {h}
                          </li>
                        ))}
                      </ul>

                      {day.note && (
                        <div className={styles.noteBox}>
                          <span>⚠️</span>
                          <p>{day.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── Budget ── */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>💰 Expected Budget (4 People)</h2>
            <table className={styles.budgetTable}>
              <thead>
                <tr>
                  <th>Expense</th>
                  <th>Approx Cost</th>
                </tr>
              </thead>
              <tbody>
                {data.budgetBreakdown.map((row, i) => (
                  <tr key={i} className={row.isTotal ? styles.totalRow : ''}>
                    <td>{row.item}</td>
                    <td className={styles.amountCell}>{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* ── Saving Tips ── */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>💡 How to Keep It Under ₹1 Lakh</h2>
            <ul className={styles.tipsList}>
              {data.savingTips.map((tip, i) => (
                <li key={i} className={styles.tipItem}>
                  <span className={styles.tipCheck}>✓</span>
                  {tip}
                </li>
              ))}
            </ul>
            <div className={styles.savingResult}>
              <p>Then you can realistically achieve:</p>
              <div className={styles.savingStats}>
                <div className={styles.savingStat}>
                  <span className={styles.savingStatValue}>₹22k–25k</span>
                  <span className={styles.savingStatLabel}>Per person</span>
                </div>
                <div className={styles.savingStatDivider} />
                <div className={styles.savingStat}>
                  <span className={styles.savingStatValue}>₹90k–1L</span>
                  <span className={styles.savingStatLabel}>Total (4 people)</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Best Months ── */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>📅 Best Months to Visit</h2>
            <div className={styles.monthsRow}>
              {data.bestMonths.map((m) => (
                <div
                  key={m.month}
                  className={`${styles.monthBadge} ${m.recommended ? styles.monthGood : styles.monthAvoid}`}
                >
                  {m.recommended ? '✓' : '✗'} {m.month}
                </div>
              ))}
            </div>
            <p className={styles.monthNote}>
              Avoid peak monsoon uncertainty and extreme winter unless experienced.
            </p>
          </section>

          {/* ── Health Tips ── */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>🏥 Important Health Tips</h2>
            <p className={styles.healthWarning}>Spiti altitude is serious — prepare accordingly.</p>
            <div className={styles.healthGrid}>
              <div className={styles.healthCol}>
                <h3 className={styles.healthColTitle}>✅ Carry</h3>
                <ul className={styles.healthList}>
                  {data.healthTips.carry.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.healthCol}>
                <h3 className={styles.healthColTitle}>❌ Avoid</h3>
                <ul className={styles.healthList}>
                  {data.healthTips.avoid.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── Final Recommendation ── */}
          <section className={`${styles.card} ${styles.finalCard}`}>
            <h2 className={styles.sectionTitle}>🎒 My Recommendation for Your Group</h2>
            <p className={styles.finalSubtitle}>For a first Spiti trip:</p>
            <ul className={styles.finalList}>
              {data.finalRecommendation.map((item, i) => (
                <li key={i} className={styles.finalItem}>
                  <span className={styles.finalNumber}>{i + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className={styles.finalOutcome}>
              <p>This gives you:</p>
              <div className={styles.outcomeGrid}>
                {['Good comfort', 'Controlled budget', 'Proper acclimatization', 'Enough sightseeing without exhaustion'].map((o, i) => (
                  <div key={i} className={styles.outcomeItem}>
                    <span className={styles.outcomeCheck}>✓</span>
                    {o}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <div className={styles.cta}>
            <button className={styles.modifyPlanBtn} onClick={onModify}>
              ← Modify Plan
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
