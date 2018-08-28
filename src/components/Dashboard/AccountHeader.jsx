import { drizzleConnect } from "drizzle-react";
import React from "react";
import { css } from "emotion";
import PropTypes from "prop-types";
import makeBlockie from "../../dependencies/ethereum-blockies-base64";

const styles = {
  account: css({
    display: "flex",
  }),
  accountImg: css({
    width: 64,
    height: 64,
    margin: 8,
  }),
  div: css({
    margin: 8,
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
        <div className={styles.accountImg}>
          <img src={makeBlockie(account)} alt={account} />
        </div>
        <div className={styles.div}>
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
