import Link from "next/link";

export default function NotFound() {
  return <main className="space-y-4 p-4"><h1 className="text-xl">Recipe not found</h1><Link className="underline" href="/">Browse recipes</Link></main>;
}
