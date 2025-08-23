"use client"
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Custom404() {
  const handleReportIssue = () => {
    const subject = "404 Error Report"
    const body = "I encountered a 404 error on: " + window.location.href
    window.open(`mailto:support@yourapp.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank")
  }


  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 p-8">
      <div className="mb-8">
        <img
          src="/404.png"
          alt="404 - Page Not Found"
          className="max-w-xs w-full h-auto select-none pointer-events-none"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>


      <h1 className="text-4xl md:text-6xl font-black text-black mb-12 text-center uppercase tracking-wider">
        Page Not Found
      </h1>


      <div className="flex flex-col sm:flex-row gap-6">
        <Link href="/" passHref>
          <Button>
            Go to Home
          </Button>
        </Link>

        <Button
          onClick={handleReportIssue}
          variant="outline"
        >
          Report this Issue
        </Button>
      </div>

    </div>
  )
}