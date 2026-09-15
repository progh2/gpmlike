# VRM avatar slots

Characters are data. Faces are **swappable VRM files**. Change a path in JSON; do not bake a copyrighted look into the cast.

Issue #5. Runtime file: `public/avatar-slots.json`. Schema: `docs/design/avatar-slots.schema.json`.

## Convention

- One document, `schemaVersion: 1`.
- `slots[]`: each row is a **character id** (from `original-pitch.md`) plus a `vrm` locator.
- `vrm.href` is either:
  - a same-origin path (`/models/samples/….vrm`), or
  - an absolute `https://` URL the user is allowed to hotlink.
- `vrm.license` must be filled. Default samples: **CC0** VRoid β AvatarSample models ([FAQ](https://vroid.pixiv.help/hc/en-us/articles/4402614652569-Do-VRoid-Studio-s-sample-models-come-with-conditions-of-use)).
- `vrm.attribution` is required when the license asks for it; CC0 may still credit pixiv as courtesy.
- Do **not** point a slot at a fan model of a copyrighted character.

## How to swap (for #7)

1. Download a license-clear `.vrm` (VRoid Hub sample, or your own export).
2. Put it in `public/models/` (gitignored large binaries are OK; document the source).
3. Set `slots[i].vrm.href` to `/models/your-file.vrm`.
4. Keep `id` stable so saves and relations still match.

This scaffold does **not** load VRM yet. `#7` will use `@pixiv/three-vrm`.

## Slot ids (draft)

| `id` | Default sample intent |
| --- | --- |
| `cadet_player` | CC0 β AvatarSample_A-equivalent or AvatarSample_1 |
| `cadet_iseul` | Different CC0 sample |
| `cadet_rio` | Different CC0 sample |
| `cadet_minjae` | Different CC0 sample |
| `staff_nari` | Adult-presenting license-clear model |

Until files are vendored, `href` may be `null` and `status: "placeholder"`.

## JSON shape

```json
{
  "schemaVersion": 1,
  "slots": [
    {
      "id": "cadet_player",
      "displayName": { "ko": "서하늘", "en": "Seo Haneul" },
      "vrm": {
        "href": null,
        "license": "CC0-1.0",
        "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
        "sourceName": "VRoid Studio β AvatarSample_1",
        "sourceUrl": "https://vroid.pixiv.help/hc/en-us/articles/360012381793",
        "attribution": "pixiv Inc. (CC0 sample)",
        "status": "placeholder"
      }
    }
  ]
}
```

## Checklist

- [ ] Every shipped `.vrm` has `license` + `sourceUrl`
- [ ] No GPM (or other copyrighted) character likeness
- [ ] Player can replace `href` without a code change
