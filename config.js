const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'
const client_id = '45abece7d24cecaf33c5'
module.exports = {
  github: {
    request_token_url: 'https://github.com/login/oauth/access_token',
    client_id,
    client_secret: '11207e1e762a8fda3cc9ebbc0b42fddcfc8d59f6'
  },
  GITHUB_OAUTH_URL,
  OAUTH_RUL:`${GITHUB_OAUTH_URL}?client_id=${
    client_id
  }&scope=${SCOPE}`
}
//token:17718e51a5e0ca9363b1631c6d51982d6f25db3c