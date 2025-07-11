export async function GET<T = any>(fetchFn: typeof fetch, url: string, headers?: Record<string, string>) {
  let res: Response, data: T
  try {
    if (headers)
      res = await fetchFn(url)
    else
      res = await fetchFn(url, {
        method: 'GET',
        headers
      })

    data = await res.json()
  } catch (e) {
    console.error(e)
    throw {
      message: `GET ${url} Failed`
    }
  }

  if (res.ok) return data

  throw {
    message: data.message || `GET Status ${res.status}`
  }
}

export async function POST<T = any>(fetchFn: typeof fetch, url: string, body: Record<string, any>) {
  let res: Response, data: T
  try {
    res = await fetchFn(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    data = await res.json()
  } catch (e) {
    console.error(e)
    throw {
      message: `POST ${url} Failed`
    }
  }

  if (res.ok) return data

  throw {
    message: data.message || `POST Status ${res.status}`
  }
}

export async function PUT<T = any>(fetchFn: typeof fetch, url: string, body: Record<string, any>) {
  let res: Response, data: T
  try {
    res = await fetchFn(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    data = await res.json()
  } catch (e) {
    console.error(e)
    throw {
      message: `PUT ${url} Failed`
    }
  }

  if (res.ok) return data

  throw {
    message: data.message || `PUT Status ${res.status}`
  }
}

