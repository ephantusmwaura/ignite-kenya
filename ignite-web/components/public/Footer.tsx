import Link from "next/link";
import Image from "next/image";
import logo from "@/components/assets/logo.png";

export function Footer() {
    return (
        <footer className="bg-secondary text-secondary-foreground py-12 border-t border-border mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand */}
                <div className="space-y-4">
                    <Link href="/" className="inline-block">
                        <Image
                            src={logo}
                            alt="Ignite Kenya Logo"
                            width={120}
                            height={120}
                            className="object-contain"
                        />
                    </Link>
                    <p className="text-sm text-muted">
                        Empowering youth through art to influence decision-making and social change.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-semibold mb-4">Explore</h3>
                    <ul className="space-y-2 text-sm text-muted">
                        <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                        <li><Link href="/programs" className="hover:text-primary">Our Programs</Link></li>
                        <li><Link href="/projects" className="hover:text-primary">Projects</Link></li>
                        <li><Link href="/gallery" className="hover:text-primary">Gallery</Link></li>
                        <li><Link href="/articles" className="hover:text-primary">Articles</Link></li>
                        <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
                    </ul>
                </div>

                {/* Action */}
                <div>
                    <h3 className="font-semibold mb-4">Get Involved</h3>
                    <ul className="space-y-2 text-sm text-muted">
                        <li><Link href="/donate" className="hover:text-primary">Donate</Link></li>
                        <li><Link href="/events" className="hover:text-primary">View Our Events</Link></li>
                        <li><Link href="/volunteer" className="hover:text-primary">Volunteer</Link></li>
                        <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-semibold mb-4">Contact</h3>
                    <ul className="space-y-2 text-sm text-muted">
                        <li>Nakuru County, Kenya</li>
                        <li>info@ignitekenya.org</li>
                        <li>+254 700 000 000</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-border/20 text-center text-xs text-muted">
                &copy; {new Date().getFullYear()} Ignite Kenya. All rights reserved.
            </div>
        </footer>
    );
}
