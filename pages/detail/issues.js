import withRepoBasic from '../../components/with-repo-basic'

const Issues = ({text}) => <span>{text}</span>

Issues.getInitialProps = async ()=>{
  return {
    text:234
  }
}

export default withRepoBasic(Issues,'issues')