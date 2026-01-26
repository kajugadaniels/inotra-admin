const AdminMobileHero = () => {
    return (
        <section className="relative lg:hidden">
            <div
                className="relative h-48 w-full bg-cover bg-center"
                style={{ backgroundImage: "url(/login.jpg)" }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
                <div className="relative flex h-full items-end p-6">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75">
                            INOTRA • Admin
                        </p>
                        <p className="mt-1 text-xl font-semibold text-white">Welcome back</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminMobileHero;
