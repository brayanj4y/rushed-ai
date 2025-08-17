"use client"
import Link from 'next/link'

export default function Custom404() {
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
        <Link
          href="/"
          className="group relative bg-white text-black px-8 py-4 font-bold text-lg uppercase tracking-wide border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] active:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 transform active:scale-95"
        >
          Go to Home
        </Link>

        <button
          onClick={() => window.open('mailto:support@yourapp.com?subject=404 Error Report&body=I encountered a 404 error on: ' + window.location.href, '_blank')}
          className="group relative bg-black text-white px-8 py-4 font-bold text-lg uppercase tracking-wide border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#666666] hover:shadow-[4px_4px_0px_0px_#666666] active:shadow-[2px_2px_0px_0px_#666666] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 transform active:scale-95"
        >
          Report this Issue
        </button>
      </div>
    </div>
  )
}