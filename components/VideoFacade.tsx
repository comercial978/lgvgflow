'use client'

import { Play } from 'lucide-react'
import { useState } from 'react'

type Props = {
  videoId: string
  playLabel: string
  ariaLabel: string
  imageAlt: string
  iframeTitle: string
}

export function VideoFacade({ videoId, playLabel, ariaLabel, imageAlt, iframeTitle }: Props) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        autoFocus
        referrerPolicy="strict-origin-when-cross-origin"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
        title={iframeTitle}
      />
    )
  }

  return (
    <button className="video-facade" type="button" aria-label={ariaLabel} onClick={() => setPlaying(true)}>
      <img src="/assets/video/lgvg-flow-demo.webp" alt={imageAlt} width="405" height="720" loading="lazy" decoding="async" />
      <span className="video-play-control" aria-hidden="true">
        <span className="video-play-icon"><Play fill="currentColor" size={28} /></span>
        <span className="video-play-label">{playLabel}</span>
      </span>
    </button>
  )
}
