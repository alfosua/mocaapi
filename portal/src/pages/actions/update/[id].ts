import type { APIRoute, EndpointHandler } from 'astro'

function processFormData(data: FormData): unknown {
  const result: any = {}

  const keys = data.keys()

  for (const key of keys) {
    const value = data.get(key)

    const segs = key.split('.')

    segs.reduce((parent, seg, index) => {
      const nextSeg = segs[index + 1]
      if (index === segs.length - 1) {
        parent[seg] = value
      } else {
        parent[seg] ??= /^\d+$/.test(nextSeg) ? [] : {}
      }
      return parent[seg]
    }, result)
  }

  return result
}

export const post: APIRoute = async ({ redirect, params: { id }, request }) => {
  const form = await request.formData()

  console.log(processFormData(form))

  return redirect('/edit/' + id)
}
