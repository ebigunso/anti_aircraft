$(function(){
  for(let i = 1;i <= 2;i++){
    for(let j = 1;j <= 6;j++){
      $('#f' + i + 's' + j + 'name').on( "click", function() {
        $('#friendShipDialog').dialog('close');
        $('#friendShipDialog').dialog('option', 'position', { my: 'left center', at: 'right center', of: $(this)});
        $('#friendShipDialog').attr('parent', '#' + $(this).attr('id'));
        $('#friendShipDialog').dialog('open');
      });
      for(let k = 1;k <= 5;k++){
        $('#f' + i + 's' + j + 'item' + k).on( "click", function() {
          $('#friendItemDialog').dialog('close');
          $('#friendItemDialog').dialog('option', 'position', { my: 'left center', at: 'right center', of: $(this)});
          $('#friendItemDialog').attr('parent', '#' + $(this).attr('id'));
          $('#friendItemDialog').dialog('open');
        });
      }
      document.getElementById('f' + i + 's' + j + 'tyku').innerHTML = 0;
      document.getElementById('f' + i + 's' + j + 'kaju').innerHTML = "0.00";
      document.getElementById('f' + i + 's' + j + 'shotDownA').innerHTML = 0;
      document.getElementById('f' + i + 's' + j + 'shotDownB').innerHTML = 0;
      document.getElementById('f' + i + 's' + j + 'proportionShotDown').innerHTML = "0 (0%)";
      document.getElementById('f' + i + 's' + j + 'fixedShotDown').innerHTML = 0;
      document.getElementById('f' + i + 's' + j + 'guaranteedShotDown').innerHTML = 0;
      document.getElementById('f' + i + 's' + j + 'total').innerHTML = 0;
    }
  }
  setPresetAreaId();
  changeShowRow();
  setCombinedStatus(false);
  $('.parseEnemy').hide();
});

// parent = #f1s1name
function setStatus(parent,shipid,isFriend){
  let fleet = parent.substring(2,3);
  let ship = parent.substring(4,5);
  for(let i = 1;i <= 5;i++){
    resetItem(fleet,ship,i);
  }
  calc();
}

function setCombinedStatus(isCombined){
  let formation = $('#formationBox').children().children('option:selected').attr('kc-id');
  if(isCombined){
    $('#isCombinedLabel').text("連合艦隊");
    if(formation <= 10){
      $("#formationBox").children().children('[kc-id=14]').prop('selected', true);
    }
    showCombinedFormation();
  } else {
    $('#isCombinedLabel').text("通常艦隊");
    if(formation > 10){
      $("#formationBox").children().children('[kc-id=1]').prop('selected', true);
    }
    showNormalFormation();
  }
}

function calc(){
  let isCombined = (function(){
    let isExist = [false,false];
    for(let i = 1;i <= 2;i++){
      for(let j = 1;j <= 6;j++){
        let t_name = '#f' + i + 's' + j + 'name';
        let shipid = $(t_name).val();
        if(shipid > 0){
          isExist[i-1] = true;
          break;
        }
      }
    }
    return (isExist[0] && isExist[1]);
  })();
  let isFriend = $('input[name=isFriend]:checked').val() === 'true';
  let isBrowser = $('#useBrowserCheckBox').prop('checked');
  // めんどいのでここで入れ替える
  setCombinedStatus(isCombined);
  let kantaiAirBonus = 0;
  // 艦隊防空値
  for(let i = 1;i <= 2;i++){
    for(let j = 1;j <= 6;j++){
      let shipKantaiAirBonus = 0;
      let t_name = '#f' + i + 's' + j + 'name';
      let shipid = $(t_name).val();
      if(shipid <= 0) continue;
      for(let k = 1;k <= 5;k++){
        let t_item = '#f' + i + 's' + j + 'item' + k;
        let t_alv = '#f' + i + 's' + j + 'item' + k + 'alv option:selected';
        let itemid = $(t_item).val();
        if(itemid <= 0) continue;
        let item = itemIdRetrieve(itemid);
        let tyku = item.aac;
        if(tyku <= 0) continue;
        let alv = $(t_alv).val()|0;
        let type = item.type[3];
        // 艦隊防空加重對空值 = 裝備對空值*艦隊防空裝備定數A
        let kantaiKajuValue = tyku * getKantaiItem_A(type,itemid);
        // 艦隊防空裝備改修補正 = 艦隊防空裝備定數B*sqrt(★)
        let kaishuBonus = getKantaiItem_B(type,itemid) * Math.sqrt(alv);
        // 1スロット裝備の艦隊防空補正 = 艦隊防空加重對空值 + 艦隊防空裝備改修補正
        let slotKantaiAirBonus = kantaiKajuValue + kaishuBonus;
        // 1艦娘の艦隊防空補正 = ∑(1スロット裝備の艦隊防空補正)
        shipKantaiAirBonus += slotKantaiAirBonus;
      }
      // ∑(int(1艦娘の艦隊防空補正))
      kantaiAirBonus += Math.floor(shipKantaiAirBonus);
    }
  }
  // 艦隊防空補正 = int( 陣型補正*(∑(1艦娘の艦隊防空補正)) )
  // ブラウザ版補正((2/1.3)をかける)
  kantaiAirBonus = Math.floor($('#formationBox').children().val() * kantaiAirBonus) * ((isBrowser && isFriend) ? 2/1.3 : 1.0);
  $('#kantaiLabel').val(kantaiAirBonus.toFixed(3));
  let shipNum = 0;
  let annihilationCnt = 0;
  let slotNum = $('#slotNumSpinner').val();
  // 加重対空値
  for(let i = 1;i <= 2;i++){
    for(let j = 1;j <= 6;j++){
      let t_kaju = 'f' + i + 's' + j + 'kaju';
      let t_shotDownA = 'f' + i + 's' + j + 'shotDownA';
      let t_shotDownB = 'f' + i + 's' + j + 'shotDownB';
      let t_proportionShotDown = 'f' + i + 's' + j + 'proportionShotDown';
      let t_fixedShotDown = 'f' + i + 's' + j + 'fixedShotDown';
      let t_guaranteedShotDown = 'f' + i + 's' + j + 'guaranteedShotDown';
      let t_total = 'f' + i + 's' + j + 'total';
      let t_name = '#f' + i + 's' + j + 'name';
      let shipid = $(t_name).val();
      if(shipid > 0){
        let ship = shipIdRetrieve(shipid);
        let shipTyku = ship.max_aac;
        let totalItemTyku = 0;
        let sum = 0;
        for(let k = 1;k <= 5;k++){
          let t_item = '#f' + i + 's' + j + 'item' + k;
          let t_alv = '#f' + i + 's' + j + 'item' + k + 'alv option:selected';
          let itemid = $(t_item).val();
          if(itemid <= 0) continue;
          let item = itemIdRetrieve(itemid);
          let itemTyku = item.aac;
          let type = item.type[3];
          let alv = $(t_alv).val()|0;
          // 艦船對空改修補正 = 裝備定數B*sqrt(★)
          let kaishuBonus = getKansenItem_B(type,itemTyku) * Math.sqrt(alv);
          totalItemTyku += itemTyku;
          // 裝備對空值*裝備定數A
          sum += itemTyku * getKansenItem_A(type) + kaishuBonus;
        }
        // 味方艦船加重對空值 = 2 * [(素對空值 + ∑(裝備對空值*裝備定數A + 艦船對空改修補正)) / 2]
        // 相手艦船加重對空值 = sqrt(素對空值 + 裝備對空值) + ∑(裝備對空值*裝備定數A + 艦船對空改修補正)
        let kaju = (isFriend ? 2 * Math.floor((shipTyku + sum) / 2) : (Math.sqrt(shipTyku + totalItemTyku)) + sum);
        // 最終加重對空值 = (艦船加重對空值 + 艦隊防空補正)*基本定數*味方相手補正(0.8(味方の対空砲火) or 0.75(相手の対空砲火))
        let kajuTotal = (kaju + kantaiAirBonus) * AIR_BATTLE_FACTOR * (isFriend ? FRIEND_FACTOR : ENEMY_FACTOR);
        let tykuCIkind = $('#tyku_cutinBox').children().val()|0;
        let factor = getTykuCuinFactor(tykuCIkind,isFriend);
        //console.log(kaju,tykuCIkind,kajuTotal)
        // 擊墜數A = int( 最終加重對空值*((0 or 1)の一様な乱数)*対空カットイン定數C + 対空カットイン定數A )
        let minA = factor.A;
        let maxA = getA(kajuTotal,tykuCIkind,isFriend,isCombined,i);
        // 擊墜數B = int( 0.02*基本定數*機數*艦船加重對空值*((0 or 1)の一様な乱数) + 対空カットイン定數B )
        let minB = factor.B;
        let maxB = getB(kaju,slotNum,tykuCIkind,isFriend,isCombined,i);
        // 割合撃墜
        let proportionShotDown = getProportion(kaju,isCombined,i);
        let proportionShotDownNum = getProportionNum(kaju,slotNum,isCombined,i);
        // 固定撃墜
        let fixedShotDown = getFixedNum(kaju+kantaiAirBonus,tykuCIkind,isFriend,isCombined,i);
        // 最低保証
        let guaranteedShotDown = getGuaranteedNum(tykuCIkind,isFriend);

        // 確率計算
        shipNum++;
        if((guaranteedShotDown) >= slotNum){
          annihilationCnt += 2 * 2;
        } else {
          if((proportionShotDownNum + guaranteedShotDown) >= slotNum) annihilationCnt += 2;
          if((fixedShotDown + guaranteedShotDown) >= slotNum) annihilationCnt += 2;
          if(!((proportionShotDownNum + guaranteedShotDown) >= slotNum || (fixedShotDown + guaranteedShotDown) >= slotNum) && (proportionShotDownNum + fixedShotDown + guaranteedShotDown) >= slotNum){
            annihilationCnt++;
          }
          if((proportionShotDownNum + guaranteedShotDown) >= slotNum && (fixedShotDown + guaranteedShotDown) >= slotNum) annihilationCnt -= 2;
        }
        // 表示処理
        document.getElementById(t_kaju).innerHTML = (kaju).toFixed(2);
        document.getElementById(t_shotDownA).innerHTML = minA + " - " + maxA;
        document.getElementById(t_shotDownB).innerHTML = minB + " - " + maxB;
        document.getElementById(t_proportionShotDown).innerHTML = proportionShotDownNum + " (" + (proportionShotDown * 100).toFixed(2) + "%)";
        document.getElementById(t_fixedShotDown).innerHTML = fixedShotDown;
        document.getElementById(t_guaranteedShotDown).innerHTML = guaranteedShotDown;
        // 最終擊墜數 = 擊墜數A + 擊墜數B **depricated**
        // 最低撃墜数 = 最低保証, 最高撃墜数 = 割合撃墜 + 固定撃墜 + 最低保証
        document.getElementById(t_total).innerHTML = guaranteedShotDown + " - " + (proportionShotDownNum + fixedShotDown + guaranteedShotDown);
      } else {
        // 表示処理
        document.getElementById(t_kaju).innerHTML = "0.00";
        document.getElementById(t_shotDownA).innerHTML = 0;
        document.getElementById(t_shotDownB).innerHTML = 0;
        document.getElementById(t_proportionShotDown).innerHTML = "0 (0%)";
        document.getElementById(t_fixedShotDown).innerHTML = 0;
        document.getElementById(t_guaranteedShotDown).innerHTML = 0;
        document.getElementById(t_total).innerHTML = 0;
      }
    }
    let annihilationProbability = (slotNum > 0 && shipNum > 0) ? annihilationCnt / (shipNum * 2 * 2) * 100 : 100;
    $('#annihilationLabel').val(annihilationProbability.toFixed(2) + "%");
  }
}

function reset(no){
  for(let i = 1;i <= 6;i++){
    resetShip(no,i);
  }
  calc();
}

function initialize(){
  reset(1);
  reset(2);
  let nameSource;
  let itemSource;
  if($('input[name=isFriend]:checked').val() === 'true'){
    nameSource = '#friendShipDialog';
    itemSource = '#friendItemDialog';
    $('.parseEnemy').hide();
    $('.parseFriend').show();
  } else {
    nameSource = '#enemyShipDialog';
    itemSource = '#enemyItemDialog';
    $('.parseFriend').hide();
    $('.parseEnemy').show();
  }
  $('#formationBox').children().prop('selectedIndex', 0);
  $('#slotNumSpinner').val(0);
  $('#tyku_cutinBox').children().prop('selectedIndex', 0);
  for(let i = 1;i <= 2;i++){
    for(let j = 1;j <= 6;j++){
      $('#f' + i + 's' + j + 'name').off('click');
      $('#f' + i + 's' + j + 'name').on( "click", function() {
        $(nameSource).dialog('close');
        $(nameSource).dialog('option', 'position', { my: 'left center', at: 'right center', of: $(this)});
        $(nameSource).attr('parent', '#' + $(this).attr('id'));
        $(nameSource).dialog('open');
      });
      for(let k = 1;k <= 5;k++){
        $('#f' + i + 's' + j + 'item' + k).off('click');
        $('#f' + i + 's' + j + 'item' + k).on( "click", function() {
          $(itemSource).dialog('close');
          $(itemSource).dialog('option', 'position', { my: 'left center', at: 'right center', of: $(this)});
          $(itemSource).attr('parent', '#' + $(this).attr('id'));
          $(itemSource).dialog('open');
        });
      }
    }
  }
}

function parseDeckFormat(){
  /* 初期化 */
  $('input[name=isFriend]').val([true]);
  initialize();
  /* 解析 */
  let time = setInterval(function(){
    let str = $('#parseDeckFormatLabel').val();
    let json = str.substring(str.indexOf('{'));
    let object = JSON.parse(json);
    if(object['version'] == 4){
      for(let i = 1;i <= 2;i++){
        let fleet = object['f' + i];
        if(fleet === undefined) continue;
        for(let j = 1;j <= 6;j++){
          let ship = fleet['s' + j];
          if(ship === undefined) continue;
          let shipid = ship['id'];
          setShip(i,j,shipid);
          let items = ship['items'];
          for(let k = 1;k <= 4;k++){
            let item = items['i' + k];
            if(item === undefined) continue;
            let itemid = item['id'];
            let alv = item['rf'];
            setItem(i,j,k,itemid,alv,true);
          }
          let item = items['ix'];
          if(item === undefined) continue;
          let itemid = item['id'];
          if(itemid === undefined) continue;
          let alv = item['rf'];
          setItem(i,j,5,itemid,alv,true);
        }
      }
      calc();
      clearInterval(time);
    }
  },500);
}

function parseID(){
  /* 初期化 */
  $('input[name=isFriend]').val([false]);
  initialize();
  /* 解析 */
  let time = setInterval(function(){
    let ids = toHalfWidth($('#parseIDLabel').val()).split(/\D/);
    for(let i = 1;i <= 2;i++){
      for(let j = 1;j <= 6;j++){
        if((i-1)*6+j-1>=ids.length) break;
        let shipid = ids[(i-1)*6+j-1];
        if(shipid=="") continue;
        setShip(i,j,shipid);
        setStatus('#f'+i+'s'+j,shipid,false);
      }
      calc();
      clearInterval(time);
    }
  },500);
}

function toHalfWidth(value) {
  return value.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s){
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

function parseName(names,shouldCalc){
  if(shouldCalc === null) shouldCalc = true;
  /* 初期化 */
  $('input[name=isFriend]').val([false]);
  initialize();
  /* 解析 */
  let time = setInterval(function(){
    //let names = $('#parseNameLabel').val().split(/[、,\,]/);
    for(let i = 1;i <= 2;i++){
      for(let j = 1;j <= 6;j++){
        if((i-1)*6+j-1>=names.length) break;
        let name = names[(i-1)*6+j-1];
        if(name=="") continue;
        let shipid = findID(name);
        setShip(i,j,shipid);
        setStatus('#f'+i+'s'+j,shipid,false);
      }
      if(shouldCalc) calc();
      clearInterval(time);
    }
  },500);
}

function findID(t){
  let matchList = {0:0};
  let target = String(t.replace(/[\s,\?,(,),\*\d,　]/g,""));
  for(let shipid in SHIP_DATA){
    if(shipid <= 500) continue;
    let name = SHIP_DATA[shipid].name.replace(/[\s,\?,\*\d,　]/g,"");
    let kind = name.substring(name.indexOf('(')).replace(/[(,)]/g,"").split(/[/]/g);
    for(let k in kind){
      let tmpName = name.replace(/\(.*\)/g,kind[k]);
      let count = 0;
      if(tmpName == target) return shipid;
      for(let i = 0;i < tmpName.length;i++){
        for(let j = 0;j < target.length;j++){
          if(tmpName.charAt(i) == target.charAt(j)){
            count++;
            break;
          }
        }
      }
      matchList[shipid] = (matchList[shipid] !== undefined && matchList[shipid] > count) ? matchList[shipid] : count;
    }
  }
  let maxMatchIndex = 0;
  for(let shipid in matchList){
    if(matchList[shipid] > matchList[maxMatchIndex] || (shipid !== 0 && maxMatchIndex !== 0 && matchList[shipid] === matchList[maxMatchIndex] && SHIP_DATA[maxMatchIndex].name.length > SHIP_DATA[shipid].name.length)){
      maxMatchIndex = shipid;
    }
  }
  return maxMatchIndex;
}

function changeShowRow(){
  for(let i = 1;i <= 2;i++){
    if($('input[name=isShowUsualRow]:checked').val() === 'true'){
      $('#f'+i+'shotDownAheader').hide();
      $('#f'+i+'shotDownBheader').hide();
      $('#f'+i+'proportionShotDownHeader').show();
      $('#f'+i+'fixedShotDownHeader').show();
      $('#f'+i+'guaranteedShotDownHeader').show();
      for(let j = 1;j <= 6;j++){
        $('#f'+i+'s'+j+'shotDownA').hide();
        $('#f'+i+'s'+j+'shotDownB').hide();
        $('#f'+i+'s'+j+'proportionShotDown').show();
        $('#f'+i+'s'+j+'fixedShotDown').show();
        $('#f'+i+'s'+j+'guaranteedShotDown').show();
      }
    } else {
      $('#f'+i+'shotDownAheader').show();
      $('#f'+i+'shotDownBheader').show();
      $('#f'+i+'proportionShotDownHeader').hide();
      $('#f'+i+'fixedShotDownHeader').hide();
      $('#f'+i+'guaranteedShotDownHeader').hide();
      for(let j = 1;j <= 6;j++){
        $('#f'+i+'s'+j+'shotDownA').show();
        $('#f'+i+'s'+j+'shotDownB').show();
        $('#f'+i+'s'+j+'proportionShotDown').hide();
        $('#f'+i+'s'+j+'fixedShotDown').hide();
        $('#f'+i+'s'+j+'guaranteedShotDown').hide();
      }
    }
  }
}

function setShip(i,j,shipid){
  let ship = shipIdRetrieve(shipid);
  $('#f'+i+'s'+j+'name').val(shipid);
  //kancolle-calc.netさんから画像を借りる
  $('#f'+i+'s'+j+'name').html('<img src="http://kancolle-calc.net/img/banner/'+shipid+'.jpg" width="160" height="40" title="'+shipid+':'+ship.name+' 対空:'+ship.max_aac+'">');
  $('#f'+i+'s'+j+'tyku').text(ship.max_aac);
}

function resetShip(i,j){
  $('#f'+i+'s'+j+'name').empty();
  $('#f'+i+'s'+j+'name').val(0);
  $('#f'+i+'s'+j+'tyku').text(0);
  for(let k = 1;k <= 5;k++){
    resetItem(i,j,k);
  }
}

function setItem(i,j,k,itemid,alv,isFriend){
  let item = itemIdRetrieve(itemid);
  let img = '<img src="img/itemicon/'+item.type[3]+'.png" width="30" height="30" style="float:left;margin-right:5px;">';
  $('#f'+i+'s'+j+'item'+k).val(itemid);
  $('#f'+i+'s'+j+'item'+k).attr('title',"対空+"+item.aac);
  if(isFriend){
    let style = '<select id="f'+i+'s'+j+'item'+k+'alv'+'" style="color:#45A9A5"></select>';
    $('#f'+i+'s'+j+'item'+k).html(img+item.name+' '+style);
    /* 改修度部分 */
    let selectBox = ["","★+1","★+2","★+3","★+4","★+5","★+6","★+7","★+8","★+9","★max"];
    for(let l = 0;l < selectBox.length;l++){
      let option = document.createElement('option');
      option.setAttribute('value', l);
      option.innerHTML = selectBox[l];
      $('#f'+i+'s'+j+'item'+k+'alv').append(option);
    }
    $('#f'+i+'s'+j+'item'+k+'alv').val(alv);
    $('#f'+i+'s'+j+'item'+k+'alv').on("click",function(event){ event.stopPropagation(); });
    $('#f'+i+'s'+j+'item'+k+'alv').on('change',function(event){ calc(); });
  } else {
    $('#f'+i+'s'+j+'item'+k).html(img+item.name);
  }
}

function resetItem(i,j,k){
  $('#f'+i+'s'+j+'item'+k).empty();
  $('#f'+i+'s'+j+'item'+k).val(0);
}

function showCombinedFormation(){
  $("#formationBox").children().children('[kc-id=1]').prop('disabled', true);
  $("#formationBox").children().children('[kc-id=2]').prop('disabled', true);
  $("#formationBox").children().children('[kc-id=3]').prop('disabled', true);
  $("#formationBox").children().children('[kc-id=4]').prop('disabled', true);
  $("#formationBox").children().children('[kc-id=5]').prop('disabled', true);
  $("#formationBox").children().children('[kc-id=11]').prop('disabled', false);
  $("#formationBox").children().children('[kc-id=12]').prop('disabled', false);
  $("#formationBox").children().children('[kc-id=13]').prop('disabled', false);
  $("#formationBox").children().children('[kc-id=14]').prop('disabled', false);
  $("#formationBox").children().children('[kc-id=1]').hide();
  $("#formationBox").children().children('[kc-id=2]').hide();
  $("#formationBox").children().children('[kc-id=3]').hide();
  $("#formationBox").children().children('[kc-id=4]').hide();
  $("#formationBox").children().children('[kc-id=5]').hide();
  $("#formationBox").children().children('[kc-id=11]').show();
  $("#formationBox").children().children('[kc-id=12]').show();
  $("#formationBox").children().children('[kc-id=13]').show();
  $("#formationBox").children().children('[kc-id=14]').show();
}

function showNormalFormation(){
  $("#formationBox").children().children('[kc-id=1]').prop('disabled', false);
  $("#formationBox").children().children('[kc-id=2]').prop('disabled', false);
  $("#formationBox").children().children('[kc-id=3]').prop('disabled', false);
  $("#formationBox").children().children('[kc-id=4]').prop('disabled', false);
  $("#formationBox").children().children('[kc-id=5]').prop('disabled', false);
  $("#formationBox").children().children('[kc-id=11]').prop('disabled', true);
  $("#formationBox").children().children('[kc-id=12]').prop('disabled', true);
  $("#formationBox").children().children('[kc-id=13]').prop('disabled', true);
  $("#formationBox").children().children('[kc-id=14]').prop('disabled', true);
  $("#formationBox").children().children('[kc-id=1]').show();
  $("#formationBox").children().children('[kc-id=2]').show();
  $("#formationBox").children().children('[kc-id=3]').show();
  $("#formationBox").children().children('[kc-id=4]').show();
  $("#formationBox").children().children('[kc-id=5]').show();
  $("#formationBox").children().children('[kc-id=11]').hide();
  $("#formationBox").children().children('[kc-id=12]').hide();
  $("#formationBox").children().children('[kc-id=13]').hide();
  $("#formationBox").children().children('[kc-id=14]').hide();
}

function setPresetAreaId(){
  for(let areaIdx in AREA_NAMES){
    $('#presetAreaIdBox').append($('<option>').html(AREA_NAMES[areaIdx][0]).val(areaIdx));
  }
}

function setPresetAreaNo(){
  loadWikiData($('#presetAreaIdBox').val());
}

function _setPresetAreaNo(areaNo){
  $('#presetAreaNoBox').append($('<option>').html(areaNo).val(areaNo));
}

function resetPresetAreaNo(){
  $('#presetAreaNoBox option').remove();
}

function setPresetMapCell(){
  resetPresetMapCell();
  for(let cell in mapdata[$('#presetAreaIdBox').val()][$('#presetAreaNoBox').val()]){
    let isBoss = mapdata[$('#presetAreaIdBox').val()][$('#presetAreaNoBox').val()][cell]['boss'];
    _setPresetMapCell(cell,isBoss);
  }
}

function _setPresetMapCell(cell,isBoss){
  $('#presetMapCellBox').append($('<option>').html(cell + (isBoss ? "(ボス)" : "")).val(cell));
}

function resetPresetMapCell(){
  $('#presetMapCellBox option').remove();
}

function setPresetMapDifficulty(){
  resetPresetMapDifficulty();
  for(let difficulty in mapdata[$('#presetAreaIdBox').val()][$('#presetAreaNoBox').val()][$('#presetMapCellBox').val()]['difficulty']){
    _setPresetMapDifficulty(difficulty);
  }
  setPresetEnemyPattern();
}

function _setPresetMapDifficulty(difficulty){
  $('#presetMapDifficultyBox').append($('<option>').html(toDifficultyName(difficulty)).val(difficulty));
}

function resetPresetMapDifficulty(){
  $('#presetMapDifficultyBox option').remove();
}

function setPresetEnemyPattern(){
  resetPresetEnemyPattern();
  for(let id in mapdata[$('#presetAreaIdBox').val()][$('#presetAreaNoBox').val()][$('#presetMapCellBox').val()]['difficulty'][$('#presetMapDifficultyBox').val()]['pattern']){
    _setPresetEnemyPattern(id);
  }
  setPresetEnemyFormation();
}

function _setPresetEnemyPattern(id){
  $('#presetEnemyPatternBox').append($('<option>').html(id).val(id));
}

function resetPresetEnemyPattern(){
  $('#presetEnemyPatternBox option').remove();
}

function setPresetEnemyFormation(){
  resetPresetEnemyFormation();
  //console.log($('#presetAreaIdBox').val(),$('#presetAreaNoBox').val(),$('#presetMapCellBox').val(),'difficulty',$('#presetMapDifficultyBox').val(),'pattern',$('#presetEnemyPatternBox').val(),'formation')
  for(let id in mapdata[$('#presetAreaIdBox').val()][$('#presetAreaNoBox').val()][$('#presetMapCellBox').val()]['difficulty'][$('#presetMapDifficultyBox').val()]['pattern'][$('#presetEnemyPatternBox').val()]['formation']){
    _setPresetEnemyFormation(mapdata[$('#presetAreaIdBox').val()][$('#presetAreaNoBox').val()][$('#presetMapCellBox').val()]['difficulty'][$('#presetMapDifficultyBox').val()]['pattern'][$('#presetEnemyPatternBox').val()]['formation'][id]);
  }
}

function _setPresetEnemyFormation(id){
  $('#presetEnemyFormationBox').append($('<option>').html(toFormationName(id)).val(id));
}

function resetPresetEnemyFormation(){
  $('#presetEnemyFormationBox option').remove();
}

function setPresetAll(areaIdx){
  for(let no in mapdata[areaIdx]){
    _setPresetAreaNo(no);
  }
  let no = Object.keys(mapdata[areaIdx])[0];
  for(let cell in mapdata[areaIdx][no]){
    let isBoss = mapdata[areaIdx][no][cell]['boss'];
    _setPresetMapCell(cell,isBoss);
  }
  let cell = Object.keys(mapdata[areaIdx][no])[0];
  for(let difficulty in mapdata[areaIdx][no][cell]['difficulty']){
    _setPresetMapDifficulty(difficulty);
  }
  let difficulty = Object.keys(mapdata[areaIdx][no][cell]['difficulty'])[0];
  for(let pattern in mapdata[areaIdx][no][cell]['difficulty'][difficulty]['pattern']){
    _setPresetEnemyPattern(pattern);
  }
  let pattern = Object.keys(mapdata[areaIdx][no][cell]['difficulty'][difficulty]['pattern'])[0];
  for(let formation in mapdata[areaIdx][no][cell]['difficulty'][difficulty]['pattern'][pattern]['formation']){
    _setPresetEnemyFormation(mapdata[areaIdx][no][cell]['difficulty'][difficulty]['pattern'][pattern]['formation'][formation]);
  }
  allowFind();
}

function setPresetEnemyData(){
  let data = mapdata[$('#presetAreaIdBox').val()][$('#presetAreaNoBox').val()][$('#presetMapCellBox').val()]['difficulty'][$('#presetMapDifficultyBox').val()]['pattern'][$('#presetEnemyPatternBox').val()];
  let formation = $('#presetEnemyFormationBox').val();
  let organization = data['organization'];

  //console.log(formation,organization)
  parseName(organization,false);
  $("#formationBox").children().children('[kc-id=' + formation + ']').prop('selected', true);
  calc();
}

function resetPresetAll(){
  resetPresetAreaNo();
  resetPresetMapCell();
  resetPresetMapDifficulty();
  resetPresetEnemyPattern();
  resetPresetEnemyFormation();
}

function allowFind(){
  $('#presetButton').prop('disabled', false);
}
