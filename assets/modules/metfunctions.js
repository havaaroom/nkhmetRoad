var jobg = [];
var myroute;
var routeurl;
var markerGroup, markerGroupMain;
var wwMarkerGroup;
var presentWW = false;
var finalroute;
var day_num = 1;
var route_num;
var map;
var r = "r3";
var directionDiv = false;
var LeafvarNav = true;
var heartVal = 0;
var happyVal = 0;
var citiesInTable;
var confusedVal = 0;
var sadVal = 0;
var angryVal = 0;
var departureSelected = false;
var destinationSelected = false;
var departureSelectedOnMap = false;
var destinationSelectedOnMap = false;
var sidebarselected = false;
var apiurl = "http://router.project-osrm.org/route/v1/driving/";
var loader;
var destinationGeo;
var departureGeo;
var specificRoute;
var selectedPathName;
var provinceForecast = false;
var provinceBorder;
var stationsList;
var LeafletNav = true;
var stationBullTime;
var days = [
  "یکشنبه",
  "دوشنبه",
  "سه شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
  "شنبه",
];
/* **************************************************************************************** */
window.onload = function () {
  frcDaysName(1);
  loader = document.querySelector("#loading");
  zoomInClick();
  zoomOutClick();
  centerMapClick();
  // getGeoLocation();
  directionBtn();
  typingDirectionForm();
  hideLeafletNav();
  forecastMenu();
  surveyBtnClick();
  surveyFormOutClick();
  emojiClick();
  webserviceToken().then((tokenresponse) => {
    getIRIMOData(tokenresponse.claims.token).then((response) => {
      window.jobg = response;
      window.r = 0;
      change(window.r);
    });
  });
  initMap();
  mapClicked();
  scrollWeelOnTable();
};
/* **************************************************************************************** */
async function webserviceToken() {
  try {
    const url =
      "https://webservice.irimo.ir/sajjadeh/dal/login?username=public&password=public@irimo";
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
    });
    return await response.json();
  } catch (err) {
    alert("دسترسی به داده های سازمان هواشناسی کشور برقرار نشد");
  }
}
/* **************************************************************************************** */
async function getIRIMOData(token) {
  try {
    const url = "https://webservice.irimo.ir/sajjadeh/dal/dws/public";
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + token);
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
    });
    return await response.json();
  } catch (err) {
    alert("دسترسی به داده های سازمان هواشناسی کشور برقرار نشد");
  }
}
/* **************************************************************************************** */
function initMap() {
  const lat = 37.5;
  const lon = 53.5;
  const zoom = 8;
  map = L.map("mapDiv", { zoomControl: false }).setView([lat, lon], zoom);
  map.scrollWheelZoom.enable();
  const baseMap = L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 16,
    }
  ).addTo(map);
  map_point();
}
/* **************************************************************************************** */
//      LEAFLET CONTROL MENU
/* **************************************************************************************** */

function zoomInClick() {
  document.querySelector("#leafletBtn1").addEventListener("click", function () {
    map.zoomIn(1);
  });
}
/* **************************************************************************************** */
function zoomOutClick() {
  document.querySelector("#leafletBtn2").addEventListener("click", function () {
    map.zoomOut(1);
  });
}
/* **************************************************************************************** */
function centerMapClick() {
  document.querySelector("#leafletBtn3").addEventListener("click", function () {
    provinceForecast = false;
    presentWW = false;
    r = 0;
    change(r);
    // map.flyTo([32.5, 53.5], 5);
  });
}
/* **************************************************************************************** */
// function getGeoLocation() {
//   document.querySelector("#leafletBtn4").addEventListener("click", function () {
//     function onLocationFound(e) {
//       var radius = e.accuracy;
//       L.marker(e.latlng)
//         .addTo(map)
//         // .bindPopup("You are within " + radius + " meters from this point")
//         .openPopup();
//       L.circle(e.latlng, radius).addTo(map);
//     }
//     function onLocationError(e) {
//       alert(e.message);
//     }
//     map.on("locationerror", onLocationError);
//     map.on("locationfound", onLocationFound);
//     map.locate({ setView: true, maxZoom: 16 });
//   });
// }
/* **************************************************************************************** */
function getGeoLocation2() {
  map.locate({ setView: true, maxZoom: 16 });
  function onLocationFound(e) {
    var radius = e.accuracy;
    L.marker(e.latlng)
      .addTo(map)
      // .bindPopup("You are within " + radius + " meters from this point")
      .openPopup();
    L.circle(e.latlng, radius).addTo(map);
    document.querySelector("#departure").value =
      e.latlng.lng.toFixed(4) + " , " + e.latlng.lat.toFixed(4);
    departureSelectedOnMap = true;
  }
  function onLocationError(e) {
    alert(
      "متاسفانه مکان شما یافت نشد\n لطفا مطمئن شوید که مکان یاب شما فعال است."
    );
  }
  map.on("locationerror", onLocationError);
  map.on("locationfound", onLocationFound);
}

/* **************************************************************************************** */

function directionBtn() {
  document.querySelector("#leafletBtn5").addEventListener("click", function () {
    if (!directionDiv) {
      removemarker();
      document.getElementById("btn1").disabled = true;
      document.getElementById("btn2").disabled = true;
      document.querySelector(".table-container").innerHTML = "";
      document.getElementById("leafletBtn4").disabled = true;
      document.getElementById("leafletBtn3").disabled = true;
      document.getElementById("homeMenu").disabled = true;
      document.querySelector(".direction").style.display = "grid";
      document.querySelector("#departure").value = "";
      document.querySelector("#departure").focus();
      departureSelected = true;
      provinceForecast = false;
      document.querySelector("#destination").value = "";
      directionDiv = true;
    } else {
      document.querySelector(".direction").style.display = "none";
      directionDiv = false;
      departureSelected = false;
      destinationSelected = false;
      document.getElementById("btn1").disabled = false;
      document.getElementById("btn2").disabled = false;
      document.getElementById("leafletBtn4").disabled = false;
      document.getElementById("leafletBtn3").disabled = false;
      document.getElementById("homeMenu").disabled = false;
      change(0);
    }
  });
}
/* **************************************************************************************** */
function presentWeather() {
  if (!presentWW) {
    presentWW = true;
    if (window.r === 32) {
      removemarkerNotRoute();
      map_point();
    } else {
      change(window.r);
    }
  } else {
    presentWW = false;
    if (window.r === 32) {
      removemarkerNotRoute();
      map_point();
    } else {
      change(window.r);
    }
  }
}
/* **************************************************************************************** */
function hideLeafletNav() {
  const arrow = document
    .querySelector("#mapMenu")
    .addEventListener("click", function () {
      let arroitem = document.querySelector("#arrowup");
      if (LeafletNav) {
        document.querySelector(".leafletMenu").style.display = "none";
        arroitem.innerHTML = "✺";
        LeafletNav = false;
      } else {
        document.querySelector(".leafletMenu").style.display = "block";
        arroitem.innerHTML = "✺";
        LeafletNav = true;
      }
    });
}
/* **************************************************************************************** */
// Right Menu Click Action

function forecastMenu() {
  const arrow = document
    .querySelector("#home")
    .addEventListener("click", function () {
      if (sidebarselected) {
        document.getElementById("sidebar").style.display = "none";
        document.getElementById("overlay").style.display = "none";
        sidebarselected = false;
        document.getElementById("provinces").style.scrollBehavior = "initial";
      } else {
        document.getElementById("helpContent").style.display = "none";
        document.getElementById("overlay").style.display = "block";
        document.getElementById("sidebar").style.display = "grid";
        sidebarselected = true;
        document.getElementById("provinces").style.scrollBehavior = "initial";
      }
      if (directionDiv) {
        resetDirectionItems();
        document.getElementById("btn1").disabled = false;
        document.getElementById("btn2").disabled = false;
        document.getElementById("leafletBtn4").disabled = false;
        document.getElementById("leafletBtn3").disabled = false;
        presentWW = false;
        change(0);
      }

      // r = 1;
      // change(r);
    });
}
/* **************************************************************************************** */
// function getGeoLocation() {
//   function geolocationErrorOccurred(geolocationSupported, popup, latLng) {
//     popup.setLatLng(latLng);
//     popup.setContent(
//       geolocationSupported
//         ? "<b>Error:</b> The Geolocation service failed."
//         : "<b>Error:</b> This browser doesn't support geolocation."
//     );
//     popup.openOn(map);
//   }
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       function (position) {
//         var latLng = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         popup.setLatLng(latLng);
//         popup.setContent("This is your current location");
//         popup.openOn(map);
//         map.setView(latLng);
//       },
//       function () {
//         geolocationErrorOccurred(true, popup, map.getCenter());
//       }
//     );
//   } else {
//     //No browser support geolocation service
//     geolocationErrorOccurred(false, popup, map.getCenter());
//   }
// }

/* **************************************************************************************** */
function route(route_num) {
  const routeName = [
    "iran",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "specificR",
  ];
  const routeCodes = [
    [
      "40769",
      "40708",
      "40712",
      "40800",
      "40811",
      "40780",
      "40723",
      "40875",
      "40858",
      "40809",
      "40706",
      "40754",
      "40882",
      "40782",
      "40719",
      "40856",
      "40729",
      "40759",
      "40757",
      "40747",
      "40798",
      "40848",
      "40731",
      "40770",
      "40752",
      "40841",
      "40766",
      "40738",
      "40745",
      "40768",
      "40836",
      "40821",
    ],
    [
      "40706",
      "18113",
      "18097",
      "40704",
      "99248",
      "99239",
      "40702",
      "99283",
      "17975",
      "40710",
      "99227",
      "99236",
      "40711",
      "40713",
      "99220",
      "99284",
      "40716",
      "99228",
      "18152",
      "18038",
      "99226",
    ],
    [
      "40712",
      "99288",
      "99332",
      "99203",
      "40724",
      "18391",
      "40728",
      "99209",
      "99214",
      "40703",
      "40725",
      "40722",
      "99314",
      "18018",
      "40701",
      "40726",
      "99292",
      "99278",
    ],
    [
      "40708",
      "18011",
      "99202",
      "40700",
      "40717",
      "99231",
      "99263",
      "40714",
      "40705",
      "99232",
      "99233",
    ],
    [
      "40800",
      "19048",
      "40799",
      "19173",
      "19118",
      "19254",
      "19208",
      "99452",
      "99473",
      "17905",
      "99482",
      "40789",
      "18162",
      "99484",
      "99515",
      "99447",
      "40815",
      "40802",
      "40787",
      "99489",
      "17906",
      "40785",
      "40803",
      "99417",
      "99507",
      "99506",
      "19149",
      "99449",
      "40801",
      "99497",
      "99421",
      "99505",
    ],
    ["40752", "18590", "18712", "18593", "99396", "99321", "88125", "90220"],
    [
      "40780",
      "99488",
      "99433",
      "19184",
      "99466",
      "40842",
      "40796",
      "99463",
      "19163",
      "40781",
      "17920",
    ],
    [
      "40858",
      "88172",
      "40857",
      "19865",
      "40845",
      "88187",
      "99600",
      "17902",
      "40872",
      "40846",
      "88188",
      "17903",
      "99594",
    ],
    [
      "40754",
      "40755",
      "17964",
      "17965",
      "17966",
      "18698",
      "17968",
      "99369",
      "40777",
      "17969",
      "40751",
      "99375",
      "40756",
      "99320",
      "17970",
      "99366",
      "17971",
      "18610",
      "99406",
    ],
    [
      "40798",
      "99518",
      "99459",
      "19245",
      "17904",
      "19350",
      "99504",
      "99512",
      "19526",
      "40797",
      "19393",
      "40814",
    ],
    [
      "40809",
      "99407",
      "99402",
      "19261",
      "99442",
      "99401",
      "99499",
      "40791",
      "40792",
      "40793",
      "40827",
    ],
    [
      "40745",
      "18890",
      "99436",
      "99356",
      "17974",
      "99434",
      "40806",
      "40762",
      "99324",
      "17934",
      "40744",
      "17936",
      "40837",
      "17937",
      "17938",
      "40807",
      "18891",
      "17939",
      "40743",
      "40741",
      "17940",
      "17984",
      "40825",
      "17901",
      "40740",
      "17948",
      "40763",
      "99289",
      "40778",
      "17941",
      "40746",
    ],
    ["40723", "99287", "99295", "99245", "99270", "99266", "99262"], //, "17985"],
    [
      "40811",
      "40831",
      "99538",
      "40833",
      "17925",
      "99455",
      "17926",
      "17927",
      "40810",
      "40832",
      "40834",
      "99493",
      "17928",
      "17929",
      "99527",
      "17930",
      "40813",
      "99456",
      "99514",
      "99446",
      "40794",
      "17931",
      "99513",
      "99508",
      "40812",
      "17932",
      "99537",
      "17933",
    ],
    [
      "40729",
      "18541",
      "18496",
      "40733",
      "40730",
      "88118",
      "18451",
      "99298",
      "99335",
      "40715",
    ],
    [
      "40757",
      "17958",
      "99405",
      "40742",
      "40761",
      "99277",
      "18797",
      "40739",
      "99386",
      "88120",
      "40758",
      "18719",
      "99336",
    ],
    [
      "40856",
      "40879",
      "19947",
      "17960",
      "40898",
      "40870",
      "17961",
      "40885",
      "99650",
      "40829",
      "19998",
      "99623",
      "40878",
      "17978",
      "19942",
      "19980",
      "19992",
      "17979",
      "17962",
      "17980",
      "40874",
      "99608",
      "40895",
      "17963",
      "19574",
      "19546",
    ],
    [
      "40848",
      "40818",
      "99579",
      "99607",
      "40828",
      "17908",
      "99516",
      "19689",
      "99561",
      "17910",
      "19639",
      "99575",
      "99646",
      "19739",
      "40855",
      "99612",
      "99638",
      "40862",
      "19625",
      "40847",
      "99590",
      "99566",
      "40844",
      "17911",
      "99597",
      "40864",
      "40859",
      "99601",
      "99630",
      "99634",
      "40861",
      "19780",
      "17913",
      "19915",
      "40873",
      "88190",
      "17914",
      "19924",
      "99580",
      "40869",
    ],
    [
      "40731",
      "99368",
      "18545",
      "99310",
      "99327",
      "99367",
      "99301",
      "99319",
      "99365",
      "99303",
    ],
    [
      "40770",
      "18999",
      "18934",
      "18956",
      "18958",
      "40887",
      "18969",
      "99426",
      "99440",
      "99414",
    ],
    [
      "40747",
      "99280",
      "40748",
      "18833",
      "40749",
      "18828",
      "40727",
      "40772",
      "99425",
      "40750",
      "18640",
      "99382",
    ],
    [
      "40841",
      "99625",
      "40839",
      "40853",
      "99576",
      "40854",
      "99550",
      "17921",
      "99534",
      "99562",
      "17922",
      "19854",
      "99549",
      "40851",
      "40843",
      "40849",
      "19863",
      "17923",
      "19805",
      "17924",
      "40877",
      "19504",
      "19680",
      "40852",
      "19650",
      "19923",
      "19807",
    ],
    [
      "40766",
      "40779",
      "18883",
      "99428",
      "99427",
      "19018",
      "40764",
      "40765",
      "99429",
      "18981",
      "99435",
      "40771",
      "99454",
      "99431",
    ],
    [
      "40836",
      "99565",
      "99552",
      "17942",
      "17943",
      "99555",
      "40838",
      "40835",
      "17945",
      "17944",
    ],
    [
      "40738",
      "18259",
      "18280",
      "99271",
      "99242",
      "99304",
      "18193",
      "18286",
      "99300",
      "18339",
      "18301",
      "88113",
      "17918",
      "99241",
      "90115",
      "99240",
      "40721",
      "18255",
      "99237",
    ],
    [
      "40719",
      "40709",
      "18221",
      "18261",
      "40718",
      "99249",
      "40805",
      "99302",
      "99272",
      "18143",
      "99317",
      "99282",
      "18253",
      "17983",
      "18219",
      "18235",
      "99268",
      "99276",
      "18245",
      "17915",
      "18205",
      "99281",
      "40720",
    ],
    [
      "40782",
      "99445",
      "40783",
      "40774",
      "40786",
      "40773",
      "99444",
      "99474",
      "99501",
      "17946",
      "40776",
      "99438",
    ],
    [
      "40759",
      "99361",
      "99309",
      "99308",
      "17949",
      "40736",
      "99357",
      "99306",
      "18389",
      "18332",
      "17950",
      "17951",
      "40732",
      "99340",
      "99360",
      "17952",
      "40735",
      "17953",
      "18488",
      "17954",
      "17955",
      "40737",
      "99348",
      "18410",
      "40760",
      "99299",
      "17956",
      "40788",
      "17957",
      "17977",
      "40734",
    ],
    [
      "40769",
      "88132",
      "99410",
      "99409",
      "99443",
      "99439",
      "99461",
      "99398",
      "99372",
      "99441",
      "99412",
      "99424",
      "99432",
      "40891",
    ],
    [
      "40875",
      "40890",
      "99666",
      "99680",
      "40883",
      "99665",
      "40884",
      "40893",
      "40889",
      "40882",
      "40881",
      "40863",
      "99674",
      "99656",
      "99686",
      "40880",
      "99675",
      "40876",
    ],
    [
      "40768",
      "99422",
      "18895",
      "40886",
      "18811",
      "99385",
      "99387",
      "99388",
      "99380",
      "40775",
      "99384",
    ],
    [
      "40821",
      "99539",
      "19352",
      "19408",
      "40820",
      "99522",
      "19438",
      "40790",
      "40840",
      "99528",
      "99511",
      "99574",
    ],
    specificRoute,
  ];
  if (routeName.includes(route_num)) {
    return routeCodes[routeName.indexOf(route_num)];
  } else {
    return routeCodes[0];
  }
}
/* **************************************************************************************** */
function weather_state(weather_icon) {
  const wwNames = [
    "صاف",
    "کمی ابری",
    "قسمتی ابری",
    "نیمه ابری",
    "ابری",
    "بتدریج ابری",
    "وزش باد ملایم",
    "کاهش ابر",
    "افزایش ابر",
    "کاهش دما",
    "افزایش دما",
    "کاهش باد",
    "افزایش باد",
    "رعد و برق",
    "رگبار و رعد و برق",
    "رعد و برق و رگبار",
    "وزش باد",
    "باد و گرد و خاک",
    "وزش باد شدید",
    "غبارآلود",
    "غبارمحلی",
    "غبارصبحگاهی",
    "مه آلود",
    "مه رقیق",
    "غبار رقیق",
    "مه غلیظ",
    "بارش پراکنده",
    "بارش مداوم باران",
    "بارش خفیف باران",
    "رگبار باران",
    "بارش باران",
    "بارش باران و برف",
    "رگبار برف",
    "بارش برف",
    "تگرگ",
    "کولاک برف",
    "طوفان و گرد و خاک",
    "دریا آرام",
    "دریا مواج",
    "هوا آلوده",
    "افزایش رطوبت و شرجی",
    "گرد و خاک",
    "باران ریزه",
    "باران یخزن",
    "بارش پراکنده باران",
    "بارش پراکنده برف",
    "بتدریج کاهش ابر",
    "بدون بارش",
    "دود آلود",
    "غبار آلود همراه با وزش باد",
    "کاهش محسوس دما",
    "افزایش محسوس دما",
    "هوا ناسالم",
    "هوا ناسالم برای گروه های حساس",
    "یخبندان",
    "",
    "ایستگاه خودکار",
  ];
  const wwCodes = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 0, 101,
  ];
  if (wwCodes.includes(parseInt(weather_icon))) {
    return wwNames[wwCodes.indexOf(parseInt(weather_icon))];
  } else {
    return "فاقد داده";
  }
}
/* **************************************************************************************** */
// Add Forecast Days'name to the Buttons
function frcDaysName(i) {
  var today = new Date();
  var emrooz = new Date(today.getTime());
  var two_nextday = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  var three_nextday = new Date(today.getTime() + 48 * 60 * 60 * 1000);
  var four_nextday = new Date(today.getTime() + 72 * 60 * 60 * 1000);
  frctdays = [emrooz, two_nextday, three_nextday, four_nextday];
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
  frcday = [
    miladi_be_shamsi(
      emrooz.getFullYear(),
      emrooz.getMonth() + 1,
      emrooz.getDate()
    ),
    miladi_be_shamsi(
      two_nextday.getFullYear(),
      two_nextday.getMonth() + 1,
      two_nextday.getDate()
    ),
    miladi_be_shamsi(
      three_nextday.getFullYear(),
      three_nextday.getMonth() + 1,
      three_nextday.getDate()
    ),
    miladi_be_shamsi(
      four_nextday.getFullYear(),
      four_nextday.getMonth() + 1,
      four_nextday.getDate()
    ),
  ];
  const weekDayFa = days[frctdays[i - 1].getDay()];
  const dayFa = frcday[i - 1].split("/")[2];
  const monthFa = monthNames[parseInt(frcday[i - 1].split("/")[1]) - 1];
  const yearFa = frcday[i - 1].split("/")[0];
  dayName1 =
    "پیش بینی جوی " +
    "&nbsp&nbsp" +
    days[frctdays[i - 1].getDay()] +
    "&nbsp&nbsp" +
    dayFa +
    "&nbsp" +
    monthFa +
    "&nbsp" +
    yearFa;
  document.getElementById("btn2").innerHTML = dayName1;
}
/* **************************************************************************************** */
// Remove Plotted Data from Map
function removemarker() {
  if (finalroute) {
    markerGroupMain.removeLayer(finalroute);
  }
  map.removeLayer(markerGroupMain);
  markerGroupMain = []; //.clearLayers();
  finalroute = "";
}
function removemarkerNotRoute() {
  if (finalroute) {
    markerGroupMain.removeLayer(finalroute);
  }
  map.removeLayer(markerGroupMain);
  markerGroupMain.clearLayers();
}
/* **************************************************************************************** */
/// Add Info such as forecast points marker and route to the Map
function map_point() {
  var route_number = window.route_num;
  var route1 = route(route_number);
  var comment = "";
  var status = "";
  var status_icon = "";
  var obj1 = [];
  var frcindex;
  var latArray = [];
  var lonArray = [];
  stationsList = [];
  stationBullTime = [];
  citiesInTable = 0;
  obj1 = window.jobg;
  markerGroup = new L.layerGroup();
  wwMarkerGroup = new L.layerGroup();
  for (h = 0; h < route1.length; h++) {
    for (k = 0; k < obj1.length; k++) {
      if (obj1[k].wmo_code === route1[h]) {
        console.log(obj1[k].wmo_code);
        if (!(obj1[k].bulletin_time_text === null)) {
          var start_date = obj1[k].bulletin_time_text;
          start_date = start_date.substring(0, 10);
          start_date = start_date.split("-").join("/");
          var d = new Date(start_date);
          d =
            d.getFullYear() +
            "/" +
            parseInt(d.getMonth() + 1) +
            "/" +
            d.getDate();
          var today = new Date(new Date().setHours(0, 0, 0, 0));
          today =
            today.getFullYear() +
            "/" +
            parseInt(today.getMonth() + 1) +
            "/" +
            today.getDate();
          var yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);
          yesterday = new Date(yesterday.setHours(0, 0, 0, 0));
          yesterday =
            yesterday.getFullYear() +
            "/" +
            parseInt(yesterday.getMonth() + 1) +
            "/" +
            yesterday.getDate();
          if (obj1[k].wmo_code === "17985") {
            console.log(obj1[k].wmo_code);
            obj1[k].lat === 36.9871;
            obj1[k].lon === 56.2892;
          }
          if (
            d >= yesterday &&
            !(obj1[k].lat === null) &&
            !(obj1[k].lon === null)
          ) {
            stationsList.push(obj1[k].wmo_code);
            //Aslandooz station latlong wrong and correct
            if (obj1[k].wmo_code === "18011") {
              lonArray.push(47.4113);
              latArray.push(parseFloat(obj1[k].lat));
              // joybar Station latlon wrong and correct
            } else if (obj1[k].wmo_code === "17950") {
              lonArray.push(52.9031);
              latArray.push(36.6406);
            } else if (obj1[k].wmo_code === "19208") {
              lonArray.push(50.163);
              latArray.push(33.0809);
            } else {
              lonArray.push(parseFloat(obj1[k].lon));
              latArray.push(parseFloat(obj1[k].lat));
            }
            bull_date = miladi_be_shamsi(
              parseInt(today.split("/")[0]),
              parseInt(today.split("/")[1]),
              parseInt(today.split("/")[2])
            );
            if (d === today) {
              frctime = ["24", "48", "72", "96"];
              stationBullTime.push(1);
            } else {
              frctime = ["48", "72", "96", "120"];
              stationBullTime.push(2);
            }
            var comment0,
              comment1,
              comment2,
              comment3,
              comment4,
              comment5,
              winddir,
              winddir0;
            let markerLon, markerLat;
            const frcindex = window.day_num - 1;
            //******************************************** */
            // present weather collection
            //********************************************** */
            comment0 = obj1[k].local_station;
            if (comment0.includes("(اقلیم شناسی خودکار)")) {
              comment0 = comment0.replace("(اقلیم شناسی خودکار)", "");
            }
            if (obj1[k].wmo_code === "40754") {
              comment0 = "تهران";
            }
            if (obj1[k].wmo_code === "40794") {
              comment0 = "دزفول";
            }
            if (obj1[k].wmo_code === "40768") {
              comment0 = "همدان";
            }
            if (obj1[k].wmo_code === "40863") {
              comment0 = "حاجی آباد";
            }
            if (obj1[k].wmo_code === "40858") {
              comment0 = "بوشهر";
            }
            comment1 = obj1[k]["weather_icon"];
            status = weather_state(comment1);
            if (!comment1 || parseInt(comment1) === 0) {
              status_icon = "assets/images/icons/" + null + ".png";
            } else {
              let currentHour = new Date().getHours();
              if (currentHour >= 20 || currentHour <= 4) {
                status_icon = "assets/images/icons/night/" + comment1 + ".png";
              } else {
                status_icon = "assets/images/icons/" + comment1 + ".png";
              }
            }

            if (obj1[k].present_temperature_c === null) {
              comment2 = "-";
            } else {
              comment2 = parseFloat(obj1[k].present_temperature_c).toFixed(0);
            }

            if (obj1[k].humidity === null) {
              comment3 = "-";
            } else {
              comment3 = parseFloat(obj1[k].humidity).toFixed(0);
            }
            comment4 = Math.round(obj1[k].wind_speed_mps * 3.6).toFixed(0);
            if (comment4 === null || comment4 == 0) {
              comment4 = "-";
            }
            if (comment4 === "-" || comment4 === "&nbsp") {
              winddir0 = "-";
            } else if (obj1[k].wind_direction_degree === null) {
              winddir0 = "-";
            } else {
              comment5 = parseFloat(obj1[k].wind_direction_degree).toFixed(0);
              winddir = [
                "شمالی",
                "شمال شرقی",
                "شرقی",
                "جنوب شرقی",
                "جنوبی",
                "جنوب غربی",
                "غربی",
                "شمال غربی",
              ];
              if ((comment5 >= 0 && comment5 < 22.5) || comment5 > 337.5) {
                winddir0 = winddir[0];
              } else if (comment5 >= 22.5 && comment5 < 67.5) {
                winddir0 = winddir[1];
              } else if (comment5 >= 67.5 && comment5 < 112.5) {
                winddir0 = winddir[2];
              } else if (comment5 >= 112.5 && comment5 < 157.5) {
                winddir0 = winddir[3];
              } else if (comment5 >= 157.5 && comment5 < 202.5) {
                winddir0 = winddir[4];
              } else if (comment5 >= 202.5 && comment5 < 247.5) {
                winddir0 = winddir[5];
              } else if (comment5 >= 247.5 && comment5 < 292.5) {
                winddir0 = winddir[6];
              } else if (comment5 >= 292.5 && comment5 < 337.5) {
                winddir0 = winddir[7];
              }
            }

            var table1 =
              '<table class="popupTable"><tr><td class="cityWW" colspan="3">' +
              comment0 +
              " - " +
              'هوای حاضر</td></tr><tr><td title="' +
              status +
              '" colspan="2"><img class="cityImg" src="' +
              status_icon +
              '"></img></td><td>' +
              status +
              '</td></tr><tr><td class="wwparamsl2">' +
              comment2.toString() +
              '</td><td class="wwparamsl">C°</td><td class="wwparamsr">دمای حاضر</td></tr><tr><td class="wwparamsl2">' +
              comment3.toString() +
              '</td><td class="wwparamsl">%</td><td class="wwparamsr">رطوبت نسبی</td></tr><tr><td class="wwparamsl2">' +
              comment4.toString() +
              '</td><td class="wwparamsl">km/h</td><td class="wwparamsr">سرعت باد</td></tr><tr><td class="wwparams" colspan="2">' +
              winddir0.toString() +
              '</td><td class="wwparamsr">جهت باد</td></tr></table>';
            metIcon = L.icon({ iconUrl: status_icon, iconSize: [50, 50] });
            if (obj1[k].wmo_code === "18011") {
              markerLon = 47.4113;
              markerLat = parseFloat(obj1[k].lat);
            } else if (obj1[k].wmo_code === "17950") {
              markerLon = 52.9031;
              markerLat = 36.6406;
            } else if (obj1[k].wmo_code === "19208") {
              markerLon = 50.163;
              markerLat = 33.0809;
            } else if (obj1[k].wmo_code === "17985") {
              markerLon = 56.283;
              markerLat = 36.987;
            } else {
              markerLon = parseFloat(obj1[k].lon);
              markerLat = parseFloat(obj1[k].lat);
            }
            const markerWW = L.marker([markerLat, markerLon], {
              id: k,
              icon: metIcon,
              title: obj1[k].local_station + ":" + status,
            });
            markerWW.addTo(wwMarkerGroup);
            markerWW.bindPopup(table1, {
              minWidth: 200,
              maxWidth: 200,
              closeButton: true,
            });
            //**************************************** */
            // Forecast Data collection
            //********************************************** */
            comment1 = obj1[k]["weather_" + frctime[frcindex] + "_fa"];
            if (obj1[k]["max_temp_" + frctime[frcindex] + "h"] === null) {
              comment2 = "&nbsp";
            } else {
              comment2 = obj1[k]["max_temp_" + frctime[frcindex] + "h"];
            }
            if (obj1[k]["min_temp_" + frctime[frcindex] + "h"] === null) {
              comment3 = "&nbsp";
            } else {
              comment3 = obj1[k]["min_temp_" + frctime[frcindex] + "h"];
            }
            var table1 =
              '<table class="popupTable"><tr><td class="city" colspan="2">' +
              comment0 +
              '</td></tr><tr><td class="frcstcontent" colspan="2">' +
              comment1 +
              '</td></tr><tr><td class="tmax" title="دمای بیشینه (C°)">' +
              comment2.toString() +
              '</td><td class="tmin" title="دمای کمینه (C°)">' +
              comment3.toString() +
              "</td></tr></table>";
            status = weather_state(obj1[k]["dayph_" + frctime[frcindex]]);
            let currentHour = new Date().getHours();
            if ((currentHour >= 20 || currentHour <= 4) && frcindex === 0) {
              status_icon =
                "assets/images/icons/night/" +
                obj1[k]["dayph_" + frctime[frcindex]] +
                ".png";
            } else {
              status_icon =
                "assets/images/icons/" +
                obj1[k]["dayph_" + frctime[frcindex]] +
                ".png";
            }
            metIcon = L.icon({ iconUrl: status_icon, iconSize: [50, 50] });
            if (obj1[k].wmo_code === "18011") {
              markerLon = 47.4113;
              markerLat = parseFloat(obj1[k].lat);
            } else if (obj1[k].wmo_code === "17950") {
              markerLon = 52.9031;
              markerLat = 36.6406;
            } else if (obj1[k].wmo_code === "19208") {
              markerLon = 50.163;
              markerLat = 33.0809;
            } else if (obj1[k].wmo_code === "17985") {
              markerLon = 56.283;
              markerLat = 36.987;
            } else {
              markerLon = parseFloat(obj1[k].lon);
              markerLat = parseFloat(obj1[k].lat);
            }
            const marker = L.marker([markerLat, markerLon], {
              id: k,
              icon: metIcon,
              title: obj1[k].local_station + ":" + status,
            });
            marker.addTo(markerGroup);
            marker.bindPopup(table1, {
              minWidth: 200,
              maxWidth: 200,
              closeButton: true,
            });
          }
        }
      }
    }
  }
  if (presentWW) {
    markerGroupMain = wwMarkerGroup;
  } else {
    markerGroupMain = markerGroup;
  }
  if (finalroute) {
    markerGroupMain.addLayer(finalroute).addTo(map);
    hideLoading();
  } else {
    if (provinceForecast) {
      provinceBorder.addTo(markerGroupMain);
    }
    markerGroupMain.addTo(map);
  }
  routechart();
  var offset = 0.2;
  var minLat = Math.min.apply(null, latArray) - offset;
  var maxLat = Math.max.apply(null, latArray) + offset;
  var minLon = Math.min.apply(null, lonArray) - offset;
  var maxLon = Math.max.apply(null, lonArray) + offset;
  bounds = L.latLngBounds(L.latLng(minLat, minLon), L.latLng(maxLat, maxLon));
  map.flyToBounds(bounds);
  clickOnCityTables();
}
/* **************************************************************************************** */
// Add cities data as tables
/* **************************************************************************************** */
function routechart() {
  var markersize2 = 60;
  var route_number = window.route_num;
  var route1 = route(route_number);
  var label1 = "";
  var title1 = "";
  var cities_name = [];
  var cities_min_temp = [];
  var cities_max_temp = [];
  var cities_icon = [];
  var cities_abs = [];
  var obj1 = window.jobg;
  var frcindex = day_num - 1;
  var forecast = [
    window.dayName1,
    window.dayName2,
    window.dayName3,
    window.dayName4,
  ];
  for (h = 0; h < stationsList.length; h++) {
    for (k = 0; k < obj1.length; k++) {
      if (obj1[k].wmo_code === stationsList[h]) {
        if (stationBullTime[h] === 1) {
          frctime = ["24", "48", "72", "96"];
        } else {
          frctime = ["48", "72", "96", "120"];
        }
        cities_name[h] = obj1[k].local_station;
        if (cities_name[h].includes("(اقلیم شناسی خودکار)")) {
          cities_name[h] = cities_name[h].replace("(اقلیم شناسی خودکار)", "");
        }
        if (cities_name[h].includes("-")) {
          temp = cities_name[h].split("-");
          cities_name[h] = temp[0];
        }
        if (obj1[k].wmo_code === "40754") {
          cities_name[h] = "تهران";
        }
        if (obj1[k].wmo_code === "40794") {
          cities_name[h] = "دزفول";
        }
        if (obj1[k].wmo_code === "40768") {
          cities_name[h] = "همدان";
        }
        if (obj1[k].wmo_code === "40863") {
          cities_name[h] = "حاجی آباد";
        }
        if (obj1[k].wmo_code === "40858") {
          cities_name[h] = "بوشهر";
        }
        cities_min_temp[h] = parseFloat(
          obj1[k]["min_temp_" + frctime[frcindex] + "h"]
        );
        if (isNaN(cities_min_temp[h])) {
          cities_min_temp[h] = "&nbsp";
        }
        cities_max_temp[h] = parseFloat(
          obj1[k]["max_temp_" + frctime[frcindex] + "h"]
        );
        if (isNaN(cities_max_temp[h])) {
          cities_max_temp[h] = "&nbsp";
        }
        let currentHour = new Date().getHours();
        if ((currentHour >= 20 || currentHour <= 4) && frcindex === 0) {
          cities_icon[h] =
            "assets/images/icons/night/" +
            obj1[k]["dayph_" + frctime[frcindex]] +
            ".png";
        } else {
          cities_icon[h] =
            "assets/images/icons/" +
            obj1[k]["dayph_" + frctime[frcindex]] +
            ".png";
        }
        cities_abs[h] = weather_state(obj1[k]["dayph_" + frctime[frcindex]]);
        title1 =
          " پیش بینی " + "  " + forecast[frcindex] + "  " + frcday[frcindex];
      }
    }
  }
  const tableWidth = Math.round(
    (100 - cities_name.length) / cities_name.length
  );
  cityTable = "";
  citiesInTable = cities_name.length;
  for (var i = 0; i < cities_name.length; i++) {
    cityTable +=
      '<div class="cityDiv"><table id="city' +
      i +
      '" class="cityTable"><tr><td class="cityName">' +
      cities_name[i] +
      '</td></tr><tr><td><img class="cityImg" src="' +
      cities_icon[i] +
      '"></img></td></tr><tr><td id="cityAbs" class="wwAbstract">' +
      cities_abs[i] +
      '</td></tr><tr><td class="cityTmax" title="دمای بیشینه (C°)">' +
      cities_max_temp[i] +
      '</td></tr><tr><td class="cityTmin" title="دمای کمینه (C°)">' +
      cities_min_temp[i] +
      "</td></tr></table></div>";
  }
  document.querySelector(".table-container").innerHTML = cityTable;
}
/* **************************************************************************************** */
// As click on city table, popup on the map

function clickOnCityTables() {
  var iTable, jTable, kTable;
  for (iTable = 0; iTable < citiesInTable; iTable++) {
    const table = document.querySelector("#city" + iTable);
    if (table != null) {
      for (jTable = 0; jTable < table.rows.length; jTable++) {
        for (kTable = 0; kTable < table.rows[jTable].cells.length; kTable++)
          table.rows[jTable].cells[kTable].addEventListener(
            "click",
            function () {
              const keys = Object.keys(markerGroup._layers);
              tableId = parseInt(
                this.parentNode.parentNode.parentNode.id.replace("city", "")
              );
              firstPos = Object.keys(markerGroup._layers[keys[0]]);
              if (window.route_num === "specificR") {
                markerGroup._layers[keys[tableId + 1]].openPopup();
              } else {
                if (firstPos.includes("urls")) {
                  markerGroup._layers[keys[tableId + 1]].openPopup();
                } else {
                  markerGroup._layers[keys[tableId]].openPopup();
                }
              }
            }
          );
      }
    }
  }
}
/* **************************************************************************************** */
// Action on clicking forecast days buttons
function moveForeward() {
  const btn = document.querySelector("#btn2");
  if (window.day_num < 4) {
    presentWW = false;
    window.day_num++;
    frcDaysName(window.day_num);
    if (window.r === 32) {
      removemarkerNotRoute();
      map_point();
    } else {
      change(window.r);
    }
  }
}

function moveBackward() {
  const btn = document.querySelector("#btn2");
  if (window.day_num > 1) {
    presentWW = false;
    window.day_num--;
    frcDaysName(window.day_num);
    if (window.r === 32) {
      removemarkerNotRoute();
      map_point();
    } else {
      change(window.r);
    }
  }
}
/* **************************************************************************************** */
// Main function to plot data on map
function change(rr) {
  window.r = rr;
  removemarker();
  switch (window.r) {
    case 0:
      window.route_num = "iran";
      map_point();
      break;
    case 1:
      window.route_num = "1";
      map_point();
      break;
    case 2:
      window.route_num = "2";
      map_point();
      break;
    case 3:
      window.route_num = "3";
      map_point();
      break;
    case 4:
      window.route_num = "4";
      map_point();
      break;
    case 5:
      window.route_num = "5";
      map_point();
      break;
    case 6:
      window.route_num = "6";
      map_point();
      break;
    case 7:
      window.route_num = "7";
      map_point();
      break;
    case 8:
      window.route_num = "8";
      map_point();
      break;
    case 9:
      window.route_num = "9";
      map_point();
      break;
    case 10:
      window.route_num = "10";
      map_point();
      break;
    case 11:
      window.route_num = "11";
      map_point();
      break;
    case 12:
      window.route_num = "12";
      map_point();
      break;
    case 13:
      window.route_num = "13";
      map_point();
      break;
    case 14:
      window.route_num = "14";
      map_point();
      break;
    case 15:
      window.route_num = "15";
      map_point();
      break;
    case 16:
      window.route_num = "16";
      map_point();
      break;
    case 17:
      window.route_num = "17";
      map_point();
      break;
    case 18:
      window.route_num = "18";
      map_point();
      break;
    case 19:
      window.route_num = "19";
      map_point();
      break;
    case 20:
      window.route_num = "20";
      map_point();
      break;
    case 21:
      window.route_num = "21";
      map_point();
      break;
    case 22:
      window.route_num = "22";
      map_point();
      break;
    case 23:
      window.route_num = "23";
      map_point();
      break;
    case 24:
      window.route_num = "24";
      map_point();
      break;
    case 25:
      window.route_num = "25";
      map_point();
      break;
    case 26:
      window.route_num = "26";
      map_point();
      break;
    case 27:
      window.route_num = "27";
      map_point();
      break;
    case 28:
      window.route_num = "28";
      map_point();
      break;
    case 29:
      window.route_num = "29";
      map_point();
      break;
    case 30:
      window.route_num = "30";
      map_point();
      break;
    case 31:
      window.route_num = "31";
      map_point();
      break;
    case 32:
      window.route_num = "specificR";
      getFromAPI(window.routeurl, selectedPathName)
        .then(() => map_point())
        .catch((err) => {
          alert(
            "ارتباط با وب سرویس مسیریاب قطع می باشد. لطفا مجدد تلاش نمایید"
          );
        });
      break;
    default:
      window.route_num = "iran";
      map_point();
  }
}
/* **************************************************************************************** */
// A simple function to convert gerigorian date to the Jalali date
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
/* **************************************************************************************** */
// Api to get selected rout data for plotting on Map
async function getFromAPI(url, comment) {
  const response = await fetch(url);
  window.myroute = await response.json();
  let tempRoute = [];
  const arrayLength1 = myroute.routes[0]["legs"].length;
  for (var ii = 0; ii < arrayLength1; ii++) {
    const arrayLength2 = myroute.routes[0]["legs"][ii]["steps"].length;
    for (var jj = 0; jj < arrayLength2; jj++) {
      const arrayLength3 =
        myroute.routes[0]["legs"][ii]["steps"][jj]["geometry"].coordinates
          .length;
      for (var kk = 0; kk < arrayLength3; kk++) {
        tempRoute.push(
          myroute.routes[0]["legs"][ii]["steps"][jj]["geometry"].coordinates[kk]
        );
      }
    }
  }
  const routarray = {
    coordinates: tempRoute,
    type: "LineString",
  };
  const posOfMarker = parseInt(Math.round(routarray.coordinates.length / 2));
  const markerLatLng = routarray.coordinates[posOfMarker];
  const distance = Math.round(myroute.routes[0].distance / 1000);
  const hour = Math.trunc(myroute.routes[0].duration / 3600);
  const minutes = Math.round((myroute.routes[0].duration / 3600 - hour) * 60);
  // retrive an array of point with a distance of 10 km on the route to get weather forcast for them to plot on map
  const pointsSeparation = Math.round(
    20 / (distance / routarray.coordinates.length)
  );
  let selectedPointFromRoute = [];
  let point = 0;
  while (point < routarray.coordinates.length) {
    selectedPointFromRoute.push(routarray.coordinates[point]);
    point = point + pointsSeparation;
  }
  if (
    selectedPointFromRoute[selectedPointFromRoute.length - 1] !==
    routarray.coordinates[routarray.coordinates.length - 1]
  ) {
    selectedPointFromRoute.push(
      routarray.coordinates[routarray.coordinates.length - 1]
    );
  }
  specificRoute = [];
  const radiusAroundPoint = 8; //km
  let Cnt = 0;
  let forecastBulletin = window.jobg;
  // let pointsFilter = new Array(routarray.coordinates.length).fill(false);
  for (var pnt = 0; pnt < selectedPointFromRoute.length; pnt++) {
    let onlyOneStation = false;
    for (station = 0; station < forecastBulletin.length; station++) {
      if (
        (!(forecastBulletin[station].bulletin_time_text === null) &&
          !onlyOneStation) ||
        pnt === selectedPointFromRoute.length - 1
      ) {
        // selectedPointFromRoute = selectedPointFromRoute.filter((e,index) => {pointsFilter[index]=== true});
        // pointsFilter = pointsFilter.filter(e=> e===true);
        twoPointDistance = calcDistance(
          forecastBulletin[station].lat,
          forecastBulletin[station].lon,
          selectedPointFromRoute[pnt][1],
          selectedPointFromRoute[pnt][0],
          "K"
        );
        String.prototype.includesOneOf = function (arrayOfStrings) {
          if (!Array.isArray(arrayOfStrings)) {
            throw new Error("includesOneOf only accepts an array");
          }
          return arrayOfStrings.some((str) => this.includes(str));
        };
        if (
          twoPointDistance <= radiusAroundPoint &&
          !specificRoute.includes(forecastBulletin[station].wmo_code)
        ) {
          if (
            !forecastBulletin[station].local_station.includesOneOf([
              "فرودگاه",
              "کشاورزی",
              "دانشگاه",
              "نیروگاه",
            ])
          ) {
            // pointsFilter[pnt]=true;
            specificRoute[Cnt] = forecastBulletin[station].wmo_code.toString();
            Cnt++;
            onlyOneStation = true;
          }
        }
      }
    }
  }
  const myStyle = {
    color: "#191970",
    weight: 5,
    opacity: 0.65,
  };
  finalroute = L.geoJSON(routarray, { style: myStyle });
  let table1 =
    '<table style="width: 100%;text-align:center;border-bottom:1px solid gray;"><tr><td style="font-weight: bold;font-size: 15px;" colspan="3">' +
    comment +
    '</td></tr><tr><td style="font-size: 15px;width=50%;text-align:center!important" colspan="2">' +
    "کیلومتر" +
    '</td><td style="font-weight:bold;font-size: 15px;width=50%;text-align:right!important" >' +
    distance.toString() +
    '</td></tr><tr><td style="font-weight:bold;font-size: 15px;width=20%;text-align:left!important">' +
    "🚘" +
    '</td><td style="font-weight:bold;font-size: 15px;width=40%;text-align:left!important">' +
    "ساعت" +
    '</td><td style="font-weight:bold;font-size: 15px;width=40%">' +
    hour.toString() +
    ":" +
    minutes.toString() +
    "</td></tr></table>";
  finalroute
    .bindPopup(table1, { maxWidth: 100, closeButton: false })
    .openPopup([markerLatLng[1], markerLatLng[0]]);
}
/* **************************************************************************************** */
// A simple function to calculate radial distance between two points on the Earth
function calcDistance(lat1, lon1, lat2, lon2, unit) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
}
/* **************************************************************************************** */
// A function to activate first day button on loading
/* **************************************************************************************** */
// Action when click on find route button
function findRoute() {
  document.getElementById("btn1").disabled = false;
  document.getElementById("btn2").disabled = false;
  document.getElementById("leafletBtn4").disabled = false;
  document.getElementById("leafletBtn3").disabled = false;
  document.getElementById("homeMenu").disabled = false;
  let departureVal = document.querySelector("#departure").value;
  let destinationVal = document.querySelector("#destination").value;
  if (departureSelectedOnMap && destinationSelectedOnMap) {
    if (departureVal && destinationVal) {
      displayLoading();
      resetDirectionItems();
      window.routeurl =
        apiurl +
        departureGeo[0] +
        "," +
        departureGeo[1] +
        ";" +
        destinationGeo[0] +
        "," +
        destinationGeo[1] +
        "?steps=true&geometries=geojson";
      selectedPathName = departureVal + "-" + destinationVal;
      window.route_num = "specificR";
      r = 32;
      change(r);
    } else if (departureVal || destinationVal) {
      if (!departureVal) {
        document.getElementById("departure").focus();
        departureSelected = true;
      } else if (!destinationVal) {
        document.getElementById("destination").focus();
        destinationSelected = true;
      }
    } else if (!departureVal && !destinationVal) {
      document.getElementById("departure").focus();
      departureSelected = true;
    }
  } else {
    if (!departureVal && !destinationVal) {
      displayLoading();
      document.getElementById("departure").focus();
      departureSelected = true;
    } else if (!departureVal) {
      document.getElementById("departure").focus();
      departureSelected = true;
      destinationSelected = false;
    } else if (!destinationVal) {
      document.getElementById("destination").focus();
      departureSelected = false;
      destinationSelected = true;
    } else if (departureVal && destinationVal) {
      if (departureGeo.length === 0 && destinationGeo.length > 0) {
        resetDirectionItems();
        displayLoading();
        geoCoder(departureVal)
          .then((response) => {
            departureGeo = response.features[0].geometry.coordinates;
            drawRoutOnMap(
              departureGeo,
              destinationGeo,
              departureVal,
              destinationVal
            );
          })
          .catch((err) =>
            alert(
              "ارتباط با وب سرویس جغرافیایی برقرار نشد. لطفا دوباره تلاش کنید"
            )
          );
      } else if (destinationGeo.length === 0 && departureGeo.length > 0) {
        resetDirectionItems();
        displayLoading();
        geoCoder(destinationVal)
          .then((response) => {
            destinationGeo = response.features[0].geometry.coordinates;
            drawRoutOnMap(
              departureGeo,
              destinationGeo,
              departureVal,
              destinationVal
            );
          })
          .catch((err) =>
            alert(
              "ارتباط با وب سرویس جغرافیایی برقرار نشد. لطفا دوباره تلاش کنید"
            )
          );
      } else if (destinationGeo.length === 0 && departureGeo.length === 0) {
        resetDirectionItems();
        geoCoder(departureVal)
          .then((response) => {
            displayLoading();
            departureGeo = response.features[0].geometry.coordinates;
            geoCoder(destinationVal)
              .then((response) => {
                destinationGeo = response.features[0].geometry.coordinates;
                drawRoutOnMap(
                  departureGeo,
                  destinationGeo,
                  departureVal,
                  destinationVal
                );
              })
              .catch((err) =>
                alert(
                  "ارتباط با وب سرویس جغرافیایی برقرار نشد. لطفا دوباره تلاش کنید"
                )
              );
          })
          .catch((err) =>
            alert(
              "ارتباط با وب سرویس جغرافیایی برقرار نشد. لطفا دوباره تلاش کنید"
            )
          );
      }
    }
  }
}
/* **************************************************************************************** */
function resetDirectionItems() {
  document.querySelector(".direction").style.display = "none";
  departureSelectedOnMap = false;
  destinationSelectedOnMap = false;
  directionDiv = false;
  departureSelected = false;
  destinationSelected = false;
}
/* **************************************************************************************** */
function drawRoutOnMap(depart, dest, departname, destname) {
  window.routeurl =
    apiurl +
    depart[0] +
    "," +
    depart[1] +
    ";" +
    dest[0] +
    "," +
    dest[1] +
    "?steps=true&geometries=geojson";
  selectedPathName = departname + "-" + destname;
  window.route_num = "specificR";
  r = 32;
  change(r);
}
/* **************************************************************************************** */
function typingDirectionForm() {
  document.querySelector("#departure").addEventListener("keyup", () => {
    departureGeo = [];
    departureSelectedOnMap = false;
    departureSelected = true;
    destinationSelected = false;
  });
  document.querySelector("#destination").addEventListener("keyup", () => {
    destinationGeo = [];
    destinationSelectedOnMap = false;
    departureSelected = false;
    destinationSelected = true;
  });
}
/* **************************************************************************************** */
function surveyBtnClick() {
  document.querySelector("#surveyImg").addEventListener("click", () => {
    document.querySelector(".surveyFormDiv").style.display = "block";
    document.querySelector(".surveyForm").style.display = "grid";
    document.querySelector(".surveyItems").style.display = "grid";
  });
}
/* **************************************************************************************** */
function surveyFormOutClick() {
  document.querySelector(".surveyFormDiv").addEventListener("click", () => {
    document.querySelector(".surveyFormDiv").style.display = "none";
  });
  document.querySelector(".thankYouDiv").addEventListener("click", () => {
    document.querySelector(".thankYouDiv").style.display = "none";
  });
}
/* **************************************************************************************** */
function emojiClick() {
  document.querySelector("#heart").addEventListener("click", () => {
    heartVal += 1;
    thankYou();
  });
  document.querySelector("#happy").addEventListener("click", () => {
    happyVal += 1;
    thankYou();
  });
  document.querySelector("#confused").addEventListener("click", () => {
    confusedVal += 1;
    thankYou();
  });
  document.querySelector("#sad").addEventListener("click", () => {
    sadVal += 1;
    thankYou();
  });
  document.querySelector("#angry").addEventListener("click", () => {
    angryVal += 1;
    thankYou();
  });
}
/* **************************************************************************************** */
function thankYou() {
  document.querySelector(".surveyFormDiv").style.display = "none";
  document.querySelector(".thankYouDiv").style.display = "grid";
  document.querySelector(".thankYou").style.display = "grid";
}
/* **************************************************************************************** */
function mapClicked() {
  if (directionDiv) {
    if (!destinationSelected && !departureSelected) {
      document.querySelector(".direction").style.display = "none";
      directionDiv = false;
    } else {
      getLatLngClicked();
    }
  }
}
/* **************************************************************************************** */
function getLatLngClicked() {
  var destinationName;
  var departureName;
  map.on("click", (e) => {
    reverseGeolocation(e.latlng.lat, e.latlng.lng)
      .then((response) => {
        departureName = destinationName = retriveLocationName(response);
        if (destinationSelected) {
          destinationGeo = [e.latlng.lng, e.latlng.lat];
          if (destinationName) {
            document.querySelector("#destination").value = destinationName;
            destinationSelectedOnMap = true;
          } else {
            document.querySelector("#destination").value =
              e.latlng.lng.toFixed(4) + " , " + e.latlng.lat.toFixed(4);
            destinationSelectedOnMap = true;
          }
        } else if (departureSelected) {
          departureGeo = [e.latlng.lng, e.latlng.lat];
          if (departureName) {
            document.querySelector("#departure").value = departureName;
            departureSelectedOnMap = true;
          } else {
            document.querySelector("#departure").value =
              e.latlng.lng.toFixed(4) + " , " + e.latlng.lat.toFixed(4);
            departureSelectedOnMap = true;
          }
        }
      })
      .catch((err) =>
        alert("ارتباط با وب سرویس جغرافیایی برقرار نشد. لطفا دوباره تلاش کنید")
      );
  });
}
/* **************************************************************************************** */
function retriveLocationName(info) {
  if (info) {
    const locationNames = [
      info.localityInfo.administrative[2].name,
      info.localityInfo.administrative[3].name,
      // locationInfo.localityInfo.administrative[4].name,
    ];
    let checkName = [];
    locationNames.forEach((el, index) => {
      if (
        isLatinString(el) ||
        el.includes("حومه") ||
        el.includes("دهستان حومه")
      ) {
        checkName[index] = false;
      } else {
        checkName[index] = true;
      }
    });
    var locationName;
    for (var i = locationNames.length - 1; i >= 0; i--) {
      if (checkName[i]) {
        locationName = locationNames[i];
        break;
      }
    }
    const extraWords = ["دهستان", "شهرستان", "بخش مرکزی", "بخش", "", ""];
    extraWords.forEach((el) => {
      if (locationName.includes(el)) {
        locationName = locationName.replace(el, "");
      }
    });
    return locationName;
  } else {
    return "";
  }
  function isLatinString(s) {
    var c,
      whietlist =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_/0123456789%+*#@& ()";
    for (c in s) if (!whietlist.includes(s[c])) return false;
    return true;
  }
}
// ****************************************************************************************
function departureClick() {
  if (!destinationSelected) {
    departureSelected = true;
  } else {
    destinationSelected = false;
    departureSelected = true;
  }
}
function destinationClick() {
  if (!departureSelected) {
    destinationSelected = true;
  } else {
    departureSelected = false;
    destinationSelected = true;
  }
}
// ****************************************************************************************
/// This function return name of a latlng position
async function reverseGeolocation(lat, lng) {
  try {
    url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=fa`;
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    return "";
  }
}
// ****************************************************************************************
/// This function convert a location name to its latlng
async function geoCoder(locationName) {
  try {
    const url = `https://api.traveltimeapp.com/v4/geocoding/search?query=${locationName}&limit=1`;
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("X-Application-Id", "771be659");
    headers.append("X-Api-Key", "edb5bfb9cc4108a0a49bc20b05dba634");
    headers.append("Accept-Language", "fa");
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    return await response.json();
  } catch (err) {
    return "";
  }
}

// ****************************************************************************************
// showing loading
function displayLoading() {
  loader.classList.add("display");
  // to stop loading after some time
  setTimeout(() => {
    loader.classList.remove("display");
  }, 5000);
}
// hiding loading
function hideLoading() {
  loader.classList.remove("display");
}
// ****************************************************************************************
function provinceClick(i) {
  presentWW = false;
  document.getElementById("overlay").style.display = "none";
  document.getElementById("sidebar").style.display = "none";
  sidebarselected = false;
  provinceForecast = true;
  const myStyle = {
    color: "#5B7FA6",
    weight: 3,
  };
  filePath = "assets/irangeojson/" + i.toString() + ".geojson";
  provinceBorder = new L.GeoJSON.AJAX(filePath, { style: myStyle });
  window.r = i;
  change(window.r);
  document.getElementById("provinces").style.scrollBehavior = "initial";
}
// ****************************************************************************************
function scrollWeelOnTable() {
  const container = document.getElementById("table-container");
  container.addEventListener("wheel", function (e) {
    if (e.deltaY > 0) {
      container.scrollLeft += 100;
      e.preventDefault();
    } else {
      container.scrollLeft -= 100;
      e.preventDefault();
    }
  });
}
// ****************************************************************************************
function showHelp() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("sidebar").style.display = "none";
  sidebarselected = false;
  document.getElementById("helpContent").style.display = "block";
}
// ****************************************************************************************
function closeHelp() {
  document.getElementById("helpContent").style.display = "none";
}
// ****************************************************************************************
