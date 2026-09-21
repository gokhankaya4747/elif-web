/* elifmuslim.com ölçümü — PostHog (uygulamayla AYNI proje: 481983).
 *
 * Neden var: 21 Eylül 2026'ya kadar site tamamen ölçümsüzdü. Product Hunt
 * lansmanı, Google Ads'in siteye düşen tıklamaları ve organik trafik "geldi mi
 * gelmedi mi" sorusuna cevap verilemiyordu — mağaza konsolları web
 * yönlendirmesini 2–3 gün gecikmeyle ve toplulaştırarak gösteriyor.
 *
 * Gizlilik duruşu uygulamayla aynı olsun diye: çerez yok (bellekte kalıcılık),
 * IP anonimleştirilir, oto-yakalama (rastgele tıklama kaydı) kapalı. Ölçülen
 * yalnızca sayfa görüntüleme + mağaza düğmesine tıklama.
 */
(function () {
  var KEY = 'phc_mrepoDYBE3uQgfUXPZdqLzXH9M3bRZzvJmnQjYmxRquX';
  var HOST = 'https://us.i.posthog.com';

  // Do Not Track açıksa hiç yükleme — kullanıcının açık tercihi.
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset group identify".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  posthog.init(KEY, {
    api_host: HOST,
    persistence: 'memory',        // çerez yok → çerez bandı gerekmiyor
    ip: false,                    // IP anonimleştirilir
    autocapture: false,           // yalnızca bilerek yazdığımız olaylar
    capture_pageview: true,
    capture_pageleave: true,
    disable_session_recording: true,
    property_blacklist: ['$ip'],
    loaded: function (ph) {
      // Sayfa görüntülemesine dilin ve yolun yanında YÖNLENDİRENİ de yaz:
      // "Product Hunt gerçekten trafik getirdi mi" sorusunun cevabı budur.
      try {
        ph.register({
          site_lang: document.documentElement.lang || 'tr',
          site_path: location.pathname,
        });
      } catch (e) {}
    },
  });

  // Mağaza düğmeleri: siteye gelen kaç kişi gerçekten mağazaya gidiyor.
  // Huninin site tarafındaki tek gerçek dönüşümü bu.
  document.addEventListener(
    'click',
    function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      var store = href.indexOf('apps.apple.com') > -1
        ? 'app_store'
        : href.indexOf('play.google.com') > -1
          ? 'play_store'
          : null;
      if (!store) return;
      try {
        posthog.capture('web_store_click', { store: store, path: location.pathname });
      } catch (e) {}
    },
    true
  );
})();
