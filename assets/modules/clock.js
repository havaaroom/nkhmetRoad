function Time() {
  const weekDays = [
    "یک شنبه",
    "دوشنبه",
    "سه شنبه",
    "چهارشنبه",
    "پنج شنبه",
    "جمعه",
    "شنبه",
  ];
  const monthNames = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];
  var date = new Date();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var wkday = date.getDay();
  var curr_date = miladi_be_shamsi(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  const weekDayFa = weekDays[wkday];
  const dayFa = curr_date.split("/")[2];
  const monthFa = monthNames[parseInt(curr_date.split("/")[1]) - 1];
  const yearFa = curr_date.split("/")[0];
  hour = update(hour);
  minute = update(minute);
  second = update(second);
  document.getElementById("digital-date").innerHTML =
    hour +
    " : " +
    minute +
    " : " +
    second +
    "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" +
    yearFa +
    "&nbsp" +
    weekDayFa +
    "&nbsp" +
    dayFa +
    "&nbsp" +
    monthFa;

  setTimeout(Time, 1000);
}
function miladi_be_shamsi(gy, gm, gd) {
  var g_d_m, jy, jm, jd, gy2, days;
  g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  gy2 = gm > 2 ? gy + 1 : gy;
  days =
    355666 +
    365 * gy +
    ~~((gy2 + 3) / 4) -
    ~~((gy2 + 99) / 100) +
    ~~((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];
  jy = -1595 + 33 * ~~(days / 12053);
  days %= 12053;
  jy += 4 * ~~(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += ~~((days - 1) / 365);
    days = (days - 1) % 365;
  }
  if (days < 186) {
    jm = 1 + ~~(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + ~~((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return jy + "/" + jm + "/" + jd;
}
function update(t) {
  if (t < 10) {
    return "0" + t;
  } else {
    return t;
  }
}
Time();
