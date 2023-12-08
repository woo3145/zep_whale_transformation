/**
 * Copyright (c) 2023 ZEP Co., LTD
 */

import { ScriptPlayer } from 'zep-script';
import { add } from './utils/add';

const openWidget = (player: ScriptPlayer) => {
  if (player.isMobile) {
    player.tag.widget = player.showWidget('widget.html', 'sidebar', 300, 500);
  } else {
    player.tag.widget = player.showWidget('widget.html', 'sidebar', 290, 460);
  }

  // send message to widget
  player.tag.widget.sendMessage({
    isMobile: player.isMobile,
  });

  // handle message from child frame(widget)
  player.tag.widget.onMessage.Add((sender: ScriptPlayer, msg: any) => {
    switch (msg.type) {
      case 'close':
        if (sender.tag.widget) {
          sender.tag.widget.destroy();
          sender.tag.widget = null;
        }
        break;
      case 'submit':
        sender.showAlert('OK', (res: boolean) => {
          return {};
        });
        break;
    }
  });
};

let zepLogo = ScriptApp.loadSpritesheet('whale.png');

// 변수에 SpriteSheet를 읽어 저장
const whale = ScriptApp.loadSpritesheet(
  'image.png',
  100,
  100,
  {
    left: [0], // left 라는 이미 정해진 왼쪽 방향으로 걸을 때의 애니메이션 이름
    up: [0], // 그 이름에 쓰일 전체 파일에서의 인덱스 넘버들
    down: [0],
    right: [0],
  },
  1
); // 1초에 8장으로 한다.

// 플레이어가 입장할 때 바로 고래 그림으로 교체해준다.
ScriptApp.onJoinPlayer.Add(function (player) {
  player.sprite = whale;

  // 플레이어 속성이 변경되었으므로 호출해서 실제 반영해준다.
  player.sendUpdated();
});

ScriptMap.putObject(0, 0, zepLogo, { overlap: true });

ScriptApp.onDestroy.Add(function () {
  ScriptMap.clearAllObjects();
});
