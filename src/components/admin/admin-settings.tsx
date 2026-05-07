'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Settings,
  Globe,
  BarChart3,
  Truck,
  Share2,
  Loader2,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { useNotificationStore } from '@/store/notification-store'

interface SettingsMap {
  [key: string]: string
}

interface SectionConfig {
  key: string
  title: string
  description: string
  icon: React.ElementType
  fields: Array<{
    key: string
    label: string
    type?: string
    placeholder?: string
    note?: string
  }>
}

const sections: SectionConfig[] = [
  {
    key: 'general',
    title: 'General',
    description: 'Basic site information',
    icon: Globe,
    fields: [
      { key: 'site_name', label: 'Site Name', placeholder: 'Morpheye' },
      { key: 'tagline', label: 'Tagline', placeholder: 'Premium Hardware Wallets' },
      { key: 'contact_email', label: 'Contact Email', placeholder: 'support@morpheye.com' },
    ],
  },
  {
    key: 'analytics',
    title: 'Analytics',
    description: 'Tracking and analytics configuration',
    icon: BarChart3,
    fields: [
      {
        key: 'meta_pixel_id',
        label: 'Meta Pixel ID',
        placeholder: 'e.g. 123456789',
        note: 'Used for Facebook/ads conversion tracking',
      },
    ],
  },
  {
    key: 'shipping',
    title: 'Shipping & Tax',
    description: 'Shipping fees and tax rates',
    icon: Truck,
    fields: [
      { key: 'currency', label: 'Currency', placeholder: 'USD' },
      { key: 'shipping_fee', label: 'Shipping Fee', type: 'number', placeholder: '9.99' },
      { key: 'free_shipping_threshold', label: 'Free Shipping Threshold', type: 'number', placeholder: '150' },
      { key: 'tax_rate', label: 'Tax Rate %', type: 'number', placeholder: '0' },
    ],
  },
  {
    key: 'social',
    title: 'Social Links',
    description: 'Social media and community links',
    icon: Share2,
    fields: [
      { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/morpheye' },
      { key: 'twitter_url', label: 'Twitter/X URL', placeholder: 'https://twitter.com/morpheye' },
      { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/morpheye' },
      { key: 'telegram_url', label: 'Telegram URL', placeholder: 'https://t.me/morpheye' },
    ],
  },
]

export function AdminSettings() {
  const [settings, setSettings] = useState<SettingsMap>({})
  const [originalSettings, setOriginalSettings] = useState<SettingsMap>({})
  const [loading, setLoading] = useState(true)
  const [savingSections, setSavingSections] = useState<Set<string>>(new Set())
  const showNotification = useNotificationStore((s) => s.show)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const json = await res.json()
        const settingsMap = json.settings || {}
        setSettings(settingsMap)
        setOriginalSettings(settingsMap)
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleFieldChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSection = async (section: SectionConfig) => {
    setSavingSections((prev) => new Set(prev).add(section.key))
    let hasError = false

    for (const field of section.fields) {
      const value = settings[field.key] ?? ''
      const originalValue = originalSettings[field.key] ?? ''

      if (value !== originalValue) {
        try {
          const res = await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: field.key, value }),
          })
          if (!res.ok) {
            hasError = true
            break
          }
        } catch {
          hasError = true
          break
        }
      }
    }

    if (hasError) {
      showNotification('Failed to save some settings', 'error')
    } else {
      setOriginalSettings((prev) => {
        const updated = { ...prev }
        for (const field of section.fields) {
          updated[field.key] = settings[field.key] ?? ''
        }
        return updated
      })
      showNotification(`${section.title} settings saved`, 'success')
    }

    setSavingSections((prev) => {
      const next = new Set(prev)
      next.delete(section.key)
      return next
    })
  }

  const hasChanges = (section: SectionConfig) => {
    return section.fields.some(
      (field) =>
        (settings[field.key] ?? '') !== (originalSettings[field.key] ?? '')
    )
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-8 w-40 bg-neutral-800" />
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] rounded-xl bg-neutral-800" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white md:text-2xl">Settings</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Configure your store settings
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon
          const isSaving = savingSections.has(section.key)
          const changed = hasChanges(section)

          return (
            <Card
              key={section.key}
              className="border-neutral-800 bg-neutral-900"
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
                  <Icon className="size-4 text-cyan-400" />
                  {section.title}
                </CardTitle>
                <CardDescription className="text-sm text-neutral-400">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label
                      htmlFor={field.key}
                      className="text-sm text-neutral-300"
                    >
                      {field.label}
                    </Label>
                    <Input
                      id={field.key}
                      type={field.type || 'text'}
                      value={settings[field.key] ?? ''}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                      placeholder={field.placeholder}
                      className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                    />
                    {field.note && (
                      <p className="text-xs text-neutral-500">{field.note}</p>
                    )}
                  </div>
                ))}

                <div className="flex items-center justify-end gap-3 pt-2">
                  {changed && (
                    <span className="text-xs text-amber-500">
                      Unsaved changes
                    </span>
                  )}
                  <Button
                    onClick={() => handleSaveSection(section)}
                    disabled={isSaving || !changed}
                    className="bg-cyan-500 text-black font-semibold hover:bg-cyan-400 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="size-4" />
                        Save Changes
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
