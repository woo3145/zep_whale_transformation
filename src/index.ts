/**
 * Copyright (c) 2023 ZEP Co., LTD
 */

import { ScriptPlayer } from 'zep-script';

// 변수에 SpriteSheet를 읽어 저장
const whale = ScriptApp.loadSpritesheet(
  'whale_sprite.png',
  48,
  64,
  {
    left: [0], // left 라는 이미 정해진 왼쪽 방향으로 걸을 때의 애니메이션 이름
    up: [0], // 그 이름에 쓰일 전체 파일에서의 인덱스 넘버들
    down: [0],
    right: [0],
  },
  1
); // 1초에 8장으로 한다.

function openWidget(p: ScriptPlayer) {
  if (p.isMobile)
    //Set the widget's name, anchor position, width, and height.
    p.tag.widget = p.showWidget('widget.html', 'sidebar', 300, 550);
  else p.tag.widget = p.showWidget('widget.html', 'sidebar', 280, 520);

  //Send data to widget
  p.tag.widget.sendMessage({
    isMobile: p.isMobile,
  });

  //Register events for messages sent from widgets
  p.tag.widget.onMessage.Add(function (sender: any, msg: any) {
    switch (msg.type) {
      case 'close':
        if (p.tag.widget) {
          p.tag.widget.destroy();
          p.tag.widget = null;
        }

        break;
      case 'submit':
        let choiceItem = msg.choice;
        if (choiceItem == 2) {
          sender.sprite = whale;
        } else if (choiceItem == 1) {
          sender.sprite = null;
        }
        sender.sendUpdated();
        break;
    }
  });
}

ScriptApp.onDestroy.Add(function () {
  ScriptMap.clearAllObjects();
});

ScriptApp.onJoinPlayer.Add(function (p) {
  //Reset the player's tag value
  p.tag = {};
});
// Action when the player clicks the sidebar app
ScriptApp.onSidebarTouched.Add(function (p) {
  openWidget(p);
});
