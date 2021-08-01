import React, { useCallback, useEffect, useState, useRef } from "react";
import { Dropdown, Button, PageHeader, Table, Input } from "antd";

import { EllipsisOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { selectListItems } from "@/redux/crud/selectors";

import uniqueId from "@/utils/uinqueId";
import inverseColor from "@/utils/inverseColor";

export default function DataTable({ config, DropDownRowMenu, AddNewItem }) {
  const inputColorRef = useRef(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableItemsList, setTableItemsList] = useState([]);
  const [coloredRow, setColoredRow] = useState([]);
  const [color, setColor] = useState("");
  const openColorBox = () => {
    inputColorRef.current.click();
  };
  const handelColorChange = (e) => {
    setColoredRow([...coloredRow, ...selectedRowKeys]);
    setColor(e.target.value);
    setSelectedRowKeys([]);
  };
  function MakeNewColor() {
    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        <Button onClick={openColorBox}>Make new Color</Button>
        <input
          type="color"
          ref={inputColorRef}
          onChange={handelColorChange}
          style={{
            opacity: 0,
            position: "absolute",
            left: 0,
            top: "10px",
            width: "100%",
          }}
        />
      </div>
    );
  }
  let { entity, dataTableColumns, dataTableTitle } = config;
  const newdataTableColumns = dataTableColumns.map((obj) => ({
    ...obj,
    render: (text, row) => {
      return {
        props: {
          style: {
            background: coloredRow.includes(row._id) ? color : "",
            color: coloredRow.includes(row._id) ? inverseColor(color) : "",
          },
        },
        children: text,
      };
    },
  }));
  dataTableColumns = [
    ...newdataTableColumns,
    {
      title: "",
      render: (row) => {
        return {
          props: {
            style: {
              background: coloredRow.includes(row._id) ? color : "",
              color: coloredRow.includes(row._id) ? inverseColor(color) : "",
            },
          },
          children: (
            <Dropdown overlay={DropDownRowMenu({ row })} trigger={["click"]}>
              <EllipsisOutlined
                style={{ cursor: "pointer", fontSize: "24px" }}
              />
            </Dropdown>
          ),
        };
      },
    },
  ];

  const { result: listResult, isLoading: listIsLoading } =
    useSelector(selectListItems);

  const { pagination, items } = listResult;

  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback((pagination) => {
    dispatch(crud.list(entity, pagination.current));
  }, []);

  useEffect(() => {
    dispatch(crud.list(entity));
  }, []);
  useEffect(() => {
    const listIds = items.map((x) => x._id);
    setTableItemsList(listIds);
  }, [items]);

  useEffect(() => {
    console.log(
      "🚀 ~ file: DataTable.jsx ~ line 98 ~ useEffect ~ tableItemsList",
      tableItemsList
    );
  }, [tableItemsList]);

  const [rowId, setRowId] = useState([]);
  const [firstRow, setFirstRow] = useState();
  const [lastRow, setLastRow] = useState();
  const [onSelect, setSelect] = useState(false);
  const onClickRow = (record, rowIndex) => {
    return {
      onClick: () => {
        // const exist = selectedRowKeys.includes(record._id);
        // if (exist) {
        //   let filtered = selectedRowKeys.filter(function (value) {
        //     return value != record._id;
        //   });
        //   setSelectedRowKeys(filtered);
        // } else {
        //   setSelectedRowKeys([...selectedRowKeys, record._id]);
        // }
      },
      onMouseDown: () => {
        setRowId([record._id]);
        setFirstRow(rowIndex);

        setSelectedRowKeys([record._id]);
        setSelect(true);
      },
      onMouseEnter: () => {
        if (onSelect) {
          setRowId([...rowId, record._id]);
          const selectedRange = tableItemsList.slice(firstRow, rowIndex + 1);
          setSelectedRowKeys(selectedRange);
        }
      },
      onMouseUp: () => {
        setLastRow(rowIndex);
        setSelect(false);

        // setSelectedRowKeys(rowId);
      },
    };
  };

  const handelColorRow = (checked, record, index, originNode) => {
    return {
      props: {
        style: {
          background: coloredRow.includes(record._id) ? color : "",
          color: coloredRow.includes(record._id) ? inverseColor(color) : "",
          // width: "0px",
          // minWidth: "0px",
          // padding: "0px",
        },
      },
      // children: originNode,
    };
  };

  const onSelectChange = (selectedKeys, selectedRows) => {
    setSelectedRowKeys(selectedKeys);
    console.log("selectedRowKeys changed: ", selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideSelectAll: true,
    columnWidth: 0,
    // checkStrictly: false,
    renderCell: handelColorRow,
    selectedRowKeys: selectedRowKeys,
  };

  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title={dataTableTitle}
        ghost={false}
        extra={[
          <MakeNewColor key={`${uniqueId()}`} config={config} />,
          <Button onClick={handelDataTableLoad} key={`${uniqueId()}`}>
            Refresh
          </Button>,
          <AddNewItem key={`${uniqueId()}`} config={config} />,
        ]}
        style={{
          padding: "20px 0px",
        }}
      ></PageHeader>
      <Table
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        rowSelection={rowSelection}
        onRow={onClickRow}
        ellipsis={true}
        // rowClassName={setRowClassName}
        size={"small"}
        dataSource={items}
        pagination={pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
      />
    </>
  );
}
