import { connect } from 'dva';
import React, { Component } from 'react';
import moment from 'moment';
import { Form, Input, Modal, Select, Button, DatePicker, Radio } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint-disable */
@connect(({ user }) => ({
  user,
}))
@Form.create()
class UpdateForm extends Component {

  handleUpdate = (fields) => {
    const { handleModalVisible, formStatus, doSearch } = this.props;
    let type = '';
    if (formStatus === 'create') {
      type = 'user/add';
    }; 
    if (formStatus === 'update') {
      type = 'user/update';
    };
    this.props.dispatch({
      type: type,
      payload: { REQ_PARAM: fields },
      callback: () => {
        doSearch();
      }
    });
    handleModalVisible();    
  };
  handleNext = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.birthday) {
        fieldsValue.birthday = moment(fieldsValue.birthday).format('YYYY-MM-DD');
      }
      this.handleUpdate(fieldsValue);
      
    });
  };
  disabledEndDate = (currentDate) => {
    return currentDate > moment().endOf('day');
  };
  checkUserName = (rule, value, callback) => {
    if(this.props.formStatus === 'update'){
      callback();
      return;
    }
    if(value){
    this.props.dispatch({
      type: 'user/check',
      payload: { REQ_PARAM: { checkValue : value} },
      }).then(() => {
         const { exist } = this.props.user;
         if( exist ){
          callback('输入的用户名已存在！');
         }
          callback();
      })   
    }else{
      callback();
    }   
  };
  renderContent = () => {
    const { getFieldDecorator } = this.props.form;
    const { values, formStatus} = this.props;
    const flag = formStatus === 'update' ? true : false;
    let birthday = '';
    if (values.birthday) {
       birthday = moment(values.birthday);
    }
    return (
      <Form layout="inline">
        <FormItem label="用户名">
          {getFieldDecorator('loginName',{ 
            initialValue: values.loginName,
            rules: [
              { required: true, message: '请填写用户名!' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含数字、字母、下划线！' },
              { max: 16, message: '用户名长度最多16位！' },
              { min: 4, message: '用户名长度至少4位！' },
              { validator: this.checkUserName}
            ],
            validateTrigger: 'onBlur',     
          })(<Input placeholder="请输入" style={{ marginLeft: 30, width: 250 }} disabled={flag} />)}
        </FormItem>
        <FormItem label="中文名">
          {getFieldDecorator('userName', {
            initialValue: values.userName,
            rules: [
              { required: true, message: '请填写中文名!' },
              { pattern:  /^[^ ]+$/,  message: '不能带有空格！' }, 
            ],
          })(<Input placeholder="请输入中文名" style={{ marginLeft: 30, width: 250 }} />)}
        </FormItem>
        { !flag ? (
          <FormItem label="密码">
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: '请填写密码!' },
                { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含数字、字母！' },
                { max: 16, message: '密码长度最多16位！' },
                { min: 6, message: '密码长度至少6位！' },],
            })(
              <Input placeholder="请输入密码" style={{ marginLeft: 43, width: 250 }} type="password"/>
            )}
          </FormItem>
        ) : (null) }               
          { flag ? (
          <FormItem label="用户状态">
            {getFieldDecorator('status', {
              initialValue: values.status,
              rules: [{ required: true, message: '请选择用户状态!' }],
            })(
              <Select placeholder="请选择用户状态" style={{ marginLeft: 16, width: 250 }} allowClear>
                <Option value="0000">失效</Option>
                <Option value="0001">生效</Option> 
              </Select> 
            )}
          </FormItem>) : (null)
          }
          <FormItem label="电话号码">
            {getFieldDecorator('phone',{ initialValue: values.phone,
              rules: [{ pattern: /^[0-9_]+$/, message: '请输入正确的电话号码！' }],
            })(
              <Input placeholder="请输入电话号码" style={{ marginLeft: 27, width: 250 }} />
            )}
          </FormItem>
          <FormItem label="邮箱地址">
            {getFieldDecorator('email',{ initialValue: values.email,
              rules: [{ pattern: /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/, message: '请填写正确的邮箱格式！' }],            
          })(
              <Input placeholder="请输入邮箱地址" style={{ marginLeft: 27, width: 250 }} />
            )}
          </FormItem>
          <FormItem label="地址">
            {getFieldDecorator('address',{ initialValue: values.address })(
              <Input placeholder="请输入用户地址" style={{ marginLeft: 54, width: 250 }} />
            )}
          </FormItem>
          <FormItem label="生日">
            {getFieldDecorator('birthday',{ initialValue: birthday,})(
              <DatePicker placeholder="请输入用户生日" 
                style={{ marginLeft: 55, width: 250 }} 
                format = "YYYY-MM-DD"
                disabledDate={this.disabledEndDate} />
            )}
          </FormItem>
          <FormItem label="性别">
            {getFieldDecorator('sex',{ initialValue: values.sex,})(
            <Radio.Group style={{ marginLeft: 55, width: 250 }}>
               <Radio value="0001">男</Radio>
               <Radio value="0000">女</Radio>
            </Radio.Group>
            )}
          </FormItem>
      </Form>
    );
  };
  renderFooter = () => {
    const { handleModalVisible, formStatus } = this.props;
    let button = '';
    if (formStatus === 'create') {
      button = '添加';
    }; 
    if (formStatus === 'update') {
      button = '修改';
    };
    return [
      <Button key="cancel" onClick={() => handleModalVisible()}>
        取消
      </Button>,
      <Button type="primary" onClick={this.handleNext}>
        {button}
      </Button>,
    ];
  };
  handleAfterClose = () => {
    this.props.form.resetFields();
  };
  render() {
    const { handleModalVisible, formStatus } = this.props;
    let titleMessage = '';
    if (formStatus === 'create') {
      titleMessage = '添加用户';
    }; 
    if (formStatus === 'update') {
      titleMessage = '修改用户信息';
    }; 
    return (
      <Modal
        width={900}
        bodyStyle={{ padding: '32px 0px 48px 100px' }}
        destroyOnClose
        title={titleMessage}
        visible={true}
        footer={this.renderFooter()}
        afterClose={() => this.handleAfterClose()}
        onCancel={() => handleModalVisible()}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}

export default UpdateForm;

