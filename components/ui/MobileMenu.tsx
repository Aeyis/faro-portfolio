"use client";

import Script from "next/script";

export default function MobileMenu() {
    return (
        <Script id="mobile-menu-btn" strategy="afterInteractive">{`
            (function() {
                var btn = null;
                var open = false;

                function createBtn() {
                    if (btn) return;

                    btn = document.createElement('button');
                    var img = document.createElement('img');
                    img.src = '/assets/hero/LOGO_Faro.svg';
                    img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;';
                    btn.appendChild(img);
                    btn.setAttribute('aria-label', 'Menu');
                    btn.setAttribute('id', 'faro-mobile-menu');
                    btn.style.position   = 'fixed';
                    btn.style.top        = '16px';
                    btn.style.right      = '16px';
                    btn.style.zIndex     = '99999';
                    btn.style.width      = '56px';
                    btn.style.height     = '56px';
                    btn.style.background = 'transparent';
                    btn.style.border     = 'none';
                    btn.style.cursor     = 'pointer';
                    btn.style.padding    = '0';
                    btn.style.display    = 'block';

                    btn.addEventListener('click', function() {
                        open = !open;
                        img.src = open
                            ? '/assets/hero/LOGO_Faro_hamburger.svg'
                            : '/assets/hero/LOGO_Faro.svg';
                        window.dispatchEvent(new Event('menu-toggle'));
                    });

                    window.addEventListener('menu-close', function() {
                        open = false;
                        img.src = '/assets/hero/LOGO_Faro.svg';
                    });

                    document.body.appendChild(btn);
                }

                function removeBtn() {
                    if (btn) {
                        btn.parentNode && btn.parentNode.removeChild(btn);
                        btn = null;
                    }
                }

                function check() {
                    if (window.innerWidth < 768) {
                        createBtn();
                    } else {
                        removeBtn();
                    }
                }

                check();
                window.addEventListener('resize', check);
            })();
        `}</Script>
    );
}
