import { drizzleConnect } from "drizzle-react";
import React from "react";
import { css } from "emotion";
import PropTypes from "prop-types";
import equal from "fast-deep-equal";
import makeBlockie from "ethereum-blockies-base64";

const styles = {
  account: css({
    flex: "1",
    display: "flex",
    "& div": {
      margin: 8,
    },
    "& img": {
      width: 64,
      height: 64,
    },
  }),
};

class AccountHeader extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static contextTypes = {
    drizzle: PropTypes.object,
  };

  shouldComponentUpdate(nextProps) {
    const { accounts } = this.props;
    return !equal(nextProps.accounts, accounts);
  }

  render() {
    const { accounts, children } = this.props;
    const account = accounts && accounts[0];

    return (
      <div className={styles.account}>
        <div>
          <img src={makeBlockie(account)} alt={account} />
        </div>
        <div>
          <h4>{account}</h4>
          {children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ ...state });

export default drizzleConnect(AccountHeader, mapStateToProps);
