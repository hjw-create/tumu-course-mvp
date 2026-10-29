(function (global) {
  var KEY = "tumuB_xhs_mock_v1";
  var defaults = {
    n1_like: 91, n1_fav: 28, n1_cmt: 2,
    n2_like: 161, n2_fav: 52, n2_cmt: 5,
    n3_like: 84, n3_fav: 24, n3_cmt: 2,
    n1_liked: false, n1_faved: false, n2_liked: false, n2_faved: false, n3_liked: false, n3_faved: false,
    comments: {n1:[{name:'班组长',text:'沙子到了就微信喊一声，月底对不上。',t:"昨天"},{name:'材料员',text:'表别超过两分钟。',t:"昨天"}],n2:[{name:'班组长',text:'不垫资这句要放最前面。',t:"昨天"},{name:'材料员',text:'别做成工地管理系统。',t:"昨天"},{name:'小工头',text:'打卡行，别要我买软件。',t:"昨天"}],n3:[{name:'班组长',text:'预约试填行，别一上来推销系统。',t:"昨天"}]}
  };
  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || "{}");
      var out = JSON.parse(JSON.stringify(defaults));
      Object.keys(d).forEach(function (k) { out[k] = d[k]; });
      if (d.comments) out.comments = d.comments;
      return out;
    } catch (e) { return JSON.parse(JSON.stringify(defaults)); }
  }
  function save(d) { localStorage.setItem(KEY, JSON.stringify(d)); }
  function toast(msg) {
    var el = document.getElementById("toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; document.body.appendChild(el); }
    el.textContent = msg; el.style.display = "block";
    setTimeout(function () { el.style.display = "none"; }, 1400);
  }
  function bindNote(id) {
    var d = load();
    function paint() {
      var like = document.getElementById("likeN");
      var fav = document.getElementById("favN");
      var cmt = document.getElementById("cmtN");
      if (like) like.textContent = d[id + "_like"];
      if (fav) fav.textContent = d[id + "_fav"];
      if (cmt) cmt.textContent = d[id + "_cmt"];
      var box = document.getElementById("cmtList");
      if (box) {
        var list = (d.comments && d.comments[id]) || [];
        box.innerHTML = list.map(function (c) {
          return '<div class="cm"><i class="av"></i><div><span class="nm">' + c.name + "</span>" + c.text + '<div class="tm">' + c.t + "</div></div></div>";
        }).join("");
      }
    }
    paint();
    var lb = document.getElementById("likeBtn");
    var fb = document.getElementById("favBtn");
    if (lb) lb.onclick = function () {
      d = load();
      if (d[id + "_liked"]) { d[id + "_like"]--; d[id + "_liked"] = false; toast("取消点赞"); }
      else { d[id + "_like"]++; d[id + "_liked"] = true; toast("已点赞"); }
      save(d); paint();
    };
    if (fb) fb.onclick = function () {
      d = load();
      if (d[id + "_faved"]) { d[id + "_fav"]--; d[id + "_faved"] = false; toast("取消收藏"); }
      else { d[id + "_fav"]++; d[id + "_faved"] = true; toast("已收藏"); }
      save(d); paint();
    };
    var form = document.getElementById("cmtForm");
    if (form) form.onsubmit = function (e) {
      e.preventDefault();
      var input = document.getElementById("cmtInput");
      var text = (input.value || "").trim();
      if (!text) return;
      d = load();
      if (!d.comments) d.comments = {};
      if (!d.comments[id]) d.comments[id] = [];
      d.comments[id].unshift({ name: "我", text: text, t: "刚刚" });
      d[id + "_cmt"] = (d[id + "_cmt"] || 0) + 1;
      save(d); input.value = ""; paint(); toast("评论已发布（本机）");
    };
  }
  function paintMe() {
    var d = load();
    var ids = ["n1", "n2", "n3"];
    var exp = [1590, 2050, 1480];
    var read = [740, 1180, 690];
    var dm = [1, 6, 2];
    var lead = [1, 4, 1];
    ids.forEach(function (id, i) {
      var root = document.querySelector('[data-note="' + id + '"]');
      if (!root) return;
      root.querySelector("[data-f=exp]").textContent = exp[i];
      root.querySelector("[data-f=read]").textContent = read[i];
      root.querySelector("[data-f=like]").textContent = d[id + "_like"];
      root.querySelector("[data-f=cmt]").textContent = d[id + "_cmt"];
      root.querySelector("[data-f=fav]").textContent = d[id + "_fav"];
      root.querySelector("[data-f=dm]").textContent = dm[i];
      root.querySelector("[data-f=lead]").textContent = lead[i];
    });
  }
  global.XHS = { load: load, save: save, bindNote: bindNote, paintMe: paintMe, toast: toast };
})(window);
