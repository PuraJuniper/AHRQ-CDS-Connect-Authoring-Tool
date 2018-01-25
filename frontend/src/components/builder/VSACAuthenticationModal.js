import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import Modal from '../elements/Modal';

class VSACAuthenticationModal extends Component {
  constructor(props) {
    super(props);
<<<<<<< a971ab19c192ccc42276ede23e44e6a9b20e6199

    this.state = { showVSACAuthModal: false };
  }

=======
    
    this.state = { showVSACAuthModal: false };
  }
  
>>>>>>> Added modal, actions, and reducers for logging into VSAC
  openVSACLoginModal = () => {
    this.setState({ showVSACAuthModal: true });
  }

  closeVSACLoginModal = () => {
    this.setState({ showVSACAuthModal: false });
    this.props.setVSACAuthStatus(null);
  }
<<<<<<< a971ab19c192ccc42276ede23e44e6a9b20e6199

=======
  
>>>>>>> Added modal, actions, and reducers for logging into VSAC
  loginToVSAC = (event) => {
    event.preventDefault();

    const { username, password } = this.refs;
    this.props.loginVSACUser(username.value.trim(), password.value.trim());
  }
<<<<<<< a971ab19c192ccc42276ede23e44e6a9b20e6199

=======
  
>>>>>>> Added modal, actions, and reducers for logging into VSAC
  renderedAuthStatusText() {
    const { vsacStatus, vsacStatusText } = this.props;

    if (vsacStatus !== 'loginFailure') { return null; }

    return (
      <div className="login__auth-status">
        <FontAwesome name="exclamation-circle" /> {vsacStatusText}
      </div>
    );
  }
<<<<<<< a971ab19c192ccc42276ede23e44e6a9b20e6199

  render() {
    return (
=======
  
  render() {
    return(
>>>>>>> Added modal, actions, and reducers for logging into VSAC
      <div>
        <button className="primary-button vsac-authenticate" onClick={this.openVSACLoginModal}>
          <FontAwesome name="key" />{' '}Authenticate VSAC
        </button>
        <Modal
          modalTitle="Login to VSAC your account"
          modalId="vsac-login"
          modalTheme="dark"
          modalSubmitButtonText="Login"
          handleShowModal={this.state.showVSACAuthModal}
          handleCloseModal={this.closeVSACLoginModal}
          handleSaveModal={this.loginToVSAC}>
          <div className="login-modal">
            <div className="login-modal__disclaimer">
              Use your UMLS account to log in to VSAC to access value sets and codes within the CDS Authoring Tool.
            </div>

            <div className="login-modal__form">
              <input type='text' ref='username' className="form-control col" placeholder='username' />
              <input type='password' ref='password' className="form-control col" placeholder='password' />
              {this.renderedAuthStatusText()}
            </div>
          </div>
        </Modal>
      </div>
<<<<<<< a971ab19c192ccc42276ede23e44e6a9b20e6199
    );
=======
    )
>>>>>>> Added modal, actions, and reducers for logging into VSAC
  }
}

VSACAuthenticationModal.propTypes = {
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string.isRequired
<<<<<<< a971ab19c192ccc42276ede23e44e6a9b20e6199
};

export default VSACAuthenticationModal;
=======
}

export default VSACAuthenticationModal;
>>>>>>> Added modal, actions, and reducers for logging into VSAC
