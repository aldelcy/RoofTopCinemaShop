import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1>Not found</h1>
      <p>That screening is not in the demo list.</p>
      <Link className="button" href="/">
        Back to movies
      </Link>
    </>
  );
}
