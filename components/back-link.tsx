import Link from "next/link";

export function BackLink({ href, children }: { href: string; children: string }) {
  return (
    <p className="back-row">
      <Link className="back" href={href}>
        {children}
      </Link>
    </p>
  );
}
