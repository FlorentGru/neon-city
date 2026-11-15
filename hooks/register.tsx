import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE } from './scene'

// Néon City : une palette de nuit, surfaces bleu-violet très sombres, néons cyan et magenta.
const { theme, problems } = makeColors({
  label: 'Néon City',
  only: 'dark',
  roles: { accent: '#22e4ff', danger: '#ff3b5c', success: '#39ff88', warning: '#ffb020', pro: '#ff2bd6' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0b0a1a',
        'surface-1': '#12112a',
        'surface-2': '#171536',
        'surface-3': '#1c1a3e',
        'text-primary': '#ecebff',
        'text-secondary': '#c4c2ea',
        'text-muted': '#9a97c8',
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'neon-city', glass: { blur: 14, tint: '#0b0a1a', opacity: 0.55 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  // La scène animée derrière la conversation, sur desktop et mobile.
  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Une ville la nuit sous la pluie, avec des enseignes au néon" isInteractive />
  })
}
