import React, { useState, useEffect } from "react";
import { Form, Input, Popconfirm, Table, Typography } from "antd";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Users = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  useEffect(() => {
    UserService.getUsers(page).then(
      (response) => {
        setData(response?.data?.data);
      },
      (error) => {
        const err =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setError(err);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, [page]);

  const onChangePagination = (page, pageSize) => {
    setEditingKey("");
    setPage(page);
  };

  const isEditing = (record) => record.id === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      email: "",
      first_name: "",
      last_name: "",
      ...record,
    });
    setEditingKey(record.id);
  };
  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        UserService.editUser(index, {
          ...item,
          ...row,
        }).then((response) => {
          newData.splice(index, 1, response.data);
          setData(newData);
          setEditingKey("");
        });
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      editable: true,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      editable: true,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      editable: true,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      render: (img, record) => (
        <img alt={record.first_name} src={img} width={40} height={40} />
      ),
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  if (!data) {
    return <h4>Loading</h4>;
  }

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: onChangePagination,
          defaultPageSize: 6,
          total: 12,
        }}
      />
    </Form>
  );
};
export default Users;
