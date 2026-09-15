# vrm-slots.md — 아바타 슬롯 규약 (draft lock)

**#5 deliverable.** 캐릭터 `id` → VRM **URL 또는 경로**만 갈아끼운다. 얼굴은 데이터. 원작(GPM) 모델 금지.

- Schema: [`vrm-slots.schema.json`](vrm-slots.schema.json)
- Runtime catalog (M2가 읽음): [`../../public/avatar-slots.json`](../../public/avatar-slots.json)
- 캐릭터 id / 이름은 [`original-pitch.md`](original-pitch.md)
- Role 값은 [`stats-and-relations.md`](stats-and-relations.md): `Pilot` `Scout` `Lead` `Wrench` `Ops` `Medic`

---

## 1. Runtime contract · 런타임 계약

1. 카탈로그 `schemaVersion: 1`.
2. `defaultSlotId` = 라이선스가 **명확한 공개 샘플**. M2 기본은 VRM Consortium 공식 샘플을 jsDelivr **`vrmUrl`** 로 로드 ([VRM Public License 1.0](https://vrm.dev/licenses/1.0/)). 로컬 CC0는 `id`를 유지한 채 URL/path만 교체.
3. 각 슬롯:
   - `id` — 안정 키 (세이브·관계가 이걸 봄). [`original-pitch.md`](original-pitch.md) 캐스트와 동일. **바꾸지 말 것.**
   - `displayName` — **오리지널** 이름만 (string 또는 `{ ko, en }`)
   - `vrmUrl` **또는** `vrmPath` (둘 다 있으면 URL 우선). M2 카탈로그는 문서화된 `https://` CDN만.
   - `license`, `licenseUrl` — **필수**. 빠지면 FAIL.
   - `role` — 선택. Role ID만
4. **런타임은 URL/path 문자열만 교체한다.** `id`를 바꾸면 세이브가 깨진다.
5. **VRM 바이너리는 커밋하지 않는다.** `#7`이 `@pixiv/three-vrm`로 CDN URL을 로드.

`vrm.href` 중첩 객체는 **폐기**. 예전 `avatar-slots.schema.json`은 이 스키마를 가리킨다.

---

## 2. Default sample · 기본 샘플

| 항목 | 값 |
| --- | --- |
| Slot | `cadet_player` (`defaultSlotId`) |
| File intent | local `vrmPath`는 이후 스왑용 — 이 카탈로그에는 넣지 않음 |
| M2 demo URL | Official VRM Consortium sample via jsDelivr (`vrmUrl` only) |
| License (current URL) | **VRM Public License 1.0** — [vrm.dev/licenses/1.0](https://vrm.dev/licenses/1.0/) |
| Source | [VRM1_Constraint_Twist_Sample](https://github.com/vrm-c/vrm-specification/tree/master/samples/VRM1_Constraint_Twist_Sample) (pixiv Inc.) |
| Alternate demo URL | [Seed-san](https://github.com/vrm-c/vrm-specification/tree/master/samples/Seed-san) (VirtualCast, Inc.; same license) |

Vendoring 전 `status: "placeholder"` 허용. **라이선스 필드는 실제 로드하는 파일과 맞출 것.** GPM 룩어라이크·라이선스 불명 Hub 모델을 넣지 말 것.

허용 출처: 공식 VRM Consortium / three-vrm 샘플(약관 명시), 공식 VRoid β 샘플(CC0), CC0 VRM, 자체 제작. A–C 등 **별도 약관** 샘플은 약관을 읽고 `license`를 맞게 적을 것.

로컬에 CC0 파일을 실험할 때는 `id`를 유지한 채 `vrmUrl`/`vrmPath`만 바꾼다. **`.vrm`은 커밋하지 말 것.**

---

## 3. How to swap · 교체 방법

1. 라이선스 명확한 `.vrm`을 구한다 (공식 샘플 URL, CC0, 또는 자체보내기).
2. **문서화된 `https://` CDN/URL**을 해당 슬롯의 `vrmUrl`에 넣는다. `.vrm` 바이너리는 커밋하지 않는다.
3. 해당 **`id`는 그대로 두고** `vrmUrl` 또는 `vrmPath`만 수정한다.
4. 같은 슬롯의 `license` + `licenseUrl` (+ 출처)를 **실제 로드하는 파일**에 맞춘다 — [`docs/LEGAL.md`](../LEGAL.md) 체크리스트.

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
      "vrmUrl": "https://cdn.jsdelivr.net/gh/vrm-c/vrm-specification@master/samples/VRM1_Constraint_Twist_Sample/vrm/VRM1_Constraint_Twist_Sample.vrm",
      "license": "VRM-1.0",
      "licenseUrl": "https://vrm.dev/licenses/1.0/",
      "role": "Scout",
      "sourceName": "VRM1_Constraint_Twist_Sample (VRM Consortium)",
      "sourceUrl": "https://github.com/vrm-c/vrm-specification/tree/master/samples/VRM1_Constraint_Twist_Sample",
      "attribution": "pixiv Inc. (c) 2022 — official sample via jsDelivr",
      "status": "placeholder"
    }
  ]
}
```

---

## 5. Checklist

- [ ] 모든 슬롯에 `license` + `licenseUrl` (없으면 FAIL)
- [ ] 기본 슬롯은 공개 라이선스 / CC0 / 자체 — **GPM 모델 없음**
- [ ] `displayName`은 [`original-pitch.md`](original-pitch.md)와 일치
- [ ] `id`를 바꾸지 않고 URL/path만 교체
- [ ] `.vrm` 바이너리 미커밋 — 문서화된 CDN/URL만 로드
- [ ] 저작권 캐릭터 팬 모델을 슬롯에 넣지 않음
