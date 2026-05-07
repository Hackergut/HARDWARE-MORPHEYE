'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Clock, ChevronDown, ChevronUp, Send, CheckCircle2, MessageSquare, Shield, Truck, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const subjectOptions = [
  'General Inquiry',
  'Order Support',
  'Product Question',
  'Warranty',
  'Returns',
]

const faqs = [
  {
    question: 'Are your hardware wallets genuine and factory-sealed?',
    answer: 'Yes, all our hardware wallets are sourced directly from manufacturers and arrive factory-sealed with tamper-evident packaging. We are an authorized reseller for all brands we carry.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3-5 business days within the US. International orders typically arrive within 7-14 business days. Express shipping options are available at checkout.',
  },
  {
    question: 'What is your return policy?',
    answer: 'Unopened, factory-sealed products can be returned within 30 days of purchase for a full refund. Due to the security nature of hardware wallets, opened devices cannot be returned unless defective.',
  },
  {
    question: 'Do hardware wallets come with a warranty?',
    answer: 'Yes, all hardware wallets include the manufacturer\'s warranty — typically 1-2 years depending on the brand. This covers manufacturing defects but not physical damage or misuse.',
  },
  {
    question: 'Can I track my order?',
    answer: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email. You can also check your order status by contacting our support team with your order number.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit cards (Visa, Mastercard, American Express), PayPal, and select cryptocurrency payments including Bitcoin and Ethereum.',
  },
]

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setIsSuccess(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
      }
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center"
          >
            <CheckCircle2 className="size-10 text-cyan-500" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Message Sent!</h2>
            <p className="text-muted-foreground">
              Thank you for reaching out. Our team will review your message and get back to you within 24 hours.
            </p>
          </div>
          <Button
            onClick={() => setIsSuccess(false)}
            className="bg-cyan-500 text-black hover:bg-cyan-400"
          >
            Send Another Message
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Get in Touch
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Have a question about our products or need support? We&apos;re here to help. 
          Fill out the form below and we&apos;ll get back to you as soon as possible.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="rounded-xl border border-border bg-card/50 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <MessageSquare className="size-5 text-cyan-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Send us a Message</h2>
                <p className="text-xs text-muted-foreground">All fields are required</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="text-sm text-muted-foreground">
                    Name
                  </Label>
                  <Input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="border-border bg-muted/50 text-white placeholder:text-muted-foreground focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="text-sm text-muted-foreground">
                    Email
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="border-border bg-muted/50 text-white placeholder:text-muted-foreground focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="contact-subject" className="text-sm text-muted-foreground">
                  Subject
                </Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => handleChange('subject', value)}
                >
                  <SelectTrigger
                    className="w-full border-border bg-muted/50 text-white focus:border-cyan-500 focus:ring-cyan-500/20"
                  >
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-card text-white">
                    {subjectOptions.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="focus:bg-neutral-800 focus:text-cyan-400"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && (
                  <p className="text-xs text-red-400">{errors.subject}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="contact-message" className="text-sm text-muted-foreground">
                  Message
                </Label>
                <Textarea
                  id="contact-message"
                  placeholder="Tell us how we can help..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="border-border bg-muted/50 text-white placeholder:text-muted-foreground focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20 resize-none"
                />
                {errors.message && (
                  <p className="text-xs text-red-400">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="size-4 rounded-full border-2 border-black/30 border-t-black"
                    />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="size-4" />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Sidebar - Contact Info & FAQ */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Contact Info Card */}
          <div className="rounded-xl border border-border bg-card/50 p-6 space-y-5">
            <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <Mail className="size-4 text-cyan-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Email</p>
                  <a
                    href="mailto:support@morpheye.com"
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    support@morpheye.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <Clock className="size-4 text-cyan-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Response Time</p>
                  <p className="text-sm text-muted-foreground">Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Card */}
          <div className="rounded-xl border border-border bg-card/50 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <Shield className="size-4 text-cyan-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-muted/30 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {index === 0 && <Shield className="size-3.5 shrink-0 text-muted-foreground" />}
                      {index === 1 && <Truck className="size-3.5 shrink-0 text-muted-foreground" />}
                      {index === 2 && <RotateCcw className="size-3.5 shrink-0 text-muted-foreground" />}
                      {index === 3 && <Shield className="size-3.5 shrink-0 text-muted-foreground" />}
                      {index === 4 && <Truck className="size-3.5 shrink-0 text-muted-foreground" />}
                      {index === 5 && <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />}
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  {openFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-3"
                    >
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
