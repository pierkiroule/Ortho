import { difficultyDictionary, resourceDictionary, weatherDictionary, weightDictionary } from '../lib/echoMoodCodec'
import type { DifficultyCode, ResourceCode } from '../lib/echoMoodCodec'
import type { EchoMood } from '../types/domain'

const weights = { balloon: 270, bag: 180, suitcase: 0, rock: 90 } as const
const resources = { r1: 270, r2: 315, r3: 0, r4: 45, r5: 90, r6: 135, r7: 180, r8: 225 } as const
const difficulties = { d1: 292.5, d2: 337.5, d3: 22.5, d4: 67.5, d5: 112.5, d6: 157.5, d7: 202.5, d8: 247.5 } as const
const radii = { weight: 70, resources: 125, difficulties: 180 }

function polar(radius: number, angle: number) {
  const rad = (angle - 90) * Math.PI / 180
  return { x: 220 + radius * Math.cos(rad), y: 220 + radius * Math.sin(rad) }
}

function Cell({ ring, id, angle, radius, emoji, active, priority, opacity }: { ring: string; id: string; angle: number; radius: number; emoji: string; active: boolean; priority?: boolean; opacity?: number }) {
  const point = polar(radius, angle)
  return <g className={`rosace-cell ${ring} ${active ? 'active' : 'inactive'} ${priority ? 'priority' : ''}`} data-ring={ring} data-id={id} data-active={active ? 'true' : 'false'} transform={`translate(${point.x} ${point.y})`} style={{ '--cell-opacity': opacity } as React.CSSProperties}>
    <circle r={priority ? 24 : 19} />
    <text textAnchor="middle" dominantBaseline="central" fontSize={priority ? 28 : 22}>{emoji}</text>
    {priority && <><circle className="priority-ring" r="29" /><text className="star" x="23" y="-20" fontSize="15">⭐</text></>}
  </g>
}

export function EchoMoodRosace({ echoMood, variant = 'single', showLegend = false, animated = true, frequencies, recentIds = [] }: { echoMood: EchoMood; variant?: 'single' | 'summary'; showLegend?: boolean; animated?: boolean; frequencies?: Record<string, number>; recentIds?: string[] }) {
  const daily = echoMood.dailyCard
  const frequency = (id: string) => variant === 'summary' ? Math.max(0.18, frequencies?.[id] ?? 0.18) : undefined
  return <div className={`echomood-rosace ${variant} ${animated ? 'animated' : ''}`}>
    <svg viewBox="0 0 440 440" role="img" aria-label="Rosace EchoMood codée">
      <defs><radialGradient id="rosaceBg"><stop offset="0" stopColor="#fff7d6" stopOpacity=".28"/><stop offset="1" stopColor="#73d8ff" stopOpacity=".05"/></radialGradient></defs>
      <circle className="rosace-bg" cx="220" cy="220" r="210" fill="url(#rosaceBg)" />
      {[70, 125, 180].map((radius) => <circle key={radius} className="rosace-orbit" cx="220" cy="220" r={radius} />)}
      {Object.entries(weights).map(([id, angle]) => <Cell key={id} ring="weight" id={id} angle={angle} radius={radii.weight} emoji={weightDictionary[id as keyof typeof weightDictionary].emoji} active={echoMood.weight === id} priority={daily === id} opacity={frequency(id)} />)}
      {Object.entries(resources).map(([id, angle]) => <Cell key={id} ring="resources" id={id} angle={angle} radius={radii.resources} emoji={resourceDictionary[id as ResourceCode].emoji} active={echoMood.selectedResources.includes(id as ResourceCode) || variant === 'summary'} priority={daily === id} opacity={frequency(id)} />)}
      {Object.entries(difficulties).map(([id, angle]) => <Cell key={id} ring="difficulties" id={id} angle={angle} radius={radii.difficulties} emoji={difficultyDictionary[id as DifficultyCode].emoji} active={echoMood.selectedDifficulties.includes(id as DifficultyCode) || variant === 'summary'} priority={daily === id} opacity={frequency(id)} />)}
      {recentIds.map((id, index) => { const angle = resources[id as ResourceCode] ?? difficulties[id as DifficultyCode]; const radius = id.startsWith('r') ? radii.resources : radii.difficulties; const p = polar(radius, angle); return <circle key={`${id}-${index}`} className="recent-halo" cx={p.x} cy={p.y} r="32" /> })}
      <g className="rosace-center" data-ring="center" data-id={echoMood.weather} data-active="true"><circle cx="220" cy="220" r="38"/><text x="220" y="220" textAnchor="middle" dominantBaseline="central" fontSize="36">{weatherDictionary[echoMood.weather].emoji}</text></g>
    </svg>
    {showLegend && <p className="rosace-legend">Centre météo · anneau 1 charge · anneau 2 ressources · anneau 3 difficultés. Positions fixes et décodables.</p>}
  </div>
}
