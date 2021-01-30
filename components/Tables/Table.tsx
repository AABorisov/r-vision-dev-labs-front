import { Table as AntdTable } from "antd";

const Table: React.FC = ({ children }) => {
  return <AntdTable>
    {children}
  </AntdTable>;
};

export default Table;
