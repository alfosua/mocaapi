import type { APIContext } from 'astro'

export function get({ url, locals }: APIContext) {
  const name = url.searchParams.get('name') || 'World'
  return Response.json({ text: `Hello ${name}!` })
}
