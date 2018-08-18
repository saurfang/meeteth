import { drizzleConnect } from "drizzle-react";
import React from "react";
import { css } from "emotion";
import PropTypes from "prop-types";
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

class AccountHeader extends React.PureComponent {
  static propTypes = {
    account: PropTypes.string.isRequired,
    children: PropTypes.node,
  };

  static contextTypes = {
    drizzle: PropTypes.object,
  };

  render() {
    const { account, children } = this.props;

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

const mapStateToProps = ({ accounts }) => ({
  account: accounts && accounts[0],
});

export default drizzleConnect(AccountHeader, mapStateToProps);
