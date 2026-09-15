# vrm-slots.md — 아바타 슬롯 규약 (draft lock)

**#5 deliverable.** 캐릭터 `id` → VRM **URL 또는 경로**만 갈아끼운다. 얼굴은 데이터. 원작(GPM) 모델 금지.

- Schema: [`vrm-slots.schema.json`](vrm-slots.schema.json)
- Runtime catalog (M2가 읽음): [`../../public/avatar-slots.json`](../../public/avatar-slots.json)
- 캐릭터 id / 이름은 [`original-pitch.md`](original-pitch.md)
- Role 값은 [`stats-and-relations.md`](stats-and-relations.md): `Pilot` `Scout` `Lead` `Wrench` `Ops` `Medic`

---

## 1. Runtime contract · 런타임 계약

1. 카탈로그 `schemaVersion: 1`.
2. `defaultSlotId` = 라이선스가 **명확한 공개 샘플**(CC0 / 자체). 지금 기본: VRoid Studio β **AvatarSample** 계열 (공식 FAQ: CC0).
3. 각 슬롯:
   - `id` — 안정 키 (세이브·관계가 이걸 봄)
   - `displayName` — **오리지널** 이름만 (string 또는 `{ ko, en }`)
   - `vrmUrl` **또는** `vrmPath` (둘 다 있으면 URL 우선)
   - `license`, `licenseUrl` — 필수
   - `role` — 선택. Role ID만
4. **런타임은 URL/path 문자열만 교체한다.** `id`를 바꾸면 세이브가 깨진다.
5. VRM 바이너리는 이 PR에 커밋하지 않는다. `#7`이 `@pixiv/three-vrm`로 로드.

`vrm.href` 중첩 객체는 **폐기**. 예전 `avatar-slots.schema.json`은 이 스키마를 가리킨다.

---

## 2. Default sample · 기본 샘플

| 항목 | 값 |
| --- | --- |
| Slot | `cadet_player` (`defaultSlotId`) |
| File intent | `/models/samples/default-cadet.vrm` |
| License | **CC0-1.0** |
| Source | VRoid Studio β AvatarSample_1 (pixiv) |
| License note | [VRoid FAQ — sample model terms](https://vroid.pixiv.help/hc/en-us/articles/4402614652569-Do-VRoid-Studio-s-sample-models-come-with-conditions-of-use) |

Vendoring 전 `status: "placeholder"` 허용. **라이선스 필드는 채워 둔다.** GPM 룩어라이크·라이선스 불명 Hub 모델을 넣지 말 것.

허용 출처: 공식 VRoid β 샘플(CC0), CC0 VRM, 자체 제작. A–C 등 **별도 약관** 샘플은 약관을 읽고 `license`를 맞게 적을 것.

---

## 3. How to swap · 교체 방법

1. 라이선스 명확한 `.vrm`을 구한다 (VRoid Hub 샘플 또는 자체보내기).
2. `public/models/samples/`에 두거나, 핫링크가 허용된 `https://` URL을 쓴다.
3. 해당 `id`의 `vrmPath` 또는 `vrmUrl`만 수정한다.
4. PR 본문에 `license` + `licenseUrl` (+ 출처)를 적는다 — [`docs/LEGAL.md`](../LEGAL.md) 체크리스트.

---

## 4. Example catalog · 예시 (오리지널 이름)

```json
{
  "schemaVersion": 1,
  "defaultSlotId": "cadet_player",
  "slots": [
    {
      "id": "cadet_player",
      "displayName": { "ko": "서하늘", "en": "Seo Haneul" },
      "vrmPath": "/models/samples/default-cadet.vrm",
      "license": "CC0-1.0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
      "role": "Scout",
      "sourceName": "VRoid Studio β AvatarSample_1",
      "sourceUrl": "https://vroid.pixiv.help/hc/en-us/articles/360012381793",
      "attribution": "pixiv Inc. (CC0 sample)",
      "status": "placeholder"
    }
  ]
}
```

---

## 5. Checklist

- [ ] 배포되는 모든 `.vrm`에 `license` + `licenseUrl`
- [ ] 기본 슬롯은 공개/CC0/자체 — **GPM 모델 없음**
- [ ] `displayName`은 [`original-pitch.md`](original-pitch.md)와 일치
- [ ] `id`를 바꾸지 않고 URL/path만 교체
- [ ] 저작권 캐릭터 팬 모델을 슬롯에 넣지 않음
