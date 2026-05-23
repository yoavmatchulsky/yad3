import Logo from "./Logo";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3">
      <div className="max-w-6xl mx-auto">
        <Logo />
      </div>
    </header>
  );
}
