import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/r/22/:arquivo*",
        headers: [
          {
            key: "X-Etiqueta",
            value: "ZnVuZG8gZGEgZ2F2ZXRhLCBhbyBjb250csOhcmlv",
          },
        ],
      },
    ]
  },
}

export default nextConfig
