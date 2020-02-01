const AIR_BATTLE_FACTOR = 0.25;
const FRIEND_FACTOR = 0.8;
const ENEMY_FACTOR = 0.75;
const COMBINED_FACTOR = 0.8;

const FIRST_COMBINED_FACTOR = 0.8;
const SECOND_COMBINED_FACTOR = 0.48;
const AIR_RAID_COMBINED_FACTOR = 0.9;

const TYKU_CUIIN = [
  {"FRIEND":{A:1, B:0, C:1},"ENEMY":{A:0, B:0, C:1}},
  {A:1, B:7, C:1.7}, // 1
  {A:1, B:6, C:1.7}, // 2
  {A:1, B:4, C:1.6}, // 3
  {A:1, B:6, C:1.5}, // 4
  {A:1, B:4, C:1.5}, // 5
  {A:1, B:4, C:1.45}, // 6
  {A:1, B:3, C:1.35}, // 7
  {A:1, B:4, C:1.4}, // 8
  {A:1, B:2, C:1.3}, // 9
  {A:1, B:8, C:1.65}, // 10
  {A:1, B:6, C:1.5}, // 11
  {A:1, B:3, C:1.25}, // 12
  {A:1, B:4, C:1.45}, // 14
  {A:1, B:3, C:1.3}, // 15
  {A:1, B:4, C:1.4}, // 16
  {A:1, B:2, C:1.25}, // 17
  {A:1, B:2, C:1.2}, // 18
  {A:1, B:5, C:1.45}, // 19
  {A:1, B:3, C:1.25}, // 20
  {A:1, B:5, C:1.45}, // 21
  {A:1, B:2, C:1.2}, // 22
  {A:1, B:1, C:1.05}, // 23
  {A:1, B:3, C:1.25}, // 24
  {A:1, B:7, C:1.55}, // 25
  {A:1, B:6, C:1.4}, // 26
  {A:1, B:4, C:1.4}, // 28
  {A:1, B:5, C:1.55}, // 29
  {A:1, B:3, C:1.3}, // 30
  {A:1, B:2, C:1.25}, // 31
  {A:1, B:3, C:1.2}, // 32
  {A:1, B:3, C:1.35}, // 33
  {A:1, B:7, C:1.6}, // 34
  {A:1, B:6, C:1.55}, // 35
  {A:1, B:6, C:1.55}, // 36
  {A:1, B:4, C:1.45}, // 37
  {A:1, B:10, C:1.7}, // 39
  {A:1, B:10, C:1.7}, // 40
  {A:1, B:9, C:1.65} // 41
];
// 装備定数A
function getKansenItem_A(type){
  switch(type){
    case 16: // 高角砲
    case 30: // 高射装置
      return 4;
    case 15: // 機銃
      return 6;
    case 11: // 電探
      return 3;
    default:
      return 0;
  }
}
// 装備定数B
function getKansenItem_B(type,tyku){
  switch(type){
    case 16: // 高角砲
      if(tyku >= 8) return 3; // 対空7以下の高角砲は高射装置と同じ係数
    case 30: // 高射装置
      return 2;
    case 15: // 機銃
      return 4;
    default:
      return 0;
  }
}
// 艦隊防空装備定数A
function getKantaiItem_A(type,id){
  switch(type){
    case 16: // 高角砲
    case 30: // 高射装置
      return 0.35;
    case 12: // 対空強化弾
      return 0.6;
    case 11: // 電探
      return 0.4;
    default:
      if(id == 9) return 0.25; // 46cm三連装砲
      return 0.2;
  }
}
// 艦隊防空装備定数B
function getKantaiItem_B(type,tyku){
  switch(type){
    case 16: // 高角砲
      if(tyku >= 8) return 3; // 対空7以下の高角砲は高射装置と同じ係数
    case 30: // 高射装置
      return 2;
    case 11: // 電探
      if(tyku > 1) return 1.5;
    default:
      return 0;
  }
}
function getFormationBonus(formation){
  switch (formation) {
    case 2: // 複縦陣
      return 1.2;
    case 3: // 輪形陣
      return 1.6;
    case 6: // 警戒陣
      return 1.1;
    case 11: // 第一警戒航行序列
      return 1.1;
    case 13: // 第三警戒航行序列
      return 1.5;
    default:
      return 1.0;
  }
}
// 撃墜数A
function getA(kaju,ciKind,isFriend,isCombined,fleetno){
  let ciFactor = getTykuCuinFactor(ciKind,isFriend);
  return Math.floor(kaju * ciFactor.C * getCombinedFactor(isCombined,fleetno) + ciFactor.A);
}
// 撃墜数B
function getB(kaju,slot,ciKind,isFriend,isCombined,fleetno){
  let ciFactor = getTykuCuinFactor(ciKind,isFriend);
  return Math.floor(0.02 * AIR_BATTLE_FACTOR * slot * kaju * getCombinedFactor(isCombined,fleetno) + ciFactor.B);
}
function getTykuCuinFactor(ciKind,isFriend){
  if(TYKU_CUIIN[ciKind].A !== undefined){
    return TYKU_CUIIN[ciKind];
  }
  return TYKU_CUIIN[ciKind][isFriend ? "FRIEND" : "ENEMY"];
}
// 割合撃墜確率
function getProportion(kaju,isCombined,fleetno){
  return kaju * getCombinedFactor(isCombined,fleetno) / 400;
}
// 割合撃墜数
function getProportionNum(kaju,slot,isCombined,fleetno){
  return Math.floor((kaju * getCombinedFactor(isCombined,fleetno) / 400) * slot);
}
// 固定撃墜数
function getFixedNum(totalAAC,ciKind,isFriend,isCombined,fleetno){
  let ciFactor = getTykuCuinFactor(ciKind,isFriend);
  return Math.floor(totalAAC * ciFactor.C * getCombinedFactor(isCombined,fleetno) / 10);
}
// 最低保証数
function getGuaranteedNum(ciKind,isFriend){
  let ciFactor = getTykuCuinFactor(ciKind,isFriend);
  return ciFactor.A + ciFactor.B;
}

function getCombinedFactor(isCombined,fleetno){
  if(isCombined){
    return (fleetno === 1 ? FIRST_COMBINED_FACTOR : SECOND_COMBINED_FACTOR) * COMBINED_FACTOR;
  }
  return 1.0;
}