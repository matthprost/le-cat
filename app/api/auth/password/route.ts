import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const receivedData = await req.json()
  const password = receivedData.password

  if (!password) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 })
  }

  if (process.env.PASSWORD === password) {
    const response = NextResponse.json({ isAuthenticated: true })

    // we set a cookie to indicate successful authentication
    response.cookies.set('isAuthenticated', 'true')

    return response
  }

  return NextResponse.json({ error: 'Password is incorrect' }, { status: 401 })
}
