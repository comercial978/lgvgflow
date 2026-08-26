export const backtestLastModified = '2026-08-26'

export const backtestAssets = [
  { src: '/assets/backtest/2026-08-26-entradas.png', width: 1680, height: 1050 },
  { src: '/assets/backtest/2026-08-26-resultados.png', width: 1680, height: 1050 },
  { src: '/assets/backtest/2026-08-25-entrada.png', width: 1680, height: 1050 },
  { src: '/assets/backtest/2026-08-25-resultados.png', width: 1680, height: 1050 },
  { src: '/assets/backtest/2026-08-24-entradas.png', width: 1680, height: 1050 },
  { src: '/assets/backtest/2026-08-24-resultados.png', width: 1680, height: 1050 },
  { src: '/assets/backtest/2026-08-21-entradas.png', width: 1680, height: 1050 },
  { src: '/assets/backtest/2026-08-20-entradas.png', width: 1680, height: 1050 },
  { src: '/assets/backtest/2026-08-20-resultados.png', width: 1680, height: 1050 },
] as const

export const backtestSessions = [
  {
    date: '2026-08-26',
    assetIndexes: [0, 1],
    video: '/assets/backtest/2026-08-26-sessao.mp4',
    poster: '/assets/backtest/2026-08-26-entradas.png',
  },
  {
    date: '2026-08-25',
    assetIndexes: [2, 3],
    video: '/assets/backtest/2026-08-25-sessao.mp4',
    poster: '/assets/backtest/2026-08-25-entrada.png',
  },
  { date: '2026-08-24', assetIndexes: [4, 5], video: null, poster: null },
  { date: '2026-08-21', assetIndexes: [6], video: null, poster: null },
  { date: '2026-08-20', assetIndexes: [7, 8], video: null, poster: null },
] as const

export const backtestHomeAssetIndexes = [0, 1, 3] as const
