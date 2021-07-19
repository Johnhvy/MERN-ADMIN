import React from "react";
import { Button, Form, Input } from "antd";

export default function CustomerForm({ isUpdateForm = false }) {
  return (
    <>
      <Form.Item
        label="company Name"
        name="company"
        rules={[
          {
            required: true,
            message: "Please input your company name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Surname"
        name="surname"
        rules={[
          {
            required: true,
            message: "Please input your surname!",
          },
        ]}
        style={{
          display: "inline-block",
          width: "calc(50%)",
          paddingRight: "5px",
        }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input your manager name!",
          },
        ]}
        style={{
          display: "inline-block",
          width: "calc(50%)",
          paddingLeft: "5px",
        }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone"
        rules={[
          {
            required: true,
            message: "Please input your phone!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            required: true,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <Input />
      </Form.Item>
    </>
  );
}
