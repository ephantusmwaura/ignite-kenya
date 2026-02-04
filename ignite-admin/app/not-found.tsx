import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-gray-200">404</h1>
                <h2 className="mt-4 text-2xl font-semibold text-gray-800">Page not found</h2>
                <p className="mt-2 text-gray-600">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
                <Link
                    href="/dashboard"
                    className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    )
}
