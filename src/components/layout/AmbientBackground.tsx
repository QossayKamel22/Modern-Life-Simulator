export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="ambient-orb absolute -left-32 -top-32 h-[32rem] w-[32rem] rounded-full"
        style={{ background: "var(--orb-1)", animationDelay: "0s" }}
      />
      <div
        className="ambient-orb absolute -right-40 top-1/4 h-[36rem] w-[36rem] rounded-full"
        style={{ background: "var(--orb-2)", animationDelay: "-8s" }}
      />
      <div
        className="ambient-orb absolute bottom-[-10rem] left-1/3 h-[30rem] w-[30rem] rounded-full"
        style={{ background: "var(--orb-3)", animationDelay: "-16s" }}
      />
    </div>
  );
}
