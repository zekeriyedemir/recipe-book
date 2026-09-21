"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUtensils,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { useSearchParams } from "next/navigation";

function Navbar() {
  const searchQuery = useSearchParams().get("q") ?? "";

  return (
    <header className="border-b border-base-300 bg-base-100 shadow-sm">
      <nav className="navbar mx-auto min-h-24 max-w-7xl px-8">
        <div className="navbar-start">
          <Link
            href="/"
            className="group flex items-center gap-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-content">
              <FontAwesomeIcon icon={faUtensils} className="text-lg" />
            </div>

            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-wide">
                My Recipes
              </span>

              <span className="text-xs uppercase tracking-[0.22em] text-base-content/55">
                Recipes · Cooking · Good Food
              </span>
            </div>
          </Link>
        </div>

        <form action="/" method="get" className="navbar-center">
          <label className="input input-bordered flex w-80 items-center gap-3 bg-base-200">
            <button type="submit" aria-label="Search recipes"><FontAwesomeIcon icon={faMagnifyingGlass} className="text-base-content/45" /></button>

            <input
              type="search"
              name="q"
              key={searchQuery}
              defaultValue={searchQuery}
              maxLength={200}
              aria-label="Search recipes"
              placeholder="Search recipes..."
              className="grow"
            />

            {searchQuery && (
              <Link
                href="/"
                className="btn btn-circle btn-ghost btn-xs"
                aria-label="Clear search"
              >
                <FontAwesomeIcon icon={faXmark} />
              </Link>
            )}
          </label>
        </form>

        <div className="navbar-end"><Link className="btn btn-ghost" href="/cookbook">My cookbook</Link></div>
      </nav>
    </header>
  );
}

export default Navbar;
