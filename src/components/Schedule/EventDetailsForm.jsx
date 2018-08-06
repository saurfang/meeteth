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
    isUpdating: PropTypes.bool.isRequired,
    event: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      start: PropTypes.instanceOf(Date),
      end: PropTypes.instanceOf(Date),
    }),
    onFormSubmit: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { isUpdating } = this.props;
    if (!isUpdating) {
      this.titleInput.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      event,
      form: { resetFields },
      isUpdating,
    } = this.props;
    // reset fields properly
    if (event !== prevProps.event) {
      resetFields();

      if (!isUpdating) {
        this.titleInput.focus();
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    const {
      form: { validateFields },
      onFormSubmit,
    } = this.props;

    validateFields(onFormSubmit);
  };

  render() {
    const {
      form: { getFieldDecorator },
      isUpdating,
      event,
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
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
        </FormItem>
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
        <FormItem>
          {/* TODO: add ability to update event */}
          <Button type="primary" htmlType="submit" disabled={isUpdating}>
            {isUpdating ? "Update" : "Create"}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(EventDetailsForm);
