const UsersHeader = () => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-8">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
                Users
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
                User directory
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                Review all user accounts, filter by status, and sort the latest activity.
            </p>
        </div>
    );
};

export default UsersHeader;
