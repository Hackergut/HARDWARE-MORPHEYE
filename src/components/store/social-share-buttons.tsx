'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Share2,
  Facebook,
  Twitter,
  Telegram,
  Send,
  Link,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SocialShareButtonsProps {
  url: string
  title: string
  className?: string
}

export function SocialShareButtons({ url, title, className }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
  }

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [url])

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Share2 className="size-3.5" />
        Share
      </span>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleShare(shareUrls.facebook)}
        className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 transition-colors hover:bg-blue-500/20"
        aria-label="Share on Facebook"
      >
        <Facebook className="size-4" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleShare(shareUrls.twitter)}
        className="flex size-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 transition-colors hover:bg-sky-500/20"
        aria-label="Share on Twitter / X"
      >
        <Twitter className="size-4" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleShare(shareUrls.telegram)}
        className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 transition-colors hover:bg-cyan-500/20"
        aria-label="Share on Telegram"
      >
        <Send className="size-4" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleShare(shareUrls.whatsapp)}
        className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 transition-colors hover:bg-emerald-500/20"
        aria-label="Share on WhatsApp"
      >
        <Telegram className="size-4" />
      </motion.button>

      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCopyLink}
          className={cn(
            'flex size-8 items-center justify-center rounded-lg transition-colors',
            copied
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-muted text-muted-foreground hover:text-foreground'
          )}
          aria-label="Copy link"
        >
          {copied ? <Check className="size-4" /> : <Link className="size-4" />}
        </motion.button>

        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-[10px] font-medium text-background"
          >
            Link copied!
          </motion.span>
        )}
      </div>
    </div>
  )
}
