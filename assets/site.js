/*!
 * 達魯瑪民宿 網站提案示範
 * © 2026 Ninth 九號. All rights reserved. 本程式碼與設計為 Ninth 九號之著作，僅供提案展示，未經書面授權不得重製、改作或使用。
 */
/* 前台共用：頁首、公告、頁尾、手機底部按鈕、房間插畫 */
(function () {
  "use strict";

  var SHOP = {
    tel: "0915-420-913",
    telHref: "tel:0915420913",
    address: "花蓮縣花蓮市國威里大同街 31 號",
    map: "https://www.google.com/maps/search/?api=1&query=%E8%8A%B1%E8%93%AE%E5%B8%82%E5%A4%A7%E5%90%8C%E8%A1%9731%E8%99%9F"
  };
  window.SHOP = SHOP;

  var NAV = [
    ["index.html", "首頁"],
    ["rooms.html", "房型"],
    ["around.html", "周邊與交通"],
    ["news.html", "最新消息"],
    ["policy.html", "訂房須知"]
  ];
  var PHONE_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>';
  window.PHONE_ICON = PHONE_ICON;

  // ---------- 房間照片：還沒上傳時用插畫代替，顏色跟鑰匙牌一樣 ----------
  window.roomPhoto = function (room, note) {
    if (room.photo) return '<img src="' + room.photo + '" alt="' + HA.esc(room.name) + '" draggable="false">';
    var c = room.color || "#3E8ED0", twin = /兩張單人/.test(room.bed), four = room.guests >= 4;
    var s = '<svg class="ph" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<rect width="400" height="300" fill="#F1F4EE"/>' +
      '<rect x="0" y="0" width="400" height="150" fill="' + c + '" opacity=".16"/>' +
      '<rect x="252" y="46" width="96" height="112" rx="48" fill="#FFFFFF" stroke="#9A938C" stroke-width="3"/>' +
      '<path d="M300 46v112M252 110h96" stroke="#9A938C" stroke-width="3"/>' +
      '<circle cx="84" cy="70" r="18" fill="' + c + '" opacity=".55"/><rect x="70" y="86" width="28" height="26" rx="6" fill="#FFFFFF" stroke="#9A938C" stroke-width="3"/>' +
      '<path d="M0 232h400v68H0z" fill="#E6E1DA"/>';
    function bed(x, w) {
      return '<rect x="' + x + '" y="178" width="' + w + '" height="44" rx="10" fill="#FFFFFF" stroke="#9A938C" stroke-width="3"/>' +
             '<rect x="' + (x + 8) + '" y="160" width="' + (w / 2 - 12) + '" height="24" rx="10" fill="#FFFFFF" stroke="#9A938C" stroke-width="3"/>' +
             (w > 90 ? '<rect x="' + (x + w / 2 + 4) + '" y="160" width="' + (w / 2 - 12) + '" height="24" rx="10" fill="#FFFFFF" stroke="#9A938C" stroke-width="3"/>' : "") +
             '<rect x="' + x + '" y="198" width="' + w + '" height="24" rx="10" fill="' + c + '" opacity=".7"/>';
    }
    if (four) s += bed(28, 110) + bed(150, 110);
    else if (twin) s += bed(40, 76) + bed(132, 76);
    else s += bed(50, 160);
    s += "</svg>";
    return s + (note === false ? "" : '<span class="ph-note">民宿上傳照片後會顯示在這裡</span>');
  };

  var page = document.body.getAttribute("data-page");
  var data = HA.Store.load();

  var head = document.getElementById("site-head");
  if (head) {
    head.className = "site-head";
    head.innerHTML =
      '<div class="wrap">' +
        '<a class="brand" href="index.html"><b>達魯瑪民宿</b><i>taloma’ · Hualien</i></a>' +
        '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="main-nav">選單</button>' +
        '<nav class="nav" id="main-nav" aria-label="主選單">' +
          NAV.map(function (n) { return '<a href="' + n[0] + '"' + (n[0] === page ? ' aria-current="page"' : "") + ">" + n[1] + "</a>"; }).join("") +
          '<a class="nav-cta" href="booking.html"' + (page === "booking.html" ? ' aria-current="page"' : "") + ">線上訂房</a>" +
        "</nav>" +
      "</div>";
    var btn = head.querySelector(".menu-btn"), nav = head.querySelector(".nav");
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "關閉" : "選單";
    });
    var notice = document.createElement("p");
    notice.className = "notice";
    notice.textContent = data.info.notice || "";
    head.parentNode.insertBefore(notice, head);
  }

  var bar = document.createElement("div");
  bar.className = "demo-bar";
  bar.setAttribute("role", "note");
  bar.innerHTML = '這是 <strong>Ninth 九號</strong> 為達魯瑪民宿製作的網站提案示範，並非民宿官方網站，不接受真實訂房。　<a href="admin/index.html">試用民宿後台</a>';
  document.body.insertBefore(bar, document.body.firstChild);

  var foot = document.getElementById("site-foot");
  if (foot) {
    foot.className = "site-foot";
    foot.innerHTML =
      '<div class="wrap"><div class="foot-grid">' +
        '<div><h2>達魯瑪民宿</h2><p style="margin-top:10px">taloma’，阿美族語的「回家」。<br>花蓮市區，五間房的家。</p>' +
          '<span class="license">合法民宿　' + HA.esc(data.info.license) + "</span></div>" +
        "<div><h3>聯絡我們</h3><ul>" +
          '<li><a href="' + SHOP.telHref + '">' + SHOP.tel + "</a></li>" +
          "<li>" + SHOP.address + "</li>" +
          "<li>入住 " + HA.esc(data.info.checkin) + "　退房 " + HA.esc(data.info.checkout) + "</li>" +
          "<li>可刷國民旅遊卡</li></ul></div>" +
        "<div><h3>網站導覽</h3><ul>" + NAV.concat([["booking.html", "線上訂房"], ["legal.html", "網站聲明"]]).map(function (n) { return '<li><a href="' + n[0] + '">' + n[1] + "</a></li>"; }).join("") + "</ul></div>" +
      "</div>" +
      '<div class="foot-legal"><span>房價、房型名稱與部分文字為示範內容，實際以民宿公告為準。</span>' +
      '<span>網站提案示範，© 2026 <a href="https://ninthlab.com.tw/" target="_blank" rel="noopener">Ninth 九號</a> 設計製作，未經授權請勿轉載使用。<a href="legal.html">網站聲明</a></span></div></div>';
  }

  var dock = document.createElement("div");
  dock.className = "dock";
  dock.innerHTML = '<a class="btn btn-dawn" href="' + SHOP.telHref + '">' + PHONE_ICON + '打電話</a><a class="btn btn-sea" href="booking.html">線上訂房</a>';
  document.body.appendChild(dock);

  // 子頁頁首掛幾支小鑰匙牌當裝飾，顏色跟房間一樣
  var ph = document.querySelector(".page-head");
  if (ph) {
    ph.insertAdjacentHTML("afterbegin", '<div class="tags-deco" aria-hidden="true">' + data.rooms.slice(0, 5).map(function (r, i) {
      return '<span style="--c:' + (r.color || "#F3B61F") + ';height:' + (56 + (i % 2) * 22) + 'px"></span>';
    }).join("") + "</div>");
  }
})();
