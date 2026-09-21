"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUtensils,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { useRecipeSearch } from "./SearchProvider";

function Navbar() {
  const { searchQuery, setSearchQuery } = useRecipeSearch();

  return (
    <header className="border-b border-base-300 bg-base-100 shadow-sm">
      <nav className="navbar mx-auto min-h-24 max-w-7xl px-8">
        <div className="navbar-start">
          <Link
            href="/"
            onClick={() => setSearchQuery("")}
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

        <div className="navbar-center">
          <label className="input input-bordered flex w-80 items-center gap-3 bg-base-200">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-base-content/45"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search recipes..."
              className="grow"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="btn btn-circle btn-ghost btn-xs"
                aria-label="Clear search"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </label>
        </div>

        <div className="navbar-end" />
      </nav>
    </header>
  );
}

export default Navbar;
