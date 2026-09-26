import Image, { type ImageProps } from "next/image";
/** CMS images may use signed Drive URLs or administrator-selected storage hosts. */
export default function ContentImage(props: ImageProps) {
  const src = typeof props.src === "string" && !props.src ? "/images/no-photo.svg" : props.src;
  return <Image {...props} alt={props.alt} src={src} unoptimized={props.unoptimized || (typeof src === "string" && (/^https?:\/\//.test(src) || src.startsWith("/api/media/")))} />;
}
