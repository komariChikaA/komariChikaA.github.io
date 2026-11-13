#!/usr/bin/env python3
"""Fetch Bangumi user profile and anime/game collections into data.js."""

import json
import os
import sys
import urllib.request
from datetime import datetime, timezone, timedelta

USER_ID = "993671"
USER_AGENT = "GuraNirei-Bangumi-Archive/1.0 (https://github.com/komariChikaA)"


def http_get_json(url):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fetch_user(user_id):
    data = http_get_json(f"https://api.bgm.tv/v0/users/{user_id}")
    avatar = data.get("avatar") or {}
    return {
        "id": data.get("id") or int(user_id),
        "username": str(data.get("username") or user_id),
        "nickname": data.get("nickname") or str(user_id),
        "sign": data.get("sign") or "",
        "url": data.get("url") or f"https://bgm.tv/user/{user_id}",
        "avatar": avatar.get("large") or avatar.get("medium") or avatar.get("small") or "",
    }


def fetch_collections(user_id, subject_type):
    items = []
    offset = 0
    limit = 100
    total = None
    while True:
        url = (
            f"https://api.bgm.tv/v0/users/{user_id}/collections"
            f"?subject_type={subject_type}&limit={limit}&offset={offset}"
        )
        data = http_get_json(url)
        if total is None:
            total = data.get("total", 0)
        batch = data.get("data") or []
        if not batch:
            break
        for x in batch:
            subj = x.get("subject") or {}
            imgs = subj.get("images") or {}
            raw_tags = subj.get("tags") or []
            tags = []
            for tg in raw_tags[:8]:
                name = tg.get("name")
                if name:
                    tags.append(name)
            # Include user's own tags at the front if any
            user_tags = x.get("tags") or []
            merged_tags = []
            for ut in user_tags:
                if ut and ut not in merged_tags:
                    merged_tags.append(ut)
            for st_tag in tags:
                if st_tag not in merged_tags and len(merged_tags) < 8:
                    merged_tags.append(st_tag)

            items.append(
                {
                    "id": x.get("subject_id") or subj.get("id") or 0,
                    "st": subject_type,
                    "t": x.get("type") or 0,
                    "r": x.get("rate") or 0,
                    "c": x.get("comment") or "",
                    "ep": x.get("ep_status") or 0,
                    "u": (x.get("updated_at") or "")[:10],
                    "ua": x.get("updated_at") or "",
                    "n": subj.get("name") or "",
                    "cn": subj.get("name_cn") or "",
                    "d": subj.get("date") or "",
                    "eps": subj.get("eps") or 0,
                    "sc": subj.get("score") or 0,
                    "rk": subj.get("rank") or 0,
                    "ct": subj.get("collection_total") or 0,
                    "img": imgs.get("common") or imgs.get("medium") or imgs.get("small") or "",
                    "sum": (subj.get("short_summary") or "").strip(),
                    "tags": merged_tags,
                }
            )
        offset += len(batch)
        if len(items) >= total:
            break
    return items


def main():
    out_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "..", "data.js")
    out_path = os.path.abspath(out_path)

    user = fetch_user(USER_ID)
    anime = fetch_collections(USER_ID, 2)
    game = fetch_collections(USER_ID, 4)

    tz_cn = timezone(timedelta(hours=8))
    synced_at = datetime.now(tz_cn).strftime("%Y-%m-%d %H:%M:%S +08:00")

    payload = {
        "user": user,
        "synced_at": synced_at,
        "anime": anime,
        "game": game,
    }

    js_content = (
        "// Auto-generated snapshot from Bangumi API (https://api.bgm.tv)\n"
        "window.BGM_ARCHIVE_DATA = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n"
    )

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"Wrote {out_path}: anime={len(anime)}, game={len(game)}, bytes={len(js_content.encode('utf-8'))}")


if __name__ == "__main__":
    main()
