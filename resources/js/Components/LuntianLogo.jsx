export default function LuntianLogo({ className = '', compact = false }) {
    if (compact) {
        return (
            <span
                className={`inline-block text-xl font-extrabold tracking-[0.14em] text-[#f5a623] ${className}`}
                role="img"
                aria-label="LUNTIAN HR Portal"
            >
                LUNTIAN
            </span>
        );
    }

    return (
        <div
            className={`mx-auto w-full max-w-[280px] text-center ${className}`}
            role="img"
            aria-label="LUNTIAN HR Portal"
        >
            <div className="text-[2.15rem] font-extrabold leading-none tracking-[0.14em] text-[#f5a623] sm:text-[2.35rem]">
                LUNTIAN
            </div>
            <div className="mt-2 text-[0.68rem] font-medium tracking-[0.04em] text-slate-500 dark:text-slate-400 sm:text-[0.72rem]">
                Residential Building Design Solutions
            </div>
            <div className="mt-2.5 bg-[#f5a623] px-2 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white sm:text-[0.62rem]">
                • Energy • Building Design • VR • AR
            </div>
        </div>
    );
}
