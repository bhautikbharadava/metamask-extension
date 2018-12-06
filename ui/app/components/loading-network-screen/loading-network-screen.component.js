import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../spinner'
import Button from '../button'

class LoadingNetworkScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showErrorScreen: false,
    }
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  componentWillMount = () => {
    this.cancelCallTimeout = setTimeout(this.cancelCall, this.props.cancelTime || 3000)
  }

  getConnectingLabel = function (loadingMessage) {
    if (loadingMessage) {
      return loadingMessage
    }
    const { provider, providerId } = this.props
    const providerName = provider.type

    let name

    if (providerName === 'mainnet') {
      name = this.context.t('connectingToMainnet')
    } else if (providerName === 'ropsten') {
      name = this.context.t('connectingToRopsten')
    } else if (providerName === 'kovan') {
      name = this.context.t('connectingToKovan')
    } else if (providerName === 'rinkeby') {
      name = this.context.t('connectingToRinkeby')
    } else {
      name = this.context.t('connectingTo', [providerId])
    }

    return name
  }

  renderMessage = () => {
    return <span>{ this.getConnectingLabel(this.props.loadingMessage) }</span>
  }

  renderLoadingScreenContent = () => {
    return <div className='loading-overlay__screen-content'>
      <Spinner color='#F7C06C' />
      {this.renderMessage()}
    </div>
  }

  renderErrorScreenContent = () => {
    const { showNetworkDropdown, setProviderArgs, lastSelectedProvider, setProviderType } = this.props

    return <div className='loading-overlay__error-screen'>
      <span className='loading-overlay__emoji'>&#128542;</span>
      <span>Oops! Something went wrong.</span>
      <div className='loading-overlay__error-buttons'>
        <Button
          type="default"
          onClick={() => {
            window.clearTimeout(this.cancelCallTimeout)
            showNetworkDropdown()
          }}
        >
          { 'Switch Networks' }
        </Button>

        <Button
          type='primary'
          onClick={() => {
            this.setState({ showErrorScreen: false })
            setProviderType(...setProviderArgs)
            window.clearTimeout(this.cancelCallTimeout)
            this.cancelCallTimeout = setTimeout(this.cancelCall, this.props.cancelTime || 3000)
          }}
        >
          { 'Try Again' }
        </Button>
      </div>
    </div>
  }

  cancelCall = () => {
    const { isLoadingNetwork } = this.props

    if (isLoadingNetwork) {
      this.setState({ showErrorScreen: true })
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.provider.type !== this.props.provider.type) {
      window.clearTimeout(this.cancelCallTimeout)
      this.setState({ showErrorScreen: false })
      this.cancelCallTimeout = setTimeout(this.cancelCall, this.props.cancelTime || 3000)
    }
  }

  componentWillUnmount = () => {
    window.clearTimeout(this.cancelCallTimeout)
  }

  render () {
    const { lastSelectedProvider, setProviderType } = this.props

    return (
      <div className='loading-overlay'>
        <div
          className="page-container__header-close"
          onClick={() => setProviderType(lastSelectedProvider || 'ropsten')}
        />
        <div className='loading-overlay__container'>
          { this.state.showErrorScreen
            ? this.renderErrorScreenContent()
            : this.renderLoadingScreenContent()
          }
        </div>
      </div>
    )
  }
}

LoadingNetworkScreen.propTypes = {
  loadingMessage: PropTypes.string,
}

module.exports = LoadingNetworkScreen
