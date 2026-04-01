import Logo from "./Logo";

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950">
      <div className="relative flex items-center gap-3">
        <Logo compact className="scale-125" />
        <span className="text-3xl font-heading text-white">Justix</span>
      </div>
    </div>
  );
};

export default Preloader;
