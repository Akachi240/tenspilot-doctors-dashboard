import { Variants } from 'framer-motion'

// "Calm, precise, fast" - Doctor Dashboard Animation Tokens
export const clinicalTransitions = {
  fast: { type: 'tween', duration: 0.15, ease: 'easeOut' },
  smooth: { type: 'tween', duration: 0.25, ease: [0.16, 1, 0.3, 1] },
}

export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: clinicalTransitions.smooth as unknown as object
  }
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}
