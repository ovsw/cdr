const groq = require('groq')
const client = require('../utils/sanityClient')
module.exports =  async function() {
  const sanityResponse = await client.fetch(groq`
  *[_id == "siteHome"]{
    ...,
    content {
    	...,
    	'seoTitle': coalesce(seo.title, title),
			'seoDescription': coalesce(seo.description, ''),
			sections[]{
          ...,
          _type == 'testimonialsSection' => {
            ...,
            testimonials[]->{
              author,
              text
            }
          },
          _type == 'reusedSection' => {
            ...,
            reusableSection->{
              ...,
              _type == 'testimonialsSection' => {
                ...,
                testimonials[]->{
                  author,
                  text
                }
              },
            }
          }
       }
    }
  }[0]
  `).catch(err => console.error(err))

  return sanityResponse
}