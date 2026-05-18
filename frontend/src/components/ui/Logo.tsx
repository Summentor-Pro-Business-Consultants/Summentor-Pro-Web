import Link from "next/link";

interface LogoProps {
  height?: number;
}

export default function Logo({ height = 64 }: LogoProps) {
  return (
    <Link href="/" className="flex items-center no-underline" aria-label="Summentor Pro home">
      <img
        src="/Summentor%20pro%20logo.png"
        alt="Summentor Pro"
        style={{ height, width: "auto", display: "block" }}
      />
    </Link>
  );
}
