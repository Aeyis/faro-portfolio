export function navigateTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    const offset  = id === "hero" ? 0 : Math.round(window.innerHeight * 0.2);
    const targetY = el.getBoundingClientRect().top + window.scrollY + offset;
    const lenis   = window.lenisInstance;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (lenis as any)?.reset?.();
    lenis?.start();
    window.scrollTo(0, targetY);

    window.dispatchEvent(new CustomEvent("section-navigate", { detail: { id } }));
}