import { useState, useEffect } from "react";
import { Play } from "lucide-react";

export function galleryItemIsVideo(item) {
  const mt = item.mediaType ?? item.MediaType ?? item.type ?? item.Type;
  if (mt === "video") return true;
  if (item.videoUrl || item.VideoUrl) return true;
  const u = item.url;
  return !!(u && (u.includes("youtube") || u.includes("vimeo")));
}

export function getYoutubeVideoId(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  try {
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const u = new URL(withProto);
    const host = u.hostname.replace(/^www\./i, "");
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id?.split("?")[0] || null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname.startsWith("/shorts/")) {
        return u.pathname.split("/")[2]?.split("?")[0] || null;
      }
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.split("/")[2]?.split("?")[0] || null;
      }
      const v = u.searchParams.get("v");
      if (v) return v;
    }
  } catch {
    /* fall through */
  }
  const watch = trimmed.match(/[?&]v=([^&]+)/);
  if (watch) return watch[1];
  const short = trimmed.match(/youtu\.be\/([^?&/]+)/);
  if (short) return short[1];
  return null;
}

export function getDailymotionVideoId(url) {
  if (!url) return null;
  const m = url.match(/dailymotion\.com\/(?:video\/|embed\/video\/)([a-zA-Z0-9]+)/);
  return m ? m[1] : null;
}

export function isProbablyDirectVideoFile(url) {
  if (!url || typeof url !== "string") return false;
  const path = url.trim().split("?")[0].toLowerCase();
  return /\.(mp4|webm|ogg|ogv|m4v)$/i.test(path);
}

export function isVimeoWatchUrl(url) {
  return typeof url === "string" && /vimeo\.com\//i.test(url);
}

export function getEmbedPosterUrlSync(videoUrl) {
  const yt = getYoutubeVideoId(videoUrl);
  if (yt) return `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`;
  const dm = getDailymotionVideoId(videoUrl);
  if (dm) return `https://www.dailymotion.com/thumbnail/video/${dm}`;
  return null;
}

export function getVideoEmbedUrl(url) {
  if (!url) return null;
  const id = getYoutubeVideoId(url);
  if (id) return `https://www.youtube.com/embed/${id}`;
  if (isVimeoWatchUrl(url)) {
    const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return `https://player.vimeo.com/video/${m[1]}`;
    try {
      const u = new URL(url.includes("://") ? url : `https://${url}`);
      const parts = u.pathname.split("/").filter(Boolean);
      const last = parts[parts.length - 1];
      if (last && /^\d+$/.test(last)) return `https://player.vimeo.com/video/${last}`;
    } catch {
      /* ignore */
    }
  }
  return url;
}

/**
 * @returns {{ kind: 'image'|'poster'|'video'|'vimeo'|'empty', src?: string, videoSrc?: string, videoUrl?: string }}
 */
export function resolveGalleryCardVisual(item) {
  const videoUrl = (item.videoUrl ?? item.VideoUrl ?? "").trim();
  const imageUrl = (
    item.thumbnailUrl ||
    item.imageUrl ||
    item.ImageUrl ||
    ""
  ).trim();

  if (!galleryItemIsVideo(item)) {
    if (imageUrl) return { kind: "image", src: imageUrl };
    return { kind: "empty" };
  }

  if (imageUrl) return { kind: "image", src: imageUrl };

  if (!videoUrl) return { kind: "empty" };

  if (isProbablyDirectVideoFile(videoUrl)) {
    return { kind: "video", videoSrc: videoUrl };
  }

  const poster = getEmbedPosterUrlSync(videoUrl);
  if (poster) return { kind: "poster", src: poster };

  if (isVimeoWatchUrl(videoUrl)) {
    return { kind: "vimeo", videoUrl };
  }

  return { kind: "empty" };
}

export function VimeoPosterImage({ videoUrl, alt, className, loadingClassName }) {
  const [src, setSrc] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setSrc(null);
    setDone(false);
    (async () => {
      try {
        const oembed = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}`;
        const res = await fetch(oembed);
        if (!res.ok) throw new Error("oembed");
        const data = await res.json();
        const thumb = data.thumbnail_url;
        if (!cancelled) {
          if (thumb) setSrc(thumb);
          setDone(true);
        }
      } catch {
        if (!cancelled) setDone(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [videoUrl]);

  const loadingCls =
    loadingClassName ?? "bg-slate-700 flex items-center justify-center";

  if (!done) {
    return (
      <div className={`${className} ${loadingCls}`} aria-hidden>
        <Play className="text-white/40 w-10 h-10" strokeWidth={1.5} />
      </div>
    );
  }

  if (!src) {
    return (
      <div className={`${className} ${loadingCls}`} aria-hidden>
        <Play className="text-white/40 w-10 h-10" strokeWidth={1.5} />
      </div>
    );
  }

  return <img src={src} alt={alt || ""} className={className} />;
}
