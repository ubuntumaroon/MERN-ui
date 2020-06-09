import React from 'react';
import Toast from './Toast.jsx';

export default function withToast(OriginalComponent) {
  return class ToastWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        toastVisible: false,
        toastMessage: '',
        toastType: 'success',
      };
      this.showSuccess = this.showSuccess.bind(this);
      this.showError = this.showError.bind(this);
      this.dismissToast = this.dismissToast.bind(this);
    }

    showSuccess(message) {
      this.setState({ toastVisible: true, toastMessage: message, toastType: 'success' });
    }

    showError(message) {
      this.setState({ toastVisible: true, toastMessage: message, toastType: 'warning' });
    }

    dismissToast() {
      this.setState({ toastVisible: false });
    }

    render() {
      const { toastMessage, toastType, toastVisible } = this.state;

      return (
        <>
          <Toast
            toastType={toastType}
            toastMessage={toastMessage}
            onClose={this.dismissToast}
            show={toastVisible}
            delay={6000}
            autohide
          />
          <OriginalComponent
            showError={this.showError}
            showSuccess={this.showSuccess}
            dismissToast={this.dismissToast}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...this.props}
          />
        </>
      );
    }
  };
}
