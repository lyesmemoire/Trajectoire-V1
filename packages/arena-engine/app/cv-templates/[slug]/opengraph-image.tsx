import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OGImage({ params }: PageProps) {
  const { slug } = await params;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#111",
        color: "white",
        fontSize: "60px",
      }}
    >
      CV Template: {slug}
    </div>,
    { ...size },
  );
}
