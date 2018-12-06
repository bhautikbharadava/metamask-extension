const { Component } = require('react')
const h = require('react-hyperscript')
const PropTypes = require('prop-types')
const Spinner = require('../spinner')

class LoadingScreen extends Component {
  constructor (props) {
    super(props)

    this.cancelCall = this.cancelCall.bind(this)
  }

  componentWillMount () {
    this.cancelCallTimeout = setTimeout(this.cancelCall, this.props.cancelTime || 3000)
  }

  renderMessage () {
    const { loadingMessage } = this.props
    return loadingMessage && h('span', loadingMessage)
  }

  cancelCall () {
    const { cancelCondition, cancelFunction } = this.props

    if (cancelCondition) {
      cancelFunction()
    }
  }

  componentWillUnmount () {
    window.clearTimeout(this.cancelCallTimeout)
  }

  render () {
    return (
      h('.loading-overlay', [
        h('.loading-overlay__container', [
          h(Spinner, {
            color: '#F7C06C',
          }),

          this.renderMessage(),
        ]),
      ])
    )
  }
}

LoadingScreen.propTypes = {
  loadingMessage: PropTypes.string,
}

module.exports = LoadingScreen
