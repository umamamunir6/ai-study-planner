import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        
        <Link
          href="/"
          className="text-xl font-bold text-blue-600"
        >
          AI Study Planner
        </Link>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>

          <Link href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>

          <Link href="/planner" className="hover:text-blue-600">
            AI Planner
          </Link>

          <Link href="/subjects" className="hover:text-blue-600">
            Subjects
          </Link>

          <Link href="/tasks" className="hover:text-blue-600">
            Tasks
          </Link>

          <Link href="/calendar" className="hover:text-blue-600">
            Calendar
          </Link>

          <Link href="/health" className="hover:text-blue-600">
            Health
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;