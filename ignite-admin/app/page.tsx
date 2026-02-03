import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to /login for admin
  redirect('/login');
}
