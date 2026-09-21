import { NextResponse, type NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  if (/^\/f\/0*26$/.test(request.nextUrl.pathname)) {
    requestHeaders.set("x-vigilia-record", "26")
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = { matcher: "/f/:n" }
