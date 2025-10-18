export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm font-semibold">
          Brevito
        </div>
      </nav>
      <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5 items-center justify-center">
        <p>Hello, Brevito!</p>
      </div>
      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
        <p>Built with Next.js and Supabase</p>
      </footer>
    </div>
  );
}