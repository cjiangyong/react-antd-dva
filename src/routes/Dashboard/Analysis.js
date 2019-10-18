/* eslint-disable */
import { connect } from 'dva';
import React, { Component, Fragment } from 'react';
import { Form, Input, Button, Select, Table, message, Modal, Popconfirm, Card, Divider, Collapse, Row, Col, Icon } from 'antd';
import moment from 'moment';
import UpdateForm from './UserUpdateForm';

const { Option } = Select;
const FormItem = Form.Item;
const { Panel } = Collapse;
moment.locale('zh-cn');

let REQ_PARAM = {};
let REQ_PAGE = { pageNum: 1, pageSize: 10 };

@connect( state => ({
  user: state.user,
}))
@Form.create()
export default class Analysis extends Component {
  state = {
    modalVisible: false,
    selectedRowKeys: [],
    updateFormValues: {},
    formStatus: '',
  };

  componentDidMount() {
    this.doSearch();
  }

  doSearch = () => {
    this.props.dispatch({
      type: 'user/fetch',
      payload: { REQ_PARAM, REQ_PAGE },
    });
  }

  handleSelectRows = (selectedRowKeys) => { // 更改选定行
    this.setState({ selectedRowKeys });
  }

  handleDelete = (record) => {
    this.props.dispatch({
      type: 'user/remove',
      payload: { REQ_PARAM: { dels: [record.userId] } },
      callback: () => {
        message.success('删除成功');
        this.setState({
          selectedRowKeys: [],
        });
        this.doSearch();
      },
    });
  }

  deleteSelect = () => {
    const selectedRowKeys = [...this.state.selectedRowKeys];
    Modal.confirm.bind(this)({
      title: '确定要删除选择的用户吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'user/remove',
          payload: { REQ_PARAM: { dels: selectedRowKeys } },
          callback: () => {
            message.success('删除成功');
            this.setState({
              selectedRowKeys: [],
            });
           this.doSearch();
          },
        });
      },
    });
  }

  handleModalVisible = (formStatus,flag, record) => {
    this.setState({
      formStatus: formStatus || '',
      modalVisible: !!flag,
      updateFormValues: record || {},
    });
  };

  handleSearch = (e = null) => {
    if (e) e.preventDefault(); // 阻止表单的默认提交
    this.props.form.validateFields((err, values) => {
      if (err) return;
      REQ_PARAM = {...values};
      REQ_PAGE = { pageNum: 1, pageSize: 10 };
      this.doSearch();
    });
  };

  resetForm = () => {
    this.props.form.resetFields();
    REQ_PARAM = {};
    this.doSearch();
  }

  handleTableChange = (pagination, filtersArg, sort) => {
    REQ_PAGE = { pageNum: pagination.current, pageSize: pagination.pageSize };
    this.doSearch();
  }

  columns = [
    {
      title: '用户名',
      dataIndex: 'loginName',
      key: 'loginName',
    },
    {
      title: '中文名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      key: 'birthday',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
    },
    {
      title: '电话号码',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱地址',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '最后修改人',
      dataIndex: 'updateUser',
      key: 'updateUser',
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (record) => {
        const flag = record.status === '0000';
        const del = flag == true ? "" :
                    <Popconfirm title="确定删除？" okText="是" cancelText="否" onConfirm={() => this.handleDelete(record)}>
                      <a>删除</a>
                    </Popconfirm>;
        return (
          <Fragment>
            <a onClick={() => this.handleModalVisible("update",true, record)}>修改</a>
            <Divider type="vertical" />
            {del}
          </Fragment>
        );
      },
    },
  ];


  render() {
    const { data, page } = this.props.user;
    const { getFieldDecorator } = this.props.form;
    const { modalVisible, updateFormValues, selectedRowKeys, formStatus } = this.state;
    const rowSelection = {
      selectedRowKeys, //选中行的key数组
      onChange: this.handleSelectRows, // 选中行发生变化时的回调
      getCheckboxProps: record =>({
        disabled: record.status === '0000'
      })
    };
    const hasSelected = this.state.selectedRowKeys.length > 0; // 是否已选择行
    const pagination = { // 表格分页设置
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: () => `共${page.total}条`,
      ...page
    };
    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } };
    return (
      <div>
        <Collapse defaultActiveKey={['1']}>
          <Panel header="查询条件" key="1">
            <Form onSubmit={this.handleSearch}>
              <Row>
                <Col span={8}>
                  <FormItem label="用户名" {...formItemLayout}>
                    {getFieldDecorator('loginName')(<Input />)}
                  </FormItem>
                </Col>
                
                <Col span={8}>
                  <FormItem label="中文名" {...formItemLayout}>
                    {getFieldDecorator('userName')(<Input />)}
                  </FormItem>
                </Col>

                <Col span={8}>
                  <FormItem label="查询状态" {...formItemLayout}>
                    {getFieldDecorator('status')(
                      <Select allowClear>
                         <Option value="0000">失效</Option>
                         <Option value="0001">生效</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Button type="primary" icon="search" htmlType="submit">查询</Button>
                  <Button icon="reload" onClick={this.resetForm} style={{ marginLeft: 10 }}>重置</Button>
                </Col>
              </Row>

            </Form>
          </Panel>
        </Collapse>
                 
        <Card size="small" 
              title="用户管理" 
              style={{ marginTop: 20}}
              extra={
                 <div>
                  <a onClick={() => this.handleModalVisible("create",true)}><Icon type="plus" />添加</a>  
                  <Divider type="vertical" /> 
                  <a onClick={this.deleteSelect} disabled={!hasSelected} ><Icon type="delete" />批量删除</a>
                </div>  }>
          {modalVisible ? (<UpdateForm
              handleModalVisible={this.handleModalVisible}
              values={updateFormValues} 
              formStatus={formStatus}            
              doSearch={this.doSearch} />) : null }
          <Table
            bordered
            size="small"
            dataSource={data}
            columns={this.columns}
            rowKey="userId"
            rowSelection={rowSelection}
            onChange={this.handleTableChange}
            pagination={pagination}
            loading={this.props.loading}
            scroll={{ x: 1300}}
          />
        </Card>
      </div>
    );
  }
}
