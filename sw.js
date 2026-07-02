const CACHE_NAME = 'neon-finance-cache-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    // Font Awesome ရဲ့ ကွန်ပျူတာစာလုံးပုံစံ (Webfonts) ဖိုင်တွေကိုပါ အော်တို ဒေါင်းလုဒ်ဆွဲခိုင်းထားခြင်းဖြစ်ပါတယ်
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff'
];

// 1. Install Event: ပထမဆုံးအကြိမ် အင်တာနက်နဲ့ ဝင်လာရင် ဖိုင်တွေအကုန်လုံးကို ဒေါင်းလုဒ်ဆွဲပြီး Cache ထဲသိမ်းမယ်
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching App Shell and Font Awesome Icons...');
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// 2. Activate Event: Cache ရှင်းလင်းရေး လုပ်ဆောင်ခြင်း
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Clearing Old Cache...');
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Fetch Event: အင်တာနက်မရှိတော့တဲ့ အခါ Cache ထဲက ဒေါင်းလုဒ်ဆွဲထားတဲ့ ဖိုင်တွေနဲ့ Icon တွေကို ပြန်ထုတ်ပေးမယ်
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Cache ထဲမှာ ရှိရင် ချက်ချင်းထုတ်ပြမယ်၊ မရှိမှ အင်တာနက်ဆီ လှမ်းတောင်းမယ်
            return cachedResponse || fetch(event.request);
        })
    );
});
