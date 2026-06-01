export function navigateTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;


    const targetY = el.getBoundingClientRect().top + window.scrollY;
    const lenis   = window.lenisInstance;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (lenis as any)?.reset?.();
    lenis?.start();
    window.scrollTo(0, targetY);
}