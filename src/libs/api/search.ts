// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import laftel from 'laftel.js'
import SearchYT from 'youtube-search'

const opts: SearchYT.YouTubeSearchOptions = {
  maxResults: 1,
  key: process.env.YOUTUBE_API_KEY
}

type Data = {
  anime: any,
  pv: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    const params = req.query as any
    let pv = ''

    await laftel.search(params.name).then(result => {
      const [anime] = result.results
      if (anime != null || anime != undefined) {
        laftel.getItem(anime.id).then(result => {

          SearchYT(`${result.name} PV`, opts, (err, results) => {
            if(err) return console.log(err)
          
            pv = results![0].link
            res.status(200).json({ anime: result, pv: pv })
          })

        })
      } else {
        res.status(200).json({ anime: 'not found', pv: '' })
      }
    })
  } else {
    // Handle any other HTTP method
  }
}