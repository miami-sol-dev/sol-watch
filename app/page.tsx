const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-zinc-900 to-black">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-white">
          Sol<span className="text-purple-500">Watch</span>
        </h1>
        <p className="text-xl text-gray-400">
          Real-time Solana arbitrage scanner
        </p>
        <div className="text-sm text-gray-500">
          Week 1: Building in public 🚀
        </div>
      </div>
    </main>
  );
};

export default Home;