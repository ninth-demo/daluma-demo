/*!
 * 達魯瑪民宿 網站提案示範
 * © 2026 Ninth 九號. All rights reserved. 本程式碼與設計為 Ninth 九號之著作，僅供提案展示，未經書面授權不得重製、改作或使用。
 */
/* 示範版把資料存在瀏覽器（localStorage）。正式版把 Store 換成資料庫即可，頁面程式不用改。 */
(function (global) {
  "use strict";

  var KEY = "daluma-demo-v1";

  var SEED = {
    info: {
      notice: "民宿沒有專屬停車位，開車來的朋友請先規劃停車。",
      checkin: "15:00",
      checkout: "11:00",
      license: "花蓮縣民宿 1425 號",
      totalRooms: 5
    },
    rooms: [
      { id: "r1", name: "城市雙人房", color: "#3E8ED0", guests: 2, bed: "一張雙人床", size: "", weekday: 3400, weekend: 3800,
        desc: "走出門就是花蓮市區。白天逛文創園區，晚上去夜市，回來洗個澡就能睡。",
        amenities: ["冷氣", "獨立衛浴", "免治馬桶", "吹風機", "冰箱", "電視", "電熱水壺", "WiFi"], photo: "" },
      { id: "r2", name: "浪漫花園房", color: "#E4572E", guests: 2, bed: "一張雙人床", size: "", weekday: 3600, weekend: 4000,
        desc: "用花草當主題，顏色溫暖一點。適合兩個人來花蓮慢慢玩。",
        amenities: ["冷氣", "獨立衛浴", "免治馬桶", "吹風機", "冰箱", "電視", "電熱水壺", "WiFi"], photo: "" },
      { id: "r3", name: "家庭四人房", color: "#7BB661", guests: 4, bed: "兩張雙人床", size: "", weekday: 4600, weekend: 5000,
        desc: "一家人住剛好。房間寬敞，小朋友也有地方跑跳。",
        amenities: ["冷氣", "獨立衛浴", "免治馬桶", "吹風機", "冰箱", "電視", "電熱水壺", "WiFi"], photo: "" }
    ],
    news: [
      { id: "n1", date: "2026-09-15", title: "可以刷國民旅遊卡",
        body: "公務人員來花蓮玩，可以用國民旅遊卡付房費。訂房時跟我們說一聲就好。\n\n（示範內容：實際公告由民宿在後台更新。）" },
      { id: "n2", date: "2025-01-01", title: "一次性備品改成需要再拿",
        body: "配合政府減塑政策，從 114 年 1 月 1 日起，房間不主動提供牙刷、刮鬍刀這類一次性備品。需要的話跟我們說，免費提供。\n\n建議自己帶盥洗用品，一起愛護花蓮的環境。" }
    ],
    closed: {},
    bookings: []
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  var Store = {
    load: function () {
      try { var raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) {}
      return clone(SEED);
    },
    save: function (data) {
      try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch (e) { return false; }
    },
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      return clone(SEED);
    }
  };

  var WEEK = ["日", "一", "二", "三", "四", "五", "六"];

  // 一律用台北時間
  function taipeiNow() {
    var parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    var date = o.year + "-" + o.month + "-" + o.day;
    var hour = o.hour === "24" ? 0 : +o.hour;
    return { date: date, hour: hour, minute: +o.minute, time: (hour < 10 ? "0" : "") + hour + ":" + o.minute };
  }

  function addDays(dateStr, n) {
    var d = new Date(dateStr + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function dayOf(dateStr) { return new Date(dateStr + "T00:00:00Z").getUTCDay(); }
  // 週五、週六晚上算假日價
  function isWeekendNight(dateStr) { var d = dayOf(dateStr); return d === 5 || d === 6; }

  function nightsBetween(a, b) {
    var out = [];
    for (var d = a; d < b; d = addDays(d, 1)) out.push(d);
    return out;
  }
  function isClosed(data, roomId, dateStr) {
    var c = data.closed[dateStr];
    return !!c && (c.indexOf("all") > -1 || c.indexOf(roomId) > -1);
  }
  function quote(data, room, checkin, checkout) {
    var nights = nightsBetween(checkin, checkout), total = 0, blocked = [];
    nights.forEach(function (d) {
      total += isWeekendNight(d) ? room.weekend : room.weekday;
      if (isClosed(data, room.id, d)) blocked.push(d);
    });
    return { nights: nights, total: total, deposit: Math.round(total * 0.3), blocked: blocked };
  }

  function money(n) { return "NT$" + Number(n).toLocaleString("zh-TW"); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function paras(s) {
    return esc(s).split(/\n{2,}/).map(function (p) { return "<p>" + p.replace(/\n/g, "<br>") + "</p>"; }).join("");
  }
  function sortedNews(data) { return data.news.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }); }
  function fmt(dateStr) { var p = dateStr.split("-"); return +p[1] + "/" + +p[2] + "（" + WEEK[dayOf(dateStr)] + "）"; }

  global.HA = { KEY: KEY, WEEK: WEEK, Store: Store, taipeiNow: taipeiNow, addDays: addDays, dayOf: dayOf,
                isWeekendNight: isWeekendNight, nightsBetween: nightsBetween, isClosed: isClosed, quote: quote,
                money: money, esc: esc, paras: paras, sortedNews: sortedNews, fmt: fmt };
})(window);
