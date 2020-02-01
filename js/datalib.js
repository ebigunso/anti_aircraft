// Remove unused ship data
var TO_DELETE = ["3"]
gShips = gShips.filter(function (ship) {
    return TO_DELETE.indexOf(ship.id) < 0
});

const DECK_VERSION = 4;
const FK = ['f1', 'f2', 'f3', 'f4'];
const SK = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'];
const IK = ['i1', 'i2', 'i3', 'i4', 'i5', 'ix'];

const TYPE_ORDER = ["補給艦", "練習巡洋艦", "潜水母艦", "工作艦", "装甲空母", "揚陸艦", "水上機母艦", "潜水空母", "潜水艦"
    , "正規空母", "航空戦艦", "戦艦", "巡洋戦艦", "軽空母"
    , "航空巡洋艦", "重巡洋艦", "重雷装巡洋艦", "軽巡洋艦", "駆逐艦", "海防艦"
];

const ITEM_TYPE3_COUNT = 47;

var AC_SHORT_NAME = {
    '九六式艦戦': '九六艦戦',
    '零式艦戦21型': '零戦21型',
    '零式艦戦52型': '零戦52型',
    '彗星一二型甲': '彗星甲',
    '零式艦戦62型(爆戦)': '爆戦62型',
    '九七式艦攻': '九七艦攻',
    '九九式艦爆': '九九艦爆',
    '九七式艦攻(九三一空)': '931九七攻',
    '天山(九三一空)': '931天山',
    '二式艦上偵察機': '二式艦偵',
    '零式水上偵察機': '零式水偵',
    '零式水上観測機': '零式水観',
    '瑞雲(六三四空)': '634瑞雲',
    '瑞雲12型(六三四空)': '634瑞雲12',
    '三式指揮連絡機(対潜)': '三式連絡',
    'カ号観測機': 'カ号',
    '零式艦戦21型(熟練)': '零戦21熟',
    '九九式艦爆(熟練)': '九九爆熟',
    '九七式艦攻(熟練)': '九七攻熟',
    '九七式艦攻(友永隊)': '友永九七',
    '九七式艦攻(村田隊)': '村田九七',
    '天山一二型(友永隊)': '友永天山',
    '天山一二型(村田隊)': '村田天山',
    '九九式艦爆(江草隊)': '江草九九',
    '彗星(江草隊)': '江草彗星',
    '零戦52型丙(六〇一空)': '601零戦52',
    '烈風(六〇一空)': '601烈風',
    '彗星(六〇一空)': '601彗星',
    '天山(六〇一空)': '601天山',
    '流星(六〇一空)': '601流星',
    '九八式水上偵察機(夜偵)': '夜偵',
    '試製景雲(艦偵型)': '景雲',
    '零式艦戦52型(熟練)': '零戦52熟',
    '零戦52型丙(付岩井小隊)': '付岩井52',
    '零戦62型(爆戦/岩井隊)': '岩井爆戦',
    '零戦21型(付岩本小隊)': '付岩本21',
    '零戦52型甲(付岩本小隊)': '付岩本52',
    '零式艦戦53型(岩本隊)': '零戦虎徹',
    'Ro.44水上戦闘機': 'Ro44'
};

const SHORT_NAME = {
    '20.3cm(2号)連装砲': '2号砲',
    '20.3cm(3号)連装砲': '3号砲',
    '61cm五連装(酸素)魚雷': '五連酸',
    'ドラム缶(輸送用)': 'ドラム缶',
    '10cm連装高角砲+高射装置': '秋月砲',
    '22号対水上電探改四': '22探改四',
    'FuMO25 レーダー': 'FuMO',
    '32号対水上電探': '32探',
    '32号対水上電探改': '32探改',
    '大発動艇(八九式中戦車&陸戦隊)': '陸戦隊'
};

Array.prototype.push.apply(SHORT_NAME, AC_SHORT_NAME);
for (var key in AC_SHORT_NAME) {
    if (AC_SHORT_NAME.hasOwnProperty(key)) {
        SHORT_NAME[key] = AC_SHORT_NAME[key];
    }
}

// type[1] constants
const T1_MAIN_BATTERY = 1;
const T1_SUB_BATTERY = 2;
const T1_AIRCRAFT_FBT = 5;
const T1_ALL_SCOUT = 7;
const T1_RADAR = 8;
const T1_SONAR = 10;
const T1_AP_SHELL = 25;
const T1_ASS_CHARGE = 32;
const T1_SEA_BOMBER = 43;

// type[2] constants
const T2_GUN_SMALL = 1;
const T2_GUN_MEDIUM = 2;
const T2_GUN_LARGE = 3;
const T2_SUB_GUN = 4;
const T2_TORPEDO = 5;
const T2_FIGHTER = 6;
const T2_BOMBER = 7;
const T2_TORPEDO_BOMBER = 8;
const T2_SCOUT = 9;
const T2_SEA_SCOUT = 10;
const T2_SEA_BOMBER = 11;
const T2_RADAR_SMALL = 12;
const T2_RADAR_LARGE = 13;
const T2_SONAR = 14;
const T2_DEPTH_CHARGE = 15;
const T2_SANSHIKIDAN = 18;
const T2_AP_SHELL = 19;
const T2_MACHINE_GUN = 21;
const T2_SEARCHLIGHT = 29;
const T2_ANTI_AIR_DEVICE = 36;
const T2_SONAR_LARGE = 40;
const T2_FLYING_BOAT = 41;
const T2_SEARCHLIGHT_LARGE = 42;
const T2_SEA_FIGHTER = 45;
const T2_LAND_ATTACKER = 47;
const T2_LAND_FIGHTER = 48;
const T2_JET_BOMBER = 57;

const T2LIST_AIRCRAFTS = [T2_FIGHTER, T2_BOMBER, T2_TORPEDO_BOMBER, T2_JET_BOMBER, T2_SCOUT, T2_SEA_SCOUT,
        T2_SEA_BOMBER, 25, 26, T2_FLYING_BOAT, T2_SEA_FIGHTER, T2_LAND_ATTACKER, T2_LAND_FIGHTER ];

// type[3] constants
const T3_GUN_LARGE = 3;
const T3_RADAR = 11;
const T3_SANSHIKIDAN = 12;
const T3_MACHINE_GUN = 15;
const T3_HIGH_ANGLE_GUN = 16;
const T3_DEPTH_CHARGE = 17;
const T3_SONAR = 18;
const T3_SEARCHLIGHT = 24;
const T3_AAC_DEVICE = 30;
const T3_AAC_NIGHTFIGHTER = 45;
const T3_AAC_NIGHTATTACKER = 46;

const AAC_NIGHT_OTHERS = [320, 242, 243, 244, 154];

function getACShortName(ac) {
    return AC_SHORT_NAME[ac.name] ? AC_SHORT_NAME[ac.name] : ac.name
}

function getShortName(item) {
    return SHORT_NAME[item.name] ? SHORT_NAME[item.name] : item.name
}

function shipNameRetrieve(name) {
    return $.grep(gShips, function (ship) {
        return ship.name == name || ship.pron == name;
    })[0];
}

function shipIdRetrieve(id) {
    return $.grep(gShips, function (ship) {
        return ship.id == id
    })[0]
}

function itemNameRetrieve(name) {
    return $.grep(gItems, function (item) {
        return item.name == name
    })[0]
}

function itemIdRetrieve(id) {
    return $.grep(gItems, function (item) {
        return item.id == id
    })[0]
}

function shipSearchNameWithIndexRetrieve(searchTermWithIndex) {
    searchTermWithIndex = searchTermWithIndex.replace('／', '/');
    var ss = searchTermWithIndex.split('/');
    var search = ss[0];
    var index = 0;
    if (ss[1]) {
        index = parseInt(ss[1]);
    } else {
        var wholeMatch = shipNameRetrieve(searchTermWithIndex);
        if (wholeMatch) {
            return wholeMatch;
        }
    }
    var res = $.grep(gShips, function (ship) {
        return ship.name.indexOf(search) >= 0 || ship.pron.indexOf(search) >= 0;
    });
    var wholeNameShip = shipNameRetrieve(search);
    for (var j = 1; j < res.length; j++) {
        if (wholeNameShip && res[j].id == wholeNameShip.id) {
            var ship = res.splice(j, 1);
            res.splice(0, 0, ship[0]);
            break;
        }
    }
    return res[index];
}

function itemSearchNameWithIndexRetrieve(searchTermWithIndex) {
    searchTermWithIndex = searchTermWithIndex.replace('／', '/');
    var ss = searchTermWithIndex.split('/');
    var search = ss[0];
    var index = 0;
    if (ss[1] && ss[1].indexOf(' ') < 0) {
        index = parseInt(ss[1]);
    } else {
        var wholeMatch = itemNameRetrieve(searchTermWithIndex);
        if (wholeMatch) {
            return wholeMatch;
        }
    }
    return $.grep(gItems, function (item) {
        return item.name.indexOf(search) >= 0
    })[index]
}

function isFinalStyle(ship) {
    if (ship.next == '0') return true;
    var next = shipIdRetrieve(ship.next);
    let next2 = shipIdRetrieve(next.next);
    if (((next.next == ship.id || (next2 && next2.next == ship.id))
      && parseInt(ship.id) > parseInt(ship.next))) {
        return true;
    }
    return false;
}

function isEndStyleForCurrentType(ship) {
    if (ship.next == '0') return true;
    if (ship.id == '162') return false; // 神威、改装し戻すとかこやつめハハハ
    var next = shipIdRetrieve(ship.next);
    let next2 = shipIdRetrieve(next.next);
    if (((next.next == ship.id || (next2 && next2.next == ship.id))
      && parseInt(ship.id) > parseInt(ship.next))) {
        // 相互改装のID大きい方を最終形態と定義
        return true;
    }

    if (next.type != ship.type) {
        return true;
    }
    // コンバートしても同じ
    return false;
}

function getFinalStyle(ship) {
    if (isFinalStyle(ship)) {
        return ship
    } else {
        return getFinalStyle(shipIdRetrieve(ship.next))
    }
}

function isKanmusu(ship) {
    return parseInt(ship.no) > 0 && parseInt(ship.no) < 9999
}

function isKanmusuEquipItem(item) {
    return parseInt(item.id) < 500
}

function getShipFire(name) {
    var ship = shipNameRetrieve(name)
    if (!isKanmusu(ship)) {
        var ret = ship.fire
        ship.equip.forEach(function (eq) {
            ret += eq.fire
        })
    } else {
        ret = ship.max_fire
    }
    return ret
}

function banner(ship) {
    return $.sprintf('<td><img class="banner" src="img/banner/%s.jpg" title="%s" /></td>', ship.id, ship.name)
}

function bannerWithLookup(ship) {
    return $.sprintf('<a href="lookship.html?slot1=%d" target="_blank"><img class="banner" src="img/banner/%s.jpg" title="%s" /></a>',
        ship.id, ship.id, ship.name)
}

function bannerTdWithName(ship) {
    return $.sprintf('<td style="border: solid 1px black;"><img class="banner" src="img/banner/%s.jpg" title="%s" /><br>%s</td>', ship.id, ship.name, ship.name);
}

function bannerNoTd(ship) {
    return $.sprintf('<img class="banner" src="img/banner/%s.jpg" title="%s" />', ship.id, ship.name)
}

function formation(id) {
    return $.sprintf('<img src="img/formation%s.jpg">', id)
}

var gInitialShips = null
var gRemodeledShips = null

var purged = []

function getInitialShips() {
    if (gInitialShips == null) {
        gInitialShips = gShips.filter(function (ship) {
            return isKanmusu(ship);
        });
        for (var j = 0; j < gInitialShips.length; j++) {
            var ship = gInitialShips[j]
            if (ship.next != '0') {
                gInitialShips = purge(gInitialShips, shipIdRetrieve(ship.next))
            }
            j = gInitialShips.indexOf(ship)
        }
    }
    return gInitialShips;
}

function getRemodeledShips() {
    var initialShips = getInitialShips()
    if (gRemodeledShips == null) {
        gRemodeledShips = gShips.filter(function (ship) {
            return isKanmusu(ship) && initialShips.indexOf(ship) < 0
        })
    }
    return gRemodeledShips
}

function purge(ships, ship, history) {
    if (typeof history === 'undefined') history = [];
    var local_ships = ships;
    if (ship.next != '0' && history.indexOf(ship.id) < 0) {
        history.push(ship.id);
        local_ships = purge(local_ships, shipIdRetrieve(ship.next), history);
    }
    var index = local_ships.indexOf(ship);
    if (index >= 0) {
        local_ships.splice(index, 1);
    }
    return local_ships;
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function getPrecedingModel(ship) {
    for (var j in gShips) {
        var s = gShips[j]
        if (s.next == ship.id) {
            return s
        }
    }
    return null
}

function calculateDamage(powerBeforeCap, coef, armor) {
    var armorMin = 0.7 * armor
    var armorMax = 0.7 * armor + 0.6 * (armor - 1)

}

function arrayEqual(a1, a2) {
    if (a1.length != a2.length) {
        return;
    }
    for (var i in a1) {
        if (a1[i] != a2[i]) {
            return false;
        }
    }
    return true;
}

function isInValid(obj) {
    if (obj == null) return true;
    if (typeof obj === 'undefined') return true;
    if (typeof obj === "object") {
        if (Object.keys(obj).length === 0) {
            return true;
        }
    }
    return false;
}

function getItemAt(shipObj, position) {
    if (isInValid(shipObj)) {
        return null;
    }
    var itemObj = shipObj.items[IK[position]];
    if (isInValid(itemObj)) {
        return null;
    }
    if (typeof itemObj.id === 'undefined') {
        return null;
    }
    var item = itemIdRetrieve(itemObj.id);
    if (item) {
        return item;
    } else {
        return null;
    }
}

function isAircraft(item) {
    if (!item) {
        return false;
    }
    return T2LIST_AIRCRAFTS.indexOf(item.type[2]) >= 0;
}

function isAttackerAircraft(ac) {
    var type = ac.type[2];
    return type == T2_BOMBER || type == T2_SEA_BOMBER || type == T2_TORPEDO_BOMBER
        || type == T2_JET_BOMBER ;
}

function isCVBombard(ship) {
    return isCV(ship) || isCVL(ship) || isSPSupply2(ship);
}

function doesFightInAirBattle(ac) {
    switch (ac.type[2]) {
        case T2_BOMBER:
        case T2_FIGHTER:
        case T2_TORPEDO_BOMBER:
        case T2_SEA_BOMBER:
        case T2_SEA_FIGHTER:
        case T2_JET_BOMBER:
            return true;
        default:
            return false;
    }
}

function isNightOthers(item) {
    return AAC_NIGHT_OTHERS.indexOf(item.id) >= 0;
}
