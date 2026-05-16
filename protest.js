(function () {
    const DISMISS_KEY = 'iran_net_protest_dismissed';
    const DISMISS_TTL_MS = 12 * 60 * 60 * 1000;

    function isDismissedWithinTTL() {
        const raw = localStorage.getItem(DISMISS_KEY);
        if (raw == null || raw === '') return false;
        const t = parseInt(raw, 10);
        if (!isFinite(t) || t <= 0) return false;
        return Date.now() < t + DISMISS_TTL_MS;
    }

    if (isDismissedWithinTTL()) return;

    // Resolve the script element (currentScript is often null for dynamically inserted scripts)
    function resolveProtestScriptEl() {
        const cur = document.currentScript;
        if (cur && cur.src && /protest\.js(\?|#|$)/i.test(cur.src)) {
            return cur;
        }
        const candidates = document.querySelectorAll('script[src*="protest.js"]');
        for (let i = candidates.length - 1; i >= 0; i--) {
            const el = candidates[i];
            if (el.src && /protest\.js(\?|#|$)/i.test(el.src)) return el;
        }
        return null;
    }

    const scriptTag = resolveProtestScriptEl();
    const scriptUrl = scriptTag && scriptTag.src ? new URL(scriptTag.src, window.location.href) : new URL(window.location.href);
    const params = scriptUrl.searchParams;

    const sizeAliases = {
        sm: 'sm',
        small: 'sm',
        md: 'md',
        medium: 'md',
        lg: 'lg',
        large: 'lg',
    };

    const dataSizeAttr = scriptTag && scriptTag.getAttribute('data-protest-size');
    const fromData = dataSizeAttr ? dataSizeAttr.trim().toLowerCase() : '';
    const fromQuery = (params.get('size') || '').trim().toLowerCase();
    const requestedSize = fromData || fromQuery || 'md';
    const normalizedSize = sizeAliases[requestedSize] || 'md';

    const config = {
        text: params.get('text') || 'اینترنت آزاد حق همه مردم ایران است.',
        showCountdown: params.get('countdown') !== 'false',
        size: normalizedSize,
    };

    // Date Calculation (1404/09/09 SH = 2025-11-30 GC)
    const startDate = new Date('2026-02-28T00:00:00');
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Create Container
    const container = document.createElement('div');
    container.id = 'iran-protest-banner';
    container.className = `protest-size-${config.size}`;

    const countdownHtml = config.showCountdown
        ? `<div class="protest-days">
            <span class="protest-number">${diffDays.toLocaleString('fa-IR')}</span>
            <span class="protest-days-text">روز قطعی اینترنت</span>
           </div>`
        : '';

    container.innerHTML = `
        <div class="protest-bar-inner">
            <div class="protest-side-right">
                <button class="protest-close" title="بستن" aria-label="بستن">&times;</button>
                ${countdownHtml}
            </div>
            <div class="protest-center">
                <div class="protest-message">${config.text}</div>
            </div>
            <div class="protest-side-left">
                 <a href="https://github.com/faryadzaman/net4all" class="protest-support" title="حمایت از کمپین">
                    <span>حمایت کنید</span>
                </a>
                <a href="https://github.com/faryadzaman/net4all" target="_blank" class="protest-github" title="دریافت کد برای سایت شما">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
            </div>
        </div>
    `;

    // Inject Styles
    const style = document.createElement('style');
    style.id = 'iran-protest-styles';
    style.innerHTML = `
        #iran-protest-banner, #iran-protest-banner * {
            box-sizing: border-box !important;
        }

        #iran-protest-banner {
            position: relative !important;
            width: 100% !important;
            background: linear-gradient(180deg, #1a1a1a 0%, #000000 100%) !important;
            color: #fff !important;
            z-index: 9999 !important;
            direction: rtl !important;
            font-family: 'Vazirmatn', Tahoma, sans-serif !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            border-bottom: 3px solid #333 !important;
            --banner-min-height: 64px !important;
            --banner-padding-y: 8px !important;
            --banner-padding-x: 24px !important;
            --banner-gap: 14px !important;
            --side-gap: 14px !important;
            --days-gap: 12px !important;
            --message-font-size: 16px !important;
            --message-font-weight: 700 !important;
            --message-line-height: 1.4 !important;
            --message-max-width: 620px !important;
            --number-size: 38px !important;
            --number-font-size: 14px !important;
            --days-text-font-size: 13px !important;
            --close-font-size: 24px !important;
            --close-size: 32px !important;
            --github-size: 20px !important;
            --dino-size: 24px !important;
            --support-font-size: 13px !important;
            --support-padding-y: 6px !important;
            --support-padding-x: 14px !important;
        }

        #iran-protest-banner .protest-bar-inner {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            margin: 0 !important;
            padding: var(--banner-padding-y) var(--banner-padding-x) !important;
            min-height: var(--banner-min-height) !important;
            gap: var(--banner-gap) !important;
        }

        #iran-protest-banner .protest-side-left, 
        #iran-protest-banner .protest-side-right {
            flex: 1 1 0 !important;
            display: flex !important;
            align-items: center !important;
            gap: var(--side-gap) !important;
            white-space: nowrap !important;
            min-width: 0 !important;
        }

        #iran-protest-banner .protest-side-left {
            justify-content: flex-end !important;
        }

        #iran-protest-banner .protest-side-right {
            justify-content: flex-start !important;
        }

        #iran-protest-banner .protest-center {
            flex: 0 1 var(--message-max-width) !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
            padding: 0 10px !important;
            min-width: 0 !important;
            overflow: hidden !important;
            max-width: min(100%, var(--message-max-width)) !important;
        }

        #iran-protest-banner .protest-days {
            display: flex !important;
            align-items: center !important;
            gap: var(--days-gap) !important;
            white-space: nowrap !important;
        }

        #iran-protest-banner .protest-github {
            color: #fff !important;
            opacity: 0.5 !important;
            transition: all 0.2s !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-decoration: none !important;
        }

        #iran-protest-banner .protest-support {
            color: #fff !important;
            opacity: 0.6 !important;
            transition: all 0.2s !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            text-decoration: none !important;
            font-size: var(--support-font-size) !important;
            font-weight: 500 !important;
            white-space: nowrap !important;
            padding: var(--support-padding-y) var(--support-padding-x) !important;
            background: rgba(255,255,255,0.05) !important;
            border-radius: 20px !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
        }

        #iran-protest-banner .protest-support svg {
            color: #ef4444 !important;
        }

        #iran-protest-banner .protest-support:hover {
            opacity: 1 !important;
            background: rgba(255,255,255,0.1) !important;
            transform: translateY(-1px) !important;
        }

        #iran-protest-banner .protest-github:hover {
            opacity: 1 !important;
            transform: scale(1.1) !important;
        }

        #iran-protest-banner .protest-github svg {
            width: var(--github-size) !important;
            height: var(--github-size) !important;
            fill: currentColor !important;
        }

    

        #iran-protest-banner .protest-number {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: #ef4444 !important;
            color: white !important;
            min-width: var(--number-size) !important;
            height: var(--number-size) !important;
            border-radius: 50% !important;
            font-weight: 800 !important;
            font-size: var(--number-font-size) !important;
            line-height: 1 !important;
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.4) !important;
        }

        #iran-protest-banner .protest-days-text {
            font-size: var(--days-text-font-size) !important;
            font-weight: 600 !important;
            color: rgba(255,255,255,0.9) !important;
        }

        #iran-protest-banner .protest-message {
            font-size: var(--message-font-size) !important;
            font-weight: var(--message-font-weight) !important;
            line-height: var(--message-line-height) !important;
            color: #fff !important;
            max-width: 100% !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: normal !important;
            word-break: break-word !important;
        }

        #iran-protest-banner .protest-close {
            background: transparent !important;
            border: none !important;
            color: #fff !important;
            font-size: var(--close-font-size) !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            line-height: 1 !important;
            transition: all 0.2s !important;
            opacity: 0.5 !important;
            padding: 0 5px 4px 5px !important;
            margin: 0 !important;
            width: var(--close-size) !important;
            height: var(--close-size) !important;
        }

        #iran-protest-banner .protest-close:hover {
            opacity: 1 !important;
            color: #ef4444 !important;
            transform: scale(1.2) !important;
        }

        /* ===== Sizes System ===== */

        /* SMALL */
        #iran-protest-banner.protest-size-sm {
            --banner-min-height: 48px !important;
            --banner-padding-y: 6px !important;
            --banner-padding-x: 16px !important;
            --banner-gap: 10px !important;
            --side-gap: 10px !important;
            --days-gap: 8px !important;
            --message-font-size: 13px !important;
            --message-font-weight: 600 !important;
            --message-line-height: 1.35 !important;
            --message-max-width: 420px !important;
            --number-size: 28px !important;
            --number-font-size: 11px !important;
            --days-text-font-size: 11px !important;
            --close-font-size: 18px !important;
            --close-size: 24px !important;
            --github-size: 16px !important;
            --dino-size: 18px !important;
            --support-font-size: 11px !important;
            --support-padding-y: 4px !important;
            --support-padding-x: 10px !important;
        }

        /* MEDIUM */
        #iran-protest-banner.protest-size-md {
            --banner-min-height: 64px !important;
            --banner-padding-y: 8px !important;
            --banner-padding-x: 24px !important;
            --banner-gap: 14px !important;
            --side-gap: 14px !important;
            --days-gap: 12px !important;
            --message-font-size: 16px !important;
            --message-font-weight: 700 !important;
            --message-line-height: 1.4 !important;
            --message-max-width: 620px !important;
            --number-size: 38px !important;
            --number-font-size: 14px !important;
            --days-text-font-size: 13px !important;
            --close-font-size: 24px !important;
            --close-size: 32px !important;
            --github-size: 20px !important;
            --dino-size: 24px !important;
            --support-font-size: 13px !important;
            --support-padding-y: 6px !important;
            --support-padding-x: 14px !important;
        }

        /* LARGE */
        #iran-protest-banner.protest-size-lg {
            --banner-min-height: 76px !important;
            --banner-padding-y: 10px !important;
            --banner-padding-x: 28px !important;
            --banner-gap: 16px !important;
            --side-gap: 16px !important;
            --days-gap: 12px !important;
            --message-font-size: 18px !important;
            --message-font-weight: 800 !important;
            --message-line-height: 1.45 !important;
            --message-max-width: 700px !important;
            --number-size: 44px !important;
            --number-font-size: 16px !important;
            --days-text-font-size: 14px !important;
            --close-font-size: 26px !important;
            --close-size: 36px !important;
            --github-size: 22px !important;
            --dino-size: 26px !important;
            --support-font-size: 14px !important;
            --support-padding-y: 7px !important;
            --support-padding-x: 16px !important;
        }

        /* ===== Responsiveness ===== */
        @media (max-width: 850px) {
            #iran-protest-banner .protest-support span { display: none !important; }
            #iran-protest-banner .protest-support { padding: 8px !important; border-radius: 50% !important; }
            #iran-protest-banner .protest-days-text { display: none !important; }
        }

        @media (max-width: 600px) {
            #iran-protest-banner .protest-side-left { display: none !important; }
            #iran-protest-banner .protest-side-right { flex: 0 0 auto !important; }
            #iran-protest-banner .protest-center { flex: 1 1 auto !important; max-width: none !important; }
            #iran-protest-banner .protest-center { justify-content: flex-start !important; padding-right: 4px !important; }
            #iran-protest-banner .protest-message { text-align: right !important; }
        }

        @media (max-width: 400px) {
            #iran-protest-banner .protest-message {
                font-size: max(11px, calc(var(--message-font-size) * 0.88)) !important;
                white-space: nowrap !important;
                text-overflow: ellipsis !important;
            }
        }
    `;

    function init() {
        if (document.head) {
            document.head.appendChild(style);
        }

        if (document.body) {
            document.body.prepend(container);
        } else {
            // Fallback for extreme cases if body is still null
            document.documentElement.appendChild(container);
        }

        // Event Listeners
        container.querySelector('.protest-close').addEventListener('click', function () {
            const height = container.offsetHeight;
            container.style.height = height + 'px';

            // Force reflow
            container.offsetHeight;

            container.style.marginTop = `-${height}px`;
            container.style.opacity = '0';

            setTimeout(() => {
                container.remove();
                localStorage.setItem(DISMISS_KEY, String(Date.now()));
            }, 400);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
