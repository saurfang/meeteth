import { Form, Input, Button, DatePicker } from "antd";
import moment from "moment";
import { formShape } from "rc-form";
import React from "react";
import PropTypes from "prop-types";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class EventDetailsForm extends React.Component {
  static propTypes = {
    form: formShape,
    event: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      owner: PropTypes.string,
      start: PropTypes.instanceOf(Date),
      end: PropTypes.instanceOf(Date),
    }).isRequired,
    buttons: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
      })
    ),
    rules: PropTypes.object,
  };

  static defaultProps = { buttons: [], rules: {} };

  componentDidUpdate(prevProps) {
    const {
      event,
      form: { resetFields },
    } = this.props;
    // reset fields properly
    if (event !== prevProps.event) {
      resetFields();
    }
  }

  handleSubmit = onClick => e => {
    e.preventDefault();

    const {
      form: { validateFields },
    } = this.props;

    validateFields(onClick);
  };

  render() {
    const {
      form: { getFieldDecorator },
      event,
      buttons,
      rules,
    } = this.props;

    const buttonNodes = buttons.map(({ text, onClick }, id) => (
      <Button type="primary" onClick={this.handleSubmit(onClick)} key={id}>
        {text}
      </Button>
    ));

    return (
      <Form>
        <FormItem>
          {getFieldDecorator("id", {
            initialValue: event.id,
          })(<Input disabled hidden />)}
        </FormItem>
        {/* <FormItem>
          {getFieldDecorator("title", {
            rules: [
              { required: true, message: "Please input your event title!" },
            ],
            initialValue: event.title,
          })(
            <Input
              placeholder="Add title"
              ref={input => {
                this.titleInput = input;
              }}
            />
          )}
        </FormItem> */}
        <FormItem>
          {getFieldDecorator("timeRange", {
            rules: [
              {
                type: "array",
                required: true,
                message: "Please select your event time!",
              },
            ],
            initialValue: [moment(event.start), moment(event.end)],
          })(<RangePicker showTime format="YYYY-MM-DD HH:mm" />)}
        </FormItem>
        <FormItem label="Owner">
          {getFieldDecorator("owner", {
            rules: rules.owner,
            initialValue: event.owner,
          })(<Input disabled={!rules.owner} />)}
        </FormItem>
        <FormItem>{buttonNodes}</FormItem>
      </Form>
    );
  }
}

export default Form.create()(EventDetailsForm);
