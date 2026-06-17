import { difficultyDictionary, resourceDictionary, weatherDictionary, weightDictionary } from '../lib/echoMoodCodec'
import type { DifficultyCode, ResourceCode, WeatherCode, WeightCode } from '../lib/echoMoodCodec'
import type { EchoMood } from '../types/domain'

const weights = { balloon: 270, bag: 180, suitcase: 0, rock: 90 } as const
const resources = { r1: 270, r2: 315, r3: 0, r4: 45, r5: 90, r6: 135, r7: 180, r8: 225 } as const
const difficulties = { d1: 292.5, d2: 337.5, d3: 22.5, d4: 67.5, d5: 112.5, d6: 157.5, d7: 202.5, d8: 247.5 } as const
const focusAngles = { ...resources, ...difficulties } as const
const radii = { weight: 72, resources: 126, difficulties: 178, focus: 220 }
const center = 250

const cellIds = {
  weight: { balloon: 'W01', bag: 'W02', suitcase: 'W03', rock: 'W04' },
  resources: { r1: 'R01', r2: 'R02', r3: 'R03', r4: 'R04', r5: 'R05', r6: 'R06', r7: 'R07', r8: 'R08' },
  difficulties: { d1: 'D01', d2: 'D02', d3: 'D03', d4: 'D04', d5: 'D05', d6: 'D06', d7: 'D07', d8: 'D08' },
} as const
const weatherCells: Record<WeatherCode, string> = { sun: 'C01', clear: 'C02', variable: 'C03', cloudy: 'C04', rain: 'C05', storm: 'C06' }

function polar(radius: number, angle: number) {
  const rad = (angle - 90) * Math.PI / 180
  return { x: center + radius * Math.cos(rad), y: center + radius * Math.sin(rad) }
}

function ResonanceCell({ ring, id, cellId, sector, angle, radius, emoji, active, focus = false }: { ring: string; id: string; cellId: string; sector: number; angle: number; radius: number; emoji: string; active: boolean; focus?: boolean }) {
  const point = polar(radius, angle)
  return <g className={`resonance-cell ${ring} ${active ? 'active' : 'empty'} ${focus ? 'focus' : ''}`} data-ring={ring} data-sector={sector} data-cell-id={cellId} data-id={id} data-active={active ? 'true' : 'false'} transform={`translate(${point.x} ${point.y})`}>
    <circle className="cell-bubble" r={active ? (focus ? 30 : 24) : 6} />
    <text textAnchor="middle" dominantBaseline="central" fontSize={active ? (focus ? 26 : 32) : 13}>{active ? (focus ? `⭐${emoji}` : emoji) : '○'}</text>
  </g>
}

export function EchoMoodRosace({ echoMood, variant = 'single', showLegend = false }: { echoMood: EchoMood; variant?: 'single' | 'summary'; showLegend?: boolean; animated?: boolean; frequencies?: Record<string, number>; recentIds?: string[] }) {
  const daily = echoMood.dailyCard
  return <div className={`echomood-rosace resonance-mandala ${variant}`}>
    <svg viewBox="0 0 500 500" role="img" aria-label="Mandala de résonance EchoMood">
      <defs>
        <radialGradient id="mandalaBg"><stop offset="0" stopColor="#fff9df" stopOpacity=".24"/><stop offset=".52" stopColor="#73d8ff" stopOpacity=".08"/><stop offset="1" stopColor="#ffffff" stopOpacity=".02"/></radialGradient>
      </defs>
      <circle className="mandala-bg" cx={center} cy={center} r="238" fill="url(#mandalaBg)" />
      {[radii.weight, radii.resources, radii.difficulties, radii.focus].map((radius) => <circle key={radius} className="mandala-ring" cx={center} cy={center} r={radius} />)}
      {Object.entries(weights).map(([id, angle], index) => <ResonanceCell key={id} ring="weight" id={id} cellId={cellIds.weight[id as WeightCode]} sector={index + 1} angle={angle} radius={radii.weight} emoji={weightDictionary[id as WeightCode].emoji} active={echoMood.weight === id} />)}
      {Object.entries(resources).map(([id, angle], index) => <ResonanceCell key={id} ring="resources" id={id} cellId={cellIds.resources[id as ResourceCode]} sector={index + 1} angle={angle} radius={radii.resources} emoji={resourceDictionary[id as ResourceCode].emoji} active={echoMood.selectedResources.includes(id as ResourceCode)} />)}
      {Object.entries(difficulties).map(([id, angle], index) => <ResonanceCell key={id} ring="difficulties" id={id} cellId={cellIds.difficulties[id as DifficultyCode]} sector={index + 1} angle={angle} radius={radii.difficulties} emoji={difficultyDictionary[id as DifficultyCode].emoji} active={echoMood.selectedDifficulties.includes(id as DifficultyCode)} />)}
      {Object.entries(focusAngles).map(([id, angle], index) => {
        const emoji = id.startsWith('r') ? resourceDictionary[id as ResourceCode].emoji : difficultyDictionary[id as DifficultyCode].emoji
        return <ResonanceCell key={`focus-${id}`} ring="focus" id={id} cellId={`F${String(index + 1).padStart(2, '0')}`} sector={index + 1} angle={angle} radius={radii.focus} emoji={emoji} active={daily === id} focus />
      })}
      <g className="mandala-center" data-ring="center" data-sector="0" data-cell-id={weatherCells[echoMood.weather]} data-id={echoMood.weather} data-active="true">
        <circle cx={center} cy={center} r="46" />
        <text x={center} y={center} textAnchor="middle" dominantBaseline="central" fontSize="58">{weatherDictionary[echoMood.weather].emoji}</text>
      </g>
    </svg>
    {showLegend && <p className="rosace-legend">Centre météo · anneaux concentriques traitement, ressources, difficultés et focus. Les bulles vides restent des repères de lecture.</p>}
  </div>
}
