import { ShieldCheck } from "lucide-react";

const AdminHeroPanel = () => {
    return (
        <section className="relative hidden min-h-[520px] lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.10),transparent_50%),linear-gradient(135deg,rgba(0,0,0,0.65),rgba(0,0,0,0.20))]" />

            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url(/login.jpg)" }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />

            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            <div className="relative flex h-full flex-col justify-between p-10">
                <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
                        <ShieldCheck className="h-5 w-5 text-white/90" />
                    </div>
                    <div className="leading-tight">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                            INOTRA
                        </p>
                        <p className="text-sm font-semibold text-white/90">Admin Portal</p>
                    </div>
                </div>

                <div className="max-w-md space-y-4">
                    <h1 className="text-balance text-4xl font-semibold tracking-tight text-white">
                        Control, insight, and secure access.
                    </h1>
                    <p className="text-sm leading-relaxed text-white/70">
                        Manage operations with confidence. Only approved administrator
                        accounts can access this workspace.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AdminHeroPanel;
